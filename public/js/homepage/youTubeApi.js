import {googleApiKey} from  './credentials.js';

const youTubeApi = (function(){
    async function getVideoId(query){
        const q = encodeURIComponent(query);

        const endpoint = 'https://youtube.googleapis.com/youtube/v3/search?',
              parameters = `part=snippet&fields=items(id(videoId))&type=video&maxResults=1&key=${googleApiKey}&q=${q}`;
              
        const url = endpoint + parameters;

        const options = {
            headers: {
                "Accept": "application/json",
            }
        };

        const youTubeResponse = await fetch(url, options);
        const jsonResponse = await(youTubeResponse.json());
        const videoId = jsonResponse.items[0].id.videoId;

        return videoId;
    }

    return{
        getVideoId
    }
})();

export default youTubeApi;