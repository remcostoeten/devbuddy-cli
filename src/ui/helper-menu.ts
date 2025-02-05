import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import chalk from 'chalk'
import type { Plugin } from '../types/plugin.js'
import { logger } from '@/utils/logger.js'

inquirer.registerPrompt('search-list', inquirerSearchList)

interface HelpTopic {
  title: string
  content: string
}

// Helper function to format code blocks
function formatCodeBlock(code: string): string {
  return chalk.bgBlackBright(chalk.white(code))
}

// Helper function to format section headers
function formatHeader(text: string): string {
  return chalk.bold(chalk.blueBright(`\n${text}\n${'-'.repeat(text.length)}`))
}

// Helper function to format command examples
function formatCommand(command: string, description: string): string {
  return `${chalk.greenBright(command.padEnd(30))} ${chalk.gray(description)}`
}

const helpTopics: HelpTopic[] = [
  {
    title: 'Getting Started',
    content: `
${formatHeader('DevBuddy CLI Quick Start')}

${chalk.cyan('To get started:')}
${formatCommand('devbuddy', 'Launch interactive menu')}
${formatCommand('devbuddy --help', 'Show this help menu')}
${formatCommand('devbuddy <command>', 'Run specific command')}
`,
  },
  {
    title: 'Adding Plugins',
    content: `
${formatHeader('Plugin Development')}

${chalk.cyan('Create a new plugin in')} ${chalk.yellow('src/plugins')} ${chalk.cyan('directory:')}

${formatCodeBlock(`
export const yourPlugin: Plugin = {
  name: 'your-plugin',
  description: 'What your plugin does',
  category: 'Your Category',
  
  async action() {
    // Your plugin logic here
  }
};`)}

${chalk.cyan('Key components:')}
${chalk.white('•')} ${chalk.greenBright('name:')}        ${chalk.gray('Unique identifier for your plugin')}
${chalk.white('•')} ${chalk.greenBright('description:')} ${chalk.gray('What your plugin does')}
${chalk.white('•')} ${chalk.greenBright('category:')}    ${chalk.gray('Group for organization (optional)')}
${chalk.white('•')} ${chalk.greenBright('action:')}      ${chalk.gray('Main function that runs when plugin is executed')}

${chalk.cyan('Example plugin:')}
${formatCodeBlock(`
import { Plugin } from '../types/plugin';
import { logger } from '../utils/logger';

export const examplePlugin: Plugin = {
  name: 'example',
  description: 'An example plugin',
  category: 'Examples',
  
  async action() {
    logger.info('Hello from example plugin!');
    // Add your plugin logic here
  }
};`)}

${chalk.yellow('💡 Tips:')}
${chalk.white('•')} Keep plugins focused on a single responsibility
${chalk.white('•')} Use utility functions from ${chalk.greenBright('src/utils')}
${chalk.white('•')} Add proper error handling
${chalk.white('•')} Include helpful logging`,
  },
  {
    title: 'Turso Database Manager',
    content: `${chalk.bold(chalk.blueBright('Turso Database Manager'))}
${chalk.gray('A powerful tool for managing your Turso databases.')}

${chalk.yellow('🎯 Quick Start:')}
${chalk.cyan('Run')} ${formatCodeBlock('devbuddy')} ${chalk.cyan('and select "Turso DB Manager" or use direct commands:')}

${formatCommand('devbuddy db create', 'Create a new database')}
${formatCommand('devbuddy db list', 'List all databases')}
${formatCommand('devbuddy db show [name]', 'Show database details')}
${formatCommand('devbuddy db delete [name]', 'Delete database')}
${formatCommand('devbuddy db --help', 'Show help menu')}

${chalk.yellow('🚀 Features:')}

${chalk.cyan('1. Database Operations')}
   ${chalk.white('✦')} Create new databases with automatic setup
   ${chalk.white('✦')} List and manage existing databases
   ${chalk.white('✦')} Delete databases safely
   ${chalk.white('✦')} Set default database for quick access
   ${chalk.white('✦')} View detailed database information

${chalk.cyan('2. Credential Management')}
   ${chalk.white('✦')} Auto-generate database URLs and tokens
   ${chalk.white('✦')} Secure credential storage
   ${chalk.white('✦')} Automatic clipboard copy
   ${chalk.white('✦')} .env file integration

${chalk.cyan('3. Environment Setup')}
   ${chalk.white('✦')} Automatic .env file updates
   ${chalk.white('✦')} Credential backup before changes
   ${chalk.white('✦')} Custom variable name support

${chalk.magenta('Variables managed:')}
   ${chalk.greenBright('DB_URL')}:        ${chalk.gray('Database connection URL')}
   ${chalk.greenBright('AUTH_TOKEN')}:    ${chalk.gray('Authentication token')}
   ${chalk.greenBright('TURSO_DB_NAME')}: ${chalk.gray('Database name')}

${chalk.cyan('4. Configuration')}
   ${chalk.white('✦')} Settings in ${chalk.yellow('~/.turso-db-config.json')}
   ${chalk.white('✦')} Default database preferences
   ${chalk.white('✦')} Database configuration history
   ${chalk.white('✦')} Automatic CLI installation
   ${chalk.white('✦')} Authentication management

${chalk.yellow('💡 Navigation Tips:')}
${chalk.white('•')} Use ${chalk.greenBright('↑/↓')} arrows to navigate
${chalk.white('•')} Type to search commands
${chalk.white('•')} Press ${chalk.greenBright('Enter')} to select
${chalk.white('•')} Press ${chalk.greenBright('Esc')} to go back
${chalk.white('•')} Use ${chalk.greenBright('Tab')} for command completion

${chalk.yellow('🔧 Common Workflows:')}

${chalk.cyan('1. New Project Setup:')}
${formatCodeBlock(`
devbuddy db create
# Follow prompts for database name
# Credentials auto-copied & added to .env`)}

${chalk.cyan('2. Managing Multiple Databases:')}
${formatCodeBlock(`
devbuddy db list    # View all
devbuddy db create  # Add new
devbuddy db delete  # Remove unused`)}

${chalk.cyan('3. Environment Setup:')}
   ${chalk.white('✦')} Create database
   ${chalk.white('✦')} Auto-update .env
   ${chalk.white('✦')} Backup old credentials

${chalk.blue('📚 Documentation:')} ${chalk.underline('https://docs.turso.tech')}
${chalk.blue('🐛 Issues/Help:')} ${chalk.underline('https://github.com/remcostoeten/devbuddy-cli/issues')}`,
  },
]

export async function showHelperMenu(plugins: Plugin[]): Promise<void> {
  let running = true
  while (running) {
    const { action } = await inquirer.prompt([
      {
        type: 'search-list',
        name: 'action',
        message: chalk.cyan('What would you like help with?'),
        choices: [
          new inquirer.Separator(chalk.yellow('─'.repeat(50))),
          ...helpTopics.map((topic) => ({
            name: chalk.greenBright(topic.title),
            value: topic
          })),
          new inquirer.Separator(chalk.yellow('─'.repeat(20) + ' Plugins ' + '─'.repeat(20))),
          ...plugins.map((plugin) => ({
            name: chalk.blueBright(`Plugin: ${plugin.name}`),
            value: plugin
          })),
          new inquirer.Separator(chalk.yellow('─'.repeat(50))),
          {
            name: chalk.redBright('Exit Helper'),
            value: 'exit'
          },
        ],
      },
    ])

    if (action === 'exit') {
      running = false
      continue
    }

    if (action instanceof Object && 'content' in action) {
      console.clear() // Clear screen for better readability
      console.log(action.content)
    } else if (action instanceof Object && 'name' in action) {
      console.clear() // Clear screen for better readability
      console.log(chalk.cyan(`\nPlugin: ${action.name}`))
      console.log(chalk.white(action.description))
    }

    logger.info(chalk.gray('\nPress enter to continue...')) // Fixed the linter error
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: chalk.gray('Press enter to return to menu...'),
      },
    ])
    console.clear() // Clear screen when returning to menu
  }
}
