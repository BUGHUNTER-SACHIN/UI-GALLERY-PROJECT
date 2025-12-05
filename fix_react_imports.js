import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Check if file uses React.createElement or React.Fragment or just React.
            if (content.includes('React.') || content.includes('React(')) {
                // Check if React is imported
                if (!content.match(/import\s+React\s+from/i) && !content.match(/import\s+\*\s+as\s+React\s+from/i)) {
                    console.log(`Fixing ${filePath}`);
                    content = `import React from 'react';\n${content}`;
                    fs.writeFileSync(filePath, content);
                }
            }
        }
    }
}

walk(srcDir);
console.log('React imports fixed!');
