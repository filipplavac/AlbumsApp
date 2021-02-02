class UI{
    constructor(){
        this.biographyParagraph = document.querySelector('.paragraph-biography');
        this.artistImage = document.querySelector('#image-artist');
        this.albumsList = document.querySelector('.ul-albums');
        this.albumTracks = document.querySelector('.ul-album-tracks')
        this.artistName = document.querySelector('.paragraph-artist-name');

    };

    renderArtist(artistInfo){
        const {albums, artist} = artistInfo;

        // Podatke o artistu stavi u pripadajuće elemente
        this.artistName.textContent = `${artist.name}`;
        this.artistImage.src = `${artist.images[1].url}`;

        // Sliku od svakog albuma dodaj u albumsList
        albums.forEach(album => {
            let li = document.createElement('li');
            li.id = `li-${album.name}`;

            let image = document.createElement('img');
            image.id = `${album.name}-${album.id}`;
            image.className = 'img-album';
            image.src = album.image.url;

            li.appendChild(image);
            this.albumsList.appendChild(li);
        }) ;
    };

    renderTracks(albumTracks){

        // Izbriši sve <li> od albuma koji je prethodno bio izabran
        let lis = document.querySelectorAll('.li-track');
        if(lis.length > 0){
            lis.forEach(li => {li.remove()});
        };

        albumTracks.forEach(track => {
            let li = document.createElement('li');
            li.className = 'li-track'
            li.id = `${track}`;
            li.textContent = track;

            this.albumTracks.appendChild(li);
        });










    };
};

export default UI;