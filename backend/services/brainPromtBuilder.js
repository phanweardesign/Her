function buildWritingPrompt({ request, book, chapter, characters = [], locations = [], notes = [] }) {
    let prompt = "";

    prompt += "You are Her, an AI writing assistant for authors.\n";
    prompt += "Help the user write their book while respecting their story details.\n\n";

    if (book) {
        prompt += `Book Title: ${book.title || "Untitled"}\n`;
        prompt += `Genre: ${book.genre || "Unknown"}\n`;
        prompt += `Description: ${book.description || "No description provided."}\n\n`;
    }

    if (chapter) {
        prompt += `Current Chapter: ${chapter.title || "Untitled Chapter"}\n`;
        prompt += `Chapter Content:\n${chapter.content || "No chapter content yet."}\n\n`;
    }

    if (characters.length > 0) {
        prompt += "Characters:\n";

        characters.forEach(character => {
            prompt += `- ${character.name || "Unnamed"}: ${character.description || "No description"}\n`;
        });

        prompt += "\n";
    }

    if (locations.length > 0) {
        prompt += "Locations:\n";

        locations.forEach(location => {
            prompt += `- ${location.name || "Unnamed"}: ${location.description || "No description"}\n`;
        });

        prompt += "\n";
    }

    if (notes.length > 0) {
        prompt += "Notes:\n";

        notes.forEach(note => {
            prompt += `- ${note.title || "Note"}: ${note.content || ""}\n`;
        });

        prompt += "\n";
    }

    prompt += `User Request:\n${request}\n`;

    return prompt;
}

module.exports = {
    buildWritingPrompt
};