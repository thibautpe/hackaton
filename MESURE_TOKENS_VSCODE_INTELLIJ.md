# Mesurer la consommation de tokens Copilot — VS Code & IntelliJ

> Référence pour le hackaton optimisation tokens · Juin 2026

---

## 🟦 VS Code

### 1. Chat Debug View (natif, le plus complet)

**Accès :** Panneau Chat → menu `...` (en haut à droite) → **Show Chat Debug View**
*(ou Command Palette → "Developer: Show Chat Debug View")*

C'est la source la plus détaillée disponible nativement. Chaque appel au modèle est loggé avec :
- `prompt_tokens` — total envoyé (message + contexte + instructions)
- `completion_tokens` — tokens générés en réponse
- `cached_tokens` — tokens déjà en cache (coût ×0.1)
- `copilotUsage` — coût total en AI Credits (ex: `1.94 AIC`)

⚠️ Limite connue : ce n'est pas conçu pour un suivi quotidien — c'est un outil de debug ponctuel, pas un dashboard.

---

### 2. Extensions tierces — comptage de tokens par fichier/sélection

| Extension | Ce qu'elle fait |
|---|---|
| **VS Code Token Counter** (`nishant-bhandari.vscode-tokencounter`) | Affiche le nombre de tokens du fichier actif dans la barre de statut |
| **LLM Token Counter** (`bedirt.gpt-token-counter-live`) | Compte en temps réel les tokens du texte sélectionné ou du document entier, avec choix du tokenizer (GPT, Claude via tiktoken) |

**Usage pratique :** sélectionner un dossier suspect (`dist/`, `logs/`) et voir son poids en tokens *avant* de l'exclure — rend visible l'intérêt du `.gitignore` / `files.exclude`.

---

### 3. Extensions tierces — suivi d'usage Copilot dans la durée

| Extension | Ce qu'elle fait |
|---|---|
| **AI Engineering Fluency** *(ex GitHub Copilot Token Tracker)* (`rajbos/ai-engineering-fluency`) | Dashboard d'usage et de "fluency score" dans la barre de statut, fonctionne aussi sur Cursor/Windsurf |
| **GitHub Copilot Token Tracker** (`winter0729.github-copilot-token-tracker`) | Suit l'usage Copilot Chat à partir des logs d'export de requêtes |
| **TokenScope** (`hooni.tokenscope`) | Suit l'usage de tokens par projet, multi-outils (Claude Code, OpenAI Codex CLI inclus) |

---

### 4. Dashboard GitHub.com (vue globale, pas par requête)

**Accès :** github.com → Settings → Billing → Copilot usage

Montre l'usage agrégé (requêtes, crédits consommés) sur tous les canaux (chat, CLI, agent). Ne donne **pas** de détail par requête ou par token — uniquement des totaux. Utile pour le suivi mensuel, pas pour le debug fin pendant un atelier.

---

## 🟧 IntelliJ / JetBrains (IntelliJ IDEA, Rider, PyCharm, WebStorm, GoLand, RubyMine, CLion...)

### Constat important

**IntelliJ n'a pas d'équivalent natif du Chat Debug View de VS Code.** C'est une limitation connue et documentée :

