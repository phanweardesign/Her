const HerAIBrainstorming = {
    async storyIdeas(genre = "fiction") {
        const prompt = `Give me 10 original ${genre} story ideas.`;

        return await HerAI.ask(prompt);
    },

    async plotTwist(summary = "") {
        const prompt = `Create 5 strong plot twists based on this story idea:\n\n${summary}`;

        return await HerAI.ask(prompt);
    },

    async characterIdeas(role = "main character") {
        const prompt = `Create 5 unique ${role} ideas with names, motivations, and flaws.`;

        return await HerAI.ask(prompt);
    },

    async worldIdeas(type = "fantasy world") {
        const prompt = `Create worldbuilding ideas for a ${type}, including culture, conflict, and history.`;

        return await HerAI.ask(prompt);
    }
};