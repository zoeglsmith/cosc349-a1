import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedText, setEditedText] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:80/api/todos");
      if (response.ok) {
        const todosData = await response.json();
        setTodos(todosData);
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
        const response = await fetch("http://localhost:80/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTodo }),
        });

        if (response.ok) {
          const newTodoData = await response.json();
          console.log("New todo added:", newTodoData);
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
      console.log("Trying to delete todo:", id);
      const response = await fetch(`http://localhost:80/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Todo deleted successfully:", id, text);
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
        console.log("Trying to edit todo:", id);
        const response = await fetch(`http://localhost:80/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        });

        if (response.ok) {
          console.log("Todo edited successfully:", id);
          const updatedTodos = todos.map((todo) =>
            todo._id === id ? { ...todo, text: editedText } : todo
          );
          setTodos(updatedTodos);
          setEditing(null);
        } else {
          console.error("Error editing todo");
        }
      } catch (error) {
        console.error("Error editing todo:", error);
      }
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
          className="input-field"
        />
        <button onClick={handleAddTodo} className="add-button">Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {editing === todo._id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(todo._id)} className="edit-button">Save</button>
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
