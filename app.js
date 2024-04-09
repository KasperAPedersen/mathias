let usePort = 3000;

// --

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let session = require('express-session');
let flash = require('express-flash');
let db = require('./database.js');
let bcrypt = require('bcrypt');
let express = require('express');


let app = new express();

app.set('view-engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());


// Admin
app.get('/admin', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }

    res.render('admin.ejs');
})

app.get('/getAllUsers', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }

    db.query(`SELECT * FROM users`, (queryErr, queryRes, queryField) => {
        res.send(queryRes);
    })
})

app.get('/deleteUser/:id', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }

    let userID = req.params.id;
    
    if(isNaN(userID)) {
        console.log("ID is not a number");
        res.send("Invalid ID entered");
        return;
    }

    db.query("DELETE FROM users WHERE id = ?", userID, (queryErr, queryRes, queryField) => {
        if(queryErr) {
            console.log(queryErr);
            res.redirect('/');
            return;
        }
    })

    res.redirect('/admin');
})

// home 
app.get('/', (req, res) => {
    if(!req.session.loggedin) {
        console.log(1);
        res.redirect('/login');
        return;
    }

    res.render('index.ejs', {name: req.session.username, admin: req.session.isAdmin, picture: req.session.picture});
})

app.get('/getAssignments', (req, res) => {
    let userID = req.session.userID;
    db.query(`SELECT * FROM assignments WHERE userID = ?`, userID, (queryErr, queryRes, queryField) => {
        res.send(queryRes);
    })
})

app.get('/finishedAssignment/:id', (req, res) => {
    let assignmentID = req.params.id;
    //console.log("Setting assignment " + assignmentID + " to finished");
    console.log(assignmentID);
    if(isNaN(assignmentID)) {
        console.log("Assignment id is not a number");
        res.redirect('/');
        return;
    }

    db.query("UPDATE assignments SET status = 1 WHERE id = ?", assignmentID, (queryErr, queryRes, queryField) => {
        if(queryErr) console.log(queryErr);

        res.redirect('/');
    })
    res.send();

})

// login
app.get('/login', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('login.ejs');
})

app.post('/login', (req, res) => {
    let uname = req.body.name;
    let pword = req.body.password;
    let regUname = "^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";
    let regPword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}$";
    
    if(!uname.match(regUname)) {
        req.flash("info", "Invalid username");
        res.render('login.ejs');
        return;
    }
    
    if(!pword.match(regPword)) {
        req.flash("info", "Invalid password");
        res.render('login.ejs');
        return;
    }

    db.query("SELECT * FROM users WHERE name = ?", uname, async(queryErr, queryRes, queryFields) => {
        if(queryErr) {
            req.flash("info", queryErr);
            res.render('login.ejs');
            return;
        }

        if(queryRes.length <= 0) {
            req.flash("info", "User doesn't exist");
            res.render('login.ejs');
            return;
        }

        for(let i = 0; i < queryRes.length; i++) {
            if(queryRes[i].name == uname && await bcrypt.compare(pword, queryRes[i].pass)) {
                req.session.loggedin = true;
                req.session.username = queryRes[i].name;
                req.session.userID = queryRes[i].id;
                req.session.isAdmin = queryRes[i].admin;
                req.session.picture = queryRes[i].picture;
                
                res.redirect('/');
            } else {
                req.flash("info", "Incorrect password");
                res.render('login.ejs');
                return;
            }
        }
    })
});

// register
app.get('/register', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('register.ejs');
})

app.post('/register', async (req, res) => {
    try {
        let uname = req.body.name;
        let pword = req.body.password;
        let regUname = "^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";
        let regPword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}$";

        if(!uname.match(regUname)) {
            req.flash("info", "Invalid username");
            res.render('register.ejs');
            return;
        }
        
        if(!pword.match(regPword)) {
            req.flash("info", "Invalid password");
            res.render('register.ejs');
            return;
        }
        
        db.query("SELECT * FROM users WHERE name = ?", uname, async (queryErr, queryRes, queryField) => {
            if(queryErr) {
                req.flash("info", queryErr);
                res.render('register.ejs');
                return;
            }
            if(queryRes.length > 0) {
                req.flash("info", "User already exists");
                res.render('register.ejs');
                return;
            }
            
            let hashedPword = await bcrypt.hash(pword, 10);
            db.query("INSERT INTO users (name, pass) VALUES (?, ?)", [uname, hashedPword], (queryErr, queryRes, queryField) => {
                if(queryErr) {
                    req.flash("info", queryErr);
                    res.render('register.ejs');
                    return;
                }

                res.redirect('/login');
                return;
            })
        })
    } catch (e) {
        req.flash("info", e);
        res.render('register.ejs');
        res.redirect('/register');
    }
})

// Logout
app.get('/logout', (req, res) => {
    if(req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect('/login');
})


app.listen(usePort, (err) => {
    console.log(err ? err : `Listening on port ${usePort}`);
})