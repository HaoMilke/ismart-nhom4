Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$localFile = Join-Path $root 'namtronlogin/application-local.properties'
if (Test-Path $localFile) {
    Write-Host 'Local configuration already exists. It was not overwritten.'
    exit 0
}

function ConvertTo-PropertyValue([string]$Value) {
    return $Value.Replace('\', '\\').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t').Replace(' ', '\ ')
}

$dbUser = Read-Host 'Local MySQL/MariaDB username (Enter = root)'
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = 'root' }
$securePassword = Read-Host 'Local database password (Enter if empty)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    $keyBytes = New-Object byte[] 32
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($keyBytes) } finally { $rng.Dispose() }
    $jwtKey = [Convert]::ToBase64String($keyBytes)
    $lines = @(
        '# Private local configuration. Never commit this file.'
        ('spring.datasource.username=' + (ConvertTo-PropertyValue $dbUser))
        ('spring.datasource.password=' + (ConvertTo-PropertyValue $dbPassword))
        ('jwt.secret=' + $jwtKey)
    )
    [IO.File]::WriteAllText($localFile, ($lines -join "`n") + "`n", (New-Object Text.UTF8Encoding($false)))
    Write-Host 'Created private local configuration with a random JWT key.'
    Write-Host 'Keep this file on your own computer. Git ignores it.'
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $dbPassword = $null
    $jwtKey = $null
}
