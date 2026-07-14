const HerAIPrompts = {
    storyIdeas: [
        "Give me 5 story ideas based on this genre.",
        "Help me create a strong opening scene.",
        "Give me a plot twist for this chapter.",
        "Help me improve this character's motivation."
    ],

    chapterHelp: [
        "Summarize this chapter.",
        "Suggest a better chapter title.",
        "Find weak spots in this chapter.",
        "Suggest what should happen next."
    ],

    characterHelp: [
        "Create a character flaw.",
        "Suggest a backstory.",
        "Improve this character's dialogue.",
        "Find inconsistencies in this character."
    ],

    worldHelp: [
        "Help me build this world.",
        "Create rules for this magic system.",
        "Suggest history for this kingdom.",
        "Create conflict between two factions."
    ],

    getAll() {
        return [
            ...this.storyIdeas,
            ...this.chapterHelp,
            ...this.characterHelp,
            ...this.worldHelp
        ];
    }
};