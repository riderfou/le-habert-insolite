# PRD – Plateforme Le Habert insolite

Phase 2 BMAD (Planification) · 5 novembre 2026, mis à jour le 6 novembre 2026 · Jérôme

## Objectifs

La plateforme doit porter plus de 75 % des nuits réservées en direct d'ici deux ans, sans double réservation et en centralisant toute la relation voyageur sur le site. Ce PRD décrit quoi construire ; le comment revient à l'architecture (`04-architecture.md`).

| Objectif | Indicateur | Cible |
| --- | --- | --- |
| Indépendance | Part des nuits réservées en direct | Plus de 75 % d'ici deux ans |
| Fiabilité | Doubles réservations | 0 |
| Relation centralisée | Messages voyageurs traités hors du site | 0 après la V4 |
| Temps gagné | Questions résolues par l'assistant sans l'hôte | À mesurer en V4 |
| Compta | Export annuel produit en un clic | Format validé par l'expert-comptable |
| Être trouvé | Visites issues de la recherche, par langue ; articles publiés | Un article par semaine ; cible de visites à fixer après 3 mois |

Conventions : chaque exigence porte un identifiant (V1-01…), une priorité (Indispensable, Important, Souhaitable) et des critères d'acceptation vérifiables.

## Choix du logiciel socle

Recommandation : tester Beds24 en premier. Partenaire officiel Airbnb ; son API couvre les réservations, les disponibilités et les messages Airbnb ; c'est l'option la moins chère. Le logiciel sert d'infrastructure invisible ; le site reste l'unique interface.

| Critère | Beds24 | Smoobu | Lodgify |
| --- | --- | --- | --- |
| Partenaire Airbnb (API officielle) | Oui | Oui | Oui |
| Réservations et disponibilités par API | Oui ; une réservation créée par API est répercutée sur Airbnb | Oui | Oui |
| Messages Airbnb lus et envoyés par API | Oui, `/bookings/messages` | Oui | Oui |
| Notifications (webhooks) | Oui, à activer auprès du support | Oui | Oui |
| Accès à l'API | Inclus selon certains comparatifs, réservé à l'offre complète selon d'autres : à confirmer pendant le test | Offre Professionnelle | Exclu de l'offre Starter |
| Coût indicatif pour un logement | Environ 17 € par mois | À vérifier | À partir de 33 € par mois |

Le choix final se fait sur un test réel (story 1.1) :

- [ ] Connecter l'annonce Airbnb au socle en compte d'essai.
- [ ] Lire les réservations et créer une réservation de test par l'API, puis vérifier le blocage sur Airbnb et son délai.
- [ ] Lire et envoyer un message Airbnb par l'API.
- [ ] Recevoir une notification (webhook) de nouvelle réservation.

**Règle d'indépendance** : toutes les données (réservations, voyageurs, messages, contenus) sont copiées dans la base de la plateforme. Le socle doit pouvoir être remplacé sans perdre l'historique.

## Parcours clés

**Voyageur en direct**

1. Découvre le chalet sur le site, dans sa langue.
2. Choisit ses dates et le nombre de voyageurs ; voit le devis détaillé (nuits, ménage, taxe de séjour).
3. Saisit ses coordonnées, signe le contrat en ligne.
4. Paie les arrhes et enregistre sa carte ; la réservation est créée dans le socle, ce qui bloque Airbnb.
5. Avant l'arrivée : reçoit le livret d'accueil ; l'empreinte de caution est prise.
6. Le jour de l'arrivée : le solde est prélevé automatiquement ; le code de la boîte à clés est envoyé (condition au paiement du solde : question ouverte).
7. Pendant le séjour : pose ses questions à l'assistant (site ou WhatsApp), consulte la carte des bons plans.
8. Après le départ : la caution est libérée, la facture est envoyée.

**Voyageur Airbnb**

1. Réserve et paie sur Airbnb ; la réservation arrive dans la plateforme via le socle.
2. Échange dans la messagerie Airbnb ; ses messages apparaissent dans la boîte de réception unique et l'assistant peut y répondre.
3. Reçoit le lien du livret d'accueil et de la carte.
4. Découvre la marque par le site, le livret et la carte ; aucune incitation à réserver hors d'Airbnb n'est envoyée par la messagerie Airbnb, que ses règles interdisent (à vérifier dans les conditions en vigueur).

**Hôte**

