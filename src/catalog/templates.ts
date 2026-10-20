import type { ArticleDoc } from "./types";

/** 页面模板 Templates：完整页面的组合方式。 */
export const templateDocs: ArticleDoc[] = [
  {
    id: "list-page",
    name: "List Page",
    chineseName: "列表页",
    status: "stable",
    summary: "筛选栏 + 数据表格 + 分页 + 状态反馈的标准组合，覆盖平台 80% 的列表场景。",
    keywords: ["list", "table", "列表页", "表格页", "模板"],
    sections: [
      {
        id: "structure",
        heading: "结构",
        body: [
          "列表页自上而下是：页面标题与主操作、筛选区、数据表格、分页。空数据、加载、无权限都必须有确定的样子，不允许临时拼。",
        ],
        list: [
          "PageHeader：标题、说明、页面级主动作（最多一个 primary）。",
          "筛选区（FilterBar 组合）：SearchField 搜索 + Select 常用筛选外露，其余收起；条件变化即时反映到表格并回到第 1 页，有筛选时提供“清除筛选”。",
          "Table：首列语义稳定（任务 ID 等宽），数字右对齐，状态用带圆点的 Badge。",
          "Pagination：左侧写明总量与当前页，右侧页码；翻页保留筛选条件。",
        ],
        preview: "list-page/structure",
      },
      {
        id: "states",
        heading: "整页状态",
        body: ["列表页的五种状态缺一不可，且都要保留页面骨架，不做整页闪烁替换。"],
        list: [
          "loading：表格区域 Skeleton，筛选栏保持可用。",
          "empty：用 Empty 说明是没有数据还是被筛选清空，并给出下一步动作（新建 / 清除筛选）。",
          "error：错误原因 + 重试按钮，保留已输入的筛选条件。",
          "permission-limited：说明所需权限与联系人入口。",
        ],
      },
    ],
    related: ["/components/page-header", "/components/filter-bar", "/components/search-field", "/components/table", "/components/pagination", "/components/empty"],
  },
  {
    id: "detail-page",
    name: "Detail Page",
    chineseName: "详情页",
    status: "stable",
    summary: "标题与状态、Descriptions 属性区、关联数据区、操作区的标准组合，适用于项目、任务、数据集等一切实体。",
    keywords: ["detail", "descriptions", "详情页", "属性", "关联数据", "操作区", "模板"],
    sections: [
      {
        id: "structure",
        heading: "页面结构",
        body: [
          "详情页自上而下：PageHeader（返回入口、标题、稳定 ID、状态徽标、页面级操作）、Descriptions（核心属性）、Tabs 承载的关联数据（任务、活动记录、文件、引用）。",
          "首屏必须回答三个问题：这是什么、现在什么状态、我能对它做什么。",
        ],
        list: [
          "PageHeader：标题旁紧跟稳定 ID 与状态 Badge，不打断阅读。",
          "Descriptions：bordered 两列布局，标签左、值右，窄屏自动单列；空值显示占位“—”而不是留白，ID 类字段可复制。",
          "关联数据：用 Tabs 分区，任务用 Table + RunStatus，变更历史用 Timeline；数量大时只展示摘要并提供入口。",
        ],
        preview: "detail-page/structure",
      },
      {
        id: "actions",
        heading: "操作区",
        body: [
          "操作区分层：页面级主动作最多一个 primary（启动计算、提交审核），次级动作用 secondary，危险动作（删除、归档）用 danger 并经 AlertDialog 二次确认。",
          "操作随实体状态变化：运行中的任务展示“取消”而不是“重试”，已归档的项目整体只读。",
        ],
      },
      {
        id: "states",
        heading: "整页状态",
        body: [
          "详情页的状态切换保留页面骨架：加载用 Skeleton，错误保留已加载区域并给出重试，无权限展示所需权限与申请入口。",
          "实体被删除或已归档时展示 Result 状态页，并提供返回列表的出口。",
        ],
      },
    ],
    related: ["/components/page-header", "/components/descriptions", "/components/tabs", "/components/timeline", "/components/run-status", "/patterns/run-status-logs"],
  },
  {
    id: "form-wizard",
    name: "Form Wizard",
    chineseName: "表单向导",
    status: "stable",
    summary: "Steps 把复杂表单拆成有序步骤：每步独立校验、可随时回退，最后一步完整回显所有输入，确认后才真正提交。",
    keywords: ["wizard", "steps", "form", "表单向导", "分步", "校验", "回显", "模板"],
    sections: [
      {
        id: "structure",
        heading: "分步结构",
        body: [
          "向导适用于三步以上、步骤间有依赖的表单：基本信息 → 参数配置 → 确认提交。步骤条始终可见，当前步、已完成步与未到达步一目了然。",
          "每一步都是独立表单：字段分组内聚，按钮为“上一步 / 下一步”，最后一步变为“确认提交”。",
        ],
        list: [
          "步骤条使用有语义的步骤名，不写“步骤 1 / 步骤 2”。",
          "已完成的步骤允许点击返回（Steps 的 onStepClick），返回不丢失已填内容。",
          "步骤切换保留草稿，刷新页面后可恢复（如业务允许）。",
        ],
        preview: "form-wizard/structure",
      },
      {
        id: "validation",
        heading: "每步校验",
        body: [
          "校验发生在每一步的“下一步”时刻：本步字段全部通过才放行，错误字段就地标红并在字段下方说明原因（Input 用 aria-invalid，NumberInput / DatePicker 用 invalid），并聚焦第一个错误。",
          "跨步骤的校验（如参数组合冲突）在确认页统一标出，并允许一键跳回出错的步骤。",
        ],
      },
      {
        id: "confirm",
        heading: "回显确认",
        body: [
          "最后一步不再出现可编辑字段：以 Descriptions 形式回显全部输入，用户逐项核对后再提交。",
          "提交按钮回显影响范围（项目、预算、资源）；提交后用 Result 给出结论并指向任务详情，不允许停留在向导里猜结果。",
        ],
      },
    ],
    related: ["/components/steps", "/components/form", "/components/input-number", "/components/date-picker", "/components/descriptions", "/components/result"],
  },
  {
    id: "task-workbench",
    name: "Task Workbench",
    chineseName: "任务工作台",
    status: "stable",
    summary: "左侧任务列表、右侧任务详情的双栏工作台：状态筛选定位任务，单条追踪与批量操作在同一视图完成。",
    keywords: ["workbench", "task", "工作台", "双栏", "筛选", "批量操作", "模板"],
    sections: [
      {
        id: "structure",
        heading: "双栏结构",
        body: [
          "工作台为高频追踪场景设计：左栏是带状态筛选的任务列表，右栏是选中任务的详情与日志，选中态在左右两栏都清晰可见。",
          "列表行只承载最小决策信息：任务 ID、状态徽标、所属项目与更新时间；其余信息收进右侧详情。",
        ],
        list: [
          "左栏：Checkbox 勾选 + 可点击的任务行，行高紧凑，当前选中行高亮。",
          "右栏：RunStatus 状态（失败时带重试）、关键参数、CodeBlock 日志摘要与操作按钮。",
          "空选中态展示引导：“从左侧选择一个任务查看详情”。",
        ],
        preview: "task-workbench/structure",
      },
      {
        id: "filter",
        heading: "状态筛选",
        body: [
          "状态筛选是工作台的第一入口：用分段控件（Segmented）切换 全部 / 运行中 / 失败 / 排队中，选中即过滤，各状态计数同步更新。",
          "筛选条件保留在地址栏或可分享的视图配置中，刷新后状态不丢。",
        ],
      },
      {
        id: "batch",
        heading: "批量操作",
        body: [
          "批量操作只作用于当前可见任务：勾选后在列表上方出现批量操作条，标明已选数量与可用动作；切换筛选时清空勾选。",
          "批量动作逐条返回结果：成功的、失败的分别计数，失败的可单独重试，不允许用一句“操作完成”掩盖部分失败。",
        ],
      },
    ],
    related: ["/components/segmented", "/components/checkbox", "/components/run-status", "/components/code-block", "/patterns/run-status-logs"],
  },
  {
    id: "data-import-page",
    name: "Data Import Page",
    chineseName: "数据导入页",
    status: "stable",
    summary: "Upload 上传区、预览校验区与确认写入条的完整页面，落地“导入 → 预览 → 校验 → 写入”pattern 的全部约定。",
    keywords: ["import", "upload", "数据导入页", "上传", "预览校验", "确认写入", "模板"],
    sections: [
      {
        id: "structure",
        heading: "页面结构",
        body: [
          "页面自上而下：Steps 进度、Upload 上传区（拖拽或选择文件，上传后变为文件列表）、预览表、DataQualityNotice 校验结果、底部确认写入条。各区域随流程推进依次激活。",
          "确认写入条常驻底部：目标数据集、写入行数、覆盖行数与确认按钮始终可见；存在未处理的阻断问题时按钮禁用并写明原因。",
        ],
        preview: "data-import-page/structure",
      },
      {
        id: "feedback",
        heading: "阶段反馈",
        body: [
          "解析中：文件列表显示进度、文件名与大小，可取消；类型或大小不符在选择时即拒绝并说明原因。",
          "校验完成：DataQualityNotice 按阻断 / 提醒分级展示，逐条给出处理动作（跳过、补充、保留新值），已处理的收进“已解决”可追溯；预览表同步显示处理结果。",
        ],
      },
      {
        id: "safety",
        heading: "写入安全",
        body: [
          "确认写入前回显新版本号与影响范围；写入失败整体回滚，临时区数据保留以便修正后重试。",
          "原始文件随新版本归档保留，页面上提供版本入口，导入后可以立刻核对差异摘要。",
        ],
      },
    ],
    related: ["/components/upload", "/components/steps", "/components/table", "/components/data-quality-notice", "/patterns/data-import"],
  },
  {
    id: "agent-workspace",
    name: "Agent Workspace",
    chineseName: "Agent 工作区",
    status: "stable",
    summary: "AgentActivity 动态流、ConfirmPanel 确认面板、结果区与引用的完整工作区，承接“推荐 → 确认 → 执行”的闭环。",
    keywords: ["agent", "workspace", "工作区", "动态流", "确认面板", "引用", "模板"],
    sections: [
      {
        id: "structure",
        heading: "页面结构",
        body: [
          "工作区主栏自上而下：用户请求、AgentActivity 动态流（分析过程与建议）、ConfirmPanel（待确认动作）、结果区（执行产物与引用）；侧栏是 SourceCard 来源清单，窄屏时排到主栏下方。",
          "动态流按时间追加；确认面板只在有待确认动作时出现；结果区在执行完成后生成。三者不互相覆盖。",
        ],
        preview: "agent-workspace/structure",
      },
      {
        id: "handoff",
        heading: "推荐与确认衔接",
        body: [
          "每条可执行建议在动态流中都有对应的确认卡片：目标、范围、项目、预算与副作用完整回显，确认按钮使用 primary。",
          "确认、忽略与修改参数三种出口并存；ConfirmPanel 的 onConfirm 返回 Promise 时面板进入提交中，动态流同步变为进行中；超时未确认的建议自动失效并说明原因。",
        ],
      },
      {
        id: "result",
        heading: "结果与引用",
        body: [
          "执行结果在结果区沉淀：RunStatus 状态、产物摘要与任务 ID，失败时给出重试入口。",
          "结果中的事实性陈述必须带 Citation 引用编号，点击角标高亮对应的 SourceCard；受限来源保留编号并标“需申请”，与“正文引用 → 来源定位”pattern 保持一致。",
        ],
      },
    ],
    related: ["/components/agent-activity", "/components/confirm-panel", "/components/citation", "/components/source-card", "/patterns/agent-confirmation", "/patterns/citation-source"],
  },
];
