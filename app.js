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
const fileUpload = require('express-fileupload');


let app = new express();

app.set('view-engine', 'ejs');
app.use(express.static('views'));
app.use("/images", express.static('upload'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(fileUpload());


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

app.post('/addAssignment/:id', (req, res) => {
    let id = req.params.id;
    let content = req.body.assignment;
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }

    db.query(`INSERT INTO assignments (userID, content) VALUES (?, ?)`, [id, content], (queryErr, queryRes, queryField) => {
        if(queryErr) {
            req.flash("info", queryErr);
            res.render('admin.ejs');
            return;
        }
        res.redirect('/admin');
    });
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

app.post('/updateUser/:id', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }

    try {
        let chosePicture = false;
        let picture = "";
        // Get the file that was set to our field named "image"
        if(req.files != null) {
            let {image} = req.files;
            
            // If no image submitted, exit
            if (image) {
                picture = image.name;
                // Move the uploaded image to our upload folder
                image.mv(__dirname + '/upload/' + image.name);
                chosePicture = true;
            }
        }
        
        let id = req.params.id;
        let uname = req.body.name;
        let fname = req.body.fname;
        let lname = req.body.lname;
        
        
        let regUname = "^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";

        if(!uname.match(regUname)) {
            req.flash("info", "Invalid username");
            res.render('register.ejs');
            return;
        }

        db.query("SELECT * FROM users WHERE id = ?", id, async (queryErr, queryRes, queryField) => {
            if(queryErr) {
                req.flash("info", queryErr);
                res.render('admin.ejs');
                return;
            }
            if(queryRes.length < 0) {
                req.flash("info", "User doesn't exists");
                res.render('admin.ejs');
                return;
            }
            let pic = chosePicture ? picture : queryRes[0].picture;
            if(fname == "") fname = queryRes[0].first;
            if(lname == "") lname = queryRes[0].last;
            if(uname == "") uname = queryRes[0].name;

            db.query("UPDATE users SET first = ?, last = ?, name = ?, picture = ? WHERE id = ?", [fname, lname, uname, pic, id], (queryErr, queryRes, queryField) => {
                if(queryErr) {
                    req.flash("info", queryErr.message);
                    res.render("admin.ejs");
                    return;
                }

                res.redirect('/admin');
            });
        })
    } catch (e) {
        console.log(e);
    }
});

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

    res.render('index.ejs', {name: req.session.fname, admin: req.session.isAdmin, picture: req.session.picture});
})

app.get('/getAssignments', (req, res) => {
    let userID = req.session.userID;
    db.query(`SELECT * FROM assignments WHERE userID = ?`, userID, (queryErr, queryRes, queryField) => {
        if(queryErr) {
            req.flash("info", queryErr);
            res.render('login.ejs');
            return;
        }
        res.send(queryRes);
        return;
    })
})

app.get('/finishedAssignment/:id', (req, res) => {
    let assignmentID = req.params.id;
    //console.log("Setting assignment " + assignmentID + " to finished");
    console.log(assignmentID);
    if(isNaN(assignmentID)) {
        req.flash("info", "id not a number");
        res.render('/');
        return;
    }

    db.query("UPDATE assignments SET status = 1 WHERE id = ?", assignmentID, (queryErr, queryRes, queryField) => {
        if(queryErr) {
            req.flash("info", queryErr.message);
            res.render('/');
            return;
        }

        res.redirect('/');
        return;
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
                req.session.fname = queryRes[i].first;
                req.session.lname = queryRes[i].last;
                req.session.userID = queryRes[i].id;
                req.session.isAdmin = queryRes[i].admin;
                req.session.picture = queryRes[i].picture;
                console.log(queryRes[i].picture);
                
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
        let chosePicture = false;
        let picture = "";
        // Get the file that was set to our field named "image"
        if(req.files != null) {
            let {image} = req.files;
            
            // If no image submitted, exit
            if (image) {
                picture = image.name;
                // Move the uploaded image to our upload folder
                image.mv(__dirname + '/upload/' + image.name);
                chosePicture = true;
            }
        }
        
        let uname = req.body.name;
        let pword = req.body.password;
        let fname = req.body.fname;
        let lname = req.body.lname;
        let pic = chosePicture ? picture : "tmp.png";

        // From <input> node
        
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
            db.query("INSERT INTO users (picture, first, last, name, pass) VALUES (?, ?, ?, ?, ?)", [pic, fname, lname, uname, hashedPword], (queryErr, queryRes, queryField) => {
                if(queryErr) {
                    req.flash("info", queryErr);
                    res.render('register.ejs');
                    return;
                }

                db.query("SELECT id FROM users WHERE name = ?", uname, (queryErr, queryRes, queryField) => {
                    if(queryErr) {
                        req.flash("info", queryErr);
                        res.render('register.ejs');
                        return;
                    }

                    if(queryRes[0].id == 1) {
                        db.query("UPDATE users SET admin = 1 WHERE id = 1", (queryErr, queryRes, queryField) => {
                            if(queryErr) {
                                req.flash("info", queryErr);
                                res.render('register.ejs');
                                return;
                            }
                        })
                    }
                    res.redirect('/login');
                })
                
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