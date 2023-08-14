import "./App.css";
import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newToDo, setNewTodo] = useState("");

  //Function to add a to do to the page
  const handleAddTodo = () => {
    if (newToDo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newToDo }]);
      setNewTodo("");
    }
  };

  const handleDeleteToDo = (id) => {
    const tempData = todos.filter((item) => item.id !== id);
    setTodos(tempData);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newToDo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
