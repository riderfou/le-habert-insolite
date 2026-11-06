# Story 1.1 – Vérifier la commission Airbnb et tester Beds24

Epic 1 (socle et fondations techniques) · Taille M · Statut : en cours
Exigences : V1-01, V1-02 · ADR concernées : ADR-03, ADR-04

## Récit

En tant qu'hôte, je veux savoir ce que coûte vraiment la connexion d'Airbnb à un logiciel de gestion, et vérifier que l'API de Beds24 fait ce dont la plateforme a besoin, afin de valider le socle avant d'écrire la moindre ligne de code qui en dépend.

## Pourquoi cette story vient en premier

Toute l'option B repose sur deux hypothèses non vérifiées :

1. La connexion à un logiciel de gestion ne dégrade pas l'économie du projet (commission Airbnb « hôte seul » de 15,5 %).
2. L'API Beds24 permet de lire et créer des réservations, de lire et envoyer des messages Airbnb, et de recevoir des notifications.

Si l'une tombe, on teste Smoobu, ou on revient à l'option A (iCal seul) avant d'investir dans le code.

## Critères d'acceptation

- [ ] **CA1 – Commission** : la commission prélevée par Airbnb sur les 3 derniers versements est relevée, ainsi que le modèle de frais (partagé ou « hôte seul »).
- [ ] **CA2 – Compte d'essai** : un compte d'essai Beds24 existe, avec le chalet créé comme propriété.
- [ ] **CA3 – Connexion Airbnb** : l'annonce Airbnb est connectée sans écraser le contenu de l'annonce (photos, textes, prix) ; les réservations Airbnb existantes apparaissent dans Beds24.
- [ ] **CA4 – Lecture API** : la liste des réservations est lue par l'API V2.
- [ ] **CA5 – Création API** : une réservation de test créée par l'API bloque les dates sur Airbnb ; le délai est mesuré ; la réservation est ensuite supprimée et les dates se libèrent.
- [ ] **CA6 – Messages** : un message Airbnb existant est lu par l'API ; un message de test est envoyé à un voyageur volontaire (ou au co-hôte) et apparaît dans la messagerie Airbnb.
- [ ] **CA7 – Notifications** : les webhooks de réservation V2 sont activés (par le support Beds24) et une notification est reçue sur une adresse de test.
- [ ] **CA8 – Coût réel** : le prix mensuel de l'offre nécessaire (API comprise) est confirmé.
- [ ] **CA9 – Décision** : la décision (Beds24, Smoobu ou option A) et ses raisons sont notées dans `docs/04-architecture.md` (nouvelle ADR-13) et le statut de V1-01 et V1-02 est mis à jour.

## Précautions

- **La connexion d'Airbnb à un logiciel de gestion peut faire basculer l'annonce sur la commission « hôte seul » de 15,5 %, sans retour possible.** Faire CA1 avant CA3, et ne pas connecter l'annonce tant que l'impact n'est pas accepté.
- Choisir, lors de la connexion Airbnb, le mode qui **n'écrase pas** le contenu et les prix de l'annonce (import plutôt que publication depuis Beds24). Vérifier l'annonce juste après.
- Pour CA5, prendre des dates libres au moins 6 mois à l'avance, peu demandées, et supprimer la réservation de test dans la foulée.
- Ne jamais committer les jetons Beds24 : les garder dans `.dev.vars` (ignoré par Git).

## Tâches

### Partie manuelle (Jérôme)

1. **Commission (CA1)** : Airbnb → Revenus / Versements → ouvrir les 3 derniers versements, relever « frais de service de l'hôte » en euros et en pourcentage. Noter le modèle affiché dans Paramètres → Tarifs → frais de service.
2. **Compte d'essai (CA2)** : créer un compte sur beds24.com, créer la propriété « Le Habert insolite » avec un logement pour 4 personnes.
3. **Connexion Airbnb (CA3)** : seulement si CA1 est acceptable. Beds24 → Channel Manager → Airbnb → connecter le compte, associer l'annonce existante, vérifier les options de synchronisation.
4. **Accès API** : Beds24 → Settings → Account → API → générer un code d'invitation pour l'API V2, avec les droits `bookings`, `bookings-personal`, `inventory`, `properties`, `channels`.
5. **Webhooks (CA7)** : écrire au support Beds24 pour activer les webhooks de réservation V2, puis renseigner l'adresse de test (fournie par la partie automatisée).
6. **Prix (CA8)** : relever le prix de l'offre qui inclut l'API et le channel manager Airbnb.

