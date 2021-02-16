const customHttp = (function(){

    async function sendRequest(url, requestOptions){
        const options = requestOptions || {};
        try {
            const response = await fetch(url, options);
            const jsonResponse = await response.json();
            return jsonResponse;
            
        } catch(err){
            console.error(err);
        }
    }

    async function updateUserFavourites(query){
        const url = 'http://localhost:3000/favourites';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: query})
        };
        const serverResponse = await sendRequest(url, options);
        return serverResponse;
    };
    
    async function getUserFavourites(){
        const url = 'http://localhost:3000/favourites';
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const serverResponse = await sendRequest(url, options);
        return serverResponse;
    };

    return {
        sendRequest,
        updateUserFavourites,
        getUserFavourites,
    };
})();

export default customHttp;