1. Ouvre une seule boîte de réception regroupant Airbnb, site et WhatsApp.
2. Voit ce que l'assistant a répondu, reprend la main quand il le juge utile.
3. Suit les arrivées, les paiements et les cautions sur un tableau de bord.
4. Ajuste les prix et bloque des dates depuis la plateforme.
5. Exporte une fois par an les chiffres pour l'expert-comptable et prépare la déclaration de taxe de séjour.

## V1 : vitrine et calendrier

La V1 met en ligne le site de la marque, en quatre langues, avec un calendrier fiable tiré du socle. On y contacte l'hôte ; on n'y réserve pas encore.

| ID | Exigence | Priorité | Critères d'acceptation |
| --- | --- | --- | --- |
| V1-01 | Tester et choisir le logiciel socle | Indispensable | Les quatre vérifications ci-dessus sont passées ; le choix est noté dans l'architecture |
| V1-02 | Connecter l'annonce Airbnb au socle | Indispensable | Réservations Airbnb visibles dans le socle ; un blocage dans le socle apparaît sur Airbnb |
| V1-03 | Pages vitrine : chalet, chambres, équipements, alentours, avis, contact | Indispensable | Contenu repris du site actuel ; photos réelles ; affichage correct sur téléphone |
| V1-04 | Quatre langues : français, anglais, allemand, néerlandais | Indispensable | Chaque page existe dans les 4 langues ; sélecteur visible ; langue du navigateur proposée par défaut |
| V1-05 | Calendrier d'occupation lu dans le socle | Indispensable | Toute réservation Airbnb apparaît sur le site en moins de 5 minutes ; jours d'arrivée et de départ affichés à moitié |
| V1-06 | Demande de dates par e-mail ou WhatsApp | Indispensable | Sélection de dates dans le calendrier ; message prérempli dans la langue du voyageur |
| V1-07 | Prix indicatifs (« à partir de ») par saison | Important | Prix saisis par l'hôte ; affichés sans promesse de devis |
| V1-08 | Référencement Google et assistants IA | Important | Données structurées d'hébergement ; une adresse par langue avec hreflang ; plan du site déclaré |
| V1-09 | Mentions légales et confidentialité | Indispensable | Pages complètes dans les 4 langues ; aucun cookie de suivi sans consentement |
| V1-10 | Espace hôte sécurisé, première brique | Important | Connexion de l'hôte ; modification des prix indicatifs et des textes sans toucher au code |

## V1.5 : journal et référencement

Ajoutée après la V1 (workflow BMAD « correct course »). Le référencement remplace l'acquisition apportée par Airbnb ; comme il met des mois à produire ses effets, il démarre juste après la V1, en parallèle de la V2.

Principe éditorial : un article par semaine, nourri par le vécu de l'hôte. L'hôte donne des notes et des photos ; l'IA rédige et traduit dans les 4 langues ; rien n'est publié sans validation. Google accepte les contenus rédigés avec l'aide de l'IA mais pénalise les pages produites en masse sans valeur ajoutée (« scaled content abuse ») : l'originalité vient de l'expérience sur place.

| ID | Exigence | Priorité | Critères d'acceptation |
| --- | --- | --- | --- |
| V15-01 | Rubrique Journal | Indispensable | Liste par date et par thème (randos et sorties, saison et conditions, producteurs et tables, vie du chalet) ; une adresse lisible par article et par langue |
| V15-02 | Brouillon à partir de notes | Indispensable | Depuis le téléphone : notes écrites ou dictées, photos, lieu ; l'IA propose titre, texte, description pour Google et texte alternatif des photos |
| V15-03 | Traduction adaptée | Indispensable | Versions anglaise, allemande et néerlandaise marquées « à relire » ; adaptation des références, pas de mot à mot |
| V15-04 | Validation obligatoire | Indispensable | Aucun article publié sans le clic de l'hôte ; publication immédiate ou programmée |
| V15-05 | Rythme hebdomadaire | Important | Rappel chaque semaine avec une idée de sujet tirée de la saison et des bons plans ; tableau des articles prévus |
| V15-06 | Liens internes | Important | Chaque article renvoie vers les lieux de la carte, les disponibilités et les articles proches |
| V15-07 | Mots-clés cibles par langue | Important | Liste de requêtes visées par langue (ex. gîte Chartreuse, chalet Plateau des Petites Roches, Ferienhaus Chartreuse, vakantiehuis Isère), suivie dans l'espace hôte |
| V15-08 | Pages thématiques | Important | Pages durables par activité et par saison, qui regroupent articles et lieux |
| V15-09 | Données structurées | Indispensable | Article, hébergement et fil d'Ariane balisés ; auteur identifié (Jérôme, Laura) |
| V15-10 | Lisibilité par les assistants IA | Important | Réponses factuelles claires sur chaque page ; pas de contenu masqué derrière un script |
| V15-11 | Suivi | Indispensable | Search Console reliée ; tableau des visites issues de la recherche, par langue et par article |
| V15-12 | Google Location de vacances | Souhaitable | Reporté (ADR-10) : le lien mène à la page de réservation de Beds24, pas à notre tunnel |
| V15-13 | Lettre d'information | Souhaitable | Inscription volontaire des anciens voyageurs directs ; envoi des articles du mois |

