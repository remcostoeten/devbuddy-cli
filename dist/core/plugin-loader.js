import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const featuresDir = path.join(__dirname, "..", "features");
export async function loadPlugins() {
    const plugins = [];
    try {
        const features = await fs.readdir(featuresDir);
        for (const feature of features) {
            const featurePath = path.join(featuresDir, feature);
            const stat = await fs.stat(featurePath);
            if (stat.isDirectory()) {
                const indexPath = path.join(featurePath, "index.js");
                try {
                    const { default: plugin } = await import(indexPath);
                    if (isValidPlugin(plugin)) {
                        plugins.push(plugin);
                    }
                    else {
                        logger.warn(`Invalid plugin found in ${indexPath}`);
                    }
                }
                catch (error) {
                    logger.error(`Error loading plugin from ${indexPath}:`, error);
                }
            }
        }
    }
    catch (error) {
        logger.error("Error loading plugins:", error);
    }
    return plugins;
}
function isValidPlugin(plugin) {
    return (typeof plugin === "object" &&
        typeof plugin.name === "string" &&
        typeof plugin.description === "string" &&
        typeof plugin.action === "function");
}
