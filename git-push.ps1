Set-Location $PSScriptRoot
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host "Adding files..." -ForegroundColor Yellow
git add .
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Add deployment guide and push scripts"
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "Done!" -ForegroundColor Green
Read-Host "Press Enter to close"

