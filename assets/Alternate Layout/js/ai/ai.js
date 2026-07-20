/*
   Compatibility loader for older pages.
   The full HerAI implementation lives in /js/modules/ai/ai.js.
*/
if (!window.HerAI) {
    console.warn(
        "HerAI is not loaded. Add /js/modules/ai/ai.js before using AI features."
    );
}
