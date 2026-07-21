(function(global){'use strict';
class CoAuthorBrain extends HerBrainCore.Brain{
 constructor(){super('Co-Author')}
 prepare(state){
  const authorControlled=(state.characters||[]).filter(c=>c.authorControlled).map(c=>c.name);
  const managed=(state.characters||[]).filter(c=>!c.authorControlled).map(c=>({name:c.name,traits:c.traits||[],occupation:c.occupation||'',relationships:c.relationships||[]}));
  return {recentWriting:(state.manuscript||'').slice(-9000),authorControlledCharacters:authorControlled,aiManagedCharacters:managed,ideas:(state.ideas||[]).slice(-30),instruction:'Continue naturally without controlling any author-controlled character.'};
 }
 async collaborate(state){
  if(!global.HerAI?.collaborate)throw new Error('Her AI collaboration service is unavailable.');
  const context={
   observer:{bookId:state.bookId,chapterId:state.chapterId,metrics:state.metrics||{},insights:(state.insights||[]).slice(-20)},
   characters:state.characterContext||this.prepare(state),
   world:state.world||{},
   timeline:(state.timeline||[]).slice(-50),
   ideas:(state.ideas||[]).slice(-30),
   chapterSummary:state.chapter?.summary||'',
   bookSummary:state.book?.summary||''
  };
  const raw=await global.HerAI.collaborate((state.manuscript||'').slice(-12000),context);
  try{return JSON.parse(raw)}catch{return {continuation:raw,observerDecision:'Her prepared a continuation.',analystNotes:[],usedCharacters:[],worldUpdates:[],suggestedIdeas:[]}}
 }
}
global.HerCoAuthorBrain=new CoAuthorBrain();
})(window);