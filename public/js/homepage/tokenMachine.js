
// Funkcija tokenMachine napravljena je prema revealing module pattern-u
const tokenMachine = (function(){

    async function getTokenObject(url){
        const tokenObject = await makeServerRequest(url);
        console.log('Spotify token fetched from database: ', tokenObject);
        return tokenObject;

    };

    async function createNewTokenObject(base64clientIdAndSecret, authenticationUrl){

        // URLSeachParams sastavlja x-www-urlencoded payload
        let headers = new URLSearchParams({
            'Authorization': `Basic ${base64clientIdAndSecret}`,
        });
 
        let body = new URLSearchParams({
            'grant_type': 'client_credentials'
        });

        const options = {method: 'post', headers: headers, body: body};

        const spotifyResponse = await makeServerRequest(authenticationUrl, options);

        const [apiName, token, timestamp] = ['Spotify', spotifyResponse.access_token, Date.now().toString()]; 

        const tokenObject = {
            apiName,
            token,
            timestamp
        };

        console.log('New access token created and stamped: ', tokenObject);
            
        return tokenObject;
    };

    async function saveTokenObject(tokenObject){
        const url = 'http://localhost:3000/checkspotifytoken';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tokenObject: tokenObject})
        };
        
        const status = await makeServerRequest(url, options);

        return status;
    };

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

    async function makeServerRequest(url, requestOptions){
        const options = requestOptions || {};
        try {
            const response = await fetch(url, options);
            const jsonResponse = await response.json();
            return jsonResponse;
            
        } catch(err){
            console.error(err);
        }

    };

    return {
        getTokenObject,
        createNewTokenObject,
        saveTokenObject,
        checkTokenValid
    };
})(); 

   
export default tokenMachine;
