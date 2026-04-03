import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const AppContext = createContext(null);

const getTodayKey = () => new Date().toISOString().split("T")[0];

const readTodayStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem("timetrack-stats") || "[]");
    return stats.find((s) => s.date === getTodayKey()) || { focusMinutes: 0, cycles: 0 };
  } catch {
    return { focusMinutes: 0, cycles: 0 };
  }
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("timetrack-darkmode") === "true"
  );

  // 현재 집중 중인 Task — Timer와 TaskList 공유
  const [activeTask, setActiveTask] = useState(null); // { id, text } | null

  // Timer가 자신의 start/reset 함수를 여기에 등록 → Task에서 직접 호출 가능
  const timerControlRef = useRef({ start: null, reset: null });
  const registerTimerControl = useCallback((start, reset) => {
    timerControlRef.current = { start, reset };
  }, []);

  // Task ▶ 클릭 → activeTask 설정 + 타이머 즉시 시작
  const focusOnTask = useCallback((task) => {
    setActiveTask(task);
    if (task) timerControlRef.current.start?.();
  }, []);

  // 오늘 집중 통계 — 리렌더 트리거용 state
  const [todayStats, setTodayStats] = useState(readTodayStats);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("timetrack-darkmode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  // 집중 사이클 1회 완료 시 호출
  const recordFocusCycle = useCallback((focusMinutes) => {
    const today = getTodayKey();
    try {
      const stats = JSON.parse(localStorage.getItem("timetrack-stats") || "[]");
      const idx = stats.findIndex((s) => s.date === today);
      if (idx >= 0) {
        stats[idx].focusMinutes += focusMinutes;
        stats[idx].cycles += 1;
      } else {
        stats.push({ date: today, focusMinutes, cycles: 1 });
      }
      // 최근 30일만 유지
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const trimmed = stats.filter((s) => new Date(s.date) >= cutoff);
      localStorage.setItem("timetrack-stats", JSON.stringify(trimmed));
      setTodayStats(readTodayStats());
    } catch {}
  }, []);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        activeTask,
        setActiveTask,
        focusOnTask,
        registerTimerControl,
        todayStats,
        recordFocusCycle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
