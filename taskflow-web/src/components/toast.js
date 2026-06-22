// src/components/toast.js — Notifications temporaires (succès, erreur, info)

const toast = {

  container: null,

  _ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.className = 'toast-container'
      this.container.setAttribute('aria-live', 'polite')
      document.body.appendChild(this.container)
    }
    return this.container
  },

  show(message, type = 'info', duration = 3000) {
    const container = this._ensureContainer()

    const el = document.createElement('div')
    el.className = `toast toast--${type}`
    el.textContent = message

    container.appendChild(el)

    requestAnimationFrame(() => el.classList.add('toast--visible'))

    setTimeout(() => {
      el.classList.remove('toast--visible')
      setTimeout(() => el.remove(), 250)
    }, duration)
  },

  success(message) { this.show(message, 'success') },
  error(message)   { this.show(message, 'error', 4000) },
  info(message)    { this.show(message, 'info') },
}
