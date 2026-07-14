const HerTimeline = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.timeline || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const event = {
            id: createId(),
            title: data.title || "New Timeline Event",
            date: data.date || "",
            order: data.order || Date.now(),
            description: data.description || "",
            type: data.type || "Story Event",
            linkedCharacters: data.linkedCharacters || [],
            linkedLocations: data.linkedLocations || [],
            linkedChapters: data.linkedChapters || [],
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                timeline: [...(book.timeline || []), event],
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

            const timeline = (book.timeline || []).map(event =>
                event.id === eventId
                    ? { ...event, ...updates, updatedAt: formatDate() }
                    : event
            );

            return { ...book, timeline, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, eventId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                timeline: (book.timeline || []).filter(event => event.id !== eventId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    sort(bookId) {
        return this.getAll(bookId).sort((a, b) => a.order - b.order);
    }
};