# Scripts jetables – story 1.1 (test du socle Beds24)

Ces scripts servent à vérifier l'API Beds24 V2 avant d'écrire l'adaptateur définitif (story 1.4). Ils seront supprimés ou archivés une fois la décision prise (CA9).

Vérifiés le 6 novembre 2026 sur la spécification officielle (`https://beds24.com/api/v2/apiV2.yaml`) : en-têtes `code`, `refreshToken` et `token`, corps POST en tableau, pagination `pages.nextPageExists`, action `allowWebhooks`.

## Installation

```bash
cd scripts/beds24-spike
npm install
npm test
```

Les jetons sont écrits dans `.dev.vars`, à la racine du dépôt (ignoré par Git, droits 600). Ne jamais les coller ailleurs.

## Ordre des étapes

**Avant tout : CA1 (commission Airbnb) doit être relevé et accepté. Ne pas connecter l'annonce sinon : la bascule en « hôte seul » est sans retour.**

| Étape | Qui | Commande ou action | Critère |
| --- | --- | --- | --- |
| 1 | Jérôme | Relever la commission des 3 derniers versements Airbnb | CA1 |
| 2 | Jérôme | Créer le compte d'essai et la propriété (4 personnes) | CA2 |
| 3 | Jérôme | Beds24 → Settings → Account → API : code d'invitation avec `bookings`, `bookings-personal`, `inventory`, `properties`, `channels` | – |
| 4 | Script | `npx tsx setup.ts <code>` puis `npx tsx token.ts` (affiche les droits obtenus) | – |
| 5 | Script | `npx tsx properties.ts --save` (note le `roomId` du chalet) | CA2 |
| 6 | Jérôme | Connecter Airbnb en mode **import** (sans écraser photos, textes, prix) ; vérifier l'annonce juste après | CA3 |
| 7 | Script | `npx tsx list-bookings.ts` : les réservations Airbnb doivent apparaître avec le canal `airbnb` | CA3, CA4 |
| 8 | Script | `npx tsx create-test-booking.ts --arrival AAAA-MM-JJ --departure AAAA-MM-JJ` (dates libres, à plus de 6 mois) ; noter l'heure de blocage sur Airbnb | CA5 |
| 9 | Script | `npx tsx create-test-booking.ts --delete <id>` ; noter l'heure de libération sur Airbnb | CA5 |
| 10 | Script | `npx tsx messages.ts` puis `npx tsx messages.ts --booking <id>` | CA6 |
| 11 | Script | `npx tsx messages.ts --booking <id> --send "…"` vers un voyageur volontaire ou le co-hôte | CA6 |
| 12 | Script + Jérôme | Déployer le récepteur (ci-dessous), demander au support l'activation des webhooks V2, renseigner l'adresse | CA7 |
| 13 | Jérôme | Relever le prix mensuel de l'offre avec API et channel manager | CA8 |

Garde-fous intégrés :

- `create-test-booking.ts` refuse des dates à moins de 6 mois ou déjà occupées, demande confirmation, et marque la réservation du nom `TEST-SPIKE-1.1`. `--delete` refuse toute réservation qui ne porte pas ce nom.
- `messages.ts --send` affiche le texte et demande confirmation avant l'envoi.
- La réservation de test est créée avec `allowWebhooks`, ce qui permet de tester CA7 en même temps que CA5.

## Récepteur de webhooks (CA7)

Worker Cloudflare minimal qui journalise les requêtes reçues et répond 200.

```bash
cd scripts/beds24-spike/webhook-receiver
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put WEBHOOK_KEY   # une chaîne aléatoire, par exemple : openssl rand -hex 16
npx wrangler tail --format pretty     # journal en direct
```

Adresse à donner à Beds24 (Settings → Properties → Access → Booking webhooks) :
`https://habert-beds24-webhook-test.<sous-domaine>.workers.dev/hook/<WEBHOOK_KEY>`

Les requêtes restent consultables dans le tableau de bord Cloudflare (Workers Logs). Supprimer le Worker à la fin de la story : `npx wrangler delete`.

Test en local : `npx wrangler dev`, puis `curl -X POST -d '{"test":1}' http://localhost:8787/hook`.
