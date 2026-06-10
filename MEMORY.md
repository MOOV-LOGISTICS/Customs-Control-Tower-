# smartMOOV Customs Project — Memory File

> 上下文压缩后，优先读取此文件恢复项目记忆。
> 最后更新：2026-06-10

---

## 一、项目基础信息

| 项目 | 内容 |
|------|------|
| **项目名称** | smartMOOV Customs Control Tower — Phase 1 Prototype |
| **本地项目路径** | `C:\Users\z.dorothy\Projects\Customs-Control-Tower` |
| **GitHub Repo** | https://github.com/MOOV-LOGISTICS/Customs-Control-Tower- |
| **GitHub Pages** | https://moov-logistics.github.io/Customs-Control-Tower-/ |
| **原始代码库（只读参考）** | `C:\Users\z.dorothy\Downloads\controltowerspring-moov-ct-pre-*\...\yudao-ui-admin` |
| **项目文件夹（需求/流程图）** | `C:\Customs Project\` |
| **Dev Server 启动** | 运行 `C:\Customs Project\start-mock.cmd`，端口 3000 |
| **Preview Server ID** | 每次启动会变，用 `preview_start` 获取新的 |

### Git 工作流规则 ⚠️
- **代码修改：必须先创建分支，等用户确认后才 push/merge**
- **文档/memory 更新：可以直接 push 到 main**
- 每次 commit 带 `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

---

## 二、技术栈

| 项目 | 内容 |
|------|------|
| **框架** | Vite 4 + Vue 2.7 + Vue Router 3 |
| **UI 组件库** | Element UI 2.15.12，size 统一用 `mini` |
| **样式** | SCSS，变量文件：`src/styles/variables.scss` |
| **包管理** | pnpm（`C:\Users\z.dorothy\AppData\Local\pnpm\bin\pnpm.CMD`） |
| **构建** | `npm run build` → `dist/`，GitHub Actions 自动部署 |
| **路由模式** | Hash 模式（GitHub Pages 兼容） |
| **Base URL** | `/Customs-Control-Tower-/` |

### 设计规范（来自现有 smartMOOV 系统）
```scss
$primary:        #004F7C;   // 主色，导航栏背景
$primary-light:  #3A71A8;
$bg-page:        #EBF0F4;   // 页面背景
$text-primary:   #333;
$border:         #dfe4ed;
$status-verified:   #13ce66;
$status-unverified: #ffba00;
$status-rejected:   #ff4949;
$sidebar-width:  220px;
$topbar-height:  56px;
```
- 字体：DM Sans（Google Fonts）
- Dialog header：`#004F7C` 深蓝背景，白色文字
- Card：`border-radius: 8px`，无边框
- Table header：`#fafafa` 背景，字号 `11.5px`

---

## 三、参考文件索引（按需读取）

| 文件 | 用途 |
|------|------|
| `C:\Customs Project\CustomsDiagram v5.png` | 完整清关流程图（绿色=Phase1，白色=已有，红色=Phase2，紫色=系统外） |
| `C:\Customs Project\Customs Project DevReq phase 1.docx` | Phase 1 详细需求文档（S102、S119 等 ticket） |
| `C:\Customs Project\会议背景.docx` | 项目会议记录，包含 HS Code 管理、Customs Valuation 等背景 |
| `C:\Customs Project\现有流程.docx` | 现有系统操作流程描述 |
| `C:\Customs Project\文档上传现有流程.docx` | 供应商文档上传现有步骤详细描述 |
| `C:\Customs Project\海关项目一期核心需求与架构.png` | 需求架构脑图 |

---

## 四、业务背景与项目目标

Pepco（欧洲零售商）进口商品时需要完成海关清关。**目前文档管理散落在 SharePoint、邮件等渠道，流程不透明、易出错。**

本项目核心目标：**将整个文档上传、验证、审核、通知流程统一搬入 smartMOOV 系统。**

Phase 1 核心逻辑：
```
供应商上传 → AI 验证 → Pepco 三重审核 → Broker 下载清关
```

---

## 五、Phase 1 需要开发的功能（已确认）

