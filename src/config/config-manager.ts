import Conf from 'conf'

const config = new Conf({
  projectName: 'devbuddy',
  defaults: {
    theme: 'default',
    defaultCategory: 'All',
  },
})

export function getConfig<T>(key: string): T {
  return config.get(key) as T
}

export function setConfig<T>(key: string, value: T): void {
  config.set(key, value)
}
