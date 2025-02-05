import boxen from 'boxen'
import chalk from 'chalk'
import gradient from 'gradient-string'

type BoxenOptions = Parameters<typeof boxen>[1]

export const styles = {
  title: (text: string) => {
    const asciiArt = `
    ██████╗ ███████╗██╗   ██╗██████╗ ██╗   ██╗██████╗ ██████╗ ██╗   ██╗
    ██╔══██╗██╔════╝██║   ██║██╔══██╗██║   ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
    ██║  ██║█████╗  ██║   ██║██████╔╝██║   ██║██║  ██║██║  ██║ ╚████╔╝ 
    ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══██╗██║   ██║██║  ██║██║  ██║  ╚██╔╝  
    ██████╔╝███████╗ ╚████╔╝ ██████╔╝╚██████╔╝██████╔╝██████╔╝   ██║   
    ╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝    ╚═╝   
    `

    const banner = gradient.passion.multiline(asciiArt)
    const subtitle = gradient.morning.multiline(text)

    return boxen(`${banner}\n${subtitle}`, {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
    } as BoxenOptions)
  },

  section: (text: string) =>
    boxen(gradient.morning(text), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'yellow',
    } as BoxenOptions),

  success: (text: string) => chalk.green(`✔ ${text}`),
  error: (text: string) => chalk.red(`✖ ${text}`),
  info: (text: string) => chalk.blue(`ℹ ${text}`),
  warning: (text: string) => chalk.yellow(`⚠ ${text}`),

  menuItem: (number: number, name: string, description?: string) =>
    `${chalk.green(`${number}.`)} ${chalk.yellow(name)}${
      description ? chalk.dim(` - ${description}`) : ''
    }`,

  gradients: {
    title: gradient.pastel,
    menu: gradient.rainbow,
    success: gradient.morning,
    error: gradient.vice,
  },
}
