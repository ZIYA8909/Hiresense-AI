const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) walkDir(fullPath, callback);
    else callback(fullPath);
  });
}

const srcDir = path.join(__dirname, '..', 'src');

// Order matters — more specific patterns first
const replacements = [
  // ── BORDERS: all transparent/opacity variants → solid dark ──
  { from: /border-\[#1B263B\]\/\d+/g,           to: 'border-[#050B14]' },
  { from: /border-\[#0D1B2A\]\/\d+/g,           to: 'border-[#050B14]' },
  { from: /border-white\/\d+/g,                  to: 'border-[#050B14]' },
  { from: /border-gray-950/g,                    to: 'border-[#050B14]' },
  { from: /border-gray-900/g,                    to: 'border-[#050B14]' },
  { from: /border-gray-850/g,                    to: 'border-[#050B14]' },
  { from: /border-gray-800/g,                    to: 'border-[#050B14]' },
  { from: /border-gray-700/g,                    to: 'border-[#050B14]' },
  { from: /border-dashed border-\[#050B14\]/g,   to: 'border-dashed border-[#1B263B]' }, // keep dashed slightly lighter

  // ── BACKGROUNDS: dark surfaces stay dark ──
  { from: /bg-gray-950\/80/g,   to: 'bg-[#0D1B2A]' },
  { from: /bg-gray-950\/60/g,   to: 'bg-[#0D1B2A]' },
  { from: /bg-gray-950/g,       to: 'bg-[#0D1B2A]' },
  { from: /bg-gray-900/g,       to: 'bg-[#1B263B]' },
  { from: /bg-gray-850/g,       to: 'bg-[#1B263B]' },
  { from: /bg-black\/50/g,      to: 'bg-[#0D1B2A]' },
  { from: /bg-black\/30/g,      to: 'bg-[#0D1B2A]' },
  { from: /bg-black/g,          to: 'bg-[#0D1B2A]' },
  { from: /bg-white\/5/g,       to: 'bg-[#1B263B]' },
  { from: /bg-white\/10/g,      to: 'bg-[#1B263B]' },
  { from: /bg-\[#0D1B2A\]\/10/g, to: 'bg-[#0D1B2A]' },
  { from: /bg-\[#0D1B2A\]\/95/g, to: 'bg-[#0D1B2A]' },
  { from: /bg-\[#1B263B\]\/85/g, to: 'bg-[#1B263B]' },
];

walkDir(srcDir, filePath => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', path.relative(srcDir, filePath));
  }
});

console.log('\nDone. All borders solid dark, backgrounds normalized.');
