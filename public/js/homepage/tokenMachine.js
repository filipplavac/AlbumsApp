import customHttp from '../customHttp.js';

// Funkcija tokenMachine napravljena je prema revealing module pattern-u
const tokenMachine = (function(){

    async function getTokenObject(){
        const url = 'http://localhost:3000/token';
        const tokenObject = await customHttp.sendRequest(url);
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

        const spotifyResponse = await customHttp.sendRequest(authenticationUrl, options);

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
        const url = 'http://localhost:3000/token';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({tokenObject: tokenObject})
        };
        
        const status = await customHttp.sendRequest(url, options);

        return status;
    };

    async function checkTokenValid(timestampString){

        if(typeof timestampString !== 'undefined'){
            const currentTime = Date.now();
            const timestampInt = Number(timestampString);
            const diff = currentTime - timestampInt;
            
            const isValid = (diff >= 3000000) ? false : true;
            const message = (isValid === true) ? 'Access token is valid' : 'Access token is invalid';
            console.log(message);
            
            return isValid;

        } else {
            console.log('Recieved token timestamp is undefined.');
        };
    };

    // async function http.sendRequest(url, requestOptions){
    //     const options = requestOptions || {};
    //     try {
    //         const response = await fetch(url, options);
    //         const jsonResponse = await response.json();
    //         return jsonResponse;
            
    //     } catch(err){
    //         console.error(err);
    //     }

    // };

    return {
        getTokenObject,
        createNewTokenObject,
        saveTokenObject,
        checkTokenValid
    };
})(); 

   
export default tokenMachine;
