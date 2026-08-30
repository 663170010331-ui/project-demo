import apiClient from './apiClient.js'

export const notificationService = {
  async list() {
    const { data } = await apiClient.get('/notifications')
    return data
  },

  async markRead(id) {
    const { data } = await apiClient.patch(`/notifications/${id}/read`)
    return data
  },

  async markAllRead() {
    const { data } = await apiClient.patch('/notifications/read-all')
    return data
  },
}