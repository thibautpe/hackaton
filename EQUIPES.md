# 🛠️ Guide équipe — Hackaton optimisation tokens Copilot
> Durée : 80 min · Projet : `taskflow-web` (HTML / CSS / JavaScript vanilla)
> Mesures → fichier `mesures_hackaton.csv` (ouvrir dans Excel ou VS Code)

**Objectif :** réduire le coût AIC total d'une session de dev en appliquant chaque levier.
Mesurez à chaque étape et saisissez vos chiffres dans le CSV (lignes de votre équipe).

---

## Setup (2 min)

1. Ouvrir VS Code sur le dossier `taskflow-web`
2. Double-clic sur `index.html` → l'app s'ouvre dans le navigateur
3. Activer le **Debug View** :
   → Panneau Chat → `...` (en haut à droite) → **Show Chat Debug View**
4. Ouvrir `mesures_hackaton.csv` dans un second onglet VS Code

**Important — ce workspace contient volontairement du "bruit" réaliste :**
- `dist/` : 20 fichiers de build factices
- `logs/` : 8 fichiers de logs serveur
- `.archive/` : anciennes versions de code (v1, jamais utilisées)
- `build-cache/` : fichiers techniques de cache
- `src/vendor/` : 2 librairies tierces vendorisées (non écrites par l'équipe)

Sans nettoyage, Copilot peut indexer tout ça à chaque requête. C'est exactement
ce qu'on va mesurer à l'étape 1.

**Colonnes à remplir dans le CSV :**

| Colonne | Où le trouver |
|---|---|
| `prompt_tokens` | Debug View → ligne `usage` |
| `cached_tokens` | Debug View → `prompt_tokens_details` |
| `completion_tokens` | Debug View → ligne `usage` |
| `AIC` | Debug View → `copilotUsage` (ex: `0.43 AIC`) |
| `nb_tours` | Compter manuellement les échanges dans le chat |
| `nb_tool_calls` | Debug View → compter les appels `read_file`, `search`, etc. (utile en mode agent) |

---

## ⚠️ À savoir avant de commencer

Le projet est volontairement compact (~2000 lignes) pour rester lisible par toute
l'équipe. Conséquence : certains leviers donneront un écart net, d'autres un écart
plus modeste — et c'est normal, pas un échec de votre manip.

- ✅ **Écart attendu net** : `.gitignore`/`files.exclude`, instructions courtes vs
  longues, skills en chat, prompt structuré, cache hit, comparaison Ask/Edit/Agent
- ⚠️ **Écart possiblement plus faible** : `#codebase` vs `#file:` sur une question
  simple (d'où la question multi-fichiers imposée à l'étape 1bis), mode agent guidé
  vs nu (le repo est trop petit pour qu'un agent "se perde" beaucoup)

**Un delta faible ou nul est une vraie donnée à reporter dans le CSV** — ne cherchez
pas à le forcer, notez-le et on en discute au débrief.

---

## ⓪ Baseline — 0 à 10 min

Ouvrir **`src/app.js`** dans l'éditeur.

Envoyer ce prompt dans Copilot Chat :
```
In app.js, add validation to the addTask function:
show an error if the title is empty or shorter than 3 characters.
Update the #form-error element with the message.
```

📝 **CSV — lignes Équipe X / Étape 0 Baseline :**
```
prompt_tokens = ___  cached_tokens = ___  completion_tokens = ___  AIC = ___  nb_tours = ___
```

> Ces chiffres sont votre référence. Tout le reste se compare à ça.
> Vérifier dans le navigateur : la validation fonctionne-t-elle ? (titre vide → message d'erreur)

---

## ① Contexte — 10 à 20 min

**Objectif :** vérifier par vous-mêmes ce que Copilot charge réellement, avant
de changer quoi que ce soit.

> ⚠️ **Ne pas prendre pour acquis :** on entend souvent que "Copilot colle tout le
> workspace dans le prompt". La doc officielle dit qu'il **indexe** et **recherche
> à la demande** (sémantique + grep) plutôt que de tout charger en brut. On va
> vérifier ça nous-mêmes avec le Debug View, pas le croire sur parole.

### A. Observer AVANT de toucher au `.gitignore`

1. Basculer en mode **Agent** (sélecteur en haut du chat)
2. Lancer ce prompt : `Add a "mark all as done" button to the taskflow app.`
3. Dans le Debug View, repérer chaque appel d'outil (`read_file`, `search`, `grep`...)
4. **Noter dans le CSV :**
   - `dist/`, `.archive/`, ou `logs/` apparaissent-ils dans un de ces appels ? (oui/non)
   - Si oui, combien de tokens cette lecture représente-t-elle ?
   - `nb_tool_calls` total pour cette requête

> Cette observation peut donner un résultat dans un sens ou dans l'autre : peut-être
> que l'indexation évite déjà bien ce bruit, peut-être pas. **Les deux résultats sont
> valables** — l'important est de mesurer, pas de confirmer une hypothèse.

### B. Appliquer les changements

**Fermer tous les onglets VS Code** sauf `src/app.js`
→ *Celui-ci est documenté et garanti : le fichier actif et les onglets ouverts
sont systématiquement inclus dans le contexte, peu importe l'indexation.*

**Créer `.gitignore`** à la racine :
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

**`Ctrl+Shift+P` → "Open User Settings JSON"** — ajouter :
```json
"files.exclude": {
  "**/dist": true,
  "**/logs": true,
  "**/build-cache": true,
  "**/.archive": true
}
```

### C. Relancer EXACTEMENT le même prompt qu'à l'étape A

```
Add a "mark all as done" button to the taskflow app.
```

Comparer dans le Debug View : même séquence de tool calls ? `dist/`/`.archive/`/`logs/`
apparaissent-ils encore dans un appel ?

📝 **CSV — Étape 1 Contexte :**
```
AVANT — prompt_tokens = ___   nb_tool_calls = ___   bruit lu (oui/non) = ___
APRÈS — prompt_tokens = ___   nb_tool_calls = ___   bruit lu (oui/non) = ___
delta prompt_tokens = ____%   delta nb_tool_calls = ____%
```

> **Tip :** `.gitignore` exclut de Git. `files.exclude` exclut de l'index VS Code/Copilot.
> Les deux sont complémentaires, mais ne garantissent pas un delta important — ça
> dépend de ce que votre indexation faisait déjà avant.

### 1bis — Scope explicite vs recherche large (5 min)

Le levier le plus simple à retenir : dire précisément où chercher plutôt que
laisser Copilot chercher partout.

> ⚠️ **Sur un projet de cette taille (~2000 lignes), une question mono-fichier
> peut ne montrer aucun écart** — `#codebase` trouve le bon fichier presque aussi
> vite qu'un scope précis. C'est pour ça qu'on utilise une question qui croise
> vraiment plusieurs fichiers.

**A. Scope large :**
```
Why doesn't the task counter on the dashboard update when I mark a task as done?
Look at #codebase
```
*(cette question touche réellement 3 fichiers : `app.js`, `storage.js`, `dashboard.js`)*

📝 `prompt_tokens` = ___ · `nb_tool_calls` = ___ · `AIC` = ___

**B. Scope étroit — même question, fichiers ciblés explicitement :**
```
Why doesn't the task counter on the dashboard update when I mark a task as done?
#file:src/app.js #file:src/utils/storage.js #file:src/pages/dashboard.js
```
📝 `prompt_tokens` = ___ · `nb_tool_calls` = ___ · `AIC` = ___

📝 **CSV — Étape 1bis :**
```
delta prompt_tokens = ____%   delta nb_tool_calls = ____%
Qualité de réponse équivalente ? oui / non
```

> **Règle à retenir :** `#codebase` seulement quand un scope plus étroit a déjà
> échoué, ou qu'on ne sait pas où chercher. Dès qu'on connaît les fichiers
> concernés, les citer explicitement avec `#file:`.

---

## ② `copilot-instructions.md` — 20 à 32 min

**Objectif :** montrer qu'un fichier trop long coûte des tokens à chaque prompt.

### Phase A — Fichier verbeux

Créer `.github/copilot-instructions.md` avec ce contenu :

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

Relancer le même prompt.

📝 **CSV — Étape 2A :**
```
prompt_tokens = ___   AIC = ___
```

### Phase B — Fichier court

**Remplacer** le contenu du fichier par :

```markdown
## TaskFlow — Copilot rules
- Always sanitize() user input before DOM insertion
- Always call storage.save() AND renderList() after mutating tasks[]
- Error messages → #form-error element only
- CSS classes follow BEM, no inline styles from JS
- Do NOT touch: dist/, src/styles/main.css (design system)
```

Relancer le même prompt.

📝 **CSV — Étape 2B :**
```
prompt_tokens = ___   AIC = ___
Qualité de la réponse : meilleure / identique / moins bonne = ___
```

> **Calcul à faire :** (tokens 2A − tokens 2B) × 5 devs × 30 prompts/jour = ___ tokens/jour
>
> Est-ce que la réponse du fichier court est moins bonne ? En général : non.
> Moins de contexte inutile = meilleur signal pour Copilot.

---

## ③ Skills & mode agent — 32 à 50 min ⭐

C'est l'étape la plus impactante. On compare 4 situations.

### 3A — Chat sans skill

Fermer tous les fichiers. Copilot Chat en mode **Chat** (pas Agent).

```
Add a feature: the user can edit a task title by double-clicking on it.
```

📝 **CSV — Étape 3A :**
```
nb_tours = ___   AIC total = ___
```

### 3B — Chat avec skill

Créer `.github/copilot/skills/add-feature.md` :

```markdown
---
name: add-feature
description: Add an interactive UI feature to taskflow-web
---

# Stack
Vanilla HTML/CSS/JS — no framework, no bundler, no npm.
Files load via <script> tags at the bottom of index.html.

# Rules
- New UI → index.html (element) + components.css (BEM class)
- New logic → app.js, always renderList() after state change
- New component → src/components/ + <script> tag in index.html
- Always sanitize() user input · Always storage.save(tasks) after mutation
- No npm, no import/export, no TypeScript, no JSX, no framework
- No inline styles from JS
```

Relancer avec le skill :
```
@add-feature Edit a task title by double-clicking on it.
```

📝 **CSV — Étape 3B :**
```
nb_tours = ___   AIC total = ___
Réduction tours vs 3A = ____%   Réduction AIC vs 3A = ____%
```

### 3C — Agent sans skill

Basculer en **mode Agent** (sélecteur en haut du chat). Fermer tous les fichiers.

```
Add a "mark all as done" button to the taskflow app.
```

Observer : Copilot ouvre des fichiers, lit du code, propose des modifications.

📝 **CSV — Étape 3C :**
```
nb_tours = ___   nb_fichiers_touchés = ___   AIC total = ___
```

> Vous voyez dans le Debug View les `tool calls` (lectures de fichiers).
> Chaque lecture est facturée. Sans guidance, l'agent explore parfois inutilement.

### 3D — Agent avec skill dédié ⭐

Créer `.github/copilot/skills/agent-task.md` :

```markdown
---
name: agent-task
description: Perform a multi-file change on taskflow-web in agent mode
---

# Before starting — read in this order
1. index.html → understand current UI structure
2. src/app.js → understand state management (tasks[], renderList)
3. src/styles/components.css → understand existing CSS patterns

# Change checklist
- UI change → index.html + components.css (new BEM class)
- Logic change → app.js (new function + event listener)
- State change → always storage.save(tasks) + renderList()
- Never modify: dist/, src/styles/main.css, src/utils/helpers.js

# Output format
1. List each file you will modify BEFORE making any change
2. Modify one file at a time
3. After each file: briefly explain what you changed and why
```

Relancer en mode Agent :
```
@agent-task Add a "mark all as done" button.
```

📝 **CSV — Étape 3D :**
```
nb_tours = ___   nb_fichiers_touchés = ___   AIC total = ___
Réduction AIC vs 3C = ____%
```

> **Ce qu'on observe :**
> - `# Before starting` → l'agent lit 3 fichiers dans le bon ordre, pas 8 au hasard
> - `# Output format` → chaque action est déclarée avant d'être faite → zéro surprise
> - `# Never modify` → évite les modifications hors périmètre coûteuses à corriger

---

## ④ Qualité du prompt — 50 à 60 min

**Objectif :** mesurer l'impact d'un prompt flou vs structuré.

**Prompt vague (A) :**
```
Improve the app
```
📝 `nb_tours` = ___ · `AIC total` = ___

**Prompt structuré (B) :**
```
In src/utils/storage.js, add error handling to the load() function:
- Catch JSON.parse errors → return []
- Catch localStorage access errors (private browsing) → return []
- Log each error with console.error and a descriptive message
Code only, no explanation.
```
📝 `nb_tours` = ___ · `AIC total` = ___

**Variante (C) :** Retirer `Code only, no explanation.` et relancer.
📝 `completion_tokens` avec = ___ · sans = ___

> `Code only, no explanation` = −30 à −50% sur les completion_tokens.
> Gain pur, zéro effort.

---

## ⑤ Cache & modèle — 60 à 68 min

### Cache hit

Relancer le prompt baseline **identique**, sans rien changer.

📝 `cached_tokens` = ___ (proche de `prompt_tokens` ?)
📝 `AIC` = ___ (bien inférieur à la baseline ?)

> Tokens en cache → coût ×0.1. Si votre contexte est stable entre deux requêtes,
> le cache s'active automatiquement.

### Comparer les modèles

Changer le modèle (sélecteur en haut du chat) et relancer le même prompt.

| Modèle | AIC | Qualité ressentie |
|---|---|---|
| Claude Sonnet 4.6 | | |
| GPT-4o | | |
| GPT-4o-mini | | |
| Auto Mode | | |

**Auto Mode :** sélectionner **Auto** dans le sélecteur de modèle, relancer le
prompt baseline. Auto Mode laisse Copilot choisir le modèle le plus adapté à
chaque tour, avec une remise documentée d'environ 10% sur le multiplicateur de
tokens — un seul réglage à faire une fois.

📝 `AIC` en Auto Mode = ___ · comparer avec le modèle fixe utilisé jusqu'ici

### Utility model

`Ctrl+Shift+P` → "Open User Settings JSON" :
```json
"chat.utilityModel": "gpt-4o-mini"
```
Les messages de commit, titres de sessions → modèle léger automatiquement.

---

## ⑥ BONUS (si le temps le permet) — Le bon mode pour la bonne tâche

> Cette étape est optionnelle. Si vous êtes dans les temps, testez-la — sinon
> passez directement au score final.

Le mode lui-même (Ask / Edit / Agent) a un coût, avant même d'écrire le prompt.

**A. Mode Agent sur une question simple :**
```
What does the renderList function in app.js do?
```
📝 `AIC` = ___ · `nb_tool_calls` = ___

**B. Même question en mode Ask :**
📝 `AIC` = ___ · `nb_tool_calls` = ___ · Comparer avec A

**C. Mode Ask sur une tâche multi-fichiers :**
```
Add a button to mark all tasks as done, with the logic in app.js and the
button styled in components.css
```
📝 A fonctionné directement sans intervention manuelle ? oui / non

**D. Même tâche en mode Agent :**
📝 `AIC` = ___ · Les deux fichiers ont été édités correctement ? oui / non

> **À retenir :** Ask = comprendre/expliquer sans toucher au code.
> Agent = tâches multi-fichiers ou qui nécessitent d'explorer le repo.
> Le mauvais choix de mode ne se voit pas toujours dans le Debug View —
> parfois c'est juste vous qui perdez du temps à faire à la main ce que
> le bon mode aurait fait automatiquement.

---

## Score final

Calculer dans le CSV ou à la main :

```
Réduction AIC (%)   = (AIC baseline − AIC étape 5) / AIC baseline × 100 = ____%
Réduction tours (%) = (tours baseline − tours 4B)  / tours baseline × 100 = ____%
Score combiné       = (réduction AIC × 0.6) + (réduction tours × 0.4)   = ____
```

---

## Bilan (à compléter avant le débrief)

| Question | Réponse |
|---|---|
| Levier avec le plus grand impact en tokens ? | |
| Levier avec le plus grand impact sur les tours ? | |
| Mode agent avec skill vs sans : quel écart AIC ? | |
| Premier changement dans votre vrai projet demain ? | |
| Une surprise (bonne ou mauvaise) ? | |
