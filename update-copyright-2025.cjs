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

console.log(`Updating copyright to 2025 in ${htmlFiles.length} HTML files...\n`);

let updatedCount = 0;

htmlFiles.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace 2021 with 2025 in copyright
        if (content.includes('2021. Western Capital')) {
            content = content.replace(/2021\. Western Capital/g, '2025. Western Capital');
            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
            console.log(`✅ Updated: ${file}`);
        }
    } catch (error) {
        console.log(`❌ Error processing ${file}: ${error.message}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Files updated: ${updatedCount}`);


