@echo off
chcp 65001 >nul
title 처음 사용자용 - GPT 채팅 설치
color 0B

:menu
cls
echo.
echo    ┌─────────────────────────────────────────┐
echo    │                                         │
echo    │      GPT 채팅 프로그램 (초간단)        │
echo    │                                         │
echo    │      처음이신가요?                     │
echo    │                                         │
echo    │      [1] 네, 처음입니다 (설치)         │
echo    │      [2] 아니요, 설치했어요 (실행)     │
echo    │                                         │
echo    └─────────────────────────────────────────┘
echo.
set /p choice="   숫자를 누르고 Enter: "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto run
goto menu

:install
cls
echo.
echo    ┌─────────────────────────────────────────┐
echo    │                                         │
echo    │         자동 설치를 시작합니다          │
echo    │                                         │
echo    │      5-10분 정도 걸립니다              │
echo    │      기다려주세요...                   │
echo    │                                         │
echo    └─────────────────────────────────────────┘
echo.

:: Node.js 체크
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 goto skip_node

echo    Node.js 설치 중... (한 번만 하면 됩니다)
echo.

:: Node.js 다운로드 URL (LTS 버전)
set NODE_URL=https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi

:: 다운로드
echo    다운로드 중... 잠시만 기다려주세요
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; try { Invoke-WebRequest -Uri '%NODE_URL%' -OutFile 'node_setup.msi' } catch { exit 1 }}"

if not exist node_setup.msi (
    echo.
    echo    인터넷 연결을 확인해주세요!
    echo    수동으로 설치하려면:
    echo    https://nodejs.org 에서 다운로드
    pause
    exit
)

:: 설치
echo    설치 중... (설치 창이 나타나면 Next 클릭)
msiexec /i node_setup.msi /passive /norestart
del node_setup.msi >nul 2>&1

:: PATH 업데이트
set PATH=%PATH%;C:\Program Files\nodejs\

:skip_node
echo.
echo    채팅 프로그램 설치 중...
call npm install >nul 2>&1

cls
echo.
echo    ┌─────────────────────────────────────────┐
echo    │                                         │
echo    │         ✅ 설치 완료!                  │
echo    │                                         │
echo    │      3초 후 자동 실행됩니다            │
echo    │                                         │
echo    └─────────────────────────────────────────┘
timeout /t 3 /nobreak >nul

:run
cls
echo.
echo    ┌─────────────────────────────────────────┐
echo    │                                         │
echo    │         채팅 프로그램 실행 중           │
echo    │                                         │
echo    │      인터넷 창이 열립니다              │
echo    │      비밀번호: admin123                │
echo    │                                         │
echo    │      종료: 이 창 닫기 (X)              │
echo    │                                         │
echo    └─────────────────────────────────────────┘
echo.

start http://localhost:3000
npm start