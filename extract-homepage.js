// Helper script to process homepage.html extraction
const fs = require('fs');
const path = require('path');

// Read homepage.html
const htmlContent = fs.readFileSync(
  path.join(__dirname, 'frontend', 'homepage.html'),
  'utf-8'
);

// Extract CSS (between <style> tags)
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1].trim() : '';

// Extract JavaScript (between <script> tags)
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch ? scriptMatch[1].trim() : '';

// Extract main content (everything between <header class="header"> and the first <footer>)
// but NOT including header and footer
const headerStart = htmlContent.indexOf('<header class="header">');
const footerStart = htmlContent.indexOf('<footer class="footer">');

// Get content after header closing tag and before footer
const headerEnd = htmlContent.indexOf('</header>', headerStart) + '</header>'.length;
const mainContent = htmlContent.substring(headerEnd, footerStart).trim();

// Write files
fs.writeFileSync(path.join(__dirname, 'public', 'css', 'homepage.css'), css, 'utf-8');
fs.writeFileSync(path.join(__dirname, 'public', 'js', 'homepage.js'), js, 'utf-8');
fs.writeFileSync(path.join(__dirname, 'views', 'homepage.ejs'), mainContent, 'utf-8');

console.log('✓ Created public/css/homepage.css');
console.log('✓ Created public/js/homepage.js');
console.log('✓ Created views/homepage.ejs');
