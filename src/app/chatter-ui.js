/* Contextual everyday messages share the app's lock-screen notification channel. */
scenes.pet_wait={title:'团子在门边待了一会儿',desc:'团子在客厅靠近入口的位置停留，并多次朝门口张望。',time:'18:55',zone:'客厅入口旁 · E30',icon:'pet',u:1,c:4,confidence:.82,facts:['18:54:12 宠物靠近客厅入口','18:54:36 宠物在入口附近来回走动','18:55:02 停留后再次朝门口张望'],unknown:'宠物的情绪与意图需要结合日常习惯理解。',suggest:'记录这段日常，想它的时候可以看一眼。',kind:'care'};
scenes.night_activity={title:'夜深了，客厅还有活动',desc:'深夜在客厅观察到持续坐姿与小幅活动。',time:'23:48',zone:'客厅沙发区 · E30',icon:'clock',u:1,c:3,confidence:.8,facts:['23:47:40 客厅沙发区出现坐姿','23:47:50 观察到上身小幅活动','23:48:00 坐姿持续，仍有活动'],unknown:'当前活动内容与个人休息安排由本人决定。',suggest:'静默整理这段观察，留下一句晚安。',kind:'care'};
function ensureChatter(){
 if(!s.chatter){s.chatter=Chatter.fresh();s.chatter.checked=s.events.filter(e=>e.id.startsWith('seed-')).map(e=>e.id+':'+e.type)}
 const def=Chatter.fresh();for(const key of Object.keys(def))if(s.chatter[key]===undefined)s.chatter[key]=def[key];
 if(s.chatter.notificationVersion!==2){
  s.chatter.frequency='occasional';s.chatter.notificationVersion=2;
  if(s.chatter.current&&!s.chatter.current.id)s.chatter.current.id=s.chatter.current.eventId+':'+s.chatter.current.createdAt;
 }
}
ensureChatter();
function chatterContext(){return {day:observationDate(),time:s.clock.slice(-5),quietStart:s.rules.quiet,mode:s.mode,perception:s.perception,offline:s.offline,homeState:s.homeState,budget:s.rules.budget,urgent:s.events.some(e=>eventData(e).u>=4&&['pending','ack','calling','connected','escalate','contact','failed'].includes(e.status)),events:s.events.map(e=>{const d=eventData(e),c=clipFor(e);return {id:e.id,type:e.type,status:e.status,title:d.title,facts:cameraFacts(e),day:c.date,time:d.time}})}}
function lifeMessageSetting(){ensureChatter();return `<div class="setting"><div><h3>生活消息</h3><p>偶尔分享家里的日常，安静时段静默送达。</p></div><button class="switch ${s.chatter.enabled?'on':''}" role="switch" aria-checked="${s.chatter.enabled}" aria-label="生活消息" data-act="lifeMessages"></button></div>`}
const notificationsBeforeLife=notificationSettings;
notificationSettings=function(){const lockButton=btn('预览 iPhone 锁屏','lockPreview','secondary');return notificationsBeforeLife().replace(lockButton,lifeMessageSetting()+lockButton)};
function lifeNotificationOptions(){show('锁屏显示选项',`<div class="notification-options">${toggle('锁屏安全状态常驻显示','持续显示观察范围与最新状态。','notifyPersistent')}${toggle('安全状态变化弹窗','变化时显示事件通知，轻点查看对应画面。','notifyChanges')}${lifeMessageSetting()}${btn('查看锁屏效果','returnLock')}</div>`)}
const renderLockBeforeLife=renderLock;
renderLock=function(){
 renderLockBeforeLife();
 const host=$('lockscreen');if(!host||!s.locked)return;
 const context=chatterContext(),note=Chatter.available(s.chatter,context);
 if(!note||safetySummary().level!=='normal'||host.querySelector('.lock-notification'))return;
 const card=document.createElement('article');card.className='lock-life-message';card.setAttribute('aria-label','在家消息');
 card.innerHTML=`<button class="lock-notification" data-act="openLifeMessage" data-message="${esc(note.id)}"><div class="app-line">${icon('home')}<span>在家 InHome</span><span>${esc(note.time)}</span></div><p>${esc(note.text)}</p></button><button class="lock-life-close" data-act="dismissLifeMessage" data-message="${esc(note.id)}" aria-label="关闭这条生活消息">×</button>`;
 const empty=host.querySelector('.lock-empty');if(empty)empty.replaceWith(card);else host.querySelector('.lock-bottom').before(card);
};
const renderBeforeChatter=render;
render=function(){ensureChatter();Chatter.consider(s.chatter,chatterContext());renderBeforeChatter()};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button');if(!b||b.disabled)return;const a=b.dataset.act;
 if(!['lifeMessages','openLifeMessage','dismissLifeMessage','notificationOptions','lockPreview'].includes(a))return;
 ev.stopImmediatePropagation();ensureChatter();
 if(a==='lifeMessages'){s.chatter.enabled=!s.chatter.enabled;persist();if($('dialog').open)lifeNotificationOptions();else render();renderLock();return}
 if(a==='notificationOptions'){lifeNotificationOptions();return}
 if(a==='lockPreview'){close();s.locked=true;render();return}
 const note=s.chatter.current;if(!note||note.id!==b.dataset.message)return;
 if(a==='dismissLifeMessage'){Chatter.consume(s.chatter,note.id,'dismissed');persist();renderLock();return}
 Chatter.consume(s.chatter,note.id);persist();close();s.locked=false;
 if(getEvent(note.eventId))viewEventCamera(note.eventId);else openMonitor('living');
},true);
setInterval(()=>{
 if(document.hidden)return;
 ensureChatter();const before=JSON.stringify(s.chatter);Chatter.consider(s.chatter,chatterContext());
 if(before!==JSON.stringify(s.chatter)){persist();if(s.locked)renderLock()}
},8000);
