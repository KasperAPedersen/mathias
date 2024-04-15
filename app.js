let usePort = 3000;

// --

import 'dotenv/config.js';

import session from 'express-session';

import flash from 'express-flash';

import * as db from './database.js';

import * as bcrypt from 'bcrypt';

import express from 'express';

import fileUpload from 'express-fileupload';

import path from 'path';
import { fileURLToPath } from 'url';

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);


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
    /*if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }*/

    res.render('admin.ejs');
})

app.get('/getAllAssignments', async (req, res) => {
    let queryRes = await db.get("SELECT * FROM assignments");
    res.send(queryRes[0]);
    return;
})

app.post('/addAssignmentToUser/:id', async (req, res) => {
    let id = req.params.id;
    let assignment = req.body.assignment;

    let addAssignmentQuery = await db.set("INSERT INTO tasks (userID, taskID, status) VALUES (?, ?, ?)", [id, assignment, 0]);
    console.log(addAssignmentQuery);
    res.redirect('/admin');
    return;
})

app.post('/addAssignment', async (req, res) => {
    /*if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }*/

    try {
        let chosePicture = false;
        let picture = "";
        if(req.files != null) {
            let {image} = req.files;
            
            if (image) {
                picture = image.name;
                image.mv(__dirname + '/upload/' + image.name);
                chosePicture = true;
            }
        }
        
        let title = req.body.title;
        let content = req.body.assignment;
        let pic = chosePicture ? picture : "tmp.png";

        let addAssignmentQuery = await db.set("INSERT INTO assignments (title, picture, content) VALUES (?, ?, ?)", [title, pic, content]);
        if(addAssignmentQuery[0].affectedRows <= 0 ){
            req.flash("info", "Something went wrong");
            res.render('admin.ejs');
            return;
        }

        res.redirect('/admin');
        return;
    } catch (e) {
        req.flash("info", "Something went wrong");
        res.render('admin.ejs');
        return;
    }
    
})

/*app.post('/addAssignment/:id', async (req, res) => {
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

    let addAssignmentQuery = await db.set("INSERT INTO assignments (userID, content) VALUES (?, ?)", [id, content]);
    if(addAssignmentQuery[0].affectedRows <= 0) {
        req.flash("info", "Something went wrong");
        res.render('admin.ejs');
        return;
    }
    res.redirect('/admin');
})*/

app.get('/getAllUsers', async (req, res) => {
    /*if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    if(!req.session.isAdmin) {
        res.redirect('/');
        return;
    }*/

    let getAllUsersQuery = await db.get("SELECT * FROM users", []);
    res.send(getAllUsersQuery[0]);
    return;
})

app.post('/updateUser/:id', async (req, res) => {
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
        if(req.files != null) {
            let {image} = req.files;
            
            if (image) {
                picture = image.name;
                image.mv(__dirname + '/upload/' + image.name);
                chosePicture = true;
            }
        }
        
        let id = req.params.id;
        let uname = req.body.name;
        let fname = req.body.fname;
        let lname = req.body.lname;
        
        
        let regUname = "^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$";

        if(!uname.match(regUname) && uname != "") {
            req.flash("info", "Invalid username");
            res.render('admin.ejs');
            return;
        }

        let getUserQuery = await db.get("SELECT * FROM users WHERE id = ?", [id]);
        if(getUserQuery[0].length <= 0){
            req.flash("info", "User doesn't exists");
            res.render('admin.ejs');
            return;
        }

        let pic = chosePicture ? picture : getUserQuery[0][0].picture;
        if(fname == "") fname = getUserQuery[0][0].first;
        if(lname == "") lname = getUserQuery[0][0].last;
        if(uname == "") uname = getUserQuery[0][0].name;

        let updateUserQuery = await db.set("UPDATE users SET first = ?, last = ?, name = ?, picture = ? WHERE id = ?", [fname, lname, uname, pic, id]);
        if(updateUserQuery[0].affectedRows <= 0) {
            req.flash("info", "Something went wrong");
            res.render("admin.ejs");
            return;
        }

        res.redirect('/admin');
    } catch (e) {
        console.log(e);
    }
});

