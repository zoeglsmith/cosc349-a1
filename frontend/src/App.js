import "./App.css";
import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newToDo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(false);

  // Function to add a to do to the page
  const handleAddTodo = () => {
    if (newToDo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newToDo }]);
      setNewTodo("");
    }
  };

  //Functiont to do delete a task
  const handleDeleteToDo = (id) => {
    const tempData = todos.filter((item) => item.id !== id);
    setTodos(tempData);
  };

  const handleEditToDo = (id) => {
    setEditing(true);
  };

  return (
    <div className="App">
      <h1>To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newToDo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button
              className="delete-button"
              onClick={() => handleDeleteToDo(todo.id)}
            >
              Delete
            </button>
            <button
              className="edit-button"
              onClick={() => handleEditToDo(todo.id)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
