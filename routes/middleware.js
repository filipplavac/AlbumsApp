import {User, Token} from '../database.js';
import passworder from '../passworder.js';

// Funkcija middleware napravljena je prema revealing module pattern-u
const middleware = (function(){
    
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
            res.render('register', {title: 'Register', message: req.flash('error', errors), stylesheet: 'register.css', scripts: ["register.js", "messageHandler.js"]});
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
                        if(passworder.checkPassword(password, user.hash, user.salt)){
                            errors.push('Chosen password is already in use, please try again.')
                        };
                    });
                    
                    if(errors.length > 0){
                        res.render('register', {title: 'Register', message: req.flash('error', errors), stylesheet: 'register.css', scripts: ["register.js", "messageHandler.js"]});
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
        const saltAndHash = passworder.generatePassword(req.body.password),
        salt = saltAndHash.salt,
        hash = saltAndHash.hash;
        
        const newUser = new User({
            username: req.body.username,
            hash: hash,
            salt: salt
        });
        
        newUser.save()
        .then(user => {
            console.log(`\nUser successfully stored to the database`);
            next();
        })
        .catch(err => {
            console.log(`\nAn error has occured while storing user to the database\n\n${err}`);
        });
    };
    
    function findTokenInDatabase(req, res, next){

        Token.findOne()
            .then(token => {
                req.body.spotifyToken = token;
                next();
            })
            .catch(err => {
                console.log(`An error has occured while storing the token to the database.\n${err}`);
                next();
            });    
    };
    
    function persistTokenToDatabase(req, res, next){

        const spotifyToken = req.body.spotifyToken;
        
        // Provjeri postoji li token u bazi podataka (slučaj obnavljanja tokena)
        Token.findOne()
            .then(token => {
                if(!token){
                    // Izradi token
                    const newToken = new Token({
                        apiName: spotifyToken.apiName,
                        token: spotifyToken.token,
                        timestamp: spotifyToken.timestamp
                    });

                    // Spremi token u bazu podataka
                    newToken.save()
                        .then(token => {
                            console.log(`New token successfully stored to the database\n${token}`);

                            // Property putem kojeg zadnji middleware odabire svoj response klijentu
                            req.body.persistedToDatabase = true;

                            next();
                        })
                        .catch(err => {
                            console.log(`An error has occured while storing the token to the database.\n${err}`);
                            req.body.persistedToDatabase = false;
                            next();
                        });

                } else {
                    // Izbriši nađeni token iz baze podataka
                    Token.deleteOne(token)
                        .then(response => {
                            console.log(`Expired token successfully deleted from database`);

                            const newToken = new Token({
                                name: spotifyToken.name,
                                token: spotifyToken.token,
                                timestamp: spotifyToken.timestamp
                            });

                            newToken.save()
                                .then(token => {
                                    console.log(`New token successfully stored to the database\n${token}`);
                                    req.body.persistedToDatabase = true;
                                    next();
                                })
                                .catch(err => {
                                    console.log(`An error has occured while storing the token to the database.\n${err}`);
                                    req.body.persistedToDatabase = false;
                                    next();
                                });

                        })
                        .catch(err => {
                            console.log(`An error has occured while deleting the token from the database.\n${err}`);
                            req.body.persistedToDatabase = false;
                            next();
                        });
                };
            })
            .catch(err => {
                console.log(`An error has occured while storing the token to the database.\n${err}`);
                next();
            }); 
    };
    
    return {
        checkAuthenticated,
        checkLoggedIn,
        checkFieldsFilled,
        checkRegistration,
        saveUserToDatabase,
        findTokenInDatabase,
        persistTokenToDatabase
    };
})();

export default middleware;