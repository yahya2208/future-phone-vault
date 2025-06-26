$filePath = "node_modules\@capacitor\android\capacitor\build.gradle"
$content = Get-Content -Path $filePath -Raw
$content = $content -replace 'sourceCompatibility JavaVersion\.VERSION_21', 'sourceCompatibility JavaVersion.VERSION_17'
$content = $content -replace 'targetCompatibility JavaVersion\.VERSION_21', 'targetCompatibility JavaVersion.VERSION_17'
Set-Content -Path $filePath -Value $content -Encoding UTF8
