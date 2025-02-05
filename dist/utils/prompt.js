import inquirer from 'inquirer';
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';
// Register the autocomplete prompt type
inquirer.registerPrompt('autocomplete', inquirerAutocomplete);
export async function promptForModule(modules) {
    // Add numbers to the display names
    const choicesWithNumbers = modules.map((module, index) => ({
        ...module,
        name: `${index + 1}. ${module.name}${module.description ? ` - ${module.description}` : ''}`,
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
    const { selectedModule } = await inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'selectedModule',
            message: 'What would you like to do? (Type to filter, use numbers 1-N, or arrow keys):',
            source: searchModules,
            pageSize: 10,
            suggestOnly: false,
            emitError: false
        }
    ]);
    return selectedModule;
}
