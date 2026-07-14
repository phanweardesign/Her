const HerLoader = {
    scripts: [
        "../js/config.js",
        "../js/storage.js",
		"../js/modules/ai/ai.js",
        "../js/app.js"
    ],

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(`Failed to load ${src}`);

            document.body.appendChild(script);
        });
    },

    async loadAll() {
        for (const script of this.scripts) {
            await this.loadScript(script);
        }

        document.dispatchEvent(new Event("HerReady"));
    }
};

HerLoader.loadAll();