(function(global){
'use strict';
const VERSION='1.0.0';
const listeners=new Map();
const HerBrainBus={
 on(event,handler){if(!listeners.has(event))listeners.set(event,new Set());listeners.get(event).add(handler);return()=>listeners.get(event)?.delete(handler)},
 emit(event,payload){(listeners.get(event)||[]).forEach(fn=>{try{fn(payload)}catch(err){console.error('[HerBrainBus]',event,err)}})}
};
function now(){return new Date().toISOString()}
function clone(value){return JSON.parse(JSON.stringify(value??null))}
function createState(book,chapter,manuscript){return {
 version:VERSION,bookId:book?.id||null,chapterId:chapter?.id||null,updatedAt:now(),
 manuscript:String(manuscript||''),characters:clone(book?.characters||[]),
 world:{locations:clone(book?.locations||[]),organizations:clone(book?.organizations||[]),artifacts:clone(book?.artifacts||[]),magic:clone(book?.magic||[])},
 timeline:clone(book?.timeline||[]),ideas:clone(chapter?.ideas||[]),insights:[],activeScene:{location:null,time:null,characters:[]}
}}
class Brain{constructor(name){this.name=name;this.enabled=true} report(type,data={}){return {brain:this.name,type,createdAt:now(),...data}}}
global.HerBrainCore={VERSION,HerBrainBus,Brain,createState,clone,now};
})(window);
