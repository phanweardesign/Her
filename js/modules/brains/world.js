(function(global){'use strict';
class WorldBrain extends HerBrainCore.Brain{
 constructor(){super('World')}
 inspect(state){const text=state.manuscript||'',chapter=state.chapter;return {locations:HerKnowledge.locations(text,chapter),organizations:HerKnowledge.organizations(text,chapter),artifacts:HerKnowledge.artifacts(text,chapter),timeline:HerKnowledge.timeline(text,chapter),ideas:HerKnowledge.ideas(text,chapter)}}
}
global.HerWorldBrain=new WorldBrain();
})(window);
