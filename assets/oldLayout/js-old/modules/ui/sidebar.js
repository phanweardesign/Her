const HerSidebar = {
    toggle(selector = ".sidebar") {
        const sidebar = document.querySelector(selector);
        if (sidebar) sidebar.classList.toggle("collapsed");
    },

    open(selector = ".sidebar") {
        const sidebar = document.querySelector(selector);
        if (sidebar) sidebar.classList.remove("collapsed");
    },

    close(selector = ".sidebar") {
        const sidebar = document.querySelector(selector);
        if (sidebar) sidebar.classList.add("collapsed");
    }
};