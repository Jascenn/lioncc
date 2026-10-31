@echo off
REM LionCC 启动脚本 - Windows

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "NODE_SCRIPT=%SCRIPT_DIR%bin\lioncc.js"

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [91m❌ 未安装 Node.js[0m
    echo.
    echo [93m请先安装 Node.js ^(需要 22.0.0 或更高版本^):[0m
    echo   访问 https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 检查依赖
if not exist "%SCRIPT_DIR%node_modules" (
    echo [96m📦 首次运行，正在安装依赖...[0m
    echo.
    cd /d "%SCRIPT_DIR%"
    call npm install
    echo.
)

REM 运行工具
node "%NODE_SCRIPT%"

pause
