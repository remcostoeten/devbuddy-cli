import { logger } from '../../utils/logger.js'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import chalk from 'chalk'
import type { Plugin } from '../types/plugin.js'

inquirer.registerPrompt('search-list', inquirerSearchList)

interface HelpTopic {
  title: string
  content: string
}

const helpTopics: HelpTopic[] = [
  {
    title: 'Getting Started',
    content:
      'To get started with DevBuddy, run `devbuddy` in your terminal and choose a tool from the menu.',
  },
  {
    title: 'Adding Plugins',
    content:
      'To add a new plugin, create a new file in the `src/plugins` directory and implement the Plugin interface.',
  },
  // Add more help topics here
]

export async function showHelperMenu(plugins: Plugin[]): Promise<void> {
  let running = true
  while (running) {
    const { action } = await inquirer.prompt([
      {
        type: 'search-list',
        name: 'action',
        message: 'What would you like help with?',
        choices: [
          ...helpTopics.map((topic) => ({ name: topic.title, value: topic })),
          ...plugins.map((plugin) => ({ name: `Plugin: ${plugin.name}`, value: plugin })),
          new inquirer.Separator(),
          { name: 'Exit Helper', value: 'exit' },
        ],
      },
    ])

    if (action === 'exit') {
      running = false
    }

    if (action instanceof Object && 'content' in action) {
      logger.info(chalk.cyan('\n' + action.title))
      logger.info(chalk.white(action.content))
    } else if (action instanceof Object && 'name' in action) {
      logger.info(chalk.cyan(`\nPlugin: ${action.name}`))
      logger.info(chalk.white(action.description))
    }

    logger.info() // Empty line for readability
    await inquirer.prompt([
      { type: 'input', name: 'continue', message: 'Press enter to continue...' },
    ])
  }
}
