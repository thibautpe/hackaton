# Comment fonctionne TaskFlow Web

> Documentation du fonctionnement de l'application utilisée pour le hackaton.
> Application 100% HTML/CSS/JavaScript vanilla — aucun framework, aucun build, aucune dépendance npm.

---

## Vue d'ensemble

TaskFlow est une todo-list avec trois pages : **Tâches**, **Projets**, **Tableau de bord**.
Tout fonctionne dans le navigateur, sans serveur — les données sont stockées localement
via `localStorage`.

**Pour la lancer :** double-clic sur `index.html`. Aucune installation requise.

---

## 1. Comment les pages sont chargées

Il n'y a **qu'une seule page HTML** (`index.html`). Les trois "pages" (Tâches, Projets,
Dashboard) sont en réalité trois blocs `<div>` qui existent tous en même temps dans le
DOM — on les affiche ou on les cache avec l'attribut HTML `hidden` :

```html
<div id="page-tasks" class="page">...</div>
<div id="page-projects" class="page" hidden>...</div>
<div id="page-dashboard" class="page" hidden>...</div>
```

Quand on clique sur un lien de navigation (`initNavigation()` dans `app.js`), le script :
1. Retire la classe active de tous les liens, l'ajoute au lien cliqué
2. Passe `hidden = true` sur toutes les pages, puis `hidden = false` sur la page ciblée
3. Si on arrive sur Projets ou Dashboard, appelle leur fonction `init()` pour qu'elles
   se recalculent à partir des données actuelles

C'est une navigation **sans rechargement de page** (single-page app artisanale, sans
routeur ni framework).

---

## 2. Comment les scripts sont chargés

Pas de `import`/`export`, pas de bundler. Tous les fichiers JS sont chargés un par un
via des balises `<script>` à la fin de `index.html`, **dans un ordre précis** :

```html
<script src="src/vendor/date-utils.lib.js"></script>      <!-- libs tierces d'abord -->
<script src="src/vendor/mini-validate.lib.js"></script>
<script src="src/utils/storage.js"></script>                <!-- puis les utils -->
<script src="src/utils/projectStorage.js"></script>
<script src="src/utils/helpers.js"></script>
<script src="src/utils/validators.js"></script>
<script src="src/utils/analytics.js"></script>
<script src="src/components/taskCard.js"></script>          <!-- puis les composants -->
<script src="src/components/filters.js"></script>
<script src="src/components/modal.js"></script>
<script src="src/components/toast.js"></script>
<script src="src/components/dropdown.js"></script>
<script src="src/components/datePicker.js"></script>
<script src="src/pages/projects.js"></script>                <!-- puis les pages -->
<script src="src/pages/dashboard.js"></script>
<script src="src/app.js"></script>                            <!-- app.js en dernier -->
```

**Pourquoi cet ordre est important :** chaque fichier déclare des objets ou fonctions
globales (`storage`, `sanitize`, `createTaskCard`, `projectsPage`...) directement dans
l'espace global du navigateur (`window`). Un fichier qui utilise `storage.load()` doit
être chargé **après** `storage.js`, sinon erreur `storage is not defined`. C'est `app.js`
qui orchestre tout, donc il doit être chargé en tout dernier.

---

## 3. Où vivent les données

Toutes les données sont stockées dans le `localStorage` du navigateur, sous forme de
texte JSON, avec 3 clés distinctes :

| Clé localStorage | Contenu | Géré par |
|---|---|---|
| `taskflow_tasks` | Tableau des tâches | `src/utils/storage.js` |
| `taskflow_projects` | Tableau des projets | `src/utils/projectStorage.js` |
| `taskflow_analytics_events` | Événements de tracking (max 500) | `src/utils/analytics.js` |

Chaque module suit le même pattern simple :

```js
const storage = {
  load()  { return JSON.parse(localStorage.getItem(KEY)) || [] },
  save(x) { localStorage.setItem(KEY, JSON.stringify(x)) },
}
```

⚠️ **Limite connue :** ces données ne sont visibles que dans **ce navigateur, sur cet
appareil**. Pas de synchronisation, pas de compte utilisateur, pas de backend.

---

## 4. Le flux de données pour une tâche

