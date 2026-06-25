# Hackaton — Rendre Copilot plus efficace (et accessoirement moins cher)

> Atelier pratique · 80 min · Équipes de 3-4 · VS Code + GitHub Copilot requis

---

## Ce que c'est

Un atelier expérimental où chaque équipe mesure concrètement l'impact de leviers
d'optimisation sur une vraie session GitHub Copilot — en tokens, en AIC, et en nombre
d'allers-retours. Pas de slides, pas de théorie : on observe dans le Debug View, on note
dans le CSV, on compare au débrief.

---

## Prérequis

**Pour chaque participant :**
- VS Code installé
- GitHub Copilot actif (abonnement payant — Copilot Individual, Business ou Enterprise)
- Accès au dossier `taskflow-web` (distribué en zip ou clé USB)

**Pour l'animateur :**
- Avoir fait tourner l'atelier une fois en solo avant le jour J
- Lire `PRESENTATEUR.md` en entier — notamment la section "Fiabilité attendue par levier"
- Avoir le CSV `mesures_hackaton.csv` ouvert sur un écran partagé pendant l'atelier

---

## Contenu du repo

```
hackaton-copilot/
│
├── README.md                        ← ce fichier
│
├── PRESENTATEUR.md                  ← guide animateur : déroulé minute par minute,
│                                       points de discours, chiffres de référence
│
├── EQUIPES.md                       ← guide participants : étapes, prompts à lancer,
│                                       colonnes CSV à remplir
│
├── FONCTIONNEMENT_APP.md            ← documentation technique de taskflow-web
│                                       (architecture, flux de données, composants,
│                                       bugs intentionnels)
│
├── MESURE_TOKENS_VSCODE_INTELLIJ.md ← référence sur les outils de mesure disponibles
│                                       dans VS Code et IntelliJ
│
├── mesures_hackaton.csv             ← tableau de mesures (une section par équipe,
│                                       une ligne par étape)
│
├── teaser.md                        ← texte de communication pré-atelier
├── teaser_hackathon_efficacite_v2.png ← visuel pour l'invitation
│
└── taskflow-web/                    ← projet de référence utilisé pendant l'atelier
    ├── index.html
    ├── src/                         ← ~2000 lignes de code source (JS vanilla)
    ├── dist/                        ← ⚠️ 20 fichiers de build factices (bruit intentionnel)
    ├── logs/                        ← ⚠️ 8 fichiers de logs serveur (bruit intentionnel)
    ├── .archive/                    ← ⚠️ ancien code v1 jamais utilisé (bruit intentionnel)
    ├── build-cache/                 ← ⚠️ cache technique (bruit intentionnel)
    ├── .gitignore                   ← déjà configuré (dist/, logs/, .archive/...)
    ├── docs/ARCHITECTURE.md         ← documentation verbeuse (~150 lignes)
    └── .github/                     ← stack Copilot complet : instructions, skills,
                                        agents, prompts, hooks
```

---

## Le projet : taskflow-web

Une todo-list enrichie en HTML/CSS/JavaScript pur — trois pages (Tâches, Projets,
Dashboard), aucun framework, aucune dépendance npm. L'application s'ouvre avec un
double-clic sur `index.html`, sans installation.

Le workspace contient volontairement du bruit réaliste (`dist/`, `logs/`, `.archive/`,
`build-cache/`) pour rendre les effets des leviers d'optimisation visibles et mesurables
dans le Debug View. Sans ce bruit, les écarts en tokens seraient trop faibles pour être
pédagogiques.

**Deux bugs intentionnels dans le code source**, cibles des exercices :

- `addTask()` dans `src/app.js` — aucune validation du titre (accepte un titre vide)
  et `input.value` assigné sans `sanitize()` avant insertion dans le DOM (faille XSS)
- `storage.load()` dans `src/utils/storage.js` — aucune gestion d'erreur si
  `localStorage` est inaccessible ou si le JSON est corrompu

Ces bugs sont documentés dans `FONCTIONNEMENT_APP.md` section 10.

---

## Structure de l'atelier

| # | Étape | Durée | Levier |
|---|---|---|---|
| 0 | Baseline | 0–10 min | Mesure de référence — aucune optimisation |
| 1 | Contexte | 10–20 min | `.gitignore` + `files.exclude` + scope `#file:` vs `#codebase` |
| 2 | Instructions | 20–32 min | `copilot-instructions.md` verbeux vs court |
| **3** | **Skills & agents** | **32–50 min** | **Skills custom + mode agent guidé vs libre** |
| 4 | Prompt | 50–60 min | Prompt structuré vs vague + `Code only, no explanation` |
| 5 | Cache & modèle | 60–68 min | Cache hit + comparaison de modèles + Auto Mode |
| Bonus | Ask/Edit/Agent | si temps dispo | Bon mode pour la bonne tâche |
| 6 | Débrief | 68–80 min | Synthèse collective sur les chiffres du CSV |

