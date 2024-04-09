window.onload = () => {
    let alert = document.getElementById('alert');
    if(alert.innerHTML == "<p></p>") {
        alert.remove();
    }
}