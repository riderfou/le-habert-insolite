# Le Habert insolite

Plateforme de réservation directe du chalet Le Habert insolite, au Plateau-des-Petites-Roches (Chartreuse).

## Contenu

| Chemin | Rôle |
| --- | --- |
| `CLAUDE.md` | Instructions lues par Claude Code à chaque session |
| `docs/01-brief.md` | Project Brief (BMAD phase 1) |
| `docs/02-prd.md` | Exigences produit (phase 2) |
| `docs/03-ux.md` | Spécification UX (phase 2) |
| `docs/04-architecture.md` | Architecture et décisions (phase 3) |
| `docs/05-epics-stories.md` | Epics, stories, statut, contrôle de cohérence (phase 3) |
| `docs/stories/` | Un fichier détaillé par story, rédigé avant de la coder |
| `reference/site-v0/` | Site vitrine actuel (HTML + synchronisation iCal en PHP), pour reprendre contenus et charte |

## Démarrer

1. Créer un dépôt Git (par exemple sur GitHub, privé) et y déposer ce dossier.
2. Ouvrir le dossier dans Claude Code.
3. Commencer par la story 1.1 : `docs/stories/1-1-test-socle-beds24.md`.

```bash
cd le-habert-insolite
git init
git add .
git commit -m "Planification BMAD et story 1.1"
claude
```

Première demande à faire dans Claude Code : « Lis CLAUDE.md et la story 1.1, puis aide-moi à la réaliser. »
