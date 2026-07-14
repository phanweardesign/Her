const HerExportService = {
    downloadText(filename, content) {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    },

    exportBookText(bookId) {
        return HerExport.exportPlainText(bookId);
    }
};