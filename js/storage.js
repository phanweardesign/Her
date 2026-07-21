/* ==========================================
   HER STORAGE
   Backward-compatible and protected against
   accidental book-library loss.
========================================== */

const HER_STORAGE_KEYS = {
    BOOKS: "her_books",
    BOOKS_BACKUP: "her_books_backup",
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

function parseStoredValue(raw, fallback = null) {
    if (raw === null || raw === undefined || raw === "") {
        return fallback;
    }

    try {
        let value = JSON.parse(raw);

        // Recover values that were JSON-stringified more than once.
        for (let attempt = 0; attempt < 2 && typeof value === "string"; attempt += 1) {
            const trimmed = value.trim();
            if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) break;
            value = JSON.parse(trimmed);
        }

        return value;
    } catch (error) {
        console.error("Her could not parse stored data.", error);
        return fallback;
    }
}

function load(key, defaultValue = null) {
    return parseStoredValue(localStorage.getItem(key), defaultValue);
}

function remove(key) {
    localStorage.removeItem(key);
}

function clearStorage() {
    localStorage.clear();
}

/* BOOKS */

function looksLikeBook(item) {
    return Boolean(
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        (
            "title" in item ||
            "chapters" in item ||
            "genre" in item ||
            "description" in item
        )
    );
}

function extractBooks(value, depth = 0) {
    if (depth > 4 || value === null || value === undefined) return [];

    if (Array.isArray(value)) {
        return value.filter(looksLikeBook);
    }

    if (typeof value === "string") {
        return extractBooks(parseStoredValue(value, null), depth + 1);
    }

    if (typeof value !== "object") return [];

    const knownContainers = [
        value.books,
        value.library,
        value.data?.books,
        value.state?.books,
        value.payload?.books
    ];

    for (const candidate of knownContainers) {
        const books = extractBooks(candidate, depth + 1);
        if (books.length) return books;
    }

    const objectValues = Object.values(value);
    if (objectValues.length && objectValues.every(looksLikeBook)) {
        return objectValues;
    }

    return [];
}

function normalizeChapter(chapter, index) {
    const source = chapter && typeof chapter === "object" ? chapter : {};

    return {
        ...source,
        id: String(source.id || createId()),
        title: String(source.title || `Chapter ${index + 1}`),
        content: String(source.content || ""),
        status: source.status || "Draft",
        characters: Array.isArray(source.characters) ? source.characters : [],
        locations: Array.isArray(source.locations) ? source.locations : []
    };
}

function normalizeBook(book, index) {
    const source = book && typeof book === "object" ? book : {};
    const chapters = Array.isArray(source.chapters)
        ? source.chapters.map(normalizeChapter)
        : [];

    return {
        ...source,
        id: String(source.id || createId()),
        title: String(source.title || source.name || `Untitled Book ${index + 1}`),
        genre: String(source.genre || ""),
        description: String(source.description || ""),
        chapters,
        characters: Array.isArray(source.characters) ? source.characters : [],
        locations: Array.isArray(source.locations) ? source.locations : [],
        organizations: Array.isArray(source.organizations) ? source.organizations : [],
        artifacts: Array.isArray(source.artifacts) ? source.artifacts : [],
        magic: Array.isArray(source.magic) ? source.magic : [],
        history: Array.isArray(source.history) ? source.history : [],
        notes: Array.isArray(source.notes) ? source.notes : []
    };
}

function readBooksFromKey(key) {
    return extractBooks(load(key, null)).map(normalizeBook);
}

function getBooks() {
    let books = readBooksFromKey(HER_STORAGE_KEYS.BOOKS);

    // Restore the protected backup if the main key is missing or damaged.
    if (!books.length) {
        books = readBooksFromKey(HER_STORAGE_KEYS.BOOKS_BACKUP);
    }

    // Recover libraries written by older experimental builds.
    if (!books.length) {
        const legacyKeys = ["herBooks", "books", "savedBooks", "her_library"];
        for (const key of legacyKeys) {
            books = readBooksFromKey(key);
            if (books.length) break;
        }
    }

    // Migrate recovered data into the current key without deleting the source.
    if (books.length) {
        const primary = readBooksFromKey(HER_STORAGE_KEYS.BOOKS);
        if (!primary.length) {
            localStorage.setItem(HER_STORAGE_KEYS.BOOKS, JSON.stringify(books));
        }
    }

    return books;
}

