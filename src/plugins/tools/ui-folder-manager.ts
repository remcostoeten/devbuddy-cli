import inquirer from "inquirer"
import chalk from "chalk"
import type { Plugin } from "../load-plugins.js"
import { findUIFolder } from "./ui-folder-manager/find-ui-folder.js"
import { createIndexFile } from "./ui-folder-manager/create-index-file.js"
import { exportAllFiles } from "./ui-folder-manager/export-all-files.js"
import { consolidateImports } from "./ui-folder-manager/consolidate-imports.js"
import { deleteUnusedFiles } from "./ui-folder-manager/delete-unused-files.js"
import { type UIFolderManagerConfig, defaultConfig } from "./ui-folder-manager/config.js"
import path from "path"

export const uiFolderManager: Plugin = {
  name: "ui-folder-manager",
  description: "Manage UI folder structure and imports",
  category: "UI Tools",
  async action() {
    try {
      const uiFolder = await findUIFolder()
      if (!uiFolder) {
        console.error("UI folder not found")
        return
      }

      const config = { ...defaultConfig }
      const indexPath = path.join(uiFolder, "index.ts")

      await createIndexFile(uiFolder)
      await exportAllFiles(uiFolder, indexPath)
      await consolidateImports(uiFolder, false)
      await deleteUnusedFiles(uiFolder, false)

      console.log("UI folder management completed successfully")
    } catch (error) {
      console.error("Error managing UI folder:", error)
    }
  }
}

async function getConfig(): Promise<UIFolderManagerConfig> {
  const { useDryRun } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useDryRun",
      message: "Do you want to perform a dry run (no changes will be made)?",
      default: defaultConfig.dryRun,
    },
  ])

  return { ...defaultConfig, dryRun: useDryRun }
}

export default uiFolderManager

