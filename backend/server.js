const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

// Create a MySQL connection pool with your RDS instance details
const pool = mysql.createPool({
  host: "todo1.cidtudnu7k64.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "todo1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL RDS");
    connection.release();
  }
});

const backendIP = "ec2-3-211-24-87.compute-1.amazonaws.com";

function corsMiddleware(req, res, next) {
  const allowedOrigins = [
    `http://${backendIP}:5000`,
    "http://cosc349-a1-frontend.s3-website-us-east-1.amazonaws.com",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);

  next();
}

const corsOptions = {
  origin: ["http://cosc349-a1-frontend.s3-website-us-east-1.amazonaws.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(corsMiddleware);

// GET route to fetch todos
app.get("/api/todos", (req, res) => {
  pool.query("SELECT * FROM todos", (error, results) => {
    if (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// POST route to add a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for a todo." });
  }

  pool.execute(
    "INSERT INTO todos (text) VALUES (?)",
    [text],
    (error, result) => {
      if (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(201).json({ id: result.insertId, text });
      }
    }
  );
});

// DELETE route to delete a todo
app.delete("/api/todos/:todoId", (req, res) => {
  const { todoId } = req.params;

  pool.execute(
    "DELETE FROM todos WHERE todoId = ?",
    [todoId],
    (error, result) => {
      if (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Internal server error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Todo not found" });
      } else {
        res.status(200).json({ message: "Todo deleted successfully" });
      }
    }
  );
});

// PUT route to update a todo
app.put("/api/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for a todo." });
  }

  pool.execute(
    "UPDATE todos SET text = ? WHERE todoId = ?",
    [text, todoId],
    (error, result) => {
      if (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: "Internal server error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Todo not found" });
      } else {
        res.status(200).json({ message: "Todo updated successfully" });
      }
    }
  );
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${backendIP}:${port}`);
});
