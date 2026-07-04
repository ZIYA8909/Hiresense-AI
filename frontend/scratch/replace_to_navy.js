const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(__dirname, '..', 'src');

// Color mapping (Old -> New)
const colorMap = [
  { oldColor: '#EAD7C3', newColor: '#E0E1DD' }, // Background: Sand -> Platinum Cool Gray
  { oldColor: '#2B2D42', newColor: '#0D1B2A' }, // Dark Surface: Deep Slate -> Deepest Navy
  { oldColor: '#6D597A', newColor: '#1B263B' }, // Borders: Dusty Purple -> Dark Navy
  { oldColor: '#B56576', newColor: '#415A77' }, // Candidate primary: Muted Rose -> Steel Blue
  { oldColor: '#C9A227', newColor: '#B3AF8F' }  // Recruiter primary: Muted Gold -> Muted Sage Green
];

walkDir(srcDir, filePath => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;

    colorMap.forEach(mapping => {
      const regex = new RegExp(mapping.oldColor, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, mapping.newColor);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      console.log(`Updating colors in: ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});

console.log('Navy theme replacement script finished.');
