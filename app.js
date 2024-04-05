let usePort = 3000;
let users = [{id: "1", name: "swp", password: "$2b$10$A1f83ckkwZQPWoKepJUCa.zK40zo5gRP8ndGxLJJ/p56SZR132mH2"}];

// --
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let methodOverride = require('method-override');
let flash = require('express-flash');
let session = require('express-session');
let passport = require('passport');
let initializePassport = require('./passport-config.js');
let bcrypt = require('bcrypt');
let express = require('express');

let app = new express();
initializePassport(passport,
    name => users.find(user => user.name === name),
    id => users.find(user => user.id === id)
);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name});
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        let hashedPword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            password: hashedPword
        })
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
})

app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.listen(usePort, (err) => {
    console.log(err ? err : `Listening on port ${usePort}`);
})