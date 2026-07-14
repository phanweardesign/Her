const HerWordCount = {
    countWords(text = "") {
        return text.trim() === ""
            ? 0
            : text.trim().split(/\s+/).length;
    },

    countCharacters(text = "") {
        return text.length;
    },

    estimateReadingTime(text = "") {
        const words = this.countWords(text);
        const minutes = Math.ceil(words / 200);

        return minutes <= 1 ? "1 min read" : `${minutes} min read`;
    }
};