const HerFormatting = {
    capitalize(text = "") {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    truncate(text = "", length = 100) {
        return text.length > length ? text.slice(0, length) + "..." : text;
    },

    slug(text = "") {
        return text.toLowerCase().trim().replace(/\s+/g, "-");
    }
};