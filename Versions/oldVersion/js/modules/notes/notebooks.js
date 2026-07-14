const HerNotebooks = {
    getCategories(bookId) {
        const notes = HerNotes.getAll(bookId);
        return [...new Set(notes.map(note => note.category || "General"))];
    },

    getByCategory(bookId, category) {
        return HerNotes.getAll(bookId).filter(note => note.category === category);
    },

    addTag(bookId, noteId, tag) {
        const note = HerNotes.getAll(bookId).find(n => n.id === noteId);
        if (!note) return;

        const tags = new Set(note.tags || []);
        tags.add(tag);

        HerNotes.update(bookId, noteId, {
            tags: [...tags]
        });
    },

    removeTag(bookId, noteId, tag) {
        const note = HerNotes.getAll(bookId).find(n => n.id === noteId);
        if (!note) return;

        HerNotes.update(bookId, noteId, {
            tags: (note.tags || []).filter(t => t !== tag)
        });
    }
};