const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

//
app.get("/api/todo", (req, res) => {
  res.json(todos);
});

app.post("/api/todo", (req, res) => {
  const { text } = req.body;
  const newTodo = {
    id: nextId++,
    text,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