### Partie automatisée (Claude Code)

Petits scripts jetables dans `scripts/beds24-spike/`, en TypeScript, exécutés avec `npx tsx`. Ils servent à vérifier ; le vrai adaptateur viendra en story 1.4.

1. `setup.ts` : échange le code d'invitation contre un jeton de rafraîchissement (`GET https://beds24.com/api/v2/authentication/setup`, en-tête `code`), l'écrit dans `.dev.vars`.
2. `token.ts` : obtient un jeton d'accès à partir du jeton de rafraîchissement (`GET /authentication/token`, en-tête `refreshToken`).
3. `list-bookings.ts` (CA4) : `GET /bookings` sur les 18 prochains mois, affiche dates, canal et statut.
4. `create-test-booking.ts` (CA5) : `POST /bookings` sur des dates passées en argument ; affiche l'identifiant ; option `--delete <id>` pour supprimer. Mesurer à la main le délai d'apparition du blocage sur Airbnb.
5. `messages.ts` (CA6) : `GET /bookings/messages?bookingId=…` ; option `--send` pour `POST /bookings/messages`.
6. `webhook-receiver` (CA7) : un Worker Cloudflare minimal qui journalise les requêtes reçues, déployé sur un sous-domaine de test, ou à défaut une adresse de service de test de webhooks.

Documentation de référence : [API V2](https://beds24.com/api/v2), [connexion Airbnb par l'API V2](https://wiki.beds24.com/index.php/PMSs:_How_to_connect_to_Beds24_and_use_Airbnb_via_API_V2), [webhooks](https://wiki.beds24.com/index.php/Category:Webhooks). Vérifier noms d'en-têtes, paramètres et droits sur la documentation en vigueur avant d'écrire les scripts.

## Hors périmètre

- Le projet Astro et l'adaptateur définitif (stories 1.2 et 1.4).
- L'envoi des prix au socle (story 4.3).
- Le test de Smoobu, sauf si Beds24 échoue sur CA4 à CA7.

## Si le test échoue

| Échec | Suite |
| --- | --- |
| Commission jugée inacceptable (CA1) | Rester en option A (iCal), revoir le PRD : pas de messages Airbnb dans la boîte de réception |
| API sans messages ou sans webhooks (CA6, CA7) | Tester Smoobu avec les mêmes critères |
| Création par API non répercutée sur Airbnb (CA5) | Bloquant : tester Smoobu |

## Journal de réalisation

À remplir pendant la story : dates, résultats de chaque critère, délais mesurés, captures utiles, décision.

**6 novembre 2026 – partie automatisée prête.** Scripts dans `scripts/beds24-spike/` (mode d'emploi : `LISEZMOI.md`), écrits d'après la spécification officielle `apiV2.yaml` du jour. Tests unitaires des outils partagés passants (8/8), typage strict sans erreur. Récepteur de webhooks vérifié en local (`wrangler dev` : POST journalisé, 200 ; chemin inconnu : 404), pas encore déployé. Rien n'a encore été exécuté contre Beds24 : en attente de CA1 puis du code d'invitation API.

Constats hors périmètre (à reprendre en story 1.4) :

- Le jeton de rafraîchissement expire s'il n'est pas utilisé pendant 30 jours : l'adaptateur devra le solliciter au moins une fois par mois (le rapprochement toutes les 15 min y suffit).
- L'API limite les appels par crédits sur 5 minutes (en-têtes `X-FiveMinCreditLimit-*`, `X-RequestCost`) : à surveiller dans l'adaptateur.
- Une réservation créée par l'API ne déclenche de webhook que si l'action `allowWebhooks` est passée.
- Les droits d'un jeton sont renvoyés sous la forme `read:bookings`, `write:bookings`…

| Critère | Résultat | Notes |
| --- | --- | --- |
| CA1 | | |
| CA2 | | |
| CA3 | | |
| CA4 | | |
| CA5 | | |
| CA6 | | |
| CA7 | | |
| CA8 | | |
| CA9 | | |
