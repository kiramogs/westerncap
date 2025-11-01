const fs = require('fs');
const path = require('path');

// Simple services link to replace Our Products dropdown
const servicesLink = `                <li class="nav-item">
                    <a class="nav-link " href="/#services">services</a>
                </li>`;

// Find all HTML files recursively
function findAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules' && file !== 'vendor' && file !== 'css' && file !== 'js' && file !== 'img') {
                findAllHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

const htmlFiles = findAllHtmlFiles('.').filter(f => !f.includes('about极速us') && !f.includes('temp'));

console.log(`Reverting Our Products dropdown to services link in ${htmlFiles.length} HTML files...\n`);

let updatedCount = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Pattern to match Our Products dropdown (with nested structure)
        const productsDropdownPattern = /<li class="nav-item dropdown">\s*<a[^>]*navbarDropdownProducts[^>]*>our products<\/a>\s*<ul[^>]*navbarDropdownProducts[^>]*>[\s\S]*?<\/ul>\s*<\/li>/gi;
        
        if (productsDropdownPattern.test(content)) {
            content = content.replace(productsDropdownPattern, servicesLink);
            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
            console.log(`✅ Reverted to services: ${file}`);
        } else if (content.includes('navbarDropdownProducts')) {
            // Try more flexible pattern
            const flexPattern = /<li class="nav-item dropdown">[\s\S]*?id="navbarDropdownProducts"[\s\S]*?<\/ul>\s*<\/li>/gi;
            if (flexPattern.test(content)) {
                content = content.replace(flexPattern, servicesLink);
                fs.writeFileSync(file, content, 'utf8');
                updatedCount++;
                console.log(`✅ Reverted to services (flexible): ${file}`);
            }
        } else {
            console.log(`ℹ️  No Our Products dropdown found: ${file}`);
        }
    } catch (error) {
        console.log(`❌ Error processing ${file}: ${error.message}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Files updated: ${updatedCount}`);

