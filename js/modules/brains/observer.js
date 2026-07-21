(function(global){'use strict';
const KEY='her_observer_memory_v2';
class ObserverBrain extends HerBrainCore.Brain{
 constructor(){super('Observer');this.timer=null;this.state=null}
 hydrate(book,chapter,manuscript){const fresh=HerBrainCore.createState(book,chapter,manuscript);fresh.book=book;fresh.chapter=chapter;const saved=safe(localStorage.getItem(KEY));this.state=saved?.bookId===fresh.bookId?{...saved,...fresh,insights:saved.insights||[]}:fresh;return this.state}
 observe({book,chapter,manuscript,persist=true}){const s=this.hydrate(book,chapter,manuscript),a=HerAnalystBrain.inspect(s),w=HerWorldBrain.inspect(s);
 s.characters=merge(s.characters,a.discoveredCharacters);applyRelationships(s.characters,a.relationships);s.world.locations=merge(s.world.locations,w.locations);s.world.organizations=merge(s.world.organizations,w.organizations);s.world.artifacts=merge(s.world.artifacts,w.artifacts);s.timeline=mergeEvents(s.timeline,w.timeline);s.ideas=mergeIdeas(s.ideas,w.ideas);s.insights=a.insights.slice(-100);s.characterContext=HerCharacterBrain.prepare(s);s.coAuthorContext=HerCoAuthorBrain.prepare(s);s.metrics=a.metrics;s.updatedAt=HerBrainCore.now();
 if(persist)localStorage.setItem(KEY,JSON.stringify(s));HerBrainCore.HerBrainBus.emit('observer:updated',s);return s}
 schedule(context,delay=900){clearTimeout(this.timer);this.timer=setTimeout(()=>this.observe(context),delay)}
 async collaborate(context){
  const state=this.observe({...context,persist:true});
  HerBrainCore.HerBrainBus.emit('observer:collaboration-started',state);
  const result=await HerCoAuthorBrain.collaborate(state);
  const record={id:`collab-${Date.now()}`,createdAt:HerBrainCore.now(),chapterId:state.chapterId,result};
  state.collaborations=[...(state.collaborations||[]),record].slice(-100);
  for(const idea of result.suggestedIdeas||[]){state.ideas=mergeIdeas(state.ideas,[{id:`ai-idea-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,text:idea,status:'Future',source:'phase3-ai',chapterId:state.chapterId,createdAt:HerBrainCore.now()}])}
  state.updatedAt=HerBrainCore.now();this.state=state;localStorage.setItem(KEY,JSON.stringify(state));
  HerBrainCore.HerBrainBus.emit('observer:collaboration-ready',{state,result,record});return {state,result,record}
 }
 getState(){return this.state||safe(localStorage.getItem(KEY))}
}
function safe(v){try{return JSON.parse(v||'null')}catch{return null}}
function merge(current,incoming){const m=new Map((current||[]).map(x=>[HerKnowledge.key(x.name),x]));for(const item of incoming||[]){const k=HerKnowledge.key(item.name);if(!k)continue;if(!m.has(k))m.set(k,item);else{const old=m.get(k);m.set(k,{...old,...item,id:old.id||item.id,aliases:[...new Set([...(old.aliases||[]),...(item.aliases||[])])],traits:[...new Set([...(old.traits||[]),...(item.traits||[])])],appearances:[...new Set([...(old.appearances||[]),...(item.appearances||[])])],relationships:old.relationships||[]})}}return [...m.values()]}
function applyRelationships(chars,rels){for(const r of rels||[]){const c=chars.find(x=>HerKnowledge.key(x.name)===HerKnowledge.key(r.from));if(c){c.relationships=c.relationships||[];if(!c.relationships.some(x=>HerKnowledge.key(x.character||x.to)===HerKnowledge.key(r.to)&&x.type===r.type))c.relationships.push({character:r.to,type:r.type,confidence:r.confidence,source:r.source})}}}
function mergeEvents(a,b){const m=new Map((a||[]).map(x=>[x.id||`${x.chapterId}|${x.summary}`,x]));for(const x of b||[])m.set(x.id||`${x.chapterId}|${x.summary}`,x);return [...m.values()].slice(-500)}
function mergeIdeas(a,b){const m=new Map((a||[]).map(x=>[HerKnowledge.key(x.text),x]));for(const x of b||[])if(!m.has(HerKnowledge.key(x.text)))m.set(HerKnowledge.key(x.text),x);return [...m.values()].slice(-200)}
global.HerObserver=new ObserverBrain();
})(window);
