import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
/**
 * Exports all files in the UI folder to the index.ts file.
 * @param uiFolder The path to the UI folder.
 * @param indexPath The path to the index.ts file.
 */
export async function exportAllFiles(uiFolder, indexPath) {
    const files = await fs.readdir(uiFolder);
    const exports = [];
    for (const file of files) {
        if (file !== "index.ts" && (file.endsWith(".ts") || file.endsWith(".tsx"))) {
            const baseName = path.basename(file, path.extname(file));
            exports.push(`export * from './${baseName}.js';`);
        }
    }
    const content = exports.join("\n") + "\n";
    await fs.writeFile(indexPath, content);
    console.log(chalk.green("All files exported in index.ts successfully."));
    console.log(chalk.gray("Exported files:"));
    exports.forEach((exp) => console.log(chalk.gray(`  ${exp}`)));
}
