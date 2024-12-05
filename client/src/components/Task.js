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
    <div
      className={`task-content ${task.completed ? "completed" : ""}`}
      onClick={() => toggleTaskCompletion(task.id)}
    >
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)} // 체크박스 클릭 이벤트
          onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
        />
      </div>
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
        <span className="task-text">{task.text}</span>
      )}
      <div className="task-buttons">
        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            isEditing ? handleSave() : handleEdit();
          }}
          aria-label={isEditing ? "저장" : "수정"}
        >
          {isEditing ? <FiSave size={16} /> : <FiEdit size={16} />}
        </button>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Task;
