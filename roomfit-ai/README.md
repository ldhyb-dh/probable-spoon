# RoomFit AI

방 크기와 가구 정보를 바탕으로 공간 활용을 돕는 AI 인테리어 앱입니다. 현재 2일차 기능까지 구현되어 있습니다.

## 현재 기능 (2일차)

- Next.js App Router + TypeScript 프로젝트 소스 및 설정 작성
- Tailwind CSS, ESLint, TypeScript 검사 설정
- 로고·소개 문구·예시 평면도·서비스 소개가 포함된 반응형 홈 화면
- `내 방 만들기`에서 가로·세로 치수 입력 (cm, 100~2,000 정수)
- 비율을 유지하는 SVG 평면도, 치수·면적 표시, 예시 방, 입력 오류 안내
- 입력 수정 후 평면도 업데이트
- 한국어 문서 언어, 페이지 제목·설명, 키보드 포커스 및 본문 바로가기
- GitHub 저장

2026-11-12 후속 요청에 따라 의존성을 설치하고 프로덕션 빌드·서버 실행·HTTP 검증을 완료했습니다. ESLint와 TypeScript 검사도 통과했습니다. `package-lock.json`으로 설치 버전을 고정했습니다. 브라우저 시각 확인과 클릭 테스트는 실행 환경 제한으로 완료하지 못했습니다. 자세한 결과는 [검증 기록](docs/verification.md)을 참고하세요.

## 기술 구성

Next.js 16.4.6 / React 19 / TypeScript / Tailwind CSS 4 / ESLint 9 / App Router.
Node.js 최소 버전은 20.9입니다. Next.js와 eslint-config-next 버전을 맞췄으며, Tailwind와 PostCSS 플러그인은 4.3.3으로 맞췄습니다.

## 설치 및 실행

이 저장소의 `roomfit-ai` 폴더에서 실행합니다.

```sh
npm ci
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속합니다. 프로덕션 실행은 `npm run build` 후 `npm start`를 사용합니다.

```sh
npm run verify
```

`verify`는 ESLint → 치수 검증·도형 비율 테스트 → 프로덕션 빌드 → TypeScript → 프로덕션 HTTP smoke 검사를 순서대로 실행합니다. `npm run smoke`는 빌드된 앱을 임의의 빈 로컬 포트로 실행하고, 홈·준비 안내·404·CSS 응답을 확인한 후 서버를 종료합니다. 실제 브라우저 동작 검사는 포함하지 않습니다.

환경변수나 API 키는 1일차에 필요하지 않습니다.

## 파일 안내

- `src/app/page.tsx`: 홈 화면
- `src/app/layout.tsx`: 공통 문서 레이아웃 및 메타데이터
- `src/app/globals.css`: 색상·레이아웃·예시 평면도·반응형 스타일
- `src/app/room/new/page.tsx`: 방 치수 입력·2D 평면도
- `docs/day-01.md`: 1일차 범위, 완료 상태, 다음 작업

## 개발 범위

현재 직사각형 방의 치수를 수동으로 입력해 평면도를 생성할 수 있습니다. 입력은 현재 화면에서만 유지되며 새로고침 시 초기화됩니다. 저장·문/창문·AI 추천·가구 검색·사진 분석·3D 기능은 아직 구현되지 않았습니다. 홈 화면의 평면도는 가상 예시입니다.

[2일차 작업 기록](docs/day-02.md) · [웹 실행](https://roomfit-ai-dh.ldhyb-dh.chatgpt.site)

전체 MVP는 수동 치수 입력 기반 2D 평면도 → 기존 가구 등록 → AI 배치 추천 → 신규 가구 추천 → 저장·비교 순서로 진행합니다. 사진·스캔 기반 구조 인식과 3D는 후속 확장입니다.

## 저장 위치

현재 연결된 `ldhyb-dh/probable-spoon` 저장소의 `roomfit-ai/` 폴더에 저장했습니다. 독립 저장소 생성과 외부 배포는 수행하지 않았습니다. 개발 의존성은 이 프로젝트 내부에 설치해 검증했습니다.
