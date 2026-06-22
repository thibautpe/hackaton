// src/components/dropdown.js — Menu déroulant générique

const dropdown = {

  create({ trigger, items }) {
    const wrapper = document.createElement('div')
    wrapper.className = 'dropdown'

    const triggerBtn = document.createElement('button')
    triggerBtn.className = 'dropdown__trigger'
    triggerBtn.textContent = trigger
    triggerBtn.setAttribute('aria-haspopup', 'true')
    triggerBtn.setAttribute('aria-expanded', 'false')

    const menu = document.createElement('div')
    menu.className = 'dropdown__menu'
    menu.hidden = true

    items.forEach(item => {
      if (item.divider) {
        const divider = document.createElement('div')
        divider.className = 'dropdown__divider'
        menu.appendChild(divider)
        return
      }
      const menuItem = document.createElement('button')
      menuItem.className = `dropdown__item${item.danger ? ' dropdown__item--danger' : ''}`
      menuItem.textContent = item.label
      menuItem.addEventListener('click', () => {
        item.onClick()
        this._closeAll()
      })
      menu.appendChild(menuItem)
    })

    triggerBtn.addEventListener('click', e => {
      e.stopPropagation()
      const isOpen = !menu.hidden
      this._closeAll()
      if (!isOpen) {
        menu.hidden = false
        triggerBtn.setAttribute('aria-expanded', 'true')
      }
    })

    wrapper.appendChild(triggerBtn)
    wrapper.appendChild(menu)

    document.addEventListener('click', () => this._closeAll())

    return wrapper
  },

  _closeAll() {
    document.querySelectorAll('.dropdown__menu').forEach(menu => { menu.hidden = true })
    document.querySelectorAll('.dropdown__trigger').forEach(btn => btn.setAttribute('aria-expanded', 'false'))
  },
}
