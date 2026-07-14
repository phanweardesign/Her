const HerShortcuts = {
    init() {
        document.addEventListener("keydown", event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
                event.preventDefault();
                HerNotifications.info("Saved");
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                HerCommandPalette.open();
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    HerShortcuts.init();
});