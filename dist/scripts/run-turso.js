import { execa } from 'execa';
import { platform } from 'os';
import * as readline from 'readline';
import chalk from 'chalk';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function checkTursoCLI() {
    try {
        await execa('turso', ['--version']);
        return true;
    }
    catch {
        return false;
    }
}
function getOS() {
    const os = platform().toLowerCase();
    if (os === 'darwin')
        return 'macos';
    if (os === 'linux')
        return 'linux';
    if (os === 'win32')
        return 'windows';
    return null;
}
async function promptForOS() {
    return new Promise((resolve) => {
        rl.question('Please specify your OS (macos/linux/windows): ', (answer) => {
            const os = answer.toLowerCase();
            if (['macos', 'linux', 'windows'].includes(os)) {
                resolve(os);
            }
            else {
                console.log('Invalid choice. Please enter macos, linux, or windows.');
                resolve(promptForOS());
            }
        });
    });
}
async function installTurso(osType) {
    const os = osType || await promptForOS();
    try {
        if (os === 'macos') {
            await execa('brew', ['install', 'tursodatabase/tap/turso']);
        }
        else if (os === 'linux' || os === 'windows') {
            await execa('curl', ['-sSfL', 'https://get.tur.so/install.sh'], {
                shell: true,
                stdio: 'inherit'
            });
        }
        console.log(chalk.green('\n✅ Turso CLI installed successfully!'));
        console.log('\nPlease authenticate with Turso by running:');
        console.log(chalk.cyan('turso auth signup'));
        return true;
    }
    catch (error) {
        console.error(chalk.red(`\n❌ Failed to install Turso CLI: ${error.message}`));
        return false;
    }
}
async function checkTursoAuth() {
    try {
        await execa('turso', ['auth', 'status']);
        return true;
    }
    catch {
        return false;
    }
}
async function promptForAuth() {
    console.log(chalk.yellow('\n⚠️ You are not authenticated with Turso.'));
    const answer = await new Promise((resolve) => {
        rl.question('Would you like to authenticate now? (Y/n): ', resolve);
    });
    if (answer.toLowerCase() !== 'y' && answer !== '') {
        return false;
    }
    try {
        console.log(chalk.cyan('\nLaunching Turso authentication...'));
        await execa('turso', ['auth', 'login'], { stdio: 'inherit' });
        return true;
    }
    catch (error) {
        console.error(chalk.red(`\n❌ Authentication failed: ${error.message}`));
        return false;
    }
}
async function main() {
    const hasTurso = await checkTursoCLI();
    if (!hasTurso) {
        console.log(chalk.red('❌ Turso CLI is not installed but required for this script.'));
        const answer = await new Promise((resolve) => {
            rl.question('Would you like to install it now? (Y/n): ', resolve);
        });
        if (answer.toLowerCase() !== 'y' && answer !== '') {
            console.log('Exiting script. Please install Turso CLI manually to continue.');
            rl.close();
            process.exit(1);
        }
        const osType = getOS();
        if (!await installTurso(osType)) {
            rl.close();
            process.exit(1);
        }
    }
    const isAuthenticated = await checkTursoAuth();
    if (!isAuthenticated) {
        const didAuthenticate = await promptForAuth();
        if (!didAuthenticate) {
            console.log(chalk.red('Authentication required. Please run turso auth login manually.'));
            rl.close();
            process.exit(1);
        }
    }
    rl.close();
    // Continue with the rest of your existing turso script implementation...
}
main().catch(console.error);
