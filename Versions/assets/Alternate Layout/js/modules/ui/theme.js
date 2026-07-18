const HerTheme = {
    get key() {
        return typeof HerConfig !== "undefined"
            ? HerConfig.storageKeys.theme
            : "her_theme";
    },

    get() {
        const saved = localStorage.getItem(this.key);

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return saved;
            }
        }

        return typeof HerConfig !== "undefined"
            ? HerConfig.defaultTheme
            : "dark";
    },

    set(theme) {
        localStorage.setItem(this.key, JSON.stringify(theme));
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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => HerTheme.applySaved());
} else {
    HerTheme.applySaved();
}
