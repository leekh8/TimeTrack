import React, { useState, useEffect } from "react";
import "../App.css";

const Timer = () => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    if (time === 0) {
      clearInterval(interval);
      alert("집중 시간이 끝났습니다!");
      setIsActive(false);
      setIsPaused(false);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, time]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        startTimer();
      } else if (e.key === " ") {
        e.preventDefault(); // 페이지 스크롤 방지
        pauseTimer();
      } else if (e.key === "Backspace") {
        e.preventDefault(); // 기본 Backspace 동작 방지
        resetTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(!isPaused);

  const resetTimer = () => {
    setTime(1500);
    setIsActive(false);
    setIsPaused(false);
  };

  const progressPercentage = ((1500 - time) / 1500) * 100;

  return (
    <div className="timer">
      <div className="time-display">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="timer-buttons">
        <button className="button start-button" onClick={startTimer}>
          {isActive && !isPaused ? "재시작" : "시작"}
        </button>
        <button className="button pause-button" onClick={pauseTimer}>
          {isPaused ? "계속" : "일시정지"}
        </button>
        <button className="button reset-button" onClick={resetTimer}>
          초기화
        </button>
      </div>
    </div>
  );
};

export default Timer;
