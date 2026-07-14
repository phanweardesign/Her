const HerBookSearch = {
    searchBooks(query) {
        const books = HerBooks.getAll();

        return books.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            (book.genre || "").toLowerCase().includes(query.toLowerCase()) ||
            (book.description || "").toLowerCase().includes(query.toLowerCase())
        );
    },

    searchChapters(bookId, query) {
        const chapters = HerChapters.getAll(bookId);

        return chapters.filter(chapter =>
            chapter.title.toLowerCase().includes(query.toLowerCase()) ||
            chapter.content.toLowerCase().includes(query.toLowerCase())
        );
    }
};