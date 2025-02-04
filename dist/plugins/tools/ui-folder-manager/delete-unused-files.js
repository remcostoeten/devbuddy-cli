import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { glob } from "glob";
import inquirer from "inquirer";
/**
 * Deletes unused files in the UI folder.
 * @param uiFolder The path to the UI folder.
 * @param dryRun If true, only log changes without deleting files.
 */
export async function deleteUnusedFiles(uiFolder, dryRun) {
    const allFiles = await glob("**/*.tsx", { ignore: ["node_modules/**"] });
    const uiFiles = await fs.readdir(uiFolder);
    const usedComponents = new Set();
    // Find all used components
    for (const file of allFiles) {
        const content = await fs.readFile(file, "utf-8");
        const imports = content.match(/import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g) || [];
        for (const importStatement of imports) {
            const components = importStatement
                .match(/{\s*([^}]+)\s*}/)?.[1]
                .split(",")
                .map((c) => c.trim());
            components?.forEach((component) => usedComponents.add(component));
        }
    }
    // Check for unused files
    const unusedFiles = [];
    for (const file of uiFiles) {
        if (file.endsWith(".tsx") && file !== "index.tsx") {
            const componentName = path.basename(file, ".tsx");
            if (!usedComponents.has(componentName)) {
                unusedFiles.push(file);
            }
        }
    }
    if (unusedFiles.length === 0) {
        console.log(chalk.green("No unused files found in the UI folder."));
        return;
    }
    console.log(chalk.yellow(`\nFound ${unusedFiles.length} unused file(s) in the UI folder:`));
    unusedFiles.forEach((file) => console.log(chalk.gray(`  - ${file}`)));
    if (dryRun) {
        console.log(chalk.yellow("\nDry run: No files were deleted."));
    }
    else {
        const { confirmDelete } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmDelete",
                message: "Do you want to delete these unused files?",
                default: false,
            },
        ]);
        if (confirmDelete) {
            for (const file of unusedFiles) {
                await fs.unlink(path.join(uiFolder, file));
                console.log(chalk.green(`Deleted: ${file}`));
            }
            console.log(chalk.green("\nUnused files have been deleted successfully."));
        }
        else {
            console.log(chalk.yellow("\nDeletion cancelled. No files were deleted."));
        }
    }
}
