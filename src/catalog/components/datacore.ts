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
        description: "角标出现在句末，来源清单位于内容底部，序号与角标一一对应；hover 角标展示来源标题。",
        code: `import { Citation, SourceList } from "@/components/ui/citation";

<p>
  第 3 轮优化后电导率达到 8.7 mS/cm
  <Citation citationId="src-041" index={1} title="ds-118 · 第 3 轮实验结果" />。
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
        description: "点击角标平滑滚动到对应来源并高亮约 2 秒（useCitationLocator 管理），点击其他角标时取消前一个高亮，Esc 取消高亮。",
        code: `import { Citation, SourceList, useCitationLocator } from "@/components/ui/citation";

const { locatedId, locate } = useCitationLocator();

<Citation citationId="src-043" index={2} title="run-28003 · 优化策略摘要" onLocate={locate} />
<SourceList sources={sources} highlightId={locatedId} onLocateCitation={locate} />`,
        fullCode: `import { Citation, SourceList, useCitationLocator } from "@/components/ui/citation";

const sources = [
  { id: "src-041", index: 1, title: "ds-118 · 第 3 轮实验结果" },
  { id: "src-043", index: 2, title: "run-28003 · 优化策略摘要" },
]; // synthetic

export function AnswerWithCitations() {
  const { locatedId, locate } = useCitationLocator(); // 默认 2000ms 后消退
  return (
    <>
      <p>
        基于第 3 轮实验结果
        <Citation citationId="src-041" index={1} title={sources[0].title} onLocate={locate} />
        ，建议将 LiFSI 浓度提高至 1.6 mol/kg
        <Citation citationId="src-043" index={2} title={sources[1].title} onLocate={locate} />。
      </p>
      <SourceList sources={sources} highlightId={locatedId} onLocateCitation={locate} />
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
        code: `import { Citation, SourceList } from "@/components/ui/citation";

<Citation citationId="src-055" index={3} title="外部文献（example.com）" status="unavailable" />
<SourceList
  sources={[
    { id: "src-055", index: 3, title: "外部文献（example.com）", status: "unavailable", reason: "已下线" },
    { id: "src-056", index: 4, title: "共享溶剂参数库", status: "restricted", reason: "需申请权限" },
  ]}
/>`,
        preview: "citation/unavailable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复中的多来源引用：每条关键结论紧跟角标，答复底部给出完整来源清单，点击标题打开来源。",
        code: `import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Citation, SourceList, useCitationLocator } from "@/components/ui/citation";

const { locatedId, locate } = useCitationLocator();

<Card className="grid gap-3 p-4">
  <div className="flex items-center gap-2">
    <Sparkles className="size-4 text-agent" />
    <strong>Agent 答复</strong>
    <Badge tone="agent" dot>已生成</Badge>
  </div>
  <p>
    基于 ds-118 第 3 轮结果
    <Citation citationId="src-041" index={1} title="ds-118 · 第 3 轮实验结果" onLocate={locate} />
    ，建议将 LiFSI 浓度提高至 1.6 mol/kg
    <Citation citationId="src-043" index={2} title="run-28003 · 优化策略摘要" onLocate={locate} />。
  </p>
  <SourceList
    sources={answerSources}
    highlightId={locatedId}
    onLocateCitation={locate}
    onOpenSource={(source) => openSource(source.id)}
  />
</Card>`,
        fullCode: `const answerSources = [
  { id: "src-041", index: 1, title: "ds-118 · 第 3 轮实验结果" },
  { id: "src-043", index: 2, title: "run-28003 · 优化策略摘要" },
]; // synthetic
// citationId 由后端在生成答复时分配，跨会话稳定，前端不自行编号。`,
        preview: "citation/business",
      },
    ],
    props: [
      { name: "citationId", type: "string", required: true, description: "Citation：来源的稳定 ID，由后端分配，跨会话不变，用于角标与清单联动。" },
      { name: "index", type: "number", required: true, description: "Citation：在当前内容中的序号，从 1 开始按出现顺序连续编号。" },
      { name: "title", type: "string", description: "Citation：来源标题，用于 hover 摘要浮层与读屏标签“来源 {index}：{标题}”。" },
      { name: "status", type: '"available" | "restricted" | "unavailable"', default: '"available"', description: "Citation / SourceList 项：失效或无权限时角标置灰但保留序号，仍可定位；清单项展示原因徽章。" },
      { name: "onLocate", type: "(citationId: string) => void", description: "Citation：点击角标触发；未提供时默认滚动到 id 为 dc-source-{citationId} 的清单项。" },
      { name: "sources", type: "SourceListItem[]", required: true, description: "SourceList：来源项 id、index、title、可选 status 与 reason（已下线 / 需申请权限）。" },
      { name: "highlightId", type: "string | null", description: "SourceList：当前高亮的来源 ID，变化时滚动到该项并高亮，通过 aria-live 播报。" },
      { name: "onLocateCitation", type: "(sourceId: string) => void", description: "SourceList：点击序号反向定位到正文引用；未提供时序号不可点击。" },
      { name: "onOpenSource", type: "(source: SourceListItem) => void", description: "SourceList：点击标题打开来源；unavailable 来源不渲染为链接。" },
      { name: "useCitationLocator(duration?)", type: "{ locatedId, locate, clear }", default: "2000", description: "定位状态 hook：locate(id) 设置高亮并在 duration 毫秒后自动消退，Esc 取消。" },
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
      { name: "located", note: "被定位的来源项显示品牌色描边与浅底约 2 秒后消退（useCitationLocator），同一时间只有一个高亮项。" },
    ],
    interaction: [
      "点击角标平滑滚动到来源项并高亮；点击其他角标时取消前一个高亮。",
      "点击来源项的序号可反向定位到第一个引用位置。",
      "序号按出现顺序自动编号；增删引用后 citationId 保持稳定，序号可重排。",
      "传入 title 时 hover / 聚焦角标展示来源摘要浮层；触屏设备点按直接定位。",
    ],
    keyboard: [
      "Tab 依序聚焦各角标，顺序与文档阅读顺序一致。",
      "Enter 触发定位与高亮，等价于点击。",
      "高亮状态下按 Esc 取消高亮（useCitationLocator 内置）。",
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
    status: "stable",
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
        description: "标题、发布方、更新时间与可访问状态的固定信息层级；整卡是一个按钮。",
        code: `import { SourceCard } from "@/components/ui/source-card";

<SourceCard
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
        description: "可访问 / 需申请 / 已失效三态：状态决定点击卡片触发的回调（打开 / 申请权限 / 查看说明），失效来源不提供假链接。",
        code: `import { SourceCard } from "@/components/ui/source-card";

<SourceCard source={{ ...base, accessibility: "available" }} onOpen={openSource} />
<SourceCard
  source={{ ...base, accessibility: "restricted", reason: "需项目管理员审批" }}
  onRequestAccess={requestAccess}
/>
<SourceCard
  source={{ ...base, accessibility: "unavailable", reason: "已下线" }}
  onViewReason={showReason}
/>`,
        preview: "source-card/access",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复底部的来源卡组：与正文角标共用同一组 citationId。",
        code: `import { SourceCard } from "@/components/ui/source-card";

<div className="grid gap-3 sm:grid-cols-2">
  {answer.sources.map((source) => (
    <SourceCard key={source.id} source={source} onOpen={openSource} />
  ))}
</div>
<p className="text-sm text-muted-foreground">本答复共引用 {answer.sources.length} 条来源</p>`,
        fullCode: `import { SourceCard, SourceCardSkeleton } from "@/components/ui/source-card";

// 元数据加载中用同尺寸骨架占位，避免加载后跳动
{loading ? <SourceCardSkeleton /> : <SourceCard source={source} onOpen={openSource} />}`,
        preview: "source-card/business",
      },
    ],
    props: [
      { name: "source", type: "SourceInfo", required: true, description: "来源对象：id、title、publisher、updatedAt、accessibility（available / restricted / unavailable）、可选 reason。" },
      { name: "onOpen", type: "(id: string) => void", description: "accessibility 为 available 时点击卡片的回调：打开来源。" },
      { name: "onRequestAccess", type: "(id: string) => void", description: "restricted 时点击卡片的回调：进入权限申请流程。" },
      { name: "onViewReason", type: "(id: string) => void", description: "unavailable 时点击卡片的回调：查看失效说明，不打开原文。" },
      { name: "compact", type: "boolean", default: "false", description: "紧凑模式省略发布方与更新时间，用于窄栏与侧栏。" },
      { name: "highlighted", type: "boolean", default: "false", description: "被 Citation 定位时展示高亮描边；消退时机由调用方控制（如 useCitationLocator）。" },
      { name: "className", type: "string", description: "透传到卡片根元素 <button>。" },
      { name: "SourceCardSkeleton", type: "{ compact?: boolean }", description: "元数据加载中的同尺寸骨架组件。" },
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
    status: "stable",
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
        description: "步骤列表展示已完成、进行中与待执行；进行中步骤带 spinner 与工具调用摘要。",
        code: `import { AgentActivity } from "@/components/ui/agent-activity";

<AgentActivity
  steps={[
    { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条记录" },
    { id: "s2", title: "调用优化工具", status: "active" },
    { id: "s3", title: "生成推荐配方", status: "pending", detail: "等待上一步完成" },
  ]}
  currentTool={{ name: "conductivity-optimize", summary: "round=3 · budget=300s" }}
/>`,
        preview: "agent-activity/basic",
      },
      {
        id: "waiting",
        title: "等待用户确认",
        kind: "state",
        description: "遇到产生副作用的动作时流程暂停，当前步骤为 waiting，下方出现紫色等待卡片与确认入口；确认前不自动推进。",
        code: `import { AgentActivity } from "@/components/ui/agent-activity";

<AgentActivity
  title="电导率优化 Agent"
  steps={[
    { id: "s1", title: "生成执行计划", status: "done", detail: "目标：重新计算电导率 · ds-118 · v3" },
    { id: "s2", title: "提交计算任务 run-28003", status: "waiting", detail: "已等待 42 秒" },
  ]}
  waitingFor="user-confirmation"
  waitingMessage="项目：示例项目（project-042）· 预计最长 300 秒。确认前流程不会推进。"
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
        code: `import { AgentActivity } from "@/components/ui/agent-activity";

<AgentActivity
  steps={[
    { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条记录" },
    { id: "s2", title: "调用外部数据库", status: "failed", detail: "连接超时（10s）" },
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
        description: "电导率优化 Agent 的完整活动流：标题旁给出整体状态，历史步骤可追溯，当前工具调用有参数摘要。",
        code: `import { AgentActivity } from "@/components/ui/agent-activity";

<AgentActivity
  title="电导率优化 Agent"
  steps={optimizeSteps}
  currentTool={{ name: "conductivity-optimize", summary: "round=3 · target=9.0 mS/cm" }}
/>`,
        fullCode: `import { AgentActivity, type AgentStep } from "@/components/ui/agent-activity";

const optimizeSteps: AgentStep[] = [
  { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条 · 耗时 3s" },
  { id: "s2", title: "基线模型评估", status: "done", detail: "RMSE 0.31 · 耗时 42s" },
  { id: "s3", title: "调用优化工具", status: "active", detail: "已运行 36s" },
  { id: "s4", title: "生成推荐配方", status: "pending" },
  { id: "s5", title: "写入实验记录", status: "pending" },
]; // synthetic：流式更新只追加步骤、不重排历史步骤

<AgentActivity
  title="电导率优化 Agent"
  steps={optimizeSteps}
  currentTool={{ name: "conductivity-optimize", summary: "round=3 · target=9.0 mS/cm" }}
/>`,
        preview: "agent-activity/business",
      },
    ],
    props: [
      { name: "steps", type: "AgentStep[]", required: true, description: "步骤数组：id、title、status（done / active / waiting / failed / pending）、可选 detail。" },
      { name: "title", type: "string", description: "活动流标题，通常是 Agent 名称；提供时旁边显示整体状态徽章（运行中 / 等待确认 / 已暂停）。" },
      { name: "currentTool", type: "{ name: string; summary?: string }", description: "正在调用的工具名与单行参数摘要，mono 字体显示在 active 步骤下方。" },
      { name: "waitingFor", type: '"user-confirmation" | "resource" | null', default: "null", description: "等待原因；非空时在步骤下方展示紫色等待卡片。" },
      { name: "waitingMessage", type: "ReactNode", description: "等待卡片说明：等谁、等什么、已等待多久。" },
      { name: "onConfirm", type: "() => void", description: "waitingFor 为 user-confirmation 时的确认按钮回调。" },
      { name: "onEdit", type: "() => void", description: "waitingFor 为 user-confirmation 时的“修改参数”回调。" },
      { name: "confirmText", type: "string", default: '"确认执行"', description: "确认按钮文案。" },
      { name: "onRetry", type: "(stepId: string) => void", description: "提供后失败步骤显示“单步重试”按钮。" },
      { name: "emptyText", type: "string", default: '"等待任务开始"', description: "steps 为空时的占位文案。" },
    ],
    states: [
      { name: "default", note: "步骤纵向排列；当前步骤 spinner + 紫色高亮，已完成步骤绿色对勾，待执行步骤灰色。" },
      { name: "hover", note: "步骤行无 hover 变化；耗时与工具参数直接写在 detail 与 currentTool 行内。" },
      { name: "focus-visible", note: "确认、重试等可交互元素遵循 Button 焦点环规则。" },
      { name: "pressed", note: "动作按钮按压反馈与 Button 一致。" },
      { name: "disabled", note: "不适用：活动流本身不禁用；内部动作按钮遵循各自的 disabled 规则。", applicable: false },
      { name: "loading", note: "当前步骤显示 spinner；整体加载用 Skeleton 保持高度，避免流式更新时跳动。" },
      { name: "empty", note: "尚无活动时显示“等待任务开始”占位（emptyText 可改），不渲染空白区域。" },
      { name: "error", note: "步骤失败标红，给出原因、单步重试与人工接管入口。" },
      { name: "permission-limited", note: "即将调用的工具超出用户权限时，用 waitingFor=\"resource\" 暂停，并在 waitingMessage 写明所需权限与申请入口。" },
      { name: "mobile", note: "步骤纵向排列，工具参数摘要单行截断；确认按钮全宽。" },
      { name: "dark-mode", note: "紫色语义令牌自动适配，深浅主题下都读得出 Agent 语义。" },
      { name: "waiting", note: "等待用户确认时当前步骤静止、整体切换为紫色等待卡片，并显示已等待时长。" },
    ],
    interaction: [
      "流式更新只追加新步骤，不重排历史步骤，避免打断阅读。",
      "等待确认时停止自动推进，确认或修改参数后才继续。",
      "失败步骤可单步重试，重试不影响已完成步骤的产物。",
      "每一步用 detail 写清产物摘要或耗时；单次工具调用的完整参数与输出交给 ToolRunCard。",
    ],
    keyboard: [
      "确认、重试按钮 Tab 可达，Enter 触发。",
      "步骤行是只读列表项（当前步骤带 aria-current=\"step\"），不进入 Tab 序列。",
    ],
    accessibility: [
      "当前步骤变化通过 aria-live=\"polite\" 播报，如“正在调用 conductivity-optimize”。",
      "spinner 必须伴随文字“进行中”，不做纯动画。",
      "Agent 语义不只靠紫色表达，配合 Sparkles 图标与文字。",
    ],
    responsive: [
      "窄屏下步骤保持纵向全宽，当前步骤始终完整可见；历史步骤过多时由调用方截取并提供“查看全部”。",
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
        code: `import { RunStatus } from "@/components/ui/run-status";

<RunStatus status="queued" />
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
        description: "状态旁给出原因或进度明细，并提供下一步动作：失败给重试，部分完成给查看明细。",
        code: `import { RunStatus } from "@/components/ui/run-status";

<RunStatus status="failed" detail="计算资源超时（exit 124）" onRetry={retry} />
<RunStatus status="partial" detail="12/15 完成，3 条待人工确认" onViewDetail={openDetail} />
<RunStatus status="queued" detail="队列第 2 位，预计 5 分钟" />`,
        preview: "run-status/detail",
      },
      {
        id: "flow",
        title: "状态流转",
        kind: "state",
        description: "状态沿生命周期单向流转：排队中 → 运行中 → 成功 / 失败 / 部分完成；失败后进入需重试，重试后回到排队中。",
        code: `import { RunStatus } from "@/components/ui/run-status";
import { Button } from "@/components/ui/button";

<RunStatus status={run.status} detail={run.detail} />
<Button variant="secondary" size="sm" onClick={advance}>模拟推进</Button>`,
        fullCode: `const transitions = {
  queued: "running",
  running: "succeeded", // 也可能进入 failed / partial
  failed: "retry-needed",
  "retry-needed": "queued",
}; // synthetic：真实流转由后端事件驱动，前端只订阅更新
// 刷新中可传 refreshing 保留旧值并降低透明度，不闪回骨架。`,
        preview: "run-status/flow",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表中的状态列：每行一个确定状态，失败行给出原因与重试入口。",
        code: `import { RunStatus } from "@/components/ui/run-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>任务</TableHead>
      <TableHead>项目</TableHead>
      <TableHead>状态</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {runs.map((run) => (
      <TableRow key={run.id}>
        <TableCell className="font-mono">{run.id}</TableCell>
        <TableCell>{run.project}</TableCell>
        <TableCell>
          <RunStatus
            status={run.status}
            detail={run.detail}
            onRetry={run.status === "failed" ? () => retry(run.id) : undefined}
          />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
        preview: "run-status/business",
      },
    ],
    props: [
      { name: "status", type: '"queued" | "running" | "succeeded" | "failed" | "partial" | "retry-needed" | null', required: true, description: "封闭六态集合，映射固定的图标、颜色与文案；缺失（null）时显示 neutral“状态未知”。" },
      { name: "detail", type: "ReactNode", description: "状态说明：失败原因、部分完成数量（12/15）或队列位置。" },
      { name: "label", type: "string", description: "覆盖默认文案；不改变颜色与图标语义。" },
      { name: "onRetry", type: "() => void", description: "failed 与 retry-needed 状态下展示“重试”动作。" },
      { name: "onViewDetail", type: "() => void", description: "partial 状态下展示“查看明细”入口。" },
      { name: "restricted", type: "boolean", default: "false", description: "无权限查看：显示锁图标“无权查看”，不暴露状态与说明。" },
      { name: "refreshing", type: "boolean", default: "false", description: "状态刷新中：保留旧值并降低透明度，设置 aria-busy。" },
      { name: "className", type: "string", description: "透传到根元素（role=\"status\"）。" },
    ],
    states: [
      { name: "default", note: "徽章形态：图标 + 短文案；六种状态各有固定配色与图标。" },
      { name: "hover", note: "徽章本身无 hover 变化；detail 直接行内展示、允许折行，不藏进浮层。" },
      { name: "focus-visible", note: "可交互状态行（重试、查看明细）内的按钮遵循 Button 焦点规则。" },
      { name: "pressed", note: "动作按钮按压反馈与 Button 一致，徽章本身无按压态。" },
      { name: "disabled", note: "不适用：状态是事实展示，不可禁用。", applicable: false },
      { name: "loading", note: "refreshing 时保留旧值并降低透明度，不闪烁回骨架；首次加载用 Skeleton。" },
      { name: "empty", note: "不适用：任务必有确定状态；状态数据缺失时显示 neutral“状态未知”，不猜测。", applicable: false },
      { name: "error", note: "状态流断连时用 detail 标注“状态可能延迟”，由调用方在旁边提供手动刷新。" },
      { name: "permission-limited", note: "restricted 时显示 neutral“无权查看”徽章加锁图标，不暴露状态细节。" },
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
      "徽章本身只读、不进入 Tab 序列；role=\"status\" 让读屏直接读出状态。",
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
        code: `import { ConfirmPanel } from "@/components/ui/confirm-panel";

<ConfirmPanel
  title="重新计算电导率"
  target="ds-118 · 第 3 轮推荐配方"
  scope="创建 1 个 CPU 计算任务"
  project={{ id: "project-042", name: "示例项目" }}
  budget="预计最长 300 秒"
  sideEffects={["占用项目算力额度", "写入一条审计日志"]}
  confirmText="确认使用 project-042 执行"
  onConfirm={submit}
  onCancel={close}
/>`,
        preview: "confirm-panel/basic",
      },
      {
        id: "danger",
        title: "高危动作",
        kind: "variant",
        description: "不可逆动作用 danger 语义：副作用区红底醒目列出并标“不可逆”，确认按钮使用 danger 变体并写清后果。",
        code: `import { ConfirmPanel } from "@/components/ui/confirm-panel";

<ConfirmPanel
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
        description: "onConfirm 返回 Promise 时面板自动进入 loading 并防重复提交；成功后通过 result 回传任务 ID 与状态入口。",
        code: `import { ConfirmPanel } from "@/components/ui/confirm-panel";
import { RunStatus } from "@/components/ui/run-status";
import { Button } from "@/components/ui/button";

<ConfirmPanel
  title="提交电导率优化计算"
  target="ds-118 · v3 · 128 条记录"
  scope="创建 1 个 GPU 计算任务"
  project={{ id: "project-042", name: "示例项目" }}
  budget="预计最长 300 秒"
  sideEffects={["占用项目算力额度", "写入审计日志", "结果写回 ds-118"]}
  confirmText="确认使用 project-042 执行"
  onConfirm={async () => {
    const run = await submitRun({ datasetId: "ds-118" }); // synthetic；reject 时面板显示错误并保留内容
    setCreated(run.id);
  }}
  onCancel={close}
  result={
    created && (
      <>
        任务 <span className="font-mono">{created}</span> 已创建
        <RunStatus status="queued" />
        <Button variant="link" size="sm" onClick={openRun}>查看任务</Button>
      </>
    )
  }
/>`,
        fullCode: `import { ConfirmPanel } from "@/components/ui/confirm-panel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// 需要模态时放进 Dialog：焦点陷阱与 Esc 由 Dialog 提供，面板打开时焦点落在“取消”
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="p-0">
    <ConfirmPanel autoFocusCancel className="border-0 shadow-none" {...panelProps} onCancel={() => setOpen(false)} />
  </DialogContent>
</Dialog>`,
        preview: "confirm-panel/business",
      },
    ],
    props: [
      { name: "title", type: "string", required: true, description: "动作名称，动词开头：重新计算电导率、撤销任务。" },
      { name: "target", type: "ReactNode", required: true, description: "作用对象：数据集、任务或资源，带稳定 ID。" },
      { name: "scope", type: "ReactNode", required: true, description: "影响范围：将创建或修改什么，数量化表达。" },
      { name: "project", type: "{ id: string; name: string }", required: true, description: "归属项目，展示名称与 ID，不允许“无项目”动作。" },
      { name: "budget", type: "ReactNode", description: "预算或预计消耗：时长、额度、次数，必须带单位。" },
      { name: "sideEffects", type: "string[]", required: true, description: "副作用清单，逐条列出；超过约 5 条时在区域内滚动，不折叠。" },
      { name: "danger", type: "boolean", default: "false", description: "不可逆动作启用 danger 语义：红色副作用区与 danger 确认按钮。" },
      { name: "confirmText / cancelText", type: "string", default: '"确认执行" / "取消"', description: "按钮文案；确认文案建议回显范围，如“确认使用 project-042 执行”。" },
      { name: "onConfirm", type: "() => void | Promise<unknown>", required: true, description: "确认回调；返回 Promise 时自动 loading 并防重复提交，reject 时以 Error.message 显示错误。" },
      { name: "onCancel", type: "() => void", required: true, description: "取消回调（含面板内按 Esc），不产生任何副作用。" },
      { name: "loading / error", type: "boolean / ReactNode", description: "外部控制的提交中状态与错误原因（错误显示在面板顶部，内容保留）。" },
      { name: "disabledReason", type: "ReactNode", description: "提供时禁用确认按钮并显示原因（正在核对执行信息 / 需要可执行权限），按钮 aria-describedby 关联。" },
      { name: "result", type: "ReactNode", description: "确认成功后的结果（任务 ID 与状态入口）；提供后替换动作区。" },
      { name: "autoFocusCancel", type: "boolean", default: "false", description: "挂载时焦点落在取消按钮，放进 Dialog 时使用。" },
    ],
    states: [
      { name: "default", note: "五要素依次排列：目标 → 范围 → 项目 → 预算 → 副作用，动作区右下。" },
      { name: "hover", note: "按钮 hover 遵循 Button 规则；信息区无 hover 变化。" },
      { name: "focus-visible", note: "放进 Dialog 时传 autoFocusCancel，焦点落在取消按钮（安全默认），Tab 由 Dialog 限制在面板内循环。" },
      { name: "pressed", note: "按钮按压反馈与 Button 一致。" },
      { name: "disabled", note: "要素未加载完整前传 disabledReason=\"正在核对执行信息\"，确认按钮禁用并显示原因。" },
      { name: "loading", note: "确认后进入 loading：按钮转圈、面板内容锁定，防止重复提交。" },
      { name: "empty", note: "不适用：要素缺失时阻止打开并在触发处提示，不渲染空面板。", applicable: false },
      { name: "error", note: "提交失败保留面板全部内容与输入，顶部给出错误原因与重试。" },
      { name: "permission-limited", note: "无执行权限时用 disabledReason 说明所需权限与申请入口，确认按钮禁用。" },
      { name: "mobile", note: "面板全宽，五要素纵向排列，确认按钮在前并全宽。" },
      { name: "dark-mode", note: "使用语义令牌自动适配；danger 区域在深色下保持可读。" },
      { name: "confirmed", note: "确认成功后通过 result 展示任务 ID 与状态入口（run-28003 · 排队中）与“查看任务”，替换动作区。" },
    ],
    interaction: [
      "确认前完整展示副作用，逐条列出，不折叠、不省略。",
      "确认按钮建议回显范围（确认使用 project-042 执行），让点击有上下文。",
      "执行后给出任务 ID 与状态入口，可追踪；业务允许时提供撤销。",
      "取消、关闭、Esc 都不产生任何副作用。",
    ],
    keyboard: [
      "在 Dialog 中使用 autoFocusCancel，打开后焦点落在取消按钮，避免打开即 Enter 误触发危险动作。",
      "模态场景的聚焦陷阱由 Dialog 提供；行内使用时 Tab 顺序为取消 → 确认。",
      "焦点在面板内时 Esc 调用 onCancel，等价于点击取消（loading 与已确认时不响应）。",
    ],
    accessibility: [
      "面板本身是 <section aria-labelledby={标题}>；需要模态时放进 Dialog，由 Dialog 提供 role=\"dialog\" 与 aria-modal。",
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
    status: "stable",
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
        description: "可搜索的下拉：选项同时展示项目名称、项目 ID、默认标记与权限徽章；默认项目排在最前。",
        code: `import { Label } from "@/components/ui/label";
import { ProjectSelector } from "@/components/ui/project-selector";

<Label htmlFor="project">归属项目</Label>
<ProjectSelector
  id="project"
  projects={[
    { id: "project-042", name: "示例项目 A", isDefault: true, permission: "admin" },
    { id: "project-107", name: "示例项目 B", permission: "executor" },
    { id: "project-209", name: "共享数据池", permission: "viewer" },
  ]}
  value={projectId}
  onChange={setProjectId}
/>`,
        preview: "project-selector/basic",
      },
      {
        id: "limited",
        title: "权限不足的项目",
        kind: "state",
        description: "达不到 requiredPermission 的项目不可选并标注权限缺口，而不是隐藏；提供 onRequestAccess 时显示“申请权限”。",
        code: `import { ProjectSelector } from "@/components/ui/project-selector";

<ProjectSelector
  projects={projects}
  value={projectId}
  onChange={setProjectId}
  requiredPermission="executor"
  onRequestAccess={(project) => requestAccess(project.id)}
/>`,
        preview: "project-selector/limited",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算前选择归属项目：选中后回显项目与权限，提交按钮跟随权限启停，缺口旁给出申请升级入口。",
        code: `import { Button } from "@/components/ui/button";
import { hasPermission, PermissionScope } from "@/components/ui/permission-scope";
import { ProjectSelector } from "@/components/ui/project-selector";

const current = projects.find((p) => p.id === projectId);
const canExecute = hasPermission(current?.permission, "executor");

<ProjectSelector projects={projects} value={projectId} onChange={setProjectId} onRequestAccess={requestAccess} />
<Button disabled={!canExecute}>提交计算任务</Button>
{current && (
  <PermissionScope scope={current.permission} required="executor" onRequestUpgrade={requestUpgrade} />
)}`,
        fullCode: `const projects = [
  { id: "project-042", name: "示例项目 A", isDefault: true, permission: "admin" },
  { id: "project-107", name: "示例项目 B", permission: "executor" },
  { id: "project-209", name: "共享数据池", permission: "viewer" },
] satisfies ProjectOption[]; // synthetic`,
        preview: "project-selector/business",
      },
    ],
    props: [
      { name: "projects", type: "ProjectOption[]", required: true, description: "项目选项：id、name、isDefault、permission（viewer / editor / executor / admin）。" },
      { name: "value", type: "string | null", description: "选中项目 ID；提交类动作建议默认选中默认项目。" },
      { name: "onChange", type: "(projectId: string, project: ProjectOption) => void", required: true, description: "选择回调，选中即关闭并在触发器回显项目名、ID 与权限。" },
      { name: "requiredPermission", type: '"viewer" | "editor" | "executor" | "admin"', default: '"viewer"', description: "动作所需最低权限；达不到的选项不可选并标注“需要{级别}权限”。" },
      { name: "onRequestAccess", type: "(project: ProjectOption) => void", description: "权限不足选项上的申请入口；键盘在该选项上按 Enter 也触发申请。" },
      { name: "placeholder", type: "string", default: '"选择归属项目"', description: "未选中时的触发器文案。" },
      { name: "loading", type: "boolean", default: "false", description: "加载中：触发器显示“正在加载项目…”并禁用。" },
      { name: "disabled / disabledReason", type: "boolean / ReactNode", description: "整体禁用（如加载失败），原因写在触发器下方。" },
      { name: "emptyAction", type: "{ label: string; onClick: () => void }", description: "无项目时下拉内的动作入口：创建项目 / 申请加入。" },
      { name: "id / aria-label", type: "string", description: "透传到触发器，便于与 <Label htmlFor> 关联。" },
    ],
    states: [
      { name: "default", note: "触发器回显选中项目名称 + ID + 权限徽章；下拉内默认项目置顶并标记。" },
      { name: "hover", note: "选项行 hover 高亮，禁用选项无 hover 反馈。" },
      { name: "focus-visible", note: "触发器与选项键盘可达，焦点环与 Select 一致。" },
      { name: "pressed", note: "不适用：选择器无按压态，选中以勾选与背景表达。", applicable: false },
      { name: "disabled", note: "项目加载失败或无任何项目时整体禁用，原因写在触发器旁。" },
      { name: "loading", note: "loading 时触发器显示“正在加载项目…”并禁用，下拉内为骨架行。" },
      { name: "empty", note: "无项目时显示空态与“创建项目 / 申请加入”入口，不渲染空下拉。" },
      { name: "error", note: "加载失败时传 disabled 与 disabledReason（含重试入口），保留上次成功的选中值。" },
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
      "触发器为 role=\"combobox\"，下拉由 Command 提供 listbox / option 语义，支持输入搜索名称或 ID。",
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
    status: "stable",
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
        description: "可搜索的下拉：选项展示数据集名称、ID、批次、版本、来源与记录数；单选即选即用，触发器回显摘要。",
        code: `import { DatasetPicker } from "@/components/ui/dataset-picker";

<DatasetPicker
  datasets={[
    { id: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
    { id: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "imported", records: 342 },
    { id: "ds-131", name: "示例对照数据集", batch: "batch-01", version: "v2", source: "imported", records: 64, disabledReason: "被 run-28004 占用中" },
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
        description: "多选模式用于合并多个批次作为输入，下拉保持打开，底部与触发器给出记录数合计。",
        code: `import { DatasetPicker } from "@/components/ui/dataset-picker";

<DatasetPicker
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
        description: "无可用数据集时说明原因并给出导入入口，不渲染空下拉。",
        code: `import { DatasetPicker } from "@/components/ui/dataset-picker";

<DatasetPicker
  datasets={[]}
  onChange={setDatasetId}
  emptyDescription="当前项目（project-042）还没有数据集，导入后即可用于计算。"
  emptyAction={{ label: "去导入数据", onClick: goImport }}
/>`,
        preview: "dataset-picker/empty",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "为电导率优化选择输入数据集：同一数据集的多个版本并列，版本固定为所选、不会隐式漂移；选中已归档版本时给出警告。",
        code: `import { Button } from "@/components/ui/button";
import { DatasetPicker } from "@/components/ui/dataset-picker";

<DatasetPicker datasets={datasets} value={datasetId} onChange={setDatasetId} />
<Button disabled={!datasetId}>开始优化</Button>`,
        fullCode: `const datasets = [
  { id: "ds-118@v3", datasetId: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
  { id: "ds-118@v2", datasetId: "ds-118", name: "电解液电导率数据集", batch: "batch-06", version: "v2", source: "imported", records: 120, archived: true },
  { id: "ds-092@v5", datasetId: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "shared", records: 342 },
] satisfies DatasetOption[]; // synthetic：id 唯一（含版本），datasetId 用于展示`,
        preview: "dataset-picker/business",
      },
    ],
    props: [
      { name: "datasets", type: "DatasetOption[]", required: true, description: "选项：id（唯一，可含版本）、可选 datasetId、name、batch、version、source（imported / computed / shared）、records、archived、disabledReason。" },
      { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "多选模式用于合并多个批次作为输入，下拉在勾选时保持打开。" },
      { name: "value", type: "string | null（single） / string[]（multiple）", description: "选中的选项 id；多选时为 id 数组。" },
      { name: "onChange", type: "(value: string) => void / (value: string[]) => void", required: true, description: "选择回调，类型随 selectionMode 变化。" },
      { name: "placeholder", type: "string", default: '"选择输入数据集"', description: "未选中时的触发器文案。" },
      { name: "loading", type: "boolean", default: "false", description: "加载中：触发器禁用并显示“正在加载数据集…”。" },
      { name: "disabled", type: "boolean", default: "false", description: "整体禁用。" },
      { name: "emptyAction", type: "{ label: string; onClick: () => void }", description: "datasets 为空时空态的动作入口，通常是去导入数据。" },
      { name: "emptyDescription", type: "ReactNode", description: "空态说明：为什么没有数据集。" },
      { name: "id / aria-label", type: "string", description: "透传到触发器，便于与 <Label htmlFor> 关联。" },
    ],
    states: [
      { name: "default", note: "选项行依次展示名称、批次、版本、来源徽章与记录数。" },
      { name: "hover", note: "选项行 hover 高亮；归档与被占用选项无 hover 反馈。" },
      { name: "focus-visible", note: "选项键盘可达，焦点环与 Select 选项一致。" },
      { name: "pressed", note: "不适用：无按压态，选中以勾选与背景表达。", applicable: false },
      { name: "disabled", note: "被占用或已归档的数据集禁用并标注原因，可查看不可选。" },
      { name: "loading", note: "loading 时触发器禁用并显示“正在加载数据集…”，下拉内为骨架行。" },
      { name: "empty", note: "无数据集时显示“暂无数据集”与导入入口；筛选为空时提示清除筛选。" },
      { name: "error", note: "加载失败由调用方在选择器旁给出错误与重试（可同时传 disabled），保留上次成功的选中值。" },
      { name: "permission-limited", note: "无权限数据集传 disabledReason=\"需申请权限\"：置灰、不可选并朗读原因。" },
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
      "多选模式 Enter 切换勾选并保持下拉打开，“完成”或 Esc 关闭。",
      "Esc 关闭下拉并保留已选值。",
    ],
    accessibility: [
      "下拉由 Command 提供 listbox / option 语义，选项带 aria-checked 表达勾选；多选时列表 aria-multiselectable。",
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
      "显示记录数与批次，帮助判断数据规模与来源批次。",
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
    status: "stable",
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
        description: "四级徽章各有固定图标与配色，hover 或聚焦展示该级能力说明；showDescription 直接在徽章旁展示。",
        code: `import { PermissionScope } from "@/components/ui/permission-scope";

<PermissionScope scope="viewer" />
<PermissionScope scope="editor" />
<PermissionScope scope="executor" />
<PermissionScope scope="admin" />

<PermissionScope scope="executor" showDescription />`,
        preview: "permission-scope/basic",
      },
      {
        id: "matrix",
        title: "权限矩阵",
        kind: "variant",
        description: "用只读矩阵说明每一级能做什么，避免用户猜测权限缺口。",
        code: `import { PermissionMatrix } from "@/components/ui/permission-scope";

<PermissionMatrix
  capabilities={[
    { action: "查看数据与结果", allow: ["viewer", "editor", "executor", "admin"] },
    { action: "编辑配置与配方", allow: ["editor", "executor", "admin"] },
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
        description: "项目成员列表中的权限列；权限不足的动作禁用，旁边给出所需级别与申请升级入口。",
        code: `import { Button } from "@/components/ui/button";
import { hasPermission, PermissionScope } from "@/components/ui/permission-scope";

{members.map((member) => (
  <li key={member.name}>
    {member.name}
    <PermissionScope scope={member.scope} />
  </li>
))}

<Button disabled={!hasPermission(me.scope, "executor")}>提交计算任务</Button>
<PermissionScope scope={me.scope} required="executor" onRequestUpgrade={requestUpgrade} />`,
        fullCode: `const members = [
  { name: "张三", role: "项目创建者", scope: "admin" },
  { name: "李四", role: "计算工程师", scope: "executor" },
  { name: "王五", role: "外部协作", scope: "viewer" },
] as const; // synthetic：权限判断在服务端执行，前端只做展示与引导`,
        preview: "permission-scope/business",
      },
    ],
    props: [
      { name: "scope", type: '"viewer" | "editor" | "executor" | "admin"', description: "封闭四级集合，映射固定图标、配色与文案；缺失时显示“权限未知”。" },
      { name: "showDescription", type: "boolean", default: "false", description: "在徽章旁直接展示该级能力说明（可以……，不能……），并用 aria-describedby 关联。" },
      { name: "required", type: '"viewer" | "editor" | "executor" | "admin"', description: "动作所需级别；当前级别不足时徽章旁给出“需要{级别}权限”。" },
      { name: "onRequestUpgrade", type: "() => void", description: "级别不足时显示“申请升级”链接按钮。" },
      { name: "loading", type: "boolean", default: "false", description: "权限拉取中显示骨架徽章，不猜测级别。" },
      { name: "noTooltip", type: "boolean", default: "false", description: "关闭 hover / 聚焦说明浮层（在下拉选项等嵌套场景使用）。" },
      { name: "PermissionMatrix", type: "{ capabilities: { action; allow[] }[]; scopes? }", description: "只读权限矩阵，使用 scope 表头，首列 sticky。" },
      { name: "hasPermission(current, required)", type: "boolean", description: "工具函数：判断当前级别是否满足所需级别，用于联动按钮启停。" },
    ],
    states: [
      { name: "default", note: "徽章形态：图标 + 级别文案；四级各有固定配色。" },
      { name: "hover", note: "hover 展示能力说明浮层：可以做什么、不能做什么。" },
      { name: "focus-visible", note: "徽章可聚焦查看说明，焦点环与 Badge 一致。" },
      { name: "pressed", note: "不适用：权限徽章是只读展示，无按压态。", applicable: false },
      { name: "disabled", note: "不适用：权限徽章不表达禁用；动作禁用由按钮自身承担。", applicable: false },
      { name: "loading", note: "权限拉取中显示骨架徽章，不猜测级别。" },
      { name: "empty", note: "不适用：主体必有确定级别；级别缺失时显示“权限未知”并按无权限处理。", applicable: false },
      { name: "error", note: "拉取失败时不传 scope，显示“权限未知”徽章（重试由调用方提供），动作按无权限处理。" },
      { name: "permission-limited", note: "组件本身就是权限表达：级别不足时展示当前级别、所需级别与申请升级入口。" },
      { name: "mobile", note: "徽章保留图标与短文案；触屏点按徽章即展示说明，或用 showDescription 常驻展示。" },
      { name: "dark-mode", note: "四级配色使用语义令牌，深浅主题下对比度一致。" },
    ],
    interaction: [
      "hover 或点击徽章展示能力明细：可以做什么、不能做什么。",
      "权限不足的动作旁展示所需级别与申请入口，点击发起申请。",
      "级别变更（被升级或降级）后徽章即时更新并给出通知。",
    ],
    keyboard: [
      "徽章 Tab 可聚焦，聚焦即展示能力说明浮层，Esc 收起。",
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
    status: "stable",
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
        code: `import { AuditTimeline } from "@/components/ui/audit-timeline";

<AuditTimeline
  events={[
    { id: "evt-03", actor: "李四", action: "提交了计算任务", target: "run-28003", at: "2026-09-21 10:24" },
    { id: "evt-02", actor: "张三", action: "更新了数据集", target: "ds-118 · v3", at: "2026-09-21 09:58" },
    { id: "evt-01", actor: "张三", action: "创建了项目", target: "project-042", at: "2026-09-20 16:02" },
  ]}
/>`,
        preview: "audit-timeline/basic",
      },
      {
        id: "incident",
        title: "高危与失败事件",
        kind: "variant",
        description: "权限变更、删除与执行失败标级别：critical 红色“高危”、warning 琥珀色“关键”，带 detail 的行可展开查看详情。",
        code: `import { AuditTimeline } from "@/components/ui/audit-timeline";

<AuditTimeline
  events={[
    { id: "evt-09", actor: "系统", actorType: "system", action: "任务执行失败", target: "run-28003", at: "2026-09-21 10:31", level: "critical", detail: "计算资源超时（exit 124）" },
    { id: "evt-08", actor: "张三", action: "修改了成员权限", target: "王五 → 可执行", at: "2026-09-21 09:12", level: "warning" },
  ]}
/>`,
        preview: "audit-timeline/incident",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情的审计记录：按级别过滤只看关键事件，对象可点击跳转，底部加载更早记录。",
        code: `import { AuditTimeline } from "@/components/ui/audit-timeline";

<AuditTimeline
  events={runEvents}
  filter={filter}
  onFilterChange={setFilter}
  onTargetClick={(event) => openResource(event.target)}
  loadingMore={loadingMore}
  onLoadMore={loadMore}
/>`,
        fullCode: `const runEvents = [
  { id: "evt-12", actor: "李四", action: "确认执行", target: "run-28003", at: "2026-09-21 10:24", level: "warning" },
  { id: "evt-11", actor: "系统", actorType: "system", action: "任务创建", target: "run-28003", at: "2026-09-21 10:24" },
  { id: "evt-10", actor: "电导率优化 Agent", actorType: "agent", action: "推荐执行计划", target: "重新计算电导率", at: "2026-09-21 10:23" },
] satisfies AuditEvent[]; // synthetic：Agent 也是审计主体，与真人操作同样留痕`,
        preview: "audit-timeline/business",
      },
    ],
    props: [
      { name: "events", type: "AuditEvent[]", required: true, description: "事件：id、actor、可选 actorType（user / system / agent）、action、target、at、可选 datetime、level（info / warning / critical）与 detail。" },
      { name: "filter", type: '"all" | "critical"', default: '"all"', description: "按级别过滤；critical 只展示 warning 与 critical 事件，保持时间顺序。" },
      { name: "onFilterChange", type: '(filter: "all" | "critical") => void', description: "提供时在顶部渲染“全部 / 仅关键”分段过滤。" },
      { name: "onTargetClick", type: "(event: AuditEvent) => void", description: "提供时对象渲染为链接按钮，点击跳转资源详情。" },
      { name: "onLoadMore", type: "() => void", description: "提供时底部渲染“加载更早记录”。" },
      { name: "loadingMore", type: "boolean", default: "false", description: "加载更多中：底部显示骨架行。" },
      { name: "restricted", type: "boolean", default: "false", description: "无审计权限：显示锁态说明，不渲染任何条目。" },
      { name: "emptyText", type: "string", description: "无记录时的说明，写清记录从何时开始产生。" },
    ],
    states: [
      { name: "default", note: "节点圆点 + 内容行：操作者与动作一行，对象与时间一行；新事件在前。" },
      { name: "hover", note: "行 hover 通过 title 显示事件 ID 与完整时间（datetime）；展开详情后同样可见事件 ID。" },
      { name: "focus-visible", note: "可展开的行键盘可达，焦点环清晰。" },
      { name: "pressed", note: "不适用：时间线无按压态，展开以 chevron 变化表达。", applicable: false },
      { name: "disabled", note: "不适用：审计记录只读，不存在禁用。", applicable: false },
      { name: "loading", note: "loadingMore 时底部显示骨架行；首屏加载用整块 Skeleton。" },
      { name: "empty", note: "无记录时显示“暂无审计记录”占位，说明记录从何时开始产生。" },
      { name: "error", note: "加载失败由调用方在时间线下方给出错误与重试，已加载的记录保留不清空。" },
      { name: "permission-limited", note: "restricted 时只显示锁态说明，不泄露任何条目内容。" },
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
    status: "stable",
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
        code: `import { ExperimentStep } from "@/components/ui/experiment-step";

<ExperimentStep
  current="run"
  steps={[
    { id: "config", name: "参数配置", status: "done" },
    { id: "queue", name: "排队等待", status: "done" },
    { id: "run", name: "计算运行", status: "active", detail: "已运行 36s" },
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
        description: "失败节点标红，下方给出原因与原地重试入口，重试不影响已完成节点的产物。",
        code: `import { ExperimentStep } from "@/components/ui/experiment-step";

<ExperimentStep
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
        description: "第 3 轮电导率优化的节点流：已完成节点可点击查看产物，进度实时更新。",
        code: `import { ExperimentStep } from "@/components/ui/experiment-step";

<ExperimentStep
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
      { name: "current", type: "string", description: "当前节点 ID（aria-current=\"step\"）；缺省取第一个 active 或 failed 节点。" },
      { name: "title", type: "string", description: "流程标题，通常是轮次或实验名称（第 3 轮优化）。" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "横向排列时窄容器可横向滚动并自动把当前节点滚入视野；也可改为纵向。" },
      { name: "onRetry", type: "(stepId: string) => void", description: "提供时失败说明行显示“原地重试”。" },
      { name: "onOpenArtifact", type: "(stepId: string) => void", description: "提供时已完成节点渲染为按钮，点击查看该节点产物。" },
      { name: "className", type: "string", description: "透传到根元素。" },
    ],
    states: [
      { name: "default", note: "节点按固定顺序横向排列：完成绿色对勾、当前蓝色 spinner 与浅底、失败红色叉、待执行灰色序号。" },
      { name: "hover", note: "提供 onOpenArtifact 时已完成节点 hover 显示浅底，表示可查看产物；其余节点无 hover 变化。" },
      { name: "focus-visible", note: "节点可聚焦，焦点环与 Steps 一致。" },
      { name: "pressed", note: "不适用：节点无按压态；重试按钮遵循 Button 规则。", applicable: false },
      { name: "disabled", note: "不适用：节点是状态展示；失败节点的重试按钮各自管理禁用。", applicable: false },
      { name: "loading", note: "当前节点 spinner；整体加载用 Skeleton 保持节点数量与位置。" },
      { name: "empty", note: "不适用：实验必有节点定义；定义缺失属配置错误，按 error 处理。", applicable: false },
      { name: "error", note: "失败节点标红，给出原因一行与原地重试入口；后续节点保持待执行。" },
      { name: "permission-limited", note: "无权限查看产物时不传 onOpenArtifact（或在回调里给出申请入口），节点状态本身仍可见。" },
      { name: "mobile", note: "横向可滚动，当前节点自动滚入视野；也可切换为纵向排列。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，节点配色与 RunStatus 六态保持一致。" },
    ],
    interaction: [
      "点击已完成节点查看产物（日志、结果、报告）。",
      "失败节点原地重试，重试不影响已完成节点的产物。",
      "节点状态实时更新，当前节点推进时平滑过渡，不重排节点。",
    ],
    keyboard: [
      "可查看产物的已完成节点是按钮，Tab 可达，Enter 打开产物。",
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
        description: "四类问题各有固定图标与语义：缺失、冲突、来源不可靠、待人工确认；汇总行与阻断数自动生成。",
        code: `import { DataQualityNotice } from "@/components/ui/data-quality-notice";

<DataQualityNotice
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
        description: "存在阻断级问题时，相关提交动作禁用并在按钮旁重复提示；每条问题给出处理动作，处理后收进“已解决”。",
        code: `import { Button } from "@/components/ui/button";
import { DataQualityNotice, hasBlockingIssues } from "@/components/ui/data-quality-notice";

const blocked = hasBlockingIssues(issues);

<DataQualityNotice issues={issues} onResolve={(id, action) => resolveIssue(id, action)} />
<Button disabled={blocked} aria-describedby="block-hint">提交计算</Button>
{blocked && <span id="block-hint">存在 1 条阻断级问题，处理后才能提交</span>}`,
        preview: "data-quality-notice/actionable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集导入后的质量报告：先汇总再逐条列出，处理后即时更新阻断状态，可下载完整报告。",
        code: `import { DataQualityNotice } from "@/components/ui/data-quality-notice";

<DataQualityNotice
  title="ds-118 · batch-07 导入检查"
  summary="共 128 条记录 · 待处理 3 个问题（1 条阻断）"
  issues={importIssues}
  onResolve={resolveIssue}
  onDownloadReport={downloadReport}
/>`,
        fullCode: `const importIssues = [
  {
    id: "q1", type: "conflict", level: "blocking", description: "3 条记录与 v2 版本电导率冲突", affected: "batch-07",
    actions: [{ label: "查看冲突", action: "view-conflict" }, { label: "以 v3 为准", action: "use-latest" }],
  },
  { id: "q2", type: "missing", level: "warning", description: "12 条记录缺少温度字段", affected: "batch-07" },
  { id: "q3", type: "needs-review", level: "warning", description: "8 条 Agent 生成记录待人工确认", affected: "batch-07" },
] satisfies QualityIssue[]; // synthetic
// 处理后把该条标记 resolved: true 并写 resolution（谁、以什么动作处理），组件收进“已解决 N 条”。`,
        preview: "data-quality-notice/business",
      },
    ],
    props: [
      { name: "issues", type: "QualityIssue[]", required: true, description: "问题：id、type（missing / conflict / unreliable-source / needs-review）、level（warning / blocking）、description、affected、可选 resolved / resolution / actions。" },
      { name: "title", type: "string", description: "报告标题，通常是数据集与批次（ds-118 · batch-07 导入检查）。" },
      { name: "summary", type: "ReactNode", description: "汇总行；缺省自动生成问题数与阻断数。" },
      { name: "onResolve", type: "(issueId: string, action: string) => void", description: "处理动作回调；未提供时不渲染动作按钮。默认动作：去补充 / 查看冲突 / 忽略本次 / 标记已确认。" },
      { name: "onDownloadReport", type: "() => void", description: "提供时右上角显示“下载报告”。" },
      { name: "loading", type: "boolean", default: "false", description: "检测中：显示“正在检查数据质量…”。" },
      { name: "error / onRetry", type: "ReactNode / () => void", description: "检查失败：显示“质量检查未完成”与重试，不按无问题放行。" },
      { name: "readOnly", type: "boolean", default: "false", description: "无编辑权限：问题只读，隐藏处理动作并提示所需权限。" },
      { name: "hasBlockingIssues(issues)", type: "boolean", description: "工具函数：是否存在未处理的阻断级问题，用于联动提交按钮。" },
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
      { name: "permission-limited", note: "readOnly 时问题只读、隐藏处理动作，并提示“处理问题需要可编辑权限”。" },
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
      "调用方给提交按钮加 aria-describedby 关联阻断提示文字。",
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
    status: "stable",
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
        code: `import { ToolRunCard } from "@/components/ui/tool-run-card";

<ToolRunCard
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
        description: "运行中传 startedAt 实时计时；失败给出错误摘要与重试入口，堆栈放进展开区，失败调用不隐藏。",
        code: `import { ToolRunCard } from "@/components/ui/tool-run-card";

<ToolRunCard
  tool="conductivity-optimize"
  status="running"
  startedAt={startedAt}
  paramsSummary="round=4 · target=9.2 mS/cm · budget=300s"
/>
<ToolRunCard
  tool="fetch-external-data"
  status="failed"
  duration={10000}
  paramsSummary="source=example.com · timeout=10s"
  error="连接 example.com 超时（10s）"
  details="TimeoutError: upstream did not respond within 10000ms"
  onRetry={retryTool}
/>`,
        preview: "tool-run-card/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "Agent 答复中的工具调用留痕：完整参数默认折叠，点击展开查看。",
        code: `import { ToolRunCard } from "@/components/ui/tool-run-card";

<ToolRunCard
  tool="conductivity-optimize"
  status="succeeded"
  duration={214000}
  paramsSummary="round=3 · target=9.0 mS/cm · budget=300s"
  input="ds-118 · v3 · 128 条"
  output="8 个候选配方 · 最优 8.7 mS/cm"
  params={{ round: 3, target_mS_cm: 9.0, budget_s: 300, dataset: "ds-118@v3", seed: 42 }}
/>`,
        fullCode: `import { formatDuration } from "@/components/ui/tool-run-card";

formatDuration(300);    // "300ms"
formatDuration(1240);   // "1.2s"
formatDuration(214000); // "3m34s"
// 展开状态只属于单张卡片，不跨卡片同步；重试应追加一张新卡片而不是覆盖旧记录。`,
        preview: "tool-run-card/business",
      },
    ],
    props: [
      { name: "tool", type: "string", required: true, description: "工具名，mono 字体展示，与注册表中的名称一致。" },
      { name: "status", type: '"running" | "succeeded" | "failed"', required: true, description: "调用状态，映射固定图标与徽章配色（运行中 / 已完成 / 已失败）。" },
      { name: "paramsSummary", type: "string", description: "单行参数摘要，超长截断，只放关键参数。" },
      { name: "duration", type: "number", description: "耗时（毫秒），格式化为 300ms / 1.2s / 3m34s。" },
      { name: "startedAt", type: "number", description: "running 时的开始时间戳（毫秒），每秒刷新实时耗时。" },
      { name: "input / output", type: "ReactNode", description: "输入与输出摘要：数据集、批次、记录数 / 产物与关键结果。" },
      { name: "error", type: "string", description: "failed 时的一行错误摘要。" },
      { name: "params", type: "Record<string, unknown> | string", description: "完整参数，对象格式化为 JSON 放进展开区。" },
      { name: "details", type: "ReactNode", description: "展开区里的完整输出或错误堆栈。" },
      { name: "collapsible", type: "boolean", default: "true", description: "完整参数与详情放进折叠区；false 时直接展开。" },
      { name: "outputRestricted", type: "boolean", default: "false", description: "无权限查看输出：输出区显示锁态占位，参数摘要仍可见。" },
      { name: "onRetry", type: "() => void", description: "failed 时在错误行显示“重试”。" },
    ],
    states: [
      { name: "default", note: "头部一行：工具图标 + mono 工具名 + 状态徽章 + 耗时；下方输入输出摘要。" },
      { name: "hover", note: "卡片 hover 边框加深；展开按钮 hover 遵循 ghost 按钮规则。" },
      { name: "focus-visible", note: "展开与重试按钮键盘可达，带 aria-expanded。" },
      { name: "pressed", note: "不适用：卡片无按压态，内部按钮遵循 Button 规则。", applicable: false },
      { name: "disabled", note: "不适用：调用记录是事实展示，不可禁用。", applicable: false },
      { name: "loading", note: "running 状态：spinner + 实时耗时（startedAt）；其余区域保持布局稳定不跳动。" },
      { name: "empty", note: "不适用：无输出的调用传 output=“无返回内容”，不渲染空卡片。", applicable: false },
      { name: "error", note: "failed 状态：错误摘要一行 + 重试入口；完整堆栈进展开区。" },
      { name: "permission-limited", note: "outputRestricted 时输出区显示锁态占位，参数摘要仍可见。" },
      { name: "mobile", note: "头部允许折行，工具名与耗时保持同行；参数摘要截断。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，mono 区域使用 muted 底色。" },
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
