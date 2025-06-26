# Path to the build.gradle file
$filePath = "node_modules\@capacitor\android\capacitor\build.gradle"

# Read the file as bytes
$bytes = [System.IO.File]::ReadAllBytes($filePath)

# Skip BOM if present
$preamble = [System.Text.Encoding]::UTF8.GetPreamble()
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    # Skip BOM
    $content = [System.Text.Encoding]::UTF8.GetString($bytes, 3, $bytes.Length - 3)
} else {
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
}

# Update Java version
$content = $content -replace 'sourceCompatibility JavaVersion\.VERSION_21', 'sourceCompatibility JavaVersion.VERSION_17'
$content = $content -replace 'targetCompatibility JavaVersion\.VERSION_21', 'targetCompatibility JavaVersion.VERSION_17'

# Write back without BOM
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]($false))
