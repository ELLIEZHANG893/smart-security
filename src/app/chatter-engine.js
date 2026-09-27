/* Context-bound small talk with persistent rate limits. */
const Chatter = (() => {
 const frequencies={rare:{label:'少一点',cap:1,gap:180,probability:.15},occasional:{label:'偶尔',cap:2,gap:90,probability:.25},often:{label:'多一点',cap:3,gap:60,probability:.35}};
 const lines={
  pet:[['water-share','团子喝上水了，你也来一口？'],['water-day','水碗边短暂停靠，团子继续忙它的小日子。'],['water-cheers','团子刚给自己续了杯。愿你今天也有片刻清闲。']],
  food:[['food-serious','团子开饭了。今天这顿，它看起来很投入。'],['food-life','饭碗一响，生活就有了正事。'],['food-you','团子已经认真吃饭了。你今天吃到喜欢的东西了吗？']],
  pet_wait:[['pet-miss','团子在门边待了一会儿，可能有点想你了。'],['pet-wait','团子又朝门口看了看。它的小脑袋里，也许正排练着迎接你。'],['pet-bored','团子在门边转了一会儿。今天的家，可能差一点你回来的热闹。']],
  delivery:[['door-something','门口多了一件东西。愿它刚好是你期待的那一份。'],['door-life','东西好好放下了。生活里这些小小的妥帖，也挺好。'],['door-rest','门口的事记下了，你接着忙你的。']],
  leave:[['leave-quiet','门轻轻关上，家把安静收好了。'],['leave-page','门口安静下来了。今天的生活，又翻过一小页。']],
  rain:[['rain-background','窗边的事处理好了，雨声可以安心当背景音乐。'],['rain-slow','窗边的事有了交代，接下来适合慢一点。']],
  night_activity:[['night-rest','很晚了，今天也辛苦啦，早点休息。'],['night-pillow','今天的进度先存到这里？枕头可能等你挺久了。'],['night-goodnight','夜已经很深了。给今天画个小句号，明天再接着来。']],
  wake:[['wake-reply','提醒已经收到，剩下的交给醒来的你。'],['wake-first','今天的第一件事，已经排好队了。']]
 };
 const fresh=()=>({enabled:true,frequency:'occasional',started:false,current:null,history:[],dailyCounts:{},checked:[],lastAutomaticAt:0,calmUntil:0,riskActive:false,mutedDay:null});
 const minutes=t=>{const a=t.split(':').map(Number);return a[0]*60+(a[1]||0)};
 function candidates(ctx){
  return ctx.events.filter(e=>{
   if(!lines[e.type]||['corrected','cancelled'].includes(e.status))return false;
   const age=(Date.parse(ctx.day+'T'+ctx.time+':00Z')-Date.parse(e.day+'T'+e.time+':00Z'))/60000;if(!Number.isFinite(age)||age<0||age>90)return false;
   if(e.type==='rain'&&e.status!=='resolved')return false;
   if(e.type==='wake'&&!['resolved','ack'].includes(e.status))return false;
   if(e.type==='pet_wait'&&ctx.homeState!=='离家')return false;
   if(e.type==='night_activity'&&!(minutes(ctx.time)>=1320||minutes(ctx.time)<120))return false;
   return true;
  }).sort((a,b)=>(b.day+'T'+b.time).localeCompare(a.day+'T'+a.time)).map(e=>({...e,key:e.id+':'+e.type,lines:lines[e.type]}));
 }
 function choose(source,history=[],rng=Math.random){
  const recent=new Set(history.slice(-5).map(m=>m.lineId));let pool=source.lines.filter(([id])=>!recent.has(id));
  if(!pool.length)pool=source.lines.filter(([id])=>id!==history.at(-1)?.lineId);
  if(!pool.length)pool=source.lines;
  const [lineId,text]=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  return {lineId,text,kind:source.type,eventId:source.id,sourceTitle:source.title,sourceFacts:source.facts,sourceTime:source.time,sourceDay:source.day};
 }
 function consider(state,ctx,now=Date.now(),rng=Math.random){
  if(ctx.urgent){state.riskActive=true;return null}
  if(state.riskActive){state.riskActive=false;state.calmUntil=now+30*60000}
  if(!state.enabled||ctx.mode!=='companion'||!ctx.perception||ctx.offline||ctx.budget===0||state.mutedDay===ctx.day||now<state.calmUntil)return null;
  const f=frequencies[state.frequency]||frequencies.occasional;
  if((state.dailyCounts[ctx.day]||0)>=f.cap)return null;
  if(state.lastAutomaticAt&&now-state.lastAutomaticAt<f.gap*60000)return null;
  const source=candidates(ctx).find(c=>!state.checked.includes(c.key));if(!source)return null;
  state.checked.push(source.key);state.checked=state.checked.slice(-120);
  const first=!state.started;state.started=true;
  if(!first&&rng()>=f.probability)return null;
  const note={...choose(source,state.history,rng),id:source.key+':'+now,day:ctx.day,time:ctx.time,createdAt:now,automatic:true,silent:quiet(ctx.time,ctx.quietStart||'22:00'),read:false,dismissed:false};
  state.current=note;state.history.push(note);state.history=state.history.slice(-40);state.dailyCounts[ctx.day]=(state.dailyCounts[ctx.day]||0)+1;state.lastAutomaticAt=now;return note;
 }
 function quiet(time,start){const n=minutes(time);return n>=minutes(start)||n<420}
 function available(state,ctx,now=Date.now()){
  const note=state.current;
  if(!note||note.read||note.dismissed||note.automatic===false||!state.enabled||ctx.mode!=='companion'||!ctx.perception||ctx.offline||ctx.budget===0||ctx.urgent||state.riskActive||now<state.calmUntil||state.mutedDay===ctx.day)return null;
  const age=(Date.parse(ctx.day+'T'+ctx.time+':00Z')-Date.parse(note.day+'T'+note.time+':00Z'))/60000;
  const source=ctx.events.find(e=>e.id===note.eventId);
  if(!source||['corrected','cancelled'].includes(source.status)||!Number.isFinite(age)||age<0||age>1440)return null;
  return note;
 }
 function consume(state,id,kind='read'){
  const note=state.current;
  if(!note||note.id!==id)return false;
  const key=kind==='dismissed'?'dismissed':'read';note[key]=true;
  for(const item of state.history)if(item.id===id)item[key]=true;
  return true;
 }
 return {frequencies,lines,fresh,candidates,choose,consider,quiet,available,consume};
})();
