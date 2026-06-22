// src/utils/analytics.js — Tracking d'événements local (simule un vrai outil analytics)

const ANALYTICS_STORAGE_KEY = 'taskflow_analytics_events'
const MAX_EVENTS = 500

const analytics = {

  track(eventName, payload = {}) {
    const events = this._load()
    events.push({
      event: eventName,
      payload,
      timestamp: new Date().toISOString(),
    })
    // Garder seulement les MAX_EVENTS plus récents
    const trimmed = events.slice(-MAX_EVENTS)
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(trimmed))
  },

  _load() {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  },

  getEventCounts() {
    const events = this._load()
    const counts = {}
    events.forEach(e => {
      counts[e.event] = (counts[e.event] || 0) + 1
    })
    return counts
  },

  getEventsByDay() {
    const events = this._load()
    const byDay = {}
    events.forEach(e => {
      const day = e.timestamp.split('T')[0]
      byDay[day] = (byDay[day] || 0) + 1
    })
    return byDay
  },

  clear() {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY)
  },
}

// Auto-tracking des événements de base
document.addEventListener('DOMContentLoaded', () => {
  analytics.track('page_view', { path: window.location.pathname })
})
