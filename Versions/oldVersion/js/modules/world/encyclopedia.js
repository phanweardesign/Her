const HerEncyclopedia = {
    buildIndex(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        if (!book) return [];

        return [
            ...(book.characters || []).map(item => ({ ...item, category: "Character" })),
            ...(book.locations || []).map(item => ({ ...item, category: "Location" })),
            ...(book.organizations || []).map(item => ({ ...item, category: "Organization" })),
            ...(book.artifacts || []).map(item => ({ ...item, category: "Artifact" })),
            ...(book.magic || []).map(item => ({ ...item, category: "Magic" })),
            ...(book.history || []).map(item => ({ ...item, category: "History" }))
        ].sort((a, b) => (a.name || a.title || "").localeCompare(b.name || b.title || ""));
    },

    search(bookId, query) {
        return this.buildIndex(bookId).filter(item => {
            const text = JSON.stringify(item).toLowerCase();
            return text.includes(query.toLowerCase());
        });
    }
};