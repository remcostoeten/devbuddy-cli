#!/usr/bin/env node
import { prompt } from "enquirer";
async function generateMenu() {
    const menu = [];
    let adding = true;
    while (adding) {
        const item = await prompt([
            {
                type: "input",
                name: "label",
                message: "Menu item label:"
            },
            {
                type: "input",
                name: "value",
                message: "Menu item value:",
                initial: (prev) => prev.label.toLowerCase().replace(/\s+/g, "_")
            },
            {
                type: "input",
                name: "description",
                message: "Description (optional):"
            },
            {
                type: "confirm",
                name: "hasSubMenu",
                message: "Add submenu items?"
            },
            {
                type: "confirm",
                name: "addAnother",
                message: "Add another item at this level?"
            }
        ]);
        // Generate menu structure...
    }
    // Write to file...
}
