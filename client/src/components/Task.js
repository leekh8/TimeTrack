import React, { useState } from "react";
import "../App.css";
import { FiEdit, FiSave, FiTrash2 } from "react-icons/fi";

const Task = ({ task, toggleTaskCompletion, updateTask, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (newText.trim()) {
      updateTask(task.id, newText);
      setIsEditing(false);
    }
  };

  return (
    <div className="task-content">
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            } else if (e.key === " ") {
              e.stopPropagation(); // Space 키 이벤트 전파 방지
            }
          }}
          className="task-input-edit"
        />
      ) : (
        <span
          className="task-text"
          onClick={() => toggleTaskCompletion(task.id)}
        >
          {task.text}
        </span>
      )}
      <div className="task-buttons">
        <button
          className="button edit-button"
          onClick={isEditing ? handleSave : handleEdit}
        >
          {isEditing ? <FiSave size={16} /> : <FiEdit size={16} />}
        </button>
        <button
          className="button delete-button"
          onClick={() => deleteTask(task.id)}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Task;
