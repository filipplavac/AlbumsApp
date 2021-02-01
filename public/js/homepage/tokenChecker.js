import tokenMachine from './tokenMachine.js';
import {base64clientIdAndSecret, authenticationUrl} from './credentials.js';

// Funkcija tokenChecker napravljena je prema revealing module pattern-u
const tokenChecker = (function(){

    // Provjera access tokena za Spotify Web API
    async function checkSpotifyToken(){
        
        // Dohvati Spotify token
        let spotifyToken = await tokenMachine.fetchToken('http://localhost:3000/checkspotifytoken');
        
        if(!spotifyToken) {
            
            try {
                // Napravi token 
                spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);

                // Spremi token u bazu podataka
                const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
            
                // Ako je token uspješno pohranjen
                if(dbResponse.persistedToDatabase){
                    // Vrati spotifyToken
                    return spotifyToken.token;
                };   

            } catch(err) {
                console.log(err);
            };
            
        } else {

            // Provjeri ispravnosti tokena
            const valid = await tokenMachine.checkTokenValid(spotifyToken.timestamp);
            
            if(valid){
                return spotifyToken.token;
                
            } else {
                try {
                    spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);
        
                    const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
                
                    if(dbResponse.persistedToDatabase){
                        return spotifyToken.token;
                    };   
        
                } catch(err) {
                    console.log(err);
                };
            };
        };
    };

    return {
        checkSpotifyToken
    }

})();

export default tokenChecker;