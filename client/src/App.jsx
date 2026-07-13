import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import logo from "./logo.svg";
import "./App.css";

import SEO from "./components/SEO";
import Timer from "./components/Timer";
import FocusHistory from "./components/FocusHistory";
import { AppProvider, useAppContext } from "./context/AppContext";

const TaskList = lazy(() => import("./components/TaskList"));

function AppContent() {
  const { darkMode, toggleDarkMode } = useAppContext();
  const { t, i18n } = useTranslation();

  const isKo = i18n.resolvedLanguage === "ko";
  const toggleLang = () => i18n.changeLanguage(isKo ? "en" : "ko");

  return (
    <>
      <SEO
        lang={i18n.resolvedLanguage}
        title={t("app.seoTitle")}
        description={t("app.seoDescription")}
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
        image="https://time-track-psi.vercel.app/og-image.png"
        url="https://time-track-psi.vercel.app/"
      />

      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <header className="header">
          <div className="logo-title">
            <img src={logo} alt="TimeTrack Logo" className="logo" />
            <h1>TimeTrack</h1>
          </div>
          <div className="header-actions">
            <button
              className="lang-button"
              onClick={toggleLang}
              aria-label={isKo ? t("app.switchToEn") : t("app.switchToKo")}
              title={isKo ? t("app.switchToEn") : t("app.switchToKo")}
            >
              {isKo ? "EN" : "한"}
            </button>
            <button className="toggle-button" onClick={toggleDarkMode}>
              {darkMode ? t("app.lightMode") : t("app.darkMode")}
            </button>
          </div>
        </header>
        <main className="main-content">
          <Timer />
          <Suspense fallback={<div className="app-loading">{t("app.loading")}</div>}>
            <TaskList />
          </Suspense>
        </main>
        <FocusHistory />
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
