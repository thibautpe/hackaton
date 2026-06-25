# Hackaton Copilot — Guide de démarrage rapide

> 80 min · Équipes de 3-4 · VS Code + GitHub Copilot requis

---

## Avant de commencer — 3 vérifications

1. **VS Code** ouvert sur le dossier `taskflow-web`
2. **Copilot connecté** — icône Copilot visible en bas à droite de VS Code
3. **Debug View actif** — Panneau Chat → `...` (en haut à droite) → **Show Chat Debug View**

> Sans le Debug View, vous ne pouvez pas mesurer. C'est le cockpit de l'atelier.

---

## Le projet

`taskflow-web` est une todo-list en HTML/CSS/JavaScript pur — trois pages (Tâches,
Projets, Dashboard), aucun framework, aucune installation requise.

**Pour la lancer :** double-clic sur `index.html`.

Le workspace contient volontairement des fichiers inutiles (`dist/`, `logs/`,
`.archive/`, `build-cache/`) — c'est du bruit réaliste, et c'est exactement ce
qu'on va mesurer et réduire.

---

## Ce que vous allez faire

À chaque étape, vous envoyez un prompt dans Copilot, vous lisez les chiffres dans
le Debug View, et vous les notez dans `mesures_hackaton.csv`. C'est tout.

**Les colonnes à remplir à chaque étape :**

| Colonne | Où la trouver dans le Debug View |
|---|---|
| `prompt_tokens` | ligne `usage` |
| `cached_tokens` | `prompt_tokens_details` |
| `completion_tokens` | ligne `usage` |
| `AIC` | `copilotUsage` (ex : `1.94 AIC`) |
| `nb_tours` | compter à la main les échanges dans le chat |
| `nb_tool_calls` | compter les appels `read_file`, `search`, etc. (mode agent) |

---

## Les étapes

Suivez **`EQUIPES.md`** pour le détail de chaque étape. En résumé :

| # | Levier | Durée |
|---|---|---|
| ⓪ | Baseline — mesure de référence, aucune optimisation | 0–10 min |
| ① | `.gitignore` déjà en place + `files.exclude` à configurer | 10–20 min |
| ② | `copilot-instructions.md` verbeux vs court | 20–32 min |
| ③ | Skills custom + mode agent guidé vs libre ⭐ | 32–50 min |
| ④ | Prompt structuré vs vague | 50–60 min |
| ⑤ | Cache hit + comparaison de modèles | 60–68 min |
| Bonus | Ask vs Agent — bon mode pour la bonne tâche | si temps dispo |

---

## Ce qui est déjà dans le projet

Vous n'avez pas tout à créer — certains fichiers existent déjà dans `.github/` :

- `.gitignore` — déjà configuré, vérifiez qu'il est bien pris en compte
- `.github/copilot/skills/add-feature.md` — ouvrez-le à l'étape ③, lisez-le avant de l'utiliser
- `.github/copilot/skills/agent-task.md` — idem à l'étape ③D

Ce que vous créez vous-mêmes : la configuration `files.exclude` (étape ①) et le
`copilot-instructions.md` verbeux (étape ②A, pour mesurer l'écart avant de le raccourcir).

---

## Règle d'or

**Un écart faible ou nul est aussi un résultat.** Ne cherchez pas à forcer les chiffres
dans un sens — notez ce que vous observez et on en parle au débrief. L'objectif est de
mesurer honnêtement, pas de confirmer une hypothèse.
