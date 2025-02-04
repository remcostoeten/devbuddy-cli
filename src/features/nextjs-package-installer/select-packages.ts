import { selectTool, confirmAction } from '../../utils/clack-ui.js'
import { logger } from '../../utils/logger.js'

const nextjsPackages = [
  "@emotion/react",
  "@emotion/styled",
  "@mui/material",
  "@mui/icons-material",
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "sass",
  "styled-components",
  "framer-motion",
]

export async function selectPackages(): Promise<string[]> {
  try {
    const choices = nextjsPackages.map(pkg => ({ value: pkg, label: pkg }))
    const selectedPackage = await selectTool(choices)

    if (!selectedPackage) {
      logger.info("No package selected")
      return []
    }

    const confirmed = await confirmAction("Install selected package?")
    return confirmed ? [selectedPackage as string] : []
  } catch (error) {
    logger.error("Error selecting packages:", error)
    return []
  }
}

