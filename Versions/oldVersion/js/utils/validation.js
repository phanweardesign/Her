const HerValidation = {
    required(value) {
        return value !== null && value !== undefined && String(value).trim() !== "";
    },

    email(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    password(value) {
        return value.length >= 8;
    },

    match(value1, value2) {
        return value1 === value2;
    }
};