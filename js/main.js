// Array randomizer (Fisher–Yates)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var neededFiles = 1;
var downloadedFiles = 0;
var isGMod = false; // Flag pour savoir si on est en jeu

// Fonctions appelées par Garry's Mod
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    isGMod = true; // GMod est détecté !
    $("#start-screen").remove(); // Pas besoin d'écran de start sur GMod
    
    setGamemode(gamemode);
    setMapname(mapname);

    if (!l_serverName && !l_serverImage) {
        setServerName(servername);
    }
}

function DownloadingFile(fileName) {
    downloadedFiles++;
    refreshProgress();
    
    // On extrait juste le nom du fichier pour faire plus propre
    var cleanName = fileName.split('/').pop();
    setStatus("Téléchargement : " + cleanName);
}

function SetStatusChanged(status) {
    if (status.indexOf("Getting Addon #") !== -1) {
        downloadedFiles++;
        refreshProgress();
    } else if (status === "Sending client info...") {
        setProgress(100);
    }

    var prettyStatus = status;
    if (status === "Retrieving server info...") prettyStatus = "Connexion au Domaine des Pourfendeurs...";
    else if (status === "Workshop Complete") prettyStatus = "Forge Nichirin : Armes prêtes.";
    else if (status === "Sending client info...") prettyStatus = "Synchronisation de l'âme...";
    else if (status.indexOf("Mounting Addon") !== -1) prettyStatus = "Installation des techniques de souffle...";

    setStatus(prettyStatus);
}

function SetFilesNeeded(needed) {
    neededFiles = needed + 1;
}

function refreshProgress() {
    var progress = Math.floor(((downloadedFiles / neededFiles) * 100) || 0);
    setProgress(progress);
}

// Helpers DOM
function setStatus(text) { $("#status").html(text); }
function setProgress(progress) { $("#loading-progress").css("width", progress + "%"); }
function setGamemode(gamemode) { $("#gamemode").html(gamemode); }
function setMapname(mapname) { $("#map").html(mapname); }
function setServerName(servername) { $("#title").html(servername); }

function setMusicName(name) {
    $("#music-name").fadeOut(1000, function () {
        $(this).html(name);
        $(this).fadeIn(1000);
    });
}

// --- LOGIQUE DEMO MODE (NAVIGATEUR) ---
function initDemoMode() {
    console.log("Mode Navigateur détecté : Lancement automatique de la simulation.");
    
    // On lance la simulation visuelle immédiatement
    simulateLoading();

    // On tente de lancer la musique
    // (Note : Sur Chrome PC, ça peut échouer sans clic, mais sur GMod ça marchera)
    if (l_music) {
        if (l_musicDisplay) $("#music-box").show();
        
        // Petit délai pour laisser le navigateur respirer
        setTimeout(function() {
            nextMusic();
        }, 100);
    }
}

function simulateLoading() {
    // 1. Simuler GameDetails
    setGamemode("DarkRP (Démon)");
    setMapname("rp_demon_slayer_v2");
    if(l_serverName) setServerName(l_serverName);

    // 2. Simuler les téléchargements
    var fakeFiles = 100;
    SetFilesNeeded(fakeFiles);
    
    var currentFile = 0;
    var demoInterval = setInterval(function() {
        currentFile++;
        
        // Faux fichiers pour l'ambiance
        var types = ["materials/breath_water.vtf", "models/tanjiro_katana.mdl", "sound/zenitsu_scream.wav", "lua/autorun/breathing_system.lua"];
        var randomFile = types[Math.floor(Math.random() * types.length)];
        
        DownloadingFile(randomFile);
        
        // Changer de statut de temps en temps
        if(currentFile === 20) SetStatusChanged("Retrieving server info...");
        if(currentFile === 60) SetStatusChanged("Workshop Complete");
        if(currentFile === 90) SetStatusChanged("Mounting Addon");

        if (currentFile >= fakeFiles) {
            clearInterval(demoInterval);
            SetStatusChanged("Sending client info...");
        }
    }, 150); // Vitesse du chargement démo
}

