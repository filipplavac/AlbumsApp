import Artist from './artist.js';
import tokenMachine from './tokenMachine.js';
import tokenChecker from './tokenChecker.js';
import {base64clientIdAndSecret, authenticationUrl} from './credentials.js';
// import ui from './ui.js';

// Instancijranje Artist objekta prema korisnikovom unosu 
const artist = new Artist('Red Hot Chilli Peppers');

// Provjera access tokena za Spotify Web API
(async function loadHomepage(){
    const spotifyToken = await tokenChecker.checkSpotifyToken();
    // const youtubeToken = await tokenChecker.checkYoutubeToken();

    // Renderiraj container-artist 
    (function renderArtistContainer(){
        if(typeof spotifyToken !== 'undefined'){
            console.log('Successfully reached artist container!');
        }
            
        // artist.getInfo()
        //     .then(artistInfo => {
        //         console.log(artistInfo);
        //         // ui.render(artistInfo);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    })();

    // (function renderUserContainer(){

    // })();

})()

// // Provjera access tokena za Spotify Web API
// (async function checkSpotifyToken(){
    
//     // Dohvati Spotify token
//     let spotifyToken = await tokenMachine.fetchToken('http://localhost:3000/checkspotifytoken');
//     console.log(`Spotify token recieved from server: ${spotifyToken}`);
    
//     if(!spotifyToken) {
        
//         try {
//             // Napravi token 
//             spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);

//             // Spremi token u bazu podataka
//             const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
        
//             if(dbResponse.message === 'Success'){
//                 // Renderiraj artist container
//                 renderArtistContainer();
//             };   

//         } catch(err) {
//             console.log(err);
//         }
        
        
//     } else {

//         // Provjeri ispravnost tokena
//         const valid = await tokenMachine.checkTokenValid(spotifyToken.timeStamp);
        
//         if(valid){
//             renderArtistContainer();
            
//         } else {
//             try {
//                 spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);
    
//                 const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
            
//                 if(dbResponse.message === 'Success'){
//                     renderArtistContainer();
//                 };   
    
//             } catch(err) {
//                 console.log(err);
//             }
//         };
//     };
// })();


// // Renderiraj container-artist 
// (function renderArtistContainer(){
//     if(typeof spotifyToken !== 'undefined'){
//         console.log('Successfully reached artist container!');
//     }
        
//     // artist.getInfo()
//     //     .then(artistInfo => {
//     //         console.log(artistInfo);
//     //         // ui.render(artistInfo);
//     //     })
//     //     .catch(err => {
//     //         console.log(err);
//     //     });
// })();



