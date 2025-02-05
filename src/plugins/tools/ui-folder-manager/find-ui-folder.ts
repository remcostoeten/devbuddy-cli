import fs from 'fs/promises'
import path from 'path'

/**
 * Recursively searches for a UI folder in the project.
 * @returns The path to the UI folder if found, null otherwise.
 */
export async function findUIFolder(dir: string = process.cwd()): Promise<string | null> {
  const files = await fs.readdir(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      if (file.name.toLowerCase() === 'ui') {
        return path.join(dir, file.name)
      }
      const uiFolder = await findUIFolder(path.join(dir, file.name))
      if (uiFolder) {
        return uiFolder
      }
    }
  }

  return null
}
