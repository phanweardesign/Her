function initHerApp() {
    const config = typeof HerConfig !== "undefined"
        ? HerConfig
        : (typeof CONFIG !== "undefined" ? CONFIG : {
            appName: "Her",
            version: "1.0.0",
            defaultTheme: "dark"
        });

    const theme = typeof getTheme === "function"
        ? getTheme()
        : config.defaultTheme;

    document.documentElement.setAttribute(
        "data-theme",
        theme || config.defaultTheme
    );

    console.log(`${config.appName} v${config.version} loaded`);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHerApp);
} else {
    initHerApp();
}
