import React, { useState, memo } from "react";
import "../App.css";
import { FiEdit, FiSave, FiTrash2 } from "react-icons/fi";
import { FaPlay, FaStop } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const Task = memo(({ task, toggleTaskCompletion, updateTask, deleteTask }) => {
  const { activeTask, setActiveTask, focusOnTask } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const isActiveTask = activeTask?.id === task.id;

  const handleSave = () => {
    if (newText.trim()) {
      updateTask(task.id, newText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewText(task.text);
    setIsEditing(false);
  };

  const handleEditToggle = (e) => {
    e.stopPropagation();
    if (isEditing) handleSave();
    else setIsEditing(true);
  };

  const handleFocusToggle = (e) => {
    e.stopPropagation();
    if (isActiveTask) {
      setActiveTask(null); // 해제만 — 타이머는 계속 실행
    } else {
      focusOnTask({ id: task.id, text: task.text }); // 설정 + 타이머 즉시 시작
    }
  };

  return (
    <div
      className={`task-content ${task.completed ? "completed" : ""} ${isActiveTask ? "task-content--active" : ""}`}
      onClick={() => !isEditing && toggleTaskCompletion(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isEditing) toggleTaskCompletion(task.id);
      }}
      aria-label={`할 일: ${task.text}${task.completed ? " (완료)" : ""}${isActiveTask ? " (집중 중)" : ""}`}
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
            if (e.key === "Enter") { e.preventDefault(); handleSave(); }
            else if (e.key === "Escape") { e.preventDefault(); handleCancel(); }
            else if (e.key === " ") e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          className="task-input-edit"
          autoFocus
        />
      ) : (
        <span className="task-text">{task.text}</span>
      )}

      <div className="task-buttons">
        {/* 집중 시작/해제 버튼 — 완료된 항목에는 숨김 */}
        {!task.completed && (
          <button
            className={`focus-button ${isActiveTask ? "focus-button--active" : ""}`}
            onClick={handleFocusToggle}
            aria-label={isActiveTask ? "집중 해제" : "이 할 일로 집중 시작"}
            title={isActiveTask ? "집중 해제" : "집중 시작"}
          >
            {isActiveTask ? <FaStop size={13} /> : <FaPlay size={13} />}
          </button>
        )}
        <button
          className="edit-button"
          onClick={handleEditToggle}
          aria-label={isEditing ? "저장" : "수정"}
        >
          {isEditing ? <FiSave size={16} /> : <FiEdit size={16} />}
        </button>
        <button
          className="delete-button"
          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
          aria-label="삭제"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default Task;
