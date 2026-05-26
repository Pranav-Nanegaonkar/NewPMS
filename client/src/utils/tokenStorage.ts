const TOKEN_KEY = 'pms_token'

export const tokenStorage = {
  save(token: string, rememberMe = true): void {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token)
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  },

  remove(): void {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}
