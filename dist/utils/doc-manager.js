import fs from "fs/promises";
import path from "path";
import { logger } from './logger.js';
const docsPath = path.join(__dirname, "..", "docs");
export async function addHelpTopic(title, content) {
    try {
        const filePath = path.join(docsPath, `${title.toLowerCase().replace(/\s+/g, "-")}.md`);
        await fs.writeFile(filePath, `# ${title}\n\n${content}`);
        logger.info(`Help topic "${title}" added successfully.`);
    }
    catch (error) {
        logger.error(`Error adding help topic "${title}":`, error);
    }
}
export async function loadHelpTopics() {
    try {
        const files = await fs.readdir(docsPath);
        const topics = await Promise.all(files
            .filter((file) => file.endsWith(".md"))
            .map(async (file) => {
            const content = await fs.readFile(path.join(docsPath, file), "utf-8");
            const title = content.split("\n")[0].replace("# ", "");
            return { title, content: content.split("\n").slice(1).join("\n").trim() };
        }));
        return topics;
    }
    catch (error) {
        logger.error("Error loading help topics:", error);
        return [];
    }
}
