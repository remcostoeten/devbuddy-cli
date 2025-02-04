import chalk from "chalk";
/**
 * Shows detailed instructions for adding a new plugin to DevBuddy.
 */
export function showAddPluginInstructions() {
    console.log(chalk.bold.green("\nHow to Add a New Plugin to DevBuddy"));
    console.log(chalk.yellow("====================================="));
    console.log(chalk.bold.blue("\nStep 1: Create a new file"));
    console.log(chalk.gray("Create a new TypeScript file in the `src/plugins/tools` directory."));
    console.log(chalk.gray("Use kebab-case for the file name, e.g., `my-new-plugin.ts`."));
    console.log(chalk.bold.blue("\nStep 2: Implement the Plugin interface"));
    console.log(chalk.gray("Your plugin should implement the following interface:"));
    console.log(chalk.cyan(`
interface Plugin {
  name: string;
  description: string;
  action: () => Promise<void>;
}
  `));
    console.log(chalk.bold.blue("\nStep 3: Implement your plugin logic"));
    console.log(chalk.gray("Add your plugin logic inside the `action` function."));
    console.log(chalk.gray("Use inquirer for user interactions and chalk for colorized output."));
    console.log(chalk.bold.blue("\nStep 4: Export your plugin"));
    console.log(chalk.gray("Export your plugin as the default export:"));
    console.log(chalk.cyan(`
const myNewPlugin: Plugin = {
  name: 'my-new-plugin',
  description: 'Description of my new plugin',
  action: async () => {
    // Your plugin logic here
  },
};

export default myNewPlugin;
  `));
    console.log(chalk.bold.blue("\nStep 5: Restart DevBuddy"));
    console.log(chalk.gray("Restart DevBuddy to see your new plugin in the main menu."));
    console.log(chalk.bold.yellow("\nTip: For complex plugins, create a new directory under `src/plugins/tools`"));
    console.log(chalk.gray("and split the functionality into multiple files for better organization."));
}
