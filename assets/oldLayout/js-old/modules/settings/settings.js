const HerSettings = {
    key: "her_settings",

    defaults: {
        theme: "light",
        autosave: true,
        autosaveDelay: 500,
        editorFontSize: 18,
        editorLineHeight: 1.7,
        dailyWordGoal: 500,
        focusMode: false
    },

    get() {
        return {
            ...this.defaults,
            ...(JSON.parse(localStorage.getItem(this.key)) || {})
        };
    },

    save(settings) {
        localStorage.setItem(this.key, JSON.stringify({
            ...this.get(),
            ...settings
        }));
    },

    reset() {
        localStorage.setItem(this.key, JSON.stringify(this.defaults));
    }
};