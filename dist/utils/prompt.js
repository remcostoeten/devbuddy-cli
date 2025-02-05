import inquirer from 'inquirer';
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
// Register the autocomplete prompt type
inquirer.registerPrompt('autocomplete', inquirerAutocomplete);
export async function promptForModule(modules) {
    // Create a cool title
    console.log('\n' + boxen(gradient.pastel.multiline('DevBuddy CLI\n') +
        chalk.cyan('Your Development Companion'), {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
    }));
    // Add numbers to the display names with colors
    const choicesWithNumbers = modules.map((module, index) => ({
        ...module,
        name: `${chalk.green(`${index + 1}.`)} ${chalk.yellow(module.name)}${module.description ? chalk.dim(` - ${module.description}`) : ''}`,
        shortcut: index + 1
    }));
    const searchModules = async (_answers, input = '') => {
        // Handle number input
        const numInput = parseInt(input);
        if (!isNaN(numInput)) {
            const choice = choicesWithNumbers.find(c => c.shortcut === numInput);
            return choice ? [choice] : choicesWithNumbers;
        }
        // If no input, return all choices
        if (!input) {
            return choicesWithNumbers;
        }
        // Handle text search
        const fuzzyResult = fuzzy.filter(input, choicesWithNumbers, {
            extract: el => `${el.name} ${el.description}`
        });
        return fuzzyResult.map(result => result.original);
    };
    console.log(chalk.cyan('\n👉 Use arrow keys, type to filter, or press numbers 1-N to select\n'));
    const { selectedModule } = await inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'selectedModule',
            message: gradient.rainbow('What would you like to do?'),
            source: searchModules,
            pageSize: 10,
            suggestOnly: false,
            emitError: false
        }
    ]);
    return selectedModule;
}
