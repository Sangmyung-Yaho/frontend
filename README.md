# 피부 컨디션 웹앱 (React + Vite + TypeScript)

피부 컨디션 Front-end 레포지토리입니다. Vite 기반의 React + TypeScript 프로젝트이며 피부 상태 기록, 루틴 관리, 지표 확인을 위한 웹앱입니다.

## 📍 라우팅

현재는 루트 라우트만 설정되어 있습니다.

- `/` — 앱 루트

## 🛠️ 기술 스택

- **Main:** React + Vite (TypeScript)
- **State Management:** Zustand
- **Server State:** TanStack Query
- **Routing:** react-router-dom
- **Styling:** Tailwind CSS
- **Forms:** react-hook-form, Zod, `@hookform/resolvers`
- **HTTP Client:** Axios
- **Auth/Storage:** Zustand 메모리 Access Token + HttpOnly Refresh Token 쿠키
- **Social Login:** Google, Kakao OAuth
- **Chart:** Recharts
- **Date:** date-fns
- **UI Feedback:** Sonner
- **Camera:** 브라우저 `getUserMedia` API
- **Linting & Formatting:** ESLint, Prettier
- **Git Hooks:** Husky, lint-staged

## 🏃 빠른 시작

### 사전 요구사항

- Node.js 20.19 이상 또는 22.12 이상
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# TypeScript 타입 검사 + 프로덕션 빌드
npm run build

# ESLint 검사
npm run lint

# 프로덕션 빌드 미리보기
npm run preview
```

Husky는 `npm install` 시 `prepare` 스크립트를 통해 자동 설정됩니다.

## 🔐 환경변수

루트의 `.env.example`을 참고해 `.env.local`에 환경별 값을 설정합니다.

| 변수                | 설명                 | 로컬 예시                   |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | 백엔드 API 기본 주소 | `http://localhost:8080/api` |

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

`.env.local`은 Git에 포함되지 않습니다. OAuth 관련 환경변수와 Redirect URI는 로그인 구현 방식이 확정된 후 추가합니다.

## 💻 개발 환경

VS Code 사용 시 다음 확장 프로그램 설치를 권장합니다.

- ESLint (Microsoft)
- Prettier - Code formatter (Prettier)

프로젝트 설정 파일:

- `.prettierrc`: 코드 포맷 규칙
- `eslint.config.js`: 코드 품질 및 React Hooks 규칙
- `lint-staged.config.mjs`: 커밋 전 검사 대상과 명령

## 📜 프로젝트 규약

### Git 협업 전략

- `main`: Production 배포용 안정 브랜치
- `dev`: 개발 메인 브랜치
- `feat/[기능이름]`: 기능 개발 브랜치 (예: `feat/login`)
- `fix/[수정내용]`: 버그 수정 브랜치 (예: `fix/button-layout`)
- `chore/[작업내용]`: 설정 및 환경 구성 브랜치 (예: `chore/setup-eslint`)

작업 순서:

1. `dev`에서 작업 브랜치를 생성합니다.
2. 작업 완료 후 `dev`를 대상으로 Pull Request를 생성합니다.
3. 코드 리뷰 후 `dev`에 병합합니다.
4. 배포할 기능이 검증되면 `dev`에서 `main`으로 릴리스 Pull Request를 생성합니다.

`main`은 Production 브랜치로 사용하며, `dev`와 기능 브랜치의 배포는 Preview로 취급합니다.

릴리스 Pull Request 제목은 다음 형식을 사용합니다.

```text
chore(release): 피부 컨디션 프로토타입 v0.1.0 배포
```

### 커밋 메시지 컨벤션

Conventional Commits 규칙을 따릅니다.

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: README 등 문서 수정
- `style`: 포맷팅 등 로직 변경이 없는 코드 스타일 수정
- `refactor`: 코드 리팩터링
- `chore`: 빌드 및 패키지 설정 등 코드 외 작업

예시:

```text
feat: 로그인 페이지 UI 구현
fix: 메인 페이지 레이아웃 깨짐 수정
docs: 실행 방법 추가
```

### 디렉터리 구조

다음 구조를 기준으로 실제 코드가 필요한 시점에 폴더를 생성합니다.

```text
src/
├── api/          # API 요청 함수 및 Axios 인스턴스
├── assets/       # 이미지, 폰트 등 정적 파일
├── components/
│   ├── common/   # 공통 컴포넌트 (Button, Input, Modal 등)
│   └── feature/  # 특정 기능 또는 도메인 컴포넌트
├── constants/    # 공통 상수
├── hooks/        # 공통 커스텀 훅
├── pages/        # 라우팅되는 페이지 컴포넌트
├── stores/       # Zustand 스토어
├── styles/       # 전역 CSS 및 Tailwind CSS
└── utils/        # 순수 유틸 함수
```

### 네이밍 컨벤션

- 컴포넌트와 페이지: `PascalCase` (예: `MyButton.tsx`, `LoginPage.tsx`)
- 훅, 유틸 함수, 변수: `camelCase` (예: `useMyHook.ts`, `formatDate.ts`)
- 타입과 인터페이스: `PascalCase` (예: `User`, `SkinRecord`)
- 상수: `UPPER_SNAKE_CASE` (예: `MAX_IMAGE_SIZE`)

## 🔒 Git Hooks

Husky와 lint-staged를 사용하여 커밋 전에 변경된 코드를 자동 검사합니다.

`git commit` 실행 시:

1. 변경된 TypeScript 파일에 ESLint 자동 수정을 적용합니다.
2. 변경된 파일에 Prettier 포맷팅을 적용합니다.
3. 해결되지 않은 오류가 있으면 커밋을 중단합니다.

커밋이 실패하면 오류를 수정한 뒤 다시 스테이징하고 커밋합니다.

```bash
git add .
git commit -m "feat: 기능 설명"
```

처음 clone한 뒤 `npm install`을 실행하면 Husky가 자동 설치됩니다. 커밋 전 자동 검사는 코드 품질 유지를 위한 필수 과정입니다.

## 필요할 때 추가 검토

- `react-webcam`: 카메라 구현이 복잡해질 경우
