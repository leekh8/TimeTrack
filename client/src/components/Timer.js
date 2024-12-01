import React, { useState, useEffect } from "react";
import { FaClock, FaRecycle, FaBed } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../App.css";

const Timer = () => {
  const [time, setTime] = useState(1500); // 기본 25분
  const [focusTime, setFocusTime] = useState(25); // 집중 시간 (기본 25분)
  const [breakTime, setBreakTime] = useState(5); // 휴식 시간 (기본 5분)
  const [repeatCycles, setRepeatCycles] = useState(1); // 반복 횟수 (기본 1회)
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startTimer = () => {
    setTime(focusTime * 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(!isPaused);

  const resetTimer = () => {
    setTime(isBreak ? breakTime * 60 : focusTime * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 모달 창 외부 클릭 감지 이벤트 핸들러
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  };

  // focusTime, breakTime 변경 시 time 값을 즉시 업데이트
  useEffect(() => {
    if (!isActive && !isBreak) {
      setTime(focusTime * 60);
    } else if (!isActive && isBreak) {
      setTime(breakTime * 60);
    }
  }, [focusTime, breakTime, isActive, isBreak]);

  useEffect(() => {
    let interval;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      clearInterval(interval);
      if (isBreak) {
        setIsBreak(false);
        setTime(focusTime * 60);
        setCurrentCycle((prevCycle) => prevCycle + 1);
      } else {
        setIsBreak(true);
        setTime(breakTime * 60);
      }

      if (!isBreak && currentCycle >= repeatCycles - 1) {
        setIsActive(false);
        setIsPaused(false);
        setCurrentCycle(0);
      }
    }

    return () => clearInterval(interval);
  }, [
    time,
    isActive,
    isPaused,
    isBreak,
    focusTime,
    breakTime,
    currentCycle,
    repeatCycles,
  ]);

  const totalTime = focusTime * 60 + breakTime * 60;
  const elapsed = isBreak ? breakTime * 60 - time : focusTime * 60 - time;
  const percentage = (elapsed / totalTime) * 100;

  const adjustValue = (setter, value, delta, min, max) => {
    const newValue = value + delta;
    if (newValue >= min && newValue <= max) {
      setter(newValue);
    }
  };

  return (
    <div className="timer-container">
      <div className="timer">
        <CircularProgressbar
          value={percentage}
          text={`${Math.floor(time / 60)}:${String(time % 60).padStart(
            2,
            "0"
          )}`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: isBreak ? "var(--accent-color)" : "var(--main-color)",
            trailColor: "#eee",
          })}
        />
      </div>
      <div className="timer-controls">
        <button className="start-button" onClick={startTimer}>
          {isActive ? "재시작" : "시작"}
        </button>
        <button className="pause-button" onClick={pauseTimer}>
          {isPaused ? "계속" : "일시정지"}
        </button>
        <button className="reset-button" onClick={resetTimer}>
          초기화
        </button>
        <button className="set-time-button" onClick={openModal}>
          시간 설정
        </button>
      </div>

      {/* 설정 모달 창 */}
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <h3>시간 설정</h3>
            <span className="close-button" onClick={closeModal}>
              &#10007;
            </span>
            <div className="modal-input">
              <label>
                <FaClock style={{ marginRight: "5px" }} />
                집중 시간 (분):
              </label>
              <div className="input-with-buttons">
                <button
                  className="adjust-button"
                  onClick={() =>
                    adjustValue(setFocusTime, focusTime, -5, 5, 60)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={focusTime}
                  onChange={(e) => setFocusTime(Number(e.target.value))}
                  min="1"
                  max="60"
                />
                <button
                  className="adjust-button"
                  onClick={() => adjustValue(setFocusTime, focusTime, 5, 5, 60)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="modal-input">
              <label>
                <FaBed style={{ marginRight: "5px" }} />
                휴식 시간 (분):
              </label>
              <div className="input-with-buttons">
                <button
                  className="adjust-button"
                  onClick={() =>
                    adjustValue(setBreakTime, breakTime, -5, 5, 30)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  min="1"
                  max="30"
                />
                <button
                  className="adjust-button"
                  onClick={() => adjustValue(setBreakTime, breakTime, 5, 5, 30)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="modal-input">
              <label>
                <FaRecycle style={{ marginRight: "5px" }} />
                반복 횟수:
              </label>
              <div className="input-with-buttons">
                <button
                  className="adjust-button"
                  onClick={() =>
                    adjustValue(setRepeatCycles, repeatCycles, -1, 1, 10)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={repeatCycles}
                  onChange={(e) => setRepeatCycles(Number(e.target.value))}
                  min="1"
                  max="10"
                />
                <button
                  className="adjust-button"
                  onClick={() =>
                    adjustValue(setRepeatCycles, repeatCycles, 1, 1, 10)
                  }
                >
                  +
                </button>
              </div>
            </div>
            <button className="save-button" onClick={closeModal}>
              &#10003;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
