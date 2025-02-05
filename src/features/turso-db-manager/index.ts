import type { Plugin } from '../../types/plugin.js'
import { execSync } from 'child_process'
import { selectTool, confirmAction } from '../../utils/clack-ui.js'
import { logger } from '../../utils/logger.js'
import { errorHandler, ErrorCode } from '../../utils/error-handler.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { MenuBuilder, MenuItem } from '../../utils/menu-builder.js'
import chalk from 'chalk'
import os from 'os'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface TursoConfig {
  defaultDatabaseName: string | null
  databases: Record<string, any>
}

const CONFIG_FILE = path.join(os.homedir(), '.turso-db-config.json')
const DEFAULT_CONFIG: TursoConfig = {
  defaultDatabaseName: null,
  databases: {}
}

async function loadConfig(): Promise<TursoConfig> {
  try {
    const exists = await fs.access(CONFIG_FILE).then(() => true).catch(() => false)
    if (exists) {
      const content = await fs.readFile(CONFIG_FILE, 'utf-8')
      try {
        return JSON.parse(content)
      } catch (error) {
        logger.error('Invalid config file format', error)
        return { ...DEFAULT_CONFIG }
      }
    }
    return { ...DEFAULT_CONFIG }
  } catch (error) {
    errorHandler.handle(error, 'Loading configuration')
    return { ...DEFAULT_CONFIG }
  }
}

async function saveConfig(config: TursoConfig): Promise<void> {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
    logger.debug('Configuration saved successfully')
  } catch (error) {
    errorHandler.handle(error, 'Saving configuration')
  }
}

async function getDefaultDatabaseName(): Promise<string | null> {
  const config = await loadConfig()
  return config.defaultDatabaseName
}

async function setDefaultDatabaseName(name: string): Promise<void> {
  const config = await loadConfig()
  config.defaultDatabaseName = name
  await saveConfig(config)
}

async function checkTursoCLI(): Promise<boolean> {
  try {
    execSync('turso --version', { stdio: 'ignore' })
    logger.debug('Turso CLI check successful')
    return true
  } catch {
    logger.error('Turso CLI is not installed')
    return false
  }
}

async function installTurso(): Promise<boolean> {
  const platform = process.platform
  const spinner = logger.progress.start('Installing Turso CLI...')
  
  try {
    if (platform === 'darwin') {
      execSync('brew install tursodatabase/tap/turso')
    } else {
      execSync('curl -sSfL https://get.tur.so/install.sh | bash')
    }
    logger.progress.stop(spinner, '✅ Turso CLI installed successfully!')
    logger.info('\nPlease authenticate with Turso by running:')
    logger.info('turso auth signup')
    return true
  } catch (error) {
    logger.progress.stop(spinner, '❌ Installation failed', false)
    errorHandler.handle(error, 'Installing Turso CLI')
    return false
  }
}

async function checkTursoAuth(): Promise<boolean> {
  try {
    const output = execSync('turso auth status', { encoding: 'utf8' })
    return !output.includes('You are not logged in')
  } catch {
    return false
  }
}

async function promptForAuth(): Promise<boolean> {
  logger.info(chalk.yellow('\n⚠️  You are not authenticated with Turso.'))
  const response = await inquirer.prompt([{
    type: 'confirm',
    name: 'auth',
    message: 'Would you like to authenticate now?',
    default: true
  }])

  if (!response.auth) return false

  try {
    execSync('turso auth login', { stdio: 'inherit' })
    return true
  } catch (error) {
    logger.error(chalk.red('\n❌ Authentication failed:'), error)
    return false
  }
}

async function createDatabase(dbName: string): Promise<boolean> {
  const spinner = logger.progress.start(`Creating database: ${dbName}`)
  
  try {
    const output = execSync(`turso db create ${dbName}`, { encoding: 'utf8' })
    logger.progress.stop(spinner, `✅ Database ${dbName} created successfully`)
    logger.debug(output)
    return output.toLowerCase().includes('created')
  } catch (error) {
    logger.progress.stop(spinner, `❌ Failed to create database: ${dbName}`, false)
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        errorHandler.throw(ErrorCode.FILE_ALREADY_EXISTS, `Database ${dbName} already exists`)
      }
      if (error.message.includes('authentication')) {
        errorHandler.throw(ErrorCode.AUTH_REQUIRED, 'Authentication required. Please run turso auth login')
      }
    }
    errorHandler.handle(error, 'Creating database')
    return false
  }
}

