const HerPortraits = {
    savePortrait(bookId, characterId, imageData) {
        HerCharacters.update(bookId, characterId, {
            portrait: imageData
        });
    },

    removePortrait(bookId, characterId) {
        HerCharacters.update(bookId, characterId, {
            portrait: ""
        });
    }
};