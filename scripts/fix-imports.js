#!/usr/bin/env node

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

async function fixImports() {
  try {
    const files = await glob('src/**/*.ts');
    
    for (const file of files) {
      let content = await fs.readFile(file, 'utf8');
      
      // Fix relative imports
      content = content.replace(
        /from\s+['"](\.[^'"]+)['"]/g,
        (match, importPath) => {
          if (importPath.endsWith('.js')) return match;
          if (importPath.endsWith('.css')) return match;
          if (importPath.endsWith('.json')) return match;
          return `from '${importPath}.js'`;
        }
      );
      
      await fs.writeFile(file, content, 'utf8');
      console.log(`Fixed imports in ${file}`);
    }
    
    console.log('All imports have been fixed!');
  } catch (error) {
    console.error('Error fixing imports:', error);
    process.exit(1);
  }
}

fixImports(); 