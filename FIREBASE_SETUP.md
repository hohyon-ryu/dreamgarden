# Firebase 설정 가이드

이메일 링크 인증을 사용하기 위한 Firebase 설정 방법입니다.

## 1. Firebase Console 설정

### 1.1 이메일 링크 인증 활성화

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `dreamgarden-4eaff`
3. 좌측 메뉴에서 **Authentication** 클릭
4. **Sign-in method** 탭 선택
5. **이메일/비밀번호** 제공업체 찾기
6. **사용 설정** 클릭
7. **이메일 링크(비밀번호가 필요 없는 로그인)** 옵션 활성화
8. **저장** 클릭

### 1.2 승인된 도메인 추가

1. Authentication > **Settings** 탭
2. **승인된 도메인** 섹션에서 다음 도메인들이 있는지 확인:
   - `localhost`
   - `127.0.0.1`

   없으면 **도메인 추가** 버튼으로 추가

## 2. 이메일 템플릿 설정 (선택사항)

1. Authentication > **Templates** 탭
2. **이메일 주소 확인** 템플릿 선택
3. 한국어로 템플릿 수정:
   - 제목: `꿈이자라는뜰 로그인`
   - 본문 수정

## 3. 로컬 개발 환경 테스트

### 3.1 개발 서버 실행

```bash
yarn dev
```

### 3.2 로그인 테스트

1. http://localhost:3200/auth/signin 접속
2. 이메일 주소 입력
3. "로그인 링크 받기" 클릭
4. 이메일 확인 (스팸 폴더도 확인)
5. 이메일의 링크 클릭

### 3.3 문제 해결

#### 이메일이 오지 않는 경우

1. Firebase Console > Authentication > Users 에서 사용자가 생성되었는지 확인
2. 스팸 폴더 확인
3. Firebase Console > Authentication > Templates에서 이메일 템플릿 확인

#### 링크 클릭 후 에러가 나는 경우

1. 브라우저 콘솔 에러 확인
2. Firebase Console > Authentication > Settings > 승인된 도메인에 `localhost` 있는지 확인
3. `.env.local` 파일의 `NEXT_PUBLIC_APP_URL` 확인

#### "Invalid action code" 에러

- 이메일 링크는 1시간 후 만료됩니다
- 새로운 링크를 요청하세요

## 4. Firestore 규칙 배포

```bash
# Firebase CLI 설치 (미설치 시)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (최초 1회)
firebase init

# Firestore 규칙만 선택
# 기존 firestore.rules 파일 사용 선택

# 규칙 배포
firebase deploy --only firestore:rules
```

## 5. 프로덕션 배포 시

프로덕션 도메인을 Firebase Console의 승인된 도메인에 추가하세요:

1. Authentication > Settings > 승인된 도메인
2. 프로덕션 도메인 추가 (예: `dreamgarden.app`)
3. `.env.production` 파일에 프로덕션 URL 설정:
   ```
   NEXT_PUBLIC_APP_URL=https://dreamgarden.app
   ```

## 6. 보안 참고사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- API 키는 클라이언트에 노출되어도 괜찮습니다 (Firebase Security Rules로 보호됨)
- Firestore Security Rules를 반드시 설정하여 데이터 접근을 제한하세요

## 7. 디버깅

### Firebase 로그 확인

```bash
# Firebase Functions 로그
firebase functions:log

# Firestore 규칙 테스트
firebase emulators:start
```

### 브라우저 개발자 도구

1. F12 또는 Cmd+Option+I (Mac)
2. Console 탭에서 에러 확인
3. Network 탭에서 Firebase API 호출 확인

---

**도움이 필요하면 이슈를 생성해주세요!**
