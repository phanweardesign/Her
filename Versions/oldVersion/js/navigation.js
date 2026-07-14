const ROUTES = {
    home: "../home.html",
    books: "./books.html",
    editor: "./editor.html",
    chapters: "./chapters.html",
    characters: "../characters/characters.html",
    world: "../world/world.html",
    notes: "../notes/notes.html",
    settings: "../settings/settings.html",
    login: "../auth/login.html"
};

function goTo(page) {
    if (!ROUTES[page]) {
        console.error(`Route not found: ${page}`);
        return;
    }

    window.location.href = ROUTES[page];
}