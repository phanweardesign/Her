const HerAutoSave = {
    timer: null,
    delay: 500,

    save(callback) {
        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            callback();
        }, this.delay);
    }
};