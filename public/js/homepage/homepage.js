import Artist from './artist.js';
import tokenChecker from './tokenChecker.js';
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
            console.log(spotifyToken);
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



