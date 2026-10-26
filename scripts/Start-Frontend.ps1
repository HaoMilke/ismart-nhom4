Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root 'frontend'
Write-Host 'Open http://127.0.0.1:5500/ after the server starts. Stop with Ctrl+C.'
if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 -m http.server 5500 --bind 127.0.0.1 --directory $frontend
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    & python -m http.server 5500 --bind 127.0.0.1 --directory $frontend
} else {
    throw 'Python 3 is required for this helper; alternatively open frontend with VS Code Live Server on port 5500.'
}
exit $LASTEXITCODE
