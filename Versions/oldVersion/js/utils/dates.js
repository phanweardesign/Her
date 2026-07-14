const HerDates = {
    now() {
        return new Date();
    },

    readable(date = new Date()) {
        return new Date(date).toLocaleString();
    },

    short(date = new Date()) {
        return new Date(date).toLocaleDateString();
    }
};