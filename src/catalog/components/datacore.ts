import type { ComponentDoc } from "../types";

/** DataCore 专属组件：引用、Agent 活动、确认面板、运行状态等平台差异化组件。 */
export const datacoreComponents: ComponentDoc[] = [
  {
    id: "citation",
    name: "Citation",
    chineseName: "引用角标",
    category: "datacore",
    status: "stable",
    version: "0.1.0",
    purpose: "在正文或 Agent 答复中为关键论断标注来源，并把角标与来源清单联动，让每一条结论都可追溯。",
    usage:
      "用于 Agent 答复、报告正文与数据结论旁的来源标注。角标必须绑定稳定的 citationId，点击后在来源清单中定位并高亮对应条目。无需追溯的常识不标注；需要展示来源完整信息（发布方、更新时间、可访问性）时配合 SourceCard。",
    keywords: ["citation", "source", "引用", "角标", "溯源", "来源"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "角标出现在句末，来源清单位于内容底部，序号与角标一一对应。",
        code: `<p>
  第 3 轮优化后电导率达到 8.7 mS/cm
  <Citation citationId="src-041" index={1} />。
</p>
<SourceList
  sources={[{ id: "src-041", index: 1, title: "ds-118 · 第 3 轮实验结果" }]}
/>`,
        preview: "citation/basic",
      },
      {
        id: "locate",
        title: "点击定位与高亮",
        kind: "state",
        description: "点击角标平滑滚动到对应来源并高亮约 2 秒，高亮使用 source-highlight 样式；点击其他角标时取消前一个高亮。",
        code: `<Citation
  citationId="src-042"
  index={2}
  onLocate={(id) => scrollToSource(id)}
/>`,
        fullCode: `function AnswerWithCitations() {
  const [locatedId, setLocatedId] = useState<string | null>(null);
  return (
    <>
      <p>
        建议沿当前方向继续 2 轮探索
        <Citation citationId="src-042" index={2} onLocate={setLocatedId} />。
      </p>
      <SourceList sources={sources} highlightId={locatedId} />
    </>
  );
}`,
        preview: "citation/locate",
      },
      {
        id: "unavailable",
        title: "失效来源",
        kind: "variant",
        description: "来源被删除或不可访问时，角标置灰但保留序号，来源清单中标注原因，而不是静默移除导致编号错位。",
        code: `<Citation citationId="src-055" index={3} status="unavailable" />
<SourceList
  sources={[
    { id: "src-055", index: 3, title: "外部文献（已下线）", status: "unavailable" },
  ]}
/>`,
        preview: "citation/unavailable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复中的多来源引用：每条关键结论紧跟角标，答复底部给出完整来源清单。",
        code: `<AgentAnswer>
  <p>
    基于 ds-118 第 3 轮结果<Citation citationId="src-041" index={1} />，
    建议将 LiFSI 浓度提高至 1.6 mol/kg
    <Citation citationId="src-043" index={2} />。
  </p>
  <SourceList sources={answerSources} />
</AgentAnswer>`,
        fullCode: `const answerSources = [
  { id: "src-041", index: 1, title: "ds-118 · 第 3 轮实验结果" },
  { id: "src-043", index: 2, title: "run-28003 · 优化策略摘要" },
]; // synthetic
// citationId 由后端在生成答复时分配，跨会话稳定，前端不自行编号。`,
        preview: "citation/business",
      },
    ],
    props: [
      { name: "citationId", type: "string", required: true, description: "来源的稳定 ID，由后端分配，跨会话不变，用于角标与清单联动。" },
      { name: "index", type: "number", required: true, description: "在当前内容中的序号，从 1 开始按出现顺序连续编号。" },
      { name: "status", type: '"available" | "unavailable" | "pending"', default: '"available"', description: "失效时角标置灰但保留序号，仍可定位到清单中的原因说明。" },
      { name: "onLocate", type: "(citationId: string) => void", description: "点击角标触发；默认行为是滚动定位并高亮对应来源项。" },
      { name: "source", type: "{ id: string; title: string }", description: "hover 时展示的简要来源信息，避免必须点击才能判断来源。" },
    ],
    states: [
      { name: "default", note: "上标数字角标，品牌色，行内渲染且不改变行高。" },
      { name: "hover", note: "显示下划线与来源摘要浮层，不改变布局。" },
      { name: "focus-visible", note: "与链接一致的 3px 焦点环，键盘可达。" },
      { name: "pressed", note: "颜色加深一档，无位移，时长 < 120ms。" },
      { name: "disabled", note: "不适用：角标不可禁用；来源失效使用 unavailable 变体并保留可点击定位。", applicable: false },
      { name: "loading", note: "不适用：角标本身无加载态；来源清单加载由 Skeleton 承担。", applicable: false },
      { name: "empty", note: "不适用：无来源时不渲染角标，而不是渲染空角标。", applicable: false },
      { name: "error", note: "来源解析失败按 unavailable 处理，清单内给出原因与申请入口。" },
      { name: "permission-limited", note: "无权限访问来源时角标保留，清单项标记“需申请权限”，点击引导申请而不是打开空白页。" },
      { name: "mobile", note: "角标点击区域扩展到至少 24×24px（内联 padding），不影响行距。" },
      { name: "dark-mode", note: "使用品牌色语义令牌自动适配，不单独覆盖色值。" },
      { name: "located", note: "被定位的来源项显示 source-highlight 描边约 2 秒后消退，同一时间只有一个高亮项。" },
    ],
    interaction: [
      "点击角标平滑滚动到来源项并高亮；点击其他角标时取消前一个高亮。",
      "点击来源项的序号可反向定位到第一个引用位置。",
      "序号按出现顺序自动编号；增删引用后 citationId 保持稳定，序号可重排。",
      "hover 角标展示来源摘要；触屏设备第一次点按展示摘要、第二次触发定位。",
    ],
    keyboard: [
      "Tab 依序聚焦各角标，顺序与文档阅读顺序一致。",
      "Enter 触发定位与高亮，等价于点击。",
      "高亮状态下按 Esc 取消高亮，并把焦点移到被高亮的来源项。",
    ],
    accessibility: [
      "角标使用 <a> 或 <button>，aria-label 为“来源 {index}：{标题}”，不能只朗读一个数字。",
      "高亮变化通过 aria-live=\"polite\" 区域通知，不打扰当前朗读。",
      "不单独依赖颜色区分失效来源，配合图标或“不可访问”文字。",
    ],
    responsive: [
      "窄屏下角标保持行内渲染，不允许角标被挤到单独一行。",
      "来源清单在移动端转为全宽纵向列表，序号列保持对齐。",
    ],
    content: [
      "每条关键结论（数据、建议、外部事实）至少一个引用；常识与流程性描述不标。",
      "序号样式全站统一为上标数字，不与 [1] 方括号样式混用。",
      "失效来源的说明写清原因（已下线 / 无权限 / 已删除），不写“加载失败”。",
    ],
    dos: [
      "关键数据论断后紧跟角标，不隔句。",
      "角标与来源清单一一对应，编号连续。",
      "失效来源保留角标并说明原因，维持编号稳定。",
    ],
    donts: [
      "不要让角标指向不存在的清单项（空引用）。",
      "不要在同一句堆叠超过 3 个角标，合并为一条聚合来源。",
      "不要用角标代替来源清单单独表达出处。",
    ],
    related: ["source-card", "link", "typography", "data-quality-notice"],
  },
  {
    id: "source-card",
    name: "SourceCard",
    chineseName: "来源卡片",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "以卡片形式展示一条来源的完整信息：标题、发布方、更新时间与可访问状态，并提供打开原文的入口。",
    usage:
      "用于来源清单、引用详情与数据血缘面板。正文中的轻量标注用 Citation；需要展示更新时间与可访问性、支持打开原文时用 SourceCard。",
    keywords: ["source", "card", "来源", "卡片", "血缘", "出处"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标题、发布方、更新时间与可访问状态的固定信息层级。",
        code: `<SourceCard
  source={{
    id: "src-041",
    title: "电导率优化第 3 轮实验结果",
    publisher: "DataCore 实验平台",
    updatedAt: "2026-09-18 14:32",
    accessibility: "available",
  }}
  onOpen={(id) => openSource(id)}
/>`,
        preview: "source-card/basic",
      },
      {
        id: "access",
        title: "可访问状态变体",
        kind: "variant",
        description: "可访问 / 需申请 / 已失效三态：状态决定卡片的动作入口，失效来源不提供假链接。",
        code: `<SourceCard source={{ ...base, accessibility: "available" }} />
<SourceCard source={{ ...base, accessibility: "restricted" }} />
<SourceCard source={{ ...base, accessibility: "unavailable" }} />`,
        preview: "source-card/access",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复底部的来源卡组：与正文角标共用同一组 citationId。",
        code: `<div className="source-grid">
  {answer.sources.map((source) => (
    <SourceCard key={source.id} source={source} onOpen={openSource} />
  ))}
</div>
<span>本答复共引用 {answer.sources.length} 条来源</span>`,
        preview: "source-card/business",
      },
    ],
    props: [
      { name: "source", type: "SourceInfo", required: true, description: "来源对象：id、title、publisher、updatedAt、accessibility。" },
      { name: "onOpen", type: "(id: string) => void", description: "点击卡片打开来源详情；不可访问时变为申请权限入口。" },
      { name: "compact", type: "boolean", default: "false", description: "紧凑模式省略更新时间与发布方，用于窄栏与侧栏。" },
      { name: "highlighted", type: "boolean", default: "false", description: "被 Citation 定位时展示高亮描边，约 2 秒后消退。" },
    ],
    states: [
      { name: "default", note: "标题一行截断，发布方与更新时间一行，状态徽章在右上或底部动作区。" },
      { name: "hover", note: "边框变为品牌色并轻微上浮，与 Card 的 hover 规则一致。" },
      { name: "focus-visible", note: "整卡为单一焦点目标，3px 品牌色焦点环。" },
      { name: "pressed", note: "下沉回弹，与 Card 点击反馈一致，时长 < 120ms。" },
      { name: "disabled", note: "不适用：不可访问用 unavailable 变体表达并保留原因与申请入口，不做禁用。", applicable: false },
      { name: "loading", note: "元数据加载中显示 Skeleton，骨架尺寸与卡片一致，避免加载后跳动。" },
      { name: "empty", note: "不适用：无来源时不渲染卡片，由外层 Empty 承担空态。", applicable: false },
      { name: "error", note: "元数据加载失败时在卡片位显示错误与重试，不影响同组其他卡片。" },
      { name: "permission-limited", note: "restricted 变体：标注“需申请权限”，点击卡片进入申请流程而不是打开原文。" },
      { name: "mobile", note: "网格降为单列，卡片全宽；标题最多两行后截断。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，状态徽章颜色不变。" },
      { name: "unavailable", note: "已失效：标题置灰、状态徽章为 danger 并写明原因（已下线 / 已删除），动作区只保留“查看说明”。" },
    ],
    interaction: [
      "整卡可点击，点击主区域打开来源；状态徽章与动作按钮不触发打开。",
      "打开来源保留当前上下文（新面板或抽屉），可返回原位置。",
      "不可访问卡片点击时给出原因与申请入口，不做无反馈点击。",
    ],
    keyboard: [
      "Tab 聚焦卡片，焦点顺序与视觉顺序一致。",
      "Enter 打开来源，等价于点击。",
    ],
    accessibility: [
      "整卡表达为单一链接或按钮语义，内部不嵌套多个可点击元素。",
      "可访问状态用图标加文字表达，不单独依赖颜色。",
      "aria-label 包含标题与状态：“{标题}，{状态}”。"],
    responsive: [
      "桌面网格 2-3 列，窄屏降为单列全宽。",
      "紧凑模式用于宽度小于 280px 的侧栏。",
    ],
    content: [
      "标题使用来源原始名称，不改写、不翻译。",
      "更新时间精确到分钟；相对时间（3 天前）只作辅助，不单独使用。",
      "发布方写全称（DataCore 实验平台），不用缩写或内部代号。",
    ],
    dos: [
      "更新时间与发布方同时展示，缺一不可。",
      "不可访问给出原因与申请路径。",
      "卡片信息层级固定：标题 → 发布方与时间 → 状态。",
    ],
    donts: [
      "不要只显示标题而隐藏可访问状态。",
      "不要对失效来源渲染可点击的假链接。",
      "不要在卡片内嵌套超过一个动作按钮。",
    ],
    related: ["citation", "card", "badge", "empty"],
  },
  {
    id: "agent-activity",
    name: "AgentActivity",
    chineseName: "Agent 活动",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "实时展示 Agent 当前在做什么：所处步骤、正在调用的工具、以及是否在等待用户确认。",
    usage:
      "用于 Agent 工作区与任务详情页的实时活动流。Agent 语义统一使用紫色；只展示任务的最终状态用 RunStatus，确认动作本身用 ConfirmPanel，单次工具调用的详情用 ToolRunCard。",
    keywords: ["agent", "activity", "智能体", "活动", "步骤", "工具调用"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "步骤列表展示已完成、进行中与待执行；当前步骤带 spinner 与工具调用摘要。",
        code: `<AgentActivity
  steps={[
    { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3" },
    { id: "s2", title: "调用优化工具", status: "active" },
    { id: "s3", title: "生成推荐配方", status: "pending" },
  ]}
  currentTool={{ name: "conductivity-optimize", summary: "round=3 · budget=300s" }}
/>`,
        preview: "agent-activity/basic",
      },
      {
        id: "waiting",
        title: "等待用户确认",
        kind: "state",
        description: "遇到产生副作用的动作时流程暂停，切换为紫色等待态并给出确认入口；确认前不自动推进。",
        code: `<AgentActivity
  steps={steps}
  waitingFor="user-confirmation"
  onConfirm={() => confirmPlan()}
  onEdit={() => editParams()}
/>`,
        preview: "agent-activity/waiting",
      },
      {
        id: "failed",
        title: "步骤失败",
        kind: "variant",
        description: "失败步骤标红并给出原因与单步重试入口，流程停在失败步骤，不静默跳过也不整体作废。",
        code: `<AgentActivity
  steps={[
    { id: "s1", title: "读取输入数据", status: "done" },
    {
      id: "s2",
      title: "调用外部数据库",
      status: "failed",
      detail: "连接超时（10s）",
    },
    { id: "s3", title: "生成推荐配方", status: "pending" },
  ]}
  onRetry={(stepId) => retryStep(stepId)}
/>`,
        preview: "agent-activity/failed",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "电导率优化 Agent 的完整活动流：历史步骤可追溯，当前工具调用有参数摘要。",
        code: `<AgentActivity
  title="电导率优化 Agent"
  steps={optimizeSteps}
  currentTool={{ name: "conductivity-optimize", summary: "round=3 · target=9.0 mS/cm" }}
  onConfirm={confirmExecution}
/>`,
        fullCode: `const optimizeSteps = [
  { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条" },
  { id: "s2", title: "基线模型评估", status: "done", detail: "耗时 42s" },
  { id: "s3", title: "调用优化工具", status: "active" },
  { id: "s4", title: "生成推荐配方", status: "pending" },
  { id: "s5", title: "写入实验记录", status: "pending" },
]; // synthetic`,
        preview: "agent-activity/business",
      },
    ],
    props: [
      { name: "steps", type: "AgentStep[]", required: true, description: "步骤数组：id、title、status（done / active / waiting / failed / pending）、可选 detail。" },
      { name: "currentTool", type: "{ name: string; summary: string }", description: "正在调用的工具名与单行参数摘要，mono 字体展示。" },
      { name: "waitingFor", type: '"user-confirmation" | "resource" | null', default: "null", description: "等待原因；为 user-confirmation 时展示确认入口并暂停推进。" },
      { name: "onConfirm", type: "() => void", description: "等待用户确认时的确认回调，确认后继续执行。" },
      { name: "onRetry", type: "(stepId: string) => void", description: "失败步骤的单步重试回调。" },
      { name: "title", type: "string", description: "活动流标题，通常是 Agent 名称，紫色语义。" },
    ],
    states: [
      { name: "default", note: "步骤纵向排列；当前步骤 spinner + 紫色高亮，已完成步骤绿色对勾，待执行步骤灰色。" },
      { name: "hover", note: "步骤行 hover 显示详情（耗时、工具参数），已折叠的详情可展开。" },
      { name: "focus-visible", note: "确认、重试等可交互元素遵循 Button 焦点环规则。" },
      { name: "pressed", note: "动作按钮按压反馈与 Button 一致。" },
      { name: "disabled", note: "不适用：活动流本身不禁用；内部动作按钮遵循各自的 disabled 规则。", applicable: false },
      { name: "loading", note: "当前步骤显示 spinner；整体加载用 Skeleton 保持高度，避免流式更新时跳动。" },
      { name: "empty", note: "尚无活动时显示“等待任务开始”占位与任务入口，不渲染空白区域。" },
      { name: "error", note: "步骤失败标红，给出原因、单步重试与人工接管入口。" },
      { name: "permission-limited", note: "即将调用的工具超出用户权限时，流程暂停并显示所需权限与申请入口。" },
      { name: "mobile", note: "步骤纵向排列，工具参数摘要单行截断；确认按钮全宽。" },
      { name: "dark-mode", note: "紫色语义令牌自动适配，深浅主题下都读得出 Agent 语义。" },
      { name: "waiting", note: "等待用户确认时当前步骤静止、整体切换为紫色等待卡片，并显示已等待时长。" },
    ],
    interaction: [
      "流式更新只追加新步骤，不重排历史步骤，避免打断阅读。",
      "等待确认时停止自动推进，确认或修改参数后才继续。",
      "失败步骤可单步重试，重试不影响已完成步骤的产物。",
      "每一步可展开查看详情：开始时间、耗时、工具参数与输出摘要。",
    ],
    keyboard: [
      "确认、重试按钮 Tab 可达，Enter 触发。",
      "步骤行可聚焦，Enter 展开或收起详情。",
    ],
    accessibility: [
      "当前步骤变化通过 aria-live=\"polite\" 播报，如“正在调用 conductivity-optimize”。",
      "spinner 必须伴随文字“进行中”，不做纯动画。",
      "Agent 语义不只靠紫色表达，配合 Sparkles 图标与文字。",
    ],
    responsive: [
      "窄屏下已完成步骤可折叠为“已完成 N 步”，当前步骤始终完整可见。",
      "工具参数摘要在窄屏单行截断，详情在展开区内换行。",
    ],
    content: [
      "步骤标题用动词短语：读取输入数据、生成推荐配方。",
      "工具名使用 mono 字体，参数摘要单行写清关键参数。",
      "等待原因写清楚等谁、等什么：等待用户确认执行范围。",
    ],
    dos: [
      "当前步骤始终可见且状态明确。",
      "每一步都有确定状态，不留模糊态。",
      "等待确认时在原地给出确认入口。",
    ],
    donts: [
      "不要让活动流默默卡住：无响应超过阈值要提示超时。",
      "不要用绿色表达 Agent：紫色是 Agent 语义色。",
      "不要重排或删除历史步骤，审计上要求可追溯。",
    ],
    related: ["run-status", "confirm-panel", "tool-run-card", "steps", "badge"],
  },
  {
    id: "run-status",
    name: "RunStatus",
    chineseName: "运行状态",
    category: "datacore",
    status: "stable",
    version: "0.1.0",
    purpose: "用一致的徽章与状态行表达任务生命周期：排队、运行中、成功、失败、部分完成、需重试。",
    usage:
      "用于任务列表、任务详情与批处理结果。六态是封闭集合，不允许新增第七种状态色；需要展示实时进度时配合 Progress，需要展示执行过程时配合 AgentActivity。",
    keywords: ["run", "status", "运行", "状态", "任务", "排队", "重试"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "六种状态覆盖完整生命周期，图标加文字表达，不单独依赖颜色。",
        code: `<RunStatus status="queued" />
<RunStatus status="running" />
<RunStatus status="succeeded" />
<RunStatus status="failed" />
<RunStatus status="partial" />
<RunStatus status="retry-needed" />`,
        preview: "run-status/basic",
      },
      {
        id: "detail",
        title: "带说明的状态行",
        kind: "variant",
        description: "状态旁给出原因或进度明细，并提供下一步动作：重试、查看明细、查看队列。",
        code: `<RunStatus status="failed" detail="计算资源超时（exit 124）" onRetry={retry} />
<RunStatus status="partial" detail="12/15 完成" onViewDetail={openDetail} />
<RunStatus status="queued" detail="队列第 2 位" />`,
        preview: "run-status/detail",
      },
      {
        id: "flow",
        title: "状态流转",
        kind: "state",
        description: "状态沿生命周期单向流转：排队中 → 运行中 → 成功 / 失败 / 部分完成；失败后进入需重试，重试后回到排队中。",
        code: `<RunStatus status={run.status} detail={run.detail} />
<Button size="sm" onClick={advance}>模拟推进</Button>`,
        fullCode: `const transitions = {
  queued: "running",
  running: "succeeded", // 也可能进入 failed / partial
  failed: "retry-needed",
  "retry-needed": "queued",
}; // synthetic：真实流转由后端事件驱动，前端只订阅更新`,
        preview: "run-status/flow",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表中的状态列：每行一个确定状态，失败行给出原因与重试入口。",
        code: `<Table
  columns={[
    { key: "id", title: "任务" },
    { key: "project", title: "项目" },
    {
      key: "status",
      title: "状态",
      render: (row) => <RunStatus status={row.status} detail={row.detail} />,
    },
  ]}
  dataSource={runs}
/>`,
        preview: "run-status/business",
      },
    ],
    props: [
      { name: "status", type: '"queued" | "running" | "succeeded" | "failed" | "partial" | "retry-needed"', required: true, description: "封闭六态集合，映射固定的图标、颜色与文案。" },
      { name: "detail", type: "string", description: "状态说明：失败原因、部分完成数量（12/15）或队列位置。" },
      { name: "label", type: "string", description: "覆盖默认文案；仅在有更强业务语境时使用，不改变颜色语义。" },
      { name: "onRetry", type: "() => void", description: "retry-needed 状态下展示的重试动作。" },
      { name: "onViewDetail", type: "() => void", description: "partial 状态下展示“查看明细”入口。" },
    ],
    states: [
      { name: "default", note: "徽章形态：图标 + 短文案；六种状态各有固定配色与图标。" },
      { name: "hover", note: "带 detail 时 hover 展示完整说明浮层；纯徽章 hover 无变化。" },
      { name: "focus-visible", note: "可交互状态行（重试、查看明细）内的按钮遵循 Button 焦点规则。" },
      { name: "pressed", note: "动作按钮按压反馈与 Button 一致，徽章本身无按压态。" },
      { name: "disabled", note: "不适用：状态是事实展示，不可禁用。", applicable: false },
      { name: "loading", note: "状态刷新中保留旧值并降低透明度，不闪烁回骨架；首次加载用 Skeleton。" },
      { name: "empty", note: "不适用：任务必有确定状态；状态数据缺失时显示 neutral“状态未知”，不猜测。", applicable: false },
      { name: "error", note: "状态流断连时在徽章旁标注“状态可能延迟”，并提供手动刷新。" },
      { name: "permission-limited", note: "无权限查看的任务显示 neutral 徽章加锁图标，不暴露状态细节。" },
      { name: "mobile", note: "徽章保留图标与短文案，detail 折行展示，不截断失败原因。" },
      { name: "dark-mode", note: "六种状态色均使用语义令牌，深浅主题下对比度一致。" },
    ],
    interaction: [
      "状态变化原地更新，徽章宽度不跳动，列表不闪烁。",
      "retry-needed 给出明确重试入口，重试后回到排队中。",
      "partial 可展开查看成功与失败明细，不只给一个比例。",
      "状态流转由后端事件驱动，前端订阅更新，不做定时暴力轮询。",
    ],
    keyboard: [
      "状态行内的重试、查看明细按钮 Tab 可达，Enter 触发。",
      "徽章本身只读时可聚焦，焦点态朗读状态与 detail。",
    ],
    accessibility: [
      "状态用图标加文字表达，不单独依赖颜色。",
      "状态变化通过 aria-live=\"polite\" 播报，如“任务 run-28003 已失败”。",
      "徽章容器使用 role=\"status\" 或语义化文本，读屏可直接读出状态。",
    ],
    responsive: [
      "窄屏徽章保持图标加短文案，不换行不截断。",
      "状态行在窄屏允许 detail 折行，动作按钮换到下一行。",
    ],
    content: [
      "六态固定文案：排队中、运行中、已成功、已失败、部分完成、需重试。",
      "失败必须给原因（计算资源超时），部分完成必须给数量（12/15 完成）。",
      "不写“出错啦”这类无信息文案；原因一行说清，细节进日志。",
    ],
    dos: [
      "全站统一六态集合与配色。",
      "失败给原因和下一步动作。",
      "部分完成说明比例并给明细入口。",
    ],
    donts: [
      "不要自造第七种状态色或“半成功”这类模糊状态。",
      "不要把“需重试”渲染成“已失败”而丢掉重试入口。",
      "不要用一次性 Toast 代替常驻状态徽章。",
    ],
    related: ["badge", "progress", "alert", "agent-activity", "tool-run-card"],
  },
  {
    id: "confirm-panel",
    name: "ConfirmPanel",
    chineseName: "确认面板",
    category: "datacore",
    status: "stable",
    version: "0.1.0",
    purpose: "在执行产生副作用的动作前，回显目标、范围、项目、预算与副作用，让用户在完整知情下明确确认。",
    usage:
      "用于 Agent 推荐执行、批量操作与危险动作的确认。确认面板之外不允许“顺手执行”。简单的行内二次确认（删除一行）用 Popconfirm；涉及项目、预算或外部副作用的动作必须用 ConfirmPanel。",
    keywords: ["confirm", "panel", "确认", "面板", "副作用", "预算", "二次确认"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "五要素回显：目标、范围、项目、预算、副作用，确认按钮回显范围。",
        code: `<ConfirmPanel
  title="重新计算电导率"
  target="ds-118 · 第 3 轮推荐配方"
  scope="创建 1 个 CPU 计算任务"
  project={{ id: "project-042", name: "示例项目" }}
  budget="预计最长 300 秒"
  sideEffects={["占用项目算力额度", "写入一条审计日志"]}
  onConfirm={submit}
  onCancel={close}
/>`,
        preview: "confirm-panel/basic",
      },
      {
        id: "danger",
        title: "高危动作",
        kind: "variant",
        description: "不可逆动作用 danger 语义：副作用以红色醒目列出，确认按钮使用 danger 变体并写清后果。",
        code: `<ConfirmPanel
  danger
  title="撤销任务 run-28003"
  target="run-28003 · 电导率计算"
  scope="任务与其中间产物"
  project={{ id: "project-042", name: "示例项目" }}
  sideEffects={["中间结果将被删除，不可恢复", "已占用额度不返还"]}
  confirmText="确认撤销"
  onConfirm={revoke}
  onCancel={close}
/>`,
        preview: "confirm-panel/danger",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "确认后创建可追踪任务：面板进入 loading，随后给出任务 ID 与状态入口。",
        code: `<ConfirmPanel
  title="提交电导率优化计算"
  target="ds-118 · v3 · 128 条记录"
  scope="创建 1 个 GPU 计算任务"
  project={{ id: "project-042", name: "示例项目" }}
  budget="预计最长 300 秒"
  sideEffects={["占用项目算力额度", "写入审计日志", "结果写回 ds-118"]}
  confirmText="确认使用 project-042 执行"
  onConfirm={async () => {
    const run = await submitRun({ datasetId: "ds-118" }); // synthetic
    showCreated(run.id); // 展示 run-28003 与状态入口
  }}
  onCancel={close}
/>`,
        preview: "confirm-panel/business",
      },
    ],
    props: [
      { name: "title", type: "string", required: true, description: "动作名称，动词开头：重新计算电导率、撤销任务。" },
      { name: "target", type: "string", required: true, description: "作用对象：数据集、任务或资源，带稳定 ID。" },
      { name: "scope", type: "string", required: true, description: "影响范围：将创建或修改什么，数量化表达。" },
      { name: "project", type: "{ id: string; name: string }", required: true, description: "归属项目，展示名称与 ID，不允许“无项目”动作。" },
      { name: "budget", type: "string", description: "预算或预计消耗：时长、额度、次数，必须带单位。" },
      { name: "sideEffects", type: "string[]", required: true, description: "副作用清单，逐条列出，不允许折叠到“查看更多”。" },
      { name: "danger", type: "boolean", default: "false", description: "不可逆动作启用 danger 语义：红色副作用区与 danger 确认按钮。" },
      { name: "confirmText", type: "string", description: "确认按钮文案，默认“确认执行”；建议回显范围，如“确认使用 project-042 执行”。" },
      { name: "onConfirm", type: "() => void | Promise<void>", required: true, description: "确认回调；异步动作期间面板进入 loading 并防止重复提交。" },
      { name: "onCancel", type: "() => void", required: true, description: "取消回调；取消不产生任何副作用。" },
    ],
    states: [
      { name: "default", note: "五要素依次排列：目标 → 范围 → 项目 → 预算 → 副作用，动作区右下。" },
      { name: "hover", note: "按钮 hover 遵循 Button 规则；信息区无 hover 变化。" },
      { name: "focus-visible", note: "打开后焦点落在取消按钮（安全默认），Tab 在面板内循环。" },
      { name: "pressed", note: "按钮按压反馈与 Button 一致。" },
      { name: "disabled", note: "要素未加载完整前确认按钮禁用，并提示“正在核对执行信息”。" },
      { name: "loading", note: "确认后进入 loading：按钮转圈、面板内容锁定，防止重复提交。" },
      { name: "empty", note: "不适用：要素缺失时阻止打开并在触发处提示，不渲染空面板。", applicable: false },
      { name: "error", note: "提交失败保留面板全部内容与输入，顶部给出错误原因与重试。" },
      { name: "permission-limited", note: "无执行权限时确认按钮禁用，并说明所需权限与申请入口。" },
      { name: "mobile", note: "面板全宽，五要素纵向排列，确认按钮在前并全宽。" },
      { name: "dark-mode", note: "使用语义令牌自动适配；danger 区域在深色下保持可读。" },
      { name: "confirmed", note: "确认成功后展示任务 ID 与状态入口（run-28003 · 排队中），并提供“查看任务”。" },
    ],
    interaction: [
      "确认前完整展示副作用，逐条列出，不折叠、不省略。",
      "确认按钮建议回显范围（确认使用 project-042 执行），让点击有上下文。",
      "执行后给出任务 ID 与状态入口，可追踪；业务允许时提供撤销。",
      "取消、关闭、Esc 都不产生任何副作用。",
    ],
    keyboard: [
      "打开后焦点落在取消按钮，避免打开即 Enter 误触发危险动作。",
      "Tab 在面板内循环，不会移出面板的聚焦陷阱。",
      "Esc 取消并关闭，等价于点击取消。",
    ],
    accessibility: [
      "使用 role=\"dialog\" 与 aria-modal=\"true\"，标题关联 aria-labelledby。",
      "副作用清单使用列表语义，读屏可逐条朗读。",
      "danger 不单独依赖红色，配合图标与后果文案。",
    ],
    responsive: [
      "窄屏面板全宽，要素纵向排列，动作按钮纵向堆叠。",
      "副作用清单最多展示 5 条，超出以滚动区域承载，不做折叠隐藏。",
    ],
    content: [
      "标题动词开头：重新计算电导率、撤销任务 run-28003。",
      "副作用逐条写清后果与可恢复性，不用“等”字收尾。",
      "预算带单位：300 秒、2 核时、1 次调用。",
    ],
    dos: [
      "五要素齐全才允许打开面板。",
      "危险动作使用 danger 变体并写清后果。",
      "确认后回传可追踪任务 ID 与状态入口。",
    ],
    donts: [
      "不要把副作用折叠进“查看更多”或小字附注。",
      "不要用“确定”“好的”这类无上下文按钮文案。",
      "不要确认后无反馈：必须有 loading 与结果回传。",
    ],
    related: ["modal", "button", "agent-activity", "run-status", "popconfirm"],
  },
  {
    id: "project-selector",
    name: "ProjectSelector",
    chineseName: "项目选择器",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "选择动作归属的项目，同时展示项目 ID、默认项目标记与当前用户在项目内的权限状态。",
    usage:
      "用于提交任务、创建资源前的项目归属选择。项目是所有计算与数据动作的归属边界，不允许“无项目”提交；只读展示项目信息时用 Descriptions。",
    keywords: ["project", "selector", "项目", "选择器", "归属", "权限"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "选项同时展示项目名称、项目 ID、默认标记与权限徽章；默认项目排在最前。",
        code: `<ProjectSelector
  projects={[
    { id: "project-042", name: "示例项目", isDefault: true, permission: "admin" },
    { id: "project-107", name: "电解液筛选", permission: "executor" },
    { id: "project-209", name: "共享数据池", permission: "viewer" },
  ]}
  value={projectId}
  onChange={setProjectId}
  requiredPermission="executor"
/>`,
        preview: "project-selector/basic",
      },
      {
        id: "limited",
        title: "权限不足的项目",
        kind: "state",
        description: "达不到 requiredPermission 的项目禁用选择并标注权限缺口，而不是隐藏，避免用户误以为项目不存在。",
        code: `<ProjectSelector
  projects={projects}
  requiredPermission="executor"
  onRequestAccess={(project) => requestAccess(project.id)}
/>`,
        preview: "project-selector/limited",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算前选择归属项目：选中后回显项目与权限摘要，提交动作跟随权限启停。",
        code: `<ProjectSelector
  projects={projects}
  value={projectId}
  onChange={setProjectId}
  requiredPermission="executor"
/>
<Button variant="primary" disabled={!canExecute}>提交计算任务</Button>`,
        fullCode: `const projects = [
  { id: "project-042", name: "示例项目", isDefault: true, permission: "admin" },
  { id: "project-107", name: "电解液筛选", permission: "executor" },
  { id: "project-209", name: "共享数据池", permission: "viewer" },
]; // synthetic
// canExecute = 当前选中项目的 permission 满足 requiredPermission`,
        preview: "project-selector/business",
      },
    ],
    props: [
      { name: "projects", type: "ProjectOption[]", required: true, description: "项目选项：id、name、isDefault、permission（viewer / editor / executor / admin）。" },
      { name: "value", type: "string", description: "选中项目 ID；提交类动作默认选中默认项目。" },
      { name: "onChange", type: "(projectId: string) => void", required: true, description: "选择回调，选中即生效并回显项目名与 ID。" },
      { name: "requiredPermission", type: '"viewer" | "editor" | "executor" | "admin"', default: '"viewer"', description: "动作所需最低权限；达不到的选项禁用并标注缺口。" },
      { name: "onRequestAccess", type: "(project: ProjectOption) => void", description: "权限不足选项上的申请入口。" },
      { name: "showId", type: "boolean", default: "true", description: "始终展示项目 ID，避免同名项目混淆。" },
    ],
    states: [
      { name: "default", note: "触发器回显选中项目名称 + ID + 权限徽章；下拉内默认项目置顶并标记。" },
      { name: "hover", note: "选项行 hover 高亮，禁用选项无 hover 反馈。" },
      { name: "focus-visible", note: "触发器与选项键盘可达，焦点环与 Select 一致。" },
      { name: "pressed", note: "不适用：选择器无按压态，选中以勾选与背景表达。", applicable: false },
      { name: "disabled", note: "项目加载失败或无任何项目时整体禁用，原因写在触发器旁。" },
      { name: "loading", note: "选项加载中显示骨架行，触发器保持可用文案“正在加载项目”。" },
      { name: "empty", note: "无项目时显示空态与“创建项目 / 申请加入”入口，不渲染空下拉。" },
      { name: "error", note: "加载失败显示错误与重试，保留上次成功的选中值。" },
      { name: "permission-limited", note: "权限不足的选项禁用，展示当前权限徽章与所需权限，并提供申请入口。" },
      { name: "mobile", note: "触发器全宽；选项行允许两行展示（名称一行、ID 与徽章一行）。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，权限徽章配色不变。" },
    ],
    interaction: [
      "选择立即生效并回显项目名称、ID 与权限徽章。",
      "默认项目排在最前并带“默认”标记；同名项目用 ID 区分。",
      "权限不足的选项可查看但不可选，点击申请入口发起权限申请。",
      "选中项目变化时，关联动作（提交按钮）即时重新校验权限。",
    ],
    keyboard: [
      "触发器 Enter / Space 展开，上下方向键移动选项。",
      "Enter 选中并关闭，Esc 放弃并关闭。",
      "禁用选项可聚焦朗读原因，但不响应选中。",
    ],
    accessibility: [
      "使用 listbox / option 语义，选中项 aria-selected=\"true\"。",
      "禁用选项的 aria-label 包含原因：“共享数据池，仅可见，需要可执行权限”。",
      "权限徽章用图标加文字，不单独依赖颜色。",
    ],
    responsive: [
      "窄屏触发器全宽，下拉面板宽度跟随触发器。",
      "选项行在窄屏允许折行为两行，ID 使用 mono 字体保持可扫读。",
    ],
    content: [
      "项目名称与项目 ID 同时展示，ID 使用 mono 字体。",
      "权限文案固定四级：可见 / 可编辑 / 可执行 / 管理员。",
      "权限缺口写清“需要可执行权限”，不写“权限不足”即止。",
    ],
    dos: [
      "默认项目置顶并标记。",
      "权限不足的选项给出缺口说明与申请入口。",
      "提交类动作默认选中默认项目。",
    ],
    donts: [
      "不要只显示项目名称：同名项目会造成归属错误。",
      "不要隐藏无权限项目，用户会误以为项目不存在。",
      "不要允许“不选项目”提交计算或写入动作。",
    ],
    related: ["select", "combobox", "permission-scope", "badge", "form"],
  },
  {
    id: "dataset-picker",
    name: "DatasetPicker",
    chineseName: "数据集选择器",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "按数据集、批次、版本与来源选择计算或分析的输入数据，并让版本与来源显式可见。",
    usage:
      "用于选择训练集、优化输入与分析对象。版本必须显式选择或显式标注默认到最新稳定版，不允许隐式漂移；仅需上传本地文件时用 Upload。",
    keywords: ["dataset", "picker", "数据集", "批次", "版本", "选择器"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "选项展示数据集名称、批次、版本、来源与记录数，单选即选即用。",
        code: `<DatasetPicker
  datasets={[
    { id: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
    { id: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "imported", records: 342 },
  ]}
  value={datasetId}
  onChange={setDatasetId}
/>`,
        preview: "dataset-picker/basic",
      },
      {
        id: "multi",
        title: "多选批次",
        kind: "variant",
        description: "多选模式用于合并多个批次作为输入，选中后给出记录数合计。",
        code: `<DatasetPicker
  selectionMode="multiple"
  datasets={datasets}
  value={selectedIds}
  onChange={setSelectedIds}
/>`,
        preview: "dataset-picker/multi",
      },
      {
        id: "empty",
        title: "空状态",
        kind: "state",
        description: "无可用数据集时说明原因并给出导入入口，不渲染空列表。",
        code: `<DatasetPicker
  datasets={[]}
  emptyAction={{ label: "去导入数据", onClick: goImport }}
/>`,
        preview: "dataset-picker/empty",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "为电导率优化选择输入数据集：选中后回显摘要，版本固定为 v3，不会隐式漂移。",
        code: `<DatasetPicker
  datasets={datasets}
  value={datasetId}
  onChange={setDatasetId}
  latestOnly
/>
<DataQualityNotice issues={qualityIssues} />
<Button variant="primary" disabled={!datasetId}>开始优化</Button>`,
        fullCode: `const datasets = [
  { id: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
  { id: "ds-118", name: "电解液电导率数据集", batch: "batch-06", version: "v2", source: "imported", records: 120 },
  { id: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "shared", records: 342 },
]; // synthetic：同一数据集的多个版本并列展示，latestOnly 只保留最新稳定版`,
        preview: "dataset-picker/business",
      },
    ],
    props: [
      { name: "datasets", type: "DatasetOption[]", required: true, description: "数据集选项：id、name、batch、version、source（imported / computed / shared）、records。" },
      { name: "value", type: "string | string[]", description: "选中的数据集 ID；多选时为 ID 数组。" },
      { name: "onChange", type: "(value: string | string[]) => void", required: true, description: "选择回调，选中后回显数据集摘要。" },
      { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "多选模式用于合并多个批次作为输入。" },
      { name: "latestOnly", type: "boolean", default: "false", description: "只展示每个数据集的最新稳定版本，历史版本收进版本下拉。" },
      { name: "emptyAction", type: "{ label: string; onClick: () => void }", description: "空态的动作入口，通常是去导入数据。" },
    ],
    states: [
      { name: "default", note: "选项行依次展示名称、批次、版本、来源徽章与记录数。" },
      { name: "hover", note: "选项行 hover 高亮；归档与被占用选项无 hover 反馈。" },
      { name: "focus-visible", note: "选项键盘可达，焦点环与 Select 选项一致。" },
      { name: "pressed", note: "不适用：无按压态，选中以勾选与背景表达。", applicable: false },
      { name: "disabled", note: "被占用或已归档的数据集禁用并标注原因，可查看不可选。" },
      { name: "loading", note: "选项加载中显示骨架行，数量与真实列表接近。" },
      { name: "empty", note: "无数据集时显示“暂无数据集”与导入入口；筛选为空时提示清除筛选。" },
      { name: "error", note: "加载失败显示错误与重试，保留上次成功的选中值。" },
      { name: "permission-limited", note: "无权限数据集置灰，标注“需申请权限”并提供申请入口。" },
      { name: "mobile", note: "选项行折行为两行：名称一行，批次 / 版本 / 来源一行。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，来源徽章配色不变。" },
    ],
    interaction: [
      "选中后回显摘要：数据集名、批次、版本与记录数。",
      "同一数据集的多个版本并列或收进版本下拉，切换版本即时生效。",
      "多选模式给出合计：已选 2 个数据集 · 共 240 条记录。",
      "选择已归档版本时给出警告，但不阻止（审计场景需要复现）。",
    ],
    keyboard: [
      "上下方向键移动选项，单选 Enter 选中。",
      "多选模式 Space 切换勾选，Enter 确认。",
      "Esc 关闭下拉并保留已选值。",
    ],
    accessibility: [
      "单选使用 radio 语义，多选使用 checkbox 语义。",
      "accessible name 包含名称、版本与来源：“电解液电导率数据集，v3，计算产出”。",
      "禁用选项朗读禁用原因。",
    ],
    responsive: [
      "窄屏选项行折行为两行，元信息不截断版本与来源。",
      "多选合计在窄屏固定在底部一行。",
    ],
    content: [
      "版本格式统一为 v + 数字（v3），批次使用 mono 字体。",
      "来源固定三类文案：导入 / 计算产出 / 共享。",
      "记录数必须有，空数据集（0 条）要明示而不是省略。",
    ],
    dos: [
      "版本显式展示，默认也标注“默认最新稳定版 v3”。",
      "显示记录数与更新时间，帮助判断数据新鲜度。",
      "多选给出记录数合计。",
    ],
    donts: [
      "不要默认“最新版”而不标明版本号：计算输入必须可复现。",
      "不要隐藏来源：导入与计算产出影响数据可信度判断。",
      "不要在选择已归档版本时不给任何提示。",
    ],
    related: ["select", "table", "tag", "data-quality-notice", "upload"],
  },
  {
    id: "permission-scope",
    name: "PermissionScope",
    chineseName: "权限范围",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "用固定四级语义表达权限范围：可见、可编辑、可执行、管理员，并说明每一级能做什么、不能做什么。",
    usage:
      "用于项目成员列表、共享设置与动作前的权限提示。四级是封闭集合；权限判断在服务端执行，前端只做展示与引导，不允许用隐藏按钮代替权限校验。",
    keywords: ["permission", "scope", "权限", "范围", "可见", "可执行", "管理员"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "四级徽章各有固定图标与配色，hover 展示该级能力说明。",
        code: `<PermissionScope scope="viewer" />
<PermissionScope scope="editor" />
<PermissionScope scope="executor" />
<PermissionScope scope="admin" />`,
        preview: "permission-scope/basic",
      },
      {
        id: "matrix",
        title: "权限矩阵",
        kind: "variant",
        description: "用只读矩阵说明每一级能做什么，避免用户猜测权限缺口。",
        code: `<PermissionMatrix
  scopes={["viewer", "editor", "executor", "admin"]}
  capabilities={[
    { action: "查看数据与结果", allow: ["viewer", "editor", "executor", "admin"] },
    { action: "编辑配置与配方", allow: ["editor", "admin"] },
    { action: "提交计算任务", allow: ["executor", "admin"] },
    { action: "管理成员与权限", allow: ["admin"] },
  ]}
/>`,
        preview: "permission-scope/matrix",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目成员列表中的权限列；权限不足的动作给出缺口说明与申请入口。",
        code: `<MemberList
  members={[
    { name: "张示例", scope: "admin" },
    { name: "李示例", scope: "executor" },
    { name: "王示例", scope: "viewer" },
  ]}
/>
<Button disabled={scope === "viewer"}>提交计算任务</Button>
{scope === "viewer" && (
  <span>需要可执行权限 · <a onClick={requestUpgrade}>申请升级</a></span>
)}`,
        preview: "permission-scope/business",
      },
    ],
    props: [
      { name: "scope", type: '"viewer" | "editor" | "executor" | "admin"', required: true, description: "封闭四级集合，映射固定图标、配色与文案。" },
      { name: "showDescription", type: "boolean", default: "false", description: "在徽章旁展示该级能力说明（可以……，不能……）。" },
      { name: "required", type: '"viewer" | "editor" | "executor" | "admin"', description: "动作所需级别；当前级别不足时徽章旁给出缺口提示。" },
      { name: "onRequestUpgrade", type: "() => void", description: "权限不足时的申请升级入口。" },
    ],
    states: [
      { name: "default", note: "徽章形态：图标 + 级别文案；四级各有固定配色。" },
      { name: "hover", note: "hover 展示能力说明浮层：可以做什么、不能做什么。" },
      { name: "focus-visible", note: "徽章可聚焦查看说明，焦点环与 Badge 一致。" },
      { name: "pressed", note: "不适用：权限徽章是只读展示，无按压态。", applicable: false },
      { name: "disabled", note: "不适用：权限徽章不表达禁用；动作禁用由按钮自身承担。", applicable: false },
      { name: "loading", note: "权限拉取中显示骨架徽章，不猜测级别。" },
      { name: "empty", note: "不适用：主体必有确定级别；级别缺失按最低级别处理并提示数据异常。", applicable: false },
      { name: "error", note: "拉取失败显示 neutral“权限未知”徽章与重试，动作按无权限处理。" },
      { name: "permission-limited", note: "组件本身就是权限表达：级别不足时展示当前级别、所需级别与申请升级入口。" },
      { name: "mobile", note: "徽章保留图标与短文案；能力说明改为点击展开而非 hover。" },
      { name: "dark-mode", note: "四级配色使用语义令牌，深浅主题下对比度一致。" },
    ],
    interaction: [
      "hover 或点击徽章展示能力明细：可以做什么、不能做什么。",
      "权限不足的动作旁展示所需级别与申请入口，点击发起申请。",
      "级别变更（被升级或降级）后徽章即时更新并给出通知。",
    ],
    keyboard: [
      "徽章 Tab 可聚焦，Enter 展开能力说明，Esc 收起。",
      "申请入口是链接或按钮语义，Enter 触发。",
    ],
    accessibility: [
      "级别用图标加文字表达，不单独依赖颜色。",
      "能力说明浮层与徽章关联 aria-describedby。",
      "矩阵表使用 scope 表头，读屏可按行列朗读。",
    ],
    responsive: [
      "窄屏徽章保持图标加短文案，说明文字折行展示。",
      "权限矩阵在窄屏横向滚动，首列固定。",
    ],
    content: [
      "四级固定文案：可见 / 可编辑 / 可执行 / 管理员。",
      "能力说明句式统一：“可以……，不能……”，各一句。",
      "缺口提示写清所需级别：“需要可执行权限”，不写“权限不足”即止。",
    ],
    dos: [
      "动作旁标注所需级别，让用户执行前就知道能否操作。",
      "矩阵只读展示，不承担编辑（编辑走成员管理流程）。",
      "权限不足给出申请升级入口。",
    ],
    donts: [
      "不要自造第五级或“半管理员”这类模糊级别。",
      "不要只靠颜色区分四级，图标与文字必须同时在场。",
      "不要用隐藏按钮代替权限判断：禁用并说明，服务端再校验。",
    ],
    related: ["badge", "tag", "project-selector", "table", "button"],
  },
  {
    id: "audit-timeline",
    name: "AuditTimeline",
    chineseName: "审计时间线",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "按时间顺序记录谁在何时对什么做了什么，让每一次变更可追溯、可问责。",
    usage:
      "用于项目审计、任务历史与数据版本变更记录。审计记录只增不改；需要展示未来计划或流程进度时用 ExperimentStep 或 Steps。",
    keywords: ["audit", "timeline", "审计", "时间线", "追溯", "变更记录"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "每条记录包含操作者、动作、对象与绝对时间，新事件排在最前。",
        code: `<AuditTimeline
  events={[
    { id: "evt-03", actor: "李示例", action: "提交了计算任务", target: "run-28003", at: "2026-09-21 10:24" },
    { id: "evt-02", actor: "张示例", action: "更新了数据集", target: "ds-118 · v3", at: "2026-09-21 09:58" },
    { id: "evt-01", actor: "张示例", action: "创建了项目", target: "project-042", at: "2026-09-20 16:02" },
  ]}
/>`,
        preview: "audit-timeline/basic",
      },
      {
        id: "incident",
        title: "高危与失败事件",
        kind: "variant",
        description: "权限变更、删除与执行失败标级别：critical 红色、warning 琥珀色，可展开查看详情。",
        code: `<AuditTimeline
  events={[
    { id: "evt-09", actor: "系统", action: "任务执行失败", target: "run-28003", at: "2026-09-21 10:31", level: "critical", detail: "计算资源超时（exit 124）" },
    { id: "evt-08", actor: "张示例", action: "修改了成员权限", target: "王示例 → 可执行", at: "2026-09-21 09:12", level: "warning" },
  ]}
/>`,
        preview: "audit-timeline/incident",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情的审计记录：支持按级别过滤，只看关键事件。",
        code: `<AuditTimeline
  events={runEvents}
  filter={filter}
  onFilterChange={setFilter}
  onLoadMore={loadMore}
/>`,
        fullCode: `const runEvents = [
  { id: "evt-12", actor: "李示例", action: "确认执行", target: "run-28003", at: "2026-09-21 10:24", level: "warning" },
  { id: "evt-11", actor: "Agent", action: "推荐执行计划", target: "重新计算电导率", at: "2026-09-21 10:23" },
  { id: "evt-10", actor: "系统", action: "任务创建", target: "run-28003", at: "2026-09-21 10:24" },
]; // synthetic：Agent 也是审计主体，与真人操作同样留痕`,
        preview: "audit-timeline/business",
      },
    ],
    props: [
      { name: "events", type: "AuditEvent[]", required: true, description: "事件数组：id、actor、action、target、at、可选 level（info / warning / critical）与 detail。" },
      { name: "filter", type: '"all" | "critical"', default: '"all"', description: "按级别过滤；critical 只展示 warning 与 critical 事件。" },
      { name: "onFilterChange", type: "(filter: string) => void", description: "过滤回调，过滤条件体现在 URL 或可分享状态中。" },
      { name: "onLoadMore", type: "() => void", description: "加载更早记录的回调；加载中显示骨架行。" },
    ],
    states: [
      { name: "default", note: "节点圆点 + 内容行：操作者与动作一行，对象与时间一行；新事件在前。" },
      { name: "hover", note: "行 hover 显示完整时间戳（精确到秒）与事件 ID。" },
      { name: "focus-visible", note: "可展开的行键盘可达，焦点环清晰。" },
      { name: "pressed", note: "不适用：时间线无按压态，展开以 chevron 变化表达。", applicable: false },
      { name: "disabled", note: "不适用：审计记录只读，不存在禁用。", applicable: false },
      { name: "loading", note: "加载更多时底部显示骨架行；首屏加载用整块 Skeleton。" },
      { name: "empty", note: "无记录时显示“暂无审计记录”占位，说明记录从何时开始产生。" },
      { name: "error", note: "加载失败显示错误与重试，已加载的记录保留不清空。" },
      { name: "permission-limited", note: "无审计权限时显示锁态与申请入口，不泄露任何条目内容。" },
      { name: "mobile", note: "时间戳折行展示；级别徽章不省略。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，critical 红与 warning 琥珀保持可读。" },
    ],
    interaction: [
      "新事件追加位置按场景固定（审计类新事件在最前），不随刷新重排。",
      "关键事件可展开查看详情：参数差异、失败原因、事件 ID。",
      "支持按级别过滤，过滤后仍保持时间顺序。",
      "点击对象（run-28003）跳转到对应资源详情。",
    ],
    keyboard: [
      "可展开行 Tab 可达，Enter 展开或收起详情。",
      "过滤控件遵循各自组件的键盘规则。",
    ],
    accessibility: [
      "使用列表语义；时间使用 <time> 元素并带 datetime 属性。",
      "级别用图标加文字表达，不单独依赖颜色。",
      "展开按钮带 aria-expanded 与“查看事件详情”标签。",
    ],
    responsive: [
      "窄屏时间戳折行，操作者、动作、对象保持一行可读。",
      "级别徽章在窄屏保持完整，不退化为纯色点。",
    ],
    content: [
      "句式统一：谁 对 什么 做了 什么（张示例 更新了 ds-118 · v3）。",
      "时间精确到分钟，hover 显示秒；相对时间只作辅助。",
      "操作者用显示名；系统与 Agent 动作同样留痕并标明主体。",
    ],
    dos: [
      "记录只增不改，前端不提供编辑与删除。",
      "关键操作（执行、删除、权限变更）标级别。",
      "时间戳使用绝对时间，精确到分钟。",
    ],
    donts: [
      "不要允许前端修改或隐藏审计记录。",
      "不要只用“3 小时前”这类相对时间替代绝对时间。",
      "不要省略操作者：无主体的记录无法问责。",
    ],
    related: ["timeline", "badge", "permission-scope", "run-status", "table"],
  },
  {
    id: "experiment-step",
    name: "ExperimentStep",
    chineseName: "实验步骤",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "把一次实验表达为有序的业务节点流：配置、排队、运行、分析、完成，并标记当前节点与失败节点。",
    usage:
      "用于实验详情与优化轮次进度。节点是业务语义步骤（不是 UI 分步表单）；表单分步填写用 Steps。任务粒度的状态用 RunStatus。",
    keywords: ["experiment", "step", "实验", "步骤", "节点", "流程"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "五个业务节点按固定顺序排列，当前节点视觉最强。",
        code: `<ExperimentStep
  current="run"
  steps={[
    { id: "config", name: "参数配置", status: "done" },
    { id: "queue", name: "排队等待", status: "done" },
    { id: "run", name: "计算运行", status: "active" },
    { id: "analyze", name: "结果分析", status: "pending" },
    { id: "archive", name: "归档完成", status: "pending" },
  ]}
/>`,
        preview: "experiment-step/basic",
      },
      {
        id: "failed",
        title: "失败节点",
        kind: "state",
        description: "失败节点标红并给出原因与原地重试入口，重试不影响已完成节点的产物。",
        code: `<ExperimentStep
  current="run"
  steps={[
    { id: "config", name: "参数配置", status: "done" },
    { id: "queue", name: "排队等待", status: "done" },
    { id: "run", name: "计算运行", status: "failed", detail: "计算资源超时（exit 124）" },
    { id: "analyze", name: "结果分析", status: "pending" },
    { id: "archive", name: "归档完成", status: "pending" },
  ]}
  onRetry={(stepId) => retryStep(stepId)}
/>`,
        preview: "experiment-step/failed",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "第 3 轮电导率优化的节点流：节点产物可点击查看，进度实时更新。",
        code: `<ExperimentStep
  title="第 3 轮优化"
  current={round.current}
  steps={round.steps}
  onOpenArtifact={(stepId) => openArtifact(round.id, stepId)}
/>`,
        fullCode: `const round = {
  id: "round-03",
  current: "analyze",
  steps: [
    { id: "config", name: "配方生成", status: "done", detail: "8 个候选" },
    { id: "validate", name: "数据校验", status: "done", detail: "128 条通过" },
    { id: "compute", name: "电导率计算", status: "done", detail: "run-28003 · 214s" },
    { id: "analyze", name: "结果分析", status: "active" },
    { id: "report", name: "报告归档", status: "pending" },
  ],
}; // synthetic`,
        preview: "experiment-step/business",
      },
    ],
    props: [
      { name: "steps", type: "ExperimentNode[]", required: true, description: "节点数组：id、name、status（done / active / failed / pending）、可选 detail。" },
      { name: "current", type: "string", required: true, description: "当前节点 ID；同一时刻只有一个 active 节点。" },
      { name: "title", type: "string", description: "流程标题，通常是轮次或实验名称（第 3 轮优化）。" },
      { name: "onRetry", type: "(stepId: string) => void", description: "失败节点的原地重试回调。" },
      { name: "onOpenArtifact", type: "(stepId: string) => void", description: "点击已完成节点查看该节点的产物（日志、结果、报告）。" },
    ],
    states: [
      { name: "default", note: "节点按固定顺序横向排列：完成绿色对勾、当前蓝色 spinner、待执行灰色。" },
      { name: "hover", note: "节点 hover 显示详情：开始时间、耗时与产物入口。" },
      { name: "focus-visible", note: "节点可聚焦，焦点环与 Steps 一致。" },
      { name: "pressed", note: "不适用：节点无按压态；重试按钮遵循 Button 规则。", applicable: false },
      { name: "disabled", note: "不适用：节点是状态展示；失败节点的重试按钮各自管理禁用。", applicable: false },
      { name: "loading", note: "当前节点 spinner；整体加载用 Skeleton 保持节点数量与位置。" },
      { name: "empty", note: "不适用：实验必有节点定义；定义缺失属配置错误，按 error 处理。", applicable: false },
      { name: "error", note: "失败节点标红，给出原因一行与原地重试入口；后续节点保持待执行。" },
      { name: "permission-limited", note: "无权限查看的节点产物显示锁态占位，节点状态本身仍可见。" },
      { name: "mobile", note: "横向可滚动，当前节点自动滚入视野；也可切换为纵向排列。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，节点配色与 RunStatus 六态保持一致。" },
    ],
    interaction: [
      "点击已完成节点查看产物（日志、结果、报告）。",
      "失败节点原地重试，重试不影响已完成节点的产物。",
      "节点状态实时更新，当前节点推进时平滑过渡，不重排节点。",
    ],
    keyboard: [
      "节点 Tab 可达，Enter 查看详情或产物。",
      "失败节点内重试按钮 Enter 触发。",
    ],
    accessibility: [
      "当前节点标记 aria-current=\"step\"。",
      "节点状态用图标加文字表达，不单独依赖颜色。",
      "节点流使用有序列表语义，读屏可读出“第 3 步，共 5 步”。",
    ],
    responsive: [
      "窄屏横向滚动并自动定位当前节点，或切换为纵向堆叠。",
      "节点名在窄屏保持完整，不截断为单字。",
    ],
    content: [
      "节点名用名词短语：参数配置、电导率计算、报告归档。",
      "失败原因一行说清（计算资源超时），细节进节点详情。",
      "节点顺序固定，同一类实验的节点定义保持一致。",
    ],
    dos: [
      "节点顺序固定，当前节点视觉最强。",
      "失败给原因与原地重试。",
      "节点 detail 写产物摘要（8 个候选、214s）。",
    ],
    donts: [
      "不要重排或增删节点制造“进度假象”。",
      "不要把失败节点静默置灰，必须标红并给出口。",
      "不要超过 7 个节点：超出应聚合为阶段，细节进节点详情。",
    ],
    related: ["steps", "run-status", "progress", "agent-activity"],
  },
  {
    id: "data-quality-notice",
    name: "DataQualityNotice",
    chineseName: "数据质量提示",
    category: "datacore",
    status: "experimental",
    version: "0.1.0",
    purpose: "在数据进入计算前暴露质量问题：缺失、冲突、来源不可靠、待人工确认，并给出每条问题的处理路径。",
    usage:
      "用于数据导入报告、数据集详情与计算前检查。问题分提醒与阻断两级：阻断级未处理前不允许提交计算；纯粹的统计概览用 Statistic，单条全局提示用 Alert。",
    keywords: ["data", "quality", "数据质量", "缺失", "冲突", "待确认", "导入"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "四类问题各有固定图标与语义：缺失、冲突、来源不可靠、待人工确认。",
        code: `<DataQualityNotice
  issues={[
    { id: "q1", type: "missing", level: "warning", description: "12 条记录缺少温度字段", affected: "batch-07" },
    { id: "q2", type: "conflict", level: "blocking", description: "3 条记录与 v2 版本电导率冲突", affected: "batch-07" },
    { id: "q3", type: "unreliable-source", level: "warning", description: "外部来源 example.com 近 90 天未更新", affected: "src-055" },
    { id: "q4", type: "needs-review", level: "warning", description: "8 条 Agent 生成记录待人工确认", affected: "batch-07" },
  ]}
/>`,
        preview: "data-quality-notice/basic",
      },
      {
        id: "actionable",
        title: "阻断级问题",
        kind: "state",
        description: "存在阻断级问题时，相关提交动作禁用并在按钮旁重复提示；每条问题给出处理动作。",
        code: `<DataQualityNotice
  issues={blockingIssues}
  onResolve={(id, action) => resolveIssue(id, action)}
/>
<Button variant="primary" disabled>
  提交计算
</Button>
<span>存在 1 条阻断级问题，处理后才能提交</span>`,
        preview: "data-quality-notice/actionable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集导入后的质量报告：先汇总再逐条列出，处理后即时更新阻断状态。",
        code: `<DataQualityNotice
  title="ds-118 · batch-07 导入检查"
  summary="共 128 条记录 · 发现 3 个问题（1 条阻断）"
  issues={importIssues}
  onResolve={resolveIssue}
  onDownloadReport={downloadReport}
/>`,
        fullCode: `const importIssues = [
  { id: "q1", type: "conflict", level: "blocking", description: "3 条记录与 v2 版本电导率冲突", affected: "batch-07" },
  { id: "q2", type: "missing", level: "warning", description: "12 条记录缺少温度字段", affected: "batch-07" },
  { id: "q3", type: "needs-review", level: "warning", description: "8 条 Agent 生成记录待人工确认", affected: "batch-07" },
]; // synthetic`,
        preview: "data-quality-notice/business",
      },
    ],
    props: [
      { name: "issues", type: "QualityIssue[]", required: true, description: "问题数组：id、type（missing / conflict / unreliable-source / needs-review）、level（warning / blocking）、description、affected。" },
      { name: "summary", type: "string", description: "汇总行：记录总数、问题数与阻断数。" },
      { name: "title", type: "string", description: "报告标题，通常是数据集与批次（ds-118 · batch-07 导入检查）。" },
      { name: "onResolve", type: "(issueId: string, action: string) => void", description: "处理动作回调：去补充、查看冲突、标记已确认等。" },
      { name: "onDownloadReport", type: "() => void", description: "导出完整质量报告（CSV）的回调。" },
    ],
    states: [
      { name: "default", note: "汇总行在前，问题逐条列出：图标 + 类型徽章 + 描述 + 影响范围 + 处理动作。" },
      { name: "hover", note: "问题行 hover 高亮；处理动作按钮遵循 Button 规则。" },
      { name: "focus-visible", note: "每条问题的处理动作键盘可达。" },
      { name: "pressed", note: "不适用：提示行无按压态，动作按钮遵循 Button 规则。", applicable: false },
      { name: "disabled", note: "不适用：提示本身不禁用；阻断联动的是提交按钮的禁用。", applicable: false },
      { name: "loading", note: "检测中显示骨架行与“正在检查数据质量”，不做无反馈等待。" },
      { name: "empty", note: "无问题时显示成功态“质量检查通过”，而不是空白消失。" },
      { name: "error", note: "检查失败显示“质量检查未完成”与重试，不允许按“无问题”放行。" },
      { name: "permission-limited", note: "处理动作需要编辑权限；无权限时问题只读，展示申请入口。" },
      { name: "mobile", note: "问题行纵向堆叠，处理动作换行全宽。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，warning 与 blocking 配色保持区分度。" },
      { name: "resolved", note: "已处理问题收起为“已解决 N 条”，可展开追溯，不直接删除记录。" },
    ],
    interaction: [
      "每条问题给出处理动作：去补充、查看冲突、标记已确认。",
      "处理后即时更新汇总与阻断状态，联动提交按钮启停。",
      "阻断级问题在提交按钮旁重复提示，不只出现在报告里。",
      "处理记录留痕：谁、何时、以什么动作处理了哪条问题。",
    ],
    keyboard: [
      "处理动作按钮 Tab 可达，Enter 触发。",
      "已解决区域可聚焦展开，Enter 展开或收起。",
    ],
    accessibility: [
      "级别用图标加文字表达（提醒 / 阻断），不单独依赖颜色。",
      "提交按钮的 disabled 原因通过 aria-describedby 关联阻断提示。",
      "问题列表使用列表语义，读屏可逐条朗读。",
    ],
    responsive: [
      "窄屏问题行纵向堆叠，描述不截断。",
      "汇总行在窄屏允许折行，阻断数始终可见。",
    ],
    content: [
      "问题描述写清哪一批次、什么问题、影响什么：12 条记录缺少温度字段。",
      "动作文案固定：去补充 / 查看冲突 / 标记已确认 / 忽略本次。",
      "级别文案固定：提醒（可继续）、阻断（需处理）。",
    ],
    dos: [
      "区分提醒与阻断两级，阻断必须联动提交动作。",
      "每条问题给出处理路径，不做无动作提示。",
      "处理后保留记录，可追溯到“已解决”。",
    ],
    donts: [
      "不要只提示不给动作，让用户自己猜下一步。",
      "不要把阻断级降级为黄色提醒以便放行。",
      "不要在提交后才暴露质量问题：检查必须在计算前。",
    ],
    related: ["alert", "badge", "dataset-picker", "button", "citation"],
  },
  {
    id: "tool-run-card",
    name: "ToolRunCard",
    chineseName: "工具运行卡片",
    category: "datacore",
    status: "beta",
    version: "0.1.0",
    purpose: "展示一次工具调用的完整留痕：工具名、参数摘要、输入输出、耗时与结果状态。",
    usage:
      "用于 Agent 活动流、任务日志与调试面板。工具调用必须留痕可查；只展示最终答案不需要 ToolRunCard，过程性步骤用 AgentActivity。",
    keywords: ["tool", "run", "card", "工具", "调用", "耗时", "参数"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "完成态卡片：工具名 mono、状态徽章、耗时、单行参数摘要与输入输出摘要。",
        code: `<ToolRunCard
  tool="conductivity-optimize"
  status="succeeded"
  duration={1240}
  paramsSummary="round=3 · target=9.0 mS/cm · budget=300s"
  input="ds-118 · v3 · 128 条"
  output="8 个候选配方 · 最优 8.7 mS/cm"
/>`,
        preview: "tool-run-card/basic",
      },
      {
        id: "states",
        title: "运行中与失败",
        kind: "state",
        description: "运行中显示 spinner 与实时耗时；失败给出错误摘要与重试入口，失败调用不隐藏。",
        code: `<ToolRunCard
  tool="conductivity-optimize"
  status="running"
  paramsSummary="round=4 · target=9.2 mS/cm"
/>
<ToolRunCard
  tool="fetch-external-data"
  status="failed"
  duration={10000}
  error="连接 example.com 超时（10s）"
  onRetry={retryTool}
/>`,
        preview: "tool-run-card/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复中的工具调用留痕：默认折叠参数，点击展开查看完整参数与输出。",
        code: `<ToolRunCard
  tool="conductivity-optimize"
  status="succeeded"
  duration={214000}
  paramsSummary="round=3 · target=9.0 mS/cm · budget=300s"
  input="ds-118 · v3 · 128 条"
  output="8 个候选配方 · 最优 8.7 mS/cm"
  params={{ round: 3, target: 9.0, budget: 300, dataset: "ds-118" }}
  collapsible
/>`,
        fullCode: `// 展开区使用 CodeBlock / JsonViewer 渲染完整参数与输出，
// 默认折叠避免干扰阅读；展开状态不跨卡片同步。`,
        preview: "tool-run-card/business",
      },
    ],
    props: [
      { name: "tool", type: "string", required: true, description: "工具名，mono 字体展示，与注册表中的名称一致。" },
      { name: "status", type: '"running" | "succeeded" | "failed"', required: true, description: "调用状态，映射固定图标与徽章配色。" },
      { name: "paramsSummary", type: "string", required: true, description: "单行参数摘要，只放关键参数，完整参数进展开区。" },
      { name: "duration", type: "number", description: "耗时（毫秒）；运行中为实时计时，完成后定格。" },
      { name: "input", type: "string", description: "输入摘要：数据集、批次与记录数。" },
      { name: "output", type: "string", description: "输出摘要：产物与关键结果。" },
      { name: "error", type: "string", description: "失败时的错误摘要，一行说清原因。" },
      { name: "collapsible", type: "boolean", default: "true", description: "完整参数与输出默认折叠，点击展开。" },
      { name: "onRetry", type: "() => void", description: "失败时的重试回调。" },
    ],
    states: [
      { name: "default", note: "头部一行：工具图标 + mono 工具名 + 状态徽章 + 耗时；下方输入输出摘要。" },
      { name: "hover", note: "卡片 hover 边框加深；展开按钮 hover 遵循 ghost 按钮规则。" },
      { name: "focus-visible", note: "展开与重试按钮键盘可达，带 aria-expanded。" },
      { name: "pressed", note: "不适用：卡片无按压态，内部按钮遵循 Button 规则。", applicable: false },
      { name: "disabled", note: "不适用：调用记录是事实展示，不可禁用。", applicable: false },
      { name: "loading", note: "running 状态：spinner + 实时耗时；其余区域保持布局稳定不跳动。" },
      { name: "empty", note: "不适用：无输出的调用展示“无返回内容”，不渲染空卡片。", applicable: false },
      { name: "error", note: "failed 状态：错误摘要一行 + 重试入口；完整堆栈进展开区。" },
      { name: "permission-limited", note: "无权限查看输出时输出区显示锁态占位与申请入口，参数摘要仍可见。" },
      { name: "mobile", note: "头部允许折行，工具名与耗时保持同行；参数摘要截断。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，mono 区域使用 surface-soft 底色。" },
    ],
    interaction: [
      "完整参数与输出默认折叠，点击展开；展开状态不跨卡片同步。",
      "运行中实时刷新耗时，完成后定格最终值。",
      "失败给错误摘要与重试入口；重试生成新的调用卡片，不覆盖旧记录。",
      "点击输入 / 输出摘要跳转到对应数据集或产物。",
    ],
    keyboard: [
      "展开按钮 Enter / Space 切换，带 aria-expanded。",
      "重试按钮 Tab 可达，Enter 触发。",
    ],
    accessibility: [
      "状态用图标加文字表达（运行中 / 已完成 / 已失败），不单独依赖颜色。",
      "运行中状态变化通过 aria-live=\"polite\" 克制播报（完成与失败各一次）。",
      "mono 区域保持可读字号，不低于 11px。",
    ],
    responsive: [
      "窄屏头部折行为两行：工具名一行，状态与耗时一行。",
      "参数摘要单行截断，完整内容进展开区换行展示。",
    ],
    content: [
      "工具名与注册表一致，mono 字体，不改写为自然语言。",
      "耗时格式化：300ms、1.2s、3m34s，保留一位有效小数。",
      "参数摘要只放关键参数（round、target、budget），完整参数进展开区。",
    ],
    dos: [
      "每次工具调用都留痕，包括失败与被取消的调用。",
      "耗时与状态同时展示，便于发现异常耗时。",
      "失败给一行错误摘要，细节进展开区。",
    ],
    donts: [
      "不要默认展开全部输出：长输出淹没答复正文。",
      "不要隐藏失败调用，失败是调试的关键信息。",
      "不要在卡片内再嵌套卡片，层级最多两层。",
    ],
    related: ["agent-activity", "run-status", "code-block", "json-viewer", "collapse"],
  },
];
