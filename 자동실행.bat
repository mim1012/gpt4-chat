@echo off
chcp 65001 >nul
title GPT-4o 채팅 프로그램

cls
echo ╔═══════════════════════════════════════════╗
echo ║       GPT-4o 채팅 프로그램 v1.0          ║
echo ╚═══════════════════════════════════════════╝
echo.

:: Node.js 체크
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ❌ Node.js가 설치되어 있지 않습니다!
    echo.
    echo 📥 Node.js 다운로드: https://nodejs.org
    echo    LTS 버전을 다운로드하세요
    echo.
    echo 설치 후 다시 실행해주세요.
    pause
    exit
)

:: 첫 실행시 패키지 설치
if not exist node_modules (
    echo 📦 첫 실행 감지 - 패키지 설치 중...
    echo    (처음 한 번만 실행, 1-2분 소요)
    call npm install
    cls
    echo ╔═══════════════════════════════════════════╗
    echo ║       GPT-4o 채팅 프로그램 v1.0          ║
    echo ╚═══════════════════════════════════════════╝
    echo.
)

echo ✅ 서버 시작 중...
timeout /t 2 /nobreak >nul

:: 브라우저 자동 실행
start http://localhost:3000

cls
color 0A
echo ╔═══════════════════════════════════════════╗
echo ║         🚀 서버 실행 중 🚀               ║
echo ╚═══════════════════════════════════════════╝
echo.
echo   📍 주소: http://localhost:3000
echo   🔑 비밀번호: admin123
echo.
echo   💡 브라우저가 자동으로 열립니다
echo   ❌ 종료: 이 창을 닫으면 됩니다
echo.
echo ═════════════════════════════════════════════
echo.

:: 서버 실행
npm start