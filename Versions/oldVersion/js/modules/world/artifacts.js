const HerArtifacts = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.artifacts || [] : [];
    },

    create(bookId, data = {}) {
        const books = HerBooks.getAll();

        const artifact = {
            id: createId(),
            name: data.name || "New Artifact",
            type: data.type || "Relic",
            owner: data.owner || "",
            location: data.location || "",
            powers: data.powers || "",
            history: data.history || "",
            description: data.description || "",
            notes: data.notes || "",
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                artifacts: [...(book.artifacts || []), artifact],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
        return artifact;
    },

    update(bookId, artifactId, updates) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const artifacts = (book.artifacts || []).map(artifact =>
                artifact.id === artifactId
                    ? { ...artifact, ...updates, updatedAt: formatDate() }
                    : artifact
            );

            return { ...book, artifacts, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
    },

    delete(bookId, artifactId) {
        const books = HerBooks.getAll();

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            return {
                ...book,
                artifacts: (book.artifacts || []).filter(a => a.id !== artifactId),
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);
    }
};