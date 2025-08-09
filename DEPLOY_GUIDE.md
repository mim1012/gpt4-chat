# 🚀 Railway 배포 가이드 (5분 완료)

## 📋 준비사항
- GitHub 계정 (없으면 github.com에서 무료 가입)
- 이 프로젝트 파일들

## 🔧 배포 단계

### 1단계: GitHub에 코드 업로드

1. **GitHub 로그인**: https://github.com
2. **새 저장소 생성**: 
   - 우측 상단 "+" → "New repository"
   - Repository name: `gpt4-chat`
   - Public 선택
   - "Create repository" 클릭

3. **코드 업로드** (아래 명령어를 순서대로 실행):
```bash
git remote add origin https://github.com/YOUR_USERNAME/gpt4-chat.git
git branch -M main
git push -u origin main
```

### 2단계: Railway 배포

1. **Railway 접속**: https://railway.app
2. **GitHub로 로그인** 클릭
3. **"New Project"** 클릭
4. **"Deploy from GitHub repo"** 선택
5. **"gpt4-chat"** 저장소 선택
6. **"Deploy Now"** 클릭

### 3단계: 환경변수 설정 (중요!)

Railway 대시보드에서:

1. 프로젝트 클릭
2. **"Variables"** 탭 클릭
3. **"New Variable"** 클릭하여 아래 값들 추가:

```
OPENAI_API_KEY = [본인의 OpenAI API 키를 여기에 입력]
CHAT_PASSWORD = admin123
SESSION_SECRET = my-super-secret-key-change-this-12345
NODE_ENV = production
OPENAI_MODEL = gpt-4o
MAX_TOKENS = 800
TEMPERATURE = 0.7
```

4. **"Save"** 클릭
5. 자동으로 재배포됩니다 (2-3분 소요)

### 4단계: 접속 주소 확인

1. Railway 대시보드에서 프로젝트 클릭
2. **"Settings"** 탭
3. **"Domains"** 섹션
4. **"Generate Domain"** 클릭
5. 생성된 주소 확인 (예: `gpt4-chat-production.up.railway.app`)

## ✅ 배포 완료!

이제 생성된 주소로 접속하면 됩니다:
```
https://your-app-name.up.railway.app
```

## 📱 사용자에게 전달할 정보

### 접속 정보
- **웹사이트 주소**: `https://your-app-name.up.railway.app`
- **비밀번호**: admin123

### 사용 방법
1. 웹 브라우저에서 주소 입력
2. 비밀번호 입력 후 로그인
3. 채팅창에 질문 입력
4. Enter 키로 전송

## 💰 비용 안내

### Railway 무료 플랜
- 월 $5 크레딧 무료 제공
- 일반 사용 시 충분한 용량
- 초과 시 자동 중지 (과금 없음)

### OpenAI API 비용
- GPT-4o 사용 시 대화당 약 10-20원
- 월 $5-10 정도면 충분

## 🔒 보안 설정 (선택사항)

### 비밀번호 변경
Railway Variables에서:
```
CHAT_PASSWORD = 새로운비밀번호
```

### API 키 보안
- API 키는 Railway에서 안전하게 관리됨
- 코드에 노출되지 않음

## ⚠️ 주의사항

1. **API 키 보호**: 절대 공개하지 마세요
2. **비밀번호 관리**: 정기적으로 변경 권장
3. **사용량 모니터링**: OpenAI 대시보드에서 확인

## 🆘 문제 해결

### 배포 실패
1. package.json 확인
2. 환경변수 재확인
3. Railway 로그 확인

### 접속 안 됨
1. 도메인 생성 확인
2. 배포 상태 확인 (초록색 체크)
3. 환경변수 설정 확인

## 📊 관리 방법

### 로그 확인
Railway 대시보드 → "Logs" 탭

### 재시작
Railway 대시보드 → "Deploy" → "Restart"

### 업데이트
GitHub에 코드 push → 자동 재배포

---

**완료!** 이제 사용자는 아무것도 설치하지 않고 웹 브라우저만으로 GPT-4o를 사용할 수 있습니다.