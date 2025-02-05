import * as p from '@clack/prompts'
import { logger } from './logger.js'

export interface MenuItem {
  value: string
  label: string
  description?: string
  action?: () => Promise<void>
  subMenu?: MenuItem[]
}

export class MenuBuilder {
  private breadcrumbs: string[] = []
  private history: MenuItem[][] = []

  constructor(private items: MenuItem[]) {
    this.history.push(items)
  }

  private async showBreadcrumbs() {
    if (this.breadcrumbs.length > 0) {
      logger.info(`Location: ${this.breadcrumbs.join(' > ')}`)
    }
  }

  private getNavigationChoices(items: MenuItem[]): MenuItem[] {
    const choices = [...items]

    if (this.history.length > 1) {
      choices.push({
        value: '__back',
        label: '← Go Back',
        description: 'Return to previous menu',
      })
    }

    choices.push({
      value: '__exit',
      label: 'Exit',
      description: 'Exit the menu',
    })

    return choices
  }

  async run() {
    let running = true

    while (running) {
      await this.showBreadcrumbs()

      const currentMenu = this.history[this.history.length - 1]
      const choices = this.getNavigationChoices(currentMenu)

      const selected = await p.select({
        message: 'Select an option:',
        options: choices.map((item) => ({
          value: item.value,
          label: item.label,
          hint: item.description,
        })),
      })

      if (p.isCancel(selected)) {
        running = false
        continue
      }

      switch (selected) {
        case '__back':
          this.history.pop()
          this.breadcrumbs.pop()
          break

        case '__exit':
          running = false
          break

        default: {
          const selectedItem = currentMenu.find((item) => item.value === selected)
          if (selectedItem) {
            if (selectedItem.subMenu) {
              this.history.push(selectedItem.subMenu)
              this.breadcrumbs.push(selectedItem.label)
            } else if (selectedItem.action) {
              await selectedItem.action()
              const shouldContinue = await p.confirm({
                message: 'Return to menu?',
              })
              if (!shouldContinue) running = false
            }
          }
        }
      }
    }
  }
}
