import { glob } from 'glob'
import { readFile } from 'fs/promises'
import chalk from 'chalk'
import { logger } from '../../utils/logger.js'

export async function analyzeComponents(): Promise<void> {
  try {
    const files = await glob('src/**/*.{ts,tsx}')
    const componentUsage = new Map<string, Set<string>>()

    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      const imports = content.match(/import\s+{([^}]+)}\s+from\s+['"]ui['"];?/g)

      if (imports) {
        imports.forEach((imp) => {
          const components = imp
            .match(/{([^}]+)}/)?.[1]
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)

          components?.forEach((component) => {
            if (!componentUsage.has(component)) {
              componentUsage.set(component, new Set())
            }
            componentUsage.get(component)?.add(file)
          })
        })
      }
    }

    logger.info(chalk.blue('\nComponent Usage Analysis:'))
    for (const [component, files] of componentUsage.entries()) {
      logger.info(chalk.yellow(`\n${component}:`))
      logger.info(chalk.gray(`Used in ${files.size} files:`))
      files.forEach((file) => logger.info(chalk.gray(`  - ${file}`)))
    }
  } catch (error) {
    logger.error('Error analyzing components:', error)
  }
}
