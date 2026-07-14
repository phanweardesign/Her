const HerEditor = {
    currentBookId: null,
    currentChapterId: null,

    load(bookId, chapterId) {
        this.currentBookId = bookId;
        this.currentChapterId = chapterId;

        setCurrentBookIndex(bookId);
        setCurrentChapterIndex(chapterId);

        return this.getCurrentChapter();
    },

    getCurrentChapter() {
        const chapters = HerChapters.getAll(this.currentBookId);

        return chapters.find(chapter => chapter.id === this.currentChapterId) || null;
    },

    saveContent(content) {
        if (!this.currentBookId || !this.currentChapterId) {
            return;
        }

        HerChapters.update(this.currentBookId, this.currentChapterId, {
            content
        });
    },

    getSelectedText() {
        return window.getSelection().toString().trim();
    },

    async rewriteSelectedText() {
        const selectedText = this.getSelectedText();

        if (!selectedText) {
            alert("Highlight some text first.");
            return;
        }

        const rewrittenText = await HerAI.rewrite(selectedText);

        alert(rewrittenText);
    }
};