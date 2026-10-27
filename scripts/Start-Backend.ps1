Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root 'namtronlogin'

if ($env:JAVA_HOME) {
    $java = Join-Path $env:JAVA_HOME 'bin/java.exe'
    $javac = Join-Path $env:JAVA_HOME 'bin/javac.exe'
    if (-not (Test-Path $java) -or -not (Test-Path $javac)) {
        throw 'JAVA_HOME must point to a JDK installation.'
    }
} else {
    $java = (Get-Command java -ErrorAction Stop).Source
    $null = Get-Command javac -ErrorAction Stop
}

$versionOutput = (& $java --version | Out-String)
if ($versionOutput -notmatch '(?m)^(?:openjdk|java)\s+(?:version\s+)?"?(\d+)') {
    throw 'Cannot detect the active Java version. Run java -version.'
}
if ([int]$Matches[1] -lt 26) {
    throw 'This supplied pom.xml targets Java 26. Select JDK 26 or newer before running; the project target has not been downgraded.'
}
if (-not (Test-Path (Join-Path $backend 'application-local.properties')) -and -not $env:JWT_SECRET) {
    throw 'Run scripts/Setup-Local.ps1 first, or set JWT_SECRET and the database environment variables.'
}

$configPath = Join-Path $backend 'application-local.properties'
if (Test-Path $configPath) {
    if (Select-String -LiteralPath $configPath -Pattern '^\s*spring\.datasource\.(url|driver-class-name)\s*=.*(?:jdbc:mysql:|com\.mysql\.)' -Quiet) {
        throw 'Local configuration still points to MySQL. Run scripts/Setup-Local.ps1 -Reconfigure for SQL Server.'
    }
}
if ($env:DB_URL -and $env:DB_URL -notlike 'jdbc:sqlserver:*') {
    throw 'DB_URL must use jdbc:sqlserver: for this version.'
}

Push-Location $backend
try {
    & .\mvnw.cmd spring-boot:run
    $code = $LASTEXITCODE
} finally { Pop-Location }
exit $code
