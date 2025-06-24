# Must be run as Administrator
$java17Path = "C:\Program Files\Java\jdk-17"
$java17Bin = "$java17Path\bin"

Write-Host "Starting Java 17 system-wide configuration..." -ForegroundColor Cyan

# Verify Java 17 exists
if (-Not (Test-Path "$java17Bin\java.exe")) {
    Write-Host "Java 17 not found at: $java17Path" -ForegroundColor Red
    exit 1
}

# Set JAVA_HOME as system environment variable
[Environment]::SetEnvironmentVariable("JAVA_HOME", $java17Path, "Machine")
Write-Host "JAVA_HOME set to: $java17Path"

# Update system PATH to prioritize Java 17
$existingPath = [Environment]::GetEnvironmentVariable("Path", "Machine") -split ";" | `
    Where-Object { $_ -and ($_ -notlike "*jdk*") -and ($_ -notlike "*jbr*") }

$newPath = "$java17Bin;" + ($existingPath -join ";")
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
Write-Host "System PATH updated to prioritize Java 17"

# Done
Write-Host ""
Write-Host "==============================================="
Write-Host "Java 17 is now set as the default system JDK."
Write-Host "Please restart your PC or open a new terminal."
Write-Host "Then run: java -version"
Write-Host "==============================================="
