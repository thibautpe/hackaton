// src/utils/storage.js — Persistance localStorage
// ⚠️ Cible exercice étape ⓪ : pas de gestion d'erreur si localStorage est désactivé

const STORAGE_KEY = 'taskflow_tasks'

const storage = {
  load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  },

  save(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
