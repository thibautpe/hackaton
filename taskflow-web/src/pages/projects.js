// src/pages/projects.js — Gestion des projets
// Permet de regrouper les tâches par projet, avec couleur et description

const PROJECT_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d']

const projectsPage = {

  projects: [],

  init() {
    this.projects = projectStorage.load()
    this.renderProjectList()
    this.bindEvents()
  },

  bindEvents() {
    const addBtn = document.getElementById('add-project-btn')
    if (addBtn) addBtn.addEventListener('click', () => this.createProject())

    const input = document.getElementById('project-name-input')
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.createProject()
      })
    }
  },

  createProject() {
    const input = document.getElementById('project-name-input')
    const colorPicker = document.getElementById('project-color-picker')
    const name = input.value.trim()

    if (!name) {
      this.showError('Le nom du projet est requis')
      return
    }
    if (name.length > 50) {
      this.showError('Le nom ne peut pas dépasser 50 caractères')
      return
    }
    if (this.projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      this.showError('Un projet avec ce nom existe déjà')
      return
    }

    const project = {
      id: generateId(),
      name,
      color: colorPicker ? colorPicker.value : PROJECT_COLORS[this.projects.length % PROJECT_COLORS.length],
      description: '',
      createdAt: new Date().toISOString(),
      archived: false,
    }

    this.projects.push(project)
    projectStorage.save(this.projects)
    input.value = ''
    this.renderProjectList()
    this.clearError()
  },

  deleteProject(id) {
    const taskCount = this.getTaskCountForProject(id)
    if (taskCount > 0) {
      const confirmed = confirm(`Ce projet contient ${taskCount} tâche(s). Les supprimer aussi ?`)
      if (!confirmed) return
      this.deleteTasksForProject(id)
    }
    this.projects = this.projects.filter(p => p.id !== id)
    projectStorage.save(this.projects)
    this.renderProjectList()
  },

  archiveProject(id) {
    this.projects = this.projects.map(p =>
      p.id === id ? { ...p, archived: !p.archived } : p
    )
    projectStorage.save(this.projects)
    this.renderProjectList()
  },

  renameProject(id, newName) {
    if (!newName || newName.trim().length === 0) return
    this.projects = this.projects.map(p =>
      p.id === id ? { ...p, name: newName.trim() } : p
    )
    projectStorage.save(this.projects)
    this.renderProjectList()
  },

  updateProjectDescription(id, description) {
    this.projects = this.projects.map(p =>
      p.id === id ? { ...p, description } : p
    )
    projectStorage.save(this.projects)
  },

  getTaskCountForProject(projectId) {
    const tasks = storage.load()
    return tasks.filter(t => t.projectId === projectId).length
  },

  deleteTasksForProject(projectId) {
    let tasks = storage.load()
    tasks = tasks.filter(t => t.projectId !== projectId)
    storage.save(tasks)
  },

  getActiveProjects() {
    return this.projects.filter(p => !p.archived)
  },

  getArchivedProjects() {
    return this.projects.filter(p => p.archived)
  },

  renderProjectList() {
    const container = document.getElementById('project-list')
    if (!container) return

    container.innerHTML = ''

    const active = this.getActiveProjects()
    const archived = this.getArchivedProjects()

    if (active.length === 0 && archived.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucun projet. Créez-en un pour organiser vos tâches.</p>'
      return
    }

    active.forEach(project => {
      container.appendChild(this.createProjectCard(project))
    })

    if (archived.length > 0) {
      const divider = document.createElement('div')
      divider.className = 'project-divider'
      divider.textContent = `${archived.length} projet(s) archivé(s)`
      container.appendChild(divider)
      archived.forEach(project => {
        container.appendChild(this.createProjectCard(project))
      })
    }
  },

  createProjectCard(project) {
    const card = document.createElement('div')
    card.className = `project-card${project.archived ? ' project-card--archived' : ''}`
    card.style.borderLeftColor = project.color
    card.dataset.id = project.id

    const taskCount = this.getTaskCountForProject(project.id)

    card.innerHTML = `
      <div class="project-card__header">
        <span class="project-card__color" style="background:${project.color}"></span>
        <span class="project-card__name">${sanitize(project.name)}</span>
        <span class="project-card__count">${taskCount} tâche${taskCount > 1 ? 's' : ''}</span>
      </div>
      <p class="project-card__description">${sanitize(project.description || 'Pas de description')}</p>
      <div class="project-card__actions">
        <button class="btn btn--ghost btn--sm" data-action="archive">${project.archived ? 'Désarchiver' : 'Archiver'}</button>
        <button class="btn btn--danger btn--sm" data-action="delete">Supprimer</button>
      </div>
    `

    card.querySelector('[data-action="archive"]').addEventListener('click', () => this.archiveProject(project.id))
    card.querySelector('[data-action="delete"]').addEventListener('click', () => this.deleteProject(project.id))

    return card
  },

  showError(message) {
    const errorEl = document.getElementById('project-form-error')
    if (errorEl) errorEl.textContent = message
  },

  clearError() {
    const errorEl = document.getElementById('project-form-error')
    if (errorEl) errorEl.textContent = ''
  },
}
