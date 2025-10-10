@echo off
cd /d "%~dp0"
git add DEPLOYMENT_GUIDE.md
git commit -m "Add deployment guide"
git push origin main
pause

