import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = join('node_modules', '@capacitor', 'android', 'capacitor', 'build.gradle');

// Read the file
let content = readFileSync(filePath, 'utf8');

// Remove BOM if it exists
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.substring(1);
}

// Update Java version
content = content
  .replace(/sourceCompatibility JavaVersion\.VERSION_21/g, 'sourceCompatibility JavaVersion.VERSION_17')
  .replace(/targetCompatibility JavaVersion\.VERSION_21/g, 'targetCompatibility JavaVersion.VERSION_17');

// Write back the file
writeFileSync(filePath, content, 'utf8');

console.log('Successfully updated build.gradle');
