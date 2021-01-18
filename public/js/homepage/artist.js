
class Artist {
    constructor(artist, accessToken){
        
        // Korisnikov unos transformiramo u string koji sadrži samo mala slova i ne sadrži razmake
        this.artist = artist.replace(/\s/g, '').toLowerCase();

        // Token za pristup Spotify api-ju
        this.accessToken = accessToken;
        
        // Endpoint za api
        this.apiEndpoint = 'https://api.spotify.com/v1/search';
    }

    async getInfo(){

        const headers = new URLSearchParams({
           'Authorization': `Basic ${this.base64clientIdAndSecret}`,
        });

        const queryString = `?query=${this.artist}&type=artist&limit=1`;

        const searchUrl = this.apiEndpoint + queryString;

        try{
            const response = await fetch(searchUrl, {headers: headers});
            console.log(`Response status code: ${response.status}`);
            
            // Parsiramo response body u json format
            const artistInfo = await(response.json());

            return artistInfo;

        } catch(err) {
            console.log(err);
        }
    }

}

export default Artist;