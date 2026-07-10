import React from "react";
import "../App.css";
import { useAppContext } from "../context/AppContext";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "YYYY-MM-DD" → 로컬 기준 요일 인덱스 (new Date(str)의 UTC 파싱 시프트 회피)
const weekdayOf = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

const FocusHistory = () => {
  const { recentStats } = useAppContext();

  const maxMinutes = Math.max(1, ...recentStats.map((s) => s.focusMinutes));
  const totalMinutes = recentStats.reduce((sum, s) => sum + s.focusMinutes, 0);
  const activeDays = recentStats.filter((s) => s.focusMinutes > 0).length;
  const hasData = totalMinutes > 0;

  return (
    <section className="focus-history" aria-label="최근 7일 집중 기록">
      <div className="focus-history-head">
        <h2 className="focus-history-title">최근 7일 집중</h2>
        {hasData && (
          <span className="focus-history-sub">
            {activeDays}일 · 총 {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        )}
      </div>

      {hasData ? (
        <div className="focus-history-chart" role="img"
             aria-label={`최근 7일 중 ${activeDays}일 집중, 총 ${totalMinutes}분`}>
          {recentStats.map((s, i) => {
            const isToday = i === recentStats.length - 1;
            const heightPct = s.focusMinutes > 0
              ? Math.max(8, (s.focusMinutes / maxMinutes) * 100)
              : 0;
            return (
              <div
                key={s.date}
                className={`fh-col ${isToday ? "fh-col--today" : ""}`}
                title={`${s.date} · ${s.focusMinutes}분 · ${s.cycles}사이클`}
              >
                <div className="fh-bar-track">
                  <div
                    className={`fh-bar ${s.focusMinutes === 0 ? "fh-bar--empty" : ""}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="fh-label">{WEEKDAYS[weekdayOf(s.date)]}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="focus-history-empty">아직 집중 기록이 없어요. 타이머를 시작해 보세요.</p>
      )}
    </section>
  );
};

export default FocusHistory;
