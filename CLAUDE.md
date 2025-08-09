# GPT-4.0 Simple Web Chat Project

## 프로젝트 요구사항

### 핵심 요구사항
- **모델**: OpenAI GPT-4.0 (gpt-4 모델 사용)
- **인증**: 간단한 비밀번호 인증 (세션 기반)
- **UI**: 최소한의 채팅 인터페이스
  - 좌측: 대화 내용 표시
  - 하단: 입력창 + 전송 버튼
- **데이터**: 대화 기록 저장 불필요 (메모리에만 유지)
- **기능 제한**: 파일 업로드, 이미지 처리 제외
- **우선순위**: 안정성 > 속도

### 기술 스택
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js + Express
- **API**: OpenAI API (gpt-4)
- **인증**: express-session
- **배포**: Railway 또는 Render

### 보안 요구사항
- OpenAI API 키는 환경변수로 관리
- 비밀번호는 환경변수로 관리
- 세션 쿠키는 httpOnly, secure 설정
- HTTPS 필수
- CORS 적절히 설정

### 프로젝트 구조
```
gpt4-chat/
├── server.js           # 메인 서버 파일
├── package.json        # 의존성 관리
├── .env               # 환경변수 (git 제외)
├── .gitignore         # Git 제외 파일
├── public/            # 정적 파일
│   ├── index.html     # 메인 HTML
│   ├── style.css      # 스타일
│   └── script.js      # 프론트엔드 로직
└── middleware/        # 미들웨어
    └── auth.js        # 인증 미들웨어
```

### 환경변수 설정
```
OPENAI_API_KEY=sk-xxxxx  # OpenAI API 키
CHAT_PASSWORD=xxxxx      # 접속 비밀번호
SESSION_SECRET=xxxxx     # 세션 암호화 키
NODE_ENV=production      # 프로덕션 환경
PORT=3000               # 서버 포트
```

### API 엔드포인트
- `POST /api/login` - 비밀번호 인증
- `POST /api/logout` - 로그아웃
- `POST /api/chat` - GPT-4와 대화
- `GET /api/check-auth` - 인증 상태 확인

### 개발 명령어
```bash
npm run dev   # 개발 서버 실행 (nodemon)
npm start     # 프로덕션 서버 실행
```

### 배포 체크리스트
- [ ] 환경변수 설정 완료
- [ ] HTTPS 활성화
- [ ] 세션 보안 설정 확인
- [ ] API 키 노출 여부 확인
- [ ] 에러 핸들링 구현
- [ ] Rate limiting 구현
- [ ] 기본 테스트 완료

### 주의사항
1. API 키는 절대 코드에 하드코딩하지 않음
2. .env 파일은 반드시 .gitignore에 포함
3. 세션 타임아웃 설정 (24시간)
4. 에러 발생 시 재시도 로직 구현
5. 사용자 입력 HTML 이스케이핑

## 작업 진행 상태
- [x] 프로젝트 초기화
- [x] 의존성 설치
- [ ] 서버 구현
- [ ] 인증 미들웨어
- [ ] 프론트엔드 구현
- [ ] 테스트
- [ ] 배포