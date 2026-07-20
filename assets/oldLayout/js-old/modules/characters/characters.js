const HerCharacters = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.characters || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const character = {
            id: createId(),
            name: data.name || "New Character",
            nickname: data.nickname || "",
            role: data.role || "Supporting Character",
            age: data.age || "",
            occupation: data.occupation || "",
            appearance: data.appearance || "",
            personality: data.personality || "",
            backstory: data.backstory || "",
            goals: data.goals || "",
            relationships: [],
            notes: data.notes || "",
            linkedChapters: [],
            linkedLocations: [],
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                characters: [...(book.characters || []), character],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return character;
    },

    update(bookId, characterId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const characters = (book.characters || []).map(character =>
                character.id === characterId
                    ? { ...character, ...updates, updatedAt: formatDate() }
                    : character
            );

            return { ...book, characters, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, characterId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                characters: (book.characters || []).filter(c => c.id !== characterId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    },

    find(bookId, characterId) {
        return this.getAll(bookId).find(character => character.id === characterId) || null;
    }
};