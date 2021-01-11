import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

import express from 'express';
import ejsLayouts from 'express-ejs-layouts';
import router from './routes/router.js'
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import passportConfigure from './passport-config.js';

// Učitaj environment varijable
dotenv.config();

// Konstruiraj __filename i __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicijaliziraj instancu express aplikacije
const app = express();

// Definiraj port
const PORT = process.env.PORT || 3000;

// Definiraj static foldere
const staticDirs = ['public/js'];
staticDirs.forEach(dir => {
    app.use(express.static(path.join(__dirname, dir)));
});

// Postavke za template engine
app.set('views', [__dirname + '/views']);
app.use(ejsLayouts);
app.set('view engine', 'ejs');

// Body parsing i session middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false 
}));

// Konfiguriraj Passport
passportConfigure(passport);

/* Provjeravaj ispravnost req.session.passport.user objekta i 
deserijaliziraj usera po potrebi*/
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Rute
app.use(router);

// Pokreni server
app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}`)
});

export default __dirname;