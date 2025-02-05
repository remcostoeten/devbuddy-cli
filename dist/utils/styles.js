import boxen from 'boxen';
import chalk from 'chalk';
import gradient from 'gradient-string';
export const styles = {
    title: (text) => boxen(gradient.pastel.multiline(text), {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
    }),
    section: (text) => boxen(gradient.morning(text), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'yellow',
    }),
    success: (text) => chalk.green(`✔ ${text}`),
    error: (text) => chalk.red(`✖ ${text}`),
    info: (text) => chalk.blue(`ℹ ${text}`),
    warning: (text) => chalk.yellow(`⚠ ${text}`),
    menuItem: (number, name, description) => (`${chalk.green(`${number}.`)} ${chalk.yellow(name)}${description ? chalk.dim(` - ${description}`) : ''}`),
    gradients: {
        title: gradient.pastel,
        menu: gradient.rainbow,
        success: gradient.morning,
        error: gradient.vice
    }
};
