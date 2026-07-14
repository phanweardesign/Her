const HerSyncService = {
    enabled: false,

    syncNow() {
        if (!this.enabled) {
            console.log("Cloud sync is not connected yet.");
            return false;
        }

        return true;
    },

    enable() {
        this.enabled = true;
    },

    disable() {
        this.enabled = false;
    }
};