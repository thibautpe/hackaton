// src/components/datePicker.js — Sélecteur de date léger

const datePicker = {

  create(initialValue, onChange) {
    const wrapper = document.createElement('div')
    wrapper.className = 'date-picker'

    const input = document.createElement('input')
    input.type = 'date'
    input.className = 'date-picker__input'
    input.value = initialValue ? this._toInputFormat(initialValue) : ''

    const clearBtn = document.createElement('button')
    clearBtn.className = 'date-picker__clear'
    clearBtn.textContent = '×'
    clearBtn.setAttribute('aria-label', 'Effacer la date')
    clearBtn.style.display = input.value ? 'inline-block' : 'none'

    input.addEventListener('change', () => {
      clearBtn.style.display = input.value ? 'inline-block' : 'none'
      onChange(input.value ? new Date(input.value).toISOString() : null)
    })

    clearBtn.addEventListener('click', () => {
      input.value = ''
      clearBtn.style.display = 'none'
      onChange(null)
    })

    wrapper.appendChild(input)
    wrapper.appendChild(clearBtn)
    return wrapper
  },

  _toInputFormat(isoString) {
    const d = new Date(isoString)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  },

  isOverdue(isoString) {
    if (!isoString) return false
    return new Date(isoString) < new Date()
  },

  formatRelative(isoString) {
    if (!isoString) return ''
    const date = new Date(isoString)
    const now = new Date()
    const diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Demain'
    if (diffDays === -1) return 'Hier'
    if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`
    if (diffDays < -1 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`
    return formatDate(isoString)
  },
}
