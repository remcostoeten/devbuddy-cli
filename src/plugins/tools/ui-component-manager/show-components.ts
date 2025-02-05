import { logger } from '../../utils/logger.js'
import { glob } from 'glob'
import chalk from 'chalk'

/**
 * Shows all available UI components in the project.
 */
export async function showComponents(): Promise<void> {
  const files = await glob('src/shared/components/ui/**/*.{ts,tsx}')

  if (files.length === 0) {
    logger.info(chalk.yellow('\nNo UI components found in the standard location.'))
    return
  }

  logger.info(chalk.blue('\nAvailable UI Components:'))
  for (const file of files) {
    const name = file
      .split('/')
      .pop()
      ?.replace(/\.(ts|tsx)$/, '')
    if (name) {
      logger.info(chalk.gray(`- ${name}`))
    }
  }
}
