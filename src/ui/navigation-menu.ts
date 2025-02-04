import inquirer from "inquirer"
import type { Plugin } from '../types/plugin.js'
import { logger } from '../utils/logger.js'

export async function showNavigationMenu(plugins: Plugin[]): Promise<void> {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          ...plugins.map((plugin) => ({
            name: plugin.name,
            value: plugin,
          })),
          { name: "Exit", value: "exit" },
        ],
      },
    ])

    if (action === "exit") {
      logger.info("Goodbye! 👋")
      process.exit(0)
    }

    if (action instanceof Object) {
      await (action as Plugin).action()
    }
  }
}

