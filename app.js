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
    /*if(!req.session.loggedin) {
        res.redirect('/login');
        return;
    }*/

    res.render('index.ejs', {name: req.session.username});
    console.log(req.session);
})

// login
app.get('/login', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('login.ejs');
})

app.post('/login', (request, response) => {
    let uname = request.body.name;
    let pword = request.body.password;
    
    if(uname == "" || pword == "") {
        response.redirect('/login');
        return;
    }

    db.query(`SELECT * FROM users WHERE name = '${uname}'`, async (err, res, fields) => {
        if(err) throw err;

        if(res.length <= 0) {
            response.redirect('/login');
            return;
        }

        for(let i = 0; i < res.length; i++) {
            if(res[i].name == uname && await bcrypt.compare(pword, res[i].pass)) {
                request.session.loggedin = true;
                request.session.username = res[i].name;
                response.redirect('/');
            } else {
                console.log("incorrect");
            }
        }
    });

});

// register
app.get('/register', (req, res) => {
    if(req.session.loggedin) {
        res.redirect('/');
        return;
    }

    res.render('register.ejs')
})

app.post('/register', async (request, response) => {
    try {
        console.log("a");
        let hashedPword = await bcrypt.hash(request.body.password, 10);
        console.log("b");
        db.query(`INSERT INTO users (name, pass) VALUES ('${request.body.name}', '${hashedPword}')`, (err, res, fields) => {
            if(err) console.log(err);
            response.redirect('/login');
            return;
        });
    } catch (e) {
        response.redirect('/register');
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