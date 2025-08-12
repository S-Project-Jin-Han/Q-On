# 🥕 QR 출석 웹앱

고정 QR 코드 기반으로 학원·스터디·소규모 그룹의 출석, 지각, 결석을 **자동 판정**하고  
실시간으로 집계·관리할 수 있는 웹 서비스입니다.

---

## 🎯 배경 및 목적

기존의 **수기 출석 방식**은 다음과 같은 문제가 있었습니다.

- 수기 작성·호명 방식으로 시간이 오래 걸림.
- 대리 출석, 누락, 기록 오류 등 부정 가능성 높음.
- 지각/결석 판정이 회차마다 달라 분쟁 발생.
- 실시간 집계와 데이터 관리가 어려움.

이 프로젝트는 **고정 QR 코드 기반의 자동화된 출석 시스템**을 도입하여,

- 출석 처리 시간을 단축하고
- 부정 출석을 방지하며
- 명확한 판정 기준으로 분쟁을 줄이고
- 실시간 출석 현황과 통계를 제공

하는 것을 목표로 합니다.

---

## 🚀 주요 기능

### 1. 입실 / 퇴실 QR 체크

- **입실 QR 체크인**: CLASS 시작 전 지정된 시각부터 스캔 가능.
- **퇴실 QR 체크아웃**: CLASS 종료 시각에 맞춰 스캔 필요.
- **자동 판정 로직**:
  - 지각 기준 전 입실 → `출석`
  - 지각 기준 후 입실 → `지각`
  - 종료 시각 이후 퇴실 미진행 → `결석`

### 2. 실시간 출석 집계

- GROUP별 **실시간 보드** 제공.
- 총원, 정상 출석, 지각, 결석 수 및 지각률 표시.
- 최근 50명 기록, 검색·정렬·필터 기능 지원.

### 3. 관리자 / 사용자 권한 분리

- **ADMIN**: 전체 시스템 관리.
- **OWNER**: 특정 학원(SPACE) 단위 반(GROUP)·사용자 관리.
- **HOST**: 지정된 반의 출석 기록 수정·통계 조회.
- **MEMBER**: 입실/퇴실 체크, 본인 근퇴 기록 확인.

### 4. PWA 지원

- 모바일 홈 화면 바로가기 기능.
- 브라우저에서 카메라를 이용해 QR 코드 스캔 가능.

---

## 🛠 프레임워크 / 기술 스택

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=storybook&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Husky-000000?style=for-the-badge&logo=github&logoColor=white" />
</p>
