# 开发说明

在家 InHome 当前以独立 HTML 展示面向 iPhone 的产品体验。`index.html` 是面向用户的介绍页，`demo/` 包含可交互界面和介绍 Slides。

## 本地打开

直接用浏览器打开 `index.html`。也可以在仓库根目录运行：

```sh
python -m http.server 8768 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8768`。浏览已生成页面无需安装前端依赖。

## 目录

| 路径 | 内容 |
| --- | --- |
| `index.html` | 面向用户的产品介绍 |
| `demo/` | 独立 HTML 交互体验与 Slides |
| `src/app/` | 界面、监控、扩展、通知等源文件 |
| `src/assets/` | 内嵌场景素材 |
| `scripts/` | HTML 构建脚本 |
| `tests/` | 日常通知规则检查 |
| `docs/images/` | 实际界面截图 |

## 构建

构建交互页面仅需 Python 3；构建 Slides 还需要 Pillow。

```sh
python scripts/build_app.py
python -m pip install -r scripts/requirements.txt
python scripts/build_slides.py
node tests/test-chatter.cjs
```

修改 `src/app/` 后重新构建。生成文件保留在版本库，下载后即可打开。Slides 使用 `docs/images/slides/` 中的截图，需要在界面变化后更新相应截图。

## 当前实现范围

- 页面状态、设置、事件和扩展作品保存在当前浏览器的 localStorage。清除站点数据会重置这些内容。
- 相机画面由内嵌 SVG 场景构成，包含时间点与关键帧变化；当前未连接真实摄像头和视频流。
- 日常观察及通知规则在浏览器内运行。iPhone 锁屏、常驻状态、语音播放和联络展示对应产品交互；系统通知、实时活动、设备控制与通信服务仍需原生端和服务端接入。
- 扩展创建、审核和发布体现完整操作流程。当前作品留在浏览器内；真实 Agent 生成、代码隔离执行、远端仓库上传与审核服务仍需接入。
- 生活消息依据近期记录选择措辞，具有随机触发、间隔、每日上限和风险优先规则。紧急事件期间暂停，风险恢复后保留冷静时间。点击消息可查看来源关键帧。
- 页面中的数据保留期、权限和家庭控制体现产品设计；真实数据生命周期和隐私保障需要结合设备及服务端实现验证。

浏览器验证覆盖界面操作与响应式布局。原生 iOS、Safari 真机、摄像头连接、系统推送和硬件联动尚待验证。
