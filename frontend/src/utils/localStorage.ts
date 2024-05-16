export interface inforUser {
  user: {
    userId: string
    roleId: string
    email: string
    fullName: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export const setItem = (key: string, data: inforUser): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getItem = (key: string): inforUser | undefined => {
  const storedItem = localStorage.getItem(key)
  return storedItem ? JSON.parse(storedItem) : undefined
}

export const removeItem = (key: string): void => {
  localStorage.removeItem(key)
}
