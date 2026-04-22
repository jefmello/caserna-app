@echo off
REM =====================================================================
REM  caserna-upload.bat
REM
REM  Atalho one-click para publicar uma nova edicao da revista:
REM    1. Inicia `npm run dev` em uma janela minimizada
REM    2. Aguarda o servidor responder em http://localhost:3000/upload
REM    3. Abre o navegador nessa pagina
REM    4. Fica aguardando o arquivo .upload-done aparecer (escrito pelo
REM       server action quando o upload + push automatico terminam)
REM    5. Mata o servidor e fecha a janela
REM
REM  Copie este .bat para a Area de Trabalho e rode. Se o caminho do
REM  projeto mudar, ajuste PROJECT_DIR abaixo.
REM =====================================================================

setlocal EnableExtensions
set "PROJECT_DIR=C:\Users\jefme\caserna-app"
set "UPLOAD_URL=http://localhost:3000/upload"
set "SENTINEL=%PROJECT_DIR%\.upload-done"
set "WINDOW_TITLE=caserna-dev-server"

cd /d "%PROJECT_DIR%" || (
  echo [Caserna] Pasta do projeto nao encontrada: %PROJECT_DIR%
  pause
  exit /b 1
)

if exist "%SENTINEL%" del /q "%SENTINEL%"

echo [Caserna] Iniciando servidor de dev...
start "%WINDOW_TITLE%" /min cmd /c "npm run dev"

echo [Caserna] Aguardando servidor responder...
set /a ATTEMPTS=0
:wait-server
set /a ATTEMPTS+=1
if %ATTEMPTS% GTR 60 (
  echo [Caserna] Timeout aguardando o servidor. Abortando.
  goto cleanup
)
powershell -NoProfile -Command "try { $r=Invoke-WebRequest -Uri '%UPLOAD_URL%' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  timeout /t 2 /nobreak >nul
  goto wait-server
)

echo [Caserna] Abrindo pagina de upload...
start "" "%UPLOAD_URL%"

echo [Caserna] Aguardando conclusao do upload...
:wait-upload
timeout /t 3 /nobreak >nul
if not exist "%SENTINEL%" goto wait-upload

echo [Caserna] Upload finalizado. Encerrando servidor...
del /q "%SENTINEL%"

:cleanup
REM Mata o processo que estiver escutando na porta 3000 (nosso dev server).
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)
REM Fecha a janela do cmd que lanca o npm run dev.
taskkill /F /FI "WINDOWTITLE eq %WINDOW_TITLE%*" >nul 2>&1

echo [Caserna] Concluido.
timeout /t 2 /nobreak >nul
endlocal
exit /b 0
