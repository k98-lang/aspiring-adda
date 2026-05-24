@echo off
title Aspiring Adda - Local Preview
echo ===================================================
echo   Aspiring Adda - Launching Local Preview
echo ===================================================
echo.

:: Check if node_modules exists, if not run npm install
if not exist node_modules (
    echo node_modules folder not found. Installing dependencies...
    call npm install
)

echo.
echo Starting the local Vite development server...
echo The website will automatically open in your browser shortly!
echo.

:: Run Vite dev server with the --open flag
call npm run dev -- --open

:: If it exits with an error code, it's likely the esbuild binary platform mismatch
if %errorlevel% neq 0 (
    echo.
    echo ===================================================
    echo [REPAIR] Server failed to start due to esbuild mismatch.
    echo Running automatic repair on esbuild binaries...
    echo ===================================================
    echo.
    
    :: Run esbuild post-install build script
    call node node_modules/esbuild/install.js
    
    :: Rebuild the dependency binary
    call npm rebuild esbuild
    
    :: Force install the native Windows esbuild compiler package
    call npm install @esbuild/win32-x64 --save-optional --no-save
    
    echo.
    echo ===================================================
    echo Repair complete! Retrying to start the server...
    echo ===================================================
    echo.
    
    call npm run dev -- --open
)

pause
