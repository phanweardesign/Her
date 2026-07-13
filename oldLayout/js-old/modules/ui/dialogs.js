const HerDialogs = {
    confirm(message, onConfirm) {
        const result = window.confirm(message);

        if (result && typeof onConfirm === "function") {
            onConfirm();
        }
    },

    prompt(message, defaultValue = "") {
        return window.prompt(message, defaultValue);
    },

    alert(message) {
        window.alert(message);
    }
};