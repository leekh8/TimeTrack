import React, { useState, useEffect, useRef } from "react";
import { FaClock, FaRecycle, FaBed } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../App.css";
import { useAppContext } from "../context/AppContext";

const DEFAULTS = {
  focusTime: 25,
  breakTime: 5,
  repeatCycles: 1,
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem("timetrack-settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

const playBeep = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);
};

const Timer = () => {
  const { darkMode } = useAppContext();
  const saved = loadSettings();
  const [focusTime, setFocusTime] = useState(saved.focusTime);
  const [breakTime, setBreakTime] = useState(saved.breakTime);
  const [repeatCycles, setRepeatCycles] = useState(saved.repeatCycles);

  const [time, setTime] = useState(saved.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 최신 상태를 interval 콜백에서 참조하기 위한 ref
  const stateRef = useRef({});
  stateRef.current = { isBreak, focusTime, breakTime, currentCycle, repeatCycles };

  // 설정 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem(
      "timetrack-settings",
      JSON.stringify({ focusTime, breakTime, repeatCycles })
    );
  }, [focusTime, breakTime, repeatCycles]);

  // 타이머가 멈춰 있을 때 설정 변경 → 표시 시간 즉시 반영
  useEffect(() => {
    if (!isActive) {
      setTime(isBreak ? breakTime * 60 : focusTime * 60);
    }
  }, [focusTime, breakTime, isBreak, isActive]);

  // 1초마다 감소 — isActive/isPaused 변경 시에만 interval 재생성
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // time === 0 감지 → 페이즈 전환
  useEffect(() => {
    if (!isActive || time !== 0) return;

    const { isBreak: br, focusTime: ft, breakTime: bt, currentCycle: cc, repeatCycles: rc } =
      stateRef.current;

    playBeep();

    if (br) {
      // 휴식 종료 → 집중 시작
      setIsBreak(false);
      setCurrentCycle((c) => c + 1);
      setTime(ft * 60);
    } else if (cc >= rc - 1) {
      // 모든 사이클 완료
      setIsActive(false);
      setIsPaused(false);
      setCurrentCycle(0);
      setTime(ft * 60);
    } else {
      // 집중 종료 → 휴식 시작
      setIsBreak(true);
      setTime(bt * 60);
    }
  }, [time, isActive]);

  const startTimer = () => {
    setTime(focusTime * 60);
    setIsBreak(false);
    setCurrentCycle(0);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused((p) => !p);

  const resetTimer = () => {
    setTime(isBreak ? breakTime * 60 : focusTime * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal")) closeModal();
  };

  const adjustValue = (setter, value, delta, min, max) => {
    const next = value + delta;
    if (next >= min && next <= max) setter(next);
  };

  const totalTime = isBreak ? breakTime * 60 : focusTime * 60;
  const elapsed = totalTime - time;
  const percentage = totalTime > 0 ? (elapsed / totalTime) * 100 : 0;

  return (
    <div className="timer-container">
      <div className="timer">
        <CircularProgressbar
          value={percentage}
          text={`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}
          styles={buildStyles({
            textColor: darkMode ? "#ffffff" : "#333333",
            pathColor: isBreak ? "#ff5722" : "#4caf50",
            trailColor: darkMode ? "#3a3a3a" : "#eeeeee",
          })}
        />
      </div>
      {isActive && (
        <p className="timer-status">
          {isBreak ? `휴식 중 (${currentCycle}/${repeatCycles})` : `집중 중 (${currentCycle + 1}/${repeatCycles})`}
        </p>
      )}
      <div className="timer-controls">
        <button className="start-button" onClick={startTimer}>
          {isActive ? "재시작" : "시작"}
        </button>
        <button className="pause-button" onClick={pauseTimer} disabled={!isActive}>
          {isPaused ? "계속" : "일시정지"}
        </button>
        <button className="reset-button" onClick={resetTimer}>
          초기화
        </button>
        <button className="set-time-button" onClick={openModal}>
          시간 설정
        </button>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>시간 설정</h3>
              <button className="close-button" onClick={closeModal} aria-label="닫기">
                &#10007;
              </button>
            </div>

            <div className="modal-input">
              <label>
                <FaClock style={{ marginRight: "5px" }} />
                집중 시간 (분):
              </label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setFocusTime, focusTime, -5, 5, 60)}>-</button>
                <input
                  type="number"
                  value={focusTime}
                  onChange={(e) => setFocusTime(Number(e.target.value))}
                  min="1"
                  max="60"
                />
                <button className="adjust-button" onClick={() => adjustValue(setFocusTime, focusTime, 5, 5, 60)}>+</button>
              </div>
            </div>

            <div className="modal-input">
              <label>
                <FaBed style={{ marginRight: "5px" }} />
                휴식 시간 (분):
              </label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setBreakTime, breakTime, -5, 5, 30)}>-</button>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(Number(e.target.value))}
                  min="1"
                  max="30"
                />
                <button className="adjust-button" onClick={() => adjustValue(setBreakTime, breakTime, 5, 5, 30)}>+</button>
              </div>
            </div>

            <div className="modal-input">
              <label>
                <FaRecycle style={{ marginRight: "5px" }} />
                반복 횟수:
              </label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setRepeatCycles, repeatCycles, -1, 1, 10)}>-</button>
                <input
                  type="number"
                  value={repeatCycles}
                  onChange={(e) => setRepeatCycles(Number(e.target.value))}
                  min="1"
                  max="10"
                />
                <button className="adjust-button" onClick={() => adjustValue(setRepeatCycles, repeatCycles, 1, 1, 10)}>+</button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="save-button" onClick={closeModal}>
                &#10003; 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
