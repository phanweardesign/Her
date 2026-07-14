/*
   HER CONFIGURATION
   Single source of truth for app settings, routes and storage keys.
*/
window.HerConfig = window.HerConfig || {
    appName: "Her",
    version: "1.0.0",
    defaultTheme: "dark",

    api: {
        baseUrl: "/api",
        auth: {
            signup: "/api/auth/signup",
            login: "/api/auth/login"
        },
        ai: "/api/ai/ask"
    },

    routes: {
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
    },

    storageKeys: {
        books: "her_books",
        currentBook: "her_current_book_id",
        currentBookIndex: "her_current_book_index",
        currentChapterIndex: "her_current_chapter_index",
        user: "her_user",
        currentUser: "her_current_user",
        settings: "her_settings",
        notes: "her_notes",
        theme: "her_theme"
    },

    features: {
        darkMode: true,
        aiAssistant: true,
        cloudSync: false,
        exportTools: true
    }
};

/* Compatibility alias for older files. */
window.CONFIG = window.HerConfig;
