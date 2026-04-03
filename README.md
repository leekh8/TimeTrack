# TimeTrack

Pomodoro 타이머와 할 일 목록을 결합한 집중력 향상 웹 앱입니다.

🔗 **라이브 데모**: https://time-track-psi.vercel.app/

---

## 주요 기능

### 타이머
- 집중 시간 / 휴식 시간 / 반복 횟수 자유 설정 (기본 25분 + 5분 × 1회)
- 집중 → 휴식 → 집중 자동 사이클 전환
- 브라우저 탭 타이틀에 남은 시간 실시간 표시 (`⏱ 23:45 집중 중`)
- 사이클 완료 시 비프음 + 브라우저 알림 (Notification API)
- 배경음 선택: 없음 / 화이트노이즈 / 브라운노이즈 (집중 중에만 재생)
- 오늘 집중 시간·완료 사이클 수 하단 표시 (30일치 누적 저장)

### 할 일 목록
- 할 일 추가 / 수정 / 삭제 / 완료 체크
- 드래그 앤 드롭으로 순서 변경
- 완료 항목 접기/펼치기 분리, 일괄 삭제
- 진행률 바로 완료 비율 시각화
- **집중 시작(▶) 버튼**: 특정 Task 선택 시 타이머 상단에 현재 집중 Task 표시

### 편의 기능
- 키보드 단축키: `Space` 시작/일시정지 · `R` 초기화 · `N` 할 일 입력 포커스
- 다크 모드 (설정 localStorage 저장, 새로고침 후에도 유지)
- 모든 설정·할 일 목록 localStorage 자동 저장

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프론트엔드 | React 18, Context API, react-beautiful-dnd, react-circular-progressbar |
| 백엔드 | Node.js, Express |
| 스타일 | CSS (CSS Variables, Flexbox, 반응형) |
| 배포 | Vercel (클라이언트) |
| 오디오 | Web Audio API |
| 알림 | Notification API |

---

## 프로젝트 구조

```
TimeTrack/
├── client/                          # React 클라이언트
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── tasks.js             # 서버 API 클라이언트 (localStorage fallback)
│       ├── components/
│       │   ├── Timer.js             # Pomodoro 타이머
│       │   ├── TaskList.js          # 할 일 목록
│       │   ├── Task.js              # 개별 할 일 항목
│       │   └── SEO.js               # 메타 태그
│       ├── context/
│       │   └── AppContext.js        # 전역 상태 (다크모드, activeTask, 통계)
│       ├── App.js
│       └── App.css
├── server/                          # Express 백엔드
│   ├── app.js                       # REST API (tasks CRUD)
│   └── package.json
└── README.md
```

---

## 로컬 실행

### 사전 요구 사항
- Node.js 18+
- Git

### 클라이언트

```bash
git clone https://github.com/leekh8/TimeTrack.git
cd TimeTrack/client
npm install
npm start
# → http://localhost:3000
```

### 서버 (선택 — 다기기 동기화 시 필요)

```bash
cd TimeTrack/server
npm install
npm run dev
# → http://localhost:5000
```

서버 없이도 클라이언트는 localStorage만으로 정상 동작합니다.

### 환경 변수 (선택)

`client/.env` 파일 생성:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## API 엔드포인트

서버(`server/app.js`)가 제공하는 REST API입니다.

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/` | 서버 상태 확인 |
| GET | `/tasks` | 할 일 목록 전체 조회 |
| POST | `/tasks` | 할 일 추가 `{ text }` |
| PUT | `/tasks/:id` | 할 일 수정 `{ text?, completed? }` |
| PUT | `/tasks/reorder` | 드래그 순서 반영 `{ orderedIds }` |
| DELETE | `/tasks/:id` | 할 일 삭제 |
| DELETE | `/tasks` | 완료된 항목 전체 삭제 |

> 현재 서버는 인메모리 저장 방식입니다. 재시작 시 데이터가 초기화되므로 운영 환경에서는 DB 연동이 필요합니다.

---

## 키보드 단축키

| 키 | 동작 |
|---|---|
| `Space` | 타이머 시작 / 일시정지 |
| `R` | 타이머 초기화 |
| `N` | 할 일 입력창 포커스 |

입력 필드 또는 모달이 열려 있을 때는 단축키가 비활성화됩니다.

---

## 배포

클라이언트는 Vercel에 자동 배포됩니다. `main` 브랜치에 push하면 CD 워크플로우가 트리거됩니다.

```bash
# 빌드 확인
cd client && npm run build
```

---

## 기여 방법

1. 레포지토리를 포크합니다.
2. 브랜치를 생성합니다: `git checkout -b feature/my-feature`
3. 변경 사항을 커밋합니다: `git commit -m "feat: 설명"`
4. 브랜치에 푸시합니다: `git push origin feature/my-feature`
5. Pull Request를 생성합니다.
