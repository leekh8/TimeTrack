import React, { useState, useEffect } from "react";
import { FaClock, FaRecycle, FaBed } from "react-icons/fa";
import "../App.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // 종료 모달

  const startTimer = () => {
    if (!focusTime || focusTime <= 0) {
      setFocusTime(25);
      setTime(25 * 60);
    } else {
      setTime(focusTime * 60);
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setTime(isBreak ? breakTime * 60 : focusTime * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEndModal = () => setIsEndModalOpen(true);
  const closeEndModal = () => setIsEndModalOpen(false);

  // 모달 창 외부 클릭 감지 이벤트 핸들러
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
      closeEndModal(); // 종료 모달도 동일하게 닫기
    }
  };

  useEffect(() => {
    let interval = null;

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
        openEndModal(); // 종료 모달 열기
        setIsActive(false);
        setIsPaused(false);
        setIsBreak(false);
        setCurrentCycle(0);
      } else {
        setIsActive(true);
        setIsPaused(false);
      }
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    isPaused,
    time,
    currentCycle,
    repeatCycles,
    focusTime,
    breakTime,
    isBreak,
  ]);

  const handleFocusTimeChange = (e) => {
    setFocusTime(Number(e.target.value));
  };

  const handleBreakTimeChange = (e) => {
    setBreakTime(Number(e.target.value));
  };

  const handleRepeatCycleChange = (e) => {
    setRepeatCycles(Number(e.target.value));
  };

  // 원형 프로그래스 바의 퍼센티지 계산 (전체 사이클 기준)
  const totalCycleTime = focusTime * 60 + breakTime * 60;
  const elapsedTime = isBreak
    ? breakTime * 60 - time + focusTime * 60
    : focusTime * 60 - time;
  const percentage = (elapsedTime / totalCycleTime) * 100;

  return (
    <div className="timer">
      <div className="circular-timer">
        <CircularProgressbar
          value={percentage}
          text={`${Math.floor(time / 60)}:${String(time % 60).padStart(
            2,
            "0"
          )}`}
          styles={buildStyles({
            textColor: "#333",
            pathColor: isBreak ? "var(--break-color)" : "var(--main-color)",
            trailColor: "#eee",
          })}
        />
      </div>
      <div className="timer-controls">
        <button className="button start-button" onClick={startTimer}>
          {isActive && !isPaused ? "재시작" : "시작"}
        </button>
        <button className="button pause-button" onClick={pauseTimer}>
          {isPaused ? "계속" : "일시정지"}
        </button>
        <button className="button reset-button" onClick={resetTimer}>
          초기화
        </button>
        <button className="button set-time-button" onClick={openModal}>
          시간 설정
        </button>
      </div>

      {/* 설정 모달 창 */}
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>시간 설정</h3>
            <div className="modal-input-container">
              <label>
                <FaClock style={{ marginRight: "5px" }} />
                집중 시간 (분):
              </label>
              <input
                type="number"
                value={focusTime}
                onChange={handleFocusTimeChange}
                min="5"
                max="60"
              />
            </div>
            <div className="modal-input-container">
              <label>
                <FaBed style={{ marginRight: "5px" }} />
                휴식 시간 (분):
              </label>
              <input
                type="number"
                value={breakTime}
                onChange={handleBreakTimeChange}
                min="1"
                max="30"
              />
            </div>
            <div className="modal-input-container">
              <label>
                <FaRecycle style={{ marginRight: "5px" }} />
                반복 횟수:
              </label>
              <input
                type="number"
                value={repeatCycles}
                onChange={handleRepeatCycleChange}
                min="1"
                max="10"
              />
            </div>
            <button className="button save-button" onClick={closeModal}>
              저장
            </button>
          </div>
        </div>
      )}

      {/* 타이머 종료 모달 창 */}
      {isEndModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <span className="close-button" onClick={closeEndModal}>
              &times;
            </span>
            <h3>타이머 종료</h3>
            <p>모든 사이클이 끝났습니다.</p>
            <button className="button save-button" onClick={closeEndModal}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
