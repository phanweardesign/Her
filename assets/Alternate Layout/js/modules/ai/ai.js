/*
   HER AI CLIENT
   Single source of truth for all AI requests.
*/
window.HerAI = window.HerAI || {
    apiUrl: window.HER_API_URL || "/api/ai/ask",

    async ask(action, prompt = "", context = {}, options = {}) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action,
                prompt,
                context,
                options
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || "AI request failed.");
        }

        if (typeof data.reply === "undefined") {
            throw new Error("Her returned an empty response.");
        }

        return data.reply;
    },

    continueWriting(text, context = {}) {
        return this.ask("continue", text, context);
    },

    continue(text, context = {}) {
        return this.continueWriting(text, context);
    },

    rewrite(text, context = {}, options = {}) {
        return this.ask("rewrite", text, context, options);
    },

    grammar(text, context = {}) {
        return this.ask("grammar", text, context);
    },

    brainstorm(text, context = {}) {
        return this.ask("brainstorm", text, context);
    },

    sectionStarter(text, context = {}) {
        return this.ask("section_starter", text, context);
    },

    continuityCheck(text, context = {}) {
        return this.ask("continuity_check", text, context);
    }
};
