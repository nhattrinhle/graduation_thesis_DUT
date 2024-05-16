export type AppConfig = {
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  tourPath: string
  adminEntryPath: string
}

const appConfig: AppConfig = {
  authenticatedEntryPath: '/seller',
  unAuthenticatedEntryPath: '/login',
  tourPath: '/home',
  adminEntryPath: '/admin',
}

export default appConfig
