import { execSync } from "child_process";
import { selectTool, confirmAction } from "../../utils/clack-ui.js";
import { logger } from "../../utils/logger.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MenuBuilder } from "../../utils/menu-builder.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function installTursoCli() {
    try {
        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';
        if (isMac) {
            logger.info("Installing Turso CLI via Homebrew...");
            execSync("brew install tursodatabase/tap/turso", { stdio: 'inherit' });
        }
        else {
            logger.info("Installing Turso CLI...");
            execSync("curl -sSfL https://get.tur.so/install.sh | bash", { stdio: 'inherit' });
        }
        logger.info("✅ Turso CLI installed successfully!");
        return true;
    }
    catch (error) {
        logger.error("Failed to install Turso CLI:", error);
        return false;
    }
}
async function checkTursoCli() {
    try {
        execSync("turso --version", { stdio: "pipe" });
        return true;
    }
    catch (error) {
        logger.error("Turso CLI is not installed.");
        const shouldInstall = await confirmAction("Would you like to install it now?");
        if (shouldInstall) {
            return await installTursoCli();
        }
        else {
            logger.info("You can install it manually with:");
            logger.info("On macOS: brew install tursodatabase/tap/turso");
            logger.info("On Linux/Windows: curl -sSfL https://get.tur.so/install.sh | bash");
            return false;
        }
    }
}
async function checkTursoAuth() {
    try {
        execSync("turso auth status", { stdio: "pipe" });
        return true;
    }
    catch (error) {
        logger.error("You are not authenticated with Turso CLI. Please run 'turso auth login' first.");
        return false;
    }
}
async function createTursoDb() {
    try {
        // Create database
        const createOutput = execSync("turso db create", { encoding: "utf8" });
        const dbNameMatch = createOutput.match(/Created database (\S+)/);
        if (!dbNameMatch) {
            throw new Error("Could not extract database name from output");
        }
        const dbName = dbNameMatch[1];
        logger.info(`Created database: ${dbName}`);
        // Get database URL
        const showOutput = execSync(`turso db show ${dbName}`, { encoding: "utf8" });
        const urlMatch = showOutput.match(/URL:\s+(libsql:\/\/[\w.-]+)/);
        if (!urlMatch) {
            throw new Error("Could not extract database URL");
        }
        const dbUrl = urlMatch[1];
        // Create token
        const authToken = execSync(`turso db tokens create ${dbName}`, { encoding: "utf8" }).trim();
        return { dbUrl, authToken, dbName };
    }
    catch (error) {
        logger.error("Error creating Turso database:", error);
        return null;
    }
}
async function listDatabases() {
    try {
        const output = execSync("turso db list", { encoding: "utf8" });
        logger.info("Your Turso Databases:\n" + output);
    }
    catch (error) {
        logger.error("Error listing databases:", error);
    }
}
async function deleteDatabase(dbName) {
    try {
        execSync(`turso db destroy ${dbName} --confirm`, { encoding: "utf8" });
        logger.info(`Database ${dbName} deleted successfully`);
        return true;
    }
    catch (error) {
        logger.error(`Error deleting database ${dbName}:`, error);
        return false;
    }
}
async function updateEnvFile(filePath, credentials) {
    try {
        const envContent = await fs.readFile(filePath, "utf8").catch(() => "");
        const lines = envContent.split("\n");
        const updatedLines = lines.map(line => {
            if (line.startsWith("DB_URL=")) {
                return `# Old ${line}\nDB_URL=${credentials.dbUrl}`;
            }
            if (line.startsWith("AUTH_TOKEN=")) {
                return `# Old ${line}\nAUTH_TOKEN=${credentials.authToken}`;
            }
            if (line.startsWith("TURSO_DB_NAME=")) {
                return `# Old ${line}\nTURSO_DB_NAME=${credentials.dbName}`;
            }
            return line;
        });
        if (!lines.some(line => line.startsWith("DB_URL="))) {
            updatedLines.push(`DB_URL=${credentials.dbUrl}`);
        }
        if (!lines.some(line => line.startsWith("AUTH_TOKEN="))) {
            updatedLines.push(`AUTH_TOKEN=${credentials.authToken}`);
        }
        if (!lines.some(line => line.startsWith("TURSO_DB_NAME="))) {
            updatedLines.push(`TURSO_DB_NAME=${credentials.dbName}`);
        }
        await fs.writeFile(filePath, updatedLines.join("\n") + "\n");
        logger.info(`Updated ${filePath} with new credentials`);
    }
    catch (error) {
        logger.error(`Error updating ${filePath}:`, error);
    }
}
export const tursoDbManager = {
    name: "turso-db-manager",
    description: "Create and manage Turso databases",
    category: "Database Tools",
    async action() {
        try {
            if (!await checkTursoCli())
                return;
            if (!await checkTursoAuth())
                return;
            const menuItems = [
                {
                    value: "create",
                    label: "Create Database",
                    description: "Create a new Turso database",
                    subMenu: [
                        {
                            value: "create_simple",
                            label: "Quick Create",
                            description: "Create database with default settings",
                            action: async () => {
                                const credentials = await createTursoDb();
                                if (credentials) {
                                    logger.info("Database created successfully!");
                                    logger.info(`DB_URL=${credentials.dbUrl}`);
                                    logger.info(`AUTH_TOKEN=${credentials.authToken}`);
                                    logger.info(`TURSO_DB_NAME=${credentials.dbName}`);
                                    const updateEnv = await confirmAction("Would you like to update your .env file with these credentials?");
                                    if (updateEnv) {
                                        await updateEnvFile(".env", credentials);
                                    }
                                }
                            }
                        },
                        {
                            value: "create_advanced",
                            label: "Advanced Create",
                            description: "Configure database settings",
                            subMenu: [
                            // Additional creation options could go here
                            ]
                        }
                    ]
                },
                {
                    value: "manage",
                    label: "Manage Databases",
                    description: "List, modify, or delete databases",
                    subMenu: [
                        {
                            value: "list",
                            label: "List Databases",
                            description: "Show all databases",
                            action: listDatabases
                        },
                        {
                            value: "delete",
                            label: "Delete Database",
                            description: "Remove a database",
                            action: async () => {
                                const output = execSync("turso db list", { encoding: "utf8" });
                                const databases = output.split("\n")
                                    .filter(line => line.trim())
                                    .map(line => ({ value: line.trim(), label: line.trim() }));
                                if (databases.length === 0) {
                                    logger.info("No databases found");
                                    return;
                                }
                                const dbToDelete = await selectTool(databases);
                                if (typeof dbToDelete === 'string') {
                                    const confirmed = await confirmAction(`Are you sure you want to delete database ${dbToDelete}?`);
                                    if (confirmed) {
                                        await deleteDatabase(dbToDelete);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    value: "env",
                    label: "Environment Setup",
                    description: "Manage environment variables",
                    action: async () => {
                        // ... env file management logic ...
                    }
                }
            ];
            const menu = new MenuBuilder(menuItems);
            await menu.run();
        }
        catch (error) {
            logger.error("Error in Turso DB manager:", error);
        }
    }
};
export default tursoDbManager;
