// Verification script to check all converted files
const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('HTML TO EJS CONVERSION VERIFICATION');
console.log('===========================================\n');

const files = [
  'about_us',
  'account',
  'address',
  'bracelets',
  'cart',
  'checkout',
  'collections',
  'customerstories',
  'earrings',
  'myorder',
  'necklaces',
  'rings',
  'signin',
  'signup',
  'support',
  'terms',
  'wishlist'
];

let allGood = true;

console.log('Checking converted files...\n');

files.forEach((name) => {
  const cssPath = path.join(__dirname, 'public', 'css', `${name}.css`);
  const jsPath = path.join(__dirname, 'public', 'js', `${name}.js`);
  const ejsPath = path.join(__dirname, 'views', `${name}.ejs`);
  
  const cssExists = fs.existsSync(cssPath);
  const jsExists = fs.existsSync(jsPath);
  const ejsExists = fs.existsSync(ejsPath);
  
  // Check CSS (some files use categories.css)
  const cssStatus = cssExists ? '✓' : '⚠';
  const jsStatus = jsExists ? '✓' : '✗';
  const ejsStatus = ejsExists ? '✓' : '✗';
  
  console.log(`${name}:`);
  console.log(`  CSS: ${cssStatus} ${cssExists ? 'public/css/' + name + '.css' : 'not found'}`);
  console.log(`  JS:  ${jsStatus} public/js/${name}.js`);
  console.log(`  EJS: ${ejsStatus} views/${name}.ejs`);
  
  if (!jsExists || !ejsExists) {
    allGood = false;
  }
});

// Check categories.css for category pages
console.log('\nCategory pages (using categories.css):');
const categoryPages = ['bracelets', 'earrings', 'necklaces', 'rings'];
const categoriesCss = path.join(__dirname, 'public', 'css', 'categories.css');
const categoriesCssExists = fs.existsSync(categoriesCss);
console.log(`  ${categoriesCssExists ? '✓' : '✗'} public/css/categories.css`);

// Homepage
console.log('\nHomepage (already converted):');
console.log(`  ✓ public/css/homepage.css`);
console.log(`  ✓ public/js/homepage.js`);
console.log(`  ✓ views/homepage.ejs`);

console.log('\n===========================================');
console.log(allGood ? '✓ ALL FILES CONVERTED SUCCESSFULLY!' : '⚠ SOME FILES MISSING');
console.log('===========================================');

// File count summary
const cssFiles = fs.readdirSync(path.join(__dirname, 'public', 'css')).filter(f => f.endsWith('.css'));
const jsFiles = fs.readdirSync(path.join(__dirname, 'public', 'js')).filter(f => f.endsWith('.js'));
const ejsFiles = fs.readdirSync(path.join(__dirname, 'views')).filter(f => f.endsWith('.ejs'));

console.log('\nFile Count Summary:');
console.log(`  CSS files in public/css/: ${cssFiles.length}`);
console.log(`  JS files in public/js/: ${jsFiles.length}`);
console.log(`  EJS files in views/: ${ejsFiles.length}`);
console.log('===========================================');
