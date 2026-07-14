function initHerApp() {
    const theme = getTheme() || CONFIG.defaultTheme;

    document.documentElement.setAttribute("data-theme", theme);

    console.log(`${CONFIG.appName} v${CONFIG.version} loaded`);
}

document.addEventListener("DOMContentLoaded", initHerApp);