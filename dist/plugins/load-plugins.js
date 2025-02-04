import fs from "fs";
import path from "path";
const pluginsDir = path.join(__dirname, "tools");
/**
 * Loads all plugins from the tools directory.
 * @param program The Commander program instance.
 * @returns An array of loaded plugins.
 */
export function loadPlugins(program) {
    const plugins = [];
    fs.readdirSync(pluginsDir).forEach((file) => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const plugin = require(path.join(pluginsDir, file)).default;
            plugins.push(plugin);
            program.command(plugin.name).description(plugin.description).action(plugin.action);
        }
    });
    return plugins;
}
