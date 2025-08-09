@echo off
chcp 65001 >nul
title GPT-4o 채팅 설치 프로그램
color 0E

cls
echo ╔═══════════════════════════════════════════════╗
echo ║                                               ║
echo ║        GPT-4o 채팅 자동 설치 프로그램         ║
echo ║                                               ║
echo ║           그냥 Enter만 누르세요!              ║
echo ║                                               ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo 아무 키나 누르면 자동으로 설치가 시작됩니다...
pause >nul

cls
echo ═══════════════════════════════════════════════
echo  설치를 시작합니다... (5-10분 소요)
echo ═══════════════════════════════════════════════
echo.

:: Node.js 체크
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js가 이미 설치되어 있습니다!
    goto :install_packages
)

echo 📥 Node.js 다운로드 중... (잠시만 기다려주세요)
echo.

:: Node.js 다운로드 (Windows 64비트)
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile 'nodejs_installer.msi'}"

if not exist nodejs_installer.msi (
    echo ❌ 다운로드 실패! 인터넷 연결을 확인해주세요.
    pause
    exit
)

echo 📦 Node.js 설치 중... (2-3분 소요)
echo    ※ 설치 창이 나타나면 "Next" 버튼만 계속 클릭하세요!
echo.
echo ═══════════════════════════════════════════════
echo.

:: Node.js 자동 설치
start /wait msiexec /i nodejs_installer.msi /qb ADDLOCAL=ALL

:: 설치 파일 삭제
del nodejs_installer.msi >nul 2>&1

:: PATH 새로고침
set PATH=%PATH%;C:\Program Files\nodejs\

:install_packages
cls
echo ═══════════════════════════════════════════════
echo  채팅 프로그램 설치 중... (거의 다 됐습니다!)
echo ═══════════════════════════════════════════════
echo.

:: npm 패키지 설치
if not exist node_modules (
    echo 📦 필요한 파일들 설치 중...
    call npm install >nul 2>&1
)

cls
color 0A
echo ╔═══════════════════════════════════════════════╗
echo ║                                               ║
echo ║           ✅ 설치 완료!                      ║
echo ║                                               ║
echo ║      이제 "실행.bat"을 더블클릭하세요         ║
echo ║                                               ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo 3초 후에 자동으로 실행됩니다...
timeout /t 3 /nobreak >nul

:: 실행 파일 생성
call 실행.bat