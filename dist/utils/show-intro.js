import chalk from "chalk";
import { simpleGit } from 'simple-git';
/**
 * Displays the introduction message for DevBuddy.
 */
export async function showIntro() {
    const git = simpleGit({ baseDir: process.cwd() });
    const lastCommitDate = await git.log(["-1", "--format=%cd"]);
    const { version, author } = require("../../package.json");
    console.log(chalk.bold.blue("Welcome to DevBuddy!"));
    console.log(chalk.gray(`Version: ${version}`));
    console.log(chalk.gray(`Last updated: ${lastCommitDate}`));
    console.log(chalk.gray(`Author: ${author}`));
    console.log("");
}
export async function showGitInfo() {
    try {
        const git = simpleGit({ baseDir: process.cwd() });
        const status = await git.status();
        return {
            branch: status.current,
            isClean: status.isClean(),
            files: status.files,
        };
    }
    catch (error) {
        console.error('Error getting git info:', error);
        return null;
    }
}
