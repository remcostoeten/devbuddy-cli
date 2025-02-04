import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";
import { loadPlugins } from '../plugins/load-plugins.js';
import { showHelp } from './show-help.js';
/**
 * Displays the main menu and handles user interactions.
 */
export async function showMainMenu() {
    const plugins = loadPlugins(new Command());
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    ...plugins.map((plugin) => ({
                        name: plugin.name,
                        value: plugin,
                    })),
                    { name: "Help", value: "help" },
                    { name: "Exit", value: "exit" },
                ],
            },
        ]);
        if (action === "exit") {
            console.log(chalk.blue("Goodbye! 👋"));
            process.exit(0);
        }
        if (action === "help") {
            await showHelp(plugins);
            continue;
        }
        if (action instanceof Object) {
            await action.action();
        }
    }
}