La fiche Google Business n'est pas autorisée pour un logement de vacances : exclue.

## V2 : réservation, paiement et back-office

| ID | Exigence | Priorité | Critères d'acceptation |
| --- | --- | --- | --- |
| V2-01 | Devis automatique | Indispensable | Total = nuits au tarif du jour + forfait ménage + taxe de séjour, détaillé ligne à ligne ; 4 voyageurs au maximum ; durée minimale respectée |
| V2-02 | Tarification par règles | Important | Saisons, week-ends, vacances scolaires de France, Belgique, Pays-Bas et Allemagne, dernière minute, prix pour combler un trou ; prix transmis au socle, donc à Airbnb, avec une majoration réglable |
| V2-03 | Réservation sans double vente | Indispensable | Créneau verrouillé pendant le paiement ; disponibilité revérifiée dans le socle avant confirmation ; réservation créée dans le socle à la confirmation |
| V2-04 | Contrat généré et signé en ligne | Indispensable | Mentions du Code du tourisme, état descriptif, nature des arrhes, conditions d'annulation ; dans la langue du voyageur ; signature électronique simple intégrée (ADR-07) ; PDF signé archivé et envoyé |
| V2-05 | Paiement des arrhes | Indispensable | Pourcentage réglable ; carte enregistrée pour le solde avec l'accord explicite du voyageur |
| V2-06 | Solde prélevé le jour de l'arrivée | Indispensable | Prélèvement automatique ; en cas d'échec, alerte à l'hôte et lien de paiement au voyageur ; code de la boîte à clés envoyé une fois le solde réglé (à confirmer) |
| V2-07 | Caution par empreinte bancaire | Important | Prise 2 jours avant l'arrivée (réglable) ; libérée automatiquement après le départ sauf action de l'hôte ; montant réglable |
| V2-08 | Annulation | Indispensable | Par le voyageur : arrhes conservées ; par l'hôte : double des arrhes remboursé ; dates libérées dans le socle |
| V2-09 | Messages automatiques | Important | Confirmation, rappel, livret d'accueil, facture ; dans les 4 langues |
| V2-10 | Livret d'accueil en ligne | Important | Accès, wifi, règles de la maison, contacts ; lien privé par séjour ; aussi pour les voyageurs Airbnb |
| V2-11 | Tableau de bord de l'hôte | Indispensable | Arrivées à venir, statut du contrat, des paiements et de la caution pour chaque séjour ; utilisable sur téléphone |
| V2-12 | Facture voyageur | Indispensable | Numérotée ; taxe de séjour sur une ligne à part |
| V2-13 | Registre des recettes et dépenses | Important | Recettes directes et versements Airbnb importés automatiquement ; dépenses saisies avec photo du justificatif |
| V2-14 | Taxe de séjour | Indispensable | Calcul en mode non classé (pourcentage par personne et par nuit, plafonné) et classé (tarif fixe) ; état par période pour la déclaration |
| V2-15 | Export pour l'expert-comptable | Indispensable | Format validé avec lui (tableur par défaut) ; recettes, dépenses et justificatifs de l'année en un clic |

## V3 : carte des bons plans

| ID | Exigence | Priorité | Critères d'acceptation |
| --- | --- | --- | --- |
| V3-01 | Carte interactive des lieux recommandés | Indispensable | Fond Plan IGN, repli OpenStreetMap ; position du chalet approximative en public, exacte dans le livret |
| V3-02 | Fiches lieu | Indispensable | Nom, catégorie, avis de l'hôte, conseil pratique, saison, lien ; dans les 4 langues |
| V3-03 | Catégories et filtres | Important | Randonnée, VTT, ski, producteurs, restaurants, sorties en famille, par mauvais temps ; filtre par saison |
| V3-04 | Saisie par l'hôte | Indispensable | Ajout d'un lieu depuis le téléphone, position au doigt ou par GPS |
| V3-05 | Usage en montagne | Important | Fiches lisibles avec un réseau faible ; lien d'itinéraire vers l'application de navigation |
| V3-06 | Pages publiques par lieu | Souhaitable | Une page indexable par recommandation |
| V3-07 | Itinéraires de randonnée | Souhaitable | Tracé et export GPX ; composant cartographique éventuellement partagé avec l'application de randonnée de l'hôte |

