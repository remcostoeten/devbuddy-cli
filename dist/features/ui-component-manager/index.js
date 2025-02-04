import { analyzeComponents } from './analyze-components.js';
import { findDuplicates } from './find-duplicates.js';
import { showComponents } from './show-components.js';
import { selectTool } from '../../utils/clack-ui.js';
import { logger } from '../../utils/logger.js';
export const uiComponentManager = {
    name: "ui-component-manager",
    description: "Manage and analyze UI components",
    category: "UI Tools",
    async action() {
        try {
            const choices = [
                { value: "analyze", label: "Analyze UI component usage" },
                { value: "duplicates", label: "Find duplicate imports" },
                { value: "show", label: "Show available components" },
            ];
            const selected = await selectTool(choices);
            switch (selected) {
                case "analyze":
                    await analyzeComponents();
                    break;
                case "duplicates":
                    await findDuplicates();
                    break;
                case "show":
                    await showComponents();
                    break;
                default:
                    logger.info("Operation cancelled");
            }
        }
        catch (error) {
            logger.error("Error in UI component manager:", error);
        }
    },
};
export default uiComponentManager;
