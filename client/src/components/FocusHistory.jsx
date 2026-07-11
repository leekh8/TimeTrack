import React from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { useAppContext } from "../context/AppContext";

// "YYYY-MM-DD" → 로컬 기준 요일 인덱스 (new Date(str)의 UTC 파싱 시프트 회피)
const weekdayOf = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

const FocusHistory = () => {
  const { recentStats } = useAppContext();
  const { t } = useTranslation();
  const weekdays = t("history.weekdays", { returnObjects: true });

  const maxMinutes = Math.max(1, ...recentStats.map((s) => s.focusMinutes));
  const totalMinutes = recentStats.reduce((sum, s) => sum + s.focusMinutes, 0);
  const activeDays = recentStats.filter((s) => s.focusMinutes > 0).length;
  const hasData = totalMinutes > 0;

  return (
    <section className="focus-history" aria-label={t("history.ariaSection")}>
      <div className="focus-history-head">
        <h2 className="focus-history-title">{t("history.title")}</h2>
        {hasData && (
          <span className="focus-history-sub">
            {t("history.summary", {
              days: activeDays,
              hours: Math.floor(totalMinutes / 60),
              minutes: totalMinutes % 60,
            })}
          </span>
        )}
      </div>

      {hasData ? (
        <div className="focus-history-chart" role="img"
             aria-label={t("history.ariaChart", { days: activeDays, minutes: totalMinutes })}>
          {recentStats.map((s, i) => {
            const isToday = i === recentStats.length - 1;
            const heightPct = s.focusMinutes > 0
              ? Math.max(8, (s.focusMinutes / maxMinutes) * 100)
              : 0;
            return (
              <div
                key={s.date}
                className={`fh-col ${isToday ? "fh-col--today" : ""}`}
                title={t("history.barTitle", { date: s.date, minutes: s.focusMinutes, cycles: s.cycles })}
              >
                <div className="fh-bar-track">
                  <div
                    className={`fh-bar ${s.focusMinutes === 0 ? "fh-bar--empty" : ""}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="fh-label">{weekdays[weekdayOf(s.date)]}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="focus-history-empty">{t("history.empty")}</p>
      )}
    </section>
  );
};

export default FocusHistory;