async function getDatabaseUrl(dbName: string): Promise<string | never> {
  const spinner = logger.progress.start(`Getting URL for database: ${dbName}`)
  
  try {
    const url = execSync(`turso db show ${dbName} --url`, { encoding: 'utf8' }).trim()
    logger.progress.stop(spinner, '✅ Database URL retrieved')
    return url
  } catch (error) {
    logger.progress.stop(spinner, '❌ Failed to get database URL', false)
    return errorHandler.handle(error, 'Getting database URL')
  }
}

async function createAuthToken(dbName: string): Promise<string | never> {
  const spinner = logger.progress.start(`Creating auth token for: ${dbName}`)
  
  try {
    const token = execSync(`turso db tokens create ${dbName}`, { encoding: 'utf8' }).trim()
    logger.progress.stop(spinner, '✅ Auth token created')
    return token
  } catch (error) {
    logger.progress.stop(spinner, '❌ Failed to create auth token', false)
    return errorHandler.handle(error, 'Creating auth token')
  }
}

async function updateEnvFile(filePath: string, newVars: Record<string, string>): Promise<void> {
  const spinner = logger.progress.start(`Updating ${filePath}`)
  
  try {
    let content = ''
    try {
      content = await fs.readFile(filePath, 'utf-8')
      logger.debug(`Read existing ${filePath}`)
    } catch {
      logger.info(chalk.yellow(`Creating new .env file at ${filePath}`))
    }

    const lines = content.split('\n')
    const updated: Record<string, boolean> = {}
    const newLines: string[] = []

    // Process existing lines
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        newLines.push(line)
        continue
      }

      const [key] = trimmed.split('=')
      if (key in newVars && !updated[key]) {
        newLines.push(`# Old ${line}`)
        newLines.push(`${key}=${newVars[key]}`)
        updated[key] = true
      } else {
        newLines.push(line)
      }
    }

    // Add new variables
    for (const [key, value] of Object.entries(newVars)) {
      if (!updated[key]) {
        newLines.push(`${key}=${value}`)
      }
    }

    await fs.writeFile(filePath, newLines.join('\n') + '\n')
    logger.progress.stop(spinner, `✅ Updated ${filePath}`)
  } catch (error) {
    logger.progress.stop(spinner, `❌ Failed to update ${filePath}`, false)
    errorHandler.handle(error, 'Updating environment file')
  }
}

async function findProjectRoot(): Promise<string | null> {
  let currentDir = process.cwd()
  while (true) {
    if (
      await fs.access(path.join(currentDir, '.git')).catch(() => false) ||
      await fs.access(path.join(currentDir, 'package.json')).catch(() => false)
    ) {
      return currentDir
    }
    const parentDir = path.dirname(currentDir)
    if (parentDir === currentDir) return null
    currentDir = parentDir
  }
}

async function showDatabaseDetails(dbName: string): Promise<void> {
  try {
    const output = execSync(`turso db show ${dbName}`, { encoding: 'utf8' })
    logger.info(chalk.cyan('\nDatabase Details:'))
    logger.info(output)
  } catch (error) {
    logger.error(chalk.red('Error showing database details:'), error)
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    const clipboardy = await import('clipboardy')
    await clipboardy.default.write(text)
    logger.success('✅ Copied to clipboard!')
    return true
  } catch (error) {
    logger.warning('Could not copy to clipboard. Manual copy required:')
    logger.info(text)
    return false
  }
}

async function listDatabases(): Promise<void> {
  try {
    const output = execSync('turso db list', { encoding: 'utf8' })
    logger.info(chalk.cyan('\nAvailable Databases:'))
    logger.info(output)
  } catch (error) {
    logger.error(chalk.red('Error listing databases:'), error)
  }
}

async function deleteDatabase(dbName: string): Promise<boolean> {
  try {
    execSync(`turso db destroy ${dbName}`, { stdio: 'inherit' })
    logger.success(`\n✅ Database ${dbName} deleted successfully`)
    return true
  } catch (error) {
    logger.error(chalk.red('Error deleting database:'), error)
    return false
  }
}

export const TURSO_HELP_CONTENT = `
Turso Database Manager Help

Commands:
  create           Create a new database
    quick         Quick create with default settings
    advanced      Configure database settings
  list            List all databases
  show <name>     Show database details
  delete <name>   Delete a database
  env             Manage environment variables

Options:
  --help          Show this help message
  --name          Specify database name
  --overwrite     Update .env file with credentials

Examples:
  devbuddy db create my-db        Create a new database
  devbuddy db list               List all databases
  devbuddy db show my-db         Show database details
  devbuddy db delete my-db       Delete a database

Environment Variables:
  DB_URL          Database connection URL
  AUTH_TOKEN      Authentication token
  TURSO_DB_NAME   Database name

For more information, visit: https://docs.turso.tech
`

