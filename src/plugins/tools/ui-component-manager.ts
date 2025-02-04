import inquirer from "inquirer"
import type { Plugin } from '../load-plugins.js'
import { analyzeComponents } from './ui-component-manager/analyze-components.js'
import { findDuplicates } from './ui-component-manager/find-duplicates.js'
import { showComponents } from './ui-component-manager/show-components.js'

const uiComponentManager: Plugin = {
  name: "ui-component-manager",
  description: "Manage and analyze UI components",
  action: async () => {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Analyze UI component usage", value: "analyze" },
          { name: "Find duplicate imports", value: "duplicates" },
          { name: "Show available components", value: "show" },
        ],
      },
    ])

    switch (action) {
      case "analyze":
        await analyzeComponents()
        break
      case "duplicates":
        await findDuplicates()
        break
      case "show":
        await showComponents()
        break
    }
  },
}

export default uiComponentManager

