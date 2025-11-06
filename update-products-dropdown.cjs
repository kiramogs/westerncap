const fs = require('fs');
const path = require('path');

const allHtmlFiles = [
    'index.html', 'home.html', '404.html', 'aboutus/index.html', 'advisors/index.html',
    'annual-report/index.html', 'annual-return-ir/index.html', 'annual-return/index.html',
    'branch-locator/index.html', 'careers/current-openings/index.html', 'contactus/index.html',
    'corp-announcements/index.html', 'credit-rating/index.html', 'customer-education-literature/index.html',
    'downloads/other-disclosures/index.html', 'downloads/policies-practices/index.html',
    'downloads/rbi-compliance-disclosure/index.html', 'downloads/trustee-details/index.html',
    'escalation-matrix/index.html', 'financial-results/index.html', 'homepage/index.html',
    'img/index.html', 'investors/index.html', 'liquidity-risk-management-disclosure/index.html',
    'newsroom/awards-recognition/index.html', 'newsroom/media-release/index.html',
    'notices/index.html', 'other-disclosures/index.html', 'partners/index.html',
    'policies/index.html', 'promoters/index.html', 'regulatory/index.html',
    'regulatory/liquidity-risk-management-disclosure.html', 'regulatory/notices.html',
    'regulatory/other-disclosures.html', 'regulatory/policies.html', 'terms-and-condition/index.html'
];

const homeFiles = ['index.html', 'home.html', 'homepage/index.html'];

try {
    const homeHeader = fs.readFileSync(path.join(__dirname, '_includes/header.html'), 'utf8');
    const subpageHeader = fs.readFileSync(path.join(__dirname, '_includes/header-subpage.html'), 'utf8');

    let updatedCount = 0;

    allHtmlFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.log(`Skipping ${file} - file not found`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        const headerRegex = /<nav class="navbar navbar-expand-lg[\s\S]*?<\/nav>/;
        const newHeader = homeFiles.includes(file) ? homeHeader : subpageHeader;

        if (headerRegex.test(content)) {
            content = content.replace(headerRegex, newHeader);

            try {
                fs.writeFileSync(filePath, content, 'utf8');
                updatedCount++;
                console.log(`✓ Updated products dropdown in ${file}`);
            } catch (error) {
                console.log(`✗ Error updating ${file}: ${error.message}`);
            }
        }
    });

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Completed! Updated ${updatedCount} files with new Our Products dropdown.`);
    console.log(`${'='.repeat(50)}`);

} catch (error) {
    console.error(`Error reading include files: ${error.message}`);
}