interface DatabaseCredentials {
  dbUrl: string;
  authToken: string;
  dbName: string;
}

function credentialsToEnvVars(credentials: DatabaseCredentials): Record<string, string> {
  return {
    DB_URL: credentials.dbUrl,
    AUTH_TOKEN: credentials.authToken,
    TURSO_DB_NAME: credentials.dbName
  };
}

async function createTursoDb(options: { name?: string } = {}): Promise<DatabaseCredentials | null> {
  try {
    const dbNameFromOptions = options.name || await getDefaultDatabaseName()
    const response = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Enter database name:',
      default: dbNameFromOptions,
      validate: (input: string) => input.trim().length > 0 || 'Database name is required'
    }])
    
    const dbName: string = response.name.trim()

    logger.info(chalk.cyan(`\nCreating database: ${dbName}`))
    const created = await createDatabase(dbName)
    if (!created) return null

    await setDefaultDatabaseName(dbName)

    const dbUrl = await getDatabaseUrl(dbName)
    const authToken = await createAuthToken(dbName)

    if (!dbUrl || !authToken) {
      logger.error(chalk.red('Failed to get database credentials'))
      return null
    }

    await showDatabaseDetails(dbName)

    const credentials: DatabaseCredentials = {
      dbUrl,
      authToken,
      dbName
    }

    const envVars = credentialsToEnvVars(credentials)
    const envString = Object.entries(envVars)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')
    
    await copyToClipboard(envString)

    return credentials
  } catch (error) {
    logger.error(chalk.red('Error creating database:'), error)
    return null
  }
}

export const tursoDbManager: Plugin = {
  name: 'turso-db-manager',
  description: 'Create and manage Turso databases',
  category: 'Database Tools',
  async action() {
    try {
      // Check for help flag
      const args = process.argv.slice(2);
      if (args.includes('--help') || args.includes('-h')) {
        logger.info(TURSO_HELP_CONTENT);
        return;
      }

      if (!(await checkTursoCLI())) return;
      if (!(await checkTursoAuth())) return;

      const menuItems: MenuItem[] = [
        {
          value: 'help',
          label: 'Help',
          description: 'Show help and usage information',
          action: async () => {
            logger.info(TURSO_HELP_CONTENT);
          },
        },
        {
          value: 'create',
          label: 'Create Database',
          description: 'Create a new Turso database',
          subMenu: [
            {
              value: 'create_simple',
              label: 'Quick Create',
              description: 'Create database with default settings',
              action: async () => {
                const credentials = await createTursoDb()
                if (credentials) {
                  logger.success('Database created successfully!')
                  logger.info(`DB_URL=${credentials.dbUrl}`)
                  logger.info(`AUTH_TOKEN=${credentials.authToken}`)
                  logger.info(`TURSO_DB_NAME=${credentials.dbName}`)

                  const updateEnv = await confirmAction(
                    'Would you like to update your .env file with these credentials?',
                  )
                  if (updateEnv) {
                    await updateEnvFile('.env', credentialsToEnvVars(credentials))
                  }
                }
              },
            },
            {
              value: 'create_advanced',
              label: 'Advanced Create',
              description: 'Configure database settings',
              subMenu: [
                // Additional creation options could go here
              ],
            },
          ],
        },
        {
          value: 'manage',
          label: 'Manage Databases',
          description: 'List, modify, or delete databases',
          subMenu: [
            {
              value: 'list',
              label: 'List Databases',
              description: 'Show all databases',
              action: listDatabases,
            },
            {
              value: 'delete',
              label: 'Delete Database',
              description: 'Remove a database',
              action: async () => {
                const output = execSync('turso db list', { encoding: 'utf8' })
                const databases = output
                  .split('\n')
                  .filter((line) => line.trim())
                  .map((line) => ({ value: line.trim(), label: line.trim() }))

                if (databases.length === 0) {
                  logger.info('No databases found')
                  return
                }

                const dbToDelete = await selectTool(databases)
                if (typeof dbToDelete === 'string') {
                  const confirmed = await confirmAction(
                    `Are you sure you want to delete database ${dbToDelete}?`,
                  )
                  if (confirmed) {
                    await deleteDatabase(dbToDelete)
                  }
                }
              },
            },
          ],
        },
        {
          value: 'env',
          label: 'Environment Setup',
          description: 'Manage environment variables',
          action: async () => {
            // ... env file management logic ...
          },
        },
      ]

      const menu = new MenuBuilder(menuItems)
      await menu.run()
    } catch (error) {
      logger.error('Error in Turso DB manager:', error)
    }
  },
}

export default tursoDbManager

