(function(global){'use strict';
class AnalystBrain extends HerBrainCore.Brain{
 constructor(){super('Analyst')}
 inspect(state){const text=state.manuscript||'',words=text.trim()?text.trim().split(/\s+/).length:0,insights=[];
 const repeated=[...text.matchAll(/\b(\w+)\s+\1\b/gi)].map(m=>m[0]);if(repeated.length)insights.push(this.report('grammar',{severity:'review',message:`Possible repeated word: ${repeated[0]}`}));
 const existing=(state.characters||[]), names=HerKnowledge.properNames(text), discovered=names.map(n=>HerKnowledge.inferCharacter(n,text,state.chapter)).filter(c=>!existing.some(e=>HerKnowledge.key(e.name)===HerKnowledge.key(c.name)||(e.aliases||[]).some(a=>HerKnowledge.key(a)===HerKnowledge.key(c.name))));
 const combined=merge(existing,discovered);const relationships=HerKnowledge.relationships(combined,text);
 if(words>0&&words<700)insights.push(this.report('chapter-length',{severity:'info',message:'The chapter is still developing. Completion will be judged by narrative purpose and pacing.',wordCount:words}));
 if(words>5000)insights.push(this.report('chapter-length',{severity:'review',message:'A natural chapter or scene break may have appeared.',wordCount:words}));
 return {discoveredCharacters:discovered,relationships,insights,metrics:{words,charactersMentioned:names.length}}}
}
function merge(a,b){const m=new Map((a||[]).map(x=>[HerKnowledge.key(x.name),x]));for(const x of b||[])if(!m.has(HerKnowledge.key(x.name)))m.set(HerKnowledge.key(x.name),x);return [...m.values()]}
global.HerAnalystBrain=new AnalystBrain();
})(window);
