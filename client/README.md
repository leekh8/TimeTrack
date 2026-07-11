# TimeTrack — 클라이언트

React 18 + Vite 5 기반 Pomodoro 타이머 + 할 일 관리 앱입니다.

## 실행

```bash
npm install
npm run dev    # 개발 서버 → http://localhost:3000
npm run build  # 프로덕션 빌드 → build/
npm test       # 테스트 (Vitest + Testing Library)
```

> 백엔드가 없어 localStorage만으로 완전히 동작합니다. (`npm start`도 `npm run dev`와 동일)

## 구조

```
src/
├── components/
│   ├── Timer.jsx          # Pomodoro 타이머 (배경음, 단축키, 통계, 알림 포함)
│   ├── TaskList.jsx       # 할 일 목록 (드래그앤드롭, 완료 접기)
│   ├── Task.jsx           # 개별 할 일 (수정, 삭제, 집중 시작)
│   ├── FocusHistory.jsx   # 최근 7일 집중 히스토리 차트
│   └── SEO.jsx            # 메타 태그
├── context/
│   └── AppContext.jsx     # 전역 상태 (다크모드, activeTask, 오늘·최근 통계)
├── utils/
│   ├── stats.js           # 집중 통계 순수 헬퍼 (+ 테스트)
│   └── tasks.js           # 할 일 id·재정렬 순수 헬퍼 (+ 테스트)
├── i18n/
│   ├── index.js           # react-i18next 초기화 (ko/en 감지·전환)
│   └── locales/           # ko.json / en.json
├── App.jsx
└── App.css

index.html        # 앱 진입점 (Vite — 루트에 위치)
vite.config.js    # Vite + Vitest 설정
```

## localStorage 키

| 키 | 내용 |
|---|---|
| `timetrack-tasks` | 할 일 목록 |
| `timetrack-settings` | 타이머 설정 (집중/휴식 시간, 반복 횟수) |
| `timetrack-darkmode` | 다크모드 여부 |
| `timetrack-sound` | 배경음 모드 (off / white / brown) |
| `timetrack-stats` | 집중 시간 통계 (최근 30일) |
