# Project Brief – Le Habert insolite

Phase 1 BMAD (Analyse) · 5 novembre 2026, mis à jour le 6 novembre 2026 · Jérôme

## Résumé

Le projet construit une plateforme en propre pour le chalet du Plateau-des-Petites-Roches (Chartreuse). Elle couvre la vitrine, un journal hebdomadaire pour le référencement, la réservation directe (devis, contrat signé, paiement), le calendrier synchronisé avec Airbnb, une carte des bons plans, un assistant conversationnel avec reprise humaine et un back-office qui prépare la comptabilité pour l'expert-comptable.

Le propriétaire développe lui-même avec l'aide de Claude, en assemblant des services spécialisés plutôt qu'en tout recodant. La première version livrée est la vitrine avec le calendrier ; le journal, la réservation en ligne, la carte et l'assistant suivent par étapes.

## Contexte et problème

Aujourd'hui, toutes les réservations passent par Airbnb. L'annonce est solide : 5,0 sur 17 avis, statut Superhôte, une place parmi les logements préférés des voyageurs. Mais la relation client, le prix et les règles appartiennent à la plateforme.

Les problèmes à résoudre :

- **Dépendance** : sans canal direct, chaque voyageur fidèle revient par Airbnb et sa commission.
- **Outils éparpillés** : calendrier, contrats, paiements, messages et suivi comptable vivent dans des outils différents, ou nulle part pour les réservations directes.
- **Valeur non exploitée** : les recommandations locales (sentiers, producteurs, restaurants) ne profitent ni à la marque ni au référencement.
- **Temps passé à répondre** : les mêmes questions reviennent (accès, boîte à clés, wifi, ski).

Le gîte change aussi de marque : l'ancien nom « Petites Roches Insolites » laisse la place à « Le Habert insolite ». Le site est le support de ce lancement.

## Vision et objectifs

Vision : un voyageur découvre le chalet, réserve, signe et paie sans quitter le site, reçoit en chemin les bonnes adresses du coin, et l'hôte n'intervient que là où sa présence compte vraiment.

| Objectif | Indicateur | Cible |
| --- | --- | --- |
| Gagner en indépendance | Part des nuits réservées en direct | Plus de 75 % d'ici deux ans |
| Zéro double réservation | Conflits entre Airbnb et le site | 0 |
| Gagner du temps | Questions voyageurs traitées sans l'hôte | À fixer |
| Simplifier la compta | Temps de préparation de l'export annuel | À fixer |
| Être trouvé | Visites issues de la recherche Google et des assistants IA | À fixer après 3 mois de mesure |

## Utilisateurs

| Public | Ce qu'il veut faire | Points d'attention |
| --- | --- | --- |
| Voyageur qui découvre le chalet | Voir, vérifier les dates, réserver sans friction | Français, Belges, Luxembourgeois, Allemands, Néerlandais, Anglais : site multilingue |
| Voyageur qui a réservé | Recevoir l'accès, poser des questions, trouver les bons plans | Souvent sur mobile, parfois sans réseau en montagne |
| Hôtes (Jérôme et Laura) | Valider, suivre, reprendre la main sur une conversation | Tout doit tenir sur un téléphone |
| Expert-comptable | Recevoir des chiffres propres et justifiés | Format d'export à convenir avec lui |

## Périmètre fonctionnel

| Module | Ce qu'il fait | Hors périmètre |
| --- | --- | --- |
| Vitrine | Présentation, photos, équipements, avis, alentours, en français, anglais, allemand et néerlandais, référencement Google et assistants IA | — |
| Journal et référencement | Un article par semaine dans les 4 langues, rédigé par l'IA à partir des notes et photos de l'hôte, publié après validation ; pages thématiques, mots-clés cibles, suivi Search Console | Fiche Google Business, non autorisée pour une location de vacances |
| Calendrier | Occupation synchronisée avec Airbnb dans les deux sens, blocage manuel | Autres plateformes (Booking, Abritel) au départ |
| Réservation | Devis automatique (nuits, ménage, taxe de séjour), contrat généré, signature électronique, arrhes à la réservation, solde à l'arrivée, caution par empreinte bancaire, forfait ménage obligatoire | — |
| Carte des bons plans | Recommandations classées (randos, ski, producteurs, restos), consultables sur mobile | Avis publics des voyageurs |
| Assistant voyageurs | Répond aux questions courantes à partir des informations de l'hôte, passe la main quand il le faut ; boîte de réception unique pour les voyageurs Airbnb, directs et WhatsApp | E-mail au lancement |
| Back-office | Suivi des réservations, des encaissements et des dépenses, déclaration de taxe de séjour, export pour l'expert-comptable | Tenue de la comptabilité elle-même |

