const HerHistory = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.history || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const event = {
            id: createId(),
            year: data.year || "",
            title: data.title || "New Historical Event",
            description: data.description || "",
            linkedCharacters: [],
            linkedLocations: [],
            linkedChapters: [],
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                history: [...(book.history || []), event],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return event;
    },

    update(bookId, eventId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const history = (book.history || []).map(event =>
                event.id === eventId
                    ? { ...event, ...updates, updatedAt: formatDate() }
                    : event
            );

            return { ...book, history, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, eventId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                history: (book.history || []).filter(e => e.id !== eventId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    }
};