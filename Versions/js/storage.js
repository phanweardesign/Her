/* ==========================================
   HER STORAGE
   Compatible with old and current Her saves.
========================================== */

const HER_STORAGE_KEYS = {
    BOOKS: "her_books",
    CURRENT_BOOK_ID: "her_current_book_id",
    CURRENT_CHAPTER_ID: "her_current_chapter_id",
    CURRENT_CHARACTER_ID: "her_current_character_id",
    CURRENT_BOOK_INDEX: "her_current_book_index",
    CURRENT_CHAPTER_INDEX: "her_current_chapter_index",
    USER: "her_user",
    SETTINGS: "her_settings",
    NOTES: "her_notes",
    THEME: "her_theme",
    STORY_SUGGESTIONS: "her_story_intelligence_suggestions"
};

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/*
    Reads normal JSON and older double-encoded JSON.
    Example:
    normal:        [{"title":"Book"}]
    double-coded:  "[{\"title\":\"Book\"}]"
*/
function load(key, defaultValue = null) {
    const raw = localStorage.getItem(key);

    if (raw === null) {
        return defaultValue;
    }

    try {
        let value = JSON.parse(raw);

        /*
            Some older Her versions saved an already-stringified value.
            Unwrap it once more when it still contains JSON text.
        */
        if (typeof value === "string") {
            const trimmed = value.trim();

            if (
                trimmed.startsWith("[") ||
                trimmed.startsWith("{")
            ) {
                value = JSON.parse(trimmed);
            }
        }

        return value;
    } catch (error) {
        console.error(`Error loading "${key}" from storage.`, error);
        return defaultValue;
    }
}

function remove(key) {
    localStorage.removeItem(key);
}

function clearStorage() {
    localStorage.clear();
}

/* BOOKS */

function normalizeBooks(value) {
    if (Array.isArray(value)) {
        return value;
    }

    /*
        Recover an object-shaped collection if an older version saved books
        by their IDs instead of as an array.
    */
    if (value && typeof value === "object") {
        if (Array.isArray(value.books)) {
            return value.books;
        }

        return Object.values(value).filter(
            item => item && typeof item === "object" && item.id
        );
    }

    return [];
}

function getBooks() {
    const books = normalizeBooks(
        load(HER_STORAGE_KEYS.BOOKS, [])
    );

    /*
        Rewrite recovered legacy data into the current array format.
        This does not delete or alter the individual books.
    */
    const raw = localStorage.getItem(HER_STORAGE_KEYS.BOOKS);

    if (books.length && raw) {
        try {
            const firstParse = JSON.parse(raw);

            if (
                !Array.isArray(firstParse) ||
                typeof firstParse === "string"
            ) {
                saveBooks(books);
            }
        } catch {
            /* Leave the original value untouched if it cannot be verified. */
        }
    }

    return books;
}

function saveBooks(books) {
    save(
        HER_STORAGE_KEYS.BOOKS,
        Array.isArray(books) ? books : []
    );
}

/* CURRENT BOOK — ID based */

function setCurrentBookId(bookId) {
    localStorage.setItem(
        HER_STORAGE_KEYS.CURRENT_BOOK_ID,
        String(bookId || "")
    );
}

function getCurrentBookId() {
    return localStorage.getItem(
        HER_STORAGE_KEYS.CURRENT_BOOK_ID
    );
}

function getCurrentBook() {
    const currentId = getCurrentBookId();

    return getBooks().find(
        book => book.id === currentId
    ) || null;
}

/* Legacy index helpers */

function setCurrentBookIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, index);

    const book = getBooks()[index];

    if (book) {
        setCurrentBookId(book.id);
    }
}

function getCurrentBookIndex() {
    const books = getBooks();
    const currentId = getCurrentBookId();

    if (currentId) {
        const index = books.findIndex(
            book => book.id === currentId
        );

        if (index >= 0) {
            return index;
        }
    }

    return load(
        HER_STORAGE_KEYS.CURRENT_BOOK_INDEX,
        null
    );
}

function updateCurrentBook(updatedBook) {
    if (!updatedBook?.id) {
        return false;
    }

    const books = getBooks();
    const index = books.findIndex(
        book => book.id === updatedBook.id
    );

    if (index < 0) {
        return false;
    }

    books[index] = updatedBook;
    saveBooks(books);

    return true;
}

/* CURRENT CHAPTER — ID based */

function setCurrentChapterId(chapterId) {
    localStorage.setItem(
        HER_STORAGE_KEYS.CURRENT_CHAPTER_ID,
        String(chapterId || "")
    );
}

function getCurrentChapterId() {
    return localStorage.getItem(
        HER_STORAGE_KEYS.CURRENT_CHAPTER_ID
    );
}

/* Legacy chapter index helpers */

function setCurrentChapterIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, index);

    const book = getCurrentBook();
    const chapter = book?.chapters?.[index];

    if (chapter) {
        setCurrentChapterId(chapter.id);
    }
}

function getCurrentChapterIndex() {
    const book = getCurrentBook();
    const currentId = getCurrentChapterId();

    if (book && currentId) {
        const index = (book.chapters || []).findIndex(
            chapter => chapter.id === currentId
        );

        if (index >= 0) {
            return index;
        }
    }

    return load(
        HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX,
        0
    );
}

/* USER */

function getUser() {
    return load(HER_STORAGE_KEYS.USER, null);
}

function saveUser(user) {
    save(HER_STORAGE_KEYS.USER, user);
}

/* SETTINGS */

function getSettings() {
    return load(HER_STORAGE_KEYS.SETTINGS, {});
}

function saveSettings(settings) {
    save(HER_STORAGE_KEYS.SETTINGS, settings);
}

/* NOTES */

function getNotes() {
    return load(HER_STORAGE_KEYS.NOTES, []);
}

function saveNotes(notes) {
    save(HER_STORAGE_KEYS.NOTES, notes);
}

/* THEME */

function getTheme() {
    return load(HER_STORAGE_KEYS.THEME, "dark");
}

function saveTheme(theme) {
    save(HER_STORAGE_KEYS.THEME, theme);
}

/* STORY INTELLIGENCE */

function getStorySuggestions() {
    return load(
        HER_STORAGE_KEYS.STORY_SUGGESTIONS,
        []
    );
}

function saveStorySuggestions(suggestions) {
    save(
        HER_STORAGE_KEYS.STORY_SUGGESTIONS,
        Array.isArray(suggestions) ? suggestions : []
    );
}
