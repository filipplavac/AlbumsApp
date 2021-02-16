import events from './events.js';

// Ubacivanje skripte koja učitava Iframe API iznad svih skripti unutar hompage.ejs
let scriptTag = document.createElement('script');
scriptTag.id = 'iframe-demo';
scriptTag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.body.getElementsByTagName('script')[0];
console.log(firstScriptTag);
firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
console.log('Source script inserted');

/* Funckiju onYouTubeIframeAPIReady() poziva #iframe-demo skripta nakon što završi
sa skidanjem Javascript koda za Iframe API */
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
    // let favouriteList = document.querySelector('.ul-user-favourites');
    // favouriteList.addEventListener('click', events.playerControl.bind(player));
};




// function playVideo(){
//     player.playVideo();
// };

// function pauseVideo(){
//     player.pauseVideo();
// }

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

// export {pauseVideo};