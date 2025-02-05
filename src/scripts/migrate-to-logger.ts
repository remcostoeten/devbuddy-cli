import { glob } from 'glob'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '../utils/logger.js'

const CONSOLE_LOG_REGEX = /console\.(log|info|warn|error)\((.*?)\)/g

async function migrateFile(filePath: string): Promise<void> {
  let content = await fs.readFile(filePath, 'utf-8')
  const hasLogger = content.includes('import { logger }')
  let modified = false

  content = content.replace(CONSOLE_LOG_REGEX, (match, type, args) => {
    modified = true
    switch (type) {
      case 'log':
      case 'info':
        return `logger.info(${args})`
      case 'warn':
        return `logger.warning(${args})`
      case 'error':
        return `logger.error(${args})`
      default:
        return match
    }
  })

  if (modified && !hasLogger) {
    content = `import { logger } from '../../utils/logger.js';\n${content}`
  }

  if (modified) {
    await fs.writeFile(filePath, content)
    logger.success(`Updated ${filePath}`)
  }
}

async function migrateFiles(): Promise<void> {
  const files = await glob('src/**/*.{ts,tsx}')

  for (const file of files) {
    if (!file.includes('node_modules') && !file.includes('.test.')) {
      await migrateFile(file)
    }
  }
}

migrateFiles().catch((error) => {
  logger.error('Error migrating files:', error)
  process.exit(1)
})
