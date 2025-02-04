import type { Plugin } from '../../types/plugin.js'
import { installPackages } from './install-packages.js'
import { selectPackages } from './select-packages.js'
import { logger } from '../../utils/logger.js'

const nextjsPackageInstaller: Plugin = {
  name: "nextjs-package-installer",
  description: "Install Next.js related packages",
  category: "Next.js Tools",
  action: async () => {
    try {
      const selectedPackages = await selectPackages()
      if (selectedPackages.length > 0) {
        await installPackages(selectedPackages)
      } else {
        logger.info("No packages selected. Installation cancelled.")
      }
    } catch (error) {
      logger.error("Error in Next.js package installer:", error)
    }
  },
}

export default nextjsPackageInstaller

