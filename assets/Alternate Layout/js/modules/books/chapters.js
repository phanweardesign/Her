const HerChapters = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.chapters : [];
    },

    create(bookId, title = "New Chapter") {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const chapter = {
                id: createId(),
                title,
                content: "",
                status: "Draft",
                characters: [],
                locations: [],
                createdAt: formatDate(),
                updatedAt: formatDate()
            };

            return {
                ...book,
                chapters: [...book.chapters, chapter],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    update(bookId, chapterId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const chapters = book.chapters.map(chapter =>
                chapter.id === chapterId
                    ? { ...chapter, ...updates, updatedAt: formatDate() }
                    : chapter
            );

            return {
                ...book,
                chapters,
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, chapterId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                chapters: book.chapters.filter(chapter => chapter.id !== chapterId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    }
};