import React, { useState } from "react";
import SEO from "./components/SEO";
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
    <>
      <SEO
        title="TimeTrack - 집중력과 생산성을 높이는 Pomodoro 타이머"
        description="Pomodoro 타이머와 작업 관리로 집중력을 유지하고 생산성을 극대화하세요."
        keywords={[
          "Pomodoro Timer",
          "Online Pomodoro Timer",
          "Task Management",
          "Productivity Tools",
          "TimeTrack",
          "Focus Booster",
          "뽀모도로 타이머",
          "온라인 뽀모도로 타이머",
          "집중력 향상",
          "타임트랙",
          "작업 관리",
        ]}
        image="%PUBLIC_URL%/og-image.png"
        url="https://time-track-psi.vercel.app/"
      />

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
    </>
  );
}

export default App;
