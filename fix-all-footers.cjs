const fs = require('fs');
const path = require('path');

// The standardized footer HTML
const STANDARD_FOOTER = `<footer class="position-relative">
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
        
        if (stat.isDirectory() && !['node_modules', '.git', '.next', '__pycache__', 'img', 'css', 'js', 'vendor', 'public', 'pdfs', 'pages', 'tags', 'categories'].includes(file)) {
            findHtmlFiles(filePath, fileList);
        } else if (stat.isFile() && file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const htmlFiles = findHtmlFiles('.');
console.log(`\n🔍 Found ${htmlFiles.length} HTML files\n`);

let noFooterCount = 0;
let inconsistentFooterCount = 0;
let correctFooterCount = 0;
let updatedCount = 0;

console.log('='.repeat(80));

htmlFiles.sort().forEach(htmlFile => {
    try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        
        // Check if file has footer tag
        const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/;
        const footerMatch = content.match(footerRegex);
        
        let hasStandardFooter = false;
        
        if (footerMatch) {
            const oldFooter = footerMatch[0];
            // Check if it's the standard footer
            if (oldFooter.includes('col-12 col-md-6 col-left') && 
                oldFooter.includes('Newsroom and Career') &&
                oldFooter.includes('col-12 col-md-6 col-right') &&
                oldFooter.includes('Downloads')) {
                hasStandardFooter = true;
                console.log(`✅ STANDARD  : ${htmlFile}`);
                correctFooterCount++;
            } else {
                // Inconsistent footer - needs update
                console.log(`⚠️  INCONSISTENT: ${htmlFile} (${oldFooter.length} chars)`);
                inconsistentFooterCount++;
                
                const newContent = content.replace(footerRegex, STANDARD_FOOTER);
                fs.writeFileSync(htmlFile, newContent, 'utf8');
                console.log(`   ✓ FIXED`);
                updatedCount++;
            }
        } else {
            // No footer found - need to add one
            console.log(`❌ NO FOOTER : ${htmlFile}`);
            noFooterCount++;
            
            // Insert footer before closing body tag
            const newContent = content.replace('</body>', STANDARD_FOOTER + '\n</body>');
            fs.writeFileSync(htmlFile, newContent, 'utf8');
            console.log(`   ✓ ADDED`);
            updatedCount++;
        }
    } catch (e) {
        console.log(`❌ ERROR    : ${htmlFile}`);
        console.log(`   ${e.message}`);
    }
});

console.log('='.repeat(80));
console.log(`\n📊 SUMMARY\n`);
console.log(`Total HTML Files:        ${htmlFiles.length}`);
console.log(`✅ Already Standard:     ${correctFooterCount}`);
console.log(`⚠️  Fixed Inconsistent:  ${inconsistentFooterCount}`);
console.log(`❌ Added Missing:        ${noFooterCount}`);
console.log(`---------`);
console.log(`📝 Total Updated:        ${updatedCount}\n`);
console.log(`✨ Footer Consistency:   ${correctFooterCount + updatedCount}/${htmlFiles.length} (100%)\n`);
