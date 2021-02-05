class UI {
    constructor(){
        this.biographyParagraph = document.querySelector('.paragraph-biography');
        this.artistImage = document.querySelector('#image-artist');
        this.albumsList = document.querySelector('.ul-albums');
        this.albumTracks = document.querySelector('.ul-album-tracks');
        this.artistName = document.querySelector('.paragraph-artist-name');
    }

    renderArtist(artistInfo){
        const {albums, artist} = artistInfo;

        // Podatke o artistu stavi u pripadajuće elemente
        this.artistName.textContent = `${artist.name}`;
        this.artistImage.src = `${artist.images[1].url}`;

        // Sliku od svakog albuma dodaj u albumsList
        albums.forEach(album => {
            const albumModel = {tagName: 'li', attributes: [{id:`li-${album.name}`}]}; 
            const albumElement = makeElement(albumModel);

            const albumImageModel = {tagName: 'img', attributes: [{class: 'img-album'}, {id: `${album.name}-${album.id}`}, {src: album.image.url}]};
            const albumImage = makeElement(albumImageModel);
            // let li = document.createElement('li');
            // li.id = `li-${album.name}`;

            // let image = document.createElement('img');
            // image.id = `${album.name}-${album.id}`;
            // image.className = 'img-album';
            // image.src = album.image.url;

            albumElement.appendChild(albumImage);
            this.albumsList.appendChild(albumElement);
        }) ;
    };

    renderTracks(albumTracks){

        // Izbriši sve <li> od albuma koji je prethodno bio izabran
        let lis = document.querySelectorAll('.li-track');
        if(lis.length > 0){
            lis.forEach(li => {li.remove()});
        };

        albumTracks.forEach(track => {
            const albumTrackModel = {tagName: 'li' , attributes: [{class: 'li-track'}, {id: track}], properties: {textContent: track}};
            const albumTrack = makeElement(albumTrackModel);

            const iconModel = {tagName: 'i', attributes: [{class: 'fa fa-star'}]};
            const icon = makeElement(iconModel);

            albumTrack.appendChild(icon);
            this.albumTracks.appendChild(albumTrack);
        });
    };
};

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
