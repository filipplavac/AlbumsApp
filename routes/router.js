import express from 'express';
import passport from 'passport';
import {checkAuthenticated, checkLoggedIn, checkFieldsFilled, checkRegistration, saveUserToDatabase} from './routerMiddleware.js';

const router  = express.Router();

router.get('/', checkAuthenticated, (req, res) =>{
    res.render('homepage', {title: 'AlbumsApp', user: req.user});
})

router.get('/login', checkLoggedIn, (req, res) => {
    res.render('login', {title:'Login'});
})

router.get('/register', (req, res) => {
    res.render('register', {title:'Register'});
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/login', checkFieldsFilled, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}));

router.post('/register', checkRegistration, saveUserToDatabase, (req, res) => {
    req.flash('success','Account successfully created, you can now Log In.');
    res.redirect('/login');
});

export default router;