const fs = require('fs');
const path = require('path');

// Exact footer template from index.html
const EXACT_FOOTER = `<footer class="position-relative">
    <div class="container">
        <div class="footer-brand">
            <a href="/"><img alt="logo" src="/img/LOGO1.png" class="footer-logo"></a>
        </div>
        <div class="vertical-line"></div>

        <div class="row">
            <!-- Newsroom and Career Section -->
            <div class="col-12 col-md-6 col-left footer-section">
                <h4 class="footer-section-title">Newsroom and Career</h4>
                <ul class="footer-links">
                    <li>
                        <a href="/newsroom/media-release">Media Release</a>
                    </li>
                    <li>
                        <a href="/careers/current-openings">Current Opening</a>
                    </li>
                    <li>
                        <a href="/newsroom/awards-recognition">Awards & Recognition</a>
                    </li>
                </ul>
            </div>

            <!-- Downloads Section -->
            <div class="col-12 col-md-6 col-right footer-section">
                <h4 class="footer-section-title">Downloads</h4>
                <ul class="footer-links">
                    <li>
                        <a href="/downloads/policies-practices">Policies & Practices</a>
                    </li>
                    <li>
                        <a href="/downloads/trustee-details">Trustee Details</a>
                    </li>
                    <li>
                        <a href="/downloads/rbi-compliance-disclosure">RBI Compliance & Disclosure</a>
                    </li>
                    <li>
                        <a href="/downloads/other-disclosures">Other Disclosures</a>
                    </li>
                </ul>
            </div>
        </div>
        <img src="/img/footer_pattern.png" class="footer-pattern" alt="">
    </div>
    <div class="copyright-footer">
        <div class="container">
            <img src="/img/copyright.png" alt="">
            <div class="d-inline-block">2021. Western Capital Advisors Private Limited</div>
        </div>
    </div>
</footer>`;

// Function to find and replace footer in a file
function replaceFooterInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Check if file has a footer
        if (!content.includes('footer class="position-relative"')) {
            return { updated: false, reason: 'No footer found' };
        }

        // Find the footer start position
        const footerStart = content.indexOf('<footer class="position-relative">');
        if (footerStart === -1) {
            return { updated: false, reason: 'Footer start not found' };
        }

        // Find the footer end position (looking for </footer>)
        const footerEnd = content.indexOf('</footer>', footerStart);
        if (footerEnd === -1) {
            return { updated: false, reason: 'Footer end not found' };
        }

        // Extract the existing footer
        const existingFooter = content.substring(footerStart, footerEnd + 9);

        // Check if it's already exact match (normalize whitespace for comparison)
        const normalizedExisting = existingFooter.replace(/\s+/g, ' ').trim();
        const normalizedExact = EXACT_FOOTER.replace(/\s+/g, ' ').trim();

        if (normalizedExisting === normalizedExact) {
            return { updated: false, reason: 'Already exact match' };
        }

        // Replace the footer
        content = content.substring(0, footerStart) + EXACT_FOOTER + content.substring(footerEnd + 9);

        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');

        return { updated: true, reason: 'Footer replaced' };
    } catch (error) {
        return { updated: false, reason: `Error: ${error.message}` };
    }
}

// Function to recursively find all HTML files
function findAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and other common directories
            if (!['node_modules', '.git', 'testsprite_tests', '.vscode'].includes(file)) {
                findAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') && !file.includes('FOOTER') && !file.includes('standardize') && !file.includes('fix-all') && !file.includes('update-footers')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Main execution
const projectRoot = process.cwd();
const htmlFiles = findAllHtmlFiles(projectRoot);

console.log(`\nFound ${htmlFiles.length} HTML files to check:\n`);

const results = {
    updated: [],
    skipped: [],
    errors: []
};

htmlFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const result = replaceFooterInFile(file);

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
console.log(`Total files checked: ${htmlFiles.length}`);
console.log(`Files updated: ${results.updated.length}`);
console.log(`Files already exact: ${results.skipped.length}`);
console.log(`Errors: ${results.errors.length}`);

if (results.errors.length > 0) {
    console.log(`\nErrors:`);
    results.errors.forEach(err => {
        console.log(`  - ${err.file}: ${err.reason}`);
    });
}

if (results.updated.length > 0) {
    console.log(`\n✓ Updated files:`);
    results.updated.forEach(file => {
        console.log(`  - ${file}`);
    });
}

