const fs = require('fs');
const path = require('path');

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

const htmlFiles = findAllHtmlFiles('.');

console.log(`Processing ${htmlFiles.length} HTML files...\n`);

let copyrightUpdated = 0;
let servicesRemoved = 0;
let productsAdded = 0;

// Our Products dropdown HTML (to replace services)
const ourProductsDropdown = `                <li class="nav-item dropdown">
                    <a aria-expanded="false" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" href="#" id="navbarDropdownProducts" role="button" disabled>our products</a>
                    <ul aria-labelledby="navbarDropdownProducts" class="dropdown-menu px-2">
                        <li class="">
                            <a class="dropdown-item" href="/#services">Institutional Lending</a>
                        </li>
                        <li class="">
                            <a class="dropdown-item" href="/#services">Retail Lending | Prabhaav Loans</a>
                        </li>
                        <li class="">
                            <a class="dropdown-item" href="/#services">Financial Institution Loans</a>
                        </li>
                        <li class="">
                            <a class="dropdown-item" href="/#services">Supply Chain Finance</a>
                        </li>
                        <li class="">
                            <a class="dropdown-item" href="/#services">Partnership Lending</a>
                        </li>
                    </ul>
                </li>`;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        
        // 1. Update copyright from 2021 to 2025
        if (content.includes('2021. Western Capital')) {
            content = content.replace(/2021\. Western Capital/g, '2025. Western Capital');
            copyrightUpdated++;
            updated = true;
        }
        
        // 2. Remove services link and add Our Products dropdown
        // Pattern 1: Simple services link
        const servicesLinkPattern = /<li class="nav-item">\s*<a class="nav-link[^"]*" href="\/#services">services<\/a>\s*<\/li>/gi;
        if (servicesLinkPattern.test(content)) {
            content = content.replace(servicesLinkPattern, ourProductsDropdown);
            servicesRemoved++;
            productsAdded++;
            updated = true;
        }
        
        // Pattern 2: Services link with whitespace variations
        const servicesLinkPattern2 = /<li class="nav-item">\s*<a[^>]*href="\/#services"[^>]*>services<\/a>\s*<\/li>/gi;
        if (servicesLinkPattern2.test(content)) {
            content = content.replace(servicesLinkPattern2, ourProductsDropdown);
            if (!updated) {
                servicesRemoved++;
                productsAdded++;
                updated = true;
            }
        }
        
        // Pattern 3: Services link without nav-item class (some variations)
        const servicesLinkPattern3 = /<li[^>]*>\s*<a[^>]*href="\/#services"[^>]*class="nav-link[^"]*"[^>]*>services<\/a>\s*<\/li>/gi;
        if (servicesLinkPattern3.test(content) && !content.includes('our products')) {
            content = content.replace(servicesLinkPattern3, ourProductsDropdown);
            if (!updated) {
                servicesRemoved++;
                productsAdded++;
                updated = true;
            }
        }
        
        if (updated) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
        }
    } catch (error) {
        console.log(`❌ Error processing ${file}: ${error.message}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Copyright updated: ${copyrightUpdated} files`);
console.log(`Services removed: ${servicesRemoved} files`);
console.log(`Our Products added: ${productsAdded} files`);


