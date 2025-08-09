@echo off
chcp 65001 >nul
cls

echo GPT-4o 채팅 시작...
echo.

:: Node.js 있는지 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js 설치 필요!
    echo https://nodejs.org 에서 다운로드
    pause
    exit
)

:: 패키지 설치 (없으면)
if not exist node_modules npm install

:: 브라우저 열기
start http://localhost:3000

:: 서버 시작
echo ===========================
echo 브라우저에서 열렸습니다
echo 비밀번호: admin123
echo 종료: 이 창 닫기
echo ===========================
npm start