export interface UIFolderManagerConfig {
  dryRun: boolean
  uiFolderName: string
  filePatterns: string[]
  excludePatterns: string[]
}

export const defaultConfig: UIFolderManagerConfig = {
  dryRun: true,
  uiFolderName: 'ui',
  filePatterns: ['**/*.tsx'],
  excludePatterns: ['node_modules/**'],
}