L'étape ③ (Skills & agents) est la plus impactante — ne pas la sacrifier pour les étapes
précédentes si le timing est serré. Le Bonus est optionnel et ne doit pas empiéter sur le
débrief.

---

## Ce qui est déjà dans le projet vs ce que les équipes créent

Certains fichiers existent déjà dans `taskflow-web/.github/` — les équipes les ouvrent
et les utilisent, elles ne les réécrivent pas de zéro :

| Fichier | Statut | Étape concernée |
|---|---|---|
| `.gitignore` | ✅ Déjà présent | Étape ① — vérifier, pas créer |
| `.github/copilot-instructions.md` | ✅ Déjà présent (version courte) | Étape ② — remplacer par version verbeuse puis recourte |
| `.github/copilot/skills/add-feature.md` | ✅ Déjà présent | Étape ③B — ouvrir et utiliser |
| `.github/copilot/skills/agent-task.md` | ✅ Déjà présent | Étape ③D — ouvrir et utiliser |
| `.github/agents/planner.agent.md` | ✅ Présent (easter egg) | Bonus avancé — `@Planner` |
| `.github/agents/reviewer.agent.md` | ✅ Présent (easter egg) | Bonus avancé — `@Reviewer` |
| `.github/prompts/fix-bug.prompt.md` | ✅ Présent | Utilisable librement |

Les agents `Planner` et `Reviewer` sont des bonus non documentés dans le guide équipe —
les équipes rapides peuvent les découvrir et les invoquer avec `@Planner` / `@Reviewer`
dans Copilot Chat.

---

## Comment mesurer

**Outil principal : Chat Debug View** (VS Code natif)
Panneau Chat → `...` (en haut à droite) → **Show Chat Debug View**

Chaque requête y est loggée avec :
- `prompt_tokens` — tokens envoyés (message + contexte + instructions)
- `cached_tokens` — tokens déjà en cache (coût ×0.1)
- `completion_tokens` — tokens générés en réponse
- `copilotUsage` — coût total en AI Credits (ex : `1.94 AIC`)

**Extensions recommandées pour aller plus loin :**
- `rajbos/ai-engineering-fluency` — dashboard session en barre de statut (VS Code et IntelliJ)
- `bedirt.gpt-token-counter-live` — poids en tokens d'une sélection ou d'un fichier
- `hooni.tokenscope` — suivi multi-outils (Copilot + Claude Code)

Voir `MESURE_TOKENS_VSCODE_INTELLIJ.md` pour le détail complet, y compris les
limitations d'IntelliJ (pas d'équivalent natif au Debug View).

---

## Lancer l'atelier

1. Distribuer le dossier `taskflow-web` à chaque équipe (zip ou clé USB)
2. Vérifier que Copilot est connecté sur toutes les machines
3. Ouvrir le Debug View sur chaque poste avant de commencer
4. Distribuer `EQUIPES.md` et `mesures_hackaton.csv` aux participants
5. Suivre le déroulé dans `PRESENTATEUR.md`

> Le débrief final (étape 6) est la partie la plus structurante de l'atelier.
> Ne pas le court-circuiter pour finir les étapes techniques — mieux vaut
> s'arrêter à l'étape 4 et débriefier sur des données partielles que de
> tout boucler sans temps de synthèse collective.

---

## Questions fréquentes

**Les chiffres seront-ils les mêmes sur toutes les machines ?**
Non — les écarts varient selon l'état de l'index VS Code, la version du plugin Copilot,
et ce qui était ouvert avant. C'est voulu : mesurer en conditions réelles, pas reproduire
un benchmark contrôlé. Les tendances (direction des écarts) sont fiables même si les
valeurs absolues diffèrent.

**Et si un levier ne montre pas d'écart ?**
C'est une vraie donnée à reporter dans le CSV et à discuter au débrief. L'atelier
assume explicitement que certains effets seront faibles ou nuls sur un projet de
cette taille — voir la section "Fiabilité attendue par levier" dans `PRESENTATEUR.md`.

**Faut-il IntelliJ ou VS Code ?**
VS Code est fortement recommandé pour cet atelier — le Chat Debug View n'a pas
d'équivalent natif dans IntelliJ. Les participants sur IntelliJ peuvent participer
mais auront moins de visibilité par requête. Voir `MESURE_TOKENS_VSCODE_INTELLIJ.md`.
