import express from 'express';
import passport from 'passport';
import middleware from './middleware.js'

const router  = express.Router();

router.get('/', middleware.checkAuthenticated, (req, res) =>{
    res.render('homepage', {user: req.user, stylesheet: "homepage.css"});
})

router.get('/login', middleware.checkLoggedIn, (req, res) => {
    res.render('login', {stylesheet: 'login.css'});
})

router.get('/register', (req, res) => {
    res.render('register', {stylesheet: 'register.css'});
})

router.get('/token', middleware.findTokenInDatabase, (req, res) => {
    const tokenObject = req.body.tokenObject;
    console.log('\nSpotify token found in database: ', tokenObject);
    res.send(JSON.stringify(tokenObject));
});

router.get('/favourites', middleware.getUserFavourites, (req, res) => {
    const userFavourites = req.body.userFavourites;
    res.send(JSON.stringify(userFavourites));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/login', middleware.checkFieldsFilled, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/register', middleware.checkRegistration, middleware.saveUserToDatabase, (req, res) => {
    req.flash('success','Account successfully created, you can now Log In.');
    res.redirect('/login');
});

router.post('/token', middleware.persistTokenToDatabase, (req, res) => {
    // Ako je token uspješno pohranjen u bazu podataka
    if(req.body.isPersistedToDatabase){
        // Property od response objekta putem kojeg tokenChecker zna da je sigurno proslijediti token
        res.send({isPersistedToDatabase: true});
    } else {
        res.send({isPersistedToDatabase: false});
    }
});

router.post('/favourites', middleware.updateFavouritesInDatabase, (req, res) => {
    res.send({isUpdated: req.favouriteUpdated});
});

export default router;