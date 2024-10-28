# TimeTrack

TimeTrack은 Pomodoro 타이머와 할 일 목록 관리 기능을 결합한 웹 애플리케이션입니다.

이 애플리케이션은 사용자가 작업을 효율적으로 관리하고 집중력을 높일 수 있도록 돕는다.

타이머와 할 일 목록 기능을 통합하여 학생, 직장인 등 다양한 사용자들이 반복적으로 사용할 수 있도록 설계되었다.

## 프로젝트 구조

이 프로젝트는 `client`와 `server` 디렉토리로 나뉘어 있으며, 각각 React.js와 Node.js를 사용하여 개발되었다.

```bash
TimeTrack/
├── client/ # React.js 클라이언트
│ ├── public/ # 정적 파일
│ ├── src/ # React 컴포넌트, 스타일 파일 등
│ └── package.json # 클라이언트 종속성과 스크립트
├── server/ # Node.js 서버
│ ├── app.js # 서버 엔트리 포인트
│ ├── routes/ # API 라우트 파일
│ └── package.json # 서버 종속성과 스크립트
└── README.md # 프로젝트 설명 파일
```

## 기능 소개

- **Pomodoro 타이머**: 25분 집중 + 5분 휴식 시간을 제공하며, 타이머가 완료될 때 알림을 표시한다.
- **할 일 목록 관리**: 할 일을 추가, 삭제, 수정할 수 있으며, 완료한 할 일을 표시할 수 있다.
- **통계 기능** (추가 예정): 완료한 작업 수, 집중 시간 등을 기록하여 사용자의 성과를 시각화한다.

## 설치 및 실행 방법

### 사전 요구 사항

- [Node.js](https://nodejs.org/) 설치
- [Git](https://git-scm.com/) 설치

### 1. 레포지토리 클론

```bash
  git clone https://github.com/yourusername/TimeTrack.git
  cd TimeTrack
```

### 2. 클라이언트 설정 및 실행

#### 1. client 디렉토리로 이동

```bash
  cd client
```

#### 2. 의존성을 설치

```bash
npm install
```

#### 3. React 개발 서버를 실행

```bash
npm start
```

개발 서버가 http://localhost:3000에서 실행된다.

### 3. 서버 설정 및 실행

#### 1. server 디렉토리로 이동

```bash
cd ../server
```

#### 2. 의존성을 설치

```bash
npm install
```

#### 3. Node 서버를 실행

```bash
npm run dev
```

서버가 http://localhost:5000에서 실행된다.

## API 엔드포인트

### 기본 엔드포인트

- GET /: 서버 상태 확인

### 할 일 목록 API (예시)

- POST /tasks: 새 할 일 추가
- GET /tasks: 모든 할 일 조회
- PUT /tasks/:id: 특정 할 일 수정
- DELETE /tasks/:id: 특정 할 일 삭제

## GitHub Actions로 배포

이 프로젝트는 GitHub Actions를 통해 자동 배포가 설정되어 있다.

Actions를 통해 클라이언트와 서버가 빌드되고, 자동으로 지정된 호스팅 서비스에 배포된다.

자세한 내용은 `.github/workflows` 폴더에서 확인할 수 있다.

## 사용 기술

- **클라이언트**: React.js, CSS
- **서버**: Node.js, Express
- **데이터베이스** (추가 가능): MongoDB
- **배포**: GitHub Actions

## 기여 방법

1. 이 레포지토리를 포크한다.
2. 새로운 브랜치를 생성한다: `git checkout -b feature/my-new-feature`
3. 변경 사항을 커밋한다: `git commit -am 'Add new feature'`
4. 브랜치에 푸시한다: `git push origin feature/my-new-feature`
5. Pull Request를 생성한다.
