import React, { useState } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <header className="header">
        <img src={logo} alt="TimeTrack Logo" className="logo" />
        <h1>TimeTrack</h1>
        <button className="button toggle-button" onClick={toggleDarkMode}>
          {darkMode ? "라이트 모드" : "다크 모드"}
        </button>
      </header>
      <main className="main-content">
        <Timer />
        <TaskList />
      </main>
    </div>
  );
}

export default App;
