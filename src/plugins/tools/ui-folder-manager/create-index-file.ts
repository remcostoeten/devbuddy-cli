import fs from "fs/promises"
import inquirer from "inquirer"
import chalk from "chalk"

/**
 * Creates an index.ts file in the UI folder if it doesn't exist.
 * @param indexPath The path to the index.ts file.
 * @returns True if the index file was created or already exists, false otherwise.
 */
export async function createIndexFile(indexPath: string): Promise<boolean> {
  try {
    await fs.access(indexPath)
    console.log(chalk.yellow("index.ts file already exists."))
    return true
  } catch (error) {
    const { createIndex } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createIndex",
        message: "No index.ts file found. Do you want to create one?",
        default: true,
      },
    ])

    if (createIndex) {
      await fs.writeFile(indexPath, "")
      console.log(chalk.green("index.ts file created successfully."))
      return true
    } else {
      console.log(chalk.red("Operation cancelled. No index.ts file created."))
      return false
    }
  }
}

