const HerChapters = {
    getAll(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return Array.isArray(book?.chapters) ? book.chapters : [];
    },

    find(bookId, chapterId) {
        return this.getAll(bookId).find(chapter => chapter.id === chapterId) || null;
    },

    create(bookId, title = "New Chapter") {
        const books = HerBooks.getAll();
        let createdChapter = null;

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            createdChapter = {
                id: createId(),
                title: String(title || "New Chapter").trim(),
                content: "",
                manuscript: "",
                status: "Draft",
                characters: [],
                locations: [],
                brainstorms: [],
                ideas: [],
                plotPoints: [],
                sectionStarters: [],
                continuityIssues: [],
                summary: "",
                summaryUpdatedAt: null,
                rewriteHistory: [],
                createdAt: formatDate(),
                updatedAt: formatDate()
            };

            return {
                ...book,
                chapters: [...(Array.isArray(book.chapters) ? book.chapters : []), createdChapter],
                updatedAt: formatDate()
            };
        });

        HerBooks.saveAll(updatedBooks);

        if (createdChapter) {
            localStorage.setItem(HerConfig.storageKeys.currentChapter, createdChapter.id);
        }

        return createdChapter;
    },

    update(bookId, chapterId, updates = {}) {
        const books = HerBooks.getAll();
        let updatedChapter = null;

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const chapters = (Array.isArray(book.chapters) ? book.chapters : []).map(chapter => {
                if (chapter.id !== chapterId) return chapter;
                updatedChapter = { ...chapter, ...updates, updatedAt: formatDate() };
                return updatedChapter;
            });

            return { ...book, chapters, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
        return updatedChapter;
    },

    rename(bookId, chapterId, title) {
        const cleanTitle = String(title || "").trim();
        return cleanTitle ? this.update(bookId, chapterId, { title: cleanTitle }) : null;
    },

    duplicate(bookId, chapterId) {
        const books = HerBooks.getAll();
        let copy = null;

        const updatedBooks = books.map(book => {
            if (book.id !== bookId) return book;

            const chapters = Array.isArray(book.chapters) ? book.chapters : [];
            const original = chapters.find(chapter => chapter.id === chapterId);
            if (!original) return book;

            copy = {
                ...JSON.parse(JSON.stringify(original)),
                id: createId(),
                title: `${original.title || "Untitled Chapter"} Copy`,
                createdAt: formatDate(),
                updatedAt: formatDate()
            };

            const index = chapters.findIndex(chapter => chapter.id === chapterId);
            const next = [...chapters];
            next.splice(index + 1, 0, copy);

            return { ...book, chapters: next, updatedAt: formatDate() };
        });

        HerBooks.saveAll(updatedBooks);
        return copy;
    },

    delete(bookId, chapterId) {
        const books = HerBooks.getAll();
        const book = books.find(item => item.id === bookId);
        const chapters = Array.isArray(book?.chapters) ? book.chapters : [];

        if (!book) return { success: false, message: "Book not found." };
        if (chapters.length <= 1) {
            return { success: false, message: "A book must keep at least one chapter." };
        }

        const updatedBooks = books.map(item =>
            item.id === bookId
                ? {
                    ...item,
                    chapters: chapters.filter(chapter => chapter.id !== chapterId),
                    updatedAt: formatDate()
                }
                : item
        );

        HerBooks.saveAll(updatedBooks);

        if (localStorage.getItem(HerConfig.storageKeys.currentChapter) === chapterId) {
            const remaining = updatedBooks.find(item => item.id === bookId)?.chapters || [];
            localStorage.setItem(HerConfig.storageKeys.currentChapter, remaining[0]?.id || "");
        }

        return { success: true };
    }
};
