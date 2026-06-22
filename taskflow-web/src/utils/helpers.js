// src/utils/helpers.js — Fonctions utilitaires

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function sanitize(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

const PRIORITY_LABELS = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }
