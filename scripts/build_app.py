from pathlib import Path
import base64
from product_polish import polish

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'demo'
room = 'data:image/svg+xml;base64,' + base64.b64encode((ROOT/'src/assets/living-room.svg').read_bytes()).decode()
html = (ROOT/'src/app/demo-source.html').read_text(encoding='utf-8').replace('__ROOM__',room)
html=html.replace('</style>',(ROOT/'src/app/ios-enhancements.css').read_text(encoding='utf-8')+'\n</style>')
html=html.replace('if(s.customRule)draftRule=s.customRule;', (ROOT/'src/app/ios-enhancements.js').read_text(encoding='utf-8')+'\nif(s.customRule)draftRule=s.customRule;')
html=html.replace('</style>',(ROOT/'src/app/monitoring.css').read_text(encoding='utf-8')+'\n</style>')
html=html.replace('if(s.customRule)draftRule=s.customRule;', (ROOT/'src/app/camera-art.js').read_text(encoding='utf-8')+'\n'+(ROOT/'src/app/monitoring.js').read_text(encoding='utf-8')+'\nif(s.customRule)draftRule=s.customRule;')
html=html.replace('</style>',(ROOT/'src/app/chatter.css').read_text(encoding='utf-8')+'\n</style>')
html=html.replace('if(s.customRule)draftRule=s.customRule;', (ROOT/'src/app/chatter-engine.js').read_text(encoding='utf-8')+'\n'+(ROOT/'src/app/chatter-ui.js').read_text(encoding='utf-8')+'\nif(s.customRule)draftRule=s.customRule;')
html=html.replace("['home','memory','rules','extensions','settings']", "['home','memory','rules','extensions','settings','monitor']")
html=html.replace('settings:settings}[page]', 'settings:settings,monitor:monitorView}[page]')
html=html.replace('const eventData=', 'let eventData=')
html=html.replace('<button class="avatar" data-act="toSettings"', '<button class="lock-entry" data-act="lockPreview">锁屏预览</button><button class="avatar" data-act="toSettings"')
html=polish(html)
(OUT/'在家InHome_iOS_Demo.html').write_text(html,encoding='utf-8')
print('Demo generated:',len(html),'characters')
