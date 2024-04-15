setInterval(changeDigitalClock, 1000);
function changeDigitalClock(){
    let digitalClock = document.getElementById("digitalClock");
    digitalClock.innerHTML = new Date().toLocaleString().split(" ")[1];
}

setInterval(updateAssignments(), 5000);
function updateAssignments(){
    removeAssignments();
    getAssignments();
}


function getAssignments(){
    fetch('/getAssignments')
    .then(response => response.json())
    .then((response) => {
            let assignments = response;
            for(let i = 0; i < assignments.length; i++) {
                setAssignment(assignments[i]);
            }
    })
    .catch((e) => {
        console.log(e);
    })
}

function removeAssignments(){
    let assignments = [];

    document.getElementById("assignmentCards").childNodes.forEach((e) => assignments.push(e));
    document.getElementById("finishedAssignments").childNodes.forEach((e) => assignments.push(e));
    assignments.forEach((e) => e.remove());
    assignments = [];
}

function setAssignment(assignment){
    let elem = document.createElement("div");
    elem.classList = "assignmentCard w3-card-4";
    elem.innerHTML = `<img src="/inc/pictures/img_snowtops.jpg" alt="Alps"><p><b>[${assignment.id}]${assignment.content}</b><br></p>`;
    if(assignment.status != 1) elem.innerHTML += "<button onclick='finished(this);'>Finished</button>";
    if(assignment.status == 1) elem.innerHTML += "<button onclick='undo(this);'>Undo</button>";
    elem.id = `assignment-${assignment.id}`;

    if(assignment.status == 0) {
        document.getElementById("assignmentCards").appendChild(elem);
    } else {
        document.getElementById("finishedAssignments").appendChild(elem);
    }
}

function finished(e){
    let parent = e.parentElement;
    let assignmentID = (parent.id).split('-')[1];
    
    fetch(`/finishedAssignment/${assignmentID}`)
    .catch(error => console.error(error));
    
    removeAssignments();
    getAssignments();
}

function undo(e) {
    let parent = e.parentElement;
    let assignmentID = (parent.id).split('-')[1];
    
    fetch(`/undoAssignment/${assignmentID}`)
    .catch(error => console.error(error));

    removeAssignments();
    getAssignments();
}

// --
//Analog Clock
let hr = document.querySelector('#hr');
let mn = document.querySelector('#mn');
let sc = document.querySelector('#sc');

setInterval(() =>{
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * 6;
    let ss = day.getSeconds() * 6;

    hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`; 
});