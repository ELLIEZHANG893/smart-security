/* Camera observations, semantic records, and timestamp-linked keyframes. */
const cameraNames={living:'客厅',door:'门口'}, cameraModels={living:'E30',door:'E340'};
let monitor={camera:'living',tab:'viewer',filter:'all',query:'',event:null,position:0,playing:false,wide:false};
let liveTicks=0, livePhase=0, liveStarted=page==='monitor';
const cameraFor=e=>['delivery','leave','visitor'].includes(e.type)?'door':'living';
const timeSeconds=t=>{const a=t.split(':').map(Number);return a[0]*3600+a[1]*60+(a[2]||0)};
const formatSeconds=n=>{n=((n%86400)+86400)%86400;return [Math.floor(n/3600),Math.floor(n/60)%60,Math.floor(n)%60].map(x=>String(x).padStart(2,'0')).join(':')};
const observationDate=()=>s.clock.startsWith('09/28')?'2026-09-28':'2026-09-27';
const previousEventData=eventData;
eventData=e=>e.observation?{...previousEventData(e),time:e.observation.facts[0].slice(0,5),facts:e.observation.facts,...(e.type==='delivery'?{desc:'访客把物品放在地垫旁，本次放置行为已记录。'}:{})}:previousEventData(e);
function cameraFacts(e){
 const d=eventData(e);
 if(e.type==='rain')return [d.facts[0],d.time+':01 窗边持续观察，窗扇保持开口',d.facts[2]];
 if(e.type==='wake')return [d.time+':00 覆盖区域出现休息姿态',d.time+':02 观察到持续低活动',d.time+':08 持续观察，等待本人回应'];
 if(e.type==='health')return ['19:50:00 客厅出现低活动姿态','19:50:05 当前姿态持续','19:50:12 活动幅度保持较低'];
 return d.facts;
}
function clipFor(e){
 const facts=cameraFacts(e), frames=facts.map((fact,index)=>{const t=fact.match(/\d{2}:\d{2}:\d{2}/)?.[0]||eventData(e).time+':00';return {time:t,second:timeSeconds(t),text:fact.replace(/^.*?\d{2}:\d{2}(?::\d{2})?\s*/,''),phase:index}});
 const start=frames[0].second-3,end=frames[frames.length-1].second+4;
 return {event:e,camera:cameraFor(e),date:e.observation?.date||e.capturedDate||(e.type==='wake'&&e.due?e.due.slice(0,10):'2026-09-27'),frames,start,end,duration:end-start,key:e.type==='rain'||e.type==='fall'?2:1};
}
function semanticLogs(){return s.events.filter(e=>scenes[e.type]).map(clipFor).sort((a,b)=>(b.date+formatSeconds(b.start)).localeCompare(a.date+formatSeconds(a.start)))}
function selectedClip(){return monitor.event?semanticLogs().find(c=>c.event.id===monitor.event):null}
function selectedFrame(c){let second=c.start+monitor.position;return c.frames.reduce((chosen,f)=>f.second<=second?f:chosen,c.frames[0])}
function openMonitor(camera='living',id=null,frame=null,tab='viewer'){
 close();s.locked=false;monitor={...monitor,camera,tab,event:id,playing:false,wide:false,query:''};
 const c=id?semanticLogs().find(c=>c.event.id===id):null;
 if(c){monitor.camera=c.camera;monitor.position=c.frames[frame===null?c.key:frame].second-c.start}
 else {monitor.event=null;monitor.position=0;liveStarted=true}
 navigate('monitor');
}
function viewEventCamera(id,index=null){const e=getEvent(id);if(e)openMonitor(cameraFor(e),id,index)}
function homeCameras(){return `<section class="home-cameras" aria-label="家庭监控"><div class="monitor-section-title"><div><span class="eyebrow">LIVE AT HOME</span><h2>想家了，就看一眼。</h2></div><button class="monitor-text" data-act="monitorOpen">查看监控 ${icon('arrow')}</button></div><div class="home-camera-grid">${Object.keys(cameraNames).map(c=>`<button class="home-camera" data-act="monitorOpen" data-camera="${c}" aria-label="查看${cameraNames[c]}监控"><div class="home-camera-art">${cameraArt(c,'idle',1)}<span class="camera-status ${s.offline?'unavailable':''}"><i></i>${s.offline?'连接中断':'在线'}</span></div><span><strong>${cameraNames[c]}</strong><small>${cameraModels[c]}　↗</small></span></button>`).join('')}</div><button class="home-log-link" data-act="monitorLogs">${icon('memory')}<span>语义日志 <small>画面自动整理，轻点回看关键帧</small></span><b>›</b></button></section>`}
const homeBeforeMonitor=home;
home=function(){const pet=s.events.find(e=>e.type==='pet'&&e.status!=='corrected');return homeBeforeMonitor().replace('<div class="dashboard">',homeCameras()+'<div class="dashboard">').replace(/<article class="card camera">[\s\S]*?<\/article>/,'').replace(/查看依据 /g,'查看监控 ').replace('18:36 · 观察到连续饮水行为',(pet?eventData(pet).time:'18:36')+' · 观察到连续饮水行为')};
const memoriesBeforeMonitor=memories;
memories=function(){return memoriesBeforeMonitor().replace('<div class="two-col">',`<button class="memory-log-entry" data-act="monitorLogs">${icon('camera')}<span><strong>查看语义日志</strong><small>每段家庭观察，都关联对应画面</small></span><b>›</b></button><div class="two-col">`)};
function monitorLogRow(c,compact=false){let d=eventData(c.event),isRisk=d.u>=4;return `<button class="semantic-row ${compact?'compact':''}" data-act="monitorEvent" data-id="${c.event.id}" aria-label="查看关键帧：${esc(d.title)}"><span class="log-image">${cameraArt(c.camera,c.event.type,c.key)}<span>${icon('camera')}</span></span><span class="log-copy"><small>${c.date.slice(5).replace('-','/')} · ${formatSeconds(c.start+3).slice(0,8)} · ${cameraNames[c.camera]}</small><strong>${esc(d.title)}</strong>${compact?'':`<span class="log-summary">${esc(d.desc)}</span>`}<span class="log-foot"><em class="${isRisk?'risk':''}">${isRisk?(c.event.status==='resolved'?'已处理异常':c.event.status==='corrected'?'已更正记录':'待核实观察'):'日常记录'}</em><span>${c.frames.length} 个关键帧　›</span></span></span></button>`}
function monitorView(){
 const c=selectedClip(),isReplay=!!c;
 return `<div class="monitor-page"><div class="monitor-header"><button data-page="home" aria-label="返回家">‹</button><div><h1>监控</h1><p>看见近况，也看懂发生了什么。</p></div><button class="monitor-header-icon" data-act="monitorSettings" aria-label="监控记录设置">${icon('settings')}</button></div><div class="camera-picker" role="group" aria-label="选择摄像头">${Object.keys(cameraNames).map(k=>`<button class="${monitor.camera===k?'selected':''}" data-act="monitorCamera" data-camera="${k}" aria-pressed="${monitor.camera===k}">${icon('camera')}<span>${cameraNames[k]} <small>${cameraModels[k]}</small></span><i class="${s.offline?'off':''}"></i></button>`).join('')}</div><div class="monitor-segments"><button class="${monitor.tab==='viewer'?'active':''}" data-act="monitorTab" data-tab="viewer">监控画面</button><button class="${monitor.tab==='logs'?'active':''}" data-act="monitorTab" data-tab="logs">语义日志</button></div>${monitor.tab==='logs'?monitorLogsView():`<div id="monitor-player" class="monitor-player ${monitor.wide?'expanded':''}">${monitorPlayer(c)}</div>${isReplay?replayDetails(c):liveDetails()}<div class="monitor-section-title recent-title"><h2>${isReplay?'相关语义日志':'最近的语义日志'}</h2><button class="monitor-text" data-act="monitorTab" data-tab="logs">全部记录 ›</button></div><div class="recent-logs" id="recent-logs">${semanticLogs().filter(x=>x.camera===monitor.camera).slice(0,3).map(x=>monitorLogRow(x,true)).join('')||'<div class="monitor-empty">正在整理这个区域的观察。</div>'}</div>`}</div>`;
}
function liveClock(){const currentTime=timeSeconds(s.clock.slice(-5)+':00'),base=s.monitorObservations?.[monitor.camera]?.start??currentTime;return formatSeconds(Math.max(base,currentTime)+liveTicks)}
function monitorPlayer(c){
 const frame=c?selectedFrame(c):null, unavailable=!c&&s.offline;
 const risk=s.events.find(e=>cameraFor(e)===monitor.camera&&eventData(e).u>=4&&!['resolved','corrected','cancelled'].includes(e.status));
 const type=c?c.event.type:risk?risk.type:monitor.camera==='living'?'pet':'delivery';
 const phase=c?frame.phase:livePhase;
 const t=c?formatSeconds(c.start+monitor.position):liveClock();
 return `<div class="camera-viewport ${unavailable?'camera-unavailable':''}" role="img" aria-label="${cameraNames[monitor.camera]}${c?'事件关键画面':'当前监控画面'}" data-camera="${monitor.camera}" data-frame="${phase}">${unavailable?`<div class="camera-disconnected">${icon('camera')}<strong>摄像头连接中断</strong><p>历史日志与关键画面仍可查看</p><button class="btn light tiny" data-act="offline">重新连接</button></div>`:cameraArt(monitor.camera,type,phase)}${unavailable?'':`<div class="camera-osd"><span class="live-badge ${c?'replay':''}"><i></i>${c?'事件回看':'实时画面'}</span><span>2K</span></div><time class="camera-time">${c?c.date:observationDate()}　${t}</time><div class="camera-location">${icon('camera')} ${cameraNames[monitor.camera]} · ${cameraModels[monitor.camera]}</div>`}<button class="expand-camera" data-act="monitorExpand" aria-label="${monitor.wide?'收起画面':'放大画面'}">${monitor.wide?'↙':'⛶'}</button></div><div class="player-toolbar">${c?`<button data-act="monitorPlay" aria-label="${monitor.playing?'暂停回放':'播放片段'}">${monitor.playing?'Ⅱ':'▶'}</button><span>${formatSeconds(c.start+monitor.position)} <small>/ ${formatSeconds(c.end)}</small></span><button class="back-live" data-act="monitorLive">回到实时</button>`:`<span class="stream-health"><i></i>${s.offline?'连接中断':'连接稳定'}</span><span class="stream-privacy">${icon('home')} 家庭私有画面</span>`}</div>${c?`<div class="playback-track"><input id="monitor-scrubber" type="range" min="0" max="${c.duration}" step="1" value="${monitor.position}" aria-label="回放时间" aria-valuetext="${formatSeconds(c.start+monitor.position)}"><div class="timeline-marks">${c.frames.map((f,i)=>`<button style="left:${(f.second-c.start)/c.duration*100}%" data-act="monitorSeek" data-frame="${i}" aria-label="定位关键帧 ${i+1} ${f.time}"></button>`).join('')}</div><div class="track-times"><span>${formatSeconds(c.start)}</span><span>${formatSeconds(c.end)}</span></div></div>`:''}`;
}
function replayDetails(c){const d=eventData(c.event),f=selectedFrame(c);return `<div class="replay-detail"><div class="monitor-section-title"><h2>${esc(d.title)}</h2><span class="mini-tag">已定位关键帧</span></div><p class="frame-caption" id="frame-caption"><time>${f.time}</time> ${esc(f.text)}</p><div class="keyframe-strip">${c.frames.map((f,i)=>`<button class="keyframe ${f.phase===selectedFrame(c).phase?'active':''}" data-act="monitorSeek" data-frame="${i}" aria-label="关键帧 ${i+1}：${f.time} ${esc(f.text)}"><span>${cameraArt(c.camera,c.event.type,f.phase)}<small>${f.time}</small></span><b>${esc(f.text)}</b></button>`).join('')}</div><div class="replay-actions"><button data-act="monitorEvidence" data-id="${c.event.id}">事件详情与处理 ${icon('arrow')}</button><span>${statusText(c.event)}</span></div></div>`}
function observationRecord(){return s.monitorObservations?.[monitor.camera]}
function liveDetails(){const r=observationRecord(),done=!!r?.eventId;return `<div class="semantic-pipeline"><div class="pipeline-heading"><span class="pipeline-icon">${icon('memory')}</span><div><strong>${!s.perception?'语义整理已暂停':s.offline?'等待画面恢复':'画面正在自动转成语义日志'}</strong><p>${!s.perception?'恢复感知后，继续整理新的观察。':s.offline?'连接恢复后继续观察，已有日志保留。':done?'本次连续观察已合并，关键帧已关联。':'连续动作合并记录，保留发生的时间与画面。'}</p></div></div><div class="pipeline-steps"><span class="${livePhase>=0?'done':''}">① 连续观察</span><i></i><span class="${livePhase>=1?'done':''}">② 理解行为</span><i></i><span class="${done?'done':''}">③ 生成日志</span></div><div class="observation-text" aria-live="polite">${done?`<button data-act="monitorEvent" data-id="${r.eventId}"><span class="dot"></span> ${monitor.camera==='living'?'团子的饮水行为已记录':'门口物品放置已记录'} <span>查看关键帧 ›</span></button>`:`<span class="dot"></span> ${s.offline?'等待设备连接':!s.perception?'感知已暂停':monitor.camera==='living'?['团子进入水碗区域','观察到连续低头饮水','饮水结束，正在合并记录'][livePhase]:['访客携物进入门区','物品放在地垫旁','本次放置行为正在整理'][livePhase]}`}</div></div>`}
function monitorLogsView(){const logs=semanticLogs().filter(c=>c.camera===monitor.camera);return `<div class="semantic-log-view"><div class="log-title"><h2>画面里的事，已经记下。</h2><p>按发生时间整理 · 每条记录都能回看</p></div><label class="semantic-search"><span>${icon('memory')}</span><input id="semantic-search" type="search" aria-label="搜索语义日志" placeholder="搜索宠物、窗边、访客…" value="${esc(monitor.query)}"></label><div class="log-filters">${[['all','全部'],['risk','异常'],['daily','日常']].map(([id,t])=>`<button class="${monitor.filter===id?'active':''}" data-act="monitorFilter" data-filter="${id}">${t}</button>`).join('')}<span id="log-count">${logs.length} 条记录</span></div><div id="semantic-list">${logs.map(c=>`<div class="semantic-result" data-risk="${eventData(c.event).u>=4}" data-search="${esc(eventData(c.event).title+' '+eventData(c.event).desc)}">${monitorLogRow(c)}</div>`).join('')}</div><div class="monitor-empty" id="no-semantic-results" hidden>这个范围还没有匹配的记录。</div><div class="log-retention">${icon('home')} 语义日志保留 30 天 · 关键画面保留 24 小时</div></div>`}
function applyLogFilter(){if(page!=='monitor'||monitor.tab!=='logs')return;let n=0;document.querySelectorAll('.semantic-result').forEach(el=>{const risk=el.dataset.risk==='true';el.hidden=(monitor.filter==='risk'&&!risk)||(monitor.filter==='daily'&&risk)||!el.dataset.search.includes(monitor.query);if(!el.hidden)n++});if($('log-count'))$('log-count').textContent=n+' 条记录';if($('no-semantic-results'))$('no-semantic-results').hidden=n>0}
function observationPhase(ticks){return ticks>=10?2:ticks>=4?1:0}
function ensureObservation(){
 if(!s.monitorObservations)s.monitorObservations={};
 let r=observationRecord();
 if(!r||r.date!==observationDate()||(r.eventId&&!getEvent(r.eventId))){s.monitorObservations[monitor.camera]={date:observationDate(),start:timeSeconds(s.clock.slice(-5)+':00'),ticks:0,eventId:null};r=observationRecord()}
 liveTicks=r.ticks;livePhase=r.eventId?2:observationPhase(liveTicks);return r;
}
function recordObservation(r,camera=monitor.camera){
 if(r.eventId)return;
 const type=camera==='living'?'pet':'delivery',texts=camera==='living'?['宠物进入水碗区域','连续低头接近水面','宠物离开，结束本次事件']:['有人携物进入门区','物品放置在地垫旁','访客仍在可见区域'];
 const facts=texts.map((x,i)=>formatSeconds(r.start+[0,4,10][i])+' '+x);
 const e={id:'observation-'+s.seq++,type,status:'recorded',receipts:['连续画面已合并为语义日志，关键帧已关联'],observation:{date:r.date,facts},capturedDate:r.date};
 r.eventId=e.id;s.events.unshift(e);persist();
}
const renderBeforeMonitor=render;
render=function(){
 if(page==='monitor'&&!monitor.event)ensureObservation();
 renderBeforeMonitor();
 $('phone').classList.toggle('monitor-open',page==='monitor');
 if(page==='monitor'){const b=$('nav').querySelector('[data-page="home"]');b?.classList.add('active');applyLogFilter()}
};
const detailBeforeMonitor=detail;
detail=function(id){detailBeforeMonitor(id);const e=getEvent(id);if(!e)return;const c=clipFor(e);const evidence=$('dialog-body').querySelector('.evidence');if(evidence)evidence.outerHTML=`<div class="detail-camera-link"><button data-act="monitorEvent" data-id="${e.id}"><span>${cameraArt(c.camera,e.type,c.key)}<b>▶</b></span><strong>查看对应监控关键帧</strong><small>${cameraNames[c.camera]} · ${c.frames[c.key].time}　↗</small></button></div>`};
const addBeforeMonitor=addScene;
addScene=function(type){addBeforeMonitor(type);const e=s.events.find(x=>x.type===type);if(e&&!e.capturedDate)e.capturedDate=observationDate();persist()};
document.addEventListener('click',ev=>{
 const b=ev.target.closest('button');if(!b||b.disabled)return;
 const a=b.dataset.act;
 if(a==='detail'&&!b.closest('dialog')){ev.stopImmediatePropagation();viewEventCamera(b.dataset.id);return}
 if(a==='openLockNotice'){ev.stopImmediatePropagation();s.locked=false;s.lockNotification=null;if(b.dataset.id)viewEventCamera(b.dataset.id);else navigate('home');return}
 if(a==='unlock'&&b.getAttribute('aria-label')==='打开家庭画面'){ev.stopImmediatePropagation();openMonitor();return}
 if(a==='beginStory'||a==='confirmReset'){monitor.event=null;monitor.playing=false;liveTicks=0;livePhase=0;liveStarted=false}
 if(b.dataset.page&&b.dataset.page!=='monitor'){monitor.playing=false;monitor.wide=false}
 switch(a){
 case 'monitorOpen':openMonitor(b.dataset.camera||'living');break;
 case 'monitorLogs':openMonitor('living',null,null,'logs');break;
 case 'monitorEvent':viewEventCamera(b.dataset.id);break;
 case 'monitorCamera':monitor.camera=b.dataset.camera;monitor.event=null;monitor.playing=false;monitor.wide=false;liveStarted=true;render();break;
 case 'monitorTab':monitor.tab=b.dataset.tab;monitor.playing=false;if(monitor.tab==='viewer')liveStarted=true;render();break;
 case 'monitorLive':monitor.event=null;monitor.playing=false;liveStarted=true;render();break;
 case 'monitorSeek':{const c=selectedClip();if(c){monitor.position=c.frames[Number(b.dataset.frame)].second-c.start;monitor.playing=false;render()}break}
 case 'monitorPlay':{const c=selectedClip();if(c){if(monitor.position>=c.duration)monitor.position=0;monitor.playing=!monitor.playing;render()}break}
 case 'monitorExpand':monitor.wide=!monitor.wide;render();break;
 case 'monitorEvidence':monitor.playing=false;detail(b.dataset.id);break;
 case 'monitorFilter':monitor.filter=b.dataset.filter;render();break;
 case 'monitorSettings':show('监控与语义日志',`<h3>连续画面自动整理</h3><p>把连续的家庭观察合并成一条语义日志，并关联摄像头、发生时间和关键帧。</p>${toggle('自动整理语义日志','跟随家庭感知开关，管理后续观察。','perception')}<h3>回看与保留</h3><p>关键画面保留 24 小时，事件语义保留 30 天。实时查看支持客厅与门口切换。</p>${btn('返回监控','close')}`);break;
 }
},true);
document.addEventListener('input',ev=>{
 if(ev.target.id==='semantic-search'){monitor.query=ev.target.value.trim();applyLogFilter()}
 if(ev.target.id==='monitor-scrubber'){monitor.position=Number(ev.target.value);monitor.playing=false;const c=selectedClip();if(c){const f=selectedFrame(c);ev.target.setAttribute('aria-valuetext',formatSeconds(c.start+monitor.position));$('monitor-player').querySelector('.camera-viewport').innerHTML=monitorPlayer(c).split('<div class="player-toolbar">')[0].replace(/^<div[^>]+>/,'').replace(/<\/div>$/,'');$('frame-caption').innerHTML=`<time>${f.time}</time> ${esc(f.text)}`}}
});
document.addEventListener('change',ev=>{if(ev.target.id==='monitor-scrubber')render()});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&monitor.wide){monitor.wide=false;render()}});
setInterval(()=>{
 if(document.hidden)return;
 let completed=false;
 if(!blocked())for(const [camera,r]of Object.entries(s.monitorObservations||{})){
  if(r.date!==observationDate())continue;
  r.ticks++;
  if(!r.eventId&&r.ticks>=12){recordObservation(r,camera);completed=true}
 }
 if(completed){persist();if(page==='home'&&!s.locked&&!$('dialog').open){const y=$('content').scrollTop;render();$('content').scrollTop=y}}
 if(page!=='monitor'||s.locked||$('dialog').open)return;
 const c=selectedClip();
 if(c&&monitor.playing&&monitor.tab==='viewer'){
  monitor.position=Math.min(c.duration,monitor.position+1);if(monitor.position>=c.duration)monitor.playing=false;
  const y=$('content').scrollTop;render();$('content').scrollTop=y;return;
 }
 if(c||!liveStarted||blocked())return;
 const r=ensureObservation();persist();
 if(monitor.tab==='viewer'){
  if($('monitor-player'))$('monitor-player').innerHTML=monitorPlayer(null);
  const pipeline=document.querySelector('.semantic-pipeline');if(pipeline)pipeline.outerHTML=liveDetails();
  if($('recent-logs'))$('recent-logs').innerHTML=semanticLogs().filter(x=>x.camera===monitor.camera).slice(0,3).map(x=>monitorLogRow(x,true)).join('');
 }else if(completed){const y=$('content').scrollTop;render();$('content').scrollTop=y}
},1000);
