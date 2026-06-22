# 🎙️ Guide présentateur — Hackaton optimisation tokens Copilot
> Durée : 80 min · Public : mixte · Outils : VS Code + GitHub Copilot (payant)
> Projet : **taskflow-web** — HTML/CSS/JS vanilla, zéro install

---

## Le projet de référence

**`taskflow-web`** — une todo-list enrichie en HTML/CSS/JavaScript pur, avec
plusieurs pages (tâches, projets, dashboard) et un workspace volontairement
chargé en "bruit" réaliste pour rendre les écarts mesurables.

```
taskflow-web/
├── index.html                         # 3 pages : tâches / projets / dashboard
├── src/                                # ~2000 lignes de code source
│   ├── app.js                         # Logique principale + navigation
│   ├── pages/
│   │   ├── projects.js                # Gestion des projets (CRUD complet)
│   │   └── dashboard.js               # Stats, graphiques, activité récente
│   ├── components/
│   │   ├── taskCard.js, filters.js    # Composants de base
│   │   └── modal.js, toast.js,        # Composants UI additionnels
│   │       dropdown.js, datePicker.js
│   ├── utils/
│   │   ├── storage.js, projectStorage.js
│   │   ├── helpers.js, validators.js
│   │   └── analytics.js               # Tracking d'événements local
│   ├── vendor/                        # 2 libs tierces vendorisées (~300 lignes)
│   │   ├── date-utils.lib.js
│   │   └── mini-validate.lib.js
│   └── styles/                        # 4 fichiers CSS (main, components, pages, widgets)
├── dist/                              # ⚠️ 20 fichiers de build factices
├── logs/                              # ⚠️ 8 fichiers de logs serveur
├── .archive/old-versions/             # ⚠️ ancien code v1 (jamais utilisé)
├── build-cache/                       # ⚠️ cache technique (manifest, eslintcache)
├── docs/ARCHITECTURE.md               # Doc technique verbeuse (~150 lignes)
└── .github/                           # Stack complet : instructions, prompts,
                                        # agents, skills, hooks
```

**Pourquoi ce volume est nécessaire :** avec un projet de 10 fichiers et 500 lignes,
les écarts avant/après optimisation sont de quelques centaines de tokens — invisibles
pour le public. Avec ~2000 lignes de vrai code + 35 fichiers de bruit (`dist/`, `logs/`,
`.archive/`, `build-cache/`), les écarts deviennent significatifs et bien visibles
dans le Debug View.

> **Zéro install.** Double-clic sur `index.html` → l'app s'ouvre dans le navigateur.

---

## Préparation avant l'atelier

- [ ] VS Code + Copilot connecté sur chaque machine
- [ ] Dossier `taskflow-web` distribué (zip ou clé USB)
- [ ] Dossier `dist/` simulé créé (20 fichiers factices pour grossir le contexte) :
  ```bash
  mkdir dist && for i in $(seq 1 20); do echo "compiled" > dist/bundle.$i.js; done
  ```
- [ ] Debug View ouvert : `...` dans le panneau Chat → **Show Chat Debug View**
- [ ] **Fichier CSV** `mesures_hackaton.csv` ouvert dans Excel/LibreOffice/VS Code
  - Chaque équipe a ses propres lignes (A, B, C…)
  - Colonnes : `prompt_tokens` `cached_tokens` `completion_tokens` `AIC` `nb_tours`

---

## Vue d'ensemble — 80 min

| # | Étape | Durée | Levier |
|---|---|---|---|
| 0 | Baseline | 0–10 min | Mesure de référence |
| 1 | Contexte | 10–20 min | `.gitignore` + `files.exclude` |
| 2 | Instructions | 20–32 min | `copilot-instructions.md` |
| **3** | **Skills & agents** | **32–50 min** | **Skills custom + mode agent** |
| 4 | Prompt | 50–60 min | Structure + contraintes |
| 5 | Cache & modèle | 60–68 min | Cache hit + choix modèle |
| Bonus | Ask/Edit/Agent | si temps dispo | Bon mode pour la bonne tâche |
| 6 | Débrief | 68–80 min | Synthèse collective |

> ⚠️ L'étape Bonus est **optionnelle** — à n'activer que si vous avez de l'avance sur
> le timing. Ne pas la faire au détriment du débrief, qui reste la partie la plus
> structurante de l'atelier.

---

## ⚠️ Fiabilité attendue par levier — à lire avant l'atelier

