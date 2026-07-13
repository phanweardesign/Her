const HerBooks = {
    getAll() {
        return getBooks();
    },

    saveAll(books) {
        saveBooks(books);
    },

    create(title, genre = "", description = "") {
        const books = this.getAll();

        const book = {
            id: createId(),
            title,
            genre,
            description,
            chapters: [
                {
                    id: createId(),
                    title: "Chapter 1",
                    content: "",
                    status: "Draft",
                    characters: [],
                    locations: [],
                    createdAt: formatDate(),
                    updatedAt: formatDate()
                }
            ],
            characters: [],
            locations: [],
            organizations: [],
            artifacts: [],
            magic: [],
            history: [],
            notes: [],
            createdAt: formatDate(),
            updatedAt: formatDate()
        };

        books.push(book);
        this.saveAll(books);

        return book;
    },

    getCurrent() {
        const books = this.getAll();
        const currentId = getCurrentBookId();

        return books.find(book => book.id === currentId) || null;
    },

    setCurrent(bookId) {
        setCurrentBookId(bookId);
    },

    update(bookId, updates) {
        const books = this.getAll();

        const updatedBooks = books.map(book =>
            book.id === bookId
                ? { ...book, ...updates, updatedAt: formatDate() }
                : book
        );

        this.saveAll(updatedBooks);
    },

    delete(bookId) {
        const books = this.getAll().filter(book => book.id !== bookId);
        this.saveAll(books);
    }
};