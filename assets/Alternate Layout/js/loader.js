/*
   HER CORE LOADER
   Loads shared files once and in dependency order.
*/
window.HerLoader = window.HerLoader || {
    scripts: [
        "/js/config.js",
        "/js/storage.js",
        "/js/utils/helpers.js",
        "/js/services/apiService.js",
        "/js/services/authService.js",
        "/js/modules/ai/ai.js",
        "/js/app.js"
    ],

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(
                `script[data-her-src="${src}"], script[src="${src}"]`
            );

            if (existing) {
                if (existing.dataset.loaded === "true") {
                    resolve();
                } else {
                    existing.addEventListener("load", resolve, { once: true });
                    existing.addEventListener(
                        "error",
                        () => reject(new Error(`Failed to load ${src}`)),
                        { once: true }
                    );
                }
                return;
            }

            const script = document.createElement("script");
            script.src = src;
            script.dataset.herSrc = src;

            script.addEventListener("load", () => {
                script.dataset.loaded = "true";
                resolve();
            });

            script.addEventListener("error", () => {
                reject(new Error(`Failed to load ${src}`));
            });

            document.body.appendChild(script);
        });
    },

    async loadAll() {
        try {
            for (const src of this.scripts) {
                await this.loadScript(src);
            }

            document.dispatchEvent(new Event("HerReady"));
        } catch (error) {
            console.error("HerLoader:", error);
        }
    }
};