Le projet `taskflow-web` (~2000 lignes) a été dimensionné pour rendre la plupart des
leviers visibles, mais tous ne donneront pas un écart aussi net. À connaître avant de
se lancer, pour ne pas être pris de court en live et pour cadrer les attentes des
participants dès le départ :

| Levier | Fiabilité de la démo sur ce projet |
|---|---|
| `.gitignore` + `files.exclude` (étape 1) | ✅ Solide — `dist/`, `logs/`, `.archive/` donnent du vrai bruit à exclure |
| `#codebase` vs `#file:` (étape 1bis) | ⚠️ Nécessite une question multi-fichiers (fournie ci-dessous) sinon écart faible — le projet est trop petit pour que `#codebase` soit pénalisant sur une question mono-fichier |
| `copilot-instructions.md` court vs long (étape 2) | ✅ Solide — assez de conventions réelles pour qu'un fichier verbeux soit crédible |
| Skills en chat (étape 3A/3B) | ✅ Solide — patterns répétitifs (composants, storage) bien présents |
| Mode agent guidé vs nu (étape 3C/3D) | ⚠️ Écart probablement plus modeste qu'sur un vrai gros projet d'entreprise — le repo est trop compact pour qu'un agent "se perde" beaucoup |
| Prompt structuré vs vague (étape 4) | ✅ Solide — mécanisme indépendant de la taille du projet |
| Cache hit (étape 5) | ✅ Solide — mécanisme indépendant du projet |
| Auto Mode (étape 5) | ⚠️ Le choix de modèle fait par Auto reste une boîte noire — seul le delta de coût est observable, pas le "pourquoi" |
| Bonus Ask/Edit/Agent | ✅ Solide — l'écart de comportement entre modes est indépendant de la taille du repo |

**Message à passer aux équipes en kick-off :** un écart faible ou nul sur un levier
est aussi un résultat valable à discuter au débrief — pas un échec de la démo. Le
but est de mesurer honnêtement, pas de confirmer une hypothèse à tout prix.

---

## ⏱ 0–10 min — Kick-off & baseline

**Ce que vous dites :**
> "Avant d'optimiser, on mesure. Le Debug View est notre cockpit.
> On note les chiffres de départ — tout le reste se compare à ça."

**Actions :**
1. Ouvrir `src/app.js` dans l'éditeur
2. Envoyer ce prompt :
   ```
   In app.js, add validation to the addTask function:
   show an error if the title is empty or shorter than 3 characters.
   Update the #form-error element with the message.
   ```
3. Lire dans le Debug View : `prompt_tokens`, `cached_tokens`, `completion_tokens`, `AIC`
4. Saisir dans le CSV — lignes **Étape 0 Baseline**

---

## ⏱ 10–20 min — Étape 1 : Contexte

**Ce que vous dites :**
> "Idée reçue à vérifier ensemble, pas à prendre pour acquis : on dit souvent
> que Copilot 'colle tout le workspace dans le prompt'. La doc officielle dit
> autre chose — qu'il indexe et cherche à la demande (sémantique + grep), plutôt
> que de tout charger en brut.
>
> On ne va pas se contenter de l'affirmer : on va ouvrir le Debug View AVANT
> de toucher au `.gitignore`, et regarder concrètement ce qui s'y trouve."

**Avant de modifier quoi que ce soit — observer le Debug View en mode agent :**

1. Basculer en mode **Agent** (sélecteur en haut du chat)
2. Lancer une requête qui force l'exploration : `Add a "mark all as done" button to the taskflow app.`
3. Dans le Debug View, repérer la séquence d'appels d'outils (`read_file`, `search`, `grep`, etc.)
4. **Noter précisément :**
   - Est-ce que `dist/`, `.archive/`, ou `logs/` apparaissent dans un appel `read_file` ou dans des résultats de `search` ?
   - Si oui : combien de tokens représente cette lecture inutile ? (visible dans `usage` de ce tool call précis)
   - Si non : le filtrage sémantique a-t-il déjà évité le bruit sans configuration manuelle ?

> ⚠️ **Honnêteté pédagogique :** le résultat n'est pas garanti dans un sens ou l'autre.
> Il est possible que l'indexation actuelle évite déjà très bien ce bruit, auquel cas
> le gain de cette étape sera faible. C'est une vraie observation, pas un résultat
> scripté — dites-le aux participants. L'objectif est de **mesurer**, pas de confirmer
> une hypothèse à tout prix.