## V4 : assistant et boîte de réception unique

La boîte de réception sans assistant (V4-01, V4-02) peut être avancée juste après la V2.

| ID | Exigence | Priorité | Critères d'acceptation |
| --- | --- | --- | --- |
| V4-01 | Boîte de réception unique | Indispensable | Messages Airbnb (via le socle), chat du site et WhatsApp dans une seule liste ; réponse possible sur chaque canal |
| V4-02 | Fil par séjour | Indispensable | Tous les messages d'un voyageur rattachés à sa réservation, quel que soit le canal |
| V4-03 | Réponses fondées sur les informations de l'hôte | Indispensable | Livret, règles, FAQ, carte et données du séjour ; jamais un prix hors du moteur de devis |
| V4-04 | Trois modes par conversation | Indispensable | Automatique, brouillon à valider, manuel ; réglable par canal et par conversation |
| V4-05 | Passage à l'hôte | Indispensable | Transfert en cas de doute ou de sujet sensible (réclamation, dégât, annulation, remboursement, urgence) ; notification ; message d'attente au voyageur |
| V4-06 | Reprise en main | Indispensable | L'hôte intervient à tout moment ; l'assistant se tait jusqu'à ce qu'on lui rende la main |
| V4-07 | Langue du voyageur | Indispensable | Réponse dans la langue du message reçu, parmi les 4 langues au minimum |
| V4-08 | Apprentissage par correction | Important | Une réponse corrigée peut être ajoutée à la base de connaissances en un geste |
| V4-09 | Urgences | Indispensable | Toute mention d'urgence déclenche le passage à l'hôte et rappelle le 112 |
| V4-10 | Règles des canaux | Indispensable | Messagerie Airbnb : aucune coordonnée ni incitation à réserver ailleurs ; WhatsApp : fenêtre de réponse de 24 h imposée par Meta |
| V4-11 | Chat avant réservation | Important | Sur le site, répond aux questions des visiteurs et propose un devis issu du moteur |

## Exigences non fonctionnelles

| ID | Domaine | Exigence |
| --- | --- | --- |
| NF-01 | Indépendance | Toutes les données copiées dans la base de la plateforme ; socle remplaçable sans perte d'historique |
| NF-02 | Fiabilité | Zéro double réservation ; alerte si la synchronisation avec le socle échoue plus de 15 minutes |
| NF-03 | Mobile | Site et espace hôte utilisables sur téléphone ; pages vitrine chargées en moins de 2 s en 4G |
| NF-04 | Accessibilité | Niveau AA des WCAG pour les pages publiques |
| NF-05 | Données personnelles | RGPD : registre, durées de conservation, droit d'accès et d'effacement ; minimum de données |
| NF-06 | Paiement | Aucune donnée de carte stockée par la plateforme |
| NF-07 | Sécurité | Espace hôte protégé par double authentification ; clés d'API jamais exposées dans le navigateur |
| NF-08 | Sauvegarde | Sauvegarde quotidienne de la base et des documents ; restauration testée |
| NF-09 | Langues | Tout texte visible par un voyageur existe dans les 4 langues ; langue manquante → anglais |
| NF-10 | Coûts | Coût mensuel des services suivi et comparé aux commissions évitées |
| NF-11 | Maintenabilité | Code documenté et testé automatiquement, repris story par story avec Claude |

## Hors périmètre

- Autres plateformes (Booking.com, Abritel) : possibles plus tard via le socle.
- Tarification calée sur les prix des concurrents.
- Tenue de la comptabilité : elle reste chez l'expert-comptable.
- Application mobile installable.

## Questions restantes

- [ ] Format d'export demandé par l'expert-comptable.
- [ ] Pourcentage des arrhes, montant de la caution, forfait ménage, durée minimale de séjour.
- [ ] Conditions d'annulation (délais, cas particuliers).
- [ ] Envoi du code de la boîte à clés conditionné au paiement du solde : oui ou non ?
- [ ] Règles Airbnb sur les liens envoyés aux voyageurs (livret, carte) : à vérifier avant la V2.
- [ ] Tarif de taxe de séjour de la commune, et calendrier du classement.