> Feature request ouverte (issue #1756, microsoft/copilot-intellij-feedback) :
> *"Please add token usage visibility per Copilot Chat request/turn in the IntelliJ plugin UI. Today, users may see token-related failures without clear visibility into token consumption for the specific request. A daily/global usage view is not enough for troubleshooting a single failed or slow interaction."*

Autrement dit : **pas de breakdown prompt/completion/cached par requête disponible nativement dans le plugin IntelliJ**, contrairement à VS Code.

---

### 1. View Usage Quota (natif, vue globale uniquement)

**Accès :** clic sur l'icône Copilot dans la barre de statut → **View quota usage** *(anciennement "View Usage Quota")*

Donne un résumé global de la période de facturation (requêtes/crédits consommés), pas de détail par interaction. Cette vue a connu des régressions récentes :

> Issue #1738 (CLion 2026.1.2, mai 2026) : *"Copilot plugin no-longer shows me any usage information for tokens/credits. Instead it tells me business plan has no limit on AI credit usage set by organisation."*

⚠️ Si votre organisation est sur un plan Business sans limite définie, ce panneau peut afficher une information incomplète ou absente.

---

### 2. Extensions/plugins tierces

| Plugin | Ce qu'il fait |
|---|---|
| **AI Engineering Fluency** (`rajbos/ai-engineering-fluency`) | Le même outil que pour VS Code — *"Token usage and fluency dashboards inside any JetBrains IDE (IntelliJ IDEA, Rider, PyCharm, WebStorm, GoLand, RubyMine, CLion...). Built as a thin Kotlin/JCEF host reusing the same webview bundles as the VS Code extension."* C'est aujourd'hui la solution la plus complète pour IntelliJ. |
| **GitHub Copilot Premium Quota Monitor** (plugin Marketplace JetBrains) | Widget de barre de statut avec auto-refresh (5 min par défaut), affiche "X of Y" requêtes/crédits avec tooltip détaillé. Vue globale uniquement, pas de détail par requête. |

---

### 3. Ce qui ne fonctionne PAS en natif sur IntelliJ

- Pas de breakdown prompt_tokens / completion_tokens / cached_tokens par requête
- Pas de panneau "Debug View" équivalent à VS Code
- La vue de quota peut être incomplète sur les plans Business sans limite organisationnelle définie

➡️ **Pour un suivi fin par requête sur IntelliJ aujourd'hui, l'extension tierce `ai-engineering-fluency` est la meilleure option disponible**, faute d'équivalent natif.

---

## 🔧 Exclusion de contenu (équivalent `files.exclude`)

Le levier "réduire le contexte" fonctionne aussi sur IntelliJ, avec sa propre mécanique :

> *"IntelliJ sends the same types of context to Copilot as VS Code: active file contents, selected code, and repository context. All developer practices apply equally in IntelliJ. Content exclusion settings are reloaded by closing and reopening the application — this is required if settings were updated while the IDE was already running."*

**Configuration recommandée (niveau organisation ou projet) :**
```
target/, build/, *.xml, *.yml, *.log, secrets/, .archive/, logs/
```

⚠️ **Point d'attention spécifique à IntelliJ** : contrairement à VS Code où `files.exclude` est repris à chaud, **IntelliJ nécessite un redémarrage de l'IDE** (fermeture/réouverture) pour que les changements d'exclusion de contenu prennent effet immédiatement, plutôt que d'attendre jusqu'à 30 minutes.

---

## 📊 Tableau comparatif synthétique

| Besoin | VS Code | IntelliJ |
|---|---|---|
| Détail par requête (prompt/completion/cached) | ✅ Chat Debug View (natif) | ❌ Pas d'équivalent natif |
| Compteur de tokens par fichier/sélection | ✅ Extensions dédiées | ⚠️ Via ai-engineering-fluency uniquement |
| Suivi d'usage global (crédits/requêtes) | ✅ Natif + GitHub dashboard | ✅ View quota usage (natif, parfois incomplet) |
| Exclusion de contenu du contexte | ✅ `files.exclude`, à chaud | ✅ Content Exclusion, nécessite redémarrage |
| Suivi multi-outils (Copilot + Claude Code + autres) | ✅ TokenScope, ai-engineering-fluency | ✅ ai-engineering-fluency |

---

## Recommandation pour un atelier mixte VS Code / IntelliJ

Si les participants utilisent les deux IDE, installer **`ai-engineering-fluency`** (anciennement `copilot-token-tracker`) sur les deux environnements : c'est la seule extension qui offre une expérience comparable des deux côtés, le plugin IntelliJ réutilisant les mêmes bundles webview que l'extension VS Code.

Pour les utilisateurs IntelliJ uniquement, prévoir que la démonstration "avant/après" sur les tokens sera **moins précise par requête** que sur VS Code — privilégier la mesure d'usage global sur la session plutôt que la comparaison fine prompt par prompt.
