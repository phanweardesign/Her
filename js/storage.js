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

const HER_LEGACY_BOOK_KEYS = [
    "books",
    "herBooks",
    "HerBooks",
    "her_book_library",
    "bookLibrary"
];

function createStorageId(prefix = "item") {
    if (typeof createId === "function") {
        return createId();
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function decodeStoredValue(value) {
    let decoded = value;

    for (let attempt = 0; attempt < 3; attempt += 1) {
        if (typeof decoded !== "string") {
            break;
        }

        const trimmed = decoded.trim();
        if (!trimmed) return null;

        try {
            decoded = JSON.parse(trimmed);
        } catch {
            break;
        }
    }

    return decoded;
}

function extractBookCollection(value) {
    const decoded = decodeStoredValue(value);

    if (Array.isArray(decoded)) {
        return decoded;
    }

    if (!decoded || typeof decoded !== "object") {
        return [];
    }

    const nestedCandidates = [
        decoded.books,
        decoded.library,
        decoded.items,
        decoded.data
    ];

    for (const candidate of nestedCandidates) {
        const extracted = extractBookCollection(candidate);
        if (extracted.length) return extracted;
    }

    /* A single saved book object. */
    if (
        decoded.title ||
        decoded.bookTitle ||
        decoded.name ||
        Array.isArray(decoded.chapters)
    ) {
        return [decoded];
    }

    /* Older builds sometimes saved books as an object keyed by index or ID. */
    return Object.values(decoded).filter(item =>
        item &&
        typeof item === "object" &&
        (
            item.title ||
            item.bookTitle ||
            item.name ||
            Array.isArray(item.chapters)
        )
    );
}

function normalizeChapterRecord(chapter, index) {
    const source = chapter && typeof chapter === "object" ? chapter : {};
    const content = source.content ?? source.manuscript ?? source.text ?? "";

    return {
        ...source,
        id: String(source.id || source.chapterId || createStorageId("chapter")),
        title: String(
            source.title ||
            source.chapterTitle ||
            source.name ||
            `Chapter ${index + 1}`
        ),
        content: String(content),
        manuscript: String(source.manuscript ?? content),
        status: source.status || "Draft",
        createdAt: source.createdAt || formatDate(),
        updatedAt: source.updatedAt || formatDate()
    };
}

function normalizeBookRecord(book, index) {
    const source = book && typeof book === "object" ? book : {};
    let chapters = Array.isArray(source.chapters)
        ? source.chapters
        : extractBookCollection(source.chapterList || source.sections || []);

    chapters = chapters.map(normalizeChapterRecord);

    if (!chapters.length) {
        chapters = [normalizeChapterRecord({}, 0)];
    }

    return {
        ...source,
        id: String(source.id || source.bookId || createStorageId("book")),
        title: String(
            source.title ||
            source.bookTitle ||
            source.name ||
            `Untitled Book ${index + 1}`
        ),
        genre: String(source.genre || ""),
        description: String(source.description || source.summary || ""),
        chapters,
        createdAt: source.createdAt || formatDate(),
        updatedAt: source.updatedAt || formatDate()
    };
}

function normalizeBooks(value) {
    return extractBookCollection(value).map(normalizeBookRecord);
}

function getBooks() {
    const allCandidates = [];
    const canonicalRaw = localStorage.getItem(HER_STORAGE_KEYS.BOOKS);

    if (canonicalRaw !== null) {
        allCandidates.push(...normalizeBooks(canonicalRaw));
    }

    /* Recover books created by older builds that used another key. */
    HER_LEGACY_BOOK_KEYS.forEach(key => {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
            allCandidates.push(...normalizeBooks(raw));
        }
    });

    const unique = [];
    const seen = new Set();

    allCandidates.forEach(book => {
        const signature = book.id || `${book.title}::${book.createdAt}`;
        if (seen.has(signature)) return;
        seen.add(signature);
        unique.push(book);
    });

    /* Always rewrite the recovered collection into the one canonical key. */
    if (unique.length || canonicalRaw !== null) {
        saveBooks(unique);
    }

    return unique;
}

function saveBooks(books) {
    const normalized = Array.isArray(books)
        ? books.map(normalizeBookRecord)
        : [];

    save(HER_STORAGE_KEYS.BOOKS, normalized);
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
