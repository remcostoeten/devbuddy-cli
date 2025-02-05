import { logger } from '../../utils/logger.js'
import chalk from 'chalk'

/**
 * Shows the DevBuddy project structure.
 */
export function showProjectStructure(): void {
  logger.info(chalk.bold.green('\nDevBuddy Project Structure'))
  logger.info(chalk.yellow('==========================='))

  console.log(
    chalk.cyan(`
devbuddy/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── plugins/
│   │   ├── load-plugins.ts      # Plugin loader
│   │   └── tools/               # Directory for all plugins
│   │       ├── ui-component-manager.ts
│   │       ├── devbuddy-manager.ts
│   │       └── ...
│   ├── ui/
│   │   ├── show-main-menu.ts    # Main menu UI
│   │   └── show-help.ts         # Help menu UI
│   └── utils/
│       └── show-intro.ts        # Intro display utility
├── package.json
└── tsconfig.json
  `),
  )

  logger.info(chalk.bold.blue('\nKey Directories and Files:'))
  logger.info(chalk.gray('- src/plugins/tools/: Add your new plugins here'))
  logger.info(chalk.gray('- src/ui/: UI-related functions'))
  logger.info(chalk.gray('- src/utils/: Utility functions'))
  logger.info(chalk.gray('- src/index.ts: Main entry point, initializes the CLI'))

  logger.info(
    chalk.bold.yellow(
      '\nTip: Keep your plugin files modular and well-organized for easy maintenance.',
    ),
  )
}
