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

// Dark theme: page bg = #0D1B2A, cards = #1B263B, borders visible = #415A77, text = #E0E1DD
const replacements = [
  // ── PAGE BACKGROUNDS: light → dark ──
  { from: /bg-\[#E0E1DD\]/g,          to: 'bg-[#0D1B2A]' },

  // ── CARDS & PANELS: darkest → slightly lighter so they stand out on dark bg ──
  { from: /bg-\[#0D1B2A\]/g,          to: 'bg-[#1B263B]' },

  // ── BORDERS: near-black → steel blue (visible on dark bg) ──
  { from: /border-\[#050B14\]/g,       to: 'border-[#415A77]' },

  // ── DARK TEXT (meant for light bg) → light text ──
  { from: /text-\[#0D1B2A\]/g,         to: 'text-[#E0E1DD]' },

  // ── SCROLLBAR track ──
  { from: /background: #E0E1DD;[\s\S]*?\/\* Light warm sand track \*\//g,
    to: 'background: #0D1B2A; /* Dark navy track */' },
];

walkDir(srcDir, filePath => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.css') && !filePath.endsWith('.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', path.relative(srcDir, filePath));
  }
});

console.log('\nDone — dark background theme applied globally.');
