$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'AETHERA 3D Library starting on http://127.0.0.1:8777/index.html' -ForegroundColor Magenta
Start-Process 'http://127.0.0.1:8777/index.html'
python -m http.server 8777 --bind 127.0.0.1
