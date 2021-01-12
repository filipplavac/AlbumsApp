import {User} from '../database.js';
import Passworder from '../Passworder.js';


const Middleware = (function(){

    function checkAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect('/login');
        }
    };
    
    function checkLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/');
        } else {
            next();
        }
    };
    
    function checkFieldsFilled(req, res, next){
        let errors = [];
        
        const {username,password} = req.body;
        
        if(!username || !password){
            errors.push('Please enter all fields');
            res.render('login', {message: req.flash('error', errors)});
        } else {
            next();
        }
    };
    
    function checkRegistration(req, res, next){
        let errors = [];
        
        const {username,password} = req.body;
        
        if(!username || !password){
            errors.push('Please enter all fields.')
        }
        
        if(username && password && password.length < 6){
            errors.push('Password must have at least 6 characters');
        }
        
        if(errors.length > 0){
            res.render('register', {title: 'Register', message: req.flash('error', errors)});
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
                        if(Passworder.checkPassword(password, user.hash, user.salt)){
                            errors.push('Chosen password is already in use, please try again.')
                        };
                    });
                    
                    if(errors.length > 0){
                        res.render('register', {title: 'Register', message: req.flash('error', errors)});
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
            
        };  
    };
    
    function saveUserToDatabase(req, res, next){
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
    
    return {
       checkAuthenticated,
       checkLoggedIn,
       checkFieldsFilled,
       checkRegistration,
       saveUserToDatabase
    };
})();

export default Middleware;