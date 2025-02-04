import inquirer from "inquirer";
import { showAddPluginInstructions } from './devbuddy-manager/show-add-plugin-instructions.js';
import { showProjectStructure } from './devbuddy-manager/show-project-structure.js';
import { showBestPractices } from './devbuddy-manager/show-best-practices.js';
const devbuddyManager = {
    name: "devbuddy-manager",
    description: "Manage and extend DevBuddy",
    action: async () => {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    { name: "Show instructions for adding a new plugin", value: "add-plugin" },
                    { name: "Show DevBuddy project structure", value: "project-structure" },
                    { name: "Show DevBuddy best practices", value: "best-practices" },
                ],
            },
        ]);
        switch (action) {
            case "add-plugin":
                await showAddPluginInstructions();
                break;
            case "project-structure":
                await showProjectStructure();
                break;
            case "best-practices":
                await showBestPractices();
                break;
        }
    },
};
export default devbuddyManager;