// Initialisation
$(function () {
    // Randomisation
    if (l_bgImagesRandom) l_bgImages = shuffle(l_bgImages);
    if (l_musicRandom) l_musicPlaylist = shuffle(l_musicPlaylist);
    if (l_messagesRandom) l_messages = shuffle(l_messages);

    // Messages
    if (l_messagesEnabled) showMessage(0);

    // Fond
// Fond (vidéo ou images backstretch)
    if (l_bgVideo) {
        $("body").append("<video loop autoplay muted><source src='" + l_background + "' type='video/webm'></video>");
    } else {
        var bgUrls = l_bgImages.map(function(item) { return item.src; });

        var instance = $.backstretch(bgUrls, {
            duration: l_bgImageDuration,
            fade: l_bgImageFadeVelocity
        });

        $(window).on("backstretch.show", function(e, instance) {
            var index = instance.index;
            var theme = l_bgImages[index];

            // Si une couleur est définie, on l'applique aux variables CSS
            if (theme && theme.color) {
                document.documentElement.style.setProperty('--theme-color', theme.color);
                document.documentElement.style.setProperty('--theme-shadow', theme.shadow || theme.color);
                
                // Petit bonus : Changer la couleur du texte Kanji géant aussi
                $("#kanji").css("text-shadow", "0 0 40px " + theme.color);
            }
        });
        
        if(l_bgImages.length > 0) {
             var firstTheme = l_bgImages[0];
             document.documentElement.style.setProperty('--theme-color', firstTheme.color);
             document.documentElement.style.setProperty('--theme-shadow', firstTheme.shadow || firstTheme.color);
        }
    }

    if (l_serverImage) $("#logo").html("<img src='" + l_serverImage + "' style='max-height:100%; max-width:100%;'>");
    $("#overlay").css("background-color", "rgba(0,0,0," + (l_bgDarkening / 100) + ")");

    // Kanji Animation
    setInterval(function() {
        var kanjiList = ["炎", "水", "雷", "岩", "風", "霞", "恋", "蛇", "音", "日", "月", "花", "鬼", "滅"];
        var k = kanjiList[Math.floor(Math.random() * kanjiList.length)];
        $("#kanji").fadeOut(1000, function() {
            $(this).html(k).fadeIn(1000);
        });
    }, 8000); // Change le Kanji toutes les 8s

    // DETECTION GMOD VS NAVIGATEUR
    // Si après 500ms GameDetails n'a pas été appelé, on suppose qu'on est sur navigateur
    setTimeout(function() {
        if (!isGMod) {
            initDemoMode();
        }
    }, 500);
});

// AUDIO PLAYER & VISUALIZER
var audioPlayer = null;
var currentTrack = -1;

function nextMusic() {
    currentTrack++;
    if (currentTrack >= l_musicPlaylist.length) currentTrack = 0;
    var track = l_musicPlaylist[currentTrack];

    $("audio").remove();
    $("body").append('<audio id="music-audio" src="' + track.ogg + '" autoplay>');
    audioPlayer = document.getElementById("music-audio");
    audioPlayer.volume = l_musicVolume / 100;
    
    setMusicName(track.name);
    
    // Animation pulse sur la box
    $("#music-box").addClass("music-pulse");
    setTimeout(() => { $("#music-box").removeClass("music-pulse"); }, 500);

    audioPlayer.onended = function() { nextMusic(); };
    
    // Lancer le visualizer seulement si l'audio joue vraiment
    audioPlayer.play().then(() => {
        startVisualizer();
    }).catch(e => {
        console.log("Autoplay bloqué par le navigateur (normal en dehors de GMod)");
    });
}

function showMessage(message) {
    if (message >= l_messages.length) message = 0;
    $("#messages").fadeOut(l_messagesFade, function () {
        $(this).html('"' + l_messages[message] + '"');
        $(this).fadeIn(l_messagesFade);
    });
    setTimeout(function () { showMessage(message + 1); }, l_messagesDelay + l_messagesFade * 2);
}

// Visualizer simple
var breathingIntensity = 0;
var breathingDirection = 1;
var particleInterval = null;

function startVisualizer() {
    clearInterval(particleInterval);
    particleInterval = setInterval(function() {
        if (!audioPlayer || audioPlayer.paused) return;

        breathingIntensity += 0.02 * breathingDirection;
        if (breathingIntensity > 1) { breathingIntensity = 1; breathingDirection = -1; }
        if (breathingIntensity < 0) { breathingIntensity = 0; breathingDirection = 1; }

        // Glow rouge sang
        $("#panel").css("box-shadow", "0 0 " + (15 + breathingIntensity * 25) + "px rgba(255, 40, 40, " + (0.3 + breathingIntensity * 0.3) + ")");
        
        // Spawn de particules aléatoire (plus intense quand la 'respiration' est haute)
        if(Math.random() < (0.1 + breathingIntensity * 0.2)) {
            spawnParticle(breathingIntensity);
        }
    }, 50);
}

function spawnParticle(power) {
    var p = $("<div class='ds-particle'></div>");
    $("body").append(p);
    var size = 3 + Math.random() * 8;
    p.css({
        left: (Math.random() * 100) + "vw",
        top: "100vh",
        width: size + "px",
        height: size + "px",
        opacity: 0.4 + power * 0.6
    });
    p.animate({ top: (window.innerHeight - 300 - Math.random()*200) + "px", opacity: 0 }, 2000 + Math.random() * 2000, "linear", function() { p.remove(); });
}