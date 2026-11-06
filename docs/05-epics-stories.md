# Epics et stories – Le Habert insolite

Phase 3 BMAD (Solutioning) · 6 novembre 2026 · Jérôme

## Mode d'emploi

10 epics et 60 stories, réparties dans les cinq versions du PRD. Chaque story renvoie aux exigences du PRD (`02-prd.md`) qui portent ses critères d'acceptation, et aux ADR de l'architecture (`04-architecture.md`).

- **Taille** : S = une session de travail avec Claude, M = deux ou trois, L = à redécouper au moment de la commencer.
- **Ordre** : dans l'ordre des numéros au sein d'un epic, sauf mention « dépend de ».
- **Avant de coder une story** : rédiger son fichier détaillé dans `docs/stories/` (contexte, critères, fichiers concernés, tests).
- **Statut** : tenu à jour dans la colonne « Statut » (à faire, en cours, en revue, terminé).

## Définition de « terminé »

- [ ] Tests automatiques écrits et passants.
- [ ] Textes visibles du voyageur présents dans les 4 langues (NF-09).
- [ ] Écran vérifié à 375 px de large.
- [ ] Accessibilité AA vérifiée sur les écrans modifiés (NF-04).
- [ ] Messages d'erreur et états vides conformes à `03-ux.md`.
- [ ] Déployée en préproduction et relue par Jérôme.

## V1 : vitrine et calendrier

### Epic 1 : socle et fondations techniques

Une application vide mais déployée, branchée sur Beds24, protégée et sauvegardée.

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 1.1 | Commission Airbnb vérifiée, compte d'essai Beds24 testé (réservations, création, messages, webhooks), décision notée | M | V1-01, V1-02 | En cours |
| 1.2 | Projet Astro sur Cloudflare, préproduction et production, déploiement automatique, tests, conventions de code | M | NF-11, ADR-01, ADR-02 | À faire |
| 1.3 | Schéma D1 initial (séjours, voyageurs, textes traduits, audit) avec migrations | S | NF-01, ADR-03 | À faire |
| 1.4 | Adaptateur Beds24 : lecture des réservations, webhooks, rapprochement 15 min, alerte panne | L | V1-05, NF-02, ADR-04 ; dépend de 1.1 | À faire |
| 1.5 | Espace hôte protégé par Cloudflare Access | S | NF-07, ADR-12 | À faire |
| 1.6 | Export nocturne vers R2 et restauration testée | S | NF-08 | À faire |

### Epic 2 : vitrine multilingue

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 2.1 | Gabarit, charte, routage /fr /en /de /nl, sélecteur de langue | M | V1-04, NF-09 | À faire |
| 2.2 | Pages chalet, chambres, équipements, alentours, avis, contact | M | V1-03 | À faire |
| 2.3 | Calendrier d'occupation lu dans la base, demi-cases | M | V1-05 ; dépend de 1.4 | À faire |
| 2.4 | Demande de dates par e-mail ou WhatsApp, message prérempli | S | V1-06 | À faire |
| 2.5 | Prix indicatifs par saison | S | V1-07 | À faire |
| 2.6 | Référencement technique : données structurées, hreflang, plan du site, Search Console | M | V1-08, V15-10 | À faire |
| 2.7 | Mentions légales, confidentialité, mesure d'audience sans cookie | S | V1-09, NF-05 | À faire |
| 2.8 | Espace hôte : édition des textes et prix indicatifs, traduction à relire | M | V1-10 ; dépend de 1.5 | À faire |
| 2.9 | Mise en ligne sur le nouveau domaine, redirections depuis l'ancien site, contrôle de performance | S | NF-03 | À faire |

## V1.5 : journal et référencement

### Epic 3 : journal

Peut démarrer dès la fin de l'epic 2, en parallèle de la V2.

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 3.1 | Rubrique Journal : liste par thème, page article, auteur, données structurées | M | V15-01, V15-09 | À faire |
| 3.2 | Brouillon depuis le téléphone : notes ou dictée, photos, lieu ; proposition par Claude | M | V15-02 | À faire |
| 3.3 | Traductions adaptées EN/DE/NL, relecture côte à côte | M | V15-03 | À faire |
| 3.4 | Validation, publication immédiate ou programmée ; cache et plan du site mis à jour | S | V15-04 | À faire |
| 3.5 | Rappel hebdomadaire avec idée de sujet, tableau des articles prévus | S | V15-05 | À faire |
| 3.6 | Liens internes automatiques, pages thématiques | M | V15-06, V15-08 | À faire |
| 3.7 | Mots-clés cibles par langue, suivi des visites issues de la recherche | M | V15-07, V15-11 | À faire |
| 3.8 | Lettre d'information mensuelle (volontaires) | S | V15-13 | À faire |

V15-12 (Google Location de vacances) n'a pas de story : reportée (ADR-10).

## V2 : réservation, paiement et back-office

### Epic 4 : tarifs et devis

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 4.1 | Règles de prix (saisons, week-ends, vacances de 4 pays, dernière minute, durée minimale), aperçu 3 mois | M | V2-02 | À faire |
| 4.2 | Moteur de devis : nuits, ménage, taxe de séjour (non classé ou classé), arrhes et solde | M | V2-01, V2-14 | À faire |
| 4.3 | Envoi des prix au socle, majoration Airbnb réglable | S | V2-02, ADR-04 ; dépend de 4.1 | À faire |

