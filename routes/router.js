import express from 'express';
import passport from 'passport';
import middleware from './middleware.js'

const router  = express.Router();

router.get('/', middleware.checkAuthenticated, (req, res) =>{
    res.render('homepage', {user: req.user, stylesheet: "homepage.css", scripts: ["homepage.js"]});
})

router.get('/login', middleware.checkLoggedIn, (req, res) => {
    res.render('login', {stylesheet: 'login.css', scripts: ["login.js", "messageHandler.js"]});
})

router.get('/register', (req, res) => {
    res.render('register', {stylesheet: 'register.css', scripts: ["register.js", "messageHandler.js"]});
})

router.get('/checkspotifytoken', middleware.findTokenInDatabase, (req, res) => {
    const spotifyToken = req.body.spotifyToken;
    console.log('Spotify token found in database: ', spotifyToken);
    res.send(spotifyToken);
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

router.post('/checkspotifytoken', middleware.persistTokenToDatabase, (req, res) => {
    // Ako req.body sadrži persistetToDb: 'Success'
    res.send({message: 'Success'});

});

export default router;