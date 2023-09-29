import React from "react";

const TodoItem = ({ todo, onDelete, onEdit }) => {
  return (
    <li>
      {todo.text}
      <button className="delete-button" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
      <button className="edit-button" onClick={() => onEdit(todo.id)}>
        Edit
      </button>
    </li>
  );
};

export default TodoItem;