function saveBooks(books, options = {}) {
    if (!Array.isArray(books)) {
        console.error("Her refused to save an invalid book collection.", books);
        return false;
    }

    const normalized = books.filter(looksLikeBook).map(normalizeBook);
    const current = readBooksFromKey(HER_STORAGE_KEYS.BOOKS);

    // Never let an accidental empty save erase a populated library.
    if (
        normalized.length === 0 &&
        current.length > 0 &&
        options.allowEmpty !== true
    ) {
        console.error("Her blocked an unexpected empty save that would erase existing books.");
        return false;
    }

    if (current.length > 0) {
        localStorage.setItem(
            HER_STORAGE_KEYS.BOOKS_BACKUP,
            JSON.stringify(current)
        );
    }

    localStorage.setItem(HER_STORAGE_KEYS.BOOKS, JSON.stringify(normalized));
    return true;
}

function setCurrentBookId(bookId) {
    localStorage.setItem(HER_STORAGE_KEYS.CURRENT_BOOK_ID, String(bookId || ""));
}

function getCurrentBookId() {
    return localStorage.getItem(HER_STORAGE_KEYS.CURRENT_BOOK_ID);
}

function getCurrentBook() {
    const currentId = String(getCurrentBookId() || "");
    return getBooks().find(book => String(book.id) === currentId) || null;
}

function setCurrentBookIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, index);
    const book = getBooks()[index];
    if (book) setCurrentBookId(book.id);
}

function getCurrentBookIndex() {
    const books = getBooks();
    const currentId = String(getCurrentBookId() || "");

    if (currentId) {
        const index = books.findIndex(book => String(book.id) === currentId);
        if (index >= 0) return index;
    }

    return load(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, null);
}

function updateCurrentBook(updatedBook) {
    if (!updatedBook?.id) return false;

    const books = getBooks();
    const index = books.findIndex(book => String(book.id) === String(updatedBook.id));
    if (index < 0) return false;

    books[index] = normalizeBook(updatedBook, index);
    return saveBooks(books);
}

function setCurrentChapterId(chapterId) {
    localStorage.setItem(HER_STORAGE_KEYS.CURRENT_CHAPTER_ID, String(chapterId || ""));
}

function getCurrentChapterId() {
    return localStorage.getItem(HER_STORAGE_KEYS.CURRENT_CHAPTER_ID);
}

function setCurrentChapterIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, index);
    const book = getCurrentBook();
    const chapter = book?.chapters?.[index];
    if (chapter) setCurrentChapterId(chapter.id);
}

function getCurrentChapterIndex() {
    const book = getCurrentBook();
    const currentId = String(getCurrentChapterId() || "");

    if (book && currentId) {
        const index = (book.chapters || []).findIndex(
            chapter => String(chapter.id) === currentId
        );
        if (index >= 0) return index;
    }

    return load(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, 0);
}

function getUser() { return load(HER_STORAGE_KEYS.USER, null); }
function saveUser(user) { save(HER_STORAGE_KEYS.USER, user); }
function getSettings() { return load(HER_STORAGE_KEYS.SETTINGS, {}); }
function saveSettings(settings) { save(HER_STORAGE_KEYS.SETTINGS, settings); }
function getNotes() { return load(HER_STORAGE_KEYS.NOTES, []); }
function saveNotes(notes) { save(HER_STORAGE_KEYS.NOTES, notes); }
function getTheme() { return load(HER_STORAGE_KEYS.THEME, "dark"); }
function saveTheme(theme) { save(HER_STORAGE_KEYS.THEME, theme); }
function getStorySuggestions() { return load(HER_STORAGE_KEYS.STORY_SUGGESTIONS, []); }
function saveStorySuggestions(suggestions) {
    save(HER_STORAGE_KEYS.STORY_SUGGESTIONS, Array.isArray(suggestions) ? suggestions : []);
}
