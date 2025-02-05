import { execa } from 'execa'
import { platform } from 'os'
import * as readline from 'readline'
import chalk from 'chalk'
import { logger } from '@/utils/logger'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function checkTursoCLI(): Promise<boolean> {
  try {
    await execa('turso', ['--version'])
    return true
  } catch {
    return false
  }
}

function getOS(): string | null {
  const os = platform().toLowerCase()
  if (os === 'darwin') return 'macos'
  if (os === 'linux') return 'linux'
  if (os === 'win32') return 'windows'
  return null
}

async function promptForOS(): Promise<string> {
  return new Promise((resolve) => {
    rl.question('Please specify your OS (macos/linux/windows): ', (answer) => {
      const os = answer.toLowerCase()
      if (['macos', 'linux', 'windows'].includes(os)) {
        resolve(os)
      } else {
        logger.info('Invalid choice. Please enter macos, linux, or windows.')
        resolve(promptForOS())
      }
    })
  })
}

async function installTurso(osType: string | null): Promise<boolean> {
  const os = osType || (await promptForOS())

  try {
    if (os === 'macos') {
      await execa('brew', ['install', 'tursodatabase/tap/turso'])
    } else if (os === 'linux' || os === 'windows') {
      await execa('curl', ['-sSfL', 'https://get.tur.so/install.sh'], {
        shell: true,
        stdio: 'inherit',
      })
    }

    logger.info(chalk.green('\n✅ Turso CLI installed successfully!'))
    logger.info('\nPlease authenticate with Turso by running:')
    logger.info(chalk.cyan('turso auth signup'))
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(chalk.red(`\n❌ Failed to install Turso CLI: ${error.message}`))
    } else {
      logger.error(chalk.red('\n❌ Failed to install Turso CLI'))
    }
    return false
  }
}

async function checkTursoAuth(): Promise<boolean> {
  try {
    await execa('turso', ['auth', 'status'])
    return true
  } catch {
    return false
  }
}

async function promptForAuth(): Promise<boolean> {
  logger.info(chalk.yellow('\n⚠️ You are not authenticated with Turso.'))
  const answer = await new Promise<string>((resolve) => {
    rl.question('Would you like to authenticate now? (Y/n): ', resolve)
  })

  if (answer.toLowerCase() !== 'y' && answer !== '') {
    return false
  }

  try {
    logger.info(chalk.cyan('\nLaunching Turso authentication...'))
    await execa('turso', ['auth', 'login'], { stdio: 'inherit' })
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(chalk.red(`\n❌ Authentication failed: ${error.message}`))
    } else {
      logger.error(chalk.red('\n❌ Authentication failed with an unknown error'))
    }
    return false
  }
}

async function main() {
  const hasTurso = await checkTursoCLI()

  if (!hasTurso) {
    logger.info(chalk.red('❌ Turso CLI is not installed but required for this script.'))
    const answer = await new Promise<string>((resolve) => {
      rl.question('Would you like to install it now? (Y/n): ', resolve)
    })

    if (answer.toLowerCase() !== 'y' && answer !== '') {
      logger.info('Exiting script. Please install Turso CLI manually to continue.')
      rl.close()
      process.exit(1)
    }

    const osType = getOS()
    if (!(await installTurso(osType))) {
      rl.close()
      process.exit(1)
    }
  }

  const isAuthenticated = await checkTursoAuth()
  if (!isAuthenticated) {
    const didAuthenticate = await promptForAuth()
    if (!didAuthenticate) {
      logger.info(chalk.red('Authentication required. Please run turso auth login manually.'))
      rl.close()
      process.exit(1)
    }
  }

  rl.close()
  // Continue with the rest of your existing turso script implementation...
}

main().catch(console.error)
