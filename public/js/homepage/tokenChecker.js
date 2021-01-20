import tokenMachine from './tokenMachine.js';
import {base64clientIdAndSecret, authenticationUrl} from './credentials.js';

// Funkcija tokenChecker napravljena je prema revealing module pattern-u
const tokenChecker = (function(){

    // Provjera access tokena za Spotify Web API
    async function checkSpotifyToken(){
        
        // Dohvati Spotify token sa servera
        let spotifyToken = await tokenMachine.fetchToken('http://localhost:3000/checkspotifytoken');
        console.log(`Spotify token recieved from server: ${spotifyToken}`);
        
        if(!spotifyToken) {
            
            try {
                // Napravi token i zalijepi mu timestamp, spotifyToken = {token: <value>, timestamp: <value>} 
                spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);

                // Spremi token u bazu podataka
                const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
            
                // Ako je token uspješno pohranjen
                if(dbResponse.message === 'Success'){
                    // Vrati spotifyToken
                    return spotifyToken.token;
                };   

            } catch(err) {
                console.log(err);
            };
            
        } else {

            // Provjeri ispravnost tokena
            const valid = await tokenMachine.checkTokenValid(spotifyToken.timeStamp);
            
            if(valid){
                return spotifyToken.token;
                
            } else {
                try {
                    spotifyToken = await tokenMachine.createNewToken(base64clientIdAndSecret, authenticationUrl);
        
                    const dbResponse = await tokenMachine.saveTokenToDatabase(spotifyToken);
                
                    if(dbResponse.message === 'Success'){
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