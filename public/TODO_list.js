let inputTask = document.getElementById("inputTask");
let submitTask = document.getElementById("submitTask");
let tableData =  document.getElementById("tableData");

let cont = 0;
let todos = [];

submitTask.onclick = () => {
    todos.push({
        task : "<p>" + inputTask.value + "</p>",
        finishTask : "<button type='button' class='finish blank' id='finish" + cont + "'>Finish</button>",
        deleteTask : "<button type='button' class='delete' id='delete" + cont + "'>Delete</button>"
    });

    cont++;

    render(tableData);
}

const render = (parentElement) => {

    let html = ""

    todos.forEach((e) => {
        html += "<tr><td>" + e.task + "</td><td>" + e.finishTask + "</td><td>" + e.deleteTask + "</td></tr>"
    });
    
    parentElement.innerHTML = html;
    //Finish
    document.querySelectorAll(".finish").forEach((e) => {
        e.onclick = () => {
            if (e.classList.contains("green")) {
                e.classList.remove("green");
                e.classList.add("blank");
            } else {
                e.classList.remove("blank");
                e.classList.add("green");
            }
        }
    })

    //Delete
    document.querySelectorAll(".delete").forEach((e, index) => { 
        e.onclick = () => {
            console.log(todos.splice(index,1));
            render(parentElement);
        }
    })

}

render(tableData);