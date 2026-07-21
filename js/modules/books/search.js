const HerBookSearch = {
    searchBooks(query) {
        const books = HerBooks.getAll();
        const term = String(query || "").toLowerCase();

        return books.filter(book =>
            String(book.title || "").toLowerCase().includes(term) ||
            String(book.genre || "").toLowerCase().includes(term) ||
            String(book.description || "").toLowerCase().includes(term)
        );
    },

    searchChapters(bookId, query) {
        const chapters = HerChapters.getAll(bookId);
        const term = String(query || "").toLowerCase();

        return chapters.filter(chapter =>
            String(chapter.title || "").toLowerCase().includes(term) ||
            String(chapter.content || "").toLowerCase().includes(term)
        );
    }
};
