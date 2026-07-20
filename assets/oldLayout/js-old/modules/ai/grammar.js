const HerAIGrammar = {
    async checkGrammar(text) {
        if (!text || text.trim() === "") {
            return "No text provided.";
        }

        const prompt = `Check this writing for grammar, spelling, and clarity:\n\n${text}`;

        return await HerAI.ask(prompt);
    },

    async improveClarity(text) {
        if (!text || text.trim() === "") {
            return "No text provided.";
        }

        const prompt = `Improve the clarity of this writing without changing the meaning:\n\n${text}`;

        return await HerAI.ask(prompt);
    }
};