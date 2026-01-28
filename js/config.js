/*    _           _    _                     _
     | |         | |  | |                   | |
  ___| | ___  ___| | _| |     ___   __ _  __| |
 / __| |/ _ \/ _ \ |/ / |    / _ \ / _` |/ _` |
 \__ \ |  __/  __/   <| |___| (_) | (_| | (_| |
 |___/_|\___|\___|_|\_\______\___/ \__,_|\__,_|
    version 2.05 — Demon Slayer Edition
*/

/* URL du logo serveur
   Laisse vide pour n’utiliser que du texte */
var l_serverImage = "images/logo_slayers.png";

/* Nom personnalisé du serveur
   Laisse vide pour utiliser le nom envoyé par le serveur */
var l_serverName = "Perdium Demon Slayer";

/* Utiliser une vidéo comme fond ?
   Sinon on utilise les images (recommandé pour GMod) */
var l_bgVideo = false;

/* Vidéo de fond (si l_bgVideo = true) */
var l_background = "backgrounds/videos/glimmering.webm";

/* Images de fond avec leur couleur de "Souffle" associée */
var l_bgImages = [
    { src: "backgrounds/images/bg_flame.jpg", color: "#ff4e4e", shadow: "#ff0000", kanji: "炎" },
    { src: "backgrounds/images/bg_water.jpg", color: "#42cdff", shadow: "#008cff", kanji: "水" },
    { src: "backgrounds/images/bg_thunder.jpg", color: "#ffe600", shadow: "#ffaa00", kanji: "雷" },
    { src: "backgrounds/images/bg_moon.jpg", color: "#d24eff", shadow: "#8c00ff", kanji: "月" },
    { src: "backgrounds/images/bg_sun.jpg", color: "#ff4e4e", shadow: "#ff0000", kanji: "日" }
];

/* Ordre aléatoire des images de fond ? */
var l_bgImagesRandom = true;

/* Durée d’affichage de chaque fond (ms) */
var l_bgImageDuration = 7000;

/* Vitesse de fondu entre deux fonds (ms) */
var l_bgImageFadeVelocity = 3500;

/* Assombrissement de l’arrière-plan
   0 = aucun, 100 = noir complet */
var l_bgDarkening = 55;

var l_music = true;
var l_musicDisplay = true;

var l_musicPlaylist = [
    {ogg: "songs/ds_theme_1.ogg", name: "Souffle de la Lumière"},
    {ogg: "songs/ds_theme_2.ogg", name: "Souffle de la Flamme"},
    {ogg: "songs/ds_theme_3.ogg", name: "Souffle de l’Eau"}
];

var l_musicRandom = true;
var l_musicVolume = 40;


/* Activer les messages personnalisés ? */
var l_messagesEnabled = true;

/* Messages / tips Demon Slayer */
var l_messages = [
    "« Même si tu es faible, tu peux devenir fort. » — Kamado Tanjiro",
    "Affûtez votre lame comme votre esprit. La moindre hésitation peut être fatale.",
    "Les Souffles ne sont pas que des techniques : ce sont des chemins de vie.",
    "Kanao ne suit plus une pièce : elle suit son propre cœur.",
    "Les Piliers ne meurent jamais en vain, leurs pas tracent la route des suivants.",
    "Souvenez-vous : chaque démon a été humain un jour."
];

/* Ordre aléatoire des messages ? */
var l_messagesRandom = true;

/* Délai entre deux messages (ms) */
var l_messagesDelay = 6000;

/* Durée du fondu des messages (ms) */
var l_messagesFade = 1000;
