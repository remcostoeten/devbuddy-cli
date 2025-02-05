import { logger } from '../../utils/logger.js'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'

/**
 * Exports all files in the UI folder to the index.ts file.
 * @param uiFolder The path to the UI folder.
 * @param indexPath The path to the index.ts file.
 */
export async function exportAllFiles(uiFolder: string, indexPath: string): Promise<void> {
  const files = await fs.readdir(uiFolder)
  const exports: string[] = []

  for (const file of files) {
    if (file !== 'index.ts' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      const baseName = path.basename(file, path.extname(file))
      exports.push(`export * from './${baseName}.js';`)
    }
  }

  const content = exports.join('\n') + '\n'
  await fs.writeFile(indexPath, content)

  logger.info(chalk.green('All files exported in index.ts successfully.'))
  logger.info(chalk.gray('Exported files:'))
  exports.forEach((exp) => logger.info(chalk.gray(`  ${exp}`)))
}
