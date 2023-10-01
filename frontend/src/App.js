import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedText, setEditedText] = useState("");
  const apiUrl =
    "http://ec2-3-211-24-87.compute-1.amazonaws.com:5000/api/todos";

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(apiUrl);
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
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTodo }),
        });

        if (response.ok) {
          const newTodoData = await response.json();
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

  const handleDeleteToDo = async (todoId) => {
    try {
      const response = await fetch(`${apiUrl}/${todoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTodos = todos.filter((todo) => todo.todoId !== todoId);
        setTodos(updatedTodos);
      } else {
        console.error("Error deleting todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditToDo = (todoId, text) => {
    setEditing(todoId);
    setEditedText(text);
  };

  const handleSaveEdit = async (todoId) => {
    if (editedText.trim() !== "") {
      try {
        const response = await fetch(`${apiUrl}/${todoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        });

        if (response.ok) {
          const updatedTodos = todos.map((todo) =>
            todo.todoId === todoId ? { ...todo, text: editedText } : todo
          );
          setTodos(updatedTodos);
          setEditing(null);
          setEditedText("");
        } else {
          console.error("Error editing todo");
        }
      } catch (error) {
        console.error("Error editing todo:", error);
      }
    }
  };
  const handleToggleComplete = async (todoId, completed) => {
    try {
      const response = await fetch(`${apiUrl}/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedTodos = todos.map((todo) =>
          todo.todoId === todoId ? { ...todo, completed } : todo
        );
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
        />
        <button onClick={handleAddTodo} className="add-button">
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.todoId}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                handleToggleComplete(todo.todoId, !todo.completed)
              }
            />
            {editing === todo.todoId ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button
                  onClick={() => handleSaveEdit(todo.todoId)}
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
                  onClick={() => handleDeleteToDo(todo.todoId)}
                >
                  Delete
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEditToDo(todo.todoId, todo.text)}
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
