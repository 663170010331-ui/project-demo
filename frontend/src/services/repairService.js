import { mockRepairRequests, mockTechnicians, mockStats } from './mock/mockData.js'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
let requests = [...mockRepairRequests]

// Mirrors the future REST endpoints: /repairs, /repairs/:id, /repairs/:id/assign ...
export const repairService = {
  async list(filters = {}) {
    await delay()
    let data = [...requests]
    if (filters.status) data = data.filter((r) => r.status === filters.status)
    if (filters.category) data = data.filter((r) => r.category === filters.category)
    if (filters.reporterId) data = data.filter((r) => r.reporterId === filters.reporterId)
    if (filters.technicianId) data = data.filter((r) => r.technicianId === filters.technicianId)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      data = data.filter((r) => r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q))
    }
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay()
    const found = requests.find((r) => r.id === id)
    if (!found) throw new Error('ไม่พบคำขอแจ้งซ่อม')
    return found
  },

  async create(payload) {
    await delay(600)
    const id = `SR2026-${String(50 + requests.length).padStart(3, '0')}`
    const newRequest = {
      id, status: 'reported', technicianId: null, createdAt: new Date().toISOString(),
      images: [], ...payload,
    }
    requests = [newRequest, ...requests]
    return newRequest
  },

  async assignTechnician(id, technicianId, priority) {
    await delay()
    requests = requests.map((r) => (r.id === id ? { ...r, technicianId, priority, status: 'assigned' } : r))
    return requests.find((r) => r.id === id)
  },

  async updateStatus(id, status) {
    await delay()
    requests = requests.map((r) => (r.id === id ? { ...r, status } : r))
    return requests.find((r) => r.id === id)
  },

  async listTechnicians() {
    await delay()
    return mockTechnicians
  },

  async getStats() {
    await delay()
    return mockStats
  },
}
