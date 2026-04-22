import React, { useState, useEffect, useRef } from "react";
import Task from "./Task";
import "../App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const loadTasks = () => {
  try {
    const saved = localStorage.getItem("timetrack-tasks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const TaskList = () => {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("timetrack-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // N 키 → 할 일 입력 포커스
  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "KeyN") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const addTask = () => {
    if (input.trim()) {
      setTasks((prev) => [
        ...prev,
        { id: `${Date.now()}`, text: input.trim(), completed: false },
      ]);
      setInput("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    // 미완료 항목만 드래그 가능
    const active = tasks.filter((t) => !t.completed);
    const completed = tasks.filter((t) => t.completed);
    const [moved] = active.splice(result.source.index, 1);
    active.splice(result.destination.index, 0, moved);
    setTasks([...active, ...completed]);
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="task-list">
      {/* 입력 영역 */}
      <div className="task-input-container">
        <input
          ref={inputRef}
          className="task-input"
          type="text"
          placeholder="할 일을 입력하세요 (N)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTask(); }
          }}
        />
        <button
          className={`add-button ${input.trim() ? "active" : ""}`}
          onClick={addTask}
          disabled={!input.trim()}
        >
          &#x2B;
        </button>
      </div>

      {/* 진행률 */}
      {tasks.length > 0 && (
        <div className="task-progress-wrap">
          <div className="task-progress-track">
            <div
              className="task-progress-bar"
              style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
            />
          </div>
          <span className="task-progress-label">
            {completedTasks.length} / {tasks.length} 완료
          </span>
        </div>
      )}

      {/* 미완료 항목 — 드래그 가능 */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="task-list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {activeTasks.length > 0 ? (
                activeTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <li
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Task
                          task={task}
                          toggleTaskCompletion={toggleTaskCompletion}
                          updateTask={updateTask}
                          deleteTask={deleteTask}
                        />
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <li className="task-empty">
                  {completedTasks.length > 0 ? "🎉 모든 할 일 완료!" : "할 일이 없습니다."}
                </li>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* 완료 항목 접기/펼치기 */}
      {completedTasks.length > 0 && (
        <div className="completed-section">
          <button
            className="toggle-completed-btn"
            onClick={() => setShowCompleted((v) => !v)}
          >
            {showCompleted ? "▲" : "▼"} 완료된 항목 {completedTasks.length}개
          </button>

          {showCompleted && (
            <>
              <ul className="task-list-container completed-list">
                {completedTasks.map((task) => (
                  <li key={task.id} className="task-item task-item--completed">
                    <Task
                      task={task}
                      toggleTaskCompletion={toggleTaskCompletion}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  </li>
                ))}
              </ul>
              <button className="clear-completed-btn" onClick={clearCompleted}>
                완료 항목 전체 삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
