const HerCharacterTimeline = {
    addEvent(bookId, characterId, title, date = "", description = "") {
        const character = HerCharacters.find(bookId, characterId);
        if (!character) return;

        const timeline = character.timeline || [];

        timeline.push({
            id: createId(),
            title,
            date,
            description,
            createdAt: formatDate()
        });

        HerCharacters.update(bookId, characterId, { timeline });
    },

    removeEvent(bookId, characterId, eventId) {
        const character = HerCharacters.find(bookId, characterId);
        if (!character) return;

        const timeline = (character.timeline || []).filter(event => event.id !== eventId);

        HerCharacters.update(bookId, characterId, { timeline });
    }
};