import chalk from "chalk"

/**
 * Shows best practices for developing DevBuddy plugins.
 */
export function showBestPractices(): void {
  console.log(chalk.bold.green("\nDevBuddy Development Best Practices"))
  console.log(chalk.yellow("===================================="))

  console.log(chalk.bold.blue("\n1. Modular Design"))
  console.log(chalk.gray("- Keep each plugin in its own file or directory"))
  console.log(chalk.gray("- Break down complex functionality into smaller, reusable functions"))

  console.log(chalk.bold.blue("\n2. Consistent Naming"))
  console.log(chalk.gray("- Use kebab-case for file names"))
  console.log(chalk.gray("- Use PascalCase for interface names and camelCase for variables and functions"))

  console.log(chalk.bold.blue("\n3. Error Handling"))
  console.log(chalk.gray("- Use try-catch blocks to handle errors gracefully"))
  console.log(chalk.gray("- Provide informative error messages to the user"))

  console.log(chalk.bold.blue("\n4. User Experience"))
  console.log(chalk.gray("- Use inquirer for interactive prompts"))
  console.log(chalk.gray("- Use chalk for colorized output"))
  console.log(chalk.gray("- Provide clear instructions and feedback to the user"))

  console.log(chalk.bold.blue("\n5. Documentation"))
  console.log(chalk.gray("- Use JSDoc comments to document functions and interfaces"))
  console.log(chalk.gray("- Include usage examples in your plugin's description"))

  console.log(chalk.bold.blue("\n6. Testing"))
  console.log(chalk.gray("- Write unit tests for your plugins using a testing framework like Jest"))
  console.log(chalk.gray("- Test edge cases and error scenarios"))

  console.log(chalk.bold.blue("\n7. Version Control"))
  console.log(chalk.gray("- Use descriptive commit messages"))
  console.log(chalk.gray("- Create feature branches for new plugins or major changes"))

  console.log(
    chalk.bold.yellow("\nRemember: The goal is to create plugins that are easy to use, maintain, and extend!"),
  )
}

