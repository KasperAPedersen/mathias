setInterval(changeDigitalClock, 1000);
function changeDigitalClock(){
    let digitalClock = document.getElementById("digitalClock");
    digitalClock.innerHTML = new Date().toLocaleString().split(" ")[1];
}


function setAssignment(assignment) {

    
    let parentTodo = document.getElementById("assignmentCards");
    let parentFinished = document.getElementById("finishedAssignments");
    

    let elem = document.createElement("div");
    elem.classList = "assignmentCard";
    elem.innerHTML = `<p><b>[${assignment.id}]${assignment.content}</b><br></p>`;
    if(assignment.status != 1) elem.innerHTML += "<button onclick='finished(this);'>Finished</button>";
    elem.id = `assignment-${assignment.id}`;

    
    console.log(assignment.status);
    if(assignment.status == 0) {
        parentTodo.appendChild(elem);
    } else {
        parentFinished.appendChild(elem);
    }
}
setInterval(setAssignments(), 5000);
function setAssignments(){
    let parentTodo = document.getElementById("assignmentCards");
    let parentFinished = document.getElementById("finishedAssignments");
    parentTodo.innerHTML = "";
    parentFinished.innerHTML = "";

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

function finished(e){
    let parent = e.parentElement;
    let assignmentID = (parent.id).split('-')[1];
    

    fetch(`/finishedAssignment/${assignmentID}`)
    .catch(error => console.error(error));
    setAssignments();
}