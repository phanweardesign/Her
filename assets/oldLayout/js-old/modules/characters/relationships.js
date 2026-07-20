const HerRelationships = {
    add(bookId, characterId, targetCharacterId, type = "Friend", notes = "") {
        const character = HerCharacters.find(bookId, characterId);
        if (!character) return;

        const relationships = character.relationships || [];

        relationships.push({
            id: createId(),
            targetCharacterId,
            type,
            notes,
            createdAt: formatDate()
        });

        HerCharacters.update(bookId, characterId, { relationships });
    },

    remove(bookId, characterId, relationshipId) {
        const character = HerCharacters.find(bookId, characterId);
        if (!character) return;

        const relationships = (character.relationships || []).filter(
            rel => rel.id !== relationshipId
        );

        HerCharacters.update(bookId, characterId, { relationships });
    }
};