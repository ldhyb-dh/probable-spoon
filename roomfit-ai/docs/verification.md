# 빌드 및 실행 검증

검증일: 2026-11-12 (한국 시간)

## 환경

- Node.js v24.22.1, npm 11.9.0
- Next.js 16.4.6, React 19.3.1, Tailwind CSS 4.3.3
- npm install 성공: 361개 패키지 설치 및 package-lock.json 생성

## 결과

`npm run verify` 전체 종료 코드 0.

| 검사 | 결과 |
| --- | --- |
| ESLint | 오류 0, 경고 0 |
| next build | 성공, / 및 /room/new 정적 페이지 생성 |
| next typegen + tsc --noEmit | 성공 |
| next start | 프로덕션 서버 정상 시작 |
| GET / | HTTP 200 및 홈 제목 확인 |
| GET /room/new | HTTP 200 및 준비 안내 문구 확인 |
| 홈의 시작 링크 | 서버 HTML에서 /room/new 목적지 확인 |
| 빌드된 CSS | HTTP 200 및 홈 스타일 포함 확인 |
| 존재하지 않는 경로 | HTTP 404 확인 |

## 수정 사항

- PostCSS 설정의 익명 default export를 변수 선언 후 export로 변경하여 ESLint 경고 제거.
- next typegen을 typecheck 명령에 포함하여 라우트 타입을 먼저 생성.
- package-lock.json 추가로 실제 설치 버전 기록.
- scripts/smoke.mjs 및 npm run smoke, npm run verify 추가.
- Next.js가 생성한 next-env.d.ts 갱신.

## 브라우저 검증 한계

Playwright로 설치된 Chromium 실행을 시도했으나 소켓 생성 권한 오류(`socket() failed: Operation not permitted`)로 브라우저가 종료됐습니다. 공유 브라우저에서도 localhost:3000에 ERR_CONNECTION_REFUSED가 발생했습니다. 서버와 검증 클라이언트를 동일한 실행 환경에서 시작하여 HTTP 검사는 정상 수행했습니다.

따라서 화면 레이아웃·모바일 표시·브라우저 클릭·클라이언트 런타임 오류 여부는 검증 완료로 표시하지 않았습니다. HTTP smoke 검사는 실제 브라우저 검사를 대신하지 않습니다.

## 재현

roomfit-ai 폴더에서:

```sh
npm ci
npm run verify
npm start
```

브라우저에서 http://localhost:3000 접속 후 홈 → 내 방 만들기 → 홈으로 돌아가기 순서를 확인합니다. 서버 실행은 개발 환경에서 검증했으며 외부 호스팅 배포는 하지 않았습니다. node_modules와 .next 빌드 산출물은 GitHub에 저장하지 않습니다.
