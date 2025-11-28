"use strict";

/* URL ABSOLUE AUTOMATIQUE POUR GITHUB PAGES */
function full(path) {
    return new URL(path, window.location.href).href;
}

/* ============================================================
   VARIABLES GLOBALES
============================================================ */

var isGmod = false;
var totalFiles = 0;

/* ============================================================
   EVENEMENTS GARRY'S MOD
============================================================ */

window.SetFilesTotal = function(total) {
    totalFiles = total;
    $("#file-count").text("Total : " + total + " fichiers");
};

window.SetFilesNeeded = function(needed) {
    if (totalFiles <= 0) return;

    const done = totalFiles - needed;
    const percent = (done / totalFiles) * 100;

    $("#loading-fill").css("width", percent + "%");
    $("#percent-text").text(Math.round(percent) + "%");
    $("#file-count").text("Restant : " + needed + " fichiers");
};

window.AddProgress = function(progress) {
    $("#loading-fill").css("width", progress + "%");
    $("#percent-text").text(Math.round(progress) + "%");
};

window.DownloadingFile = function(filename) {
    $("#status-text").text("Téléchargement : " + filename);
};

window.SetStatusChanged = function(status) {

    $("#status-text").text(status);

    if (status === "Workshop Complete") {
        $("#loading-fill").css("width", "80%");
        $("#percent-text").text("80%");
    }
    else if (status === "Client info sent!") {
        $("#loading-fill").css("width", "95%");
        $("#percent-text").text("95%");
    }
    else if (status === "Starting Lua...") {
        $("#loading-fill").css("width", "100%");
        $("#percent-text").text("100%");
    }
};

/* ============================================================
   GAME DETAILS (GMod)
============================================================ */

function GameDetails(servername, serverurl, mapname, maxplayers, steamid) {
    isGmod = true;

    if (Config.title)
        $("#title").html(Config.title);
    else
        $("#title").html(servername);

    if (Config.enableMap) {
        $("#map").append(mapname);
        $("#map").fadeIn();
    } else {
        $("#map").hide();
    }

    if (Config.enableSteamID)
        $("#steamid").html(steamid);

    $("#steamid").fadeIn();
}

/* ============================================================
   SYSTEME DES SOUFFLES (FOND / LOGO / MUSIQUE)
============================================================ */

function setPillar(p) {

    /* Couleur */
    document.documentElement.style.setProperty("--color", Config.colors[p]);

    /* Logo */
    $("#slayer-logo").attr("src", full("images/" + Config.logo));

    /* Musique */
    $("#music-player").attr("src", full("music/" + Config.music[p]));

    /* FOND (Backstretch - toujours visible) */
    $.backstretch(full("images/" + Config.backgrounds[p]));
}

/* ============================================================
   FADE + COUP DE SABRE
============================================================ */

function fadeToPillar(p) {

    const slash = document.getElementById("slash-mask");

    // Animation coup de sabre
    slash.classList.add("slash-open");
    slash.style.opacity = 1;

    // Après l'ouverture du sabre
    setTimeout(() => {

        // Change fond via Backstretch (fiable)
        $.backstretch(full("images/" + Config.backgrounds[p]));

        // Fermeture sabre
        setTimeout(() => {
            slash.style.opacity = 0;
            slash.classList.remove("slash-open");
        }, 600);

    }, 150);

    // Mise à jour couleur / logo / musique
    document.documentElement.style.setProperty("--color", Config.colors[p]);
    $("#slayer-logo").attr("src", full("images/" + Config.logo));
    $("#music-player").attr("src", full("music/" + Config.music[p]));
}

/* ============================================================
   ASTUCES (TIPS)
============================================================ */

function startTipsRotation() {
    if (!Config.tips || !Config.tips.length) return;

    function change() {
        const tip = Config.tips[Math.floor(Math.random() * Config.tips.length)];
        $("#tip").text(tip);
    }

    change();
    setInterval(change, 8000);
}

/* ============================================================
   INIT
============================================================ */

window.onload = () => {

    /* Premier souffle */
    setPillar(Config.pillar);

    startTipsRotation();

    /* Cycle automatique */
    if (Config.cycle.enabled) {

        let index = Config.cycle.order.indexOf(Config.pillar);
        if (index === -1) index = 0;

        setInterval(() => {
            index = (index + 1) % Config.cycle.order.length;
            fadeToPillar(Config.cycle.order[index]);
        }, Config.cycle.delay);
    }
};
