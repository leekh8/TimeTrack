import React, { useState, memo } from "react";
import "../App.css";
import { FiEdit, FiSave, FiTrash2 } from "react-icons/fi";

const Task = memo(({ task, toggleTaskCompletion, updateTask, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleSave = () => {
    if (newText.trim()) {
      updateTask(task.id, newText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewText(task.text); // 원래 텍스트로 복원
    setIsEditing(false);
  };

  const handleEditToggle = (e) => {
    e.stopPropagation();
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={`task-content ${task.completed ? "completed" : ""}`}
      onClick={() => !isEditing && toggleTaskCompletion(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isEditing) toggleTaskCompletion(task.id);
      }}
      aria-label={`할 일: ${task.text}${task.completed ? " (완료)" : ""}`}
    >
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label="완료 표시"
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
            } else if (e.key === "Escape") {
              e.preventDefault();
              handleCancel(); // ESC로 취소
            } else if (e.key === " ") {
              e.stopPropagation();
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="task-input-edit"
          autoFocus
        />
      ) : (
        <span className="task-text">{task.text}</span>
      )}

      <div className="task-buttons">
        <button
          className="edit-button"
          onClick={handleEditToggle}
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
          aria-label="삭제"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default Task;
