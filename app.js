let usePort = 3000;

// --

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let session = require('express-session');
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
    saveUninitialized: true
}));

// home 
app.get('/', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    res.render('index.ejs', {name: req.session.username});
})

app.get('/getAssignments', (req, res) => {
    let userID = req.session.userID;
    db.query(`SELECT * FROM assignments WHERE userID = ?`, userID, (queryErr, queryRes, queryField) => {
        res.send(res);
    })
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
    let regUname = "^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";
    let regPword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
    
    if(!uname.match(regUname)) {
        console.log("uname doesnt match requirements");
        res.send("Invalid username entered");
        return;
    }
    
    if(!pword.match(regPword)) {
        console.log("pword doesnt match requirements");
        res.send("Invalid password entered");
        return;
    }

    db.query("SELECT * FROM users WHERE name = ?", uname, async(queryErr, queryRes, queryFields) => {
        if(queryErr) {
            console.log(queryErr);
            res.send(queryErr);
            return;
        }

        if(queryRes.length <= 0) {
            res.redirect('/login');
            return;
        }

        for(let i = 0; i < queryRes.length; i++) {
            if(queryRes[i].name == uname && await bcrypt.compare(pword, queryRes[i].pass)) {
                req.session.loggedin = true;
                req.session.username = queryRes[i].name;
                req.session.userID = queryRes[i].id;
                
                res.redirect('/');
            } else {
                console.log("Incorrect Password");
                res.send("Incorrect password entered");
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

    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        let uname = req.body.name;
        let pword = req.body.password;
        let regUname = "^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";
        let regPword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";

        if(!uname.match(regUname)) {
            console.log("uname doesnt match");
            res.send("Username doesn't meet requirements");
            return;
        }
        
        if(!pword.match(regPword)) {
            console.log("pword doesnt match");
            res.send("Password doesn't meet requirements");
            return;
        }
        
        db.query("SELECT * FROM users WHERE name = ?", uname, async (queryErr, queryRes, queryField) => {
            if(queryErr) {
                console.log(queryErr);
                res.send(queryErr);
                return;
            }
            if(queryRes.length > 0) {
                console.log("User already exists!");
                res.send("User already exists");
                return;
            }
            
            let hashedPword = await bcrypt.hash(pword, 10);
            db.query("INSERT INTO users (name, pass) VALUES (?, ?)", [uname, hashedPword], (queryErr, queryRes, queryField) => {
                if(queryErr) {
                    console.log(queryErr);
                    res.send(queryErr);
                    return;
                }

                res.redirect('/login');
                return;
            })
        })
    } catch (e) {
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