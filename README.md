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
6. [데이터 저장 구조](#6-데이터-저장-구조)
7. [키보드 단축키](#7-키보드-단축키)
8. [알려진 제약 및 로드맵](#8-알려진-제약-및-로드맵)
9. [변경 이력](#9-변경-이력)

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
| 국제화 | react-i18next | 런타임 ko/en 전환, 언어 감지 |
| 영속성 | localStorage | 백엔드 없이 브라우저 단독 저장 |
| 빌드·개발서버 | Vite 5 | esbuild 기반 빠른 HMR, 경량 번들 |
| 테스트 | Vitest + Testing Library | Vite 통합 테스트 러너 |
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
```

> 백엔드 없이 브라우저 단독으로 동작합니다. 모든 상태(할 일·설정·통계·다크모드)는 `localStorage`에 저장됩니다.

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

### 실행

```bash
git clone https://github.com/leekh8/TimeTrack.git
cd TimeTrack/client
npm install
npm start          # → http://localhost:3000
```

> 백엔드가 없어 별도 서버 구동 없이 위 명령만으로 완전히 동작합니다.

### 프로덕션 빌드

```bash
cd client
npm run build
```

---

## 6. 데이터 저장 구조

모든 상태는 브라우저 `localStorage`에 저장됩니다.

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

## 7. 키보드 단축키

| 키 | 동작 | 조건 |
|---|---|---|
| `Space` | 타이머 시작 / 일시정지 | 입력 필드·모달 비활성 상태 |
| `R` | 타이머 초기화 | 입력 필드·모달 비활성 상태 |
| `N` | 할 일 입력창 포커스 | 입력 필드·모달 비활성 상태 |

---

## 8. 알려진 제약 및 로드맵

### 현재 제약

| 항목 | 내용 |
|---|---|
| 다기기 동기화 미지원 | localStorage 단독 운용 — 기기 간 공유 불가 |
| `react-beautiful-dnd` deprecated | 공식 지원 종료, 추후 `@hello-pangea/dnd` 교체 예정 |

### 로드맵

| 우선순위 | 항목 | 설명 |
|---|---|---|
| 🔴 단기 | `react-beautiful-dnd` → `@hello-pangea/dnd` | 유지보수되는 포크로 교체 |
| 🟡 중기 | 백엔드 + 사용자 인증 | DB 영속성 + JWT 로그인으로 다기기 동기화 |
| 🟡 중기 | 주간/월간 통계 | 집중 패턴 시각화 차트 |
| 🟢 장기 | PWA 전환 | 오프라인 지원, 앱 설치 |
| 🟢 장기 | TypeScript 마이그레이션 | 타입 안정성 강화 |

---

## 9. 변경 이력

### v1.3.0 (2026-07-11) — 국제화·안정화 및 죽은 코드 제거

**기능**
- ko/en 국제화(react-i18next) — 런타임 언어 전환, 언어 감지, `<html lang>` 동기화
- 최근 7일 집중 히스토리 차트, 할 일 → 타이머 자동 시작

**버그 수정**
- 백그라운드 탭 타이머 드리프트 → `Date.now()` 벽시계 방식으로 재계산
- 집중 통계 UTC 날짜 오분류 → 로컬 날짜 키로 수정
- 할 일 id `${Date.now()}` 중복 가능 → 단조 시퀀스 `makeTaskId()`로 교체
- `SEO` 기본 `lang="en"`이 i18n과 `<html lang>` 경합 → 활성 언어 전달

**제거 (죽은 코드)**
- 미연결 Express 서버(`server/`) 및 미사용 API 클라이언트(`client/src/api/tasks.js`) 삭제
  — 앱은 처음부터 localStorage 단독으로 동작했고 어느 쪽도 호출되지 않았음

**개발 환경**
- CRA(`react-scripts`) → **Vite 5** 마이그레이션 — 빌드·HMR 속도 개선, 설치 패키지 1381→262개
- 테스트 러너 Jest → **Vitest** 전환 (기존 테스트 그대로 재사용, 21개 통과)
- JSX 포함 파일을 `.jsx` 확장자로 정리, 출력 디렉토리는 `build/` 유지(배포 호환)

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
