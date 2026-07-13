const HerLayout = {
    create() {
        const pageContent = document.body.innerHTML;

        document.body.innerHTML = `
            <div class="app-shell">
                <header class="app-header">
                    <div class="app-title">Her</div>
                    <a href="../settings/profile.html">Profile</a>
                </header>

                <main class="app-main">
                    ${pageContent}
                </main>

                <nav class="bottom-nav">
                    <a href="../home.html">Home</a>
                    <a href="../books/books.html">Books</a>
                    <a href="../books/editor.html">Editor</a>
                    <a href="../world/world.html">World</a>
                    <a href="../notes/notes.html">Notes</a>
                </nav>
            </div>
        `;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    HerLayout.create();
});