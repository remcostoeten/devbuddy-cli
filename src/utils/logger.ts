import chalk from 'chalk'
import * as p from '@clack/prompts'

interface LogOptions {
  prefix?: string;
  timestamp?: boolean;
  level?: 'info' | 'success' | 'warning' | 'error' | 'debug' | 'progress';
}

export const logger = {
  info: (message: string, options: LogOptions = {}) => {
    const prefix = options.prefix ? `[${options.prefix}] ` : ''
    const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
    p.log.info(chalk.blue(`${timestamp}${prefix}${message}`))
  },

  success: (message: string, options: LogOptions = {}) => {
    const prefix = options.prefix ? `[${options.prefix}] ` : ''
    const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
    p.log.success(chalk.green(`${timestamp}${prefix}${message}`))
  },

  warning: (message: string, options: LogOptions = {}) => {
    const prefix = options.prefix ? `[${options.prefix}] ` : ''
    const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
    p.log.warn(chalk.yellow(`${timestamp}${prefix}${message}`))
  },

  error: (message: string, error?: unknown, options: LogOptions = {}) => {
    const prefix = options.prefix ? `[${options.prefix}] ` : ''
    const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
    p.log.error(chalk.red(`${timestamp}${prefix}${message}`))
    
    if (error) {
      if (error instanceof Error) {
        p.log.error(chalk.red(`${timestamp}${prefix}Error: ${error.message}`))
        if (process.env.NODE_ENV === 'development') {
          p.log.error(chalk.gray(`${timestamp}${prefix}Stack: ${error.stack}`))
        }
      } else {
        p.log.error(chalk.red(`${timestamp}${prefix}${String(error)}`))
      }
    }
  },

  debug: (message: string, options: LogOptions = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const prefix = options.prefix ? `[${options.prefix}] ` : ''
      const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
      p.log.info(chalk.gray(`${timestamp}${prefix}[DEBUG] ${message}`))
    }
  },

  progress: {
    start: (message: string, options: LogOptions = {}) => {
      const prefix = options.prefix ? `[${options.prefix}] ` : ''
      const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
      const spinner = p.spinner()
      spinner.start(chalk.blue(`${timestamp}${prefix}${message}`))
      return spinner
    },

    update: (spinner: any, message: string, options: LogOptions = {}) => {
      const prefix = options.prefix ? `[${options.prefix}] ` : ''
      const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
      spinner.message(chalk.blue(`${timestamp}${prefix}${message}`))
    },

    stop: (spinner: any, message: string, success = true, options: LogOptions = {}) => {
      const prefix = options.prefix ? `[${options.prefix}] ` : ''
      const timestamp = options.timestamp ? `${new Date().toISOString()} ` : ''
      if (success) {
        spinner.stop(chalk.green(`${timestamp}${prefix}${message}`))
      } else {
        spinner.stop(chalk.red(`${timestamp}${prefix}${message}`))
      }
    }
  },

  // Helper for operation status
  operationStatus: (operation: string, success: boolean, error?: unknown) => {
    if (success) {
      logger.success(`✓ ${operation} completed successfully`)
    } else {
      logger.error(`✗ ${operation} failed`, error)
    }
  }
}
