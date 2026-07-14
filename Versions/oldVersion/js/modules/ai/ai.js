const HerAI = {
    apiUrl: window.HER_API_URL || "/api/ai/ask",

    async ask(action, prompt, context = {}, options = {}) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, prompt, context, options })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "AI request failed.");
        if (typeof data.reply === "undefined") throw new Error("Her returned an empty response.");
        return data.reply;
    }
};