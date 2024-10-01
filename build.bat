@echo off
cd client
call npm install
call npm run build
rmdir /s /q ..\public\client
mkdir ..\public\client
xcopy /s /e /y dist\* ..\public\client\