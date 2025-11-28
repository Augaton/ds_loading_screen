Config = {
    pillar: "sun",  

    serverName: "Demon Slayer – Corps des Pourfendeurs",

    colors: {
        sun: "#ff3030",
        flame: "#ff7a2f",
        water: "#4fc3ff",
        thunder: "#ffe600",
        moon: "#b48bff"
    },

    backgrounds: {
        sun: "bg_sun.jpg",
        flame: "bg_flame.jpg",
        water: "bg_water.jpg",
        thunder: "bg_thunder.jpg",
        moon: "bg_moon.jpg"
    },

    logo: "logo_slayers.png",

    music: {
        sun: "sun_theme.mp3"
    },

    tips: [
        "Affûtez votre souffle.",
        "Les démons rôdent dans les ténèbres.",
        "Votre cœur est votre lame."
    ]
};

Config.cycle = {
    enabled: true,
    delay: 8000, // 8 secondes entre chaque changement
    order: ["sun", "flame", "water", "thunder", "moon"]
};

