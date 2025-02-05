#!/usr/bin/env node
import * as p from '@clack/prompts'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '../utils/logger.js'
import { MenuBuilder, MenuItem } from '../utils/menu-builder.js'

interface MenuTemplate {
  name: string
  items: MenuItem[]
  outputPath: string
}

async function showHelp() {
  logger.info(`
Menu Generator Tool
==================

This tool helps you create menu structures for your features.

Commands:
  menu-generator create    Create a new menu structure
  menu-generator list      List existing menu templates
  menu-generator help      Show this help message

Creating Menus:
  1. Each menu can have multiple items
  2. Items can have submenus (nested)
  3. Items can have actions
  4. Navigation is automatically added
  5. Templates are saved for reuse

Example Usage:
  $ menu-generator create
  $ menu-generator create --template basic
  $ menu-generator create --output src/features/my-feature/menu.ts

Tips:
  - Use descriptive labels
  - Keep menu hierarchy shallow (max 3 levels)
  - Add descriptions for clarity
  - Consider keyboard shortcuts
  `)
}

async function generateMenuStructure(template?: string): Promise<MenuItem[]> {
  const menu: MenuItem[] = []
  let adding = true

  while (adding) {
    const label = await p.text({
      message: 'Menu item label:',
      validate: (value) => (value.length > 0 ? undefined : 'Label is required'),
    })

    if (p.isCancel(label)) break

    const value = await p.text({
      message: 'Menu item value:',
      initial: String(label).toLowerCase().replace(/\s+/g, '_'),
    })

    if (p.isCancel(value)) break

    const description = await p.text({
      message: 'Description (optional):',
    })

    if (p.isCancel(description)) break

    const type = await p.select({
      message: 'Item type:',
      options: [
        { value: 'action', label: 'Action' },
        { value: 'submenu', label: 'Submenu' },
        { value: 'link', label: 'Link' },
      ],
    })

    if (p.isCancel(type)) break

    const menuItem: MenuItem = {
      label: String(label),
      value: String(value),
      description: description ? String(description) : undefined,
    }

    if (type === 'submenu') {
      logger.info(`\nAdding submenu items for "${label}"`)
      menuItem.subMenu = await generateMenuStructure()
    } else if (type === 'action') {
      menuItem.action = async () => {
        logger.info(`// TODO: Implement action for ${label}`)
      }
    }

    menu.push(menuItem)

    const addAnother = await p.confirm({
      message: 'Add another item at this level?',
    })

    if (p.isCancel(addAnother) || !addAnother) {
      adding = false
    }
  }

  return menu
}

async function saveTemplate(template: MenuTemplate) {
  const templatesDir = path.join(process.cwd(), 'src/templates/menus')
  await fs.mkdir(templatesDir, { recursive: true })

  const filePath = path.join(templatesDir, `${template.name}.json`)
  await fs.writeFile(filePath, JSON.stringify(template, null, 2))
}

async function generateTypeScriptCode(menu: MenuItem[], outputPath: string) {
  const code = `
import { MenuItem } from "../utils/menu-builder";

export const menuItems: MenuItem[] = ${JSON.stringify(menu, null, 2)};
`

  await fs.writeFile(outputPath, code)
  logger.success(`Generated menu structure at ${outputPath}`)
}

async function main() {
  const menuBuilderMenu: MenuItem[] = [
    {
      value: 'create',
      label: 'Create New Menu',
      description: 'Generate a new menu structure',
      action: async () => {
        const { name, outputPath } = await p.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Name for this menu structure:',
            validate: (input) => input.length > 0,
          },
          {
            type: 'input',
            name: 'outputPath',
            message: 'Output path for generated code:',
            initial: 'src/features/menus/',
          },
        ])

        const menu = await generateMenuStructure()
        const template: MenuTemplate = { name, items: menu, outputPath }

        await saveTemplate(template)
        await generateTypeScriptCode(menu, path.join(process.cwd(), outputPath, `${name}.ts`))
      },
    },
    {
      value: 'templates',
      label: 'Manage Templates',
      description: 'View and use existing templates',
      subMenu: [
        {
          value: 'list',
          label: 'List Templates',
          description: 'Show all saved templates',
          action: async () => {
            const templatesDir = path.join(process.cwd(), 'src/templates/menus')
            const files = await fs.readdir(templatesDir).catch(() => [])
            logger.info('\nAvailable templates:')
            files.forEach((file) => logger.info(`- ${path.parse(file).name}`))
          },
        },
        {
          value: 'use',
          label: 'Use Template',
          description: 'Create menu from existing template',
          action: async () => {
            // Template loading logic
          },
        },
      ],
    },
    {
      value: 'help',
      label: 'Help',
      description: 'Show usage instructions',
      action: showHelp,
    },
  ]

  const menu = new MenuBuilder(menuBuilderMenu)
  await menu.run()
}

if (require.main === module) {
  main().catch(console.error)
}
