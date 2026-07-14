const HerLocations = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.locations || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const location = {
            id: createId(),
            name: data.name || "New Location",
            type: data.type || "City",
            region: data.region || "",
            population: data.population || "",
            climate: data.climate || "",
            government: data.government || "",
            description: data.description || "",
            culture: data.culture || "",
            economy: data.economy || "",
            pointsOfInterest: [],
            linkedCharacters: [],
            linkedChapters: [],
            notes: data.notes || "",
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                locations: [...(book.locations || []), location],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return location;
    },

    update(bookId, locationId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const locations = (book.locations || []).map(location =>
                location.id === locationId
                    ? { ...location, ...updates, updatedAt: formatDate() }
                    : location
            );

            return { ...book, locations, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, locationId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                locations: (book.locations || []).filter(l => l.id !== locationId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    find(bookId, locationId) {
        return this.getAll(bookId).find(location => location.id === locationId) || null;
    }
};