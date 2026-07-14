(function () {
    "use strict";

    const file =
        window.location.pathname.split("/").pop().toLowerCase() ||
        "dashboard.html";

    const worldPages = new Set([
        "world.html",
        "locations.html",
        "organizations.html",
        "artifacts.html",
        "magic.html",
        "timeline.html"
    ]);

    const characterPages = new Set([
        "characters.html",
        "profile.html",
        "character.html",
        "character-profile.html"
    ]);

    function getActiveSection() {
        if (worldPages.has(file)) return "world";
        if (characterPages.has(file)) return "characters";

        if (
            file === "books.html" ||
            file === "chapters.html" ||
            file === "workspace.html" ||
            file === "editor.html"
        ) {
            return "books";
        }

        return "dashboard";
    }

    const active = getActiveSection();

    const links = [
        ["dashboard", "Dashboard", "dashboard.html"],
        ["books", "Books", "books.html"],
        ["characters", "Characters", "characters.html"],
        ["world", "World Bible", "world.html"]
    ];

    document.querySelectorAll("[data-her-navigation]").forEach(nav => {
        nav.setAttribute("aria-label", "Main navigation");

        nav.innerHTML = links.map(([key, label, href]) => {
            const className =
                key === active ? "nav-link active" : "nav-link";

            const current =
                key === active ? ' aria-current="page"' : "";

            return (
                `<a class="${className}" href="${href}"${current}>` +
                `${label}</a>`
            );
        }).join("");
    });
})();
