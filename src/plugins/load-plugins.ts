import type { Command } from "commander"
import fs from "fs"
import path from "path"

/**
 * Represents a plugin for DevBuddy.
 */
export interface Plugin {
  /** The name of the plugin */
  name: string
  /** A brief description of what the plugin does */
  description: string
  /** The category the plugin belongs to (optional) */
  category?: string
  /** The main action function for the plugin */
  action: () => Promise<void>
}

const pluginsDir = path.join(__dirname, "tools")

/**
 * Loads all plugins from the tools directory.
 * @param program The Commander program instance.
 * @returns An array of loaded plugins.
 */
export function loadPlugins(program: Command): Plugin[] {
  const plugins: Plugin[] = []

  fs.readdirSync(pluginsDir).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const plugin = require(path.join(pluginsDir, file)).default
      plugins.push(plugin)

      program.command(plugin.name).description(plugin.description).action(plugin.action)
    }
  })

  return plugins
}

