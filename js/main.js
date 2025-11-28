"use strict";

/* URL absolue (GitHub Pages + GMod) */
function full(path) {
    return new URL(path, window.location.href).href;
}

/* ==========================================
   GMod EVENTS
========================================== */

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
    }
    if (status === "Client info sent!") {
        $("#loading-fill").css("width", "95%");
    }
    if (status === "Starting Lua...") {
        $("#loading-fill").css("width", "100%");
    }
};

/* ==========================================
   GAME DETAILS
========================================== */

function GameDetails(servername) {
    $("#server-name").text(servername);
}

/* ==========================================
   SOUFFLES DEMON SLAYER
========================================== */

function setPillar(p) {

    document.documentElement.style.setProperty("--color", Config.colors[p]);

    $("#slayer-logo").attr("src", full("images/" + Config.logo));
    $("#music-player").attr("src", full("music/" + Config.music[p]));

    /* FOND BACKSTRETCH */
    $.backstretch(full("images/" + Config.backgrounds[p]));
}


/* ==========================================
   FADE + COUP DE SABRE
========================================== */

function fadeToPillar(p) {

    const slash = document.getElementById("slash-mask");

    // Ouvre le sabre
    slash.classList.add("slash-open");
    slash.style.opacity = 1;

    // Change de fond au milieu du sabre
    setTimeout(() => {

        $.backstretch(full("images/" + Config.backgrounds[p]));

        // Fermeture effet
        setTimeout(() => {
            slash.style.opacity = 0;
            slash.classList.remove("slash-open");
        }, 600);

    }, 150);

    // MAJ couleurs + logo + musique
    document.documentElement.style.setProperty("--color", Config.colors[p]);
    $("#slayer-logo").attr("src", full("images/" + Config.logo));
    $("#music-player").attr("src", full("music/" + Config.music[p]));
}

/* ==========================================
   TIPS
========================================== */

function startTipsRotation() {
    if (!Config.tips?.length) return;

    function change() {
        $("#tip").text(
            Config.tips[Math.floor(Math.random() * Config.tips.length)]
        );
    }

    change();
    setInterval(change, 8000);
}

/* ==========================================
   INIT
========================================== */

window.onload = () => {

    setPillar(Config.pillar);
    startTipsRotation();

    if (Config.cycle.enabled) {

        let index = Config.cycle.order.indexOf(Config.pillar);
        if (index === -1) index = 0;

        setInterval(() => {

            index = (index + 1) % Config.cycle.order.length;
            fadeToPillar(Config.cycle.order[index]);

        }, Config.cycle.delay);
    }
};
