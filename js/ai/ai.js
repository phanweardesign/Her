const HerAI = {
    async ask(action, text = "", context = {}, options = {}) {
        const response = await fetch("/api/ai/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, prompt: text, context, options })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `AI request failed (${response.status})`);
        return data.reply;
    },
    continueWriting(text, context = {}) { return this.ask("continue", text, context); },
    continue(text, context = {}) { return this.continueWriting(text, context); },
    rewrite(text, context = {}, style = "standard") { return this.ask("rewrite", text, context, { style }); },
    grammar(text, context = {}) { return this.ask("grammar", text, context); },
    brainstorm(text, context = {}) { return this.ask("brainstorm", text, context); },
    collaborate(text, context = {}) { return this.ask("collaborate", text, context); }
};
