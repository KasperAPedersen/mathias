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
                
                let user = res[i];
                let elem = document.createElement("li");
                elem.classList = "w3-bar";
                elem.innerHTML = `<span onclick='deleteUser(this, ${user.id});' class='w3-bar-item w3-button w3-white w3-xlarge w3-right'><i class='fa-regular fa-solid fa-trash'></i></span>`;
                elem.innerHTML += `<span onclick='editUser(this, ${user.id});' class='w3-bar-item w3-button w3-white w3-xlarge w3-right'><i class="fa-solid fa-user-pen"></i></span>`;
                elem.innerHTML += `<span onclick='addAssignment(this, ${user.id});' class='w3-bar-item w3-button w3-white w3-xlarge w3-right'><i class="fa-solid fa-plus"></i></span>`;
                elem.innerHTML += `<img src='images/${user.picture}' class='w3-bar-item w3-circle w3-hide-small' style='width:85px'>`;
                elem.innerHTML += `<h4 style='padding-top: 5px;'>${user.first} ${user.last}</h4><br>`;
                document.getElementById("displayAllUsers").appendChild(elem);
            }
    })
    .catch((e) => {
        console.log(e);
    })
}

function addAssignment(elem, id) {
    console.log(elem + "\n" + id);
    let parentNodes = elem.parentElement.childNodes;
    let name = "";

    parentNodes.forEach(element => {
        if(element.nodeName == "H4") {
            name = element.innerHTML;
        }
    });
    // --
    let parent = document.createElement("div");
    parent.classList = "w3-modal";
    parent.style.display = "block";
    parent.id = `popup_${id}`;
    parent.innerHTML = `<div class="w3-modal-content">
                            <header class="w3-container w3-blue">
                                <span onclick="document.getElementById('popup_${id}').remove();"
                                class="w3-button w3-display-topright">&times;</span>
                                <h2>Edit ${name}</h2>
                            </header>
                            <div class="w3-container">
                                <form action="/addAssignment/${id}" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin" method="POST" enctype="multipart/form-data">
                                    
                                    <div class="w3-row w3-section">
                                      <div class="w3-col" style="width:50px"></div>
                                        <div class="w3-rest">
                                          <textarea class="w3-input w3-border" name="assignment" type="area" placeholder="Assigment..." style="height: 150px;"></textarea>
                                        </div>
                                    </div>
                                    <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding" type="submit">Add</button>
                                </form>
                              </div>`;

    document.getElementById("displayAllUsers").appendChild(parent);
    // --
    
}

function editUser(elem, id) {
    console.log(elem + "\n" + id);
    let parentNodes = elem.parentElement.childNodes;
    let name = "";

    parentNodes.forEach(element => {
        if(element.nodeName == "H4") {
            name = element.innerHTML;
        }
    });
    // --
    let parent = document.createElement("div");
    parent.classList = "w3-modal";
    parent.style.display = "block";
    parent.id = `popup_${id}`;
    parent.innerHTML = `<div class="w3-modal-content">
                            <header class="w3-container w3-blue">
                                <span onclick="document.getElementById('popup_${id}').remove();"
                                class="w3-button w3-display-topright">&times;</span>
                                <h2>Edit ${name}</h2>
                            </header>
                            <div class="w3-container">
                                <form action="/updateUser/${id}" class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin" method="POST" enctype="multipart/form-data">
                                    
                                    <div class="w3-row w3-section">
                                        <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                                          <div class="w3-half" id="fname">
                                            <input class="w3-input w3-border" name="fname" type="text" placeholder="First Name">
                                          </div>
                                          <div class="w3-half" id="lname">
                                            <input class="w3-input w3-border" name="lname" type="text" placeholder="Last Name">
                                          </div>
                                      </div>
                    
                                    <div class="w3-row w3-section">
                                        <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                                          <div class="w3-rest">
                                            <input class="w3-input w3-border" name="name" type="text" placeholder="Username">
                                          </div>
                                      </div>
                                    
                                    <div class="w3-row w3-section">
                                      <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-key"></i></div>
                                        <div class="w3-rest">
                                          <input class="w3-input w3-border" name="password" type="password" placeholder="Password">
                                        </div>
                                    </div>
                                    
                                    <div class="w3-row w3-section">
                                        <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-key"></i></div>
                                          <div class="w3-rest">
                                            <input class="w3-input w3-border" name="image" type="file">
                                          </div>
                                      </div>
                                    <button class="w3-button w3-block w3-section w3-blue w3-ripple w3-padding" type="submit">Register</button>
                                </form>
                              </div>`;

    document.getElementById("displayAllUsers").appendChild(parent);
    // --
    
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