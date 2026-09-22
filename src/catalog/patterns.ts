import type { ArticleDoc } from "./types";

/** 业务模式 Patterns：可复用的跨组件流程约定。 */
export const patternDocs: ArticleDoc[] = [
  {
    id: "agent-confirmation",
    name: "Agent Confirmation",
    chineseName: "Agent 推荐 → 用户确认 → 执行",
    status: "stable",
    summary: "推荐与执行分离：Agent 说明计划，用户确认范围，系统创建可追踪任务。",
    keywords: ["agent", "confirmation", "推荐", "确认", "执行", "智能体"],
    sections: [
      {
        id: "flow",
        heading: "流程",
        body: [
          "Agent 可以分析、推荐和准备参数，但任何产生外部副作用的动作都必须由用户明确确认。确认不是形式：面板必须回显目标、范围、项目、预算和可能的副作用。",
        ],
        list: [
          "Agent 说明计划、输入和预期影响。",
          "用户选择项目 / 预算并确认。",
          "系统创建可追踪任务，回传状态和日志。",
        ],
        preview: "agent-confirmation/flow",
      },
      {
        id: "rules",
        heading: "规则",
        body: ["确认面板之外不允许“顺手执行”；失败后必须回到可重试、可人工接管的状态。"],
        list: [
          "确认前展示完整上下文，不允许折叠关键副作用。",
          "确认动作本身使用 primary 按钮并回显范围。",
          "执行后给出任务 ID 与状态入口，可追踪、可撤销（如果业务允许）。",
        ],
      },
    ],
    related: ["/components/agent-activity", "/components/confirm-panel", "/components/run-status"],
  },
  {
    id: "data-import",
    name: "Data Import",
    chineseName: "数据导入 → 预览 → 校验 → 写入",
    status: "stable",
    summary: "数据先进入临时区，经过预览、字段映射与校验后才允许写入正式数据集；原始文件与每次写入的版本全程保留。",
    keywords: ["import", "upload", "数据导入", "预览", "校验", "写入", "字段映射", "临时区"],
    sections: [
      {
        id: "flow",
        heading: "四步流程",
        body: [
          "导入不是一个动作，而是一条流水线：上传进入临时区、预览并确认字段映射、执行校验、用户确认后写入。任何一步失败都不会污染正式数据集。",
          "流程的每一步都必须展示当前对象（文件名、行数、目标数据集），让用户始终知道自己在处理什么。",
        ],
        list: [
          "上传：文件只进入临时区，不触碰正式数据。",
          "预览：展示样例行，用户确认字段映射与单位。",
          "校验：标出缺失、越界与冲突行，给出处理建议。",
          "写入：用户确认后批量写入，生成新版本并保留原始文件。",
        ],
        preview: "data-import/flow",
      },
      {
        id: "staging",
        heading: "临时区与字段映射",
        body: [
          "临时区是导入的隔离带：解析结果只写入临时区，正式数据集的 schema 差异（新增列、单位变更）必须先映射再写入。",
          "字段映射逐列确认：来源列、目标字段、数据类型与单位缺一不可；无法自动匹配的列必须显式指定目标或标记为忽略。",
        ],
        list: [
          "映射表展示“来源列 → 目标字段”的一一对应关系。",
          "类型不匹配（文本 → 数值）在校验前提示，不静默截断。",
          "被忽略的列明确列出，避免“看不见的丢失”。",
        ],
      },
      {
        id: "validation",
        heading: "缺失与冲突处理",
        body: [
          "校验结果按严重程度分级：阻断项（缺失主键、类型错误）必须处理后重试，警告项（单位存疑、超出常见范围）可以确认后继续。",
          "冲突行逐条列出与现有数据的差异，用户选择跳过、覆盖或合并；默认动作是最保守的跳过。",
        ],
        list: [
          "缺失：标出缺失字段与行号，给出补全或跳过该行的选择。",
          "冲突：展示“临时区值 vs 现有值”的并排对比。",
          "校验报告可回看，写入后仍能从版本中追溯到本次校验结果。",
        ],
      },
      {
        id: "commit",
        heading: "确认写入与版本保留",
        body: [
          "确认写入前回显影响范围：目标数据集、写入行数、覆盖行数与生成的新版本号。写入是事务性的，要么全部成功，要么整体回滚。",
          "原始上传文件作为版本附件永久保留，任何一行正式数据都能回溯到它来自哪个文件的哪一行。",
        ],
        list: [
          "确认按钮回显行数与版本号，文案写明“写入 123 行”。",
          "写入完成后展示新版本号与差异摘要。",
          "原始文件不可删除，只随版本归档。",
        ],
      },
    ],
    related: ["/components/upload", "/components/data-quality-notice", "/components/table", "/patterns/agent-confirmation"],
  },
  {
    id: "citation-source",
    name: "Citation Source",
    chineseName: "正文引用 → 来源定位",
    status: "stable",
    summary: "事实处挂稳定引用编号，来源清单集中管理标题、链接与抓取时间；点击编号即定位来源，正文不重复粘贴长来源。",
    keywords: ["citation", "source", "引用", "角标", "来源", "溯源", "来源清单"],
    sections: [
      {
        id: "stable-id",
        heading: "稳定的引用编号",
        body: [
          "每条可追溯的事实后面紧跟一个引用编号，编号在会话内稳定：同一条来源在不同回答、不同轮次中始终使用同一个编号。",
          "编号不是装饰：它必须能解析到来源清单中的具体条目；重排、增删来源时，编号与来源的绑定关系不变。",
        ],
        list: [
          "编号格式统一为 [1]、[2] 这样的上标，视觉上轻量。",
          "编号由系统分配，业务文案不手写编号。",
          "删除来源时同步移除对应角标，不允许出现悬空引用。",
        ],
        preview: "citation-source/stable-id",
      },
      {
        id: "marker",
        heading: "轻量角标",
        body: [
          "角标是正文里最克制的元素：字号小、使用品牌色、可点击，但不打断阅读节奏。",
          "悬停角标展示来源摘要（标题 + 抓取时间），点击定位到来源清单对应条目并高亮。",
        ],
      },
      {
        id: "source-list",
        heading: "来源清单",
        body: [
          "来源清单集中在回答或报告底部，每条来源必须包含标题、链接和抓取时间三要素，缺一不可。",
          "内部来源（数据集、报告、运行记录）使用稳定 ID 链接；外部来源必须记录抓取时间，因为外部内容可能变化。",
        ],
        list: [
          "标题：来源的真实标题，不用“点击查看”代替。",
          "链接：稳定 ID 或可公开访问的地址。",
          "抓取时间：精确到日的获取时间。",
        ],
      },
    ],
    related: ["/components/citation", "/components/source-card"],
  },
  {
    id: "project-permission",
    name: "Project Permission",
    chineseName: "项目与权限边界",
    status: "stable",
    summary: "角色与资源范围决定可见与可操作：无权限的动作禁用并解释原因，前端可见性永远只是提示，授权由后端二次校验兜底。",
    keywords: ["permission", "role", "权限", "角色", "项目", "授权", "可见性"],
    sections: [
      {
        id: "model",
        heading: "角色与资源范围",
        body: [
          "权限模型围绕两个维度：角色（项目管理员、项目成员、外部访客）与资源范围（项目、数据集、任务、设备）。任何动作在界面前先回答“谁对什么能做什么”。",
          "界面按当前用户的角色与范围渲染：可见的数据才渲染，可见但不可操作的动作禁用并附原因。",
        ],
        preview: "project-permission/model",
      },
      {
        id: "frontend",
        heading: "无权限动作的表达",
        body: [
          "无权限的动作不隐藏、不假装可用：禁用并在邻近位置说明所需权限与获取路径（联系项目管理员、申请加入项目）。",
          "数据级差异（只能看部分列、部分行）用明确的标记表达，而不是让数据悄悄消失。",
        ],
        list: [
          "禁用按钮旁说明原因：“仅项目管理员可删除项目”。",
          "入口可见但数据不可见时，展示申请入口而非空白。",
          "权限不足的错误页提供返回与申请两个出口。",
        ],
      },
      {
        id: "backend",
        heading: "后端二次校验",
        body: [
          "前端的一切权限表达都只是提示。后端必须对每个请求重新鉴权：伪造一个可用按钮、直接调用接口都必须被拒绝。",
          "鉴权失败返回结构化的权限错误（所需角色、资源 ID），前端据此渲染一致的解释，而不是通用的 403 页。",
        ],
      },
    ],
    related: ["/components/permission-scope", "/components/project-selector", "/components/alert"],
  },
  {
    id: "reservation-scheduling",
    name: "Reservation Scheduling",
    chineseName: "预约与排程",
    status: "beta",
    summary: "先选设备再选时段，冲突即时提示并给出替代方案；确认后完整回显预约结果，日历视图按统一语义着色。",
    keywords: ["reservation", "schedule", "预约", "排程", "设备", "时段", "日历"],
    sections: [
      {
        id: "flow",
        heading: "预约流程",
        body: [
          "预约按固定顺序推进：选择设备 → 选择日期与时段 → 处理冲突 → 确认并回显。顺序不可逆，没有选择设备不允许直接选时段。",
          "每一步都展示已选内容，确认前用户能看到完整的预约草稿：设备、时段、关联项目与用途说明。",
        ],
        list: [
          "设备：展示设备状态（可用 / 维护中），维护中的设备不可预约。",
          "时段：以统一粒度（如 1 小时）展示占用与空闲。",
          "确认：回显设备、时段与项目，生成预约编号。",
        ],
        preview: "reservation-scheduling/flow",
      },
      {
        id: "conflict",
        heading: "冲突提示",
        body: [
          "冲突在选择时刻提示，而不是等到提交才报错：被占用时段置灰并标注占用方（任务号或预约人），并提供相邻空闲时段作为替代。",
          "允许排队的设备明确说明排队规则与预计等待时间，不允许静默排队。",
        ],
      },
      {
        id: "echo",
        heading: "回显确认",
        body: [
          "预约成功后的回显是一份确认凭证：预约编号、设备、时段、关联项目与取消入口同时给出。",
          "回显同时写入审计：谁、在什么时间、预约了哪台设备的哪个时段。",
        ],
      },
      {
        id: "calendar",
        heading: "日历语义",
        body: [
          "日历视图的颜色只表达语义：品牌色为当前用户的预约，中性色为他人占用，警告色为维护窗口；禁止用颜色区分设备型号等属性。",
          "跨天与跨周视图不改变时段粒度；“今天”用边框而非底色标记，避免与语义色混淆。",
        ],
      },
    ],
    related: ["/components/date-picker", "/components/date-range-picker", "/components/alert", "/patterns/project-permission"],
  },
  {
    id: "run-status-logs",
    name: "Run Status & Logs",
    chineseName: "运行状态与日志",
    status: "stable",
    summary: "所有任务共享同一状态机：排队 → 运行 → 成功 / 失败 / 部分完成；日志实时跟随当前状态，失败任务一键回到可重试。",
    keywords: ["run", "status", "logs", "状态机", "日志", "重试", "任务状态"],
    sections: [
      {
        id: "state-machine",
        heading: "状态机",
        body: [
          "状态机是全平台唯一的状态来源：任何页面、任何组件展示同一个任务时，状态文案与语义色完全一致。",
          "终态有三种：成功、失败、部分完成。部分完成必须说明完成比例与未完成原因，不允许与成功混用。",
        ],
        list: [
          "排队：已受理、等待资源，展示队列位置或预计等待时间。",
          "运行：展示进度与已用时长，可查看实时日志。",
          "成功 / 失败 / 部分完成：终态，给出结果入口或重试入口。",
        ],
        preview: "run-status-logs/state-machine",
      },
      {
        id: "logs",
        heading: "日志跟随",
        body: [
          "日志跟随任务状态实时追加，默认定位到最新一行；用户上翻阅读时暂停自动跟随，并给出“回到最新”入口。",
          "日志带时间戳与级别（info / warning / error），错误级别的行在视觉上可以一眼定位。",
        ],
      },
      {
        id: "retry",
        heading: "失败与重试",
        body: [
          "失败状态必须同时回答三件事：为什么失败、数据是否安全、下一步做什么。",
          "重试保留原参数并生成新的运行实例，原失败记录保留在审计中，不允许覆盖。",
        ],
        list: [
          "失败原因用结构化信息表达（错误码 + 可读描述）。",
          "重试入口与失败信息出现在同一屏。",
          "部分完成支持“仅重试未完成部分”。",
        ],
      },
    ],
    related: ["/components/run-status", "/components/tool-run-card", "/components/progress"],
  },
  {
    id: "audit-versioning",
    name: "Audit & Versioning",
    chineseName: "审计与版本",
    status: "beta",
    summary: "每一次变更都回答谁、何时、改了什么；版本之间可对比，任何状态可回溯，审计记录只增不改。",
    keywords: ["audit", "version", "审计", "版本", "对比", "回溯", "时间线"],
    sections: [
      {
        id: "who-what",
        heading: "谁、何时、改了什么",
        body: [
          "审计时间线按时间倒序列出全部变更：操作人（或系统）、时间、动作与变更摘要。摘要是结构化的字段级描述，不是一句“更新了数据”。",
          "时间精确到分钟；操作人使用稳定账号 ID 对应的显示名，系统动作统一标注为“系统自动”。",
        ],
        preview: "audit-versioning/who-what",
      },
      {
        id: "compare",
        heading: "版本对比",
        body: [
          "任意两个版本可并排对比：新增、删除与修改分别用成功、阻断与警告语义色标记，数值变化给出前后值。",
          "对比视图默认只展示有差异的字段，完整快照可按需展开。",
        ],
      },
      {
        id: "trace",
        heading: "可回溯",
        body: [
          "回溯不是撤销：查看历史版本不改动当前状态；恢复操作是创建一个新版本，原版本依然可查。",
          "审计记录只增不改，任何“删除”都是新增一条作废记录，保证链条完整。",
        ],
      },
    ],
    related: ["/components/audit-timeline", "/components/timeline", "/patterns/run-status-logs"],
  },
];
