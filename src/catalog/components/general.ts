import type { ComponentDoc } from "../types";

/**
 * 通用组件。Button 是文档完整度的范例：所有组件都必须达到同样的字段完整度。
 */
export const generalComponents: ComponentDoc[] = [
  {
    id: "button",
    name: "Button",
    chineseName: "按钮",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "触发一个动作或提交一段意图，是界面里最主要的动作载体。",
    usage:
      "用于立即执行的动作（提交、保存、确认、重试）。跳转页面请用 Link；只有图标没有文字时请用 IconButton；危险且不可逆的动作必须使用 danger 变体并配合确认。",
    keywords: ["button", "action", "submit", "按钮", "动作", "提交"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "四个变体覆盖主动作、次动作、低强调动作和危险动作。",
        code: `<Button variant="primary">开始计算</Button>
<Button variant="secondary">保存草稿</Button>
<Button variant="ghost">查看详情</Button>
<Button variant="danger">撤销任务</Button>`,
        preview: "button/basic",
      },
      {
        id: "states",
        title: "状态示例",
        kind: "state",
        description: "loading 期间保留按钮宽度与文案位置，disabled 必须能在上下文中找到原因。",
        code: `<Button variant="primary" loading>正在提交</Button>
<Button variant="primary" disabled>不可用</Button>`,
        preview: "button/states",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于表格行内和紧凑工具条，md 是默认尺寸，lg 只用于页面级主动作。",
        code: `<Button size="sm" variant="secondary">行内操作</Button>
<Button size="md" variant="primary">默认尺寸</Button>
<Button size="lg" variant="primary">页面主动作</Button>`,
        preview: "button/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "涉及计算、写入、额度或外部调用的动作，按钮旁必须给出影响范围说明。",
        code: `<div className="action-with-scope">
  <Button variant="primary" loading={isSubmitting}>提交计算任务</Button>
  <span>将使用 示例项目（project-042）· 预计最长 300 秒</span>
</div>`,
        fullCode: `function SubmitRunAction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="action-with-scope">
      <Button
        variant="primary"
        loading={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);
          await submitRun({ projectId: "project-042" }); // synthetic
          setIsSubmitting(false);
        }}
      >
        提交计算任务
      </Button>
      <span>将使用 示例项目（project-042）· 预计最长 300 秒</span>
    </div>
  );
}`,
        preview: "button/business",
      },
    ],
    props: [
      { name: "variant", type: '"primary" | "secondary" | "ghost" | "danger"', default: '"secondary"', description: "视觉层级。primary 一屏最多一个。" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "sm 用于行内，lg 仅用于页面级主动作。" },
      { name: "loading", type: "boolean", default: "false", description: "展示 spinner 并禁止重复点击，保留按钮宽度。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止交互；原因必须由邻近文案或 Tooltip 说明。" },
      { name: "icon", type: "ReactNode", description: "可选前置图标，仅在有语义时使用，尺寸 16。" },
      { name: "children", type: "ReactNode", required: true, description: "按钮文案，必须以动词开头。" },
      { name: "onClick", type: "() => void", description: "点击回调；异步动作必须进入 loading。" },
    ],
    states: [
      { name: "default", note: "文案以动词开头，primary 一屏最多一个。" },
      { name: "hover", note: "背景加深或边框变为品牌色，不改变尺寸。" },
      { name: "focus-visible", note: "3px 品牌色外发光，键盘可达，不能被 outline: none 移除。" },
      { name: "pressed", note: "轻微下沉（translateY 0），颜色再深一档，时长 < 120ms。" },
      { name: "disabled", note: "opacity .45 + not-allowed；必须在上下文中解释原因，不能只变灰。" },
      { name: "loading", note: "spinner 替换前置图标位，文案保留，宽度不变，阻止重复提交。" },
      { name: "empty", note: "不适用：按钮不存在空状态。", applicable: false },
      { name: "error", note: "按钮本身不展示错误；失败反馈由 Alert/Message 在动作附近给出。" },
      { name: "permission-limited", note: "无权限时渲染为 disabled 并说明所需权限，而不是隐藏。" },
      { name: "mobile", note: "最小点击区域 40×40px，sm 尺寸在移动端自动增高到 40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击后立即给出反馈：同步动作直接进入结果态，异步动作进入 loading。",
      "涉及计算、写入、额度或外部调用的动作，按钮旁给出影响范围（项目、预算、数量）。",
      "危险动作（danger）必须二次确认，确认面板回显目标和范围。",
      "同一区域只保留一个 primary；其余动作降级为 secondary 或 ghost。",
    ],
    keyboard: [
      "Tab 聚焦，焦点顺序与视觉顺序一致。",
      "Enter / Space 触发点击。",
      "loading 或 disabled 时仍可获得焦点并读出状态（使用 aria-disabled 而非移除 tabindex 的场景除外）。",
    ],
    accessibility: [
      "使用原生 <button>，不滥用 div。",
      "loading 时设置 aria-busy=\"true\"。",
      "图标按钮必须有 aria-label；图文按钮不重复朗读。",
      "danger 不单独依赖红色表达危险，配合文案或图标。",
    ],
    responsive: [
      "移动端最小高度 40px。",
      "窄屏下动作组允许换行，主动作保持在最前。",
      "不因为空间不足而省略文案改纯图标；空间不足时收入 Dropdown。",
    ],
    content: [
      "文案以动词开头：开始计算、保存草稿、撤销任务。",
      "不用“确定/提交”这类无上下文文案；写清提交什么。",
      "loading 文案说明进行中：正在提交，而不是转圈无字。",
    ],
    dos: [
      "一屏一个 primary，层级清晰。",
      "异步动作进入 loading 并保留宽度。",
      "危险动作使用 danger + 确认面板。",
    ],
    donts: [
      "不要用按钮做页面跳转（用 Link）。",
      "不要禁用按钮却不给原因。",
      "不要在一排里放两个 primary。",
      "不要用纯装饰图标替代文案。",
    ],
    related: ["icon-button", "link", "dropdown", "modal", "confirm-panel"],
  },
  {
    id: "icon-button",
    name: "IconButton",
    chineseName: "图标按钮",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "用一个语义明确的图标触发动作，是空间受限或高频场景下的紧凑动作载体。",
    usage:
      "用于工具栏、卡片角落、表格行内的高频动作（关闭、复制、刷新、更多）。图标含义必须已被约定俗成；含义不直观或低频的动作必须使用带文案的 Button，跳转用 Link。",
    keywords: ["icon button", "icon", "图标按钮", "工具栏", "toolbar"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "图标语义必须无需解释：关闭、复制、刷新、更多。",
        code: `<IconButton icon={<X size={16} />} label="关闭面板" />
<IconButton icon={<Copy size={16} />} label="复制任务 ID" />
<IconButton icon={<RefreshCw size={16} />} label="刷新列表" />
<IconButton icon={<MoreHorizontal size={16} />} label="更多操作" />`,
        preview: "icon-button/basic",
      },
      {
        id: "states",
        title: "状态示例",
        kind: "state",
        description: "danger 变体用于不可逆动作；disabled 必须在 Tooltip 或邻近文案中说明原因。",
        code: `<IconButton icon={<Trash2 size={16} />} label="删除数据集 ds-118" variant="danger" />
<IconButton icon={<Share2 size={16} />} label="分享（需要项目编辑权限）" disabled />`,
        preview: "icon-button/states",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于表格行内和紧凑工具条，md 是默认尺寸；图标保持 14–16px。",
        code: `<IconButton size="sm" icon={<Pencil size={14} />} label="编辑" />
<IconButton size="md" icon={<Pencil size={16} />} label="编辑" />`,
        preview: "icon-button/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "表格行内只放高频动作（不超过 3 个）；删除等危险动作收入「更多操作」并配确认。",
        code: `<div className="row-actions">
  <IconButton icon={<Eye size={15} />} label="查看 run-28003 详情" onClick={openDetail} />
  <IconButton icon={<Copy size={15} />} label="复制任务 ID" onClick={copyRunId} />
  <IconButton icon={<MoreHorizontal size={15} />} label="更多操作" onClick={openMenu} />
</div>`,
        preview: "icon-button/business",
      },
    ],
    props: [
      { name: "icon", type: "ReactNode", required: true, description: "图标，尺寸 14–16px，不允许替换为插画或文字。" },
      { name: "label", type: "string", required: true, description: "动作的完整名称，同时用于 aria-label 与 Tooltip。" },
      { name: "variant", type: '"ghost" | "secondary" | "danger"', default: '"ghost"', description: "ghost 用于工具栏，secondary 用于需要边框的场景，danger 用于不可逆动作。" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "sm 高度 28px 用于行内，md 高度 32px。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止交互；原因必须由 Tooltip 或邻近文案说明。" },
      { name: "onClick", type: "() => void", description: "点击回调；异步动作由外部状态驱动 loading 替换图标位。" },
    ],
    states: [
      { name: "default", note: "单个图标居中，无文案；动作名称由 label 通过 Tooltip 与 aria-label 提供。" },
      { name: "hover", note: "背景变为 surface-soft 并显示 Tooltip（动作名称 + 快捷键，如有）。" },
      { name: "focus-visible", note: "3px 品牌色外发光，焦点样式与 Button 一致，不能被 outline: none 移除。" },
      { name: "pressed", note: "背景再深一档，不改变尺寸与图标。" },
      { name: "disabled", note: "opacity .45 + not-allowed；Tooltip 说明原因，例如“需要项目编辑权限”。" },
      { name: "loading", note: "图标位替换为 spinner，尺寸不变，禁止重复点击。" },
      { name: "empty", note: "不适用：图标按钮不存在空状态。", applicable: false },
      { name: "error", note: "不适用：动作失败由 Message/Alert 反馈，按钮自身不表达错误。", applicable: false },
      { name: "permission-limited", note: "无权限时渲染为 disabled 并在 Tooltip 说明所需权限，不隐藏。" },
      { name: "mobile", note: "命中区域不小于 40×40px，视觉尺寸可保持 32px，命中区域外扩。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击后立即反馈：同步动作直接生效，异步动作图标位变 spinner。",
      "danger 变体的不可逆动作必须接确认（Popconfirm 或确认面板）。",
      "同一行内图标按钮不超过 3 个，其余收入 Dropdown。",
      "Tooltip 只显示动作名称，不承载教学文案。",
    ],
    keyboard: [
      "Tab 聚焦，焦点顺序与视觉顺序一致。",
      "Enter / Space 触发动作。",
      "Esc 关闭由按钮打开的浮层后，焦点回到按钮本身。",
    ],
    accessibility: [
      "使用原生 <button>，aria-label 等于 label。",
      "图标本身 aria-hidden，朗读只读动作名称。",
      "disabled 使用 aria-disabled 保留焦点与 Tooltip 入口。",
      "danger 不只依赖红色，动作名称必须写清后果（“删除数据集”而非“删除”）。",
    ],
    responsive: [
      "移动端命中区域 ≥ 40×40px。",
      "窄屏工具条优先保留高频动作，其余收入 Dropdown，不换行堆叠。",
    ],
    content: [
      "label 使用动宾结构：复制任务 ID、刷新列表、关闭面板。",
      "不用“操作”“功能”这类无信息名称。",
      "危险动作名称包含对象：删除数据集 ds-118，而不是“删除”。",
    ],
    dos: [
      "只放约定俗成的图标：关闭、复制、刷新、更多、编辑。",
      "为每个图标按钮提供 label（Tooltip + aria-label）。",
      "行内动作超出 3 个时收入 Dropdown。",
    ],
    donts: [
      "不要用含义不直观的图标省掉文案（改用 Button）。",
      "不要禁用却不说明原因。",
      "不要把危险动作与常规动作无差别平铺。",
      "不要在图标按钮里塞数字或文字。",
    ],
    related: ["button", "dropdown", "link", "modal"],
  },
  {
    id: "link",
    name: "Link",
    chineseName: "链接",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "导航到另一个页面、资源或位置，只负责跳转，不执行动作。",
    usage:
      "用于页面跳转、打开详情、访问外部文档。提交、保存、删除等动作用 Button；当前位置导航用 Breadcrumb；主导航用 Menu。",
    keywords: ["link", "anchor", "链接", "跳转", "导航"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "文内链接继承正文排版，独立链接可带方向图标；外部链接必须可识别。",
        code: `<Link href="#/projects/project-042">示例项目（project-042）</Link>
<Link href="#/runs/run-28003" icon={<ArrowRight size={14} />}>查看运行详情</Link>
<Link href="https://example.com/docs/fields" external>字段规范文档</Link>`,
        preview: "link/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "muted 用于次级导航；danger 链接只允许“离开/放弃”类导航，不允许用于破坏性动作。",
        code: `<Link href="#/datasets" variant="muted">返回数据集列表</Link>
<Link href="#/projects/project-042/archive" variant="danger">放弃本次编辑并离开</Link>`,
        preview: "link/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "表格中的实体名称渲染为链接跳转详情；ID 用等宽字体跟在名称后，不重复做链接。",
        code: `<div className="cell-main">
  <Link href="#/projects/project-042">示例电解液项目</Link>
  <span className="mono">project-042</span>
</div>`,
        preview: "link/business",
      },
    ],
    props: [
      { name: "href", type: "string", required: true, description: "目标地址；站内用路由路径，站外用完整 URL。" },
      { name: "external", type: "boolean", default: "false", description: "外链标识：新标签页打开，附加 rel=noopener noreferrer 与外链图标。" },
      { name: "variant", type: '"default" | "muted" | "danger"', default: '"default"', description: "muted 用于次级导航，danger 仅用于离开/放弃类导航。" },
      { name: "icon", type: "ReactNode", description: "可选图标；方向类图标放右侧，语义图标放左侧。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止跳转，渲染为普通文本并由邻近文案说明原因。" },
      { name: "children", type: "ReactNode", required: true, description: "链接文案，写清去向，不写“点击这里”。" },
    ],
    states: [
      { name: "default", note: "品牌色；文内链接默认无下划线，hover 时出现。" },
      { name: "hover", note: "出现下划线，颜色加深；不改变字重，避免行内抖动。" },
      { name: "focus-visible", note: "3px 品牌色外发光，与 Button 焦点样式一致。" },
      { name: "pressed", note: "颜色再深一档；站内导航不记忆 visited 态。" },
      { name: "disabled", note: "渲染为 muted 文本，去掉跳转能力，邻近文案说明原因。" },
      { name: "loading", note: "不适用：跳转由路由接管，目标页加载用 Skeleton/Spin。", applicable: false },
      { name: "empty", note: "不适用：链接不存在空状态。", applicable: false },
      { name: "error", note: "目标不存在时由目标页的 Result（404）承载，链接自身不表达错误。" },
      { name: "permission-limited", note: "目标无权限时可点击并展示 403 结果页，或按场景渲染为 disabled 文本。" },
      { name: "mobile", note: "行内链接命中区域上下扩展到 ≥ 40px 高。" },
      { name: "dark-mode", note: "品牌色在深色主题下自动提亮一档，保证对比度。" },
    ],
    interaction: [
      "站内跳转使用路由，外链新标签页打开并带外链图标。",
      "下载类链接写清文件名与格式，例如“导出记录（CSV）”。",
      "danger 链接只做“离开/放弃”导航，破坏性动作一律用 Button + 确认。",
    ],
    keyboard: [
      "Tab 聚焦，Enter 触发跳转。",
      "外链聚焦时读屏器朗读“在新窗口打开”。",
    ],
    accessibility: [
      "使用原生 <a href>，不用 onClick + div 模拟。",
      "外链附加 rel=noopener noreferrer 与视觉外链图标。",
      "链接文案脱离上下文也可读懂去向，不写“点击这里”“更多”。",
    ],
    responsive: [
      "移动端行内链接命中区域 ≥ 40px 高。",
      "长 URL 与长名称使用 ellipsis 截断，完整值在 title 中给出。",
    ],
    content: [
      "文案写去向：查看运行详情、字段规范文档。",
      "表格实体名做链接，ID 用等宽字体展示但不重复链接。",
      "不用“点击这里”“链接”作为文案。",
    ],
    dos: [
      "跳转用 Link，动作用 Button，职责分清。",
      "外链新标签页打开并给外链图标。",
      "表格实体名称链接到对应详情页。",
    ],
    donts: [
      "不要用 Link 执行提交、删除等动作。",
      "不要整段文字都做成链接，只链接关键名词。",
      "不要在同一视图里为同一目标重复多个链接。",
      "不要用按钮样式包装链接假装动作。",
    ],
    related: ["button", "breadcrumb", "menu", "typography"],
  },
  {
    id: "typography",
    name: "Typography",
    chineseName: "排版",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "用固定的字号、字重与语义色层级表达信息结构，保证全站文字可读、可扫、一致。",
    usage:
      "用于标题、正文、辅助说明、ID 与数值的展示。需要表达状态用 Badge；大段代码用 CodeBlock；不要用手写字号的方式伪造层级。",
    keywords: ["typography", "text", "title", "排版", "文字", "标题", "正文"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "五级层级：display 只用于页面主标题，label 用于字段与辅助说明，mono 用于 ID 与数值。",
        code: `<Typography variant="display">示例项目（project-042）</Typography>
<Typography variant="heading">基础信息</Typography>
<Typography variant="body">本项目用于验证电解液配方的筛选流程。</Typography>
<Typography variant="label">最近更新 · 2026-09-18</Typography>
<Typography variant="mono">run-28003</Typography>`,
        preview: "typography/basic",
      },
      {
        id: "variants",
        title: "语义文本示例",
        kind: "variant",
        description: "语义色只用于状态文本：success 完成、warning 待复核、danger 失败、violet Agent 生成。",
        code: `<Typography type="success">计算完成 · 用时 214 秒</Typography>
<Typography type="warning">3 个字段待人工复核</Typography>
<Typography type="danger">任务失败：输入文件缺失</Typography>
<Typography type="violet">以下内容由 Agent 生成</Typography>`,
        preview: "typography/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "详情页头部：名称用 display，ID 用 mono 紧随名称，归属信息用 label，层级一眼可扫。",
        code: `<header className="detail-head">
  <Typography variant="display">NCM811 高温循环实验</Typography>
  <Typography variant="mono">run-28003</Typography>
  <Typography variant="label">所属项目 示例项目（project-042）· 数据集 ds-118</Typography>
</header>`,
        preview: "typography/business",
      },
    ],
    props: [
      { name: "variant", type: '"display" | "heading" | "body" | "label" | "mono"', default: '"body"', description: "层级变体；display 每屏最多一个。" },
      { name: "type", type: '"default" | "secondary" | "success" | "warning" | "danger" | "violet"', default: '"default"', description: "语义色；只用于状态文本，不用于装饰。" },
      { name: "ellipsis", type: "boolean", default: "false", description: "单行截断并在 title 中给出完整值。" },
      { name: "as", type: '"h1" | "h2" | "h3" | "h4" | "p" | "span"', description: "覆盖渲染标签，保证标题层级语义。" },
      { name: "children", type: "ReactNode", required: true, description: "文本内容。" },
    ],
    states: [
      { name: "default", note: "按 variant 渲染固定字号/字重/行高，不允许局部覆盖。" },
      { name: "hover", note: "不适用：静态文本无 hover；可交互文本的 hover 由承载控件定义。", applicable: false },
      { name: "focus-visible", note: "不适用：静态文本不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：静态文本无按压态。", applicable: false },
      { name: "disabled", note: "不适用：禁用态由对应控件表达，文本不单独变灰。", applicable: false },
      { name: "loading", note: "数据未到时用 Skeleton 占位，不渲染“加载中…”正文文本。" },
      { name: "empty", note: "空值不渲染“暂无”，由 Empty 组件在区块级说明。" },
      { name: "error", note: "错误摘要文本使用 type=\"danger\"；字段级错误跟随表单的 field-error 样式。" },
      { name: "permission-limited", note: "无权限字段渲染为 muted 的“无权限查看”占位，不留空白、不显示部分值。" },
      { name: "mobile", note: "display 在移动端从 30px 降到 24px，正文保持 14px 不缩小。" },
      { name: "dark-mode", note: "正文与辅助色使用语义令牌自动适配；mono 品牌色提亮一档。" },
    ],
    interaction: [
      "ID 与数值用 mono，方便扫描与复制比对。",
      "截断文本必须提供完整值入口（title 或展开按钮）。",
      "语义色文本不与同色 Badge 并排重复表达同一状态。",
    ],
    keyboard: [
      "不适用：静态文本无键盘行为；复制 ID 通过相邻 IconButton 触发。",
      "截断展开的入口必须是可聚焦的按钮，不绑定在文本本身。",
    ],
    accessibility: [
      "标题使用真实 h1–h4 标签，层级不跳级。",
      "正文字号不小于 13px，对比度 ≥ 4.5:1。",
      "状态文本不只依赖颜色，配合措辞或图标。",
    ],
    responsive: [
      "display 在 <760px 降为 24px。",
      "长表格单元格文本使用 ellipsis，不换行撑高行。",
    ],
    content: [
      "辅助说明使用 label，句子简短，不以“请”开头。",
      "ID 一律等宽字体，不翻译、不改写大小写。",
      "错误文本写清对象与后果：任务失败：输入文件缺失。",
    ],
    dos: [
      "用 variant 表达层级，而不是手写 font-size。",
      "ID、时间、数值使用 mono。",
      "状态文本用语义色并写清结论。",
    ],
    donts: [
      "不要新增字号或颜色表达层级。",
      "不要整段正文使用语义色。",
      "不要把长 URL、长 ID 原样撑破布局（用 ellipsis）。",
      "不要用加粗代替标题层级。",
    ],
    related: ["divider", "badge", "code-block", "empty", "card"],
  },
  {
    id: "divider",
    name: "Divider",
    chineseName: "分割线",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "在内容之间建立分组边界，帮助用户区分不同主题或功能区块。",
    usage:
      "用于分隔段落、卡片内功能分区、工具栏按钮分组。能用间距（≥24px）表达分组时不加线；列表行之间使用行分隔线，不逐行插 Divider。",
    keywords: ["divider", "separator", "分割线", "分隔", "分组"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "水平分割线上下各保留 20px 间距，线本身不承载颜色语义。",
        code: `<p>项目基础信息与说明。</p>
<Divider />
<p>参数配置与执行记录。</p>`,
        preview: "divider/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "带文字的分割线用于标记区块起点；垂直分割线只用于工具栏按钮分组；虚线用于弱分隔。",
        code: `<Divider textPosition="start">参数配置</Divider>
<Divider orientation="vertical" />
<Divider dashed />`,
        preview: "divider/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "详情页在「基础信息」与「执行记录」之间用带文字分割线分区，不再重复加粗区块标题。",
        code: `<Descriptions items={baseItems} />
<Divider textPosition="start">执行记录</Divider>
<Timeline items={runEvents} />`,
        preview: "divider/business",
      },
    ],
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "方向；垂直只用于工具栏与按钮组。" },
      { name: "dashed", type: "boolean", default: "false", description: "虚线样式，用于可折叠或可选区块的弱分隔。" },
      { name: "textPosition", type: '"start" | "center" | "end"', default: '"center"', description: "文字位置；区块标题推荐 start。" },
      { name: "children", type: "ReactNode", description: "分割线文字，写区块名，一句话以内。" },
    ],
    states: [
      { name: "default", note: "1px line 色，上下间距 ≥ 20px，无投影无圆角。" },
      { name: "hover", note: "不适用：分割线不接收 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：分割线不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：分割线无按压态。", applicable: false },
      { name: "disabled", note: "不适用：分割线无禁用态。", applicable: false },
      { name: "loading", note: "不适用：加载中的区块由 Skeleton 占位，不单独渲染分割线。", applicable: false },
      { name: "empty", note: "空区块连同分割线一起移除，避免出现“两条线夹空白”。" },
      { name: "error", note: "不适用：错误由 Alert/Result 表达。", applicable: false },
      { name: "permission-limited", note: "不适用：无权限区块整体替换为权限提示，不保留分割线。", applicable: false },
      { name: "mobile", note: "间距随断点收缩到 16px，线宽保持 1px。" },
      { name: "dark-mode", note: "使用 line 令牌自动适配，不用纯黑/纯白硬编码。" },
    ],
    interaction: [
      "分割线不可点击、不可聚焦，带文字时文字也不承载链接。",
      "区块为空时连同分割线一起移除，不保留孤立线条。",
    ],
    keyboard: [
      "不适用：分割线不进入 Tab 序列。",
      "带文字分割线的文字是静态文本，不绑定快捷键。",
    ],
    accessibility: [
      "使用 <hr> 或 role=\"separator\"，aria-orientation 与方向一致。",
      "纯装饰分割线标记 aria-hidden。",
    ],
    responsive: [
      "移动端上下间距收缩到 16px。",
      "垂直分割线在窄屏工具条换行时移除。",
    ],
    content: [
      "分割线文字写区块名：执行记录、参数配置。",
      "不写句子、不写说明；超过 8 个字应改用区块标题。",
    ],
    dos: [
      "优先用间距分组，其次才用线。",
      "区块标题场景使用 textPosition=\"start\"。",
      "空区块连同分割线一起移除。",
    ],
    donts: [
      "不要在列表每一行之间都加 Divider。",
      "不要用分割线表达层级或状态颜色。",
      "不要让分割线紧贴文字（间距 < 16px）。",
      "不要连续使用两条以上分割线。",
    ],
    related: ["typography", "card", "layout", "stack"],
  },
  {
    id: "badge",
    name: "Badge",
    chineseName: "徽标",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "用语义色加短文案标记对象的状态或数量，是状态语义的最小载体。",
    usage:
      "用于表格状态列、任务与运行状态、通知计数。分类与属性用 Tag；需要整段说明的状态用 Alert；可点击的筛选条件用 Tag 或 FilterBar。",
    keywords: ["badge", "status", "count", "徽标", "状态", "计数"],
    examples: [
      {
        id: "basic",
        title: "语义色示例",
        kind: "basic",
        description: "六种语义色各归其位：success 完成、warning 待复核、danger 失败、info 进行中、violet Agent、neutral 默认。",
        code: `<Badge status="success" text="已完成" />
<Badge status="warning" text="待复核" />
<Badge status="danger" text="失败" />
<Badge status="info" text="进行中" />
<Badge status="violet" text="Agent 建议" />
<Badge status="neutral" text="已归档" />`,
        preview: "badge/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "dot 只表达状态不表达数量；count 用于未读数，超过 max 显示 99+；进行中的状态带动效提示仍在变化。",
        code: `<Badge status="success" dot text="服务正常" />
<Badge status="info" dot pulse text="同步中" />
<Badge count={8} />
<Badge count={128} max={99} />`,
        preview: "badge/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "运行列表的状态列：同一列只出现状态徽标，颜色与文案一一对应，不用颜色区分业务类型。",
        code: `<Table
  columns={runColumns}
  dataSource={runs} // synthetic: run-28003 等
  renderStatus={(run) => <Badge status={run.status} text={run.statusText} />}
/>`,
        fullCode: `// synthetic 数据
const runs = [
  { id: "run-28003", name: "NCM811 高温循环", status: "success", statusText: "已完成" },
  { id: "run-28004", name: "电解液配方筛选", status: "info", statusText: "进行中" },
  { id: "run-28005", name: "阻抗谱拟合", status: "warning", statusText: "待复核" },
  { id: "run-28006", name: "热稳定性预测", status: "danger", statusText: "失败" },
];`,
        preview: "badge/business",
      },
    ],
    props: [
      { name: "status", type: '"success" | "warning" | "danger" | "info" | "violet" | "neutral"', default: '"neutral"', description: "语义色；与语义一一对应，不允许用颜色区分业务类型。" },
      { name: "text", type: "string", description: "状态文案，2–4 个字。" },
      { name: "dot", type: "boolean", default: "false", description: "点状变体，用于空间极小的行内状态。" },
      { name: "count", type: "number", description: "数字徽标；与 text 互斥，只表达未读/待处理数量。" },
      { name: "max", type: "number", default: "99", description: "count 超过该值显示为 max+。" },
      { name: "pulse", type: "boolean", default: "false", description: "进行中状态的脉冲动效，仅 status=\"info\" 可用。" },
    ],
    states: [
      { name: "default", note: "圆角胶囊，文案 2–4 字，颜色只按语义取值。" },
      { name: "hover", note: "不适用：徽标不可交互；需要交互用 Tag 或 Button。", applicable: false },
      { name: "focus-visible", note: "不适用：徽标不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：徽标无按压态。", applicable: false },
      { name: "disabled", note: "不适用：徽标无禁用态；对象的禁用由所在行样式表达。", applicable: false },
      { name: "loading", note: "状态未返回时渲染 neutral「同步中」，不猜颜色、不闪烁切换。" },
      { name: "empty", note: "无状态值时渲染 neutral「未知」，不省略徽标造成列错位。" },
      { name: "error", note: "失败/阻断使用 danger，文案写结论：失败、已撤销。" },
      { name: "permission-limited", note: "无权限查看状态时渲染 neutral「无权查看」，不显示推测状态。" },
      { name: "mobile", note: "尺寸不缩小；空间不足隐藏文案时保留 dot 并提供 title。" },
      { name: "dark-mode", note: "语义色使用令牌自动适配，深浅主题同一语义。" },
    ],
    interaction: [
      "徽标本身不响应点击；点击行或名称跳详情。",
      "进行中状态用 pulse 动效提示仍在变化，完成后立即替换为终态徽标。",
      "同一行最多两个徽标：状态 + 数量，不堆叠第三类标记。",
    ],
    keyboard: [
      "不适用：徽标不进入 Tab 序列。",
      "count 徽标的入口（如通知中心）由相邻 IconButton 承载键盘行为。",
    ],
    accessibility: [
      "状态不只依赖颜色：dot/颜色之外必须有文案或图标。",
      "count 徽标提供 aria-label，如“8 条未读通知”。",
      "pulse 动效遵守 prefers-reduced-motion，降级为静态样式。",
    ],
    responsive: [
      "移动端不缩小字号；空间不足时隐藏文案、保留 dot 并提供 title。",
      "表格状态列保持固定宽度，横向滚动中不被压缩变形。",
    ],
    content: [
      "文案 2–4 字，写结论不写过程：已完成、待复核、失败。",
      "语义与颜色固定绑定：violet 只用于 Agent/模型，不用于其他“特别”标记。",
      "count 只表达未读/待处理数量，不表达总量。",
    ],
    dos: [
      "颜色与语义一一对应，全站统一。",
      "状态未知或未返回时用 neutral 占位。",
      "进行中用 info + pulse，完成即切终态。",
    ],
    donts: [
      "不要用颜色区分业务类型或重要性。",
      "不要给徽标配点击行为。",
      "不要在一行里堆叠三个以上徽标。",
      "不要用徽标代替整段错误说明（用 Alert）。",
    ],
    related: ["tag", "alert", "table", "run-status", "message"],
  },
  {
    id: "tag",
    name: "Tag",
    chineseName: "标签",
    category: "general",
    status: "beta",
    version: "0.1.0",
    purpose: "标记对象的分类、属性或来源，支持关闭与选择，是属性维度的最小载体。",
    usage:
      "用于数据集属性、筛选条件的已选值、用户自定义分类。状态（已完成/失败）用 Badge，不用 Tag；大量选项的管理用 Select。",
    keywords: ["tag", "label", "标签", "分类", "筛选"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "默认标签表达中性属性；语义色只在与 Badge 相同的语义上使用，含义不扩展。",
        code: `<Tag>电解液</Tag>
<Tag color="info">内部数据</Tag>
<Tag color="violet">Agent 标注</Tag>
<Tag color="warning">待确认来源</Tag>`,
        preview: "tag/basic",
      },
      {
        id: "variants",
        title: "可关闭与可选择",
        kind: "variant",
        description: "可关闭用于已选筛选条件；可选择用于多选分类，选中态用填充色而非勾选图标。",
        code: `<Tag closable onClose={() => removeFilter("project")}>项目：project-042</Tag>
<Tag checkable checked={selected} onChange={setSelected}>高温循环</Tag>`,
        preview: "tag/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集属性区：来源、格式用中性标签，Agent 生成的标注用 violet 并注明来源；已选筛选外露为可关闭标签。",
        code: `<div className="dataset-tags">
  <Tag>来源：导入</Tag>
  <Tag>格式：CSV</Tag>
  <Tag color="violet">Agent 标注：含异常点</Tag>
</div>
<FilterBar>
  <Tag closable>状态：进行中</Tag>
  <Tag closable>项目：project-042</Tag>
</FilterBar>`,
        preview: "tag/business",
      },
    ],
    props: [
      { name: "color", type: '"default" | "info" | "success" | "warning" | "danger" | "violet"', default: '"default"', description: "语义色，与 Badge 同一套规则，不扩展含义。" },
      { name: "closable", type: "boolean", default: "false", description: "显示关闭按钮，用于已选条件或可移除属性。" },
      { name: "onClose", type: "() => void", description: "关闭回调；关闭即移除条件并触发对应查询。" },
      { name: "checkable", type: "boolean", default: "false", description: "可选择模式，用于多选分类。" },
      { name: "checked", type: "boolean", description: "checkable 模式下的选中态，受控。" },
      { name: "onChange", type: "(checked: boolean) => void", description: "checkable 模式的选中变化回调。" },
      { name: "children", type: "ReactNode", required: true, description: "标签内容，推荐「维度：值」格式。" },
    ],
    states: [
      { name: "default", note: "中性灰底；语义色仅在与 Badge 相同的含义上使用。" },
      { name: "hover", note: "可关闭/可选择时 hover 加深背景并显示指针；只读标签无 hover。" },
      { name: "focus-visible", note: "可交互标签有 3px 品牌色外发光；只读标签不接收焦点。" },
      { name: "pressed", note: "checkable 点击切换选中，用填充色表达选中，不使用勾选图标。" },
      { name: "disabled", note: "可交互标签禁用时 opacity .45，原因由上下文说明。" },
      { name: "loading", note: "不适用：标签内容的加载由所在区块 Skeleton 承担。", applicable: false },
      { name: "empty", note: "不适用：没有标签时不渲染标签区域，由 Empty 说明。", applicable: false },
      { name: "error", note: "不适用：标签不表达错误；错误用 Badge danger 或 Alert。", applicable: false },
      { name: "permission-limited", note: "无权限修改的属性标签渲染为只读，隐藏关闭按钮。" },
      { name: "mobile", note: "标签组允许换行；单个标签最大宽度 100%，超出截断。" },
      { name: "dark-mode", note: "语义色使用令牌自动适配。" },
    ],
    interaction: [
      "closable 关闭即生效：移除条件并刷新查询，不需要二次确认。",
      "checkable 点击切换选中，用于多选分类筛选。",
      "标签过多时收起为「+N」，展开后逐行展示。",
    ],
    keyboard: [
      "可交互标签进入 Tab 序列；Enter / Space 触发选择或关闭。",
      "关闭按钮不单独设焦点，整个标签是一个交互单元。",
    ],
    accessibility: [
      "checkable 使用 aria-pressed 表达选中态。",
      "closable 标签的 aria-label 说明关闭对象：移除筛选 状态：进行中。",
      "选中态不只依赖颜色，配合字重或边框变化。",
    ],
    responsive: [
      "标签组换行展示，不横向滚动。",
      "移动端单个标签内容超长时截断，完整值由 title 提供。",
    ],
    content: [
      "属性标签格式「维度：值」：来源：导入、格式：CSV。",
      "筛选标签保留维度名，关闭后用户能记住刚才筛了什么。",
      "Agent 生成的标注必须用 violet 并注明来源。",
    ],
    dos: [
      "状态用 Badge，属性用 Tag，分工不混。",
      "已选筛选条件用 closable Tag 外露在 FilterBar。",
      "Agent 标注用 violet 并写明来源。",
    ],
    donts: [
      "不要用 Tag 表达任务状态（用 Badge）。",
      "不要用语义色标记普通分类。",
      "不要让标签承担提交、保存等动作。",
      "不要堆叠超过一行半的标签，超出的收起。",
    ],
    related: ["badge", "filter-bar", "select", "dataset-picker"],
  },
  {
    id: "card",
    name: "Card",
    chineseName: "卡片",
    category: "general",
    status: "stable",
    version: "0.1.0",
    purpose: "把同一主题的内容与动作聚合为一个可扫描、可复用的容器。",
    usage:
      "用于信息分组、指标卡、入口卡与列表项。整页只有一个主题时不要套卡；卡片内不嵌套卡片，分区用 Divider。",
    keywords: ["card", "panel", "卡片", "容器", "分组"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标准结构：标题 + 内容 + 右上角辅助区；一卡最多一个主按钮。",
        code: `<Card title="计算资源" extra={<Link href="#/quota">额度明细</Link>}>
  <p>本月已用 1,280 / 3,000 核时</p>
  <Button variant="secondary" size="sm">申请扩容</Button>
</Card>`,
        preview: "card/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "hoverable 用于整卡可点的入口卡；loading 用骨架屏替换内容但保留卡片框架。",
        code: `<Card hoverable onClick={openProject}>
  <h4>示例项目（project-042）</h4>
  <p>12 个数据集 · 34 次运行</p>
</Card>
<Card title="执行记录" loading />`,
        preview: "card/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目卡：名称 + 状态徽标 + 关键统计 + 行内操作；同类卡片信息结构保持一致，方便横向扫描。",
        code: `<Card title="示例电解液项目" extra={<Badge status="info" text="进行中" />}>
  <p>目标：筛选高温稳定配方</p>
  <Statistic title="数据集" value={12} />
  <Statistic title="运行次数" value={34} />
  <Button size="sm" variant="ghost">查看详情</Button>
</Card>`,
        preview: "card/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", description: "卡片标题；无标题卡片用于纯指标或纯媒体。" },
      { name: "extra", type: "ReactNode", description: "右上角辅助区，放链接或状态徽标，不放主按钮。" },
      { name: "hoverable", type: "boolean", default: "false", description: "整卡可点的入口卡样式，必须配合 onClick 使用。" },
      { name: "loading", type: "boolean", default: "false", description: "骨架屏替换内容，卡片框架与尺寸保留。" },
      { name: "bordered", type: "boolean", default: "true", description: "是否显示边框；灰色背景上可关闭边框用投影分层。" },
      { name: "onClick", type: "() => void", description: "hoverable 卡片的点击回调；卡内独立动作要阻止冒泡。" },
      { name: "children", type: "ReactNode", required: true, description: "卡片内容；复杂内容用 Divider 分区，不嵌套卡片。" },
    ],
    states: [
      { name: "default", note: "白底、1px 边框、圆角遵循 radius 令牌，内边距 16px。" },
      { name: "hover", note: "hoverable 卡片 hover 时边框提亮并轻微上浮；普通卡片无 hover。" },
      { name: "focus-visible", note: "整卡可点时卡片可聚焦，3px 品牌色外发光。" },
      { name: "pressed", note: "整卡可点时按下回到原位置，不使用缩放。" },
      { name: "disabled", note: "不适用：卡片是容器；内部动作的禁用由动作自身表达。", applicable: false },
      { name: "loading", note: "内容替换为 Skeleton，卡片框架、标题与尺寸保留，不闪烁。" },
      { name: "empty", note: "空内容区块用小尺寸 Empty，卡片框架保留。" },
      { name: "error", note: "加载失败在内容区给出错误与重试，卡片框架保留。" },
      { name: "permission-limited", note: "无权限的卡片内容整体替换为权限提示，不渲染半张卡。" },
      { name: "mobile", note: "卡片网格在 <760px 降为单列；内边距保持 16px。" },
      { name: "dark-mode", note: "surface/line/shadow 令牌自动适配，不手写两套色。" },
    ],
    interaction: [
      "整卡可点（hoverable）时，卡内不再放第二个跳转链接；独立动作阻止冒泡。",
      "一卡一个主题；同类卡片保持相同的信息结构，方便横向扫描。",
      "加载、空、错误都只替换内容区，框架不动。",
    ],
    keyboard: [
      "hoverable 卡片进入 Tab 序列，Enter 触发 onClick。",
      "卡内动作的焦点顺序先内容后操作，与视觉顺序一致。",
    ],
    accessibility: [
      "整卡可点使用 <a> 或 role=\"link\" 加 aria-label，不用裸 div onClick。",
      "标题使用真实标题标签（h3/h4），不跳级。",
      "loading 时设置 aria-busy=\"true\"。",
    ],
    responsive: [
      "卡片网格 3 列 → 2 列（<1100px）→ 1 列（<760px）。",
      "卡片不设固定高度，由内容撑开，同行卡片等高。",
    ],
    content: [
      "标题写名词短语：计算资源、执行记录，不写句子。",
      "辅助区（extra）放链接或状态徽标，不放第二个按钮。",
      "同类卡片之间的字段顺序保持一致。",
    ],
    dos: [
      "一卡一个主题，信息结构统一。",
      "加载用骨架屏替换内容，保留卡片框架。",
      "入口卡使用 hoverable 并给出明确反馈。",
    ],
    donts: [
      "不要卡片嵌套卡片。",
      "不要在一张卡里放两个主按钮。",
      "不要用卡片包裹整页唯一内容。",
      "不要给普通（非入口）卡片加点击跳转。",
    ],
    related: ["empty", "skeleton", "statistic", "divider", "button"],
  },
  {
    id: "empty",
    name: "Empty",
    chineseName: "空状态",
    category: "general",
    status: "beta",
    version: "0.1.0",
    purpose: "在没有内容可展示时告诉用户发生了什么、是否需要操作、下一步做什么。",
    usage:
      "用于列表无数据、筛选无结果、未选择对象等场景。错误导致的无内容用 Result 或 Alert；加载中用 Skeleton；无权限用 Result（403）。",
    keywords: ["empty", "blank", "空状态", "无数据", "缺省页"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "空状态三要素：发生了什么（还没有实验记录）、是否需要操作（需要）、下一步（新建实验）。",
        code: `<Empty
  title="还没有实验记录"
  description="创建第一个实验后，数据会展示在这里。"
  action={<Button variant="primary">新建实验</Button>}
/>`,
        preview: "empty/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "筛选无结果与无数据是两种空态：前者给「清除筛选」，后者给创建入口；行内小空态用 size=\"sm\"。",
        code: `<Empty
  variant="no-result"
  title="没有符合条件的结果"
  description="尝试调整筛选条件或关键字。"
  action={<Button variant="secondary">清除筛选</Button>}
/>
<Empty size="sm" description="暂无附件" />`,
        preview: "empty/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目详情页的数据集列表：区分「项目还没有数据集」与「筛选后没有结果」，文案与动作不同。",
        code: `<Empty
  title="示例项目（project-042）还没有数据集"
  description="导入或新建数据集后即可开始计算。"
  action={<Button variant="primary">导入数据集</Button>}
/>
<Empty
  variant="no-result"
  title="没有符合「进行中」的数据集"
  description="当前筛选条件下没有结果。"
  action={<Button variant="ghost">清除筛选</Button>}
/>`,
        preview: "empty/business",
      },
    ],
    props: [
      { name: "title", type: "string", required: true, description: "发生了什么；一句话，写对象不写情绪。" },
      { name: "description", type: "string", description: "是否需要操作的补充说明；一句话。" },
      { name: "action", type: "ReactNode", description: "下一步动作；最多一个按钮，不需要动作时省略。" },
      { name: "variant", type: '"no-data" | "no-result"', default: '"no-data"', description: "no-data 无数据，no-result 筛选/搜索无结果。" },
      { name: "size", type: '"md" | "sm"', default: '"md"', description: "sm 用于表格单元格、卡片内的行内空态，只保留说明文字。" },
      { name: "image", type: "ReactNode", description: "可选插画；默认使用统一空态插画，不替换为彩色图片。" },
    ],
    states: [
      { name: "default", note: "居中：插画 + 标题 + 说明 + 动作，三要素齐全。" },
      { name: "hover", note: "不适用：空状态本身不可交互，仅 action 按钮有 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：空状态容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：空状态容器无按压态。", applicable: false },
      { name: "disabled", note: "不适用：空状态无禁用态。", applicable: false },
      { name: "loading", note: "不适用：加载中用 Skeleton，不允许空态与骨架屏来回闪烁。", applicable: false },
      { name: "empty", note: "Empty 本身就是空态的表达；数据到达后原位替换为内容，布局不跳动。" },
      { name: "error", note: "错误不是空态：加载失败用 Result 或 Alert 给出原因与重试。" },
      { name: "permission-limited", note: "无权限不是空态：用 Result（403）说明所需权限与联系人。" },
      { name: "mobile", note: "插画缩小、文案保持完整，动作按钮宽度 100%。" },
      { name: "dark-mode", note: "插画使用单色系，随 muted 令牌适配。" },
    ],
    interaction: [
      "action 最多一个；空状态不承担教学任务，不放图文教程。",
      "数据到达后内容原位替换，空态与内容的高度尽量接近，避免布局跳动。",
      "筛选无结果时保留筛选栏可见，不清空用户已输入的条件。",
    ],
    keyboard: [
      "action 按钮正常进入 Tab 序列。",
      "空状态容器不接收焦点，屏幕阅读器以文本朗读标题与说明。",
    ],
    accessibility: [
      "插画 aria-hidden，信息由标题与说明文本承载。",
      "标题使用描述性文本，不只显示图标或插画。",
    ],
    responsive: [
      "移动端插画宽度 ≤ 120px，标题与说明不截断。",
      "action 按钮在窄屏全宽。",
    ],
    content: [
      "三要素齐全：发生了什么、是否需要操作、下一步。",
      "标题写对象与事实：还没有实验记录、没有符合条件的结果。",
      "不写“空空如也”这类情绪化文案；不写“数据加载失败”（那是错误态）。",
    ],
    dos: [
      "区分无数据与筛选无结果，动作不同。",
      "给得出下一步时提供唯一动作按钮。",
      "行内小空态用 size=\"sm\"，只保留说明文字。",
    ],
    donts: [
      "不要用空状态代替错误提示。",
      "不要放多个动作按钮或教学长文。",
      "不要让空态与骨架屏交替闪烁。",
      "不要在表格单元格里放整版空状态（用 sm）。",
    ],
    related: ["result", "skeleton", "button", "table", "card"],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    chineseName: "骨架屏",
    category: "general",
    status: "beta",
    version: "0.1.0",
    purpose: "在数据到达前按真实内容的布局占位，让加载前后结构一致、不闪烁、不跳动。",
    usage:
      "用于首屏加载与区块级加载（表格、卡片、详情）。超过 10 秒的长任务用 Progress + 日志反馈进度；局部刷新保留旧数据并配合 Spin，不用骨架屏整区替换。",
    keywords: ["skeleton", "loading", "骨架屏", "加载占位", "占位"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "骨架形状与真实内容一一对应：标题条、正文行、按钮位；行数与真实内容接近。",
        code: `<Skeleton loading={isLoading} rows={3} avatar>
  <ProjectSummary projectId="project-042" />
</Skeleton>`,
        preview: "skeleton/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "表格骨架保留表头与列结构；卡片骨架保留卡片框架，只替换内容区。",
        code: `<Skeleton loading variant="table" rows={4} />
<Skeleton loading variant="card" />`,
        preview: "skeleton/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "加载完成后内容原位替换骨架：标题、统计、状态列位置不动，用户视线不需要重新定位。",
        code: `<Skeleton loading={isLoading} variant="table" rows={4}>
  <Table columns={runColumns} dataSource={runs} />
</Skeleton>`,
        fullCode: `function RunList() {
  const { data, isLoading } = useRuns("project-042"); // synthetic: run-28003 等
  return (
    <Skeleton loading={isLoading} variant="table" rows={4}>
      <Table columns={runColumns} dataSource={data} />
    </Skeleton>
  );
}`,
        preview: "skeleton/business",
      },
    ],
    props: [
      { name: "loading", type: "boolean", required: true, description: "为 true 时渲染骨架，false 时原位渲染 children。" },
      { name: "variant", type: '"text" | "table" | "card"', default: '"text"', description: "骨架形态，按真实内容结构选择。" },
      { name: "rows", type: "number", default: "3", description: "占位行数，与真实内容行数接近，避免高度差。" },
      { name: "avatar", type: "boolean", default: "false", description: "前置圆形占位，用于带头像/图标的列表项。" },
      { name: "active", type: "boolean", default: "true", description: "呼吸动效；局部频繁刷新场景可关闭减少干扰。" },
      { name: "children", type: "ReactNode", description: "加载完成后原位渲染的真实内容。" },
    ],
    states: [
      { name: "default", note: "浅灰占位条，形状与真实内容对应，使用呼吸动效。" },
      { name: "hover", note: "不适用：骨架屏不可交互。", applicable: false },
      { name: "focus-visible", note: "不适用：骨架屏不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：骨架屏无按压态。", applicable: false },
      { name: "disabled", note: "不适用：骨架屏无禁用态。", applicable: false },
      { name: "loading", note: "骨架屏即加载态本身：占位高度与真实内容接近，加载完成原位替换，不闪烁。" },
      { name: "empty", note: "加载完成且无数据时切换到 Empty，骨架与空态不叠加出现。" },
      { name: "error", note: "加载失败切换到错误提示与重试，骨架消失而不是停在半加载。" },
      { name: "permission-limited", note: "请求返回无权限时直接渲染权限提示，不先渲染骨架再替换。" },
      { name: "mobile", note: "骨架行数随视口减少，保证首屏一屏内完成占位。" },
      { name: "dark-mode", note: "占位色使用 surface-soft 令牌，深浅主题都有足够对比。" },
    ],
    interaction: [
      "骨架占位的高度、列宽与真实内容一致，替换瞬间布局零位移。",
      "加载超过 10 秒必须切换为 Progress 或日志反馈，不让骨架无限呼吸。",
      "局部刷新（如轮询状态列）保留旧数据，用 Spin 或静默更新，不闪骨架。",
      "骨架屏期间页面上已可用的操作（筛选、导航）保持可用。",
    ],
    keyboard: [
      "不适用：骨架屏不进入 Tab 序列；加载完成后焦点位置保持不丢。",
      "加载过程的焦点管理由所在页面负责，骨架自身不抢焦点。",
    ],
    accessibility: [
      "骨架容器设置 aria-busy=\"true\"，并对读屏器隐藏占位条。",
      "呼吸动效遵守 prefers-reduced-motion，降级为静态占位。",
      "不用骨架屏代替进度提示：长任务必须可读地反馈进度。",
    ],
    responsive: [
      "移动端骨架行数减少，优先保证首屏结构完整。",
      "表格骨架在窄屏保留首列与状态列，其余列合并为宽条。",
    ],
    content: [
      "骨架条不写文字，不放「加载中…」文案。",
      "占位行数贴近真实内容，列表按 3–5 行占位。",
      "同一屏的多个加载区块统一节奏，不各自乱闪。",
    ],
    dos: [
      "按真实内容结构选择 variant 与行数。",
      "内容原位替换骨架，保持布局不动。",
      "长任务超时切换为 Progress 或日志反馈。",
    ],
    donts: [
      "不要用全屏 spinner 代替骨架屏。",
      "不要让骨架与空状态交替闪烁。",
      "不要在局部轮询刷新时整区重渲骨架。",
      "不要给骨架条加文字或图标。",
    ],
    related: ["spin", "progress", "empty", "card", "table"],
  },
  {
    id: "result",
    name: "Result",
    chineseName: "结果页",
    category: "general",
    status: "beta",
    version: "0.1.0",
    purpose: "在流程结束或整页异常时给出明确结论、原因说明与后续动作。",
    usage:
      "用于提交成功、整页错误、404、403 等页面级结论。局部错误用 Alert 或 Message；无数据用 Empty；流程中的状态用 Badge 或 RunStatus。",
    keywords: ["result", "success", "error", "404", "403", "结果页", "结论"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "四种语义结论：success 成功、info 提示、warning 需注意、danger 失败；图标与语义色绑定。",
        code: `<Result status="success" title="任务已提交" description="任务 ID：run-28003" />
<Result status="info" title="正在排队" />
<Result status="warning" title="部分字段待复核" />
<Result status="danger" title="任务失败" />`,
        preview: "result/basic",
      },
      {
        id: "variants",
        title: "页面级异常",
        kind: "variant",
        description: "404 与 403 是固定变体：文案与动作预置，不允许自由改写。",
        code: `<Result status="404" />
<Result status="403" />`,
        preview: "result/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算任务后的结论页：回显任务 ID 与影响范围，给出追踪入口与返回动作。",
        code: `<Result
  status="success"
  title="计算任务已提交"
  description="任务 run-28003 已加入队列，将使用 示例项目（project-042）的额度。"
  actions={[
    <Button key="track" variant="primary">查看任务状态</Button>,
    <Button key="back" variant="secondary">返回任务列表</Button>,
  ]}
/>`,
        preview: "result/business",
      },
    ],
    props: [
      { name: "status", type: '"success" | "info" | "warning" | "danger" | "404" | "403"', required: true, description: "结论类型；404/403 为预置页面级变体。" },
      { name: "title", type: "string", required: true, description: "结论文案，一句话说明结果。" },
      { name: "description", type: "string", description: "原因或影响范围的补充说明；失败时写清原因。" },
      { name: "actions", type: "ReactNode", description: "后续动作，最多两个按钮，主按钮指向下一步。" },
      { name: "extra", type: "ReactNode", description: "可选补充信息区，如任务 ID、引用或日志摘要。" },
    ],
    states: [
      { name: "default", note: "居中：语义图标 + 标题 + 说明 + 动作，图标与语义色绑定。" },
      { name: "hover", note: "不适用：结果页容器不可交互，仅动作按钮有 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：结果页容器不接收焦点；动作按钮正常聚焦。", applicable: false },
      { name: "pressed", note: "不适用：结果页容器无按压态。", applicable: false },
      { name: "disabled", note: "不适用：结果页无禁用态。", applicable: false },
      { name: "loading", note: "提交进行中不渲染结果页，用 Button loading 或 Progress；结论确定后立即出现。" },
      { name: "empty", note: "不适用：无数据场景用 Empty；结果页必须有明确结论。", applicable: false },
      { name: "error", note: "danger 状态即错误结论：写清失败原因、影响与重试入口。" },
      { name: "permission-limited", note: "403 变体说明所需权限与联系人入口，不只写「无权限」。" },
      { name: "mobile", note: "图标与文案居中，动作按钮纵向排列全宽。" },
      { name: "dark-mode", note: "语义色与图标使用令牌自动适配。" },
    ],
    interaction: [
      "结果页出现后焦点移到标题，读屏器首先朗读结论。",
      "动作最多两个：下一步（主）+ 返回/关闭（次）。",
      "失败结果必须给出可重试或人工接管的入口，不做死路页面。",
      "404/403 使用预置文案与动作，业务不自由改写。",
    ],
    keyboard: [
      "动作按钮按视觉顺序进入 Tab 序列。",
      "页面加载完成焦点落在结果标题（tabindex=-1），Esc 不关闭结果页。",
    ],
    accessibility: [
      "图标 aria-hidden，结论由标题文本承载。",
      "使用 role=\"status\"（成功/提示）或 role=\"alert\"（失败）向读屏器宣告。",
      "不只用颜色与图标表达结论，标题必须写清结果。",
    ],
    responsive: [
      "移动端动作按钮纵向全宽排列。",
      "标题与说明不截断，图标尺寸缩小一档。" ,
    ],
    content: [
      "标题写结论：任务已提交、任务失败；说明写原因与影响范围。",
      "成功结论回显关键 ID（任务 run-28003），方便追踪。",
      "失败说明写清下一步：重试、修改输入或联系负责人。",
    ],
    dos: [
      "结论页回显任务 ID 与影响范围。",
      "失败给出重试或人工接管入口。",
      "404/403 使用预置变体。",
    ],
    donts: [
      "不要用结果页表达局部错误（用 Alert/Message）。",
      "不要放三个以上动作。",
      "不要只显示图标不配结论文案。",
      "不要让成功页缺少返回或继续操作的出口。",
    ],
    related: ["empty", "alert", "button", "message", "progress"],
  },
];
