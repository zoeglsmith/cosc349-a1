import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch("http://localhost:3002/api/todos", {
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

  const handleDeleteToDo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/api/todos/${id}`, {
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
        const response = await fetch(`http://localhost:3002/api/todos/${id}`, {
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
        } else {
          console.error("Error editing todo");
        }
      } catch (error) {
        console.error("Error editing todo:", error);
      }
    }
  };

  const fetchMoreData = () => {
    // Fetch more data or set hasMore to false
    setHasMore(false);
  };

  return (
    <div className="App">
      <h1>To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* Lazy Loading with react-infinite-scroll-component */}
      <InfiniteScroll
        dataLength={todos.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              {editing === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(todo._id)}>Save</button>
                </>
              ) : (
                <>
                  {todo.text}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteToDo(todo._id)}
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
      </InfiniteScroll>
    </div>
  );
}

export default App;
