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

walkDir(srcDir, filePath => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Case-insensitive replace for the chocolate brown color code
    const regex = /#261406/gi;
    if (regex.test(content)) {
      console.log(`Updating colors in: ${filePath}`);
      let updated = content.replace(regex, '#2B2D42');
      fs.writeFileSync(filePath, updated, 'utf8');
    }
  }
});

console.log('Color replacement script finished.');
