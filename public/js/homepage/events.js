import Artist from './artist.js';
import tokenChecker from './tokenChecker.js';
import UI from './ui.js';
import customHttp from '../customHttp.js';
import youTubeApi from './youTubeApi.js';
// import player from './iframeApi.js';

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
            const favouriteIds = favourites.map(favourite => {
                const IdRegEx = /(?<=-)[\w]*/,
                      favouriteId = favourite.id.match(IdRegEx).toString();

                return favouriteId;
            });
            const isFavourite = favouriteIds.some(favouriteId => favouriteId === trackId);

            // Dodaj u favorite samo ako pjesma već nije favorit
            if(!isFavourite){
                const trackName = e.target.parentElement.textContent,
                      albumName = document.querySelector('.selected-album').textContent,
                      artistName = document.querySelector('.paragraph-artist-name').textContent;

                /* Od YouTube api-ja pribavljamo videoId od dodanog favorita kako bi se na eventualni
                zahtjev korisnika favorit počeo reproducirati unutar embeddanog <iframe> elementa */
                const youTubeQuery = `${artistName} ${trackName} audio`.toLowerCase(),
                      videoId = await youTubeApi.getVideoId(youTubeQuery);

                const trackData = {
                    trackName,
                    trackId,
                    albumName,
                    artistName,
                    videoId
                };

                const databaseQuery = {
                    trackData,
                    action: 'push'
                };

                // Pošalji serveru zahtjev za spremanje favorita u bazu podataka
                const isUpdated = await customHttp.updateUserFavourites(databaseQuery);
                if(isUpdated){
                    ui.addToFavourites(trackData);
                };
            };
        };
    };

    async function removeFromFavourites(e){
        if(e.target.classList.contains('fa-times')){
            console.log(e.target);

            const regEx = /(?<=-)\w*/;
            const favouriteId = e.target.id.match(regEx).toString();    

            const query = {
                trackId: favouriteId,
                action: 'pull'
            };
            
            // Pošalji serveru zahtjev za brisanje favorita iz baze podataka
            const isUpdated = await customHttp.updateUserFavourites(query);
            if(isUpdated){
                const favourite = e.target.parentElement;
                ui.removeFromFavourites(favourite);
            };
        };
    };

    return{
        renderAlbumNameAndTracks,
        addToFavourites,
        removeFromFavourites,
    };

})();

export default events;