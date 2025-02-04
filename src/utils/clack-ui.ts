import * as p from "@clack/prompts"
import { logger } from "./logger.js"

export async function showIntro() {
  p.intro("Welcome to DevBuddy!")
}

export async function showOutro() {
  p.outro("Thanks for using DevBuddy!")
}

export async function selectTool(choices: { value: string; label: string }[]) {
  const result = await p.select({
    message: "Select a tool to use:",
    options: choices,
  })

  if (p.isCancel(result)) {
    logger.info("Operation cancelled")
    process.exit(0)
  }

  return result
}

export async function confirmAction(message: string) {
  const result = await p.confirm({
    message,
  })

  if (p.isCancel(result)) {
    logger.info("Operation cancelled")
    process.exit(0)
  }

  return result
}

export async function showSpinner<T>(message: string, action: () => Promise<T>): Promise<T> {
  const s = p.spinner()
  s.start(message)

  try {
    const result = await action()
    s.stop(message + " Complete!")
    return result
  } catch (error) {
    s.stop(message + " Failed!")
    logger.error(`Error in action: ${message}`, error)
    throw error
  }
}

