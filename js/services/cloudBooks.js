/* ==========================================
   HER CLOUD BOOK LIBRARY
   MongoDB-backed, with local-first fallback.
========================================== */

const HerCloudBooks = (() => {
    const TOKEN_KEY = "her_auth_token";
    let saveTimer = null;
    let suppressNextSave = false;

    function token() {
        return localStorage.getItem(TOKEN_KEY) || "";
    }

    function authenticated() {
        return Boolean(token());
    }

    async function request(method, body) {
        const response = await fetch("/api/books", {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token()}`
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.message || "Book sync failed.");
            error.status = response.status;
            throw error;
        }
        return data;
    }

    async function upload(books) {
        if (!authenticated()) return false;
        await request("PUT", { books: Array.isArray(books) ? books : [] });
        return true;
    }

    function scheduleUpload(books) {
        if (suppressNextSave) {
            suppressNextSave = false;
            return;
        }
        if (!authenticated()) return;
        clearTimeout(saveTimer);
        const snapshot = JSON.parse(JSON.stringify(Array.isArray(books) ? books : []));
        saveTimer = setTimeout(() => {
            upload(snapshot).catch(error => console.error("Her book sync error:", error));
        }, 350);
    }

    async function hydrate() {
        if (!authenticated()) return { source: "local", books: getBooks() };

        const localBooks = getBooks();
        const data = await request("GET");
        const cloudBooks = Array.isArray(data.books) ? data.books : [];

        if (cloudBooks.length > 0) {
            suppressNextSave = true;
            saveBooks(cloudBooks);
            return { source: "cloud", books: cloudBooks };
        }

        if (localBooks.length > 0) {
            await upload(localBooks);
            return { source: "migrated", books: localBooks };
        }

        return { source: "cloud", books: [] };
    }

    return { authenticated, hydrate, upload, scheduleUpload };
})();
