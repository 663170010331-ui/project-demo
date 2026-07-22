import { mockUsers } from './mock/mockData.js'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// Placeholder API surface. Replace body with `apiClient.post('/auth/login', payload)`
// once the backend exists — the function signatures below are already the target shape.
export const authService = {
  async login({ username, password }) {
    await delay()
    const user = mockUsers.find((u) => u.username === username)
    if (!user || password.length < 3) {
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    }
    return { user, token: `mock-token-${user.id}` }
  },

  async loginWithLine() {
    await delay()
    return { user: mockUsers[0], token: 'mock-token-line' }
  },

  async register(payload) {
    await delay()
    return { user: { id: Date.now(), status: 'active', ...payload }, token: `mock-token-${Date.now()}` }
  },

  async forgotPassword(email) {
    await delay()
    return { message: `ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว` }
  },

  async resetPassword(_payload) {
    await delay()
    return { message: 'ตั้งรหัสผ่านใหม่สำเร็จ' }
  },

  async logout() {
    await delay(100)
    return true
  },
}
