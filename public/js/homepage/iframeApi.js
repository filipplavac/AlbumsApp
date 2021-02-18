/* Funckiju onYouTubeIframeAPIReady() poziva #iframeApi-download skripta definirana unutar
homepage.ejs nakon što završi sa skidanjem Javascript koda za Iframe API */
let player;
function onYouTubeIframeAPIReady(){
    console.log('Iframe API ready!');
    player = new YT.Player('yt-player', {
        playerVars: {
            'modestbranding': 1,
        },
        events: {
            'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log('Player ready!');
    let favouriteList = document.querySelector('.ul-user-favourites');
    favouriteList.addEventListener('click', playerControls);
};

// Nije uračunata moguće micanje/dodavanje favorita što utječe na playlistu
function playerControls(e){
  
    const targetClassName = e.target.className;
    if(targetClassName === 'fas fa-pause'|| targetClassName === 'fas fa-play'){
        // Izvuci videoId pjesme čiji je play/pause gumb kliknut
        const targetId = e.target.id,
        targetVideoIdRegEx = /(?<=-\w*-)\w*/,
        targetVideoId = targetId.match(targetVideoIdRegEx).toString();

        // Izvadi videoId svakog favorita 
        const favourites = Array.from(document.querySelectorAll('.li-favourite'));
        const videoIds = favourites.map(favourite => {
            const favouriteVideoIdRegEx = /(?<=-\w*-)\w*/,
                favouriteVideoId = favourite.id.match(favouriteVideoIdRegEx).toString();
            return favouriteVideoId;  
        });

        // Izvadi index kliknutog favorita - od njega započinje reprodukcija playliste
        const targetIndex = videoIds.indexOf(targetVideoId);
        console.log(targetIndex);

        // Trenutno stanje player objekta
        const playerState = player.getPlayerState();
        console.log(playerState);

        // Je li stisnut play ili pause gumb
        switch (targetClassName){
            case 'fas fa-play':
                // -1 = niti jedan video nije u playlisti
                if(player.getPlaylistIndex() === -1){
                    // Učitaj playlistu i podesi reproduciranje u petlji
                    player.loadPlaylist(videoIds, targetIndex);
                    player.setLoop(true);
        
                } else {
                    const currentlyPlayingVideoIndex = player.getPlaylistIndex();
                    const currentlyPlayingVideoId = videoIds[currentlyPlayingVideoIndex];
                    /* Ako videoId kliknutog play gumba odgovara videoId-ju pjesme koja je trenutno 
                    učitana u player, te ako je video pauziran, onda play gumb nastavlja reprodukciju */
                    if(targetVideoId === currentlyPlayingVideoId && playerState === 2){
                        player.playVideo();
                    }; 
                    // Ako je klikut play gumb od neke druge pjesme onda player kreće reproducirati istu
                    if(targetVideoId !== currentlyPlayingVideoId){
                        player.playVideoAt(targetIndex);
                    };
                };
                break;

            case 'fas fa-pause':
                const currentlyPlayingVideoIndex = player.getPlaylistIndex();
                const currentlyPlayingVideoId = videoIds[currentlyPlayingVideoIndex];
                if(playerState === 1 && targetVideoId === currentlyPlayingVideoId){
                    player.pauseVideo();
                };
                break;
        };
    };
};


// class Playlist {
//     constructor(){
//         this.members = document.querySelectorAll('.li-favourite');
//     };

//     updateMembers(){
//         this.members = document.querySelectorAll('.li-favourite');
//     };

//     getMemberVideoIds(){
//         const members = Array.from(this.members);
//         const memberVideoIds = members.map(member => {
//             const memberVideoIdRegEx = /(?<=-\w*-)\w*/,
//                 memberVideoId = member.id.match(memberVideoIdRegEx).toString();
//             return memberVideoId;  
//         });

//         return memberVideoIds;
//     };

// };

// class PlayerControls {

// };

// function onPlayerStateChange(){

//     // Izvadi videoId svakog favorita 
//     const favourites = Array.from(document.querySelectorAll('.li-favourite'));
//     const videoIds = favourites.map(favourite => {
//         const favouriteVideoIdRegEx = /(?<=-\w*-)\w*/,
//             favouriteVideoId = favourite.id.match(favouriteVideoIdRegEx).toString();
//         return favouriteVideoId;  
//     });

    // Provjeravaj je li favorit dodan ili maknut s playliste te postupi adekvatno

    /* Ovo se mora provjeravati i unutar playerControls() u slučaju da favorit bude 
    dodan prije nego se stanje playera promjenilo */
    
// }

// const playerInterface = (function(){
//     function processRequest(){

//     }
    
//     return {
//         processRequest
//     };
// })();

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
