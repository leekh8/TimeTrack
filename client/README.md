# TimeTrack — 클라이언트

React 18 기반 Pomodoro 타이머 + 할 일 관리 앱입니다.

## 실행

```bash
npm install
npm start      # 개발 서버 → http://localhost:3000
npm run build  # 프로덕션 빌드
npm test       # 테스트 (Jest + Testing Library)
```

> 백엔드가 없어 localStorage만으로 완전히 동작합니다.

## 구조

```
src/
├── components/
│   ├── Timer.js           # Pomodoro 타이머 (배경음, 단축키, 통계, 알림 포함)
│   ├── TaskList.js        # 할 일 목록 (드래그앤드롭, 완료 접기)
│   ├── Task.js            # 개별 할 일 (수정, 삭제, 집중 시작)
│   ├── FocusHistory.js    # 최근 7일 집중 히스토리 차트
│   └── SEO.js             # 메타 태그
├── context/
│   └── AppContext.js      # 전역 상태 (다크모드, activeTask, 오늘·최근 통계)
├── utils/
│   ├── stats.js           # 집중 통계 순수 헬퍼 (+ 테스트)
│   └── tasks.js           # 할 일 id·재정렬 순수 헬퍼 (+ 테스트)
├── i18n/
│   ├── index.js           # react-i18next 초기화 (ko/en 감지·전환)
│   └── locales/           # ko.json / en.json
├── App.js
└── App.css
```

## localStorage 키

| 키 | 내용 |
|---|---|
| `timetrack-tasks` | 할 일 목록 |
| `timetrack-settings` | 타이머 설정 (집중/휴식 시간, 반복 횟수) |
| `timetrack-darkmode` | 다크모드 여부 |
| `timetrack-sound` | 배경음 모드 (off / white / brown) |
| `timetrack-stats` | 집중 시간 통계 (최근 30일) |