app.get('/deleteUser/:id', async (req, res) => {
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
        req.flash("info", "Invalid ID");
        res.render('/');
        return;
    }

    let deleteUserQuery = await db.set("DELETE FROM users WHERE id = ?", [userID]);
    if(deleteUserQuery[0].affectedRows <= 0) {
        req.flash("info", "something went wrong");
        res.render('/');
        return;
    }

    /*db.query("DELETE FROM users WHERE id = ?", userID, (queryErr, queryRes, queryField) => {
        if(queryErr) {
            console.log(queryErr);
            res.redirect('/');
            return;
        }
    })*/

    res.redirect('/admin');
})

// home 
app.get('/', (req, res) => {
    if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    res.render('index.ejs', {name: req.session.fname, admin: req.session.isAdmin, picture: req.session.picture});
})

app.get('/getAssignments', async (req, res) => {
    let userID = req.session.userID;

    let getAssignmentsQuery = await db.get("SELECT * FROM assignments WHERE userID = ?", [userID]);
    res.send(getAssignmentsQuery[0]);
    return;
})

app.get('/finishedAssignment/:id', async (req, res) => {
    let assignmentID = req.params.id;

    if(isNaN(assignmentID)) {
        req.flash("info", "id not a number");
        res.render('/');
        return;
    }

    let updateAssignmentQuery = await db.set("UPDATE assignments SET status = 1 WHERE id = ?", [assignmentID]);
    if(updateAssignmentQuery[0].affectedRows <= 0) {
        req.flash("info", "Something went wrong");
        res.render('/');
        return;
    }

    res.redirect('/');
    return;
})

app.get('/undoAssignment/:id', async (req, res) => {
    let assignmentID = req.params.id;

    if(isNaN(assignmentID)) {
        req.flash("info", "id not a number");
        res.render('/');
        return;
    }

    let updateAssignmentQuery = await db.set("UPDATE assignments SET status = 0 WHERE id = ?", [assignmentID]);
    if(updateAssignmentQuery[0].affectedRows <= 0) {
        req.flash("info", "Something went wrong");
        res.render('/');
        return;
    }
    res.redirect('/');
    return;
})

// login
app.get('/login', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('login.ejs');
    return;
})

app.post('/login', async (req, res) => {
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

    let getUserQuery = await db.get("SELECT * FROM users WHERE name = ?", [uname]);

    if(getUserQuery[0].length <= 0) {
        req.flash("info", "User doesn't exist");
        res.render('login.ejs');
        return;
    }
    
    if(getUserQuery[0][0].name == uname && await bcrypt.compare(pword, getUserQuery[0][0].pass)) {
        req.session.loggedin = true;
        req.session.username = getUserQuery[0][0].name;
        req.session.fname = getUserQuery[0][0].first;
        req.session.lname = getUserQuery[0][0].last;
        req.session.userID = getUserQuery[0][0].id;
        req.session.isAdmin = getUserQuery[0][0].admin;
        req.session.picture = getUserQuery[0][0].picture;
        res.redirect('/');
    } else {
        req.flash("info", "Incorrect password");
        res.render('login.ejs');
        return;
    }
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
        if(req.files != null) {
            let {image} = req.files;
            
            if (image) {
                picture = image.name;
                image.mv(__dirname + '/upload/' + image.name);
                chosePicture = true;
            }
        }
        
        let uname = req.body.name;
        let pword = req.body.password;
        let fname = req.body.fname;
        let lname = req.body.lname;
        let pic = chosePicture ? picture : "tmp.png";

        
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
                
        let userQueryRes = await db.get("SELECT * FROM users WHERE name = ?", [uname]);
        
        if(userQueryRes[0].length > 0) {
            req.flash("info", "User already exists");
            res.render('register.ejs');
            return;
        }

        let hashedPword = await bcrypt.hash(pword, 10);
        let registerUserQuery = await db.set("INSERT INTO users (picture, first, last, name, pass) VALUES (?, ?, ?, ?, ?)", [pic, fname, lname, uname, hashedPword]);
        if(registerUserQuery[0].affectedRows <= 0) {
            req.flash("info", "Something went wrong");
            res.render('register.ejs');
            return;
        }

        let getUserQuery = await db.get("SELECT id FROM users WHERE name = ?", [uname]);
        if(getUserQuery[0][0].id == 1) {
            await db.set("UPDATE users SET admin = 1 WHERE id = 1");
        }

        res.redirect('/login');
    } catch (e) {
        req.flash("info", e);
        res.render('register.ejs');
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