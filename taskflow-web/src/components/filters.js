// src/components/filters.js — Gestion des filtres

function initFilters(onFilterChange) {
  const buttons = document.querySelectorAll('.filter-btn')

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('filter-btn--active'))
      btn.classList.add('filter-btn--active')
      onFilterChange(btn.dataset.filter)
    })
  })
}

function applyFilter(tasks, filter) {
  switch (filter) {
    case 'todo':   return tasks.filter(t => !t.done)
    case 'done':   return tasks.filter(t => t.done)
    case 'high':   return tasks.filter(t => t.priority === 'high')
    default:       return tasks
  }
}
