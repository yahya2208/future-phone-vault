Write-Host "جاري تحديث إصدار Java إلى 17 في جميع ملفات المشروع..." -ForegroundColor Cyan
Write-Host "==========================================="

# دالة لتحديث الملفات
function Update-JavaVersionInFile {
    param (
        [string]$filePath
    )
    
    try {
        $content = Get-Content -Path $filePath -Raw
        $originalContent = $content
        $updated = $false
        
        # تحديث sourceCompatibility
        if ($content -match 'sourceCompatibility\s*=\s*JavaVersion\.VERSION_\d+') {
            $content = $content -replace 'sourceCompatibility\s*=\s*JavaVersion\.VERSION_\d+', 'sourceCompatibility = JavaVersion.VERSION_17'
            $updated = $true
        }
        
        # تحديث targetCompatibility
        if ($content -match 'targetCompatibility\s*=\s*JavaVersion\.VERSION_\d+') {
            $content = $content -replace 'targetCompatibility\s*=\s*JavaVersion\.VERSION_\d+', 'targetCompatibility = JavaVersion.VERSION_17'
            $updated = $true
        }
        
        # تحديث jvmTarget
        if ($content -match 'jvmTarget\s*=\s*[\'\"]\d+[\'\"]') {
            $content = $content -replace 'jvmTarget\s*=\s*[\'\"]\d+[\'\"]', 'jvmTarget = "17"'
            $updated = $true
        }
        
        # إذا كان هناك تحديث، نقوم بحفظ الملف
        if ($updated) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "تم تحديث: $filePath" -ForegroundColor Green
        } else {
            Write-Host "لا يوجد تغيير مطلوب في: $filePath" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "خطأ في معالجة الملف $filePath : $_" -ForegroundColor Red
    }
}

# البحث عن جميع ملفات build.gradle وتحديثها
$gradleFiles = Get-ChildItem -Path . -Recurse -Filter "build.gradle" | Where-Object { $_.FullName -notmatch '\\node_modules\\' }
foreach ($file in $gradleFiles) {
    Update-JavaVersionInFile -filePath $file.FullName
}

# تحديث ملف gradle.properties
if (Test-Path "gradle.properties") {
    $gradleProps = Get-Content -Path "gradle.properties" -Raw
    $gradleProps = $gradleProps -replace 'org\.gradle\.jvmargs=.*', 'org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseParallelGC'
    $gradleProps = $gradleProps -replace 'org\.gradle\.java\.home=.*', '# org.gradle.java.home is now auto-detected'
    Set-Content -Path "gradle.properties" -Value $gradleProps -NoNewline
    Write-Host "تم تحديث: gradle.properties" -ForegroundColor Green
}

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "اكتمل تحديث إصدار Java إلى 17 في جميع الملفات." -ForegroundColor Green
Write-Host "الرجاء فتح Android Studio والانتقال إلى File > Sync Project with Gradle Files" -ForegroundColor Yellow

# إبقاء النافذة مفتوحة
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
