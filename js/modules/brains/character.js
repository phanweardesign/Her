(function(global){'use strict';
class CharacterBrain extends HerBrainCore.Brain{constructor(){super('Character')} prepare(state){return {controlledCharacters:(state.characters||[]).filter(c=>!c.authorControlled),authorControlled:(state.characters||[]).filter(c=>c.authorControlled),rule:'Never write thoughts, dialogue, emotions, or decisions for author-controlled characters.'}}}
global.HerCharacterBrain=new CharacterBrain();
})(window);
