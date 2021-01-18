
// Funkcija tokenMachine napravljena je prema revealing module pattern-u
const tokenMachine = (function(){

    // Dohvati Spotify token
    async function fetchToken(url){
        const response = await fetch(url);
        const spotifyToken = await response.json();
      
        return spotifyToken;
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
            console.log(`Authentication endpoint response code: ${response.status}`);
             
            // Parsiramo response body u json format
            const spotifyResponse = await (response.json());

            const token = spotifyResponse.access_token;

            const timeStamp = Date.now();

            const spotifyToken = {
                token,
                timeStamp
            };

            console.log('New access token created and stamped: ', spotifyToken);
                
            return spotifyToken;
 
        } catch(err) {
            console.log(err);
        }
    };

    // Spremi token u bazu podataka
    async function saveTokenToDatabase(spotifyToken){
        
        const options = {method:'post', body:{spotifyToken: spotifyToken}};
        const response = await fetch('http://localhost:3000/checkspotifytoken', options);
        const dbResponse = await response.json();
    
        return dbResponse;
    };

    // Provjeri ispravnost tokena
    async function checkTokenValid(timeStamp){
        
        if(typeof timeStamp !== 'undefined'){
            const currentTime = Date.now();
            const diff = currentTime - timeStamp;
            
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
