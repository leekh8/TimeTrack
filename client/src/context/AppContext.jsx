import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getDayStats, buildRecentSeries, applyFocusCycle } from "../utils/stats";

const AppContext = createContext(null);

const STATS_KEY = "timetrack-stats";
const HISTORY_DAYS = 7;

const readStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem(STATS_KEY) || "[]");
    return Array.isArray(stats) ? stats : [];
  } catch {
    return [];
  }
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("timetrack-darkmode") === "true"
  );
  const [activeTask, setActiveTask] = useState(null); // { id, text } | null
  const [statsData, setStatsData] = useState(readStats); // 원본 배열 (오늘·히스토리 파생의 단일 소스)

  const todayStats = getDayStats(statsData);
  const recentStats = buildRecentSeries(statsData, HISTORY_DAYS);

  // Timer가 자신의 제어 함수를 여기에 등록
  // { start, reset, pauseIfActive } — Task/Context에서 직접 호출
  const timerControlRef = useRef({ start: null, reset: null, pauseIfActive: null });

  const registerTimerControl = useCallback((controls) => {
    timerControlRef.current = { ...timerControlRef.current, ...controls };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("timetrack-darkmode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  // ▶ 클릭: activeTask 설정 + 타이머 즉시 시작
  const focusOnTask = useCallback((task) => {
    setActiveTask(task);
    if (task) timerControlRef.current.start?.();
  }, []);

  // ■ 클릭: activeTask 해제 + 타이머가 실행 중이면 일시정지
  const unfocusTask = useCallback(() => {
    setActiveTask(null);
    timerControlRef.current.pauseIfActive?.();
  }, []);

  // 집중 사이클 1회 완료 시 호출 — 함수형 업데이트로 최신 통계에 누적 (stale 방지)
  const recordFocusCycle = useCallback((focusMinutes) => {
    setStatsData((prev) => {
      const next = applyFocusCycle(prev, focusMinutes);
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        activeTask,
        setActiveTask,
        focusOnTask,
        unfocusTask,
        registerTimerControl,
        todayStats,
        recentStats,
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
