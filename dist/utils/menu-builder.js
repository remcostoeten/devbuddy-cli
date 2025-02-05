import { selectTool, confirmAction } from "./clack-ui.js";
import { logger } from "./logger.js";
export class MenuBuilder {
    items;
    breadcrumbs = [];
    history = [];
    constructor(items) {
        this.items = items;
        this.history.push(items);
    }
    async showBreadcrumbs() {
        if (this.breadcrumbs.length > 0) {
            logger.info(`Location: ${this.breadcrumbs.join(" > ")}`);
        }
    }
    getNavigationChoices(items) {
        const choices = [...items];
        if (this.history.length > 1) {
            choices.push({
                value: "__back",
                label: "← Go Back",
                description: "Return to previous menu"
            });
        }
        choices.push({
            value: "__exit",
            label: "Exit",
            description: "Exit the menu"
        });
        return choices;
    }
    async run() {
        let running = true;
        while (running) {
            await this.showBreadcrumbs();
            const currentMenu = this.history[this.history.length - 1];
            const choices = this.getNavigationChoices(currentMenu);
            const selected = await selectTool(choices.map(item => ({
                value: item.value,
                label: item.label,
                hint: item.description
            })));
            switch (selected) {
                case "__back":
                    this.history.pop();
                    this.breadcrumbs.pop();
                    break;
                case "__exit":
                    running = false;
                    break;
                default: {
                    const selectedItem = currentMenu.find(item => item.value === selected);
                    if (selectedItem) {
                        if (selectedItem.subMenu) {
                            this.history.push(selectedItem.subMenu);
                            this.breadcrumbs.push(selectedItem.label);
                        }
                        else if (selectedItem.action) {
                            await selectedItem.action();
                            const shouldContinue = await confirmAction("Return to menu?");
                            if (!shouldContinue)
                                running = false;
                        }
                    }
                }
            }
        }
    }
}
