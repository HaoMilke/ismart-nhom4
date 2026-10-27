Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host '=== SQL SERVER DATABASE ENGINE SERVICES ==='
$services = @(Get-CimInstance Win32_Service | Where-Object {
    $_.Name -eq 'MSSQLSERVER' -or $_.Name -like 'MSSQL$*'
})
if ($services.Count -eq 0) {
    Write-Host 'No SQL Server Database Engine service found. SSMS alone is not a database server.'
} else {
    $services | Select-Object Name, State, StartMode | Format-Table -AutoSize
}

Write-Host '=== LISTENING PORTS USED BY SQL SERVER ==='
$processes = @(Get-Process sqlservr -ErrorAction SilentlyContinue)
if ($processes.Count -gt 0) {
    $processIds = @($processes | Select-Object -ExpandProperty Id)
    $listeners = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
        Where-Object { $_.OwningProcess -in $processIds })
    $listeners | Select-Object LocalAddress, LocalPort | Format-Table -AutoSize
    if ($listeners.Count -eq 0) {
        Write-Host 'No TCP listener found. Enable TCP/IP for the instance in SQL Server Configuration Manager.'
    }
}

Write-Host '=== SQLCMD ==='
$client = Get-Command sqlcmd -ErrorAction SilentlyContinue
if ($client) { Write-Host $client.Source } else { Write-Host 'sqlcmd is not on PATH; scripts can also be run in SSMS.' }
