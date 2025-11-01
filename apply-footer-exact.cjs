const fs = require('fs');
const path = require('path');

// Read exact footer from index.html
const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

const footerStart = indexContent.indexOf('<footer class="position-relative">');
if (footerStart === -1) {
    console.error('Footer start not found in index.html');
    process.exit(1);
}
const footerEnd = indexContent.indexOf('</footer>', footerStart);
if (footerEnd === -1) {
    console.error('Footer end not found in index.html');
    process.exit(1);
}

const exactFooter = indexContent.substring(footerStart, footerEnd + 9);

function findHtmlFiles(dir, acc = []) {
    for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!['.git', 'node_modules', '.vscode', 'testsprite_tests'].includes(entry)) {
                findHtmlFiles(fullPath, acc);
            }
        } else if (entry.endsWith('.html') &&
                   !entry.includes('FOOTER') &&
                   !entry.includes('apply-footer') &&
                   !entry.includes('fix-footer') &&
                   !entry.includes('verify-footers') &&
                   !entry.includes('standardize-footers')) {
            acc.push(fullPath);
        }
    }
    return acc;
}

function replaceFooterInFile(filePath) {
    if (path.resolve(filePath) === path.resolve(indexPath)) {
        return { status: 'skip', reason: 'source footer' };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const startIdx = content.indexOf('<footer class="position-relative">');
    const endIdx = content.indexOf('</footer>', startIdx);

    if (startIdx === -1 || endIdx === -1) {
        return { status: 'error', reason: 'footer not found' };
    }

    const currentFooter = content.substring(startIdx, endIdx + 9);
    if (currentFooter === exactFooter) {
        return { status: 'same' };
    }

    const updatedContent = content.substring(0, startIdx) + exactFooter + content.substring(endIdx + 9);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    return { status: 'updated' };
}

const htmlFiles = findHtmlFiles(__dirname);
const results = { updated: [], same: [], error: [] };

for (const file of htmlFiles) {
    const outcome = replaceFooterInFile(file);
    const relPath = path.relative(__dirname, file);
    if (outcome.status === 'updated') {
        results.updated.push(relPath);
        console.log(`✓ Updated footer in ${relPath}`);
    } else if (outcome.status === 'same') {
        results.same.push(relPath);
    } else if (outcome.status === 'error') {
        results.error.push({ file: relPath, reason: outcome.reason });
        console.warn(`✗ ${outcome.reason}: ${relPath}`);
    }
}

console.log('\n=== Footer Replacement Summary ===');
console.log(`Files processed: ${htmlFiles.length}`);
console.log(`Updated: ${results.updated.length}`);
console.log(`Already exact: ${results.same.length}`);
console.log(`Errors: ${results.error.length}`);
if (results.error.length) {
    for (const err of results.error) {
        console.log(`  - ${err.file}: ${err.reason}`);
    }
}
