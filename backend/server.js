const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let todosCollection;

(async () => {
  try {
    await client.connect();
    todosCollection = client.db().collection("todos");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Define a function to check the origin and allow CORS for your frontend S3 bucket
function corsMiddleware(req, res, next) {
  const allowedOrigins = [
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
  origin: "http://cosc349-a1-frontend.s3-website-us-east-1.amazonaws.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
// // Temporary CORS middleware for testing (not for production)
// function tempDisableCors(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   next();
// }

// // Apply the temporary CORS middleware to your routes for testing
// app.use(tempDisableCors);

app.use(cors(corsOptions));

app.get("/api/todos", async (req, res) => {
  console.log("Received GET request to /api/todos");
  try {
    const todos = await todosCollection.find({}).toArray();
    res.json(todos);
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a test route for POST requests
app.post("/test-post", (req, res) => {
  res.json({ message: "Test POST request successful" });
});

// app.post("/api/todos", async (req, res) => {
//   console.log("Received GET request to /api/todos");
//   const { text, completed } = req.body;
//   const newTodo = {
//     text,
//     completed,
//   };

//   try {
//     const result = await todosCollection.insertOne(newTodo);
//     newTodo._id = result.insertedId;
//     res.json(newTodo);
//   } catch (error) {
//     console.error("Error creating new todo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    console.log("Updating task completion for ID:", id);

    const result = await todosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { text, completed } }
    );

    if (result.matchedCount === 1) {
      console.log("Task updated successfully:", result);
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
  const todoId = req.params.id;

  try {
    console.log("Todo ID to be deleted:", todoId);
    const deletedTodo = await todosCollection.findOneAndDelete({
      _id: new ObjectId(todoId),
    });
    console.log("Deleted todo:", deletedTodo);

    if (!deletedTodo.value) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
