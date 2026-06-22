// src/pages/dashboard.js — Tableau de bord avec statistiques

const dashboardPage = {

  init() {
    this.render()
  },

  render() {
    const tasks = storage.load()
    const projects = projectStorage.load()

    this.renderOverview(tasks)
    this.renderPriorityChart(tasks)
    this.renderProjectBreakdown(tasks, projects)
    this.renderRecentActivity(tasks)
    this.renderOverdueTasks(tasks)
  },

  renderOverview(tasks) {
    const total = tasks.length
    const done = tasks.filter(t => t.done).length
    const inProgress = tasks.filter(t => !t.done).length
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

    const container = document.getElementById('dashboard-overview')
    if (!container) return

    container.innerHTML = `
      <div class="stat-card">
        <span class="stat-card__value">${total}</span>
        <span class="stat-card__label">Total des tâches</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">${done}</span>
        <span class="stat-card__label">Terminées</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">${inProgress}</span>
        <span class="stat-card__label">En cours</span>
      </div>
      <div class="stat-card stat-card--highlight">
        <span class="stat-card__value">${completionRate}%</span>
        <span class="stat-card__label">Taux de complétion</span>
      </div>
    `
  },

  renderPriorityChart(tasks) {
    const container = document.getElementById('priority-chart')
    if (!container) return

    const counts = { low: 0, medium: 0, high: 0 }
    tasks.forEach(t => { if (counts[t.priority] !== undefined) counts[t.priority]++ })

    const max = Math.max(counts.low, counts.medium, counts.high, 1)

    container.innerHTML = ['low', 'medium', 'high'].map(priority => {
      const pct = Math.round((counts[priority] / max) * 100)
      return `
        <div class="bar-row">
          <span class="bar-row__label">${PRIORITY_LABELS[priority]}</span>
          <div class="bar-row__track">
            <div class="bar-row__fill bar-row__fill--${priority}" style="width:${pct}%"></div>
          </div>
          <span class="bar-row__value">${counts[priority]}</span>
        </div>
      `
    }).join('')
  },

  renderProjectBreakdown(tasks, projects) {
    const container = document.getElementById('project-breakdown')
    if (!container) return

    if (projects.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucun projet créé</p>'
      return
    }

    container.innerHTML = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id)
      const done = projectTasks.filter(t => t.done).length
      const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0

      return `
        <div class="project-breakdown__row">
          <span class="project-breakdown__color" style="background:${project.color}"></span>
          <span class="project-breakdown__name">${sanitize(project.name)}</span>
          <span class="project-breakdown__progress">${done}/${projectTasks.length} (${pct}%)</span>
        </div>
      `
    }).join('')
  },

  renderRecentActivity(tasks) {
    const container = document.getElementById('recent-activity')
    if (!container) return

    const recent = [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    if (recent.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucune activité récente</p>'
      return
    }

    container.innerHTML = recent.map(task => `
      <div class="activity-row">
        <span class="activity-row__dot activity-row__dot--${task.done ? 'done' : 'pending'}"></span>
        <span class="activity-row__title">${sanitize(task.title)}</span>
        <span class="activity-row__date">${formatDate(task.createdAt)}</span>
      </div>
    `).join('')
  },

  renderOverdueTasks(tasks) {
    const container = document.getElementById('overdue-tasks')
    if (!container) return

    const now = new Date()
    const overdue = tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) < now)

    if (overdue.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucune tâche en retard 🎉</p>'
      return
    }

    container.innerHTML = overdue.map(task => `
      <div class="overdue-row">
        <span class="overdue-row__title">${sanitize(task.title)}</span>
        <span class="overdue-row__date">Échéance : ${formatDate(task.dueDate)}</span>
      </div>
    `).join('')
  },
}
