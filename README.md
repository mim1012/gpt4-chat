# GPT-4 Simple Web Chat

간단한 GPT-4 웹 채팅 인터페이스

## 🚀 빠른 시작

### 1. 환경변수 설정
`.env` 파일을 열고 다음 값을 설정하세요:
```env
OPENAI_API_KEY=sk-your-actual-api-key  # OpenAI API 키
CHAT_PASSWORD=your-secure-password     # 접속 비밀번호
SESSION_SECRET=random-string-here      # 랜덤 문자열로 변경
```

### 2. 로컬 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

브라우저에서 http://localhost:3000 접속

## 📦 배포 가이드

### Railway 배포 (추천)

1. [Railway](https://railway.app) 가입
2. GitHub에 코드 푸시
3. Railway 대시보드에서 "New Project" → "Deploy from GitHub repo"
4. 저장소 선택
5. 환경변수 설정:
   - `OPENAI_API_KEY`
   - `CHAT_PASSWORD`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
6. Deploy 클릭

### Render 배포

1. [Render](https://render.com) 가입
2. GitHub에 코드 푸시
3. "New" → "Web Service"
4. GitHub 저장소 연결
5. 설정:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. 환경변수 추가
7. "Create Web Service" 클릭

### Vercel 배포

1. `vercel.json` 파일 생성:
```json
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Vercel CLI 설치 및 배포:
```bash
npm i -g vercel
vercel
```

## 🔒 보안 체크리스트

- ✅ OpenAI API 키를 환경변수로 관리
- ✅ 비밀번호를 환경변수로 관리
- ✅ HTTPS 사용 (배포 시 자동)
- ✅ 세션 보안 설정
- ✅ Rate limiting 구현
- ✅ XSS 방지 (HTML 이스케이핑)

## 📝 사용법

1. 비밀번호 입력 후 로그인
2. 하단 입력창에 메시지 입력
3. Enter 키 또는 Send 버튼 클릭
4. GPT-4 응답 확인
5. 로그아웃 시 우측 상단 Logout 클릭

## 🛠 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **AI**: OpenAI GPT-4 API
- **Security**: Helmet, Rate Limiting, Session Management

## 📋 환경변수 설명

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 | ✅ |
| `CHAT_PASSWORD` | 접속 비밀번호 | ✅ |
| `SESSION_SECRET` | 세션 암호화 키 | ✅ |
| `NODE_ENV` | 환경 (development/production) | ❌ |
| `PORT` | 서버 포트 (기본: 3000) | ❌ |
| `FRONTEND_URL` | 프론트엔드 URL (CORS) | ❌ |

## ⚠️ 주의사항

1. **API 키 보안**: OpenAI API 키를 절대 공개하지 마세요
2. **비밀번호**: 강력한 비밀번호를 사용하세요
3. **세션 시크릿**: 랜덤한 긴 문자열을 사용하세요
4. **HTTPS**: 프로덕션에서는 반드시 HTTPS를 사용하세요

## 🐛 문제 해결

### "Missing required environment variables" 오류
→ `.env` 파일의 필수 환경변수를 모두 설정했는지 확인

### "Invalid password" 오류
→ `.env` 파일의 `CHAT_PASSWORD`와 입력한 비밀번호가 일치하는지 확인

### OpenAI API 오류
→ API 키가 유효한지, 사용량 제한에 걸리지 않았는지 확인

## 📄 라이센스

MIT