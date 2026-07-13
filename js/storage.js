/* ==========================================
   HER STORAGE
   Handles all Local Storage operations.
========================================== */

const HER_STORAGE_KEYS = {
    BOOKS: "her_books",
    CURRENT_BOOK_ID: "her_current_book_id",
    CURRENT_BOOK_INDEX: "her_current_book_index",
    CURRENT_CHAPTER_INDEX: "her_current_chapter_index",
    USER: "her_user",
    CURRENT_USER: "her_current_user",
    SETTINGS: "her_settings",
    NOTES: "her_notes",
    THEME: "her_theme"
};

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

/* Books */
function getBooks() {
    const books = load(HER_STORAGE_KEYS.BOOKS, []);
    return Array.isArray(books) ? books : [];
}

function saveBooks(books) {
    save(HER_STORAGE_KEYS.BOOKS, Array.isArray(books) ? books : []);
}

/* Current book by array index, retained for older pages. */
function setCurrentBookIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, Number(index));
}

function getCurrentBookIndex() {
    return load(HER_STORAGE_KEYS.CURRENT_BOOK_INDEX, null);
}

/* Current book by stable ID, used by newer modules. */
function setCurrentBookId(bookId) {
    localStorage.setItem(HER_STORAGE_KEYS.CURRENT_BOOK_ID, String(bookId));
}

function getCurrentBookId() {
    return localStorage.getItem(HER_STORAGE_KEYS.CURRENT_BOOK_ID);
}

function getCurrentBook() {
    const books = getBooks();
    const currentId = getCurrentBookId();

    if (currentId) {
        const byId = books.find(book => String(book.id) === String(currentId));
        if (byId) return byId;
    }

    const index = getCurrentBookIndex();
    return index !== null && books[index] ? books[index] : null;
}

function updateCurrentBook(updatedBook) {
    const books = getBooks();
    const currentId = getCurrentBookId();

    let index = currentId
        ? books.findIndex(book => String(book.id) === String(currentId))
        : getCurrentBookIndex();

    if (index === null || index < 0 || !books[index]) {
        return false;
    }

    books[index] = updatedBook;
    saveBooks(books);
    return true;
}

/* Current chapter */
function setCurrentChapterIndex(index) {
    save(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, Number(index));
}

function getCurrentChapterIndex() {
    return load(HER_STORAGE_KEYS.CURRENT_CHAPTER_INDEX, 0);
}

/* User */
function getUser() {
    return load(HER_STORAGE_KEYS.USER, load(HER_STORAGE_KEYS.CURRENT_USER, null));
}

function saveUser(user) {
    save(HER_STORAGE_KEYS.USER, user);
    save(HER_STORAGE_KEYS.CURRENT_USER, user);
}

/* Settings */
function getSettings() {
    return load(HER_STORAGE_KEYS.SETTINGS, {});
}

function saveSettings(settings) {
    save(HER_STORAGE_KEYS.SETTINGS, settings || {});
}

/* Notes */
function getNotes() {
    const notes = load(HER_STORAGE_KEYS.NOTES, []);
    return Array.isArray(notes) ? notes : [];
}

function saveNotes(notes) {
    save(HER_STORAGE_KEYS.NOTES, Array.isArray(notes) ? notes : []);
}

/* Theme */
function getTheme() {
    return load(
        HER_STORAGE_KEYS.THEME,
        typeof HerConfig !== "undefined" ? HerConfig.defaultTheme : "dark"
    );
}

function saveTheme(theme) {
    save(HER_STORAGE_KEYS.THEME, theme);
}
