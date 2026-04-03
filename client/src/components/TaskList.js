import React, { useState, useEffect } from "react";
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

  // tasks 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("timetrack-tasks", JSON.stringify(tasks));
  }, [tasks]);

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
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTasks(items);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="task-list">
      <div className="task-input-container">
        <input
          className="task-input"
          type="text"
          placeholder="할 일을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
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

      {tasks.length > 0 && (
        <p className="task-progress">
          {completedCount} / {tasks.length} 완료
        </p>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="task-list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
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
                <li className="task-empty">할 일이 없습니다.</li>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
