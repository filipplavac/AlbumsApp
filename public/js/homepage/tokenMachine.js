
// Funkcija tokenMachine napravljena je prema revealing module pattern-u
const tokenMachine = (function(){

    // Dohvati Spotify token sa https://accounts.spotify.com/api/token
    async function fetchToken(url){
        try{
            const response = await fetch(url);

            const spotifyToken = await response.json();
            console.log('Spotify token fetched from database: ', spotifyToken);

            return spotifyToken;
            
        } catch(err) {
            console.log(err);
        }
      
    };

    // Stvori novi token
    async function createNewToken(base64clientIdAndSecret, authenticationUrl){

        // URLSeachParams sastavlja x-www-urlencoded payload
        let headers = new URLSearchParams({
            'Authorization': `Basic ${base64clientIdAndSecret}`,
        });
 
        let body = new URLSearchParams({
            'grant_type': 'client_credentials'
        });

        const options = {method: 'post', headers: headers, body: body};
 
        try{
            const response = await fetch(authenticationUrl, options);
             
            // Parsiramo response body u json format
            const spotifyResponse = await (response.json());

            const token = spotifyResponse.access_token;

            const timestamp = Date.now().toString();

            const apiName = 'Spotify';

            const spotifyToken = {
                apiName,
                token,
                timestamp
            };

            console.log('New access token created and stamped: ', spotifyToken);
                
            return spotifyToken;
 
        } catch(err) {
            console.log(err);
        }
    };

    // Spremi token u bazu podataka
    async function saveTokenToDatabase(spotifyToken){

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({spotifyToken: spotifyToken})
        };
        
        const response = await fetch('http://localhost:3000/checkspotifytoken', options);
        const dbResponse = await response.json();
    
        return dbResponse;
    };

    // Provjeri ispravnost tokena
    async function checkTokenValid(timestampString){
        
        if(typeof timestampString !== 'undefined'){
            const currentTime = Date.now();
            const timestampInt = Number(timestampString);
            const diff = currentTime - timestampInt;
            
            // Provjera je li token stariji od 50 minuta
            if(diff >= 3000000){
                console.log('Access token is invalid');
                return false;
            } else {
                console.log('Access token is valid.')
                return true;
            };

        } else {
            console.log('Recieved token timestamp is undefined.');
        };
    };

    return {
        fetchToken,
        createNewToken,
        saveTokenToDatabase,
        checkTokenValid
    };
})(); 

   

export default tokenMachine;