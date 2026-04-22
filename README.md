# TimeTrack

> Pomodoro 기법 기반 집중 타이머 + 할 일 관리 웹 애플리케이션

🔗 **라이브 데모**: https://time-track-psi.vercel.app/  
📦 **레포지토리**: https://github.com/leekh8/TimeTrack

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기능 명세](#2-기능-명세)
3. [기술 스택](#3-기술-스택)
4. [아키텍처](#4-아키텍처)
5. [설치 및 실행](#5-설치-및-실행)
6. [API 명세](#6-api-명세)
7. [데이터 저장 구조](#7-데이터-저장-구조)
8. [키보드 단축키](#8-키보드-단축키)
9. [알려진 제약 및 로드맵](#9-알려진-제약-및-로드맵)
10. [변경 이력](#10-변경-이력)

---

## 1. 프로젝트 개요

**TimeTrack**은 Pomodoro 기법(집중-휴식 반복 사이클)과 할 일 목록 관리를 단일 인터페이스에서 제공하는 웹 앱입니다.

### 해결하려는 문제

| 기존 문제 | TimeTrack 접근 |
|---|---|
| 타이머 앱과 할 일 앱이 분리되어 문맥 전환 비용 발생 | 단일 화면에서 할 일 선택 → 타이머 즉시 시작 |
| 집중 시간이 얼마나 됐는지 파악 불가 | 오늘/누적 집중 시간·사이클 수 자동 기록 |
| 브라우저 최소화 시 타이머 확인 불가 | 탭 타이틀 실시간 업데이트 + 브라우저 알림 |

---

## 2. 기능 명세

### 2-1. Pomodoro 타이머

| 기능 | 상태 | 설명 |
|---|---|---|
| 집중/휴식 시간 설정 | ✅ 완료 | 기본 25분/5분, 1~60분 범위 |
| 반복 사이클 설정 | ✅ 완료 | 1~10회 |
| 자동 사이클 전환 | ✅ 완료 | 집중 → 휴식 → 집중 자동 전환 |
| 탭 타이틀 실시간 표시 | ✅ 완료 | `⏱ 23:45 집중 중 — TimeTrack` |
| 브라우저 알림 | ✅ 완료 | 사이클 전환·완료 시 OS 알림 |
| 비프음 알림 | ✅ 완료 | 사이클 전환 시 Web Audio API 비프음 |
| 배경음 | ✅ 완료 | 화이트노이즈 / 브라운노이즈 선택, 집중 중에만 재생 |
| 오늘 집중 통계 | ✅ 완료 | 집중 시간·사이클 수 타이머 하단 표시 |

### 2-2. 할 일 관리

| 기능 | 상태 | 설명 |
|---|---|---|
| 추가 / 수정 / 삭제 | ✅ 완료 | 인라인 수정, ESC 취소 |
| 완료 체크 | ✅ 완료 | 클릭/체크박스 |
| 드래그 앤 드롭 순서 변경 | ✅ 완료 | 미완료 항목만 |
| 진행률 바 | ✅ 완료 | 완료 비율 시각화 |
| 완료 항목 접기/펼치기 | ✅ 완료 | 기본 숨김, 일괄 삭제 |
| **할 일 → 타이머 연동** | ✅ 완료 | ▶ 클릭 시 타이머 즉시 시작, ■ 클릭 시 일시정지 |
| localStorage 자동 저장 | ✅ 완료 | 새로고침 후에도 유지 |

### 2-3. 편의 기능

| 기능 | 상태 | 설명 |
|---|---|---|
| 다크 모드 | ✅ 완료 | 설정 localStorage 저장 |
| 키보드 단축키 | ✅ 완료 | Space / R / N |
| 반응형 레이아웃 | ✅ 완료 | 모바일·태블릿·데스크톱 |
| SEO 메타 태그 | ✅ 완료 | Open Graph / Twitter Card |

---

## 3. 기술 스택

| 분류 | 기술 | 선택 이유 |
|---|---|---|
| UI 프레임워크 | React 18 | 컴포넌트 단위 상태 관리, 생태계 |
| 전역 상태 | Context API | 규모 대비 Redux 오버스펙, 다크모드·activeTask 공유 |
| 드래그 앤 드롭 | react-beautiful-dnd | 선언적 API, 접근성 지원 |
| 원형 프로그레스 | react-circular-progressbar | SVG 기반, 커스터마이징 용이 |
| 오디오 | Web Audio API | 외부 의존성 없이 노이즈·비프음 생성 |
| 알림 | Notification API | 브라우저 표준, 설치 불필요 |
| 백엔드 | Node.js + Express | 경량 REST API 서버 |
| 배포 | Vercel | GitHub 연동 CD, 무중단 배포 |

---

## 4. 아키텍처

```
┌─────────────────────────────────────────────────┐
│                   Client (React)                 │
│                                                  │
│  AppContext ──────────────────────────────────   │
│  ├─ darkMode          (전역 다크모드)             │
│  ├─ activeTask        (현재 집중 중인 할 일)       │
│  ├─ todayStats        (오늘 집중 통계)             │
│  ├─ focusOnTask()     (할 일 선택 + 타이머 시작)   │
│  ├─ unfocusTask()     (할 일 해제 + 타이머 정지)   │
│  └─ registerTimerControl()  (Timer 제어 함수 등록) │
│                                                  │
│  Timer ─────────────────  TaskList ───────────   │
│  ├─ Pomodoro 상태 관리    ├─ 할 일 CRUD           │
│  ├─ 배경음 (Web Audio)    ├─ Drag & Drop          │
│  ├─ 알림 (Notification)   ├─ 진행률 바            │
│  └─ 통계 기록             └─ Task (개별 항목)      │
│                                                  │
│  localStorage ──────────────────────────────     │
│  ├─ timetrack-tasks       할 일 목록              │
│  ├─ timetrack-settings    타이머 설정              │
│  ├─ timetrack-darkmode    다크모드 여부            │
│  ├─ timetrack-sound       배경음 모드              │
│  └─ timetrack-stats       집중 통계 (30일)         │
└─────────────────────────────────────────────────┘
             │  REST API (선택적)
┌────────────▼────────────┐
│   Server (Express)       │
│   GET/POST/PUT/DELETE    │
│   /tasks                 │
│   (인메모리, 추후 DB 연동) │
└─────────────────────────┘
```

### 타이머 ↔ 할 일 연동 흐름

```
Task ▶ 클릭
  → focusOnTask({ id, text })           [AppContext]
    → setActiveTask({ id, text })
    → timerControlRef.current.start()   [Timer에 등록된 함수 직접 호출]
      → startTimer()                    [Timer 내부]

Task ■ 클릭
  → unfocusTask()                       [AppContext]
    → setActiveTask(null)
    → timerControlRef.current.pauseIfActive()
      → if (isActive && !isPaused) setIsPaused(true)
```

---

## 5. 설치 및 실행

### 사전 요구 사항

- Node.js 18+
- Git

### 클라이언트 (필수)

```bash
git clone https://github.com/leekh8/TimeTrack.git
cd TimeTrack/client
npm install
npm start          # → http://localhost:3000
```

### 서버 (선택 — 다기기 동기화 시)

```bash
cd TimeTrack/server
npm install
npm run dev        # → http://localhost:5000
```

> 서버 없이도 클라이언트는 localStorage만으로 완전히 동작합니다.

### 환경 변수

`client/.env` 파일 생성 시 서버와 연동됩니다.

```env
REACT_APP_API_URL=http://localhost:5000
```

### 프로덕션 빌드

```bash
cd client
npm run build
```

---

## 6. API 명세

서버(`server/app.js`) 제공 REST API입니다.

### 기본

| 메서드 | 경로 | 설명 | 응답 |
|---|---|---|---|
| GET | `/` | 서버 상태 확인 | `{ status, message }` |

### 할 일 (Tasks)

| 메서드 | 경로 | Body | 설명 |
|---|---|---|---|
| GET | `/tasks` | — | 전체 목록 조회 |
| POST | `/tasks` | `{ text: string }` | 할 일 추가 |
| PUT | `/tasks/:id` | `{ text?, completed? }` | 텍스트 또는 완료 상태 수정 |
| PUT | `/tasks/reorder` | `{ orderedIds: string[] }` | 드래그 순서 저장 |
| DELETE | `/tasks/:id` | — | 개별 삭제 |
| DELETE | `/tasks` | — | 완료 항목 전체 삭제 |

> **현재 제약**: 서버는 인메모리 저장 방식으로, 재시작 시 데이터가 초기화됩니다.  
> 운영 환경에서는 MongoDB 또는 PostgreSQL 연동이 필요합니다.

---

## 7. 데이터 저장 구조

### timetrack-tasks

```json
[
  { "id": "1714000000000", "text": "보고서 작성", "completed": false },
  { "id": "1714000000001", "text": "코드 리뷰",   "completed": true  }
]
```

### timetrack-settings

```json
{ "focusTime": 25, "breakTime": 5, "repeatCycles": 4 }
```

### timetrack-stats

```json
[
  { "date": "2026-04-22", "focusMinutes": 100, "cycles": 4 },
  { "date": "2026-04-21", "focusMinutes":  75, "cycles": 3 }
]
```

---

## 8. 키보드 단축키

| 키 | 동작 | 조건 |
|---|---|---|
| `Space` | 타이머 시작 / 일시정지 | 입력 필드·모달 비활성 상태 |
| `R` | 타이머 초기화 | 입력 필드·모달 비활성 상태 |
| `N` | 할 일 입력창 포커스 | 입력 필드·모달 비활성 상태 |

---

## 9. 알려진 제약 및 로드맵

### 현재 제약

| 항목 | 내용 |
|---|---|
| 서버 인메모리 저장 | 재시작 시 데이터 초기화 — DB 연동 필요 |
| 다기기 동기화 미지원 | 현재 localStorage 단독 운용 |
| `react-beautiful-dnd` deprecated | 공식 지원 종료, 추후 `@hello-pangea/dnd` 교체 예정 |
| `react-scripts` (CRA) deprecated | Vite 또는 Next.js 마이그레이션 검토 중 |

### 로드맵

| 우선순위 | 항목 | 설명 |
|---|---|---|
| 🔴 단기 | DB 연동 | MongoDB/PostgreSQL + 서버 영속성 |
| 🔴 단기 | CRA → Vite 마이그레이션 | 빌드 속도 개선, 최신 도구체인 |
| 🟡 중기 | 사용자 인증 | JWT 기반 로그인, 다기기 동기화 |
| 🟡 중기 | 주간/월간 통계 | 집중 패턴 시각화 차트 |
| 🟢 장기 | PWA 전환 | 오프라인 지원, 앱 설치 |
| 🟢 장기 | TypeScript 마이그레이션 | 타입 안정성 강화 |

---

## 10. 변경 이력

### v1.2.0 (2026-04-22) — 버그 수정 및 안정화

**버그 수정**
- ■ 클릭 시 타이머 미정지 → `unfocusTask()` + `pauseIfActive()` 연동
- `resetTimer` 호출 후 `isBreak`·`currentCycle` 미초기화 → 완전 초기화로 수정
- 모든 사이클 완료 시 `activeTask` 미해제 → 자동 해제 추가
- 진행률 바 레이블이 `overflow: hidden`에 잘리는 CSS 버그
- `stopNoise`가 `useEffect` deps에 누락 → `useCallback` 처리

**개선**
- `startTimer`·`pauseTimer`·`resetTimer`·`pauseIfActive` 전부 `useCallback`으로 안정화
- `stateRef` 패턴 일원화로 stale closure 버그 예방
- Context `registerTimerControl` API를 단일 객체 인자로 통일

### v1.1.0 (2026-04-22) — UI/UX 대폭 강화

- 탭 타이틀 실시간 업데이트 (`⏱ 23:45 집중 중`)
- 키보드 단축키 (Space / R / N)
- 브라우저 알림 (Notification API)
- 배경음 옵션 (화이트노이즈 / 브라운노이즈)
- 오늘 집중 시간·사이클 통계 표시
- 완료 항목 접기/펼치기 분리 + 일괄 삭제
- 할 일 진행률 바
- 할 일 ↔ 타이머 연동 (▶ 클릭 → 즉시 시작)
- 서버 API 클라이언트 유틸 (`api/tasks.js`)

### v1.0.0 (2026-04-22) — 기반 개선

- `useEffect` 3단 분리로 타이머 interval 버그 수정
- `localStorage` 영속성 (할 일·설정·다크모드)
- 모달 레이아웃 절대 위치 → Flexbox 교체
- `body.dark-mode` 클래스 동기화 버그 수정
- Context API (`AppContext`) 전역 상태 도입
- `Task.js` ESC 취소, `React.memo` 적용
- 서버 CRUD REST API 구현

---

## 기여 방법

1. 레포지토리를 포크합니다.
2. 브랜치를 생성합니다: `git checkout -b feat/my-feature`
3. 변경 사항을 커밋합니다: `git commit -m "feat: 설명"`
4. 브랜치에 푸시합니다: `git push origin feat/my-feature`
5. Pull Request를 생성합니다.
