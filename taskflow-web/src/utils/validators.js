// src/utils/validators.js — Fonctions de validation réutilisables

const validators = {

  taskTitle(value) {
    if (!value || value.trim().length === 0) {
      return { valid: false, error: 'Le titre est requis' }
    }
    if (value.trim().length < 3) {
      return { valid: false, error: 'Le titre doit contenir au moins 3 caractères' }
    }
    if (value.length > 100) {
      return { valid: false, error: 'Le titre ne peut pas dépasser 100 caractères' }
    }
    return { valid: true }
  },

  projectName(value, existingNames = []) {
    if (!value || value.trim().length === 0) {
      return { valid: false, error: 'Le nom du projet est requis' }
    }
    if (value.length > 50) {
      return { valid: false, error: 'Le nom ne peut pas dépasser 50 caractères' }
    }
    if (existingNames.some(n => n.toLowerCase() === value.trim().toLowerCase())) {
      return { valid: false, error: 'Un projet avec ce nom existe déjà' }
    }
    return { valid: true }
  },

  dueDate(isoString) {
    if (!isoString) return { valid: true } // Date optionnelle
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Date invalide' }
    }
    return { valid: true }
  },

  priority(value) {
    const valid = ['low', 'medium', 'high'].includes(value)
    return valid
      ? { valid: true }
      : { valid: false, error: 'Priorité invalide' }
  },
}
