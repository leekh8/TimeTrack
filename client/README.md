# TimeTrack — 클라이언트

React 18 기반 Pomodoro 타이머 + 할 일 관리 앱입니다.

## 실행

```bash
npm install
npm start      # 개발 서버 → http://localhost:3000
npm run build  # 프로덕션 빌드
```

## 환경 변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | 백엔드 서버 주소 |

`.env` 파일을 `client/` 디렉토리에 생성해 사용합니다. 설정하지 않아도 localStorage만으로 동작합니다.

## 구조

```
src/
├── api/
│   └── tasks.js          # 서버 API 클라이언트
├── components/
│   ├── Timer.js           # Pomodoro 타이머 (배경음, 단축키, 통계, 알림 포함)
│   ├── TaskList.js        # 할 일 목록 (드래그앤드롭, 완료 접기)
│   ├── Task.js            # 개별 할 일 (수정, 삭제, 집중 시작)
│   └── SEO.js             # 메타 태그
├── context/
│   └── AppContext.js      # 전역 상태 (다크모드, activeTask, 오늘 통계)
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
