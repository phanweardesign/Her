const HerAI = {

    async ask(action, context = "") {

        const response = await fetch("http://localhost:5000/api/ai/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: action,
                context
            })
        });

        if (!response.ok) {
            throw new Error("AI request failed");
        }

        const data = await response.json();

        return data.reply;
    },

    async continue(text) {
        return await this.ask(
            "Continue this story naturally. Match the author's writing style and do not repeat previous text.",
            text
        );
    },

    async rewrite(text) {
        return await this.ask(
            "Rewrite this passage to improve flow, clarity, and style without changing the meaning.",
            text
        );
    },

    async grammar(text) {
        return await this.ask(
            "Correct grammar, spelling, and punctuation while preserving the author's writing style.",
            text
        );
    },

    async brainstorm(text) {
        return await this.ask(
            "Generate three creative ideas for what could happen next in this story.",
            text
        );
    }
};