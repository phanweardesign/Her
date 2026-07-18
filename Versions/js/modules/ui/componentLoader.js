const HerComponentLoader = {
    async load(id, path) {
        const target = document.getElementById(id);

        if (!target) return;

        try {
            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`Could not load ${path}`);
            }

            target.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    },

    async loadAppShell() {
        await this.load("appHeader", "../components/header.html");
        await this.load("appSidebar", "../components/sidebar.html");
        await this.load("appFooter", "../components/footer.html");
        await this.load("commandPalette", "../components/command-palette.html");
        await this.load("globalModals", "../components/modals.html");
        await this.load("globalLoading", "../components/loading.html");

        if (window.HerCommandPalette) {
            HerCommandPalette.register({
                title: "Dashboard",
                description: "Go to dashboard",
                action: () => window.location.href = "dashboard.html"
            });

            HerCommandPalette.register({
                title: "Books",
                description: "Open your books",
                action: () => window.location.href = "books.html"
            });

            HerCommandPalette.register({
                title: "Characters",
                description: "Open characters",
                action: () => window.location.href = "characters.html"
            });

            HerCommandPalette.register({
                title: "World Bible",
                description: "Open world bible",
                action: () => window.location.href = "world.html"
            });

            HerCommandPalette.register({
                title: "AI Assistant",
                description: "Open AI tools",
                action: () => window.location.href = "ai.html"
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    HerComponentLoader.loadAppShell();
});