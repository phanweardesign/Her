const HerNotes = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.notes || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const note = {
            id: createId(),
            title: data.title || "New Note",
            content: data.content || "",
            category: data.category || "General",
            tags: data.tags || [],
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
                notes: [...(book.notes || []), note],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return note;
    },

    update(bookId, noteId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const notes = (book.notes || []).map(note =>
                note.id === noteId
                    ? { ...note, ...updates, updatedAt: formatDate() }
                    : note
            );

            return { ...book, notes, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, noteId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                notes: (book.notes || []).filter(note => note.id !== noteId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    search(bookId, query) {
        return this.getAll(bookId).filter(note => {
            const text = `${note.title} ${note.content} ${note.category} ${(note.tags || []).join(" ")}`;
            return text.toLowerCase().includes(query.toLowerCase());
        });
    }
};