import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';
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
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            if (file.endsWith('.d.ts')) {
                fs.unlinkSync(filePath);
                console.log(`Deleted ${filePath}`);
                continue;
            }
            const content = fs.readFileSync(filePath, 'utf8');
            const loader = file.endsWith('.tsx') ? 'tsx' : 'ts';
            try {
                const result = transformSync(content, { loader, target: 'esnext' });
                const newFile = filePath.replace(/\.tsx?$/, file.endsWith('.tsx') ? '.jsx' : '.js');
                fs.writeFileSync(newFile, result.code);
                fs.unlinkSync(filePath);
                console.log(`Converted ${filePath} -> ${newFile}`);
            } catch (e) {
                console.error(`Failed to convert ${filePath}:`, e);
            }
        }
    }
}

walk(srcDir);
console.log('Conversion complete!');
