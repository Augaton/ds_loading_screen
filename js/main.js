"use strict";

/* ==============================================
       URL ABSOLUE AUTOMATIQUE (GitHub Pages)
============================================== */
function full(path) {
    return new URL(path, window.location.href).href;
}

/* ==============================================
                GMod Events
============================================== */

var totalFiles = 0;

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

window.DownloadingFile = function(fileName) {
    $("#status-text").text("Téléchargement : " + fileName);
};

window.SetStatusChanged = function(status) {
    $("#status-text").text(status);

    if (status === "Workshop Complete") {
        $("#loading-fill").css("width", "80%");
        $("#percent-text").text("80%");
    }
    if (status === "Client info sent!") {
        $("#loading-fill").css("width", "95%");
        $("#percent-text").text("95%");
    }
    if (status === "Starting Lua...") {
        $("#loading-fill").css("width", "100%");
        $("#percent-text").text("100%");
    }
};

/* ==============================================
        CHARGEMENT / BACKGROUND / LOGO / MUSIQUE
============================================== */

function setPillar(p) {

    document.documentElement.style.setProperty("--color", Config.colors[p]);

    $("#slayer-logo").attr("src", full("images/" + Config.logo));

    $("#music-player").attr("src", full("music/" + Config.music[p]));

    // Backstretch pour afficher le fond
    $.backstretch(full("images/" + Config.backgrounds[p]));
}

/* ==============================================
           Coup de sabre + changement de fond
============================================== */

function fadeToPillar(p) {

    const slash = document.getElementById("slash-mask");

    // Effet coup de sabre
    slash.classList.add("slash-open");
    slash.style.opacity = 1;

    setTimeout(() => {

        // Changement via Backstretch (fiable)
        $.backstretch(full("images/" + Config.backgrounds[p]));

        setTimeout(() => {
            slash.style.opacity = 0;
            slash.classList.remove("slash-open");
        }, 600);

    }, 150);

    // Mise à jour couleurs / logo / musique
    document.documentElement.style.setProperty("--color", Config.colors[p]);
    $("#slayer-logo").attr("src", full("images/" + Config.logo));
    $("#music-player").attr("src", full("music/" + Config.music[p]));
}

/* ==============================================
                 TIPS
============================================== */

function startTipsRotation() {
    if (!Config.tips || !Config.tips.length) return;

    function change() {
        const tip = Config.tips[Math.floor(Math.random() * Config.tips.length)];
        $("#tip").text(tip);
    }

    change();
    setInterval(change, 8000);
}

/* ==============================================
                 INIT
============================================== */

window.onload = () => {

    // Fond initial + logo + musique
    setPillar(Config.pillar);

    startTipsRotation();

    // Cycle automatique
    if (Config.cycle.enabled) {

        let index = Config.cycle.order.indexOf(Config.pillar);
        if (index === -1) index = 0;

        setInterval(() => {
            index = (index + 1) % Config.cycle.order.length;
            fadeToPillar(Config.cycle.order[index]);
        }, Config.cycle.delay);
    }
};
