class Artist {
    constructor(artist, accessToken){
        
        // Korisnikov unos transformiramo u string koji sadrži samo mala slova i ne sadrži razmake
        // this.artist = artist.replace(/\s/g, '').toLowerCase();
        this.artist = encodeURIComponent(artist);

        // Token za pristup Spotify api-ju
        this.accessToken = accessToken;
        
        // Endpoint za Search api
        this.searchApiEndpoint = 'https://api.spotify.com/v1/search';
    };

    async getInfo(){

        const headers = new URLSearchParams({
           'Authorization': `Bearer ${this.accessToken}`,
        });

        const queryString = `?query=${this.artist}&type=artist,album&limit=10`;

        const url = this.searchApiEndpoint + queryString;

        try{
            const response = await fetch(url, {headers: headers});
            console.log(`SearchAPI response code: ${response.status}`);
            
            // Parsiramo response body u json format
            const jsonResponse = await(response.json());

            let artist = jsonResponse.artists.items[0];

            let albums = jsonResponse.albums.items.map(album => {
                const [id, name, image] = [album.id, album.name, album.images[0]];
                return {id, image, name};
            });

            return {
                artist,
                albums
            };

        } catch(err) {
            console.log(err);
        }
    }

    static async getAlbumTracks(albumSpotifyId, accessToken){

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        };

        const url = `https://api.spotify.com/v1/albums?ids=${albumSpotifyId}`

        try{
            const response = await fetch(url, {headers: headers});

            const albumObject = await (response.json());
            console.log(albumObject);
            
            const albumTracks = albumObject.albums[0].tracks.items.map(track => {
                return {
                    trackName: track.name,
                    spotifyId: track.id
                };
            });

            return albumTracks;

        } catch(err) {
            console.log(err);
        }
      
    };

}

export default Artist;