import { execSync } from 'child_process';
import { existsSync } from 'fs';
import chalk from 'chalk';
export function detectPackageManager() {
    // Check for lockfiles
    const hasYarnLock = existsSync('yarn.lock');
    const hasPnpmLock = existsSync('pnpm-lock.yaml');
    const hasPackageLock = existsSync('package-lock.json');
    const hasBunLock = existsSync('bun.lockb');
    // Check for global package manager installations
    try {
        if (hasYarnLock) {
            execSync('yarn python:turso');
            console.log(chalk.yellow('Ewww brotha, u use yarn? 🤒'));
            return;
        }
        if (hasPnpmLock) {
            execSync('pnpm run python:turso');
            return;
        }
        if (hasBunLock) {
            execSync('bun run python:turso');
            return;
        }
        if (hasPackageLock) {
            execSync('npm run python:turso');
            return;
        }
        // Default to npm if no lockfile is found
        execSync('npm run python:turso');
    }
    catch (error) {
        console.error(chalk.red('Failed to execute python:turso script'), error);
        process.exit(1);
    }
}
