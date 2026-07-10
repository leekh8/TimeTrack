import React, { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { FiEdit, FiSave, FiTrash2 } from "react-icons/fi";
import { FaPlay, FaStop } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const Task = memo(({ task, toggleTaskCompletion, updateTask, deleteTask }) => {
  const { activeTask, focusOnTask, unfocusTask } = useAppContext();
  const { t } = useTranslation();
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
      unfocusTask(); // activeTask 해제 + 타이머 일시정지
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
      aria-label={`${t("task.ariaTask", { text: task.text })}${task.completed ? t("task.ariaDone") : ""}${isActiveTask ? t("task.ariaFocusing") : ""}`}
    >
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={t("task.check")}
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
            aria-label={isActiveTask ? t("task.focusStop") : t("task.focusStart")}
            title={isActiveTask ? t("task.focusStopShort") : t("task.focusStartShort")}
          >
            {isActiveTask ? <FaStop size={13} /> : <FaPlay size={13} />}
          </button>
        )}
        <button
          className="edit-button"
          onClick={handleEditToggle}
          aria-label={isEditing ? t("task.save") : t("task.edit")}
        >
          {isEditing ? <FiSave size={16} /> : <FiEdit size={16} />}
        </button>
        <button
          className="delete-button"
          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
          aria-label={t("task.delete")}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
});

export default Task;
