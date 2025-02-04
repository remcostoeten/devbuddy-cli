import chalk from "chalk"

/**
 * Shows the DevBuddy project structure.
 */
export function showProjectStructure(): void {
  console.log(chalk.bold.green("\nDevBuddy Project Structure"))
  console.log(chalk.yellow("==========================="))

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

  console.log(chalk.bold.blue("\nKey Directories and Files:"))
  console.log(chalk.gray("- src/plugins/tools/: Add your new plugins here"))
  console.log(chalk.gray("- src/ui/: UI-related functions"))
  console.log(chalk.gray("- src/utils/: Utility functions"))
  console.log(chalk.gray("- src/index.ts: Main entry point, initializes the CLI"))

  console.log(chalk.bold.yellow("\nTip: Keep your plugin files modular and well-organized for easy maintenance."))
}

