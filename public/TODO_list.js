let inputTask = document.getElementById("inputTask");
let submitTask = document.getElementById("submitTask");
let tableData =  document.getElementById("tableData");

let cont = 0;
let todos = [];

//Metodo per mandare al server i dati
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

//Metodo per prendere i dati dal server
const load = () => {
   return new Promise((resolve, reject) => {
        fetch("/todo")
        .then((response) => response.json())
        .then((json) => {
            resolve(json); // risposta del server con la lista
        })
    })
}

submitTask.onclick = () => { //Click del botte per aggiungere una task
    todos.push({
        taskName : inputTask.value,
        task : "<p class='blank'>" + inputTask.value + "</p>",
        finishTask : "<button type='button' class='finish blank' id='finish" + cont + "'>Finish</button>",
        deleteTask : "<button type='button' class='delete blank' id='delete" + cont + "'>Delete</button>"
    });

    cont++;
    
    send({todos : todos}) //Invio i dati al server
        .then(() => load()) //Scarico i dati
        .then(json => {
            todos = json.todos
        })
    inputTask.value = ""

    render(tableData); //Aggiorno la tabella
}

const render = (parentElement) => {
    load

    let html = ""

    todos.forEach((e) => { //Intestazione della tabella
        html += "<tr><td>" + e.task + "</td><td>" + e.finishTask + "</td><td>" + e.deleteTask + "</td></tr>"
    });
    
    parentElement.innerHTML = html;

    //Bottone 'Finish' 
    document.querySelectorAll(".finish").forEach((e, index) => {
        e.onclick = () => {
            if (e.classList.contains("green")) {
                
                todos[index].task = "<p class='blank'>" + todos[index].taskName + "</p>"
                todos[index].finishTask = "<button type='button' class='finish blank' id='finish" + cont + "'>Finish</button>"
                todos[index].deleteTask = "<button type='button' class='delete blank' id='delete" + cont + "'>Delete</button>"

            } else {
                
                todos[index].task = "<p class='green'>" + todos[index].taskName + "</p>"
                todos[index].finishTask = "<button type='button' class='finish green' id='finish" + cont + "'>Finish</button>"
                todos[index].deleteTask = "<button type='button' class='delete green' id='delete" + cont + "'>Delete</button>"

            }
            send({todos : todos})
                .then(() => load())
                .then(json => {
                    todos = json.todos
                })
            render(parentElement);
        }
    })

    //Bottone 'Delete'
    document.querySelectorAll(".delete").forEach((e, index) => { 
        e.onclick = () => {
            todos.splice(index,1);
            send({todos : todos})
                .then(() => load())
                .then(json => {
                    todos = json.todos
                })
            render(parentElement);
        }
    })

}

//Scaroco dal server l'ultima lista di task
load().then((json) => {
    todos = json.todos
    render(tableData);
})