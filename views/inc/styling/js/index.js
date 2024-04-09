setInterval(changeDigitalClock, 1000);
function changeDigitalClock(){
    let elem = document.getElementById("digitalClock");

    let date = new Date().toLocaleString().split(" ");
    elem.innerHTML = date[1];
}

setAssignments();
function setAssignments(){
    fetch('/getAssignments')
    .then(response => response.json())
    .then((response) => {
            let assignments = response;
            let parentTodo = document.getElementById("assignments");
            let parentFinished = document.getElementById("finishedAssignments");
            for(let i = 0; i < assignments.length; i++) {
                let elem = document.createElement("div");
                elem.innerHTML = `<p>${assignments[i].content}</p>`;
                elem.id = `assignment${i}`;
                elem.classList = "w3-container w3-dark-grey assignmentCard";

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