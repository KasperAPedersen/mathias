setInterval(changeDigitalClock, 1000);
function changeDigitalClock(){
    let elem = document.getElementById("digitalClock");

    let date = new Date().toLocaleString().split(" ");
    elem.innerHTML = date[1];
}

setInterval(setAssignments(), 5000);
function setAssignments(){
    let parentTodo = document.getElementById("assignmentCards");
    let parentFinished = document.getElementById("finishedAssignments");

    for(let i = 0; i < parentTodo.childNodes.length; i++) {
        parentTodo.childNodes[i].remove();
    }
    fetch('/getAssignments')
    .then(response => response.json())
    .then((response) => {
            let assignments = response;
            for(let i = 0; i < assignments.length; i++) {
                let elem = document.createElement("div");
                elem.classList = "assignmentCard";
                elem.innerHTML = `<p><b>[${assignments[i].id}]${assignments[i].content}</b><br>Written in Javascript</p>`;
                if(assignments[i].status != 1) elem.innerHTML += "<button onclick='finished(this);'>Finished</button>";
                elem.id = `assignment-${assignments[i].id}`;
                
                if(assignments[i].status == 0) {
                    parentTodo.appendChild(elem);
                } else {
                    parentFinished.appendChild(elem);
                }
            }
    })
    .catch((e) => {
        console.log(e);
    })
}

function finished(e){
    let parent = e.parentElement;
    let assignmentID = (parent.id).split('-')[1];
    parent.remove();
    

    fetch(`/finishedAssignment/${assignmentID}`)
    .catch(error => console.error(error));
    setAssignments();
}