const HerLoading = {
    show(selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        el.innerHTML = `
            <div class="loading">
                <span class="loading-circle"></span>
                <span class="loading-circle"></span>
                <span class="loading-circle"></span>
            </div>
        `;
    },

    hide(selector, content = "") {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = content;
    }
};