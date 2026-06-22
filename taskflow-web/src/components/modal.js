// src/components/modal.js — Composant modal générique réutilisable

const modal = {

  activeModal: null,

  open({ title, content, onConfirm, onCancel, confirmLabel = 'Confirmer', cancelLabel = 'Annuler' }) {
    this.close() // Fermer une éventuelle modale ouverte

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">${sanitize(title)}</h3>
          <button class="modal__close" aria-label="Fermer">×</button>
        </div>
        <div class="modal__body">${content}</div>
        <div class="modal__footer">
          <button class="btn btn--ghost" data-action="cancel">${sanitize(cancelLabel)}</button>
          <button class="btn btn--primary" data-action="confirm">${sanitize(confirmLabel)}</button>
        </div>
      </div>
    `

    overlay.querySelector('.modal__close').addEventListener('click', () => {
      this.close()
      if (onCancel) onCancel()
    })

    overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      this.close()
      if (onCancel) onCancel()
    })

    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      if (onConfirm) onConfirm(overlay)
      this.close()
    })

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        this.close()
        if (onCancel) onCancel()
      }
    })

    document.addEventListener('keydown', this._handleEscape)

    document.body.appendChild(overlay)
    this.activeModal = overlay
  },

  close() {
    if (this.activeModal) {
      this.activeModal.remove()
      this.activeModal = null
      document.removeEventListener('keydown', this._handleEscape)
    }
  },

  _handleEscape(e) {
    if (e.key === 'Escape') modal.close()
  },

  confirmDelete(itemName, onConfirm) {
    this.open({
      title: 'Confirmer la suppression',
      content: `<p>Êtes-vous sûr de vouloir supprimer "${sanitize(itemName)}" ? Cette action est irréversible.</p>`,
      confirmLabel: 'Supprimer',
      onConfirm,
    })
  },
}
