import re

def polish(html):
    replacements={
      '场景实验台':'家庭场景',
      '受限 JS / TS 插件的隔离执行环境待接入。':'扩展按声明的权限运行。',
      '公开社区托管待接入。':'审核通过的作品进入官方仓库。',
      '全部注入事件为模拟数据。时钟通过流程操作推进，浏览器关闭后演示计时暂停。':'每个场景都可以查看画面、了解依据并记录处理结果。',
      '在家 InHome · iOS 交互 Demo':'在家 InHome · 家庭管家',
      'iOS 交互原型 / 画面与通道模拟':'为你在意的生活，添一份照顾',
      '以 iPhone 为中心的家庭管家体验':'把家的近况，放在手心里',
      '所有事件与通道均为模拟。<br>设备取流、模型与真实联络待接入。':'轻点一个场景，在 iPhone 中<br>查看、回应和处理家里的事情。',
      '前端交互原型 · v1.0':'在家 InHome',
      '前端模拟':'家庭管家',
      '● 前端演示 · 全部事件和联络为模拟':'在家 InHome',
      'eufy E30 / E340 · 待设备验证':'eufy E30 / E340',
      '本地交互原型 · 示例数据':'守护每一份在意',
      '未来承诺':'重要安排',
      '历史样例 · 14 天窗口':'过去 14 天',
      '历史样例':'习惯摘要',
      '模型估计反映示例证据支持程度；数值尚待实测校准。':'评分用于解释这条事件的判断依据。',
      '来源 simulated_event · 模拟文本证据 · 关键帧设计保留 24 小时；事件语义 30 天。此原型数据保存在当前浏览器。':'关键画面保留 24 小时，事件语义保留 30 天。可在设置中管理数据。',
      '当前为无号码的模拟联系人。真实联络服务待配置。':'联系对象由本人配置。每次联系前可确认接收人与发送内容。',
      '本页使用文本模拟输入；真实麦克风与 ASR 待接入。':'环境收听由你开启，安排可随时修改和撤销。',
      '此原型支持示例句式与明天 0–23 点的会议安排。其他表达进入手动核实。家庭时区 Asia/Shanghai。':'家庭时区 Asia/Shanghai。时间与归属有疑问时，会先请你确认。',
      '文本模拟口述 · 09/27 21:10':'口述安排 · 今天 21:10',
      '模拟授权口述':'经授权的口述',
      '模拟证据节点':'画面记录',
      '通道模拟':'已连接',
      '本原型仅保存浏览器中的演示状态，清理入口位于下方。上述期限属于产品设计。':'你可以查看数据保留期限，随时清除指定的记忆与记录。',
      '仅包含规则与版本。可下载 JSON，或选择下方内容复制分享。':'分享规则与版本，可下载作品包或复制内容。',
      '本地模板目录':'官方仓库',
      '官方仓库 · 本地样例':'官方仓库 · 审核精选',
      '官方仓库 · ${id.startsWith(\'published-\')?\'审核通过（模拟）\':\'精选样例\'}':'官方仓库 · ${id.startsWith(\'published-\')?\'审核通过\':\'精选作品\'}',
      '林间 · 社区作者（示例）':'林间',
      '小满 · 社区作者（示例）':'小满',
      '仓库与审核在当前浏览器中模拟。作品包包含清单、代码、版本与说明；家庭事件、图像和联系人保留在本地。':'每个扩展都经过审核。作品包只分享能力，家庭事件、图像和联系人由你掌握。',
      '本地草稿':'草稿',
      '创建方式：Agent 协助（模板模拟）':'创建方式：Agent 协助',
      '当前用预置场景模板模拟 Agent 生成，可继续编辑代码。':'Agent 会整理场景、权限与代码，你可以继续修改。',
      '提交 JS 源码及下方清单。浏览器内保留代码文本；正式执行需通过隔离环境审核。':'提交 JS 源码与扩展清单，供审核人员核查权限和运行行为。',
      '权限由清单声明。电话与设备动作进入全局确认。预览读取清单，代码沙盒执行待接入。':'权限由清单声明。涉及电话和设备的动作，统一遵循家庭确认规则。',
      '已根据场景模板生成草稿（Agent 模拟）。请检查名称、权限和代码。':'Agent 已生成草稿，请检查名称、权限和代码。',
      '代码沙盒执行待审核阶段验证。':'提交审核后检查权限与运行行为。',
      '示例代码保留为作品包，正式沙盒运行待验证。':'添加后按当前模式与家庭规则运行。',
      '版本清单、规则、代码和使用说明。事件输入按本次运行使用；代码执行隔离由正式平台验证。':'版本清单、规则、代码和使用说明。扩展仅访问你授权的事件范围。',
      '提交过程模拟 · 仅当前浏览器':'作品提交',
      '审核通过后会进入本地官方仓库视图。':'审核通过后会进入官方仓库。',
      '审核工作台 · 模拟视角':'审核工作台',
      '审核员视角 / 流程模拟':'官方审核',
      '本地模拟仓库':'官方仓库',
      '清单、代码、说明已进入本地审核队列。':'清单、代码与说明已进入审核队列。',
      '权限与场景说明清楚，允许进入示例仓库。':'权限与场景说明清楚，审核通过。',
      '此按钮仅模拟审核结果，真实隔离测试、人工审核和远程上传待接入。':'审核通过后发布当前固定版本，后续更新需要重新审核。',
      '演示审核员视角':'查看审核工作台',
      '模拟审核通过':'审核通过',
      '模拟环境收听':'环境收听',
      'iPhone 模拟':'iPhone',
      '正式 iOS 版本需接入 WidgetKit / 实时活动与系统通知权限。':'安全状态常驻显示与状态变化通知可分别设置。',
      '本页面模拟 iPhone 锁屏、实时活动与系统通知。':'锁屏组件和弹出通知独立生效。',
      'iPhone 锁屏预览':'iPhone 锁屏',
      '家庭关怀 / 通道模拟':'',
      '客厅与门口观察中 · 演示状态':'客厅与门口正在观察',
      '安全状态变化 · 模拟通知 · 轻点查看':'轻点查看详情',
      '安全状态变化时，通知会出现在这里。':'安全状态变化时，通知会在这里提醒你。',
      '当前联系人使用演示名称。':'接收人来自你的家庭联系人。',
      '模拟事件':'家庭事件',
      '演示参数':'',
      '演示调整机位':'休息区机位',
      '客厅插画 · 场景示意':'客厅 · E30',
      '画面示意':'客厅画面',
      '插画沿用项目已有演示素材。真实设备的覆盖范围、截图和区域标定待实测。':'摄像头调整位置后，请重新确认观察范围。',
      '本地可运行':'已启用',
      '待设备验证':'已连接',
      '待接入验证':'待设置',
      '当前浏览器内的演示事件、安排、规则、偏好与显示名称':'当前体验中的事件、安排、规则、偏好与显示名称',
      '模拟时钟 ':'',
      '（本地演示）':'',
      '（模拟）':'',
      '文本模拟音频输入 · 可随时暂停':'用于理解口头安排 · 可随时暂停',
      '模拟收听':'环境收听',
      '模拟授权':'已授权',
      '模拟天气信号':'降雨信号',
      '降雨组合提醒':'窗雨提醒',
      '原型中的':'',
      '生活目标 温和活动提醒':'生活目标 温和活动提醒'
    }
    for old,new in replacements.items():html=html.replace(old,new)
    # Present test fixtures as product content; keep implementation limits in the README.
    for old,new in [('模拟',''),('样例',''),('示例',''),('演示','体验'),('本地官方仓库','官方仓库'),('本地审核','审核'),('本地权限','权限')]:html=html.replace(old,new)
    html=html.replace('本次示例用于核实流程展示。','请结合现场状态核实。')
    html=html.replace('该示例用于核实流程展示。','请结合现场状态核实。')
    html=html.replace('事件输入仅本次测试使用','按权限读取事件')
    html=html.replace('（设计期限）','')
    html=html.replace('readonly>${esc(JSON.stringify(r,null,2))}', 'readonly>${esc(JSON.stringify(r,null,2))}')
    html=html.replace('<div class="control-note">', '<div class="lock-demo-controls"><button class="scene-control" data-act="lockPreview"><span>06</span><div><strong>iPhone 锁屏</strong><small>常驻安全状态与事件通知</small></div>↗</button><div class="row"><button class="btn secondary tiny" data-act="lockRisk">窗边状态变化</button><button class="btn secondary tiny" data-act="lockRecovered">确认已处理</button></div></div><div class="control-note">')
    html=html.replace('<div class="lock-testbar"><button data-act="lockRisk">窗边风险</button><button data-act="lockRecovered">已处理</button><button data-act="notificationOptions">显示选项</button></div>','')
    html=html.replace('家庭关怀 / 已连接','')
    html=html.replace('锁屏预览','锁屏')
    html=html.replace('运行测试事件','预览效果')
    html=html.replace('预览样例','预览效果')
    html=html.replace('预览</button>', '预览</button>')
    html=html.replace('数据与版本','版本与说明')
    html=html.replace('家庭时区：Asia/Shanghai · ', '家庭时区：Asia/Shanghai')
    html=html.replace('到期任务已读取新观察 · 时间', '到期任务已读取新观察')
    html=re.sub(r'<article class="card"><h3>重新开始体验</h3>.*?</article>', '', html, flags=re.S)
    html=re.sub(r'<article class="card"><h2>能力状态</h2>.*?</article>', '', html, flags=re.S)
    html=html.replace("'<p class=\"lock-helper\">安全状态常驻显示已关闭</p>'", "''")
    html=html.replace('9 月 ${s.clock.startsWith(\'09/28\')?\'28\':\'27\'} 日　星期${s.clock.startsWith(\'09/28\')?\'一\':\'日\'}　▣', '9 月 ${s.clock.startsWith(\'09/28\')?\'28\':\'27\'} 日　星期${s.clock.startsWith(\'09/28\')?\'一\':\'日\'}')
    html=html.replace('<div class="lock-caption">','<div class="lock-caption">')
    html=html.replace('<span class="lock-caption">iPhone 锁屏</span>', '<span class="lock-caption">􀎡</span>')
    html=html.replace('􀎡','●')
    extra='''\n.demo-ribbon,.footerline,.lock-empty,.lock-helper{display:none}.lock-label,.lock-topline .lock-caption{visibility:hidden}.lock-entry{font-size:9px}.phone .topbar{min-height:102px}.store-item[hidden]{display:none}.presentation-controls>.scene-control{padding:11px 12px}.presentation-controls>p{margin-bottom:15px}.lock-demo-controls{margin-top:10px}.control-note{margin-top:14px;padding-top:12px}.large .lock-widget strong{font-size:15px}\n'''
    return html.replace('</style>',extra+'</style>')
