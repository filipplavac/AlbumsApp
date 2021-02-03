import Artist from './artist.js';
import UI from './ui.js';
import tokenChecker from './tokenChecker.js';

// const artist = new Artist();
const ui = new UI();

const events = (function(){

    async function renderTracks(e){
        // Delegiraj event na pripadajući <img>
        if(e.target.className === 'img-album'){
            const album = e.target;
            const regEx = /(?<=-)[A-Za-z0-9]*/; 
            const albumSpotifyId = album.id.match(regEx).toString();

            /* Potrebno je interno unutar metode renderTracks provjeravati valjanost Spotify
            access tokena jer isti može isteći u razdoblju od trenutka u kojem su albumi renderirani
            na stranici do trenutka u kojem korisnik odluči kliknuti na album  */
            const spotifyToken =  await tokenChecker.checkSpotifyToken();

            const albumTracks = await Artist.getAlbumTracks(albumSpotifyId, spotifyToken);
            ui.renderTracks(albumTracks);
        }
    };

    return{
        renderTracks
    };

})();

export default events;