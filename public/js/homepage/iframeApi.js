/* Funckiju onYouTubeIframeAPIReady() poziva #iframeApi-download skripta definirana unutar
homepage.ejs nakon što završi sa skidanjem Javascript koda za Iframe API */
let player;
function onYouTubeIframeAPIReady(){
    console.log('Iframe API ready!');
    player = new YT.Player('yt-player', {
        events: {
            'onReady': onPlayerReady
            // 'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log('Player ready!');
    let favouriteList = document.querySelector('.ul-user-favourites');
    favouriteList.addEventListener('click', playerControls);
};

function playerControls(e){
    const targetClassName = e.target.className;
    if(targetClassName === 'fas fa-pause'|| targetClassName === 'fas fa-play'){
        // Izvuci videoId iz id atribute favorita čiji je pause gumb kliknut
        const targetId = e.target.id,
              targetVideoIdRegEx = /(?<=-\w*-)\w*/,
              targetVideoId = targetId.match(targetVideoIdRegEx).toString();

        // Izvuci videoId pjesme koja se trenutno izvodi u <iframe> elementu iz njegove src atribute
        const iframe = document.getElementById('yt-player'),
              iframeSource = iframe.src,
              iframeCurrentVideoIdRegEx = /(?<=embed\/)\w*(?=\?)/;
        /* Kako #yt-player pri učitavanju stranice nema unutar src atribute string znakova koji odgovara
        iframeCurrentVideoIdRegEx-u potrebno je kod reprodukcije prve pjesme njezin iframeCurrentVideoId
        ručno podesiti na "null" jer će u suprotnome .toString() metoda baciti error*/
        const iframeCurrentVideoId = iframeSource.match(iframeCurrentVideoIdRegEx) ? iframeSource.match(iframeCurrentVideoIdRegEx).toString() : null;

        switch (targetClassName){
            case 'fas fa-play':
                if(targetVideoId === iframeCurrentVideoId){
                    // Nastavi reprodukciju
                    player.playVideo();
                } else {
                    // Učitaj novi video
                    iframe.src = `https://www.youtube.com/embed/${targetVideoId}?autoplay=1&enablejsapi=1`;
                }
                break;

            case 'fas fa-pause':
                if(targetVideoId === iframeCurrentVideoId){
                    player.pauseVideo();
                }
                break;
        };
    };
};

// function changeBorderColor(playerStatus) {
//     var color;
//     if (playerStatus == -1) {
//         color = "#37474F"; // unstarted = gray
//     } else if (playerStatus == 0) {
//         color = "#FFFF00"; // ended = yellow
//     } else if (playerStatus == 1) {
//         color = "#33691E"; // playing = green
//     } else if (playerStatus == 2) {
//         color = "#DD2C00"; // paused = red
//     } else if (playerStatus == 3) {
//         color = "#AA00FF"; // buffering = purple
//     } else if (playerStatus == 5) {
//         color = "#FF6DOO"; // video cued = orange
//     }
//     if (color) {
//         document.getElementById('existing-iframe-example').style.borderColor = color;
//     }
// }
// function onPlayerStateChange(event) {
//     changeBorderColor(event.data);
// }
