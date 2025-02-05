import { logger } from '../../utils/logger.js'
import chalk from 'chalk'

/**
 * Shows best practices for developing DevBuddy plugins.
 */
export function showBestPractices(): void {
  logger.info(chalk.bold.green('\nDevBuddy Development Best Practices'))
  logger.info(chalk.yellow('===================================='))

  logger.info(chalk.bold.blue('\n1. Modular Design'))
  logger.info(chalk.gray('- Keep each plugin in its own file or directory'))
  logger.info(chalk.gray('- Break down complex functionality into smaller, reusable functions'))

  logger.info(chalk.bold.blue('\n2. Consistent Naming'))
  logger.info(chalk.gray('- Use kebab-case for file names'))
  logger.info(
    chalk.gray('- Use PascalCase for interface names and camelCase for variables and functions'),
  )

  logger.info(chalk.bold.blue('\n3. Error Handling'))
  logger.info(chalk.gray('- Use try-catch blocks to handle errors gracefully'))
  logger.info(chalk.gray('- Provide informative error messages to the user'))

  logger.info(chalk.bold.blue('\n4. User Experience'))
  logger.info(chalk.gray('- Use inquirer for interactive prompts'))
  logger.info(chalk.gray('- Use chalk for colorized output'))
  logger.info(chalk.gray('- Provide clear instructions and feedback to the user'))

  logger.info(chalk.bold.blue('\n5. Documentation'))
  logger.info(chalk.gray('- Use JSDoc comments to document functions and interfaces'))
  logger.info(chalk.gray("- Include usage examples in your plugin's description"))

  logger.info(chalk.bold.blue('\n6. Testing'))
  logger.info(chalk.gray('- Write unit tests for your plugins using a testing framework like Jest'))
  logger.info(chalk.gray('- Test edge cases and error scenarios'))

  logger.info(chalk.bold.blue('\n7. Version Control'))
  logger.info(chalk.gray('- Use descriptive commit messages'))
  logger.info(chalk.gray('- Create feature branches for new plugins or major changes'))

  console.log(
    chalk.bold.yellow(
      '\nRemember: The goal is to create plugins that are easy to use, maintain, and extend!',
    ),
  )
}
