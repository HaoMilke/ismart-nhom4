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

Push-Location $backend
try {
    & .\mvnw.cmd spring-boot:run
    $code = $LASTEXITCODE
} finally { Pop-Location }
exit $code
