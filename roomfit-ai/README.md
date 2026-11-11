# RoomFit AI

방 크기와 가구 정보를 바탕으로 공간 활용을 돕는 AI 인테리어 앱의 첫 개발 단계입니다.

## 1일차 결과

- Next.js App Router + TypeScript 프로젝트 소스 및 설정 작성
- Tailwind CSS, ESLint, TypeScript 검사 설정
- 로고·소개 문구·예시 평면도·서비스 소개가 포함된 반응형 홈 화면
- `내 방 만들기` 클릭 시 `/room/new` 준비 안내 화면으로 이동
- 한국어 문서 언어, 페이지 제목·설명, 키보드 포커스 및 본문 바로가기
- GitHub 저장

요청에 따라 설치 명령은 실행하지 않았습니다. Next.js 의존성이 없는 환경에서 작성했으므로 개발 서버 실행, 실제 브라우저 표시, ESLint, TypeScript 전체 검사 및 프로덕션 빌드는 아직 검증하지 않았습니다. 패키지 설치를 실행하지 않아 lockfile도 생성하지 않았습니다.

## 기술 구성

Next.js 16.4.6 / React 19 / TypeScript / Tailwind CSS 4 / ESLint 9 / App Router.
Node.js 최소 버전은 20.9입니다. Next.js와 eslint-config-next 버전을 맞췄으며, Tailwind와 PostCSS 플러그인은 4.3.3으로 맞췄습니다.

## 실행 (의존성이 준비된 환경)

이 저장소의 `roomfit-ai` 폴더에서 실행합니다.

```sh
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속합니다. 의존성이 아직 없다면 이 명령만으로 실행되지 않습니다.

```sh
npm run lint
npm run typecheck
npm run build
```

환경변수나 API 키는 1일차에 필요하지 않습니다.

## 파일 안내

- `src/app/page.tsx`: 홈 화면
- `src/app/layout.tsx`: 공통 문서 레이아웃 및 메타데이터
- `src/app/globals.css`: 색상·레이아웃·예시 평면도·반응형 스타일
- `src/app/room/new/page.tsx`: 다음 단계 준비 안내
- `docs/day-01.md`: 1일차 범위, 완료 상태, 다음 작업

## 개발 범위

현재 실제 방 입력·저장·AI 추천·가구 검색·사진 분석·3D 기능은 구현되지 않았습니다. 홈 화면의 평면도는 직접 그린 가상 예시입니다.

전체 MVP는 수동 치수 입력 기반 2D 평면도 → 기존 가구 등록 → AI 배치 추천 → 신규 가구 추천 → 저장·비교 순서로 진행합니다. 사진·스캔 기반 구조 인식과 3D는 후속 확장입니다.

## 저장 위치

현재 연결된 `ldhyb-dh/probable-spoon` 저장소의 `roomfit-ai/` 폴더에 저장했습니다. 독립 저장소 생성·프로그램 설치·배포는 수행하지 않았습니다.
