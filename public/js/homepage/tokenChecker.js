import tokenMachine from './tokenMachine.js';
import {base64clientIdAndSecret, authenticationUrl} from './credentials.js';

const tokenChecker = (function(){

    // Provjera access tokena za Spotify Web API
    async function checkSpotifyToken(){
        
        // tokenObject = {apiName, token, timestamp}
        let tokenObject = await tokenMachine.getTokenObject();
        
        if(!tokenObject) {
            tokenObject = await requestNewToken();
            return tokenObject.token;
            
        } else {

            const isValid = await tokenMachine.checkTokenValid(tokenObject.timestamp);
            
            if(isValid){
                return tokenObject.token;
                
            } else {
                tokenObject = await requestNewToken();
                return tokenObject.token;
            };
        };
    };

    async function requestNewToken(){
        try {
            const tokenObject = await tokenMachine.createNewTokenObject(base64clientIdAndSecret, authenticationUrl);

            const status = await tokenMachine.saveTokenObject(tokenObject);
        
            // Ako je token uspješno pohranjen
            if(status.isPersistedToDatabase){
                return tokenObject;
            };   

        } catch(err) {
            console.error(err);
        };

    };

    return {
        checkSpotifyToken
    }

})();

export default tokenChecker;