setInterval(changeDigitalClock, 1000);
function changeDigitalClock(){
    let elem = document.getElementById("digitalClock");

    let date = new Date().toLocaleString().split(" ");
    elem.innerHTML = date[1];
}