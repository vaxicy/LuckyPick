# LuckyPick Chrome 扩展 - 完整开发文档

## 📋 目录
1. [产品架构](#产品架构)
2. [文件结构](#文件结构)
3. [Manifest V3 配置](#manifest-v3-配置)
4. [数据结构](#数据结构)
5. [中英文 i18n 方案](#中英文-i18n-方案)
6. [Popup 页面设计](#popup-页面设计)
7. [投硬币功能设计](#投硬币功能设计)
8. [动画实现方案](#动画实现方案)
9. [历史记录方案](#历史记录方案)
10. [设置页设计](#设置页设计)
11. [完整开发步骤](#完整开发步骤)
12. [可直接运行的基础代码](#可直接运行的基础代码)

---

## 产品架构

### 核心模块
```
LuckyPick Extension
├── 用户界面层
│   ├── Popup 弹出窗口（主界面）
│   └── Options 设置页面
├── 业务逻辑层
│   ├── 决定引擎（随机选择算法）
│   ├── 动画控制器（多种动画效果）
│   ├── 数据管理器（Chrome Storage）
│   └── 国际化处理器（i18n）
├── 数据持久化层
│   ├── 用户设置
│   ├── 历史记录
│   ├── 保存的选择组
│   └── 每日幸运数据
└── 后台服务层
    └── Background Script（事件监听）
```

### 技术选型
- **Manifest Version**: V3（最新标准）
- **前端框架**: Vanilla JavaScript（无依赖）
- **样式方案**: CSS3 + CSS Variables（主题切换）
- **数据存储**: Chrome Storage API (Local)
- **国际化**: Chrome i18n API
- **构建工具**: 无（纯静态文件）

---

## 文件结构

```
LuckyPick/
├── manifest.json              # 扩展配置（必需）
├── popup.html                # 弹出窗口HTML
├── popup.js                  # 弹出窗口逻辑
├── popup.css                 # 弹出窗口样式
├── options.html              # 设置页面HTML
├── options.js                # 设置页面逻辑
├── options.css               # 设置页面样式
├── background.js             # 后台脚本
├── icon-generator.html       # 图标生成工具（开发辅助）
├── _locales/                # 国际化文件
│   ├── zh_CN/
│   │   └── messages.json    # 中文翻译
│   └── en/
│       └── messages.json    # 英文翻译
├── icons/                   # 图标文件夹
│   ├── icon16.png           # 16x16 图标
│   ├── icon48.png           # 48x48 图标
│   └── icon128.png          # 128x128 图标
├── README.md                # 用户说明文档
└── DOCUMENTATION.md         # 开发者文档（本文件）
```

---

## Manifest V3 配置

```json
{
  "manifest_version": 3,
  "name": "LuckyPick - 幸运选择器",
  "version": "1.0.0",
  "description": "Can't decide? Let luck choose for you.",
  "default_locale": "zh_CN",
  
  "permissions": [
    "storage"
  ],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "options_ui": {
    "page": "options.html",
    "open_in_tab": false
  },
  
  "background": {
    "service_worker": "background.js"
  },
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### 关键配置说明
1. **manifest_version**: 必须使用 V3
2. **permissions**: 仅需 `storage` 权限
3. **action**: 定义弹出窗口和图标
4. **options_ui**: 设置页面配置
5. **background**: 使用 service_worker（V3 要求）
6. **default_locale**: 支持国际化

---

## 数据结构

### 1. 用户设置 (settings)
```javascript
{
  language: 'zh_CN' | 'en',
  theme: 'light' | 'dark',
  defaultMode: 'random' | 'coin' | 'dice' | 'wheel',
  animationEnabled: boolean,
  historyLimit: number (10-100)
}
```

### 2. 历史记录 (history)
```javascript
[
  {
    id: number,              // 时间戳作为ID
    options: string[],       // 选项列表
    result: string,          // 最终结果
    mode: string,            // 使用的模式
    createdAt: number        // 创建时间戳
  },
  // ... 最多保存100条
]
```

### 3. 保存的选择组 (savedSets)
```javascript
[
  {
    id: number,              // 唯一标识
    title: string,           // 选择组名称
    options: string[],       // 选项列表
    createdAt: number,       // 创建时间
    lastUsedAt: number | null  // 最后使用时间
  }
]
```

### 4. 每日幸运 (dailyLuck)
```javascript
{
  number: number,           // 幸运数字 1-100
  color: string,            // 幸运颜色
  tip: string               // 幸运建议
}
```

### 存储位置
- **Chrome Storage Local**: `chrome.storage.local`
- **访问方式**: `chrome.storage.local.get/set`
- **数据隔离**: 每个扩展独立存储

---

## 中英文 i18n 方案

### 1. 文件结构
```
_locales/
├── zh_CN/
│   └── messages.json
└── en/
    └── messages.json
```

### 2. 翻译文件格式
```json
{
  "extension_name": {
    "message": "LuckyPick - 幸运选择器",
    "description": "Extension name"
  },
  "decide_for_me": {
    "message": "✨ 帮我决定",
    "description": "Main button"
  }
}
```

### 3. 代码中使用
```javascript
// 获取翻译
const message = chrome.i18n.getMessage('decide_for_me');

// HTML 中使用
// <span data-i18n="decide_for_me"></span>
```

### 4. 动态切换语言
```javascript
// 保存语言设置
chrome.storage.local.set({
  settings: { ...settings, language: 'en' }
});

// 提示用户重启扩展
alert('请重启扩展以应用语言设置');
```

---

## Popup 页面设计

### 布局结构
```
┌─────────────────────────┐
│  Header (Logo + Nav)    │
├─────────────────────────┤
│                         │
│  Input Section          │
│  - Mode Selector        │
│  - Option Inputs        │
│  - Add/Remove Buttons   │
│  - Decide Button        │
│                         │
├─────────────────────────┤
│                         │
│  Animation Section      │
│  (Hidden by default)    │
│                         │
├─────────────────────────┤
│                         │
│  Result Section         │
│  (Hidden by default)    │
│                         │
├─────────────────────────┤
│                         │
│  Daily Luck Section     │
│                         │
├─────────────────────────┤
│  Footer                 │
└─────────────────────────┘
```

### 关键设计元素
1. **Mode Selector**: 顶部模式切换按钮
2. **Option List**: 动态添加/删除选项
3. **Animation Container**: 动画展示区域
4. **Result Display**: 结果展示（大字体+emoji）
5. **Action Buttons**: 再来一次、复制、保存

### 样式特点
- **圆角**: 8px - 20px
- **阴影**: 柔和的多层阴影
- **动画**: CSS transitions + keyframes
- **响应式**: 固定宽度 400px

---

## 投硬币功能设计

### 功能流程
```
用户点击"投硬币" → 输入正面/反面 → 点击决定 
→ 播放硬币翻转动画（2秒）→ 显示结果 → 展示趣味文案
```

### 动画实现
```javascript
// CSS 3D 翻转
@keyframes flipCoin {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(1800deg); }  // 5圈 + 正面
}

// 随机决定正反面
const isHeads = Math.random() > 0.5;
const finalRotation = isHeads ? 1800 : 1980;  // 1980 = 5.5圈 + 反面
```

### 硬币样式
- **正面**: 金色渐变 (#FFD700 → #FFA500)
- **反面**: 银色渐变 (#C0C0C0 → #808080)
- **3D效果**: `transform-style: preserve-3d`
- **背面隐藏**: `backface-visibility: hidden`

---

## 动画实现方案

### 1. 投硬币动画 (Coin Flip)
**技术**: CSS 3D Transform
**时长**: 2秒
**效果**: 真实物理翻转

### 2. 骰子动画 (Dice Roll)
**技术**: CSS Animation + Scale
**时长**: 2秒
**效果**: 旋转 + 缩放

### 3. 转盘动画 (Wheel Spin)
**技术**: CSS Transform Rotate
**时长**: 2秒
**效果**: 减速旋转 + 指针定位

### 4. 随机动画 (Random)
**实现**: 随机选择一个动画
```javascript
const animations = ['coin', 'dice', 'wheel'];
const randomAnim = animations[Math.floor(Math.random() * animations.length)];
```

### 动画基类
```javascript
async function playAnimation(mode, options, result) {
  const container = document.getElementById('animation-container');
  
  // 显示动画区域
  showSection('animation-section');
  
  // 根据模式播放动画
  switch (mode) {
    case 'coin':
      await playCoinFlip(container, result);
      break;
    case 'dice':
      await playDiceRoll(container, result);
      break;
    // ...
  }
}
```

---

## 历史记录方案

### 数据结构
```javascript
const historyItem = {
  id: Date.now(),
  options: ['选项1', '选项2', '选项3'],
  result: '选项2',
  mode: 'random',
  createdAt: 1625123456789
};
```

### 存储逻辑
```javascript
// 保存
async function saveToHistory(decision) {
  const data = await chrome.storage.local.get(['history']);
  const history = data.history || [];
  
  history.unshift(historyItem);  // 新记录在前
  
  // 限制数量
  if (history.length > 100) {
    history.splice(100);
  }
  
  await chrome.storage.local.set({ history });
}
```

### 展示逻辑
- **倒序显示**: 最新记录在前
- **分页加载**: 一次显示20条（可扩展）
- **删除功能**: 单条删除 + 清空全部

---

## 设置页设计

### 设置项
1. **语言选择**: 中文 / English
2. **主题切换**: 浅色 / 深色
3. **默认模式**: 下拉选择
4. **动画开关**: 复选框
5. **历史限制**: 滑块 (10-100)
6. **数据管理**: 清空历史 / 清空所有

### 布局
```
┌─────────────────────────┐
│  Header (标题)          │
├─────────────────────────┤
│                         │
│  Setting Group 1        │
│  - Language             │
│                         │
│  Setting Group 2        │
│  - Theme                │
│                         │
│  ...                    │
│                         │
│  About Section          │
│                         │
└─────────────────────────┘
```

### 保存逻辑
```javascript
// 即时保存（每次更改）
async function saveSetting(key, value) {
  const result = await chrome.storage.local.get('settings');
  const settings = result.settings || {};
  settings[key] = value;
  await chrome.storage.local.set({ settings });
}
```

---

## 完整开发步骤

### 第一步：项目初始化
1. 创建项目文件夹 `LuckyPick`
2. 创建 `manifest.json`
3. 配置基本权限和入口文件

### 第二步：Popup 界面开发
1. 创建 `popup.html` - 结构
2. 创建 `popup.css` - 样式
3. 创建 `popup.js` - 逻辑

### 第三步：功能实现
1. 选项输入功能
2. 随机选择算法
3. 动画效果实现
4. 结果展示页面

### 第四步：数据持久化
1. 使用 Chrome Storage API
2. 实现历史记录
3. 实现选择组保存

### 第五步：设置页面
1. 创建 `options.html`
2. 创建 `options.js`
3. 创建设置样式

### 第六步：国际化
1. 创建 `_locales/zh_CN/messages.json`
2. 创建 `_locales/en/messages.json`
3. 在代码中使用 `chrome.i18n.getMessage()`

### 第七步：后台脚本
1. 创建 `background.js`
2. 监听安装事件
3. 初始化默认设置

### 第八步：图标和打包
1. 使用 `icon-generator.html` 生成图标
2. 测试扩展功能
3. 打包发布

---

## 可直接运行的基础代码

### 安装步骤
1. **克隆代码**: 下载本项目到本地
2. **生成图标**: 
   - 在浏览器打开 `icon-generator.html`
   - 点击"下载所有图标"
   - 将图标放入 `icons/` 文件夹
3. **加载扩展**:
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

### 测试清单
- [ ] 输入2个以上选项
- [ ] 点击"帮我决定"按钮
- [ ] 观看动画效果
- [ ] 查看结果页面
- [ ] 保存选择组
- [ ] 查看历史记录
- [ ] 打开设置页面
- [ ] 切换深色模式
- [ ] 查看每日幸运

### 常见问题
1. **图标不显示**: 确保 `icons/` 文件夹中有PNG文件
2. **动画不播放**: 检查浏览器是否支持 CSS3 Animation
3. **数据不保存**: 检查 `storage` 权限是否正确配置

---

## 总结

LuckyPick 是一款功能完整、设计现代的 Chrome 扩展，具备：
- ✅ 完整的核心功能
- ✅ 流畅的动画效果
- ✅ 完善的数据管理
- ✅ 中英文双语支持
- ✅ 深色模式
- ✅ 符合 Manifest V3 规范

**下一步计划**:
1. 测试并修复bug
2. 添加更多动画效果
3. 优化用户体验
4. 发布到 Chrome Web Store

---

**开发完成时间**: 2026-07-03
**开发者**: LuckyPick Team
**许可证**: MIT