### 1. 供应商上传运输文件（S102）
- CI 和 PL 是**必须上传**的两个文件，其他文件可选
- 支持文档类型细分存储（不能用 "shipper docs" 统一归类）
- 支持**版本控制**：同一文件多次上传时标记版本
- **AI 自动验证**（通过 OCR + 关键词匹配）：
  - 校验文件是否属于 Invoice / Packing List（防止乱传文件）
  - 校验 PO Number 和 Product Number 是否匹配当前 PO
  - 匹配成功 → 标记为 Verified
  - 不匹配 → 提示用户，允许强制保存但标记为 Unverified（待 OHA 复核）
  - 识别为已有文档新版本 → 提示另存为修订版
- AI 校验设计原则：**上传与校验解耦**，异步后台处理，用分步进度减少用户等待感

### 2. Pepco 三阶段顺序文档审核（HBL 维度）
- **Milestone 1：PGS（Pepco Global Sourcing）** — 第一步，需新增
- **Milestone 2：Pepco Finance** — PGS 完成后才解锁，需新增
- **Milestone 3：Pepco Customs + 卫生证** — Finance 完成后才解锁，**现有系统已有**
- 拒绝与重置机制：
  - 任一 Milestone 不通过 → 填写原因 → 自动邮件通知供应商
  - OHA 在**文档管理页面**修正完成 → 三个 Milestone 全部重置
  - 重置后显示 "Re-check" 标识，保留历史拒绝原因和 OHA 备注

### 3. 通知 Customs Broker + 批量下载（S119）
- 三个 Milestone 全部通过 + Broker 已指派 → 系统自动发邮件通知 Broker
- Broker 可一键批量下载该 HBL 下所有文件
- 角色权限控制：只能看到/下载自己被指派的 HBL 文件

### 4. 新增独立文档管理模块
- 支持批量下载、预览、AI 检测
- 作为单独的 Tab/页面

### 5. 配套报告与通知（Phase 1 暂缓，先不做）
- S38 已验证文件绩效报告
- S42 T1 Report（UAT 中）
- S44/S45 未收到文件预警报告
- S54 自动提醒（供应商 + Broker）

---

## 六、Phase 2 功能（暂不做）

- OHA 上传 Local Charges Invoice（仅孟加拉国）
- Delivery Order 上传（仅罗马尼亚）
- OHA 人工核查 Unverified 文件
- Customs Broker 视图改进（S39）
- 各类监控报告（S40/S41/S43/S46/S50）

---

## 七、明确不做的功能

- **S57（取消）**：从 smartMOOV 数据自动生成商业发票/装箱单 — 存在法律风险，未来电子清关架构下不需要

---

## 八、系统外部分（紫色，不设计）

- Customs Broker 在其自身系统内的清关申报操作
- 与外部海关机构的直接交互
- RAFT 平台的 AI 数据提取（Phase 2+ 才整合）

---

## 九、角色与权限架构

### 六个角色及职责

| 角色 | 英文 | 职责 |
|------|------|------|
| 供应商 | Supplier | 上传 CI、PL 等运输文件 |
| 产地代理 | OHA | 协助验证文件、协调供应商修正 |
| Pepco Global Sourcing | PGS | Milestone 1 文件审核 |
| Pepco Finance | Finance | Milestone 2 文件审核 |
| Pepco Customs | Customs | Milestone 3 文件+卫生证审核 |
| 报关行 | Customs Broker | 下载全套文件、执行清关（外部系统） |

> MOOV Ops 全局视图：Phase 1 暂不做独立视图，运营人员用运营账号同时访问启运港和目的港两侧。Phase 2 再做统一 Dashboard。

### 权限架构决策
- **不做多租户**，数据共享、视图隔离
- 基于 RBAC（YuDao 框架已有）+ 行级数据过滤（Row-Level Security）
- Supplier 之间、Broker 之间互相隔离（通过 dataScope 实现）
- Pepco 三个 sub-role 只能操作自己对应的 Milestone，不能越权

### 现有系统角色现状
- 启运港：Supplier 和 OHA 通过账号区分，**无实际数据隔离**
- 目的港：统一的 Destination Management Tab
- 两侧通过 HBL No 关联，但无统一聚合层（这是 MOOV Ops 视图的技术难点）

