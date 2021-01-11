import {User} from '../database.js';
import {generatePassword, checkPassword} from '../passwordHandler.js';

const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/login');
    }
}

const checkFieldsFilled = (req, res, next) => {

    let errors = [];

    const {username,password} = req.body;

    if(!username || !password){
        errors.push('Please enter all fields');
        res.render('login', {message: req.flash('error', errors)});
    } else {
        next();
    }

};

const checkRegistration = (req, res, next) => {

    let errors = [];

    const {username,password} = req.body;

    if(!username || !password){
        errors.push('Please enter all fields.')
    }

    if(username && password && password.length < 6){
        errors.push('Password must have at least 6 characters');
    }

    if(errors.length > 0){
        res.render('register', {message: req.flash('error', errors)});
        console.log(req.session.flash);
    } else {
        // Provjeri postoji li odabrano korisničko ime u bazi podataka
        User.findOne({username: username})
            .then(user => {
                if(user){
                    errors.push('User with that username already exists, please try again.');
                }

                // Provjeri postoji li odabrana lozinka u bazi podataka
                User.find()
                    .then(users => {
                        users.forEach(user => {
                            if(checkPassword(password, user.hash, user.salt)){
                                errors.push('Chosen password is already in use, please try again.')
                            };
                        });

                        if(errors.length > 0){
                            res.render('register', {message: req.flash('error', errors)});
                        } else {
                            next();
                        };
                    })
                    .catch(err => {
                        console.log(`\nAn error has occured while checking if password is available.\n\n${err}`);
                        res.render('register');
                    });
            })
            .catch(err => {
                console.log(`\nAn error has occured while checking the username\n\n${err}`);
                res.render('register');
            });

    }
};

const saveUserToDatabase = (req, res, next) =>{
     const saltAndHash = generatePassword(req.body.password),
                        salt = saltAndHash.salt,
                        hash = saltAndHash.hash;

                    const newUser = new User({
                        username: req.body.username,
                        hash: hash,
                        salt: salt
                    });

                    newUser.save()
                        .then(user => {
                            console.log(`\nUser successfully stored to the database\n\n${user}`);
                            next();
                        })
                        .catch(err => {
                            console.log(`\nAn error has occured while storing user to the database\n\n${err}`);
                        });
};

export {checkAuthenticated, checkRegistration, checkFieldsFilled, saveUserToDatabase };