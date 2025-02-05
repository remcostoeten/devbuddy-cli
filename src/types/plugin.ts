export interface Plugin {
  name: string
  description: string
  action: () => Promise<void>
  category?: string
}
