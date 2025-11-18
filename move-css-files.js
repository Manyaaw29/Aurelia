// Script to move all CSS files from frontend/ to public/css/
const fs = require('fs');
const path = require('path');

// Ensure public/css directory exists
const cssDir = path.join(__dirname, 'public', 'css');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

// CSS files to move (excluding homepage.css which was already moved)
const cssFiles = [
  'about_us.css',
  'account.css',
  'address.css',
  'cart.css',
  'checkout.css',
  'collections.css',
  'customerstories.css',
  'myorder.css',
  'signin.css',
  'signup.css',
  'support.css',
  'terms.css',
  'wishlist.css',
  'categories.css'  // For the category pages (bracelets, earrings, etc.)
];

console.log('Moving CSS files from frontend/ to public/css/...\n');

let movedCount = 0;
let skippedCount = 0;

cssFiles.forEach((filename) => {
  const sourcePath = path.join(__dirname, 'frontend', filename);
  const targetPath = path.join(__dirname, 'public', 'css', filename);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Moved ${filename} to public/css/`);
    movedCount++;
  } else {
    console.log(`⚠ Skipped ${filename} - file not found`);
    skippedCount++;
  }
});

console.log('\n===========================================');
console.log(`CSS files moved: ${movedCount}`);
console.log(`Files skipped: ${skippedCount}`);
console.log('===========================================');
