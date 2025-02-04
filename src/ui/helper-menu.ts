import inquirer from "inquirer"
import inquirerSearchList from "inquirer-search-list"
import chalk from "chalk"
import type { Plugin } from '../types/plugin.js'

inquirer.registerPrompt("search-list", inquirerSearchList)

interface HelpTopic {
  title: string
  content: string
}

const helpTopics: HelpTopic[] = [
  {
    title: "Getting Started",
    content: "To get started with DevBuddy, run `devbuddy` in your terminal and choose a tool from the menu.",
  },
  {
    title: "Adding Plugins",
    content:
      "To add a new plugin, create a new file in the `src/plugins` directory and implement the Plugin interface.",
  },
  // Add more help topics here
]

export async function showHelperMenu(plugins: Plugin[]): Promise<void> {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "search-list",
        name: "action",
        message: "What would you like help with?",
        choices: [
          ...helpTopics.map((topic) => ({ name: topic.title, value: topic })),
          ...plugins.map((plugin) => ({ name: `Plugin: ${plugin.name}`, value: plugin })),
          new inquirer.Separator(),
          { name: "Exit Helper", value: "exit" },
        ],
      },
    ])

    if (action === "exit") {
      return
    }

    if (action instanceof Object && "content" in action) {
      console.log(chalk.cyan("\n" + action.title))
      console.log(chalk.white(action.content))
    } else if (action instanceof Object && "name" in action) {
      console.log(chalk.cyan(`\nPlugin: ${action.name}`))
      console.log(chalk.white(action.description))
    }

    console.log() // Empty line for readability
    await inquirer.prompt([{ type: "input", name: "continue", message: "Press enter to continue..." }])
  }
}

