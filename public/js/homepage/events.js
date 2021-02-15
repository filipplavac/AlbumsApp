import Artist from './artist.js';
import tokenChecker from './tokenChecker.js';
import UI from './ui.js';
import customHttp from '../customHttp.js';

// const artist = new Artist();
const ui = new UI();

const events = (function(){

    async function renderAlbumNameAndTracks(e){
        // Delegiraj event na pripadajući <img>
        if(e.target.className === 'img-album'){
            const album = e.target;
            
            const idRegEx = /(?<=-)\w*/; 
            const albumSpotifyId = album.id.match(idRegEx).toString();

            const nameRegEx = /.*(?=-)/;
            const albumName = album.id.match(nameRegEx).toString();

            /* Potrebno je interno unutar metode renderTracks provjeravati valjanost Spotify
            access tokena jer isti može isteći u razdoblju od trenutka u kojem su albumi renderirani
            na stranici do trenutka u kojem korisnik odluči kliknuti na album  */
            const spotifyToken =  await tokenChecker.checkSpotifyToken();

            const albumTracks = await Artist.getAlbumTracks(albumSpotifyId, spotifyToken);
            ui.renderAlbumNameAndTracks(albumName, albumTracks);
        }
    };

    async function addToFavourites(e){
        if(e.target.classList.contains('fa-star')){
          
            // Izvuci spotify id
            const regEx = /(?<=-)[\w]*/;
            const trackId = e.target.id.match(regEx).toString();    

            // Provjeri je li pjesma već sadržana u favoritima  
            const favourites = Array.from(document.querySelectorAll('.li-favourite'));
            const isFavourite = favourites.some(favourite => favourite.id === trackId);

            if(!isFavourite){
                const trackName = e.target.parentElement.textContent;
                const albumName = document.querySelector('.selected-album').textContent;
                const artistName = document.querySelector('.paragraph-artist-name').textContent;

                const trackData = {
                    trackName,
                    trackId,
                    albumName,
                    artistName
                };

                const query = {
                    trackData,
                    action: 'push'
                };

                // Pošalji serveru zahtjev za spremanje favorita u bazu podataka
                const isUpdated = await customHttp.updateUserFavourites(query);
                if(isUpdated){
                    ui.addToFavourites(trackData);
                };
            };
        };
    };

    async function removeFromFavourites(e){
        if(e.target.classList.contains('fa-times')){
            console.log(e.target);
            const favourite = e.target.parentElement;

            const query = {
                trackId: favourite.id,
                action: 'pull'
            };
            
            // Pošalji serveru zahtjev za brisanje favorita iz baze podataka
            const isUpdated = await customHttp.updateUserFavourites(query);
            if(isUpdated){
                ui.removeFromFavourites(favourite);
            };
        };
    };

    function playFavourite(e){
        if(e.target.classList.contains('fa-play')){

            /* Provjeri postoji li u bazi podataka <iframe> src za odabrani
            favorit kako bi se minmizirala količina zahtjeva na youtubeApi */
            const iframeSrc = customHttp.getIframeSrc(); 
            if(true){

            };

            // Izvuci ime umjetnika i pjesme pogodno za Youtube pretraživanje
            const favouriteTextContent = e.target.previousSibling.textContent;
            const regEx = /.*(?=Album:)/;
            const query = favouriteTextContent.match(regEx).toString();
            const refactoredQuery = query.replace(':','').toLowerCase() + ' audio';
            console.log(refactoredQuery);
        }
    };

    return{
        renderAlbumNameAndTracks,
        addToFavourites,
        removeFromFavourites,
        playFavourite
    };

})();

export default events;