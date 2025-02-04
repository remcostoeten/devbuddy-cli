import type { Plugin } from "../../types/plugin.js";
import { execSync } from "child_process";
import { selectTool, confirmAction } from "../../utils/clack-ui.js";
import { logger } from "../../utils/logger.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TursoCredentials {
  dbUrl: string;
  authToken: string;
  dbName: string;
}

async function checkTursoAuth(): Promise<boolean> {
  try {
    execSync("turso auth status", { stdio: "pipe" });
    return true;
  } catch (error) {
    logger.error("You are not authenticated with Turso CLI. Please run 'turso auth login' first.");
    return false;
  }
}

async function createTursoDb(): Promise<TursoCredentials | null> {
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
  } catch (error) {
    logger.error("Error creating Turso database:", error);
    return null;
  }
}

async function listDatabases(): Promise<void> {
  try {
    const output = execSync("turso db list", { encoding: "utf8" });
    logger.info("Your Turso Databases:\n" + output);
  } catch (error) {
    logger.error("Error listing databases:", error);
  }
}

async function deleteDatabase(dbName: string): Promise<boolean> {
  try {
    execSync(`turso db destroy ${dbName} --confirm`, { encoding: "utf8" });
    logger.info(`Database ${dbName} deleted successfully`);
    return true;
  } catch (error) {
    logger.error(`Error deleting database ${dbName}:`, error);
    return false;
  }
}

async function updateEnvFile(filePath: string, credentials: TursoCredentials): Promise<void> {
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
  } catch (error) {
    logger.error(`Error updating ${filePath}:`, error);
  }
}

export const tursoDbManager: Plugin = {
  name: "turso-db-manager",
  description: "Create and manage Turso databases",
  category: "Database Tools",
  async action() {
    try {
      if (!await checkTursoAuth()) {
        return;
      }

      const choices = [
        { value: "create", label: "Create new Turso database" },
        { value: "list", label: "List all databases" },
        { value: "delete", label: "Delete a database" },
        { value: "env", label: "Update .env file with credentials" }
      ];

      while (true) {
        const selected = await selectTool(choices);
        
        switch (selected) {
          case "create": {
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
            break;
          }
          case "list": {
            await listDatabases();
            break;
          }
          case "delete": {
            const output = execSync("turso db list", { encoding: "utf8" });
            const databases = output.split("\n")
              .filter(line => line.trim())
              .map(line => ({ value: line.trim(), label: line.trim() }));

            if (databases.length === 0) {
              logger.info("No databases found");
              break;
            }

            const dbToDelete = await selectTool(databases);
            if (typeof dbToDelete === 'string') {
              const confirmed = await confirmAction(`Are you sure you want to delete database ${dbToDelete}?`);
              if (confirmed) {
                await deleteDatabase(dbToDelete);
              }
            }
            break;
          }
          case null:
          case undefined:
            return;
        }

        const continueManaging = await confirmAction("Would you like to perform another Turso operation?");
        if (!continueManaging) {
          break;
        }
      }
    } catch (error) {
      logger.error("Error in Turso DB manager:", error);
    }
  }
};

export default tursoDbManager; 