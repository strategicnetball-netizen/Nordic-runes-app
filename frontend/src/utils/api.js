import axios from 'axios'
import i18n from '../i18n'

// Dynamically detect API URL based on current host
const getAPIUrl = () => {
  const { protocol, hostname, port } = window.location
  
  // If on localhost, use localhost:3003
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3003'
  }
  
  // If accessing from mobile/network IP, use same IP with port 3003
  // This handles cases like 192.168.1.100:5175 -> 192.168.1.100:3003
  return `${protocol}//${hostname}:3003`
}

const API_URL = import.meta.env.VITE_API_URL || getAPIUrl()

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to get current language
const getLanguage = () => {
  return i18n.language || 'en'
}

// Rune endpoints
export const getAllRunes = () => apiClient.get('/api/runes', { params: { lang: getLanguage() } })
export const getRune = (id) => apiClient.get(`/api/runes/${id}`, { params: { lang: getLanguage() } })

// Context endpoints
export const getContexts = () => apiClient.get('/api/contexts', { params: { lang: getLanguage() } })

// Draw endpoints
export const drawRunes = (count, context, question = null) => apiClient.post('/api/draw', { count, context, question }, { params: { lang: getLanguage() } })

// Readings endpoints
export const saveReading = (context, stones, notes) => apiClient.post('/api/readings', { context, stones, notes })

export default apiClient
