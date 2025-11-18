// Script to convert all HTML files in frontend/ to EJS format
const fs = require('fs');
const path = require('path');

// Files to process (excluding homepage.html which is already done)
const filesToProcess = [
  'about_us.html',
  'account.html',
  'address.html',
  'bracelets.html',
  'cart.html',
  'checkout.html',
  'collections.html',
  'customerstories.html',
  'earrings.html',
  'myorder.html',
  'necklaces.html',
  'rings.html',
  'signin.html',
  'signup.html',
  'support.html',
  'terms.html',
  'wishlist.html'
];

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(__dirname, 'public', 'css'));
ensureDir(path.join(__dirname, 'public', 'js'));
ensureDir(path.join(__dirname, 'views'));

let successCount = 0;
let errorCount = 0;

console.log('Starting conversion of HTML files to EJS...\n');

filesToProcess.forEach((filename) => {
  try {
    const htmlPath = path.join(__dirname, 'frontend', filename);
    const baseName = filename.replace('.html', '');
    
    // Check if file exists
    if (!fs.existsSync(htmlPath)) {
      console.log(`⚠ Skipping ${filename} - file not found`);
      return;
    }
    
    console.log(`Processing ${filename}...`);
    
    // Read HTML content
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // 1. Extract and handle CSS
    let cssContent = '';
    
    // Check for external CSS link
    const linkMatch = htmlContent.match(/<link[^>]*href=["']([^"']*\.css)["'][^>]*>/);
    if (linkMatch) {
      const cssFilename = linkMatch[1];
      const cssPath = path.join(__dirname, 'frontend', cssFilename);
      
      if (fs.existsSync(cssPath)) {
        // Move CSS file from frontend/ to public/css/
        const targetCssPath = path.join(__dirname, 'public', 'css', cssFilename);
        fs.copyFileSync(cssPath, targetCssPath);
        console.log(`  ✓ Moved ${cssFilename} to public/css/`);
      }
    } else {
      // Check for inline <style> tags
      const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
      if (styleMatch) {
        cssContent = styleMatch[1].trim();
        // Save extracted CSS to public/css/
        fs.writeFileSync(
          path.join(__dirname, 'public', 'css', `${baseName}.css`),
          cssContent,
          'utf-8'
        );
        console.log(`  ✓ Extracted inline CSS to public/css/${baseName}.css`);
      }
    }
    
    // 2. Extract JavaScript (excluding CDN scripts)
    let jsContent = '';
    
    // Match all script tags
    const scriptRegex = /<script(?![^>]*src=["']https?:\/\/)[^>]*>([\s\S]*?)<\/script>/g;
    let scriptMatch;
    const jsBlocks = [];
    
    while ((scriptMatch = scriptRegex.exec(htmlContent)) !== null) {
      if (scriptMatch[1].trim()) {
        jsBlocks.push(scriptMatch[1].trim());
      }
    }
    
    jsContent = jsBlocks.join('\n\n');
    
    // Save JavaScript (even if empty)
    fs.writeFileSync(
      path.join(__dirname, 'public', 'js', `${baseName}.js`),
      jsContent,
      'utf-8'
    );
    console.log(`  ✓ Created public/js/${baseName}.js${jsContent ? '' : ' (empty)'}`);
    
    // 3. Extract main content (between </header> and <footer>)
    let mainContent = '';
    
    // Find the end of header tag
    const headerEndMatch = htmlContent.match(/<\/header>/);
    const footerStartMatch = htmlContent.match(/<footer/);
    
    if (headerEndMatch && footerStartMatch) {
      const headerEndIndex = htmlContent.indexOf('</header>') + '</header>'.length;
      const footerStartIndex = htmlContent.indexOf('<footer');
      mainContent = htmlContent.substring(headerEndIndex, footerStartIndex).trim();
    } else {
      // If no header/footer found, try to extract body content excluding head
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/);
      if (bodyMatch) {
        mainContent = bodyMatch[1].trim();
      } else {
        mainContent = htmlContent;
      }
    }
    
    // Save EJS file
    fs.writeFileSync(
      path.join(__dirname, 'views', `${baseName}.ejs`),
      mainContent,
      'utf-8'
    );
    console.log(`  ✓ Created views/${baseName}.ejs`);
    
    console.log(`✓ Successfully processed ${filename}\n`);
    successCount++;
    
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
    errorCount++;
  }
});

console.log('\n===========================================');
console.log(`Conversion complete!`);
console.log(`Successfully processed: ${successCount} files`);
console.log(`Errors: ${errorCount} files`);
console.log('===========================================');
