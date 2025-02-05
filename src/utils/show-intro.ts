import { logger } from '../../utils/logger.js'
import chalk from 'chalk'
import { simpleGit } from 'simple-git'

/**
 * Displays the introduction message for DevBuddy.
 */
export async function showIntro(): Promise<void> {
  const git = simpleGit({ baseDir: process.cwd() })
  const lastCommitDate = await git.log(['-1', '--format=%cd'])
  const { version, author } = require('../../package.json')

  logger.info(chalk.bold.blue('Welcome to DevBuddy!'))
  logger.info(chalk.gray(`Version: ${version}`))
  logger.info(chalk.gray(`Last updated: ${lastCommitDate}`))
  logger.info(chalk.gray(`Author: ${author}`))
  logger.info('')
}

export async function showGitInfo() {
  try {
    const git = simpleGit({ baseDir: process.cwd() })
    const status = await git.status()
    return {
      branch: status.current,
      isClean: status.isClean(),
      files: status.files,
    }
  } catch (error) {
    logger.error('Error getting git info:', error)
    return null
  }
}
