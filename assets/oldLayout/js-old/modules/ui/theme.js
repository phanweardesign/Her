const HerTheme = {
    key: HerConfig.storageKeys.theme,

    get() {
        return localStorage.getItem(this.key) || HerConfig.defaultTheme;
    },

    set(theme) {
        localStorage.setItem(this.key, theme);
        document.documentElement.setAttribute("data-theme", theme);
    },

    toggle() {
        const nextTheme = this.get() === "dark" ? "light" : "dark";
        this.set(nextTheme);
        return nextTheme;
    },

    applySaved() {
        this.set(this.get());
    }
};

document.addEventListener("DOMContentLoaded", () => {
    HerTheme.applySaved();
});