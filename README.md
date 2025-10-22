# 꿈이자라는뜰 (Dream Garden)

AI 통합 발달장애인 모바일 플랫폼 - 신뢰 기반 기록 공유 및 성장 지원 서비스

## 📋 프로젝트 개요

'꿈이자라는뜰'은 발달장애인 당사자와 관련 이해관계자(교사, 보호자) 간의 기록을 신뢰 기반으로 공유하고, 개인의 성장 여정과 프로필을 체계적으로 축적하는 플랫폼입니다.

### 핵심 가치

- **Understanding (맥락적 이해)**: 행동의 배경과 인과 관계를 시각화
- **Reliable (신뢰 관계 유지)**: AI 기반 감정 중립화로 기록의 신뢰도 향상
- **Valuable (가치 창출)**: AI 역량 추출 및 포트폴리오 자동 생성

## 🚀 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v6
- **Styling**: Tailwind CSS + Emotion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Authentication**: Firebase Email Link Auth

## 📁 프로젝트 구조

```
dreamgarden/
├── app/                    # Next.js App Router
│   ├── auth/              # 인증 관련 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # Atomic Design 기반 컴포넌트
│   ├── atoms/            # 기본 컴포넌트
│   ├── molecules/        # 조합 컴포넌트
│   ├── organisms/        # 복합 컴포넌트
│   ├── templates/        # 페이지 템플릿
│   └── layout/           # 레이아웃 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── firebase/         # Firebase 설정 및 함수
│   ├── utils/            # 유틸리티 함수
│   └── theme.ts          # MUI 테마 설정
├── hooks/                 # Custom React Hooks
├── types/                 # TypeScript 타입 정의
└── public/                # 정적 파일

```

## 🔧 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- Yarn 패키지 매니저

### 설치

```bash
# 의존성 설치
yarn install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 Firebase 설정 입력

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

### 환경 변수

`.env.local` 파일에 다음 변수들을 설정하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI API Keys (Server-side only)
GEMINI_API_KEY=
PERPLEXITY_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔐 Firebase 설정

### Firestore Security Rules 배포

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firestore Rules 배포
firebase deploy --only firestore:rules
```

## 📱 주요 기능

### 1. 이메일 링크 인증 (F00)
- 비밀번호 없는 간편한 이메일 링크 로그인
- Firebase Email Link Authentication 사용

### 2. 기록 작성 및 관리 (F01)
- 주체별(교사, 보호자) 일지 기록
- 인과 시각화: 등교 전/중/후 기록 자동 연결
- 미디어 첨부 (사진 최대 20개, 파일 최대 5개)
- 감정 카드 및 체크리스트

### 3. AI 감정 중립화 (F02) - 예정
- 모호하거나 과격한 표현 자동 감지
- 중립적 언어로 재구성 제안
- 교사의 수락/거절 기능

### 4. AI 역량 프로필 생성 (F03) - 예정
- 축적된 기록 분석
- 핵심 역량 자동 추출
- 포트폴리오 자동 생성 (PDF)
- 직업 추천

### 5. 역할 기반 접근 통제 (F04)
- Teacher, Parent, Individual, Staff 역할 관리
- Firestore Security Rules 기반 권한 제어

## 📊 데이터 모델

핵심 엔티티:

- **User**: 사용자 정보 (역할, 소속 등)
- **Student**: 학생/당사자 정보
- **Record**: 일지 기록 (원본/공유 텍스트, AI 플래그 등)
- **Comment**: 기록에 대한 댓글
- **Portfolio**: AI 생성 포트폴리오
- **Competency**: 역량 정보
- **Facility**: 기관/학교 정보

자세한 타입 정의는 `types/index.ts` 참조

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: 초록색 (#4CAF50) - 성장 상징
- **Secondary**: 오렌지색 (#FF9800) - 따뜻함

### 컴포넌트 원칙

- MUI 컴포넌트 우선 사용
- Raw HTML 요소 사용 금지
- 파일당 200줄 이하 유지
- Atomic Design 패턴 준수

## 🧪 테스트

```bash
# 린트 실행
yarn lint

# 타입 체크
yarn build
```

## 📝 개발 워크플로우

1. **코드 작성**
2. **빌드 검증**: `yarn build`
3. **테스트 실행**: `yarn test` (추후 추가)
4. **커밋 및 푸시**

## 🤝 기여 가이드

1. 브랜치 생성: `git checkout -b feature/기능명`
2. 변경사항 커밋: `git commit -m "feat: 기능 설명"`
3. 빌드 확인: `yarn build`
4. 푸시: `git push origin feature/기능명`

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.

---

**Last Updated**: 2025-10-22
