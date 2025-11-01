const fs = require('fs');
const path = require('path');

// Read the EXACT footer from index.html
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract exact footer from index.html
const footerStartIdx = indexContent.indexOf('<footer class="position-relative">');
const footerEndIdx = indexContent.indexOf('</footer>', footerStartIdx);

if (footerStartIdx === -1 || footerEndIdx === -1) {
    console.error('Could not find footer in index.html');
    process.exit(1);
}

const exactFooter = indexContent.substring(footerStartIdx, footerEndIdx + 9);

// Function to extract footer from any file
function extractFooter(content) {
    const startIdx = content.indexOf('<footer class="position-relative">');
    if (startIdx === -1) return null;
    
    const endIdx = content.indexOf('</footer>', startIdx);
    if (endIdx === -1) return null;
    
    return content.substring(startIdx, endIdx + 9);
}

// Function to compare two footers (normalize for comparison but preserve original)
function footersMatch(footer1, footer2) {
    // Normalize whitespace for comparison
    const norm1 = footer1.replace(/\s+/g, ' ').trim();
    const norm2 = footer2.replace(/\s+/g, ' ').trim();
    return norm1 === norm2;
}

// Find all HTML files
function findAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                if (!['node_modules', '.git', 'testsprite_tests', '.vscode'].includes(file)) {
                    findAllHtmlFiles(filePath, fileList);
                }
            } else if (file.endsWith('.html') && 
                      !file.includes('FOOTER') && 
                      !file.includes('standardize') && 
                      !file.includes('fix-all') && 
                      !file.includes('update-footers') &&
                      !file.includes('replace-all') &&
                      !file.includes('verify-footers')) {
                fileList.push(filePath);
            }
        } catch (e) {
            // Skip
        }
    });
    
    return fileList;
}

// Main
const projectRoot = __dirname;
const htmlFiles = findAllHtmlFiles(projectRoot);
const rootIndexPath = path.join(projectRoot, 'index.html');
const filesToCheck = htmlFiles.filter(f => path.resolve(f) !== path.resolve(rootIndexPath));

console.log(`\nVerifying ${filesToCheck.length} HTML files against index.html footer:\n`);

const results = {
    exact: [],
    different: [],
    missing: []
};

filesToCheck.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    try {
        const content = fs.readFileSync(file, 'utf8');
        const footer = extractFooter(content);
        
        if (!footer) {
            results.missing.push(relativePath);
            console.log(`✗ MISSING: ${relativePath}`);
        } else if (footersMatch(exactFooter, footer)) {
            results.exact.push(relativePath);
            // Only show first few to avoid clutter
            if (results.exact.length <= 5) {
                console.log(`✓ EXACT: ${relativePath}`);
            }
        } else {
            results.different.push(relativePath);
            console.log(`✗ DIFFERENT: ${relativePath}`);
        }
    } catch (error) {
        results.missing.push(relativePath);
        console.log(`✗ ERROR reading ${relativePath}: ${error.message}`);
    }
});

console.log(`\n=== Verification Summary ===`);
console.log(`Total files checked: ${filesToCheck.length}`);
console.log(`✓ Exact match: ${results.exact.length}`);
console.log(`✗ Different: ${results.different.length}`);
console.log(`✗ Missing: ${results.missing.length}`);

if (results.different.length > 0) {
    console.log(`\nFiles with different footers:`);
    results.different.forEach(file => console.log(`  - ${file}`));
}

if (results.missing.length > 0) {
    console.log(`\nFiles missing footer:`);
    results.missing.forEach(file => console.log(`  - ${file}`));
}

