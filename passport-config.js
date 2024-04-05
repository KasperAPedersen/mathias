const { authenticate } = require('passport');
let bcrypt = require('bcrypt');

let LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByName, getUserById) {
    let authenticateUser = async (name, password, done) => {
        let user = getUserByName(name);
        if(user == null) return done(null, false, { message: "No user found"});

        try {
            if( await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect"});
            }
        } catch (err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'name' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;