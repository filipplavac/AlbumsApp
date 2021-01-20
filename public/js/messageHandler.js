
document.addEventListener('DOMContentLoaded', removeMessages);

function removeMessages(){

    let flashDivs = Array.from(document.querySelectorAll('.flash'));

    flashDivs.forEach(div => { 
        setTimeout(() => {
            div.remove();
        }, 2000);
    });

}