---

## 十、已实现 Demo 页面状态

所有页面在 `src/views/customs/` 下：

| 页面 | 路由 | 当前状态 |
|------|------|---------|
| **Dashboard** | `/customs/dashboard` | ✅ 完成：KPI 卡片、HBL 列表、状态色标、搜索过滤 |
| **Document Upload** | `/customs/document-upload` | ✅ 完成：双强制槽位（CI+PL）、异步 AI 校验三种结果、Milestone 门控、其他文件可选上传 |
| **Pepco Review** | `/customs/pepco-review` | ✅ 完成（已 merge main，PR #2）：三阶段 Milestone、顺序锁定、拒绝→Pending Correction→OHA确认→全部重置回PGS、Re-check 标识（含历史记录条目）、Role 驱动视图、All Tasks 默认全局模式 |
| **Broker Downloads** | `/customs/broker-download` | ✅ 完成：文件列表、全选/批量下载、通知时间展示 |
| **Document Management** | 待建 | ❌ 未做：独立文档管理模块（Phase 1 新增需求） |

### Layout
- 顶部横向导航栏（深蓝 #004F7C）
- MOOV Logo 在左侧
- 右侧有 Role 切换器（Demo 用途）和 Demo Mode 标签
- Element UI 已配置英文语言包（main.js 引入 `element-ui/lib/locale/lang/en`）

### Role 驱动视图（`src/store/role.js`，2026-06-10 实现）
- 全局 role store（Vue.observable），Role 切换器真实驱动所有页面
- `ROLE_MILESTONE` 映射：Pepco PGS→PGS / Pepco Finance→FINANCE / Pepco Customs→CUSTOMS
- 审核角色：进 Pepco Review 默认锁定自己的任务队列，非自己 milestone 的行复选框禁用
- Supplier / Customs Broker：全只读（Read-only 标签）
- MOOV Ops：All Tasks 全权限视图
- Dashboard：Pending Correction 列 + 当前 role 行高亮 "My Task" 标签
- 计数器流转规则：reject 时该 milestone 计数不进 finished（finished 只统计通过）；PO 进 Pending Correction 池；OHA 确认后回 PGS possible（+Re-check）。不引入 processed 指标

---

## 十一、关键设计决策记录

### Document Upload — 异步 AI 校验设计
- **问题**：OCR + 匹配需要 10-30 秒，不能让用户等待
- **决策**：上传与校验解耦，文件立即上传，校验异步后台进行，分4步显示进度
- **三种结果**：Verified（绿）/ 文档类型错误（红）/ PO 不匹配（黄）
- **PO 不匹配时**提供两个选择：重传 或 强制保存标记待 OHA 审核

### Pepco Review — Milestone 重置逻辑
- 任一 Milestone 被拒绝 → OHA 修正确认后 → **三个全部重置**（不只重置被拒的那个）
- 重置后标记 "Re-check"，历史拒绝原因和 OHA 备注保留可见
- 目的：让 Pepco 知道哪里改过，避免重复审查已通过的内容

### 现有系统改造策略
- **在现有模块上叠加，不重建**
- 现有 Milestone 3（Pepco Customs）保留，新增 Milestone 1（PGS）和 Milestone 2（Finance）
- 复用现有 `infra_file` 文件存储、milestone 框架、邮件模板体系
- 不动现有 HBL/Shipment 核心数据结构

---

## 十二、原始系统代码关键信息

> 需要参考原始系统代码时，读取以下路径：

- **前端（Vue）**：`...\yudao-ui-admin\src\views\`
  - `pepcoShipping\milestone\` — 现有 milestone 相关页面
  - `asnDocument\` — 现有文档上传页面
  - `shipment\hbl\` — HBL 相关页面
- **后端（Java）**：`...\yudao-module-shipment\` / `yudao-module-shipping\`
  - `HblDO` — HBL 数据对象（`shipment_hbl` 表）
  - `AirOrderMilestoneDO` — Milestone 框架参考
  - `FileDO` — 中央文件存储（`infra_file` 表）
- **设计规范**：`...\yudao-ui-admin\src\ui-refactor\assets\styles\variables.scss`
