import LocalStrategy from 'passport-local';
import {User} from './database.js';
import passworder from './passworder.js';

function passportConfigure(passport){

    // Verifikacija potrebna lokalnoj strategiji
    const verifyCallback = function(username, password, done){

        // Ispitivanje baze podataka
        User.findOne({username: username})
            .then(user => {

                if(!user){
                    return done(null, false, {message: 'Wrong username.'});
                }

                const passwordValid = passworder.checkPassword(password, user.hash, user.salt);

                if(passwordValid){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password.'});
                }
            })
            .catch( err => done(err));
    }

    // Odabir strategije
    const selectedStrategy = new LocalStrategy(verifyCallback);

    // Mountanje strategije na passport
    passport.use(selectedStrategy);

    // Serijalizacija u req.session.passport.user objekt
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // Deserijalizacija u kompletni user objekt
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => done(err));
    });
};

export default passportConfigure;