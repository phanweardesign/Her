const HerMaps = {
    saveMap(bookId, imageData) {
        HerBooks.update(bookId, {
            worldMap: imageData
        });
    },

    removeMap(bookId) {
        HerBooks.update(bookId, {
            worldMap: ""
        });
    },

    getMap(bookId) {
        const book = HerBooks.getAll().find(book => book.id === bookId);
        return book ? book.worldMap || "" : "";
    }
};