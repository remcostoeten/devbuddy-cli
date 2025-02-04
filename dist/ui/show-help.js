import chalk from "chalk";
/**
 * Displays a colorized helper menu with information about available plugins and how to use DevBuddy.
 * @param plugins The list of available plugins.
 */
export function showHelp(plugins) {
    console.log(chalk.bold.green("\nDevBuddy Help Menu"));
    console.log(chalk.yellow("=================="));
    console.log(chalk.bold.blue("\nAvailable Plugins:"));
    plugins.forEach((plugin) => {
        console.log(chalk.cyan(`  ${plugin.name}`) + chalk.gray(`: ${plugin.description}`));
    });
    console.log(chalk.bold.blue("\nHow to use DevBuddy:"));
    console.log(chalk.gray("  1. Select a plugin from the main menu"));
    console.log(chalk.gray("  2. Follow the prompts for the selected plugin"));
    console.log(chalk.gray('  3. Use the "Exit" option to quit DevBuddy'));
    console.log(chalk.bold.blue("\nAdding new features and plugins:"));
    console.log(chalk.gray("  1. Create a new file in `src/plugins/tools`"));
    console.log(chalk.gray("  2. Implement the Plugin interface"));
    console.log(chalk.gray("  3. Export the plugin as default"));
    console.log(chalk.gray("  4. Restart DevBuddy to see your new plugin in action"));
    console.log(chalk.bold.yellow('\nFor more detailed instructions, use the "DevBuddy Manager" plugin.'));
}
