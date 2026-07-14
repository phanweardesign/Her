const HerCommandPalette = {
    commands: [],

    register(command) {
        this.commands.push(command);
    },

    open() {
        const overlay = document.querySelector(".command-overlay");
        const input = document.querySelector(".command-input");

        if (overlay) overlay.classList.add("active");
        if (input) input.focus();

        this.render();
    },

    close() {
        const overlay = document.querySelector(".command-overlay");

        if (overlay) overlay.classList.remove("active");
    },

    render(query = "") {
        const list = document.querySelector(".command-list");
        if (!list) return;

        const filtered = this.commands.filter(command =>
            command.title.toLowerCase().includes(query.toLowerCase()) ||
            (command.description || "").toLowerCase().includes(query.toLowerCase())
        );

        list.innerHTML = filtered.map((command, index) => `
            <div class="command-item" onclick="HerCommandPalette.run(${index})">
                <div class="command-title">${command.title}</div>
                <div class="command-description">${command.description || ""}</div>
            </div>
        `).join("");
    },

    run(index) {
        const command = this.commands[index];

        if (command && typeof command.action === "function") {
            command.action();
            this.close();
        }
    }
};

document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        HerCommandPalette.open();
    }

    if (event.key === "Escape") {
        HerCommandPalette.close();
    }
});