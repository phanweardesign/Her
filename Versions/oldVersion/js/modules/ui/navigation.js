const HerNavigation = {
    go(path) {
        window.location.href = path;
    },

    back() {
        window.history.back();
    },

    setActive(selector, activeClass = "active") {
        document.querySelectorAll(selector).forEach(item => {
            item.classList.remove(activeClass);
        });
    },

    markActive(element, activeClass = "active") {
        if (element) element.classList.add(activeClass);
    }
};