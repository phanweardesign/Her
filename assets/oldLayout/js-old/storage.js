/* ==========================================
   HER STORAGE
   Handles all Local Storage operations
========================================== */

const HER_STORAGE_KEYS = {
    BOOKS: "her_books",
    CURRENT_BOOK_ID: "her_current_book_id",
    CURRENT_CHAPTER_INDEX: "her_current_chapter_index",

    USER: "her_user",
    SETTINGS: "her_settings",
    NOTES: "her_notes",
    THEME: "her_theme"
};

/* ==========================================
   GENERIC STORAGE FUNCTIONS
========================================== */

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key, defaultValue = null) {
    const item = localStorage.getItem(key);

    if (item === null) {
        return defaultValue;
    }

    try {
        return JSON.parse(item);
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

/* ==========================================
   BOOKS
========================================== */

function getBooks() {
    return load(HER_STORAGE_KEYS.BOOKS, []);
}

function saveBooks(books) {
    save(HER_STORAGE_KEYS.BOOKS, books);
}

/* ==========================================
   CURRENT BOOK
========================================== */

function setCurrentBookIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, index);
}

function getCurrentBookIndex() {
    return load(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, null);
}

function getCurrentBook() {
    const books = getBooks();
    const index = getCurrentBookIndex();

    if (index === null || !books[index]) {
        return null;
    }

    return books[index];
}

function updateCurrentBook(updatedBook) {
    const books = getBooks();
    const index = getCurrentBookIndex();

    if (index === null || !books[index]) {
        return false;
    }

    books[index] = updatedBook;
    saveBooks(books);

    return true;
}

/* ==========================================
   CURRENT CHAPTER
========================================== */

function setCurrentChapterIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, index);
}

function getCurrentChapterIndex() {
    return load(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, 0);
}

/* ==========================================
   USER
========================================== */

function getUser() {
    return load(HER_STORAGE_KEYS.USER, null);
}

function saveUser(user) {
    save(HER_STORAGE_KEYS.USER, user);
}

/* ==========================================
   SETTINGS
========================================== */

function getSettings() {
    return load(HER_STORAGE_KEYS.SETTINGS, {});
}

function saveSettings(settings) {
    save(HER_STORAGE_KEYS.SETTINGS, settings);
}

/* ==========================================
   NOTES
========================================== */

function getNotes() {
    return load(HER_STORAGE_KEYS.NOTES, []);
}

function saveNotes(notes) {
    save(HER_STORAGE_KEYS.NOTES, notes);
}

/* ==========================================
   THEME
========================================== */

function getTheme() {
    return load(HER_STORAGE_KEYS.THEME, "light");
}

function saveTheme(theme) {
    save(HER_STORAGE_KEYS.THEME, theme);
}