# Le Habert insolite – instructions pour Claude Code

Plateforme de réservation directe pour un chalet de 4 personnes au Plateau-des-Petites-Roches (Chartreuse, Isère), loué aujourd'hui sur Airbnb. Propriétaires : Jérôme et Laura. Objectif : plus de 75 % des nuits réservées en direct d'ici deux ans.

Le projet suit la méthode BMAD. La planification est terminée ; on est en phase 4 (implémentation), story par story.

## Documents de référence

Lire avant toute story :

- `docs/02-prd.md` : exigences (identifiants V1-01, V15-01, V2-01, V3-01, V4-01, NF-01…) et critères d'acceptation.
- `docs/04-architecture.md` : pile technique, modèle de données, flux critiques, ADR.
- `docs/05-epics-stories.md` : découpage, ordre, statut, définition de « terminé ».
- `docs/stories/<numéro>-<nom>.md` : le fichier détaillé de la story en cours. **C'est lui qu'on suit.**

Selon le besoin : `docs/01-brief.md` (contexte et décisions), `docs/03-ux.md` (écrans, messages, identité visuelle), `reference/site-v0/` (site vitrine actuel : contenus, charte, calendrier iCal).

## Façon de travailler

1. Une story à la fois. Si son fichier détaillé n'existe pas, le rédiger d'abord et le faire valider par Jérôme.
2. Respecter le périmètre de la story ; noter dans son fichier ce qui est découvert hors périmètre au lieu de le faire.
3. Tests écrits avec le code. Ne pas déclarer une story terminée tant que la définition de « terminé » n'est pas cochée.
4. En fin de story : mettre à jour le statut dans `docs/05-epics-stories.md` et la section « Journal de réalisation » du fichier de story.
5. Toute décision technique nouvelle ou contraire à une ADR → proposer une ADR dans `docs/04-architecture.md` avant de coder.
6. Ne jamais committer de secret. Clés et jetons dans les secrets Cloudflare (`wrangler secret put`) et dans `.dev.vars` en local (ignoré par Git).

## Pile technique (résumé, voir l'architecture)

- TypeScript strict partout.
- Astro avec `@astrojs/cloudflare`, rendu serveur ; îlots React pour le calendrier, le tunnel, la boîte de réception et l'espace hôte.
- Cloudflare Workers (offre payante), D1 + Drizzle ORM, R2, Workflows, Cron Triggers, Durable Objects, Access.
- Socle de réservation : Beds24 (API V2), derrière `src/adapters/booking/`. Stripe, WhatsApp Cloud API, Claude (Anthropic) et l'e-mail ont chacun leur adaptateur dans `src/adapters/`.
- Carte : Leaflet + Plan IGN (Géoplateforme), repli OpenStreetMap.

## Conventions

- Code et identifiants en anglais ; textes visibles, commentaires métier et documentation en français.
- Tout texte visible du voyageur passe par la table des textes traduits ; jamais de chaîne en dur dans un composant. Langues : `fr`, `en`, `de`, `nl` ; repli sur `en`.
- Montants en centimes (entiers). Dates de séjour en `YYYY-MM-DD`, fuseau Europe/Paris, sans heure.
- Webhooks entrants : vérifier la signature, enregistrer la charge brute, traiter de façon idempotente.
- Le socle fait foi pour les disponibilités ; la plateforme garde une copie de tout (ADR-03).
- Aucun débit sans réservation créée dans le socle (ADR-05).
- L'assistant IA ne peut déclencher aucun paiement, remboursement ni blocage de dates.
- Interface : identité visuelle de `docs/03-ux.md` (couleurs Calcaire, Sapin, Chartreuse, Ardoise, Belledonne, Lichen ; Alegreya et Alegreya Sans). Conception pour 375 px d'abord, accessibilité AA.

## Définition de « terminé »

- [ ] Tests automatiques écrits et passants.
- [ ] Textes visibles du voyageur présents dans les 4 langues.
- [ ] Écran vérifié à 375 px de large.
- [ ] Accessibilité AA vérifiée sur les écrans modifiés.
- [ ] Messages d'erreur et états vides conformes à `docs/03-ux.md`.
- [ ] Déployée en préproduction et relue par Jérôme.

## Commandes

À compléter par la story 1.2 (installation, développement local, tests, migrations, déploiement).
