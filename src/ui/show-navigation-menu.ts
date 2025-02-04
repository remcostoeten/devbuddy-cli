import type { Plugin } from '../plugins/load-plugins.js'
import { showIntro, showOutro, selectTool, confirmAction } from '../utils/clack-ui.js'

export async function showNavigationMenu(plugins: Plugin[]): Promise<void> {
  await showIntro()

  try {
    const toolChoices = plugins.map(plugin => ({
      value: plugin.name,
      label: `${plugin.name} - ${plugin.description}`
    }));

    const selectedTool = await selectTool(toolChoices);
    const plugin = plugins.find(p => p.name === selectedTool);

    if (plugin) {
      await plugin.action();
    }
  } catch (error) {
    console.error("Error in navigation menu:", error);
  } finally {
    await showOutro();
  }
}

