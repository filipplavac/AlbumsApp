
class Artist {
    constructor(artist){
        this.artist = artist.replace(/\s/g, '').toLowerCase();;
        this.apiKey = '76147e6f42513f994b5d31a4720a6b67';
        this.artistInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.artist}&api_key=${this.apiKey}&autocorrect=1&format=json`;
        this.artistTopAlbumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${this.artist}&api_key=${this.apiKey}&autocorrect=1&format=json`;
        this.artistTopTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${this.artist}&api_key=${this.apiKey}&autocorrect=1&format=json`;
    }

    async getArtistInfo(){

        // LastFm navodi da u  request headerima treba biti definiran user-agent
        let headers = new Headers({
            "User-Agent": "AlbumsApp"
        });

        try{
            // autocorrect option u querystringu ispravlja krivo uneseno ime izvođača
            const artistInfo = await fetch(this.artistInfoUrl, {headers: headers});
            console.log(`lastFm response status code: ${response.status}`);
            
            // Parsiramo response body u json format
            const artistInfo = await(response.json());

            return artistInfo;

        } catch(err) {
            console.log(err);
        }
    }

    async getTopAlbums(){

    };

    async getTopTracks(){

    };
}

export default Artist;