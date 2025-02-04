import { glob } from "glob";
import { readFile } from "fs/promises";
import chalk from "chalk";
/**
 * Analyzes the usage of UI components across the project.
 */
export async function analyzeComponents() {
    const files = await glob("src/**/*.{ts,tsx}");
    const componentUsage = new Map();
    for (const file of files) {
        const content = await readFile(file, "utf-8");
        const imports = content.match(/import\s+{([^}]+)}\s+from\s+['"]ui['"];?/g);
        if (imports) {
            imports.forEach((imp) => {
                const components = imp
                    .match(/{([^}]+)}/)?.[1]
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean);
                components?.forEach((component) => {
                    if (!componentUsage.has(component)) {
                        componentUsage.set(component, new Set());
                    }
                    componentUsage.get(component)?.add(file);
                });
            });
        }
    }
    console.log(chalk.blue("\nComponent Usage Analysis:"));
    for (const [component, files] of componentUsage.entries()) {
        console.log(chalk.yellow(`\n${component}:`));
        console.log(chalk.gray(`Used in ${files.size} files:`));
        files.forEach((file) => console.log(chalk.gray(`  - ${file}`)));
    }
}
