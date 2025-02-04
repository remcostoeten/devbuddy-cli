#!/usr/bin/env node
import { Command } from "commander";
import updateNotifier from "update-notifier";
import { loadPlugins } from "./core/plugin-loader.js";
import { showNavigationMenu } from "./ui/navigation-menu.js";
import { showHelperMenu } from "./ui/helper-menu.js";
import { logger } from "./utils/logger.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../package.json");
async function main() {
    try {
        updateNotifier({ pkg }).notify();
        const program = new Command();
        const plugins = await loadPlugins();
        program.version(pkg.version).description("A modern, scalable CLI toolbox for developers");
        program
            .command("interactive")
            .description("Start interactive mode")
            .action(() => showNavigationMenu(plugins));
        program
            .command("help")
            .description("Show interactive help menu")
            .action(() => showHelperMenu(plugins));
        plugins.forEach((plugin) => {
            program.command(plugin.name).description(plugin.description).action(plugin.action);
        });
        program.parse(process.argv);
        if (!process.argv.slice(2).length) {
            await showNavigationMenu(plugins);
        }
    }
    catch (error) {
        logger.error("An unexpected error occurred:", error);
        process.exit(1);
    }
}
main();
