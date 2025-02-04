import fs from "fs/promises"
import path from "path"
import chalk from "chalk"
import { glob } from "glob"

interface ImportInfo {
  componentName: string
  originalImport: string
}

/**
 * Consolidates UI component imports in all TSX files.
 * @param uiFolder The path to the UI folder.
 * @param dryRun If true, only log changes without modifying files.
 */
export async function consolidateImports(uiFolder: string, dryRun: boolean): Promise<void> {
  const files = await glob("**/*.tsx", { ignore: ["node_modules/**"] })

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8")
    const imports = extractImports(content, uiFolder)

    if (imports.length > 0) {
      const newContent = replaceImports(content, imports, uiFolder)

      if (dryRun) {
        console.log(chalk.yellow(`\nDry run: Changes for ${file}`))
        console.log(chalk.gray("Original imports:"))
        imports.forEach((imp) => console.log(chalk.gray(`  ${imp.originalImport}`)))
        console.log(chalk.gray("Consolidated import:"))
        console.log(
          chalk.gray(
            `  import { ${imports.map((imp) => imp.componentName).join(", ")} } from '${getRelativePath(file, uiFolder)}';`,
          ),
        )
      } else {
        await fs.writeFile(file, newContent)
        console.log(chalk.green(`Updated imports in ${file}`))
      }
    }
  }

  if (dryRun) {
    console.log(chalk.yellow("\nDry run completed. No changes were made."))
  } else {
    console.log(chalk.green("\nImport consolidation completed successfully."))
  }
}

function extractImports(content: string, uiFolder: string): ImportInfo[] {
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g
  const imports: ImportInfo[] = []
  let match

  while ((match = importRegex.exec(content)) !== null) {
    const [, componentName, importPath] = match
    if (importPath.includes(path.basename(uiFolder))) {
      imports.push({
        componentName,
        originalImport: match[0],
      })
    }
  }

  return imports
}

function replaceImports(content: string, imports: ImportInfo[], uiFolder: string): string {
  let newContent = content

  // Remove original imports
  imports.forEach((imp) => {
    newContent = newContent.replace(imp.originalImport, "")
  })

  // Add consolidated import
  const consolidatedImport = `import { ${imports.map((imp) => imp.componentName).join(", ")} } from '${getRelativePath(content, uiFolder)}';`
  newContent = consolidatedImport + "\n" + newContent.trim()

  return newContent
}

function getRelativePath(filePath: string, uiFolder: string): string {
  const relativePath = path.relative(path.dirname(filePath), uiFolder)
  return relativePath ? `./${relativePath}` : "."
}

