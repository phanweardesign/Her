const HerPreferences = {
    setTheme(theme) {
        HerSettings.save({ theme });
        HerTheme.set(theme);
    },

    setEditorFontSize(size) {
        HerSettings.save({ editorFontSize: Number(size) });
    },

    setDailyWordGoal(goal) {
        HerSettings.save({ dailyWordGoal: Number(goal) });
    },

    toggleAutosave() {
        const settings = HerSettings.get();
        HerSettings.save({ autosave: !settings.autosave });
    }
};