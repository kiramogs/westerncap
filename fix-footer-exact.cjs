const fs = require('fs');
const path = require('path');

// Read the EXACT footer from index.html
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Find the exact footer in index.html - including how it starts
const footerStartPattern = /<\/div><footer class="position-relative">/;
const footerEndPattern = /<\/footer>/;

const footerStartMatch = indexContent.match(footerStartPattern);
if (!footerStartMatch) {
    console.error('Could not find footer start pattern in index.html');
    process.exit(1);
}

const footerStartIdx = indexContent.indexOf('</div><footer class="position-relative">');
const footerEndIdx = indexContent.indexOf('</footer>', footerStartIdx);

if (footerStartIdx === -1 || footerEndIdx === -1) {
    console.error('Could not locate footer boundaries in index.html');
    process.exit(1);
}

// Get the EXACT footer including the </div> before it
// We need to get a bit before to capture the exact context
let contextStart = footerStartIdx - 10;
if (contextStart < 0) contextStart = 0;

// Extract from the </div> before footer to the end of footer
const exactFooterContext = indexContent.substring(footerStartIdx, footerEndIdx + 9);

// Now extract just the footer part (from <footer to </footer>)
const exactFooter = indexContent.substring(footerStartIdx + 6, footerEndIdx + 9); // +6 to skip "</div>"

console.log('Extracted exact footer from index.html:');
console.log('Length:', exactFooter.length);
console.log('First 100 chars:', exactFooter.substring(0, 100));
console.log('Last 100 chars:', exactFooter.substring(exactFooter.length - 100));

// Function to replace footer in a file
function replaceFooter(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Try different patterns for footer start
        const patterns = [
            /<\/div><footer class="position-relative">/,
            /<\/div>\s*<footer class="position-relative">/,
            /<\/section><footer class="position-relative">/,
            /<\/section>\s*<footer class="position-relative">/,
            /<footer class="position-relative">/
        ];
        
        let footerStartIdx = -1;
        let beforeFooter = '';
        
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                footerStartIdx = match.index;
                beforeFooter = match[0];
                break;
            }
        }
        
        if (footerStartIdx === -1) {
            // Try to find just the footer tag
            footerStartIdx = content.indexOf('<footer class="position-relative">');
            if (footerStartIdx === -1) {
                return { updated: false, reason: 'Footer not found' };
            }
            // Find what comes before it
            const beforeMatch = content.substring(Math.max(0, footerStartIdx - 20), footerStartIdx).trim();
            beforeFooter = beforeMatch.endsWith('</div>') ? '</div>' : 
                          beforeMatch.endsWith('</section>') ? '</section>' : '';
        }
        
        // Find footer end
        const footerEndIdx = content.indexOf('</footer>', footerStartIdx);
        if (footerEndIdx === -1) {
            return { updated: false, reason: 'Footer end not found' };
        }
        
        // Extract existing footer
        const existingFooter = content.substring(footerStartIdx, footerEndIdx + 9);
        
        // Determine how to attach the footer - match index.html format
        // If index.html uses </div><footer with no space, we should too
        const newFooterStart = beforeFooter.endsWith('</div>') && !beforeFooter.endsWith('</div>\n') && !beforeFooter.endsWith('</div>\r\n')
            ? '</div><footer class="position-relative">'
            : '</div>\n<footer class="position-relative">';
        
        // Replace footer - preserve what comes before it
        const beforeFooterText = content.substring(0, footerStartIdx);
        const afterFooterText = content.substring(footerEndIdx + 9);
        
        // Remove any trailing whitespace/newlines from beforeFooterText
        let cleanBefore = beforeFooterText.trimEnd();
        // Ensure it ends with </div> or </section>
        if (!cleanBefore.endsWith('</div>') && !cleanBefore.endsWith('</section>')) {
            // Find the last closing tag
            const lastDiv = cleanBefore.lastIndexOf('</div>');
            const lastSection = cleanBefore.lastIndexOf('</section>');
            const lastIdx = Math.max(lastDiv, lastSection);
            if (lastIdx !== -1) {
                cleanBefore = cleanBefore.substring(0, lastIdx + (lastIdx === lastDiv ? 5 : 9));
            }
        }
        
        // Use exact footer but adjust start to match index.html format
        const footerContent = exactFooter.substring(exactFooter.indexOf('<footer'));
        const newContent = cleanBefore + '<footer class="position-relative">' + footerContent.substring(footerContent.indexOf('>') + 1) + afterFooterText;
        
        // Normalize comparison to check if it's actually different
        const normalizedExisting = existingFooter.replace(/\s+/g, ' ').trim();
        const normalizedNew = footerContent.replace(/\s+/g, ' ').trim();
        
        if (normalizedExisting === normalizedNew) {
            return { updated: false, reason: 'Already exact match' };
        }
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        return { updated: true, reason: 'Footer replaced' };
    } catch (error) {
        return { updated: false, reason: `Error: ${error.message}` };
    }
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
                      !file.includes('replace-all')) {
                fileList.push(filePath);
            }
        } catch (e) {
            // Skip files we can't access
        }
    });
    
    return fileList;
}

// Main execution
const projectRoot = __dirname;
const htmlFiles = findAllHtmlFiles(projectRoot);

// Skip only the root index.html itself since that's our source
const rootIndexPath = path.join(projectRoot, 'index.html');
const filesToProcess = htmlFiles.filter(f => path.resolve(f) !== path.resolve(rootIndexPath));

console.log(`\nFound ${filesToProcess.length} HTML files to check (excluding index.html):\n`);

const results = {
    updated: [],
    skipped: [],
    errors: []
};

filesToProcess.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const result = replaceFooter(file);
    
    if (result.updated) {
        results.updated.push(relativePath);
        console.log(`✓ Updated: ${relativePath}`);
    } else if (result.reason === 'Already exact match') {
        results.skipped.push(relativePath);
        console.log(`- Already exact: ${relativePath}`);
    } else {
        results.errors.push({ file: relativePath, reason: result.reason });
        console.log(`✗ ${result.reason}: ${relativePath}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total files checked: ${filesToProcess.length}`);
console.log(`Files updated: ${results.updated.length}`);
console.log(`Files already exact: ${results.skipped.length}`);
console.log(`Errors: ${results.errors.length}`);

if (results.errors.length > 0) {
    console.log(`\nErrors:`);
    results.errors.forEach(err => {
        console.log(`  - ${err.file}: ${err.reason}`);
    });
}

