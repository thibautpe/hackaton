// src/components/taskCard.js — Rendu d'une carte tâche

function createTaskCard(task, { onToggle, onDelete }) {
  const card = document.createElement('article')
  card.className = `task-card${task.done ? ' task-card--done' : ''}`
  card.dataset.id = task.id

  card.innerHTML = `
    <input
      type="checkbox"
      class="task-card__check"
      aria-label="Marquer comme terminée"
      ${task.done ? 'checked' : ''}
    />
    <span class="task-card__title">${sanitize(task.title)}</span>
    <span class="task-card__badge badge--${task.priority}">
      ${PRIORITY_LABELS[task.priority]}
    </span>
    <span class="task-card__date">${formatDate(task.createdAt)}</span>
    <button class="btn btn--danger" aria-label="Supprimer la tâche">×</button>
  `

  card.querySelector('.task-card__check').addEventListener('change', () => onToggle(task.id))
  card.querySelector('.btn--danger').addEventListener('click', () => onDelete(task.id))

  return card
}
