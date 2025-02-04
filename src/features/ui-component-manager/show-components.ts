import { glob } from "glob"
import chalk from "chalk"
import { logger } from '../../utils/logger.js'

export async function showComponents(): Promise<void> {
  try {
    const files = await glob("src/shared/components/ui/**/*.{ts,tsx}")

    if (files.length === 0) {
      console.log(chalk.yellow("\nNo UI components found in the standard location."))
      return
    }

    console.log(chalk.blue("\nAvailable UI Components:"))
    for (const file of files) {
      const name = file
        .split("/")
        .pop()
        ?.replace(/\.(ts|tsx)$/, "")
      if (name) {
        console.log(chalk.gray(`- ${name}`))
      }
    }
  } catch (error) {
    logger.error("Error showing components:", error)
  }
}

