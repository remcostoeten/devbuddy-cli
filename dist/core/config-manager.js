import Conf from "conf";
import { logger } from '../utils/logger.js';
const config = new Conf({
    projectName: "devbuddy",
    defaults: {
        theme: "default",
        defaultCategory: "All",
    },
});
export function getConfig(key) {
    try {
        return config.get(key);
    }
    catch (error) {
        logger.error(`Error getting config for key ${key}:`, error);
        throw error;
    }
}
export function setConfig(key, value) {
    try {
        config.set(key, value);
    }
    catch (error) {
        logger.error(`Error setting config for key ${key}:`, error);
        throw error;
    }
}
