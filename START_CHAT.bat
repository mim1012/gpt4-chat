@echo off
echo ====================================
echo   GPT-4o 채팅 서버 시작
echo ====================================
echo.

:: Node.js 설치 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다!
    echo.
    echo Node.js를 먼저 설치해주세요:
    echo https://nodejs.org 에서 LTS 버전 다운로드
    echo.
    pause
    exit
)

echo [1/3] 의존성 설치 중...
call npm install --silent >nul 2>&1

echo [2/3] 서버 시작 중...
echo.
echo ====================================
echo   서버 시작 완료!
echo ====================================
echo.
echo   브라우저에서 아래 주소로 접속:
echo   http://localhost:3000
echo.
echo   비밀번호: admin123
echo.
echo   종료하려면 이 창을 닫으세요
echo ====================================
echo.

:: 서버 실행
npm start