import apiClient from './apiClient.js'

// All repair endpoints now call the real backend. Response shape from the
// backend controller (toClientShape in repairController.js) already matches
// the mock field names 1:1, so no page-level changes were needed.
export const repairService = {
  // Uploads one image file to POST /api/upload and returns its public URL.
  // IMPORTANT: apiClient sets a default 'Content-Type: application/json' header
  // on the whole instance (see apiClient.js). That default does NOT get
  // auto-replaced just because we send a FormData body — axios only auto-sets
  // the multipart boundary when no Content-Type was explicitly configured.
  // We must explicitly clear it here so the browser can generate the correct
  // "multipart/form-data; boundary=..." header itself. Without this line,
  // every upload silently arrives at the backend with no file in it.
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('image', file, file.name)
    const { data } = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': undefined },
    })
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