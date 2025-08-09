@echo off
chcp 65001 >nul
title GPT-4o 채팅
color 0A

cls
echo ╔═══════════════════════════════════════════════╗
echo ║                                               ║
echo ║           GPT-4o 채팅 실행 중...             ║
echo ║                                               ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: 브라우저 자동 열기
echo 인터넷 창을 여는 중...
timeout /t 3 /nobreak >nul
start http://localhost:3000

cls
echo ╔═══════════════════════════════════════════════╗
echo ║                                               ║
echo ║         ✅ 실행 중입니다!                    ║
echo ║                                               ║
echo ║    인터넷 창에서:                            ║
echo ║    비밀번호: admin123                        ║
echo ║                                               ║
echo ║    종료: 이 창을 닫으세요 (X 버튼)           ║
echo ║                                               ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo ─────────────────────────────────────────────────

:: 서버 실행
npm start