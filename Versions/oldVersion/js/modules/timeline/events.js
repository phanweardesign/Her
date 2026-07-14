const HerTimelineEvents = {
    linkCharacter(bookId, eventId, characterId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        const linkedCharacters = new Set(event.linkedCharacters || []);
        linkedCharacters.add(characterId);

        HerTimeline.update(bookId, eventId, {
            linkedCharacters: [...linkedCharacters]
        });
    },

    unlinkCharacter(bookId, eventId, characterId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        HerTimeline.update(bookId, eventId, {
            linkedCharacters: (event.linkedCharacters || []).filter(id => id !== characterId)
        });
    },

    linkLocation(bookId, eventId, locationId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        const linkedLocations = new Set(event.linkedLocations || []);
        linkedLocations.add(locationId);

        HerTimeline.update(bookId, eventId, {
            linkedLocations: [...linkedLocations]
        });
    },

    unlinkLocation(bookId, eventId, locationId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        HerTimeline.update(bookId, eventId, {
            linkedLocations: (event.linkedLocations || []).filter(id => id !== locationId)
        });
    },

    linkChapter(bookId, eventId, chapterId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        const linkedChapters = new Set(event.linkedChapters || []);
        linkedChapters.add(chapterId);

        HerTimeline.update(bookId, eventId, {
            linkedChapters: [...linkedChapters]
        });
    },

    unlinkChapter(bookId, eventId, chapterId) {
        const event = HerTimeline.getAll(bookId).find(e => e.id === eventId);
        if (!event) return;

        HerTimeline.update(bookId, eventId, {
            linkedChapters: (event.linkedChapters || []).filter(id => id !== chapterId)
        });
    }
};