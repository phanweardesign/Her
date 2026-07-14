/*
    Her shared navigation
    ---------------------
    Every standard page only needs:
        <nav class="navbar" data-her-navigation></nav>
        <script src="../js/navigation.js"></script>

    The script detects the current file and marks the correct section active.
*/
(function () {
    "use strict";

    const currentFile =
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
        "character.html",
        "character-profile.html"
    ]);

    function activeSection() {
        if (worldPages.has(currentFile)) return "world";
        if (characterPages.has(currentFile)) return "characters";
        if (currentFile === "books.html" || currentFile === "chapters.html") {
            return "books";
        }
        return "dashboard";
    }

    const active = activeSection();

    const links = [
        {
            key: "dashboard",
            label: "Dashboard",
            href: "dashboard.html"
        },
        {
            key: "books",
            label: "Books",
            href: "books.html"
        },
        {
            key: "characters",
            label: "Characters",
            href: "characters.html"
        },
        {
            key: "world",
            label: "World Bible",
            href: "world.html"
        }
    ];

    document.querySelectorAll("[data-her-navigation]").forEach(function (nav) {
        nav.setAttribute("aria-label", "Main navigation");

        nav.innerHTML = links.map(function (link) {
            const activeClass =
                link.key === active
                    ? "nav-link active"
                    : "nav-link";

            const current =
                link.key === active
                    ? ' aria-current="page"'
                    : "";

            return (
                '<a class="' + activeClass + '"' +
                ' href="' + link.href + '"' +
                current +
                ">" +
                link.label +
                "</a>"
            );
        }).join("");
    });
})();
