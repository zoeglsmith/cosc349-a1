const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Update with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let todosCollection;

(async () => {
  try {
    await client.connect();
    todosCollection = client.db("todoapp").collection("todos");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await todosCollection.find({}).toArray();
    res.json(todos);
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  const newTodo = {
    text,
  };

  try {
    const result = await todosCollection.insertOne(newTodo);
    newTodo._id = result.insertedId;
    res.json(newTodo);
  } catch (error) {
    console.error("Error creating new todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const result = await todosCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { text } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Todo updated successfully" });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await todosCollection.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT_BACKEND || 3002;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
