import apiClient from './apiClient.js'
import { mockUsers } from './mock/mockData.js'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// login/loginWithLine now call the real backend (POST /api/auth/login, /api/auth/line-login).
// register/forgotPassword/resetPassword/logout still use mock data — the backend
// doesn't implement those endpoints yet, so switching them now would break the pages.
export const authService = {
  async login({ username, password }) {
    const { data } = await apiClient.post('/auth/login', { username, password })
    return data // { user, token } — shape already matches what AuthContext expects
  },

  // Real LIFF login needs an access token from the LINE SDK (see plan step 6-7).
  // Until liffService.js exists, calling this will just fail against the real
  // backend (it requires accessToken) — kept as a mock so the "citizen" demo
  // path still works while LIFF isn't wired up yet.
  async loginWithLine() {
    await delay()
    return { user: mockUsers[0], token: 'mock-token-line' }
  },

  // Backend has no /api/auth/register endpoint yet — mock until it's built.
  async register(payload) {
    await delay()
    return { user: { id: Date.now(), status: 'active', ...payload }, token: `mock-token-${Date.now()}` }
  },

  // Backend has no /api/auth/forgot-password endpoint yet — mock until it's built.
  async forgotPassword(email) {
    await delay()
    return { message: `ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว` }
  },

  // Backend has no /api/auth/reset-password endpoint yet — mock until it's built.
  async resetPassword(_payload) {
    await delay()
    return { message: 'ตั้งรหัสผ่านใหม่สำเร็จ' }
  },

  // JWT is stateless — nothing to call on the backend, just clear local storage
  // (AuthContext already does that after this resolves).
  async logout() {
    return true
  },
}