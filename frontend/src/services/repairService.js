import apiClient from './apiClient.js'

// All repair endpoints now call the real backend. Response shape from the
// backend controller (toClientShape in repairController.js) already matches
// the mock field names 1:1, so no page-level changes were needed.
export const repairService = {
  // Uploads one image file to POST /api/upload and returns its public URL.
  // Note: we pass FormData as-is with no manual Content-Type header — axios
  // detects FormData and lets the browser set the multipart boundary itself.
  // Setting the header manually here would break multer's parsing on the backend.
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await apiClient.post('/upload', formData)
    return data.url
  },

  async list(filters = {}) {
    const { data } = await apiClient.get('/repairs', { params: filters })
    return data
  },

  async getById(id) {
    const { data } = await apiClient.get(`/repairs/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await apiClient.post('/repairs', payload)
    return data
  },

  async assignTechnician(id, technicianId, priority) {
    const { data } = await apiClient.post(`/repairs/${id}/assign`, { technicianId, priority })
    return data
  },

  async updateStatus(id, status, repairResult, imagesAfter) {
    const { data } = await apiClient.patch(`/repairs/${id}/status`, { status, repairResult, imagesAfter })
    return data
  },

  async listTechnicians() {
    const { data } = await apiClient.get('/users/technicians')
    return data
  },

  async getStats() {
    const { data } = await apiClient.get('/repairs/stats')
    return data
  },
}