## Décision clé : le socle de réservation

Trois options ont été comparées :

| Option | Développé en propre | Avantages | Limites |
| --- | --- | --- | --- |
| A. Tout en propre | Tout | Contrôle total | Synchro Airbnb par iCal seulement (avec délai) ; pas d'accès aux messages Airbnb. L'API Airbnb est fermée aux nouveaux partenaires. |
| B. Socle + modules en propre | Vitrine, journal, carte, assistant, back-office ; un logiciel certifié gère calendrier, réservations, messagerie Airbnb | Synchro temps réel, messages Airbnb accessibles | Abonnement ; dépendance à l'API de l'éditeur |
| C. Tout chez un éditeur | Rien | Rapide | Contraire à l'objectif d'indépendance |

**Décision : option B.** Le socle sert d'infrastructure invisible ; le site reste l'unique interface. Toutes les données sont copiées dans la base de la plateforme pour que le socle reste remplaçable.

## Contraintes réglementaires

- **Contrat écrit obligatoire**, avec prix et état descriptif des lieux (article L324-2 du Code du tourisme).
- **Arrhes** : en cas d'annulation par le voyageur, elles sont perdues ; par l'hôte, il rend le double.
- **Taxe de séjour** : collectée et reversée par l'hôte pour les réservations directes ; meublé non classé = pourcentage du prix par personne et par nuit, plafonné. Tarif communal à vérifier.
- **Signature électronique** à valeur probante (eIDAS).
- **RGPD** : politique de confidentialité, durées de conservation, droits des voyageurs.
- **Classement en meublé de tourisme** : envisagé ; il remplacerait le pourcentage par un tarif fixe.

## Phasage

| Version | Contenu | Décision à prendre avant |
| --- | --- | --- |
| V1 Vitrine | Site multilingue, calendrier synchronisé, contact direct | Nom de marque (fait) |
| V1.5 Journal | Articles hebdomadaires, référencement | — |
| V2 Réservation | Devis, contrat, signature, paiement, taxe de séjour, export comptable | Logiciel socle choisi, conditions de réservation, validation juridique |
| V3 Bons plans | Carte des recommandations | — |
| V4 Assistant | Boîte de réception unique, assistant, reprise par l'hôte | Réponses types rédigées |

## Risques

| Risque | Conséquence | Parade |
| --- | --- | --- |
| Double réservation | Annulation, pénalité Airbnb | Socle certifié + revérification avant encaissement |
| Ampleur du projet pour un développeur seul | Projet qui s'enlise | Versions utilisables seules, stories courtes |
| Assistant qui répond faux | Litige | Réponses limitées aux informations de l'hôte, passage à l'hôte en cas de doute |
| Erreur de taxe de séjour ou de contrat | Redressement, contrat contestable | Modèles validés par un professionnel avant la V2 |
| Données voyageurs exposées | Atteinte RGPD | Paiement chez un prestataire spécialisé, minimum de données |

## Décisions prises

| Sujet | Décision |
| --- | --- |
| Socle de réservation | Option B : logiciel certifié Airbnb, modules en propre, données copiées chez nous |
| Nom de marque | Le Habert insolite |
| Langues au lancement | Français, anglais, allemand, néerlandais |
| Sommes versées à la réservation | Arrhes |
| Solde | Payé à l'arrivée (prélèvement automatique le jour J) |
| Caution | Empreinte bancaire, prise juste avant l'arrivée |
| Ménage | Forfait obligatoire |
| Classement meublé de tourisme | Non classé, classement envisagé |
| Canaux de l'assistant | Site, messagerie Airbnb et WhatsApp, dans une boîte de réception unique |
| Cible | Plus de 75 % des nuits en direct d'ici deux ans |
| Budget des abonnements | Arbitré selon les commissions économisées |
| Journal | Hebdomadaire, 4 langues, notes et photos de l'hôte mises en forme par l'IA, toujours validé avant publication |
| Export comptable | Ouvert : format à demander à l'expert-comptable |
