import chalk from 'chalk'
import * as p from '@clack/prompts'

export const logger = {
  info: (message: string) => {
    p.log.info(chalk.blue(message))
  },

  success: (message: string) => {
    p.log.success(chalk.green(message))
  },

  warning: (message: string) => {
    p.log.warn(chalk.yellow(message))
  },

  error: (message: string, error?: unknown) => {
    p.log.error(chalk.red(message))
    if (error && process.env.NODE_ENV === 'development') {
      p.log.error(chalk.red(String(error)))
    }
  },

  debug: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      p.log.info(chalk.gray(`[DEBUG] ${message}`))
    }
  },
}
