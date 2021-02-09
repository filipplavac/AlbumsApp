class UI {
    constructor(){
        this.biographyParagraph = document.querySelector('.paragraph-biography');
        this.artistImage = document.querySelector('#image-artist');
        this.albumsList = document.querySelector('.ul-albums');
        this.selectedAlbum = document.querySelector('.selected-album');
        this.albumTracks = document.querySelector('.ul-album-tracks');
        this.artistName = document.querySelector('.paragraph-artist-name');
        this.userFavourites = document.querySelector('.ul-user-favourites');
    };

    renderArtist(artistInfo){
        const {albums, artist} = artistInfo;

        // Podatke o artistu stavi u pripadajuće elemente
        this.artistName.textContent = `${artist.name}`;
        this.artistImage.src = `${artist.images[1].url}`;

        // Sliku od svakog albuma dodaj u albumsList
        albums.forEach(album => {
            const albumModel = {
                tagName: 'li', 
                attributes: [{id:`li-${album.name}`}]
            }; 
            const albumElement = makeElement(albumModel);

            const albumImageModel = {
                tagName: 'img', 
                attributes: [{class: 'img-album'}, {id: `${album.name}-${album.id}`}, {src: album.image.url}]
            };
            const albumImage = makeElement(albumImageModel);

            albumElement.appendChild(albumImage);
            this.albumsList.appendChild(albumElement);
        }) ;
    };

    renderAlbumNameAndTracks(albumName, albumTracks){
        this.selectedAlbum.textContent = albumName;

        // Izbriši sve pjesme od albuma koji je prethodno bio izabran
        let lis = document.querySelectorAll('.li-track');
        if(lis.length > 0){
            lis.forEach(li => {li.remove()});
        };

        albumTracks.forEach(track => {
            const albumTrackModel = {
                tagName: 'li', 
                attributes: [{class: 'li-track'}, {id: track.spotifyId}], 
                properties: {textContent: track.trackName}};
            const albumTrack = makeElement(albumTrackModel);

            const iconModel = {tagName: 'i', attributes: [{class: 'fas fa-star'}, {id: `Star-${track.spotifyId}`}]};
            const icon = makeElement(iconModel);

            albumTrack.appendChild(icon);
            this.albumTracks.appendChild(albumTrack);
        });
    };

    addToFavourites(trackData){
        const {trackName, trackId, albumName, artistName} = trackData;

        const favouriteModel = {
            tagName: 'li', 
            attributes: [{id: trackId}, {class: 'li-favourite'}], 
            properties: {textContent: `${artistName}:${albumName}: ${trackName}`}
        };
        const favourite = makeElement(favouriteModel);

        const deleteIconModel = {
            tagName: 'i', 
            attributes: [{id: `delete-${trackId}`}, {class: 'fas fa-times'}]
        };
        const deleteIcon = makeElement(deleteIconModel);

        favourite.appendChild(deleteIcon);
        this.userFavourites.appendChild(favourite);
    };

    removeFromFavourites(favourite){
        favourite.remove();
    }
};

// Funkcija za dinamičko stvaranje DOM elemenata
function makeElement(model){
    let newElement = document.createElement(model.tagName);

    // Dinamičko postavljane atributa za stvoreni element
    model.attributes.forEach(attribute => {
        const [attrName, attrValue] = [Object.keys(attribute), Object.values(attribute)];
        newElement.setAttribute(attrName, attrValue);
    });

    newElement.textContent = (model.properties && model.properties.textContent) ? model.properties.textContent : '';
    
    return newElement;
}

export default UI;
