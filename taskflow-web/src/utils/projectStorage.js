// src/utils/projectStorage.js — Persistance localStorage pour les projets

const PROJECT_STORAGE_KEY = 'taskflow_projects'

const projectStorage = {
  load() {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  },

  save(projects) {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects))
  },

  clear() {
    localStorage.removeItem(PROJECT_STORAGE_KEY)
  },

  findById(id) {
    return this.load().find(p => p.id === id)
  },
}
