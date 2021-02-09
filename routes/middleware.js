import {User, Token} from '../database.js';
import passworder from '../passworder.js';


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
                        if(passworder.checkPassword(password, user.hash, user.salt)){
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
            .then(tokenObject => {
                req.body.tokenObject = tokenObject;
                next();
            })
            .catch(err => {
                console.log(`An error has occured while querying the database for a token.\n${err}`);
                next();
            });    
    };
    
    function persistTokenToDatabase(req, res, next){
        
        // Provjeri postoji li token u bazi podataka (slučaj obnavljanja tokena)
        Token.findOne()
            .then(tokenObject => {
                if(!tokenObject){
                    const result = tryToPersist(req.body.tokenObject);
                    req.body.isPersistedToDatabase = result;
                    next();

                } else {
                    // Izbriši nađeni token iz baze podataka
                    Token.deleteOne({apiName: 'Spotify'})
                        .then(response => {
                            console.log(response);
                            console.log(`Expired token successfully deleted from database`);
                            const result = tryToPersist(req.body.tokenObject);
                            req.body.isPersistedToDatabase = result;
                            next();
                        })
                        .catch(err => {
                            console.log(`An error has occured while deleting the token from the database.\n${err}`);
                            req.body.isPersistedToDatabase = false;
                            next();
                        });
                };
            })
            .catch(err => {
                console.log(`An error has occured while storing the token to the database.\n${err}`);
                next();
            }); 
    };

    async function tryToPersist(tokenObject){

        const newToken = new Token({
            apiName: tokenObject.apiName,
            token: tokenObject.token,
            timestamp: tokenObject.timestamp
        });

        let result;

        newToken.save()
            .then(token => {
                console.log(`New token successfully stored to the database\n${token}`);
                result = true;
                return result;
            })
            .catch(err => {
                console.log(`An error has occured while storing the token to the database.\n${err}`);
                result = false;
                return result;
            });
    };

    async function updateFavouritesInDatabase(req, res, next){
        const username = req.user.username;
        const action = req.body.query.action;

        if(action === 'push'){
        const favourite = req.body.query.trackData;
            User.updateOne({username: username}, {$push: {favourites: favourite}})
                .then(() => {
                    console.log('Favourite successfully pushed to the database.');
                    req.favouriteUpdated = true;
                    next();
                })
                .catch(err => {
                    console.log(err);
                    req.favouriteUpdated = false;
                    next();
                });
                
        } else if (action === 'pull'){
            const trackId = req.body.query.trackId;
            User.updateOne({username: username}, {$pull: {favourites: {trackId: trackId}}})
                .then(() => {
                    console.log('Favourite successfully pulled from the database.');
                    req.favouriteUpdated = true;
                    next();
                })
                .catch(err => {
                    console.log(err);
                    req.favouriteUpdated = false;
                    next();
                });

        } else {
            console.log('Invalid action specified.');
            req.favouriteUpdated = false;
            next();
        };

    };
    
    async function getUserFavourites(req, res, next){
        const username = req.user.username;
        User.findOne({username: username})
            .then(user => {
                console.log(`User's favourites successfully retrieved from the database: \n${user.favourites}`);
                req.body.userFavourites = user.favourites;
                next();
            })
            .catch(err => {
                console.log(`An error has occurred while trying to retrieve user's favourites from the database.\n${err}`);
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
       persistTokenToDatabase,
       updateFavouritesInDatabase,
       getUserFavourites
    };
})();

export default middleware;
