const Book = require("../models/Book");

function validBooks(value) {
    return Array.isArray(value)
        ? value.filter(book => book && typeof book === "object" && String(book.id || "").trim())
        : [];
}

exports.getLibrary = async (req, res) => {
    try {
        const records = await Book.find({ user: req.userId }).sort({ createdAt: 1 }).lean();
        res.json({ books: records.map(record => record.payload) });
    } catch (error) {
        console.error("Get book library error:", error);
        res.status(500).json({ message: "Unable to load your books right now." });
    }
};

exports.replaceLibrary = async (req, res) => {
    try {
        const books = validBooks(req.body.books);
        const ids = books.map(book => String(book.id));

        const operations = books.map(book => ({
            updateOne: {
                filter: { user: req.userId, clientId: String(book.id) },
                update: {
                    $set: {
                        user: req.userId,
                        clientId: String(book.id),
                        payload: book
                    }
                },
                upsert: true
            }
        }));

        if (operations.length) {
            await Book.bulkWrite(operations, { ordered: false });
            await Book.deleteMany({ user: req.userId, clientId: { $nin: ids } });
        } else {
            await Book.deleteMany({ user: req.userId });
        }

        res.json({ message: "Book library saved.", count: books.length });
    } catch (error) {
        console.error("Save book library error:", error);
        res.status(500).json({ message: "Unable to save your books right now." });
    }
};
