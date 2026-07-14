const HerMagic = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.magic || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const magic = {
            id: createId(),
            name: data.name || "New Magic System",
            source: data.source || "",
            rules: data.rules || "",
            limitations: data.limitations || "",
            cost: data.cost || "",
            forbiddenMagic: data.forbiddenMagic || "",
            schools: [],
            famousUsers: [],
            notes: data.notes || "",
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                magic: [...(book.magic || []), magic],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return magic;
    },

    update(bookId, magicId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const magicList = (book.magic || []).map(magic =>
                magic.id === magicId
                    ? { ...magic, ...updates, updatedAt: formatDate() }
                    : magic
            );

            return { ...book, magic: magicList, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, magicId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                magic: (book.magic || []).filter(m => m.id !== magicId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    }
};