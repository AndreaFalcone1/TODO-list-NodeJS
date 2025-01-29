let inputTask = document.getElementById("inputTask");
let submitTask = document.getElementById("submitTask");
let tableData =  document.getElementById("tableData");

let cont = 0;
let todos = [];

const send = (todo) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json); // risposta del server all'aggiunta
        })
    })
}

const load = () => {
   return new Promise((resolve, reject) => {
        fetch("/todo")
        .then((response) => response.json())
        .then((json) => {
            resolve(json); // risposta del server con la lista
        })
    })
}

submitTask.onclick = () => {
    todos.push({
        task : "<p>" + inputTask.value + "</p>",
        finishTask : "<button type='button' class='finish blank' id='finish" + cont + "'>Finish</button>",
        deleteTask : "<button type='button' class='delete' id='delete" + cont + "'>Delete</button>"
    });

    cont++;
    
    send({todos : todos})
        .then(() => load())
        .then(json => {
            todos = json.todos
        }),
    inputTask.value = ""
    render(tableData);
}

const render = (parentElement) => {
    load

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

load().then((json) => {
    todos = json.todos
    render(tableData);
})