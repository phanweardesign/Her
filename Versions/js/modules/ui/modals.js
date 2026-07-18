const HerModals = {
    open(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add("active");
    },

    close(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove("active");
    },

    closeAll() {
        document.querySelectorAll(".modal-overlay").forEach(modal => {
            modal.classList.remove("active");
        });
    }
};

document.addEventListener("click", event => {
    if (event.target.classList.contains("modal-overlay")) {
        event.target.classList.remove("active");
    }
});