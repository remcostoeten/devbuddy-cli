import { glob } from "glob"
import { readFile } from "fs/promises"
import chalk from "chalk"

/**
 * Finds duplicate UI component imports in the project.
 */
export async function findDuplicates(): Promise<void> {
  const files = await glob("src/**/*.{ts,tsx}")
  const duplicates: { file: string; components: string[] }[] = []

  for (const file of files) {
    const content = await readFile(file, "utf-8")
    const imports = content.match(/import\s+{([^}]+)}\s+from\s+['"]ui['"];?/g)

    if (imports && imports.length > 1) {
      const components = imports
        .map((imp) => imp.match(/{([^}]+)}/)?.[1])
        .filter(Boolean)
        .flatMap((comp) => comp?.split(",").map((c) => c.trim()))
        .filter(Boolean) as string[]

      duplicates.push({ file, components })
    }
  }

  if (duplicates.length === 0) {
    console.log(chalk.green("\nNo duplicate UI imports found! 🎉"))
    return
  }

  console.log(chalk.yellow("\nFiles with duplicate UI imports:"))
  duplicates.forEach(({ file, components }) => {
    console.log(chalk.blue(`\n${file}:`))
    console.log(chalk.gray(`Components: ${components.join(", ")}`))
  })
}

