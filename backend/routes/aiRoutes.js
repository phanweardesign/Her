const express = require("express");
const OpenAI = require("openai");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ACTIONS = {
    continue: "Continue naturally in the author's established voice, POV, tense, pacing and direction. Return only the continuation.",
    grammar: "Correct grammar, spelling and punctuation without changing meaning, voice, plot or tone. Return only corrected text.",
    brainstorm: "Generate exactly 5 distinct possibilities for what could happen next. Support the author's direction. Return only a numbered list.",
    combine_ideas: "Blend all selected ideas into one concise coherent possibility. Do not write a full scene. Return only the combined idea.",
    regenerate_idea: "Replace this idea with one different possibility that fits the same story context. Return only the new idea.",
    section_starter: "Suggest exactly one sentence that could begin the next section. Preserve voice, POV, tense, pacing and continuity. Return only that sentence.",
    continuity_check: `Check the manuscript against all supplied story memory. Find contradictions, timeline problems, character inconsistencies, unresolved promises, duplicated facts, and location or object conflicts.
Return valid JSON only in this shape:
{"issues":[{"severity":"high|medium|review","text":"clear explanation"}]}
Return {"issues":[]} when no issue is found.`,
    chapter_summary: `Create a compact memory summary for this chapter. Include: major events, character actions and decisions, new facts, locations, objects, promises, mysteries, relationship changes, timeline facts, and unresolved questions. Return plain text.`,
    book_summary: `Create or update a compact whole-book memory summary using all supplied chapter summaries, plot points, characters, locations and timeline. Preserve confirmed facts and unresolved threads. Return plain text.`,
    story_intelligence_characters: `Analyze the chapter for NEW named fictional people only. Compare against existingCharacters in STORY MEMORY. Extract only facts directly supported by the chapter and never invent details. Return valid JSON only: {"characters":[{"name":"string","role":"string","age":"string","occupation":"string","relationships":["string"],"firstAppearance":"string","confidence":0.0,"evidence":"short explanation"}]}. Return {"characters":[]} if none.`
};

function rewriteInstruction(style) {
    const styles = {
        standard: "Make it smoother and clearer.",
        darker: "Make the atmosphere darker without changing events or meaning.",
        softer: "Make the language gentler and more emotionally soft without changing events.",
        suspenseful: "Increase suspense and tension without inventing a new plot turn."
    };
    return `Rewrite the selected text. ${styles[style] || styles.standard} Preserve the author's voice, POV, tense, facts and intent. Return only rewritten text.`;
}

router.post("/ask", async (req, res) => {
    try {
        const { action, prompt, context = {}, options = {} } = req.body;
        if (!String(prompt || "").trim()) {
            return res.status(400).json({ message: "Prompt is required." });
        }

        const instruction = action === "rewrite"
            ? rewriteInstruction(options.style)
            : ACTIONS[action] || "Assist the author while preserving creative control.";

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are Her, an assistive fiction-writing partner.
The writer controls the story. Never override confirmed facts or force a plot direction.
Use the supplied memory for continuity. Preserve voice, tone, POV, tense, character behavior,
locations, timeline, plot points, mysteries and the author's decisions.
Be concise and return only the requested output format.`
                },
                {
                    role: "user",
                    content: `TASK
${instruction}

STORY MEMORY
${JSON.stringify(context)}

AUTHOR INPUT
${prompt}`
                }
            ],
            temperature:
                action === "grammar" || action === "continuity_check" || action === "story_intelligence_characters" ? 0.15 :
                action === "chapter_summary" || action === "book_summary" ? 0.35 :
                action === "section_starter" ? 0.65 : 0.8,
            response_format: ["continuity_check", "story_intelligence_characters"].includes(action)
                ? { type: "json_object" }
                : undefined
        });

        const reply = completion.choices?.[0]?.message?.content?.trim();
        if (!reply) return res.status(502).json({ message: "Her returned an empty response." });

        res.json({ action, reply });
    } catch (error) {
        console.error("Her AI error:", error);
        res.status(500).json({ message: error?.message || "AI request failed." });
    }
});

module.exports = router;