### Epic 5 : tunnel de réservation

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 5.1 | Verrou de créneau 15 min, unicité sur les nuits | S | V2-03 | À faire |
| 5.2 | Écrans dates, devis, coordonnées ; devis toujours visible | M | V2-01 ; dépend de 4.2 | À faire |
| 5.3 | Contrat dans la langue du voyageur, signature simple avec preuves | L | V2-04, ADR-07 ; dépend de la validation juridique | À faire |
| 5.4 | Arrhes autorisées → réservation créée dans le socle → encaissement ; carte enregistrée | L | V2-03, V2-05, NF-06, ADR-05 | À faire |
| 5.5 | Cas particuliers : créneau expiré, signature abandonnée, paiement refusé, dates prises | M | UX | À faire |

### Epic 6 : séjour et paiements planifiés

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 6.1 | Espace séjour par lien signé : statut, paiements, contrat, factures | M | V2-11 | À faire |
| 6.2 | Livret d'accueil en ligne, hors connexion, aussi pour Airbnb | M | V2-10 | À faire |
| 6.3 | Workflow : livret J-3, caution J-2, solde J0, code, caution libérée J+2 | L | V2-06, V2-07, ADR-06 ; dépend de 5.4 | À faire |
| 6.4 | Annulation voyageur ou hôte, règles des arrhes, dates libérées | M | V2-08 | À faire |
| 6.5 | E-mails automatiques dans les 4 langues, domaine authentifié | M | V2-09 | À faire |

### Epic 7 : back-office

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 7.1 | Tableau de bord « à traiter », liste des séjours Airbnb et directs | M | V2-11 | À faire |
| 7.2 | Factures numérotées, taxe de séjour à part | S | V2-12 | À faire |
| 7.3 | Registre recettes (directes + versements Airbnb) et dépenses avec justificatif | M | V2-13 | À faire |
| 7.4 | État de taxe de séjour par période, rappel avant échéance | S | V2-14 | À faire |
| 7.5 | Export annuel pour l'expert-comptable | S | V2-15 ; dépend du format demandé | À faire |
| 7.6 | Export et suppression des données d'un voyageur | S | NF-05 | À faire |
| 7.7 | Suivi des coûts des services vs commissions évitées | S | NF-10 | À faire |

## V3 : carte des bons plans

### Epic 8 : carte

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 8.1 | Carte Leaflet sur Plan IGN, repli OSM, position du chalet approximative/exacte | M | V3-01, ADR-11 | À faire |
| 8.2 | Fiches lieu dans les 4 langues, catégories, filtres par saison | M | V3-02, V3-03 | À faire |
| 8.3 | Ajout d'un lieu depuis le téléphone, position au doigt ou GPS | M | V3-04 | À faire |
| 8.4 | Réseau faible, lien d'itinéraire | S | V3-05 | À faire |
| 8.5 | Page publique indexable par lieu, reliée au journal | S | V3-06, V15-06 | À faire |
| 8.6 | Tracés de randonnée et export GPX | L | V3-07 | À faire |

## V4 : assistant et boîte de réception unique

### Epic 9 : boîte de réception unique

Peut être avancé juste après la V2.

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 9.1 | Fils et messages en base ; messages Airbnb via le socle | M | V4-01, V4-02, ADR-08 | À faire |
| 9.2 | WhatsApp : compte pro, réception, envoi, modèles de rappel | M | V4-01, V4-10 | À faire |
| 9.3 | Chat du site et du livret en temps réel | M | V4-01 | À faire |
| 9.4 | Interface mobile : liste, fil, bandeau séjour, notification | L | V4-01, V4-02 | À faire |

### Epic 10 : assistant

| Story | Livrable | Taille | Exigences, ADR | Statut |
| --- | --- | --- | --- | --- |
| 10.1 | Base de connaissances éditable en 4 langues | M | V4-03, ADR-09 | À faire |
| 10.2 | Réponses dans la langue du voyageur ; modes automatique, brouillon, manuel | M | V4-03, V4-04, V4-07 ; dépend de 9.4 | À faire |
| 10.3 | Sujets sensibles et urgences → passage à l'hôte, notification, message d'attente | M | V4-05, V4-09 | À faire |
| 10.4 | Reprendre la main et la rendre | S | V4-06 | À faire |
| 10.5 | Ajouter une réponse corrigée à la base en un geste | S | V4-08 | À faire |
| 10.6 | Règles propres à chaque canal | S | V4-10 | À faire |
| 10.7 | Chat avant réservation avec devis du moteur | M | V4-11 ; dépend de 4.2 | À faire |

## Contrôle de cohérence (implementation readiness)

Verdict : V1 et V1.5 peuvent démarrer ; V2 sous conditions ; V3 et V4 prêtes sur le fond.

Toutes les exigences sont couvertes, sauf V15-12, volontairement reportée (ADR-10). Les écarts entre documents relevés le 6 novembre 2026 ont été corrigés dans ce dépôt (Yousign retiré du PRD, V1.5 ajoutée au phasage du brief, envoi du code de la boîte à clés marqué « à confirmer » partout).

Décisions à prendre avant certaines stories :

| Avant la story | Décision ou action | Qui |
| --- | --- | --- |
| 1.1 | Vérifier la commission Airbnb actuelle sur les versements | Jérôme |
| 4.1, 4.2, 5.2 | Pourcentage des arrhes, caution, forfait ménage, durée minimale, conditions d'annulation | Jérôme |
| 4.2 | Tarif de taxe de séjour de la commune | Jérôme (mairie ou simulateur officiel) |
| 5.3 | Validation du modèle de contrat et du procédé de signature | Un juriste |
| 6.3 | Envoi du code conditionné au solde : oui ou non | Jérôme |
| 7.5 | Format d'export | Expert-comptable |
| 9.2 | Numéro dédié WhatsApp Business | Jérôme |
