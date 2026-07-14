const HerAIService = {
    ask(prompt) {
        return HerAI.ask(prompt);
    },

    rewrite(text, style) {
        return HerAIRewrite.rewriteText(text, style);
    },

    grammar(text) {
        return HerAIGrammar.checkGrammar(text);
    },

    brainstormStory(genre) {
        return HerAIBrainstorming.storyIdeas(genre);
    }
};