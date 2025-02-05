import { logger } from '../../utils/logger.js'
import chalk from 'chalk'

/**
 * Shows detailed instructions for adding a new plugin to DevBuddy.
 */
export function showAddPluginInstructions(): void {
  logger.info(chalk.bold.green('\nHow to Add a New Plugin to DevBuddy'))
  logger.info(chalk.yellow('====================================='))

  logger.info(chalk.bold.blue('\nStep 1: Create a new file'))
  logger.info(chalk.gray('Create a new TypeScript file in the `src/plugins/tools` directory.'))
  logger.info(chalk.gray('Use kebab-case for the file name, e.g., `my-new-plugin.ts`.'))

  logger.info(chalk.bold.blue('\nStep 2: Implement the Plugin interface'))
  logger.info(chalk.gray('Your plugin should implement the following interface:'))
  console.log(
    chalk.cyan(`
interface Plugin {
  name: string;
  description: string;
  action: () => Promise<void>;
}
  `),
  )

  logger.info(chalk.bold.blue('\nStep 3: Implement your plugin logic'))
  logger.info(chalk.gray('Add your plugin logic inside the `action` function.'))
  logger.info(chalk.gray('Use inquirer for user interactions and chalk for colorized output.'))

  logger.info(chalk.bold.blue('\nStep 4: Export your plugin'))
  logger.info(chalk.gray('Export your plugin as the default export:'))
  console.log(
    chalk.cyan(`
const myNewPlugin: Plugin = {
  name: 'my-new-plugin',
  description: 'Description of my new plugin',
  action: async () => {
    // Your plugin logic here
  },
};

export default myNewPlugin;
  `),
  )

  logger.info(chalk.bold.blue('\nStep 5: Restart DevBuddy'))
  logger.info(chalk.gray('Restart DevBuddy to see your new plugin in the main menu.'))

  logger.info(
    chalk.bold.yellow(
      '\nTip: For complex plugins, create a new directory under `src/plugins/tools`',
    ),
  )
  logger.info(
    chalk.gray('and split the functionality into multiple files for better organization.'),
  )
}
