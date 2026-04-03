import React, { useState, useEffect, useRef } from "react";
import { FaClock, FaRecycle, FaBed, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../App.css";
import { useAppContext } from "../context/AppContext";

const DEFAULTS = { focusTime: 25, breakTime: 5, repeatCycles: 1 };

const loadSettings = () => {
  try {
    const saved = localStorage.getItem("timetrack-settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

// ── 오디오 유틸 ──────────────────────────────────────
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

const buildNoiseBuffer = (audioCtx, type) => {
  const size = audioCtx.sampleRate * 3;
  const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  if (type === "white") {
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  } else {
    // brown noise
    let last = 0;
    for (let i = 0; i < size; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }
  }
  return buffer;
};

// ── 알림 유틸 ─────────────────────────────────────────
const requestNotifPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};

const sendNotif = (title, body) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
};

// ──────────────────────────────────────────────────────
const Timer = () => {
  const { darkMode, activeTask, todayStats, recordFocusCycle, registerTimerControl } = useAppContext();
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
  const [soundMode, setSoundMode] = useState(
    () => localStorage.getItem("timetrack-sound") || "off"
  );

  // 최신 상태를 ref로 관리 (interval / 이벤트 핸들러에서 stale closure 방지)
  const stateRef = useRef({});
  stateRef.current = { isBreak, focusTime, breakTime, currentCycle, repeatCycles };

  // start/reset을 Context에 등록 — Task ▶ 버튼이 직접 호출
  const timerFnRef = useRef({});
  timerFnRef.current = { startTimer, resetTimer };
  useEffect(() => {
    registerTimerControl(
      () => timerFnRef.current.startTimer(),
      () => timerFnRef.current.resetTimer()
    );
  }, [registerTimerControl]);

  const audioCtxRef = useRef(null);
  const noiseSourceRef = useRef(null);

  // ── 설정 저장 ─────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("timetrack-settings", JSON.stringify({ focusTime, breakTime, repeatCycles }));
  }, [focusTime, breakTime, repeatCycles]);

  useEffect(() => {
    localStorage.setItem("timetrack-sound", soundMode);
  }, [soundMode]);

  // ── 탭 타이틀 업데이트 ────────────────────────────
  useEffect(() => {
    if (!isActive) {
      document.title = "TimeTrack";
      return;
    }
    const mm = Math.floor(time / 60);
    const ss = String(time % 60).padStart(2, "0");
    document.title = isBreak
      ? `☕ ${mm}:${ss} 휴식 중 — TimeTrack`
      : `⏱ ${mm}:${ss} 집중 중 — TimeTrack`;
    return () => { document.title = "TimeTrack"; };
  }, [time, isActive, isBreak]);

  // ── 타이머 비활성 시 설정 변경 → 표시 시간 반영 ──
  useEffect(() => {
    if (!isActive) {
      setTime(isBreak ? breakTime * 60 : focusTime * 60);
    }
  }, [focusTime, breakTime, isBreak, isActive]);

  // ── 1초 감소 (isActive/isPaused 변경 시에만 interval 재생성) ──
  useEffect(() => {
    if (!isActive || isPaused) return;
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // ── time === 0 → 페이즈 전환 ──────────────────────
  useEffect(() => {
    if (!isActive || time !== 0) return;
    const { isBreak: br, focusTime: ft, breakTime: bt, currentCycle: cc, repeatCycles: rc } =
      stateRef.current;

    playBeep();

    if (!br) {
      // 집중 완료 → 통계 기록
      recordFocusCycle(ft);
      sendNotif("집중 완료! ☕", `${ft}분 집중을 마쳤습니다. 잠깐 쉬어가세요.`);
    }

    if (br) {
      setIsBreak(false);
      setCurrentCycle((c) => c + 1);
      setTime(ft * 60);
      sendNotif("휴식 종료! ⏱", "다시 집중할 시간입니다.");
    } else if (cc >= rc - 1) {
      setIsActive(false);
      setIsPaused(false);
      setCurrentCycle(0);
      setTime(ft * 60);
      sendNotif("모든 사이클 완료! 🎉", `총 ${rc}사이클을 마쳤습니다.`);
    } else {
      setIsBreak(true);
      setTime(bt * 60);
    }
  }, [time, isActive, recordFocusCycle]);

  // ── 배경음 제어 ───────────────────────────────────
  const stopNoise = () => {
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); } catch {}
      noiseSourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    const shouldPlay = isActive && !isPaused && !isBreak && soundMode !== "off";
    if (!shouldPlay) { stopNoise(); return; }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const source = ctx.createBufferSource();
    source.buffer = buildNoiseBuffer(ctx, soundMode);
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    noiseSourceRef.current = source;

    return () => stopNoise();
  }, [isActive, isPaused, isBreak, soundMode]);

  // ── 키보드 단축키 (Space / R) ─────────────────────
  const actionsRef = useRef({});
  actionsRef.current = { isActive, isPaused, isModalOpen, startTimer, pauseTimer, resetTimer };

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (actionsRef.current.isModalOpen) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (!actionsRef.current.isActive) actionsRef.current.startTimer();
        else actionsRef.current.pauseTimer();
      }
      if (e.code === "KeyR" && !e.ctrlKey && !e.metaKey) {
        actionsRef.current.resetTimer();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []); // 한 번만 등록

  // ──────────────────────────────────────────────────
  function startTimer() {
    requestNotifPermission();
    setTime(focusTime * 60);
    setIsBreak(false);
    setCurrentCycle(0);
    setIsActive(true);
    setIsPaused(false);
  }
  function pauseTimer() { setIsPaused((p) => !p); }
  function resetTimer() {
    stopNoise();
    setTime(isBreak ? breakTime * 60 : focusTime * 60);
    setIsActive(false);
    setIsPaused(false);
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleOutsideClick = (e) => { if (e.target.classList.contains("modal")) closeModal(); };

  const adjustValue = (setter, value, delta, min, max) => {
    const next = value + delta;
    if (next >= min && next <= max) setter(next);
  };

  const totalTime = isBreak ? breakTime * 60 : focusTime * 60;
  const percentage = totalTime > 0 ? ((totalTime - time) / totalTime) * 100 : 0;

  const formatMins = (mins) =>
    mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  return (
    <div className="timer-container">
      {/* 현재 집중 중인 Task */}
      {activeTask && (
        <div className="timer-active-task">
          ⏱ {activeTask.text}
        </div>
      )}

      {/* 원형 타이머 */}
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

      {/* 사이클 상태 */}
      {isActive && (
        <p className="timer-status">
          {isBreak
            ? `☕ 휴식 중 (${currentCycle}/${repeatCycles})`
            : `⏱ 집중 중 (${currentCycle + 1}/${repeatCycles})`}
        </p>
      )}

      {/* 컨트롤 버튼 */}
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

      {/* 배경음 선택 */}
      <div className="sound-controls">
        {soundMode === "off" ? <FaVolumeMute className="sound-icon" /> : <FaVolumeUp className="sound-icon" />}
        <select
          className="sound-select"
          value={soundMode}
          onChange={(e) => setSoundMode(e.target.value)}
          aria-label="배경음 선택"
        >
          <option value="off">배경음 없음</option>
          <option value="white">화이트노이즈</option>
          <option value="brown">브라운노이즈</option>
        </select>
      </div>

      {/* 오늘 통계 */}
      <div className="timer-stats">
        <span>오늘 집중 {formatMins(todayStats.focusMinutes)}</span>
        <span className="stats-sep">·</span>
        <span>{todayStats.cycles}사이클</span>
      </div>

      {/* 단축키 안내 */}
      <p className="shortcut-hint">Space: 시작/일시정지 · R: 초기화</p>

      {/* 설정 모달 */}
      {isModalOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>시간 설정</h3>
              <button className="close-button" onClick={closeModal} aria-label="닫기">&#10007;</button>
            </div>

            <div className="modal-input">
              <label><FaClock style={{ marginRight: "5px" }} />집중 시간 (분):</label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setFocusTime, focusTime, -5, 5, 60)}>-</button>
                <input type="number" value={focusTime} onChange={(e) => setFocusTime(Number(e.target.value))} min="1" max="60" />
                <button className="adjust-button" onClick={() => adjustValue(setFocusTime, focusTime, 5, 5, 60)}>+</button>
              </div>
            </div>

            <div className="modal-input">
              <label><FaBed style={{ marginRight: "5px" }} />휴식 시간 (분):</label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setBreakTime, breakTime, -5, 5, 30)}>-</button>
                <input type="number" value={breakTime} onChange={(e) => setBreakTime(Number(e.target.value))} min="1" max="30" />
                <button className="adjust-button" onClick={() => adjustValue(setBreakTime, breakTime, 5, 5, 30)}>+</button>
              </div>
            </div>

            <div className="modal-input">
              <label><FaRecycle style={{ marginRight: "5px" }} />반복 횟수:</label>
              <div className="input-with-buttons">
                <button className="adjust-button" onClick={() => adjustValue(setRepeatCycles, repeatCycles, -1, 1, 10)}>-</button>
                <input type="number" value={repeatCycles} onChange={(e) => setRepeatCycles(Number(e.target.value))} min="1" max="10" />
                <button className="adjust-button" onClick={() => adjustValue(setRepeatCycles, repeatCycles, 1, 1, 10)}>+</button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="save-button" onClick={closeModal}>&#10003; 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
