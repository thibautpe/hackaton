// src/app.js — Point d'entrée principal de TaskFlow
// ⚠️ Plusieurs points intentionnellement incomplets pour les exercices

let tasks = storage.load()
let currentFilter = 'all'

// --- Rendu ---

function renderStats() {
  const total = tasks.length
  const done  = tasks.filter(t => t.done).length
  document.getElementById('stats-total').textContent = `${total} tâche${total > 1 ? 's' : ''}`
  document.getElementById('stats-done').textContent  = `${done} terminée${done > 1 ? 's' : ''}`
}

function renderList() {
  const list      = document.getElementById('task-list')
  const emptyState = document.getElementById('empty-state')
  const filtered  = applyFilter(tasks, currentFilter)

  // Vider la liste sauf le empty-state
  Array.from(list.children).forEach(child => {
    if (child !== emptyState) child.remove()
  })

  emptyState.hidden = filtered.length > 0

  filtered.forEach(task => {
    const card = createTaskCard(task, {
      onToggle: toggleTask,
      onDelete: deleteTask,
    })
    list.appendChild(card)
  })

  renderStats()
}

// --- Actions ---

// ⚠️ Cible exercice étape ⓪ : pas de validation (titre vide accepté)
function addTask() {
  const input    = document.getElementById('task-input')
  const priority = document.getElementById('priority-select').value
  const errorEl  = document.getElementById('form-error')

  errorEl.textContent = ''

  const task = {
    id:        generateId(),
    title:     input.value,
    priority,
    done:      false,
    createdAt: new Date().toISOString(),
  }

  tasks.unshift(task)
  storage.save(tasks)
  input.value = ''
  renderList()
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  storage.save(tasks)
  renderList()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  storage.save(tasks)
  renderList()
}

// --- Init ---

document.getElementById('add-btn').addEventListener('click', addTask)

document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask()
})

initFilters(filter => {
  currentFilter = filter
  renderList()
})

// --- Navigation entre pages ---

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav__link')
  const pages = {
    tasks: document.getElementById('page-tasks'),
    projects: document.getElementById('page-projects'),
    dashboard: document.getElementById('page-dashboard'),
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.page

      navLinks.forEach(l => l.classList.remove('nav__link--active'))
      link.classList.add('nav__link--active')

      Object.keys(pages).forEach(key => {
        pages[key].hidden = key !== target
      })

      if (target === 'projects') projectsPage.init()
      if (target === 'dashboard') dashboardPage.init()

      analytics.track('page_navigate', { page: target })
    })
  })
}

initNavigation()
renderList()
