import express from 'express';
import passport from 'passport';
import Middleware from './Middleware.js'

const router  = express.Router();

router.get('/', Middleware.checkAuthenticated, (req, res) =>{
    res.render('homepage', {user: req.user});
})

router.get('/login', Middleware.checkLoggedIn, (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/login', Middleware.checkFieldsFilled, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/register', Middleware.checkRegistration, Middleware.saveUserToDatabase, (req, res) => {
    req.flash('success','Account successfully created, you can now Log In.');
    res.redirect('/login');
});

export default router;