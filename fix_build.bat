@echo off
setlocal enabledelayedexpansion

set "file=node_modules\@capacitor\android\capacitor\build.gradle"

echo Fixing build.gradle...

REM Remove BOM and update Java version
powershell -Command "$content = [System.IO.File]::ReadAllText('%file%', [System.Text.Encoding]::UTF8); $content = $content -replace '\uFEFF', ''; $content = $content -replace 'sourceCompatibility JavaVersion\\.VERSION_21', 'sourceCompatibility JavaVersion.VERSION_17'; $content = $content -replace 'targetCompatibility JavaVersion\\.VERSION_21', 'targetCompatibility JavaVersion.VERSION_17'; [System.IO.File]::WriteAllText('%file%', $content, [System.Text.Encoding]::UTF8)"

echo Done fixing build.gradle

REM Clean and build
cd android
call .\gradlew clean
call .\gradlew build --stacktrace