**Actions (après l'observation) :**
1. Fermer tous les onglets sauf `src/app.js`
   → *Ça, c'est documenté et garanti : le fichier actif et les onglets ouverts
   sont systématiquement inclus dans le contexte, indépendamment de l'indexation.*
2. Créer `.gitignore` :
   ```
   dist/
   node_modules/
   coverage/
   logs/
   build-cache/
   .archive/
   *.log
   .env
   ```
3. VS Code `settings.json` :
   ```json
   "files.exclude": {
     "**/dist": true,
     "**/logs": true,
     "**/build-cache": true,
     "**/.archive": true
   }
   ```
4. Relancer le **même prompt qu'à l'observation initiale** (le bouton "mark all as done")
5. Comparer dans le Debug View : même séquence de tool calls ? Moins de lectures ?

**Ce qu'on mesure, avec preuve à l'écran :**
- Nombre de tool calls de type `read_file`/`search` avant vs après (compter à la main dans le Debug View)
- `prompt_tokens` avant vs après
- `AIC` avant vs après

**Ne pas annoncer de pourcentage à l'avance.** Laisser chaque équipe constater son propre
delta dans le CSV — certaines verront un effet net, d'autres un effet faible. Les deux
résultats sont pédagogiquement valables et donnent matière à débat au débrief.

### 1bis — Scope explicite vs recherche large (5 min, dans le même créneau)

**Ce que vous dites :**
> "Dernier point sur le contexte, et probablement le plus simple à retenir : dire
> précisément à Copilot où chercher, plutôt que le laisser chercher partout. On va
> comparer les deux sur la même question."

> ⚠️ **Point d'attention avant de lancer ce test :** sur un projet de la taille de
> `taskflow-web` (~2000 lignes), une question dont la réponse tient dans un seul
> fichier peut donner un écart faible ou nul entre scope large et scope étroit —
> `#codebase` trouve quasi instantanément le bon fichier sur un repo aussi petit.
> Ce levier brille surtout sur de gros monorepos. Pour rendre l'écart visible ici,
> **on force volontairement une question qui croise plusieurs fichiers.**

**A. Scope large** — ouvrir le chat, demander :
```
Why doesn't the task counter on the dashboard update when I mark a task as done?
Look at #codebase
```
*(cette question touche réellement 3 fichiers : `app.js` pour la mutation, `storage.js`
pour la persistance, `dashboard.js` pour le recalcul de l'affichage — donc `#codebase`
a vraiment de quoi explorer)*

📝 Noter `prompt_tokens`, `nb_tool_calls`, `AIC`

**B. Scope étroit** — même question, mais cibler explicitement les 3 fichiers concernés :
```
Why doesn't the task counter on the dashboard update when I mark a task as done?
#file:src/app.js #file:src/utils/storage.js #file:src/pages/dashboard.js
```
📝 Noter `prompt_tokens`, `nb_tool_calls`, `AIC` · comparer avec A

**Résultat attendu :** sur cette question précise, le scope large (`#codebase`) doit
explorer plus largement pour identifier les 3 fichiers pertinents, alors que le scope
étroit les donne directement — l'écart en tool calls devrait être net. Sur une question
mono-fichier en revanche, ne pas s'attendre à un écart marqué sur un projet de cette taille.

> **Règle à retenir :** `#codebase` seulement quand un scope plus étroit a déjà
> échoué ou quand on ne sait pas où chercher. Dès qu'on connaît les fichiers
> concernés, les citer explicitement.

---

## ⏱ 20–32 min — Étape 2 : `copilot-instructions.md`

**Ce que vous dites :**
> "Ce fichier est injecté dans chaque requête. C'est un coût fixe par prompt,
> pour tous les devs, à chaque interaction de la journée."

**Phase A — Fichier verbeux** (créer `.github/copilot-instructions.md`) :
```markdown
# TaskFlow Web — Instructions pour GitHub Copilot

## Présentation du projet
TaskFlow est une application web de gestion de tâches développée en HTML, CSS et
JavaScript vanilla (sans framework). Elle permet d'ajouter, filtrer, compléter et
supprimer des tâches. Les tâches sont persistées dans le localStorage du navigateur.

## Conventions de code
- Toujours utiliser const et let, jamais var
- Toujours utiliser des fonctions nommées, pas de fonctions anonymes inline
- Toujours utiliser la fonction sanitize() pour afficher du texte utilisateur
- Toujours appeler storage.save() après chaque modification du tableau tasks
- Toujours appeler renderList() après chaque modification du tableau tasks
- Les identifiants HTML utilisent des tirets (kebab-case)
- Ne jamais utiliser innerHTML avec du contenu non sanitizé
- Les messages d'erreur utilisent l'élément #form-error
- Les classes CSS suivent la convention BEM
- Ne jamais utiliser de styles inline dans le JavaScript
- Ne jamais modifier directement le DOM sans passer par renderList()
- Utiliser data-id pour stocker l'identifiant des tâches dans le DOM
```

→ Relancer le prompt → CSV lignes **Étape 2A**

**Phase B — Fichier court** (remplacer par) :
```markdown
## TaskFlow — Copilot rules
- Always sanitize() user input before DOM insertion
- Always call storage.save() AND renderList() after mutating tasks[]
- Error messages → #form-error element only
- CSS classes follow BEM, no inline styles from JS
- Do NOT touch: dist/, src/styles/main.css (design system)
```

→ Relancer → CSV lignes **Étape 2B**

**Point à calculer en direct :**
> "Différence en tokens × 5 devs × 30 prompts/jour = X tokens/jour économisés.
> Sur un mois, c'est souvent plusieurs euros sans rien changer au code."

---

## ⏱ 32–50 min — Étape 3 : Skills & mode agent ⭐ étape clé

**Ce que vous dites :**
> "On arrive à l'étape la plus impactante. Un skill, c'est du contexte pré-emballé.
> Le mode agent, c'est Copilot qui agit sur plusieurs fichiers en autonomie.
> Les deux ensemble : moins de tours, moins de tokens, meilleure qualité."

### 3A — Skill `add-feature` (chat normal)

**Sans skill** — fermer tous les fichiers, envoyer :
```
Add a feature: the user can edit a task title by double-clicking on it.
```
→ Compter les tours · Saisir CSV **Étape 3A**

**Créer `.github/copilot/skills/add-feature.md`** :
```markdown
---
name: add-feature
description: Add an interactive UI feature to taskflow-web
---

# Stack
Vanilla HTML/CSS/JS — no framework, no bundler, no npm.
Files load via <script> tags declared at the bottom of index.html.

# Rules
- New UI elements → index.html + components.css (BEM classes)
- New logic → app.js, always call renderList() after state change
- New reusable component → src/components/, add <script> in index.html
- Always sanitize() any user input before DOM insertion
- Always storage.save(tasks) after mutating tasks[]
- No inline styles from JS, no var, no anonymous functions

# Out of scope
- No npm, no import/export, no TypeScript, no JSX, no framework
```

**Avec skill** :
```
@add-feature Edit a task title by double-clicking on it.
```
→ Saisir CSV **Étape 3B** · Comparer nb_tours et AIC

---

### 3B — Mode agent (multi-fichiers) ⭐ nouveauté

**Ce que vous dites :**
> "Le mode agent, c'est Copilot qui ouvre les fichiers, lit, modifie,
> et enchaîne les actions sans que vous interveniez. Très puissant —
> mais aussi très coûteux si le contexte n'est pas cadré."

**Activer le mode agent :** sélecteur en haut du chat → **Agent**

**Sans skill dédié** — fermer tous les fichiers, envoyer :
```
Add a "mark all as done" button to the taskflow app.
```
→ Observer : Copilot ouvre des fichiers, propose des modifications
→ Saisir CSV **Étape 3C** : noter combien de fichiers touchés, nb de tool calls, AIC total

**Créer `.github/copilot/skills/agent-task.md`** :
```markdown
---
name: agent-task
description: Perform a multi-file change on taskflow-web in agent mode
---

# Before starting
1. Read index.html to understand the current UI structure
2. Read src/app.js to understand state management (tasks[], renderList)
3. Read src/styles/components.css to understand existing CSS patterns

# Change checklist
- [ ] UI change → index.html (add element) + components.css (add BEM class)
- [ ] Logic change → app.js (add function + wire event listener)
- [ ] State change → always call storage.save(tasks) + renderList()
- [ ] Never modify: dist/, src/styles/main.css, src/utils/helpers.js

# Output format
List each file you will modify before making any change.
Make one file at a time. Confirm each change before moving to the next.
```

**Avec skill** :
```
@agent-task Add a "mark all as done" button.
```
→ Saisir CSV **Étape 3D** · Comparer : nb de tool calls, AIC total, qualité du résultat

**Ce qu'on observe :**
- Sans skill : l'agent explore tout le workspace avant d'agir (coûteux)
- Avec skill : l'agent sait exactement où lire et où écrire (efficace)
- Le `# Before starting` guide l'ordre des lectures → moins d'appels d'outils redondants
- Le `# Output format` évite les modifications surprises hors périmètre

**Point pédagogique clé :**
> "En mode agent, chaque lecture de fichier est un tool call facturé.
> Un agent mal guidé peut lire 10 fichiers pour n'en modifier qu'un.
> Un bon skill d'agent réduit ça à 3 lectures ciblées."

---

## ⏱ 50–60 min — Étape 4 : Qualité du prompt

**Ce que vous dites :**
> "Même hors mode agent : nb_tours × tokens/tour = coût réel de la session.
> Un prompt flou se paye en allers-retours."

**Prompt vague (A) :**
```
Improve the app
```
→ Saisir CSV **Étape 4A**

**Prompt structuré (B) :**
```
In src/utils/storage.js, add error handling to the load() function:
- Catch JSON.parse errors → return []
- Catch localStorage access errors (private browsing) → return []
- Log each error with console.error and a descriptive message
Code only, no explanation.
```
→ Saisir CSV **Étape 4B**

**Variante (C) :** Retirer `Code only, no explanation.` → observer `completion_tokens`

---

## ⏱ 60–68 min — Étape 5 : Cache & modèle

**Cache hit :** relancer le prompt baseline **sans rien changer**
→ `cached_tokens` ≈ `prompt_tokens` → économie ~90% sur les tokens d'entrée

**Comparer les modèles** sur la même tâche :

| Modèle | AIC | Qualité |
|---|---|---|
| Claude Sonnet 4.6 | | |
| GPT-4o | | |
| GPT-4o-mini | | |
| Auto Mode | | |

**Auto Mode :** sélecteur de modèle en haut du chat → choisir **Auto**.
> "Auto Mode laisse Copilot choisir le modèle le plus adapté à chaque tour, avec
> une remise documentée d'environ 10% sur le multiplicateur de tokens. C'est en train
> de devenir la politique par défaut dans pas mal d'organisations — un seul réglage,
> à faire une fois, qui s'applique ensuite à toutes les requêtes sans y repenser."

Relancer le prompt baseline en Auto Mode → comparer `AIC` avec le modèle fixe utilisé
jusqu'ici.

**Utility model** (settings.json) :
```json
"chat.utilityModel": "gpt-4o-mini"
```

---

## ⏱ BONUS (si le timing le permet) — Le bon mode pour la bonne tâche

**Ce que vous dites :**
> "Dernier levier, souvent oublié : le choix du mode lui-même, AVANT même d'écrire
> le prompt. Ask, Edit, Agent — chacun a un coût et un usage différent. Utiliser
> Agent pour une question simple, c'est comme prendre un camion pour aller chercher
> le pain."

**Activer cette étape seulement si vous avez de l'avance sur le timing** — sinon
passer directement au débrief avec les 5 étapes précédentes, qui suffisent largement.

**A. Mode Agent sur une tâche simple (mauvais usage) :**

Basculer en mode **Agent**, demander :
```
What does the renderList function in app.js do?
```
→ Noter `AIC` et `nb_tool_calls` : l'agent va probablement lire plusieurs fichiers
pour répondre à une question qui ne nécessite qu'une lecture.

**B. Même question en mode Ask :**

Basculer en mode **Ask**, même question.
→ Comparer `AIC` et `nb_tool_calls` — généralement net en faveur de Ask pour ce
type de question.

**C. Inverse : mode Ask sur une tâche multi-fichiers (mauvais usage) :**

Rester en mode **Ask**, demander :
```
Add a button to mark all tasks as done, with the logic in app.js and the
button styled in components.css
```
→ Observer : Ask ne peut pas éditer plusieurs fichiers à la place de l'utilisateur,
donc soit il refuse, soit il faut copier-coller manuellement son code dans chaque
fichier — un coût caché en temps humain que le Debug View ne mesure pas mais qui
compte tout autant.

**D. Même tâche en mode Agent (bon usage) :**

Basculer en mode **Agent**, même prompt.
→ Comparer : l'agent édite directement les deux fichiers concernés.

**Point pédagogique :**
> "Ask = bon pour comprendre, expliquer, réviser un point précis sans toucher au code.
> Agent = bon pour les tâches multi-fichiers ou qui nécessitent d'explorer le repo.
> Le mauvais choix de mode ne se voit pas toujours dans le Debug View — parfois
> c'est juste vous qui perdez du temps à faire à la main ce que le bon mode aurait fait."

📝 **CSV — Étape Bonus :**
```
Agent sur question simple : AIC = ___   nb_tool_calls = ___
Ask sur question simple :   AIC = ___   nb_tool_calls = ___
Ask sur tâche multi-fichiers : a fonctionné directement ? oui / non
Agent sur tâche multi-fichiers : AIC = ___   fichiers édités correctement ? oui / non
```

---

## ⏱ 68–80 min — Débrief collectif

**Construire le classement avec les chiffres réels du CSV :**

| Levier | Effort | Impact tokens | Impact itérations |
|---|---|---|---|
| Agent + skill dédié | Moyen | ★★★★★ | ★★★★★ |
| Skill chat (add-feature) | Faible | ★★★★☆ | ★★★★★ |
| Prompt structuré | Nul | ★★★★☆ | ★★★★☆ |
| copilot-instructions court | Faible | ★★★★☆ | ★★★☆☆ |
| Cache hit | Nul | ★★★★☆ | = |
| .gitignore + files.exclude | Faible | ★★★☆☆ | = |
| Choix du modèle | Faible | ★★★☆☆ | = |
| Code only, no explanation | Nul | ★★★☆☆ | = |

**Questions à poser :**
1. Quelle étape vous a le plus surpris ?
2. Le mode agent coûte-t-il toujours plus cher ? (non — avec un bon skill, il peut être plus économique qu'une session de chat en 5 tours)
3. Premier changement dans votre vrai projet demain ?

**Message de clôture :**
> "L'insight central : le coût réel d'une session, c'est nb_tours × tokens/tour.
> Réduire les tours via les skills et les agents bien guidés est toujours
> plus impactant que compresser les tokens d'un prompt.
> Un agent avec un bon skill fait une tâche multi-fichiers en 1 tour
> là où un chat sans skill en prend 5."

---

## Chiffres de référence

| Levier | Effet attendu | Statut |
|---|---|---|
| .gitignore + files.exclude | Réduit les tool calls de lecture inutile, effet sur prompt_tokens variable | ⚠️ À mesurer en direct, pas de chiffre garanti (voir note) |
| Fermer les onglets | Réduit prompt_tokens directement | ✅ Documenté (fichier actif toujours inclus) |
| copilot-instructions court vs long | Réduit prompt_tokens (fichier injecté à chaque requête) | ✅ Documenté |
| Cache hit | Tokens en cache facturés ~10% du prix normal | ✅ Documenté (mécanisme de cache standard) |
| Skill chat (add-feature) | Réduit le nombre de tours de clarification | ⚠️ Observé empiriquement, à mesurer par équipe |
| Agent + skill vs agent nu | Réduit les tool calls d'exploration | ⚠️ Observé empiriquement, à mesurer par équipe |
| Prompt structuré vs vague | Réduit le nombre de tours | ⚠️ Observé empiriquement, à mesurer par équipe |
| Code only, no explanation | Réduit completion_tokens (sortie plus courte) | ✅ Mécanique directe (moins de texte généré) |
| Bon mode (Ask/Edit/Agent) pour la tâche | Évite le coût d'un agent sur une question simple, évite le copier-coller manuel d'un Ask sur une tâche multi-fichiers | ⚠️ Observé empiriquement, étape bonus optionnelle |

> **Sur `.gitignore` + `files.exclude` :** ne pas annoncer de pourcentage à l'avance
> aux participants. L'effet réel dépend de la qualité de l'indexation sémantique au
> moment du test — qui peut déjà filtrer une partie du bruit sans configuration
> manuelle. Le protocole d'observation (étape ① ci-dessus) sert justement à mesurer
> ça en direct plutôt qu'à confirmer un chiffre présupposé. Si le delta est faible,
> c'est aussi un résultat intéressant à discuter au débrief : "l'indexation Copilot
> est-elle déjà assez intelligente pour ignorer ce bruit seule ?"
>
> **Sur les lignes marquées ⚠️ :** ces effets sont plausibles et généralement
> rapportés par la communauté, mais ne sont pas mesurés de façon contrôlée dans ce
> document. Les chiffres précis de votre atelier viendront du CSV rempli en direct —
> c'est l'intérêt du format hackathon plutôt qu'un cours théorique.
