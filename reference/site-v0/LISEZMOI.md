# Site du Chalet insolite en Chartreuse

## Contenu du dossier

- `index.html` : le site (une seule page).
- `calendrier.php` : récupère le calendrier Airbnb toutes les 30 minutes et le transmet au site. Votre lien privé Airbnb reste sur le serveur.
- `mentions-legales.html` : page obligatoire, à compléter.
- `images/` : déposez-y vos photos (voir les noms ci-dessous).

## 1. Choisir un hébergement

Prenez un hébergement web « mutualisé » avec PHP et un nom de domaine (par exemple chalet-chartreuse.fr). OVHcloud, o2switch ou Infomaniak proposent ce type d'offre pour quelques euros par mois, avec en prime une adresse e-mail à votre nom.

## 2. Personnaliser

Dans `index.html`, tout en bas, modifiez le bloc `CONFIG` :

    email: "contact@votre-gite.fr",
    telephone: "06 00 00 00 00",

Complétez aussi `mentions-legales.html` (vos coordonnées, celles de l'hébergeur, et le numéro d'enregistrement du meublé si votre commune en délivre un).

## 3. Ajouter les photos

Placez vos photos dans `images/` avec exactement ces noms (format paysage, environ 1600 px de large, moins de 500 Ko chacune) :

ouverture.jpg, salon.jpg, cuisine.jpg, vue.jpg, exterieur.jpg, salle-de-bain.jpg, chambre-1.jpg, chambre-2.jpg

Une photo absente laisse simplement un emplacement hachuré.

## 4. Mettre en ligne

Envoyez tout le dossier à la racine de votre hébergement (gestionnaire de fichiers de l'hébergeur ou logiciel FTP comme FileZilla). Ouvrez ensuite `https://votre-domaine.fr/calendrier.php` : vous devez voir une liste de dates. Le calendrier du site affiche alors vos vraies réservations.

Sur votre ordinateur, avant mise en ligne, le calendrier affiche des dates fictives : c'est normal.

## 5. Réservations prises en direct

Quand un voyageur réserve via votre site, ajoutez ses dates dans `calendrier.php` :

    $RESERVATIONS_DIRECTES = [
        ['arrivee' => '2026-12-24', 'depart' => '2026-12-28'],
    ];

Elles apparaissent aussitôt comme réservées sur votre site.

Pour qu'Airbnb bloque aussi ces dates automatiquement : dans Airbnb, Annonce > Disponibilités > Synchroniser les calendriers > Importer un calendrier, et collez l'adresse
`https://votre-domaine.fr/calendrier.php?format=ics`. Airbnb la relit régulièrement (pas instantanément : bloquez les dates à la main sur Airbnb si la réservation est imminente).
