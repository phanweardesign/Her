const HerEvents = {
    on(eventName, callback) {
        document.addEventListener(eventName, callback);
    },

    emit(eventName, detail = {}) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
};