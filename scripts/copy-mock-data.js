import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  
  const entries = readdirSync(src);
  
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyDir('mock-data', 'dist/mock-data');
console.log('Mock data copied to dist/mock-data'); 