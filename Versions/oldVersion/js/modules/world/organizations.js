const HerOrganizations = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.organizations || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const organization = {
            id: createId(),
            name: data.name || "New Organization",
            type: data.type || "Faction",
            leader: data.leader || "",
            headquarters: data.headquarters || "",
            purpose: data.purpose || "",
            members: [],
            allies: [],
            enemies: [],
            notes: data.notes || "",
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                organizations: [...(book.organizations || []), organization],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return organization;
    },

    update(bookId, organizationId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const organizations = (book.organizations || []).map(org =>
                org.id === organizationId
                    ? { ...org, ...updates, updatedAt: formatDate() }
                    : org
            );

            return { ...book, organizations, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, organizationId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                organizations: (book.organizations || []).filter(o => o.id !== organizationId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    }
};