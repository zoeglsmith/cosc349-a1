import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedText, setEditedText] = useState("");
  const apiUrl = "http://ec2-3-211-24-87.compute-1.amazonaws.com:5000";
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const storedEditedText = localStorage.getItem("editedText");
    if (storedEditedText) {
      setEditedText(storedEditedText);
    }
  }, []);

  const fetchTodos = async () => {
    console.log("Fetching todos...");
    try {
      const response = await fetch(`${apiUrl}/api/todos`);
      if (response.ok) {
        const todosData = await response.json();
        setTodos(todosData);
        // setLoading(false); // Data has arrived, set loading to false
      } else {
        console.error("Error fetching todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        console.log("Adding new todo:", newTodo);
        const response = await fetch(`${apiUrl}/api/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTodo }),
        });

        if (response.ok) {
          const newTodoData = await response.json();
          console.log("Added new todo:", newTodoData);
          setTodos([...todos, newTodoData]);
          setNewTodo("");
        } else {
          console.error("Error adding todo");
        }
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteToDo = async (id, text) => {
    try {
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      } else {
        console.error("Error deleting todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditToDo = (id, text) => {
    setEditing(id);
    setEditedText(text);
  };

  const handleSaveEdit = async (id) => {
    if (editedText.trim() !== "") {
      try {
        const response = await fetch(`${apiUrl}/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        });

        if (response.ok) {
          const updatedTodos = todos.map((todo) =>
            todo._id === id ? { ...todo, text: editedText } : todo
          );
          setTodos(updatedTodos);
          setEditing(null);
          localStorage.removeItem("editedText"); // Clear edited text from local storage
        } else {
          console.error("Error editing todo");
        }
      } catch (error) {
        console.error("Error editing todo:", error);
      }
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      console.log("Toggling completion for task with ID:", id);

      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        console.log("API response for toggling completion:", response);

        const updatedTodos = todos.map((todo) =>
          todo._id === id ? { ...todo, completed } : todo
        );
        console.log("Updated todos array:", updatedTodos);

        setTodos(updatedTodos);
      } else {
        console.error("Error updating todo status");
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  return (
    <div className="App">
      <h1 className="app-heading">To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new To Do"
          className="input-field"
          id="Add"
        />
        <button onClick={handleAddTodo} className="add-button">
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo._id, !todo.completed)}
            />
            {editing === todo._id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button
                  onClick={() => handleSaveEdit(todo._id)}
                  className="edit-button"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {todo.text}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteToDo(todo._id, todo.text)}
                >
                  Delete
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEditToDo(todo._id, todo.text)}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
