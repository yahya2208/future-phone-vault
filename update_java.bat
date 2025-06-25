@echo off
setlocal enabledelayedexpansion

echo جاري تحديث إصدار Java إلى 17 في جميع ملفات المشروع...
echo ===========================================

:: تحديث ملفات build.gradle
for /r . %%f in (build.gradle) do (
    echo معالجة ملف: %%~ff
    powershell -Command "(Get-Content '%%~ff') -replace 'sourceCompatibility\s*=\s*JavaVersion\.VERSION_\d+', 'sourceCompatibility = JavaVersion.VERSION_17' | Set-Content '%%~ff'"
    powershell -Command "(Get-Content '%%~ff') -replace 'targetCompatibility\s*=\s*JavaVersion\.VERSION_\d+', 'targetCompatibility = JavaVersion.VERSION_17' | Set-Content '%%~ff'"
    powershell -Command "(Get-Content '%%~ff') -replace 'jvmTarget\s*=\s*['\"]\d+['\"]', 'jvmTarget = \"17\"' | Set-Content '%%~ff'"
)

:: تحديث ملف gradle.properties
if exist "gradle.properties" (
    echo معالجة ملف: gradle.properties
    powershell -Command "(Get-Content 'gradle.properties') -replace 'org\.gradle\.jvmargs=.*', 'org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseParallelGC' | Set-Content 'gradle.properties'"
    powershell -Command "(Get-Content 'gradle.properties') -replace 'org\.gradle\.java\.home=.*', '# org.gradle.java.home is now auto-detected' | Set-Content 'gradle.properties'"
)

echo.
echo ===========================================
echo تم تحديث إصدار Java إلى 17 في جميع الملفات.
pause
