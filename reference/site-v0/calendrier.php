<?php
/*
 * calendrier.php
 * Relais entre le calendrier Airbnb et le site du gîte.
 *
 * - calendrier.php             → renvoie les périodes occupées (JSON) au site
 * - calendrier.php?format=ics  → exporte vos réservations directes au format ICS,
 *                                à importer dans Airbnb pour bloquer ces dates là-bas
 *
 * Le lien privé Airbnb reste sur le serveur : il n'apparaît jamais dans la page.
 */

date_default_timezone_set('Europe/Paris');

/* ---------- Réglages ---------- */

// Lien d'export du calendrier Airbnb (Annonce > Disponibilités > Synchroniser les calendriers)
$URL_ICS_AIRBNB = 'https://www.airbnb.fr/calendar/ical/1510871650994741174.ics?t=VOTRE_JETON_PRIVE';

// Fréquence de mise à jour, en secondes (30 minutes)
$DUREE_CACHE = 30 * 60;

// Fichier où la dernière version du calendrier est conservée
$FICHIER_CACHE = __DIR__ . '/calendrier-cache.json';

// Vos réservations prises en direct (hors Airbnb).
// La date de départ est le jour où les voyageurs partent.
$RESERVATIONS_DIRECTES = [
    // ['arrivee' => '2026-12-24', 'depart' => '2026-12-28'],
];

/* ---------- Fonctions ---------- */

function telecharger($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; CalendrierGite/1.0)',
        ]);
        $texte = curl_exec($ch);
        $code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($texte !== false && $code === 200) ? $texte : null;
    }
    $contexte = stream_context_create(['http' => [
        'timeout' => 15,
        'header'  => "User-Agent: Mozilla/5.0 (compatible; CalendrierGite/1.0)\r\n",
    ]]);
    $texte = @file_get_contents($url, false, $contexte);
    return $texte === false ? null : $texte;
}

function enDate($aaaammjj) {
    return substr($aaaammjj, 0, 4) . '-' . substr($aaaammjj, 4, 2) . '-' . substr($aaaammjj, 6, 2);
}

// Ne garde que les dates : les détails des réservations (noms, téléphones…) ne sont jamais transmis.
function lireIcs($ics) {
    $ics = preg_replace("/\r?\n[ \t]/", '', $ics); // lignes repliées
    $periodes = [];
    if (!preg_match_all('/BEGIN:VEVENT(.*?)END:VEVENT/s', $ics, $blocs)) {
        return $periodes;
    }
    foreach ($blocs[1] as $bloc) {
        if (preg_match('/^DTSTART[^:\r\n]*:(\d{8})/m', $bloc, $debut)
            && preg_match('/^DTEND[^:\r\n]*:(\d{8})/m', $bloc, $fin)) {
            $periodes[] = ['arrivee' => enDate($debut[1]), 'depart' => enDate($fin[1])];
        }
    }
    return $periodes;
}

function dateValide($s) {
    return is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s);
}

$directes = array_values(array_filter($RESERVATIONS_DIRECTES, function ($r) {
    return dateValide($r['arrivee'] ?? null) && dateValide($r['depart'] ?? null) && $r['depart'] > $r['arrivee'];
}));

/* ---------- Export ICS des réservations directes (pour Airbnb) ---------- */

if (($_GET['format'] ?? '') === 'ics') {
    header('Content-Type: text/calendar; charset=utf-8');
    $lignes = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chalet insolite en Chartreuse//Reservations directes//FR', 'CALSCALE:GREGORIAN'];
    foreach ($directes as $r) {
        $lignes[] = 'BEGIN:VEVENT';
        $lignes[] = 'UID:direct-' . $r['arrivee'] . '-' . $r['depart'] . '@chalet-chartreuse';
        $lignes[] = 'DTSTAMP:' . gmdate('Ymd\THis\Z');
        $lignes[] = 'DTSTART;VALUE=DATE:' . str_replace('-', '', $r['arrivee']);
        $lignes[] = 'DTEND;VALUE=DATE:' . str_replace('-', '', $r['depart']);
        $lignes[] = 'SUMMARY:Réservation directe';
        $lignes[] = 'END:VEVENT';
    }
    $lignes[] = 'END:VCALENDAR';
    echo implode("\r\n", $lignes) . "\r\n";
    exit;
}

/* ---------- Calendrier pour le site (JSON) ---------- */

$cache = is_file($FICHIER_CACHE) ? json_decode(@file_get_contents($FICHIER_CACHE), true) : null;
$estFrais = $cache && isset($cache['horodatage']) && (time() - $cache['horodatage'] < $DUREE_CACHE);

if (!$estFrais) {
    $ics = telecharger($URL_ICS_AIRBNB);
    if ($ics !== null && strpos($ics, 'BEGIN:VCALENDAR') !== false) {
        $cache = ['horodatage' => time(), 'airbnb' => lireIcs($ics)];
        @file_put_contents($FICHIER_CACHE, json_encode($cache), LOCK_EX);
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!$cache) {
    http_response_code(503);
    echo json_encode(['erreur' => 'Le calendrier Airbnb est momentanément injoignable.']);
    exit;
}

$aujourdhui = date('Y-m-d');
$periodes = array_values(array_filter(
    array_merge($cache['airbnb'], $directes),
    function ($p) use ($aujourdhui) { return $p['depart'] >= $aujourdhui; }
));

echo json_encode([
    'mis_a_jour' => date('c', $cache['horodatage']),
    'a_jour'     => (time() - $cache['horodatage']) < $DUREE_CACHE * 4,
    'periodes'   => $periodes,
]);
