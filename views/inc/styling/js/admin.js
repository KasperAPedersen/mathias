window.onload = () => {
    let displayTab = document.getElementById("displayTab");
    displayTab.style.width = displayTab.clientWidth - 16 + "px";

}

function changeTab(tab) {
    switch(tab) {
        case 1:
            document.getElementById('displayAllUsers').style.display = "block";
            document.getElementById('searchUser').style.display = "none";
            break;
        case 2:
            document.getElementById('displayAllUsers').style.display = "none";
            document.getElementById('searchUser').style.display = "block";
            break;
        default:
            break;
    }
}
getAllUsers();
function getAllUsers(){
    let parChildren = document.getElementById('displayAllUsers').childNodes;
    for(let i = 0; i < parChildren.length; i++) {
        parChildren[i].remove();
    }

    fetch('/getAllUsers')
    .then(res => res.json())
    .then((res) => {
            for(let i = 0; i < res.length; i++) {
                if(res[i].admin == 1) continue;
                
                let user = res[i];
                let elem = document.createElement("li");
                elem.classList = "w3-bar";
                elem.innerHTML = `<span onclick='deleteUser(this, ${user.id});' class='w3-bar-item w3-button w3-white w3-xlarge w3-right'><i class='fa-regular fa-solid fa-trash'></i></span>`;
                elem.innerHTML += `<span onclick='editUser(${user.id});' class='w3-bar-item w3-button w3-white w3-xlarge w3-right'><i class='fa-regular fa-pen-to-square'></i></span>`;
                elem.innerHTML += `<img src='${user.picture}' class='w3-bar-item w3-circle w3-hide-small' style='width:85px'>`;
                elem.innerHTML += `<h4 style='padding-top: 5px;'>${user.first} ${user.last}</h4><br>`;
                document.getElementById("displayAllUsers").appendChild(elem);
            }
    })
    .catch((e) => {
        console.log(e);
    })
}

function deleteUser(elem, id) {
    fetch(`/deleteUser/${id}`)
    .then(() => {
        
    })
    .catch((e) => {
        console.log(e);
    })

    elem.parentElement.remove();
}