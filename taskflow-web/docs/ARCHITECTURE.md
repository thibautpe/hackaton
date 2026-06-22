# TaskFlow Web — Documentation technique complète

## Table des matières
1. Introduction
2. Architecture générale
3. Gestion d'état
4. Persistance des données
5. Système de composants
6. Conventions de nommage
7. Stratégie de tests
8. Performance
9. Accessibilité
10. Roadmap

## 1. Introduction

TaskFlow Web est une application de gestion de tâches construite intégralement
en HTML, CSS et JavaScript vanilla, sans dépendance à un framework front-end.
Ce choix architectural a été fait pour des raisons pédagogiques : permettre à
toute personne, indépendamment de son niveau technique, de comprendre le
fonctionnement complet de l'application en lisant le code source.

L'application permet de créer, organiser, filtrer et suivre des tâches,
regroupées optionnellement par projets. Elle inclut également un tableau de
bord avec des statistiques visuelles sur l'avancement du travail.

## 2. Architecture générale

L'application suit une architecture en couches simples :

- **Présentation** (`index.html`, `src/styles/`) : structure et apparence
- **Composants** (`src/components/`) : éléments d'interface réutilisables
- **Pages** (`src/pages/`) : logique spécifique à chaque vue (dashboard, projects)
- **Utilitaires** (`src/utils/`) : fonctions transverses (stockage, validation, helpers)
- **Vendor** (`src/vendor/`) : bibliothèques tierces vendorisées (non modifiables)

Cette séparation permet une montée en compétence progressive : un débutant peut
modifier le CSS sans toucher à la logique, tandis qu'un développeur plus avancé
peut intervenir sur la gestion d'état dans `app.js`.

## 3. Gestion d'état

L'état de l'application repose sur deux tableaux globaux maintenus en mémoire :

- `tasks` : liste de toutes les tâches, chacune avec un identifiant unique,
  un titre, une priorité, un statut de complétion, une date de création,
  et optionnellement une date d'échéance et un identifiant de projet.
- `projects` (via `projectsPage.projects`) : liste des projets, chacun avec
  un nom, une couleur, une description et un statut d'archivage.

Toute modification de ces tableaux doit être suivie de deux appels :
1. Persistance via `storage.save()` ou `projectStorage.save()`
2. Rafraîchissement de l'affichage via `renderList()` ou les méthodes
   de rendu spécifiques à chaque page

Ce pattern, bien que manuel, garantit que l'état affiché à l'écran est
toujours synchronisé avec l'état persisté.

## 4. Persistance des données

Toutes les données sont stockées dans le `localStorage` du navigateur, sous
forme de chaînes JSON. Deux clés sont utilisées :

- `taskflow_tasks` : tableau des tâches
- `taskflow_projects` : tableau des projets
- `taskflow_analytics_events` : événements de tracking (limité à 500 entrées)

Cette approche a des limites connues : les données ne sont pas synchronisées
entre appareils, sont perdues en navigation privée à la fermeture de l'onglet,
et sont limitées à environ 5-10 Mo selon les navigateurs. Pour un usage en
production multi-appareils, une migration vers une API backend serait
nécessaire.

## 5. Système de composants

Les composants suivent un pattern fonctionnel simple : chaque composant
exporte une fonction de création qui retourne un élément DOM, sans jamais
s'auto-attacher au document. C'est à l'appelant de décider où insérer
l'élément retourné.

Composants disponibles :
- `taskCard.js` : carte d'affichage d'une tâche individuelle
- `filters.js` : logique des boutons de filtrage
- `modal.js` : fenêtre modale générique réutilisable
- `toast.js` : notifications temporaires (succès/erreur/info)
- `dropdown.js` : menu déroulant générique
- `datePicker.js` : sélecteur de date avec formatage relatif

## 6. Conventions de nommage

- **Fichiers JavaScript** : camelCase (`taskCard.js`, `datePicker.js`)
- **Fonctions** : camelCase, verbes d'action (`createTask`, `renderList`)
- **Classes CSS** : BEM strict (`.task-card__title--highlighted`)
- **Variables d'état globales** : minuscules simples (`tasks`, `currentFilter`)
- **Constantes** : SCREAMING_SNAKE_CASE (`STORAGE_KEY`, `PROJECT_COLORS`)

## 7. Stratégie de tests

Le projet ne dispose pas actuellement de suite de tests automatisés. Les tests
manuels suivants sont recommandés avant chaque changement significatif :

- Ajout d'une tâche avec titre vide → doit afficher une erreur
- Ajout d'une tâche avec titre valide → doit apparaître dans la liste
- Changement de filtre → doit affecter uniquement l'affichage, pas les données
- Suppression d'une tâche → doit la retirer du localStorage également
- Rechargement de la page → l'état doit persister

## 8. Performance

L'application étant de petite taille, les considérations de performance sont
limitées. Néanmoins, les points suivants sont surveillés :

- Le rendu complet de la liste (`renderList()`) recrée tous les éléments DOM
  à chaque modification, ce qui est acceptable jusqu'à quelques centaines
  de tâches mais deviendrait coûteux au-delà.
- Le localStorage étant synchrone, des écritures fréquentes sur de gros
  volumes de données pourraient bloquer le thread principal brièvement.

## 9. Accessibilité

Quelques efforts d'accessibilité de base sont en place :
- Labels ARIA sur les boutons icônes (`aria-label`)
- `aria-live="polite"` sur les zones de message d'erreur et toasts
- Navigation au clavier fonctionnelle sur les inputs et boutons standards

Des améliorations restent possibles : gestion du focus dans les modales,
annonces de changement de filtre pour lecteurs d'écran, contraste vérifié
sur tous les badges de priorité.

## 10. Roadmap

Idées d'évolution non implémentées à ce jour :
- Export/import JSON des tâches
- Mode sombre
- Sous-tâches et dépendances entre tâches
- Recherche textuelle dans les tâches
- Synchronisation via une API backend
- Notifications navigateur pour les échéances proches
