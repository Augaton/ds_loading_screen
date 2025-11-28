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

var neededFiles;
var downloadedFiles = 0;

// Fonctions appelées par Garry's Mod
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    setGamemode(gamemode);
    setMapname(mapname);

    if (!l_serverName && !l_serverImage) {
        setServerName(servername);
    }
}

function DownloadingFile(fileName) {
    downloadedFiles++;
    refreshProgress();

    setStatus("Téléchargement des ressources du Corps des Pourfendeurs...");
}

function SetStatusChanged(status) {
    if (status.indexOf("Getting Addon #") !== -1) {
        downloadedFiles++;
        refreshProgress();
    } else if (status === "Sending client info...") {
        setProgress(100);
    }

    // Traduction légère de certains statuts pour le thème Demon Slayer
    var prettyStatus = status;

    if (status === "Retrieving server info...") {
        prettyStatus = "Connexion au Domaine des Pourfendeurs...";
    } else if (status === "Workshop Complete") {
        prettyStatus = "Atelier : armes et uniformes prêts.";
    } else if (status === "Sending client info...") {
        prettyStatus = "Envoi de vos informations au Quartier Général...";
    }

    setStatus(prettyStatus);
}

/* Useless...
function SetFilesTotal( total ) {
    console.log("SetFilesTotal("+total+")");
}*/

function SetFilesNeeded(needed) {
    neededFiles = needed + 1;
}

function refreshProgress() {
    var progress = Math.floor(((downloadedFiles / neededFiles) * 100) || 0);
    setProgress(progress);
}

// Helpers DOM
function setStatus(text) {
    $("#status").html(text);
}

function setProgress(progress) {
    $("#loading-progress").css("width", progress + "%");
}

function setGamemode(gamemode) {
    $("#gamemode").html(gamemode);
}

function setMapname(mapname) {
    $("#map").html(mapname);
}

function setServerName(servername) {
    $("#title").html(servername);
}

function setMusicName(name) {
    $("#music-name").fadeOut(2000, function () {
        $(this).html(name);
        $(this).fadeIn(2000);
    });
}

var youtubePlayer;
var actualMusic = -1;

// Initialisation DOM / thème Demon Slayer
$(function () {
    // Randomisation
    if (l_bgImagesRandom)
        l_bgImages = shuffle(l_bgImages);

    if (l_musicRandom)
        l_musicPlaylist = shuffle(l_musicPlaylist);

    if (l_messagesRandom)
        l_messages = shuffle(l_messages);

    // Affichage des messages personnalisés
    if (l_messagesEnabled)
        showMessage(0);

    // Musique
    if (l_music) {
        loadYoutube();
        if (l_musicDisplay)
            $("#music").fadeIn(2000);
    }

    // Fond (vidéo ou images backstretch)
    if (l_bgVideo) {
        $("body").append("<video loop autoplay muted><source src='" + l_background + "' type='video/webm'></video>");
    } else {
        $.backstretch(l_bgImages, {
            duration: l_bgImageDuration,
            fade: l_bgImageFadeVelocity
        });
    }

    // Nom / logo du serveur
    if (l_serverName && !l_serverImage)
        setServerName(l_serverName);

    if (l_serverImage)
        setServerName("<img src='" + l_serverImage + "' height='140'>");

    // Assombrissement de l'overlay
    $("#overlay").css("background-color", "rgba(0,0,0," + (l_bgDarkening / 100) + ")");

    // Kanji Demon Slayer aléatoire
    var kanjiList = ["炎", "水", "雷", "岩", "風", "霞", "恋", "蛇", "音", "日", "月", "花"];
    var k = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    $("#kanji").html(k);
});

// Gestion du lecteur YouTube
function loadYoutube() {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    youtubePlayer.setVolume(l_musicVolume);
    if (youtubePlayer.isMuted()) youtubePlayer.unMute();
    nextMusic();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextMusic();
    }
}

function nextMusic() {
    actualMusic++;

    if (actualMusic >= l_musicPlaylist.length) {
        actualMusic = 0;
    }

    var atual = l_musicPlaylist[actualMusic];

    if (atual.youtube) {
        youtubePlayer.loadVideoById(atual.youtube);
    } else {
        $("body").append('<audio src="' + atual.ogg + '" autoplay>');
        $("audio").prop('volume', l_musicVolume / 100);
        $("audio").bind("ended", function () {
            $(this).remove();
            nextMusic();
        });
    }

    setMusicName(atual.name);
}

// Messages (tips Demon Slayer)
function showMessage(message) {
    if (message >= l_messages.length)
        message = 0;

    $("#messages").fadeOut(l_messagesFade, function () {
        $(this).html(l_messages[message]);
        $(this).fadeIn(l_messagesFade);
    });

    setTimeout(function () {
        showMessage(message + 1);
    }, l_messagesDelay + l_messagesFade * 2);
}
