const HerAIRewrite = {
    async rewriteText(text, style = "clearer") {
        if (!text || text.trim() === "") {
            return "No text selected to rewrite.";
        }

        const prompt = `Rewrite this text to be ${style}:\n\n${text}`;

        return await HerAI.ask(prompt);
    },

    async makeShorter(text) {
        return await this.rewriteText(text, "shorter and cleaner");
    },

    async makeLonger(text) {
        return await this.rewriteText(text, "more detailed and descriptive");
    },

    async makeDramatic(text) {
        return await this.rewriteText(text, "more dramatic and emotional");
    },

    async makeProfessional(text) {
        return await this.rewriteText(text, "more polished and professional");
    }
};