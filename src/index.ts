#!/usr/bin/env node

import { Command } from "commander"
import updateNotifier from "update-notifier"
import { loadPlugins } from "./core/plugin-loader.js"
import { showHelperMenu } from "./ui/helper-menu.js"
import { logger } from "./utils/logger.js"
import { createRequire } from "module"
import { promptForModule } from "./utils/prompt.js"
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';

const require = createRequire(import.meta.url)
const pkg = require("../package.json")

async function showNavigationMenu(plugins: any[]) {
  // Add help option to the choices
  const moduleChoices = [
    ...plugins.map(plugin => ({
      name: plugin.name,
      value: plugin.name,
      description: plugin.description
    })),
    {
      name: 'help',
      value: 'help',
      description: 'Show interactive help menu'
    }
  ];

  const selectedModule = await promptForModule(moduleChoices);
  
  if (selectedModule === 'help') {
    console.log('\n' + boxen(
      gradient.cristal('Help Menu'),
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'yellow'
      }
    ));
    await showHelperMenu(plugins);
    // After showing help, return to main menu
    return showNavigationMenu(plugins);
  }
  
  // Find and execute the selected plugin
  const selectedPlugin = plugins.find(p => p.name === selectedModule);
  if (selectedPlugin) {
    console.log('\n' + boxen(
      gradient.morning(`Running: ${selectedPlugin.name}`),
      {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));
    await selectedPlugin.action();
  }
}

async function main() {
  try {
    updateNotifier({ pkg }).notify()

    const program = new Command()
    const plugins = await loadPlugins()

    program.version(pkg.version).description("A modern, scalable CLI toolbox for developers")

    program
      .command("interactive")
      .description("Start interactive mode")
      .action(() => showNavigationMenu(plugins))

    program
      .command("help")
      .description("Show interactive help menu")
      .action(() => showHelperMenu(plugins))

    plugins.forEach((plugin) => {
      program.command(plugin.name).description(plugin.description).action(plugin.action)
    })

    program.parse(process.argv)

    if (!process.argv.slice(2).length) {
      await showNavigationMenu(plugins)
    }
  } catch (error) {
    logger.error("An unexpected error occurred:", error)
    process.exit(1)
  }
}

main()

