const fs = require('fs');
const path = require('path');

// Exact footer from home page (index.html)
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

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !['node_modules', '.git', '.next', '__pycache__', 'img', 'css', 'js', 'vendor', 'public', 'pdfs', 'testsprite_tests'].includes(file)) {
            findHtmlFiles(filePath, fileList);
        } else if (stat.isFile() && file.endsWith('.html') && !file.includes('FOOTER') && file !== 'img/index.html') {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const htmlFiles = findHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files to check:\n`);

let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;
let missingFooterCount = 0;

htmlFiles.sort().forEach(htmlFile => {
    try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        
        // Find footer (flexible regex to match various formatting)
        const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/i;
        const footerMatch = content.match(footerRegex);
        
        if (footerMatch) {
            const oldFooter = footerMatch[0];
            // Normalize both footers for comparison (remove extra whitespace)
            const normalizedOld = oldFooter.replace(/\s+/g, ' ').trim();
            const normalizedNew = EXACT_FOOTER.replace(/\s+/g, ' ').trim();
            
            // Check if footer content matches (ignoring whitespace)
            if (normalizedOld !== normalizedNew) {
                // Replace the footer
                const newContent = content.replace(footerRegex, EXACT_FOOTER);
                fs.writeFileSync(htmlFile, newContent, 'utf8');
                console.log(`✓ Updated: ${htmlFile}`);
                updatedCount++;
            } else {
                // Already matches but check formatting
                if (oldFooter !== EXACT_FOOTER) {
                    // Content matches but formatting differs - update for consistency
                    const newContent = content.replace(footerRegex, EXACT_FOOTER);
                    fs.writeFileSync(htmlFile, newContent, 'utf8');
                    console.log(`✓ Formatting standardized: ${htmlFile}`);
                    updatedCount++;
                } else {
                    console.log(`- Already exact match: ${htmlFile}`);
                    skippedCount++;
                }
            }
        } else {
            // Check if file should have footer (not a redirect or minimal page)
            if (content.includes('<body>') && content.length > 500) {
                console.log(`✗ No footer found (should add): ${htmlFile}`);
                missingFooterCount++;
            } else {
                console.log(`- Skipped (minimal/redirect page): ${htmlFile}`);
                skippedCount++;
            }
        }
    } catch (e) {
        console.log(`! Error processing ${htmlFile}: ${e.message}`);
        errorCount++;
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total files checked: ${htmlFiles.length}`);
console.log(`Files updated: ${updatedCount}`);
console.log(`Files skipped (already correct): ${skippedCount}`);
console.log(`Files missing footer: ${missingFooterCount}`);
console.log(`Errors: ${errorCount}`);

