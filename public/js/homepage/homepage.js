import Artist from './artist.js';
import tokenChecker from './tokenChecker.js';
import UI from './ui.js';
import events from './events.js';
import customHttp from './../customHttp.js';

// Učitaj event listenere
window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.ul-albums').addEventListener('click', events.renderAlbumNameAndTracks);
    document.querySelector('.ul-album-tracks').addEventListener('click', events.addToFavourites);
    document.querySelector('.ul-user-favourites').addEventListener('click', events.removeFromFavourites);
    document.querySelector('.ul-user-favourites').addEventListener('click', events.playFavourite);
});

// artistName odgovara imenu koje korisnik upiše u tražilicu
const artistName = 'Creedence Clearwater Revival';

// Instanciraj ui
const ui = new UI();

// Učitaj naslovnicu
(async function loadHomepage(){
     
    // Provjeri valjanost tokena
    const spotifyToken = await tokenChecker.checkSpotifyToken();
    // const youtubeToken = await tokenChecker.checkYoutubeToken();

    // Instanciraj artist objekt
    const artist = new Artist(artistName, spotifyToken);

    // Dohvati informacije o artistu
    const artistInfo = await artist.getInfo();
    console.log(artistInfo);

    // Renderiraj informacije o artistu na homepageu
    ui.renderArtist(artistInfo);

    // Dohvati korisnikove favorite
    const userFavourites = await customHttp.getUserFavourites();
    userFavourites.forEach(favourite => {
        ui.addToFavourites(favourite);
    })
})();



