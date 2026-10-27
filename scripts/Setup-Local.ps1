param([switch]$Reconfigure)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$localFile = Join-Path $root 'namtronlogin/application-local.properties'
if ((Test-Path $localFile) -and -not $Reconfigure) {
    Write-Host 'Local configuration already exists. It was not overwritten.'
    Write-Host 'To switch an existing configuration to SQL Server, run this script with -Reconfigure.'
    exit 0
}

function ConvertTo-PropertyValue([string]$Value) {
    return $Value.Replace('\', '\\').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t').Replace(' ', '\ ')
}

$dbHost = Read-Host 'SQL Server TCP host (Enter = localhost)'
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = 'localhost' }
if ($dbHost -notmatch '^[A-Za-z0-9_.-]+$') {
    throw 'Enter only a host name or IPv4 address. Use the TCP port for a named instance.'
}
$portInput = Read-Host 'SQL Server TCP port (Enter = 1433)'
$dbPort = 1433
if (-not [string]::IsNullOrWhiteSpace($portInput)) {
    if (-not [int]::TryParse($portInput, [ref]$dbPort) -or $dbPort -lt 1 -or $dbPort -gt 65535) {
        throw 'TCP port must be a number from 1 to 65535.'
    }
}
$dbUser = Read-Host 'SQL authentication login (Enter = ismart_app)'
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = 'ismart_app' }
$securePassword = Read-Host 'Password for this SQL Server login' -AsSecureString
if ($securePassword.Length -eq 0) { throw 'A SQL Server login password is required.' }
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $keyBytes = New-Object byte[] 32
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($keyBytes) } finally { $rng.Dispose() }
    $jwtKey = [Convert]::ToBase64String($keyBytes)
    $lines = @(
        '# Private local configuration. Never commit this file.'
        '# Local development uses an encrypted connection with the local server certificate trusted.'
        ('spring.datasource.url=jdbc:sqlserver://' + $dbHost + ':' + $dbPort + ';databaseName=shop_db;encrypt=true;trustServerCertificate=true;loginTimeout=10')
        ('spring.datasource.username=' + (ConvertTo-PropertyValue $dbUser))
        ('spring.datasource.password=' + (ConvertTo-PropertyValue $dbPassword))
        ('jwt.secret=' + $jwtKey)
    )
    if (Test-Path $localFile) {
        $backupDirectory = Join-Path $root 'private/local-config'
        $null = New-Item -ItemType Directory -Force -Path $backupDirectory
        $backupName = 'application-local-' + [DateTime]::UtcNow.ToString('yyyyMMdd-HHmmss-fffffff') + '.properties'
        Copy-Item -LiteralPath $localFile -Destination (Join-Path $backupDirectory $backupName) -ErrorAction Stop
        Write-Host 'Previous configuration backed up under the ignored private/local-config directory.'
    }
    [IO.File]::WriteAllText($localFile, ($lines -join "`n") + "`n", (New-Object Text.UTF8Encoding($false)))
    Write-Host 'Created private SQL Server configuration with a random JWT key.'
    Write-Host 'Keep this file on your own computer. Git ignores it.'
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $dbPassword = $null
    $jwtKey = $null
}
