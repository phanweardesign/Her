const HerExport = {
    exportPlainText(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);

        if (!book) return null;

        let text = `${book.title}\n\n`;

        book.chapters.forEach(chapter => {
            text += `${chapter.title}\n\n`;
            text += `${chapter.content}\n\n`;
        });

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${book.title}.txt`;
        link.click();

        URL.revokeObjectURL(url);
    }
};