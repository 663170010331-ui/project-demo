import apiClient from './apiClient.js'

// Connects ManageUsers.jsx to the real backend (GET /api/users was written
// and working since the very first backend pass — only the frontend never
// called it, so the page kept showing 5 hardcoded mock names).
export const userService = {
  async list() {
    const { data } = await apiClient.get('/users')
    return data
  },

  async listTechnicians() {
    const { data } = await apiClient.get('/users/technicians')
    return data
  },

  // NOTE: the backend route is PATCH /api/users/:role/:id/toggle-status and
  // only knows how to flip status on tb_operator or tb_technician — there is
  // no status column on tb_user (citizens), so this must never be called with
  // role === 'citizen'. ManageUsers.jsx guards against that (see below).
  async toggleStatus(role, id) {
    const { data } = await apiClient.patch(`/users/${role}/${id}/toggle-status`)
    return data
  },
}