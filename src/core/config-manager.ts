import Conf from "conf"
import { logger } from '../utils/logger.js'

const config = new Conf({
  projectName: "devbuddy",
  defaults: {
    theme: "default",
    defaultCategory: "All",
  },
})

export function getConfig<T>(key: string): T {
  try {
    return config.get(key) as T
  } catch (error) {
    logger.error(`Error getting config for key ${key}:`, error)
    throw error
  }
}

export function setConfig<T>(key: string, value: T): void {
  try {
    config.set(key, value)
  } catch (error) {
    logger.error(`Error setting config for key ${key}:`, error)
    throw error
  }
}

