const HerAI = {
    async ask(action, text = "") {
        const response = await fetch("http://localhost:5000/api/ai/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action,
                prompt: text,
                context: ""
            })
        });

        if (!response.ok) {
            throw new Error("AI request failed");
        }

        const data = await response.json();

        return data.reply;
    },

    async continue(text) {
        return await this.ask("continue", text);
    },

    async rewrite(text) {
        return await this.ask("rewrite", text);
    },

    async grammar(text) {
        return await this.ask("grammar", text);
    },

    async brainstorm(text) {
        return await this.ask("brainstorm", text);
    }
};