import Artist from './artist.js';
// import ui from './ui.js';

const artist = new Artist('Red Hot Chilli Peppers');

// Renderiraj container-artist
(function renderArtistContainer(){
    artist.getArtistInfo()
        .then(artistInfo => {
            console.log(artistInfo);
            // ui.render(artistInfo);
        })
        .catch(err => {
            console.log(err);
        });
})();

