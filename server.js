const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

let todos = []; // Array per memorizzare le attività

// Middleware per il parsing del corpo delle richieste
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve i file statici dalla cartella "public"

// Endpoint per ottenere la lista delle attività
app.get("/todo", (req, res) => {
    res.json({ todos });
});

// Endpoint per aggiungere nuove attività
app.post("/todo/add", (req, res) => {
    const newTodos = req.body.todos;
    if (Array.isArray(newTodos)) {
        todos = newTodos; // Sovrascrive la lista con la nuova ricevuta
        res.json({ success: true, todos });
    } else {
        res.status(400).json({ success: false, message: "Formato non valido" });
    }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});