const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const fs = require('fs');
const mysql = require('mysql2');

const conf = JSON.parse(fs.readFileSync('conf.json'));
const connection = mysql.createConnection(conf);

let todos = []; // Array per memorizzare le attività

// Eseguitore di Query
const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject();
            }
            console.log('done');
            resolve(result);
        });
    })
}

// Middleware per il parsing del corpo delle richieste
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve i file statici dalla cartella "public"

// Endpoint per ottenere la lista delle attività
app.get("/todo", async(req, res) => {
    const todos = await select();
    res.json({ todos });
});

// Endpoint per aggiungere nuove attività
app.post("/todo/add", async(req, res) => {
    const newTodos = req.body.todos;
    if (Array.isArray(newTodos)) {
        todos = newTodos; // Sovrascrive la lista con la nuova ricevuta
        await insert(todos);
        res.json({ success: true, todos });
    } else {
        res.status(400).json({ success: false, message: "Formato non valido" });
    }
});

const createTable = async function() {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS todo
       ( id INT PRIMARY KEY, 
          taskName VARCHAR(255) NOT NULL,
          task VARCHAR(255) NOT NULL, 
          finishTask VARCHAR(255) NOT NULL,
          deleteTask VARCHAR(255) NOT NULL ); 
       `);
}

const select = async function() {
    const sql = `
    SELECT id, taskName, task, finishTask, deleteTask FROM todo;
       `;
    return executeQuery(sql); 
}

const insert = async function(todo) {
    const template = `
    INSERT INTO todo (id, taskName, task, finishTask, deleteTask) VALUES ('$ID', '$TASKNAME', '$TASK', '$FINISHTASK', '$DELETETASK');
       `;

    let sql = template.replace("$ID", todo.id)
    .replace("$TASKNAME", todo.completed)
    .replace("$TASK", todo.task)
    .replace("$FINISHTASK", todo.finishTask)
    .replace("$DELETETASK", todo.deleteTask)

    return executeQuery(sql);
}

/*
const remove = async function(id) {
    const sql = `
    DELETE todo
    WHERE id="$ID";
       `;
    sql = sql.replace("%ID", id);
    return executeQuery(sql); 
}


const update = (todo) => {
    let template = `
    UPDATE todo
    SET finishTask=$FINISHTASK,
        deleteTask=$DELETETASK,
    WHERE id="$ID";
       `;

    let sql = template.replace("$ID", todo.id)
       .replace("$FINISHTASK", todo.finishTask)
       .replace("$DELETETASK", todo.deleteTask)

    return executeQuery(sql); 
}
*/

// Avvio del server
const PORT = 3000;
app.listen(PORT, async() => {
    await createTable();
    console.log('http in esecuzione su http://localhost:' + PORT);
});