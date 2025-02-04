import { execSync } from "child_process"
import ora from "ora"
import chalk from "chalk"
import { logger } from '../../utils/logger.js'

export async function installPackages(packages: string[]): Promise<void> {
  const spinner = ora("Installing packages...").start()
  try {
    const command = `npm install ${packages.join(" ")}`
    execSync(command, { stdio: "pipe" })
    spinner.succeed(chalk.green("Packages installed successfully!"))
  } catch (error) {
    spinner.fail(chalk.red("Failed to install packages."))
    logger.error("Error installing packages:", error)
    throw error
  }
}

