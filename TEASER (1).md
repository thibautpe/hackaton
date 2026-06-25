# Vous utilisez Copilot tous les jours. Mais savez-vous ce qu'il fait vraiment sous le capot ?

Combien de tokens ce prompt vient de coûter ?
Pourquoi l'agent a lu 8 fichiers pour n'en modifier qu'un ?
Est-ce que ce `.github/copilot-instructions.md` de 200 lignes aide vraiment — ou il vous coûte de l'argent à chaque requête sans que vous le sachiez ?

On a rarement le temps de se poser ces questions entre deux tickets. C'est exactement pour ça qu'on organise cet atelier.

---

## 80 minutes pour ouvrir le capot

On va travailler sur un vrai projet — du code, pas des slides. Chaque équipe a le même
point de départ, les mêmes prompts à envoyer, et un tableau de mesures à remplir en direct.

À chaque étape, vous changez un seul paramètre et vous regardez ce que ça donne dans le
Debug View : tokens consommés, nombre d'allers-retours, coût en AI Credits. Avant/après.
Chiffre contre chiffre.

Les leviers qu'on teste :

**Skills custom** — un fichier de 15 lignes qui évite 3 tours de clarification sur la même tâche.

**Mode agent guidé** — la différence entre un agent qui lit 8 fichiers au hasard et un qui en lit 3 dans le bon ordre.

**Instructions courtes vs longues** — un `copilot-instructions.md` trop verbeux est injecté dans *chaque* prompt de *chaque* dev. Toute la journée. Le calcul est vite fait.

**Prompt structuré** — `Code only, no explanation` : deux mots, −40% sur les tokens de sortie.

**Cache & choix de modèle** — relancer deux fois le même prompt et voir le coût divisé par dix. Comprendre pourquoi Auto Mode existe.

---

## Ce que vous repartez avec

Des chiffres réels, mesurés sur votre machine, pendant l'atelier.
Des fichiers (skills, instructions, prompt files) directement réutilisables dans vos projets.
Et une réponse claire à la question : *sur quoi vaut-il vraiment la peine d'agir en premier ?*

---

**📅 [DATE] · ⏱ 80 min · 👥 Équipes de 3-4 · 💻 VS Code + Copilot requis**

Inscription : [LIEN]
