https://juejin.cn/post/7251785872898850873
https://juejin.cn/post/7021072232461893639

#### 一. action 配置项主要用于点击图标弹出框，对于弹出框接受的是 html 文件

#### 二. 三个 permission

- host_permissions - 允许使用扩展的域名
- permissions - 包含已知字符串列表中的项目 【只需一次弹框要求允许】
- optional_permissions - 与常规类似 permissions，但由扩展的用户在运行时授予，而不是提前授予【安全】

1. 列出常见选项:

   - activeTab: 当扩展卡选项被改变需要重新获取新的权限
   - tabs: 操作选项卡 api（改变位置等）
   - downloads: 访问 chrome.downloads API 的权限 便于下载但还是会受到跨域影响
   - history: history api 权限
   - storage: 访问 localstorage/sessionStorage 权限

#### 三. background

- 不使用时终止，需要时重新启动（类似于事件页面）
- 无权访问 DOM。（service worker 独立于页面）

#### content script 与 service worker/popup 的通信

- 使用 chrome.runtime.sendMessage 发送信息
- 使用 官网的~~chrome.runtime.onMessage.addListener ~~ 方法会出现问题，使用 chrome.tabs.sendMessage 接收监听信息
