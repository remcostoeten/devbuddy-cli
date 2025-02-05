import { logger } from '../../utils/logger.js'
import type { Plugin } from '../load-plugins.js'
import { selectTool, confirmAction } from '../../utils/clack-ui.js'
import { execSync } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'

const nextjsPackages = [
  '@emotion/react',
  '@emotion/styled',
  '@mui/material',
  '@mui/icons-material',
  'tailwindcss',
  'postcss',
  'autoprefixer',
  'sass',
  'styled-components',
  'framer-motion',
]

export const nextjsPackageInstaller: Plugin = {
  name: 'nextjs-package-installer',
  description: 'Install common Next.js packages',
  category: 'Next.js Tools',
  async action() {
    const choices = nextjsPackages.map((pkg) => ({
      value: pkg,
      label: pkg,
    }))

    const selectedPackage = await selectTool(choices)

    if (!selectedPackage) {
      logger.info('No package selected')
      return
    }

    const confirmed = await confirmAction(`Install ${selectedPackage}?`)

    if (confirmed) {
      const command = `npm install ${selectedPackage}`
      logger.info(`Running: ${command}`)
      // Execute command here
    }
  },
}

export default nextjsPackageInstaller
