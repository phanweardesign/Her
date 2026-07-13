/*
   HER NAVIGATION
*/
window.ROUTES = window.HerConfig
    ? window.HerConfig.routes
    : {
        home: "/pages/home.html",
        dashboard: "/pages/dashboard.html",
        books: "/pages/books.html",
        editor: "/pages/editor.html",
        chapters: "/pages/chapters.html",
        characters: "/pages/characters.html",
        world: "/pages/world.html",
        notes: "/pages/notes.html",
        settings: "/pages/settings.html",
        login: "/pages/auth/login.html",
        signup: "/pages/auth/signup.html"
    };

window.goTo = function goTo(page) {
    const route = window.ROUTES[page];

    if (!route) {
        console.error(`Route not found: ${page}`);
        return;
    }

    window.location.href = route;
};
