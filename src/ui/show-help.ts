import { logger } from '../../utils/logger.js'
import chalk from 'chalk'
import type { Plugin } from '../plugins/load-plugins.js'

/**
 * Displays a colorized helper menu with information about available plugins and how to use DevBuddy.
 * @param plugins The list of available plugins.
 */
export function showHelp(plugins: Plugin[]): void {
  logger.info(chalk.bold.green('\nDevBuddy Help Menu'))
  logger.info(chalk.yellow('=================='))

  logger.info(chalk.bold.blue('\nAvailable Plugins:'))
  plugins.forEach((plugin) => {
    logger.info(chalk.cyan(`  ${plugin.name}`) + chalk.gray(`: ${plugin.description}`))
  })

  logger.info(chalk.bold.blue('\nHow to use DevBuddy:'))
  logger.info(chalk.gray('  1. Select a plugin from the main menu'))
  logger.info(chalk.gray('  2. Follow the prompts for the selected plugin'))
  logger.info(chalk.gray('  3. Use the "Exit" option to quit DevBuddy'))

  logger.info(chalk.bold.blue('\nAdding new features and plugins:'))
  logger.info(chalk.gray('  1. Create a new file in `src/plugins/tools`'))
  logger.info(chalk.gray('  2. Implement the Plugin interface'))
  logger.info(chalk.gray('  3. Export the plugin as default'))
  logger.info(chalk.gray('  4. Restart DevBuddy to see your new plugin in action'))

  logger.info(
    chalk.bold.yellow('\nFor more detailed instructions, use the "DevBuddy Manager" plugin.'),
  )
}
