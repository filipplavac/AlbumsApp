import Artist from './artist.js';
import tokenChecker from './tokenChecker.js';
import UI from './ui.js';
import events from './events.js';

// Instanciraj user interface objekt
const ui = new UI();

// artistName odgovara imenu koje korisnik upiše u tražilicu
const artistName = 'Red Hot Chilli Peppers';

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

    // Postavi event listener na listu albuma
    let albumList = document.querySelector('.ul-albums');
    albumList.addEventListener('click', events.renderTracks);

})();



