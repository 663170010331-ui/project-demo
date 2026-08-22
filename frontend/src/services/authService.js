import apiClient from './apiClient.js'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// login/loginWithLine now call the real backend (POST /api/auth/login, /api/auth/line-login).
// register/forgotPassword/resetPassword/logout still use mock data — the backend
// doesn't implement those endpoints yet, so switching them now would break the pages.
export const authService = {
  async login({ username, password }) {
    const { data } = await apiClient.post('/auth/login', { username, password })
    return data // { user, token } — shape already matches what AuthContext expects
  },

  // Real LIFF login — accessToken/profile come from liffService.getLiffAuth().
  // Backend verifies the token with LINE, then finds-or-creates the tb_user row.
  async loginWithLine(accessToken, profile) {
    const { data } = await apiClient.post('/auth/line-login', { accessToken, profile })
    return data // { user, token }
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