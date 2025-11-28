"use strict";

/* ============================================================
                   VARIABLES GLOBALES
============================================================ */

var isGmod = false;
var isTest = false;

/* ============================================================
                   EVENEMENTS GARRY'S MOD
============================================================ */

/* --- Nombre total de fichiers --- */
window.SetFilesTotal = function(total) {
    const fc = document.getElementById("file-count");
    if (fc) fc.textContent = "Total : " + total + " fichiers";
    window.totalFiles = total;
};

/* --- Nombre de fichiers restants --- */
window.SetFilesNeeded = function(needed) {
    if (!window.totalFiles || window.totalFiles <= 0) return;

    const done = window.totalFiles - needed;
    const percent = (done / window.totalFiles) * 100;

    // Barre
    document.getElementById("loading-fill").style.width = percent + "%";

    // Texte du pourcentage
    const pct = document.getElementById("percent-text");
    if (pct) pct.textContent = Math.round(percent) + "%";

    // Compteur
    const fc = document.getElementById("file-count");
    if (fc) fc.textContent = "Restant : " + needed + " fichiers";
};

/* --- Progression brute envoyée par GMod --- */
window.AddProgress = function(progress) {
    const fill = document.getElementById("loading-fill");
    if (fill) fill.style.width = progress + "%";

    const pct = document.getElementById("percent-text");
    if (pct) pct.textContent = Math.round(progress) + "%";
};

/* --- Fichier en cours de téléchargement --- */
window.DownloadingFile = function(filename) {
    filename = filename.replace("'", "").replace("?", "");

    const st = document.getElementById("status-text");
    if (st) st.textContent = "Téléchargement : " + filename;

    const hist = document.getElementById("history");
    if (hist) {
        hist.innerHTML =
            '<div class="history-item">' + filename + "</div>" +
            hist.innerHTML;
    }

    const items = document.querySelectorAll(".history-item");
    items.forEach((el, i) => {
        if (i > 10) el.remove();
        el.style.opacity = (1 - i * 0.1);
    });
};

/* --- Changement de statut général --- */
window.SetStatusChanged = function(status) {

    const st = document.getElementById("status-text");
    if (st) st.textContent = status;

    const hist = document.getElementById("history");
    if (hist) {
        hist.innerHTML =
            '<div class="history-item">' + status + "</div>" +
            hist.innerHTML;

        const items = document.querySelectorAll(".history-item");
        items.forEach((el, i) => {
            if (i > 10) el.remove();
            el.style.opacity = (1 - i * 0.1);
        });
    }

    // Boost de progression suivant le status GMod
    if (status === "Workshop Complete") {
        document.getElementById("loading-fill").style.width = "80%";
        document.getElementById("percent-text").textContent = "80%";
    }

    else if (status === "Client info sent!") {
        document.getElementById("loading-fill").style.width = "95%";
        document.getElementById("percent-text").textContent = "95%";
    }

    else if (status === "Starting Lua...") {
        document.getElementById("loading-fill").style.width = "100%";
        document.getElementById("percent-text").textContent = "100%";
    }
};

/* --- Informations principales envoyées par GMod --- */
function GameDetails(servername, serverurl, mapname, maxplayers, steamid) {
    isGmod = true;
    if (!isTest) loadAll();

    // Nom du serveur
    if (Config.title) {
        $("#title").html(Config.title);
    } else {
        $("#title").html(servername);
    }
    $("#title").fadeIn();

    // Map
    if (Config.enableMap) {
        $("#map").append(mapname);
        $("#map").fadeIn();
    } else {
        $("#map").hide();
    }

    // SteamID
    if (Config.enableSteamID) {
        $("#steamid").html(steamid);
    }
    $("#steamid").fadeIn();
}

/* ============================================================
                   CHARGEMENT VISUEL / UI
============================================================ */

function loadAll() {
    $("nav").fadeIn();
    $("main").fadeIn();
}

/* ============================================================
                   SYSTEME DES SOUFFLES / ASSETS
============================================================ */

/* --- Applique un souffle (couleur, fond, musique, logo) --- */
function setPillar(p) {

    document.documentElement.style.setProperty("--color", Config.colors[p]);

    const logo = document.getElementById("slayer-logo");
    if (logo) logo.src = "images/" + Config.logo;

    const bg = document.getElementById("background");
    if (bg) bg.style.backgroundImage = 'url("' + window.location.origin + "/images/" + Config.backgrounds[p] + '")';

    const music = document.getElementById("music-player");
    if (music) music.src = "music/" + Config.music[p];
}

/* --- Transition douce --- */
function fadeToPillar(p) {

    const bg = document.getElementById("background");
    const bgNext = document.getElementById("background-next");
    const slash = document.getElementById("slash-mask");

    const nextImage = window.location.origin + "/images/" + Config.backgrounds[p]

    // PRÉCHARGE l’image suivante
    const img = new Image();
    img.src = nextImage;

    img.onload = () => {

        /* ------------------------------
           1) Prépare le background suivant
        --------------------------------- */

        bgNext.style.backgroundImage = 'url("' + nextImage + '")';
        bgNext.style.opacity = 0; // invisible au début

        /* ------------------------------
           2) Effet coup de sabre
        --------------------------------- */

        slash.classList.add("slash-open");
        slash.style.opacity = 1;

        // Après ouverture rapide du sabre
        setTimeout(() => {

            // On montre le background suivant
            bgNext.style.opacity = 1;

            // L'ancien disparaît
            bg.style.opacity = 0;

            // Transition de 1 seconde
            setTimeout(() => {

                // Nouveau background devient le principal
                bg.style.backgroundImage = bgNext.style.backgroundImage;

                // Reset des opacités
                bg.style.opacity = 1;
                bgNext.style.opacity = 0;

                // Disparition du sabre
                slash.style.opacity = 0;
                slash.classList.remove("slash-open");

            }, 600);

        }, 150); // délai du slash

        /* ------------------------------
           3) Apply couleur / logo / musique
        --------------------------------- */

        document.documentElement.style.setProperty("--color", Config.colors[p]);
        document.getElementById("slayer-logo").src = "images/" + Config.logo;
        document.getElementById("music-player").src = "music/" + Config.music[p];
    };
}


/* ============================================================
                   ASTUCES (TIPS)
============================================================ */

function startTipsRotation() {
    if (!Config.tips || !Config.tips.length) return;

    const tipEl = document.getElementById("tip");
    if (!tipEl) return;

    function setRandomTip() {
        const tip = Config.tips[Math.floor(Math.random() * Config.tips.length)];
        tipEl.textContent = tip;
    }

    setRandomTip();
    setInterval(setRandomTip, 8000); // 8 secondes
}

/* ============================================================
                   CHARGEMENT INITIAL
============================================================ */

window.onload = () => {

    // Premier souffle
    setPillar(Config.pillar);

    // Rotation des tips
    startTipsRotation();

    // Cycle automatique des souffles
    if (Config.cycle.enabled) {
        let index = Config.cycle.order.indexOf(Config.pillar);
        if (index === -1) index = 0;

        setInterval(() => {
            index = (index + 1) % Config.cycle.order.length;
            fadeToPillar(Config.cycle.order[index]);
        }, Config.cycle.delay);
    }
};