C'est le cœur de l'application — comprendre ce flux, c'est comprendre 80% du code.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  Formulaire  │ →   │  tasks[]     │ →   │ storage.    │ →   │ render   │
│  (HTML)      │     │ (mémoire JS) │     │  save()     │     │  List()  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────┘
                            ↑                                       │
                            └───────────────────────────────────────┘
                                    (relit l'état à chaque rendu)
```

**Étape par étape (exemple : ajouter une tâche)**

1. L'utilisateur tape un titre et clique sur "Ajouter" → déclenche `addTask()` dans `app.js`
2. `addTask()` crée un objet tâche et l'ajoute en tête du tableau `tasks` (variable globale en mémoire) :
   ```js
   tasks.unshift({ id, title, priority, done: false, createdAt })
   ```
3. `storage.save(tasks)` sérialise tout le tableau en JSON et l'écrit dans `localStorage`
4. `renderList()` est appelé : il vide la liste affichée à l'écran et la reconstruit
   entièrement à partir de `tasks` (pas de mise à jour incrémentale — tout est redessiné)

**Cette règle revient partout dans le code :**
> Toute modification du tableau `tasks` (ou `projects`) doit être suivie de
> `storage.save()` **puis** d'un appel de rendu (`renderList()` ou équivalent).

Si l'un des deux est oublié, soit l'affichage est désynchronisé de l'état réel (oubli
du rendu), soit la donnée se perd au rechargement de la page (oubli de la sauvegarde).
C'est précisément le genre de bug que l'étape "fix-bug" du hackaton fait corriger.

---

## 5. Les composants — comment ils sont construits

Les composants suivent tous le même principe : **une fonction qui retourne un élément
DOM, sans jamais l'insérer elle-même dans la page**. C'est à l'appelant de décider où
le placer.

Exemple avec `createTaskCard()` (dans `src/components/taskCard.js`) :

```js
function createTaskCard(task, { onToggle, onDelete }) {
  const card = document.createElement('article')
  card.innerHTML = `...` // construit le HTML de la carte
  card.querySelector('.task-card__check').addEventListener('change', () => onToggle(task.id))
  return card // ne s'attache pas tout seul au DOM
}
```

`renderList()` dans `app.js` appelle cette fonction pour chaque tâche, puis fait
lui-même `list.appendChild(card)`. Ce découplage permet de réutiliser le même composant
dans différents contextes sans dupliquer la logique d'affichage.

**Les 6 composants disponibles :**

| Fichier | Rôle |
|---|---|
| `taskCard.js` | Affiche une tâche (titre, badge priorité, case à cocher, bouton supprimer) |
| `filters.js` | Gère les 4 boutons de filtre (Toutes / À faire / Terminées / Haute priorité) |
| `modal.js` | Fenêtre modale générique réutilisable (confirmation, formulaire) |
| `toast.js` | Notifications temporaires en bas à droite (succès / erreur / info) |
| `dropdown.js` | Menu déroulant générique |
| `datePicker.js` | Sélecteur de date avec formatage relatif ("Demain", "Il y a 3 jours") |

---

## 6. Sécurité : pourquoi `sanitize()` est partout

Le titre d'une tâche est du texte saisi par l'utilisateur. S'il était inséré tel quel
dans le HTML via `innerHTML`, un titre comme `<img src=x onerror="alert(1)">` exécuterait
du code arbitraire dans la page (faille XSS classique).

`sanitize()` (dans `src/utils/helpers.js`) neutralise ce risque en passant le texte par
le DOM lui-même :

```js
function sanitize(str) {
  const div = document.createElement('div')
  div.textContent = str        // le navigateur échappe automatiquement le texte
  return div.innerHTML          // on récupère la version échappée
}
```

**Règle du projet :** tout texte venant de l'utilisateur doit passer par `sanitize()`
avant d'être inséré dans le DOM via `innerHTML`. C'est la règle n°1 du fichier
`.github/copilot-instructions.md`.

---

## 7. Les deux pages avancées

### Page Projets (`src/pages/projects.js`)

Permet de créer des projets (nom + couleur), d'y rattacher des tâches (via `projectId`
sur chaque tâche), de les archiver ou de les supprimer. La suppression d'un projet
propose de supprimer aussi ses tâches associées (`deleteTasksForProject()`).

### Page Dashboard (`src/pages/dashboard.js`)

Recalcule des statistiques à chaque ouverture, à partir des données actuelles de
`tasks` et `projects` :
- Vue d'ensemble (total, terminées, en cours, taux de complétion)
- Graphique en barres de répartition par priorité
- Avancement par projet
- Liste des tâches en retard (date d'échéance dépassée)
- Activité récente (5 dernières tâches créées)

Aucune donnée n'est stockée spécifiquement pour le dashboard — tout est recalculé à
la volée à partir de `tasks` et `projects`.

---

## 8. Les fichiers "vendor" — à ne pas modifier

`src/vendor/date-utils.lib.js` et `src/vendor/mini-validate.lib.js` simulent des
librairies tierces (style date-fns / mini schema validator), vendorisées dans le
projet plutôt qu'installées via npm — cohérent avec le choix "zéro dépendance".

Ces fichiers ne doivent jamais être modifiés directement : ce sont des "boîtes
noires" utilitaires, au même titre qu'une vraie dépendance externe le serait.

---

## 9. Schéma récapitulatif de l'architecture

```
index.html
  │
  ├── <link> styles (main, components, pages, widgets)
  │
  └── <script> dans l'ordre :
        vendor/*             → libs tierces, aucune dépendance interne
        utils/*               → storage, validation, helpers (dépendent seulement de vendor/)
        components/*          → UI réutilisable (dépendent de utils/)
        pages/*                → projects.js, dashboard.js (dépendent de utils/ + components/)
        app.js                  → orchestrateur final (dépend de tout le reste)

Flux de données :
  Formulaire → fonction d'action (app.js / pages/*.js)
             → mutation du tableau en mémoire (tasks[] / projects[])
             → storage.save() ou projectStorage.save()
             → fonction de rendu (renderList() / dashboardPage.render() / ...)
             → DOM mis à jour
```

---

## 10. Bugs intentionnels (pour les exercices du hackaton)

Trois points sont volontairement incomplets dans le code, pour servir de cibles
d'exercices "fix-bug" :

- **`addTask()` dans `app.js`** : aucune validation du titre — un titre vide est
  accepté tel quel (cible de l'étape baseline du hackaton)
- **`addTask()` dans `app.js`** : `input.value` est assigné directement à `task.title`
  sans passer par `sanitize()`. Si `createTaskCard()` utilise ensuite `innerHTML` pour
  afficher le titre, un titre comme `<img src=x onerror="alert(1)">` exécute du code
  arbitraire — faille XSS classique, en contradiction directe avec la règle n°1 du
  `.github/copilot-instructions.md`. C'est un bug de sécurité réaliste à corriger lors
  de l'étape baseline ou en bonus.
- **`storage.load()` dans `storage.js`** : aucune gestion d'erreur si `localStorage`
  est inaccessible (navigation privée) ou si le JSON stocké est corrompu — un
  `JSON.parse` invalide ferait planter toute l'application au chargement
