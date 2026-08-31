import apiClient from './apiClient.js'

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

  // Self-service — the logged-in user's own profile (Profile.jsx).
  async updateMe(payload) {
    const { data } = await apiClient.patch('/users/me', payload)
    return data
  },
  async changeMyPassword(payload) {
    const { data } = await apiClient.patch('/users/me/password', payload)
    return data
  },

  // Admin CRUD — operator managing operator/technician accounts (ManageUsers.jsx).
  async create(payload) {
    const { data } = await apiClient.post('/users', payload)
    return data
  },
  async update(role, id, payload) {
    const { data } = await apiClient.patch(`/users/${role}/${id}`, payload)
    return data
  },
  async remove(role, id) {
    const { data } = await apiClient.delete(`/users/${role}/${id}`)
    return data
  },
}