import type { ComponentDoc } from "../types";

/** 布局 + 导航组件。 */
export const layoutNavComponents: ComponentDoc[] = [
  {
    id: "layout",
    name: "Layout",
    chineseName: "页面骨架",
    category: "layout",
    status: "stable",
    version: "0.1.0",
    purpose: "定义应用骨架：侧边导航、顶栏与内容区的固定结构，所有页面共享同一副骨架。",
    usage:
      "用于平台级页面框架，每个页面只出现一次。页面内部的区块排列用 Stack 或 Grid；内容区需要可拖拽分栏时用 Splitter；弹窗、抽屉和卡片内部不要再嵌套一层 Layout。",
    keywords: ["layout", "shell", "sider", "header", "布局", "骨架", "框架", "侧边栏"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "侧边导航 + 顶栏 + 内容区，三块区域的位置与尺寸由骨架统一约束。",
        code: `<Layout
  sider={<AppMenu selectedKey="runs" />}
  header={<TopBar />}
  contentWidth="wide"
>
  <RunListPage />
</Layout>`,
        preview: "layout/basic",
      },
      {
        id: "content-width",
        title: "内容区宽度",
        kind: "variant",
        description: "narrow 给表单与文档，wide 给列表与工作台，full 只给看板与图谱类页面。",
        code: `<Layout contentWidth="narrow">…最大 880px</Layout>
<Layout contentWidth="wide">…最大 1240px</Layout>
<Layout contentWidth="full">…全宽</Layout>`,
        preview: "layout/content-width",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目工作台的完整骨架：项目级导航、面包屑顶栏与宽版内容区。",
        code: `<Layout
  sider={<ProjectMenu projectId="project-042" />}
  header={
    <TopBar
      breadcrumb={[
        { title: "项目", href: "/projects" },
        { title: "示例项目" },
      ]}
    />
  }
  contentWidth="wide"
>
  <RunListPage projectId="project-042" />
</Layout>`,
        preview: "layout/business",
      },
    ],
    props: [
      { name: "sider", type: "ReactNode", description: "侧边导航区，桌面端固定 264px，移动端折叠为抽屉。" },
      { name: "header", type: "ReactNode", description: "顶栏，高 60px 吸顶，通常放面包屑与全局动作。" },
      { name: "contentWidth", type: '"narrow" | "wide" | "full"', default: '"wide"', description: "内容区最大宽度：880px / 1240px / 全宽。" },
      { name: "siderCollapsible", type: "boolean", default: "true", description: "是否允许用户把侧边栏折叠为窄条；折叠状态跨页面记忆。" },
      { name: "children", type: "ReactNode", required: true, description: "页面内容，渲染在内容区内。" },
    ],
    states: [
      { name: "default", note: "三区域位置固定；内容区居中并受 contentWidth 约束。" },
      { name: "hover", note: "不适用：骨架不响应 hover，交互由内部组件各自处理。", applicable: false },
      { name: "focus-visible", note: "不适用：骨架不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：骨架不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：骨架没有禁用态。", applicable: false },
      { name: "loading", note: "首屏加载在内容区渲染骨架屏，不做整页白屏替换。" },
      { name: "empty", note: "不适用：空数据由内容区的 Empty 组件表达。", applicable: false },
      { name: "error", note: "页面级错误在内容区用 Result 呈现，骨架与导航保留以便返回。" },
      { name: "permission-limited", note: "无权限的导航入口在 Menu 中禁用，骨架结构不因此改变。" },
      { name: "mobile", note: "≤760px 侧边栏折叠为抽屉，顶栏保留，内容区全宽。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不为骨架单独配色。" },
    ],
    interaction: [
      "页面切换时骨架保持稳定，只有内容区更新，不整页闪烁。",
      "侧边栏折叠状态跨页面记忆，重新进入时保持。",
      "顶栏吸顶，长页面滚动时面包屑与全局动作始终可见。",
    ],
    keyboard: [
      "提供跳转主内容的 skip link，键盘用户可跳过整段导航。",
      "侧边栏抽屉打开时 Esc 关闭，并把焦点归还给触发按钮。",
    ],
    accessibility: [
      "使用 <nav>、<header>、<main> 语义标签，每页有且只有一个 <main>。",
      "侧边栏抽屉的触发按钮设置 aria-expanded，打开后焦点进入抽屉。",
    ],
    responsive: [
      "≤1100px 隐藏辅助侧栏，内容区单列。",
      "≤760px 侧边栏折叠为抽屉，内容区左右内边距收缩到 16px。",
    ],
    content: [
      "顶栏左侧永远放面包屑或页面位置，不放营销文案。",
      "全局动作（搜索、主题、帮助）固定在顶栏右侧，位置跨页面一致。",
    ],
    dos: [
      "所有页面共享同一副骨架，区域位置不随页面变化。",
      "按页面类型选择 contentWidth，避免超宽屏下文字行过长。",
      "首屏加载用骨架屏占位，保持布局稳定。",
    ],
    donts: [
      "不要在页面或弹窗内部再嵌套一层 Layout。",
      "不要让顶栏动作的位置在不同页面间漂移。",
      "不要在小屏上把侧边栏强行常驻挤压内容区。",
    ],
    related: ["menu", "breadcrumb", "page-header", "stack", "grid"],
  },
  {
    id: "stack",
    name: "Stack",
    chineseName: "堆叠布局",
    category: "layout",
    status: "stable",
    version: "0.1.0",
    purpose: "沿一个方向（垂直或水平）排列子元素并统一间距，是使用频率最高的局部布局工具。",
    usage:
      "用于表单字段、按钮组、卡片列表等一维排列。二维行列关系用 Grid；需要拖拽调整两个区域的比例用 Splitter；整页骨架用 Layout，不要用 Stack 模拟。",
    keywords: ["stack", "flex", "gap", "间距", "堆叠", "排列"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "垂直堆叠，子元素间距全部来自 gap，不在子元素上写 margin。",
        code: `<Stack gap={12}>
  <RunCard runId="run-28003" />
  <RunCard runId="run-28002" />
</Stack>`,
        preview: "stack/basic",
      },
      {
        id: "variants",
        title: "方向与对齐",
        kind: "variant",
        description: "horizontal 用于按钮组；justify 控制主轴分布，align 控制交叉轴对齐。",
        code: `<Stack direction="horizontal" gap={8} align="center">
  <Button variant="primary">提交任务</Button>
  <Button variant="secondary">保存草稿</Button>
</Stack>
<Stack direction="horizontal" justify="space-between">
  <span>第 3 轮优化</span>
  <Badge status="success">已完成</Badge>
</Stack>`,
        preview: "stack/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据校验区块：标题、警告与动作组用 Stack 分层，间距表达信息亲疏。",
        code: `<Stack gap={16}>
  <Stack gap={4}>
    <h3>数据校验</h3>
    <p>对数据集 ds-118 的 3 个必填字段做完整性检查</p>
  </Stack>
  <Alert type="warning">2 条记录缺少测试温度</Alert>
  <Stack direction="horizontal" gap={8}>
    <Button variant="primary">继续导入</Button>
    <Button variant="ghost">返回修改</Button>
  </Stack>
</Stack>`,
        preview: "stack/business",
      },
    ],
    props: [
      { name: "direction", type: '"vertical" | "horizontal"', default: '"vertical"', description: "排列方向。" },
      { name: "gap", type: "number", default: "12", description: "子元素间距，必须取间距令牌值（4 的倍数）。" },
      { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "交叉轴对齐方式。" },
      { name: "justify", type: '"start" | "center" | "end" | "space-between"', default: '"start"', description: "主轴分布方式。" },
      { name: "wrap", type: "boolean", default: "true", description: "水平排列空间不足时是否换行。" },
    ],
    states: [
      { name: "default", note: "子元素间距全部来自 gap，间距单一来源。" },
      { name: "hover", note: "不适用：Stack 是布局容器，不响应 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：容器不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：禁用由子组件各自表达。", applicable: false },
      { name: "loading", note: "不适用：加载态由子组件（Skeleton、Button）表达。", applicable: false },
      { name: "empty", note: "无子元素时容器塌缩为 0 高度，不留占位间距。" },
      { name: "error", note: "不适用：错误由子组件或 Alert 表达。", applicable: false },
      { name: "permission-limited", note: "不适用：权限由子组件各自处理。", applicable: false },
      { name: "mobile", note: "水平 Stack 在窄屏自动换行；按钮组允许整组换行且主动作在最前。" },
      { name: "dark-mode", note: "无颜色属性，自动继承主题。" },
    ],
    interaction: [
      "同级元素间距一致，层级亲疏靠 gap 大小表达，不靠新增颜色或分割线。",
      "不在 Stack 子元素上再写 margin，避免间距出现两个来源。",
    ],
    keyboard: [
      "不改变焦点顺序，子元素的 Tab 顺序与 DOM 顺序一致。",
      "不拦截任何按键，键盘行为完全由子组件决定。",
    ],
    accessibility: [
      "纯视觉容器，不添加 aria 角色；有列表语义时用 <ul>/<li> 而不是 Stack 包 <div>。",
      "不依靠视觉顺序颠倒 DOM 顺序，读屏顺序与视觉顺序保持一致。",
    ],
    responsive: [
      "水平 Stack 在窄屏允许换行，换行后间距仍由 gap 提供。",
      "gap 不随断点缩小，密度差异通过更换令牌值表达。",
    ],
    content: [
      "一组之内只放同一层级的内容，不把页脚和标题混在一组。",
      "间距表达亲疏：同组 8–12，分组之间 16–24。",
    ],
    dos: [
      "间距只用令牌值，禁止魔法数字。",
      "按钮组统一 horizontal + gap 8。",
      "表单字段垂直堆叠，gap 12–16。",
    ],
    donts: [
      "不要混用 margin 与 gap 制造双重间距。",
      "不要用嵌套 Stack 模拟 Grid 的二维对齐。",
      "不要为单个子元素包一层没有作用的 Stack。",
    ],
    related: ["grid", "layout", "divider", "button", "form"],
  },
  {
    id: "grid",
    name: "Grid",
    chineseName: "栅格",
    category: "layout",
    status: "stable",
    version: "0.1.0",
    purpose: "用 12 列栅格组织二维布局，让卡片与统计块在不同断点下保持对齐。",
    usage:
      "用于卡片矩阵、仪表盘统计块、多列表单等二维排列。单一方向的排列用 Stack；整页骨架用 Layout；两个区域间需要拖拽调整用 Splitter。",
    keywords: ["grid", "栅格", "列", "span", "断点", "卡片矩阵"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "12 列栅格，三张统计卡片各占 4 列，同排高度自动对齐。",
        code: `<Grid cols={12} gap={12}>
  <Grid.Cell span={4}><StatisticCard title="运行中任务" value={3} /></Grid.Cell>
  <Grid.Cell span={4}><StatisticCard title="本周完成" value={21} /></Grid.Cell>
  <Grid.Cell span={4}><StatisticCard title="失败待处理" value={1} /></Grid.Cell>
</Grid>`,
        preview: "grid/basic",
      },
      {
        id: "responsive",
        title: "响应式列宽",
        kind: "variant",
        description: "span 按断点给出：宽屏一行四个，中屏两个，窄屏单列。",
        code: `<Grid cols={12} gap={12}>
  <Grid.Cell span={{ base: 12, md: 6, lg: 3 }}><ProjectCard /></Grid.Cell>
  <Grid.Cell span={{ base: 12, md: 6, lg: 3 }}><ProjectCard /></Grid.Cell>
</Grid>`,
        preview: "grid/responsive",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目卡片矩阵：卡片结构一致，数量变化时先行后列，不留错位空洞。",
        code: `<Grid cols={12} gap={12}>
  {projects.map((project) => (
    <Grid.Cell key={project.id} span={{ base: 12, md: 6, lg: 4 }}>
      <ProjectCard
        name={project.name}
        id={project.id}
        runCount={project.runCount}
      />
    </Grid.Cell>
  ))}
</Grid>`,
        fullCode: `<Grid cols={12} gap={12}>
  <Grid.Cell span={{ base: 12, md: 6, lg: 4 }}>
    <ProjectCard name="示例项目" id="project-042" runCount={28} />
  </Grid.Cell>
  <Grid.Cell span={{ base: 12, md: 6, lg: 4 }}>
    <ProjectCard name="电解液筛选" id="project-051" runCount={12} />
  </Grid.Cell>
  <Grid.Cell span={{ base: 12, md: 6, lg: 4 }}>
    <ProjectCard name="正极材料库" id="project-063" runCount={45} />
  </Grid.Cell>
</Grid>`,
        preview: "grid/business",
      },
    ],
    props: [
      { name: "cols", type: "number", default: "12", description: "总列数，全站统一为 12，不自定义其他列数。" },
      { name: "gap", type: "number", default: "12", description: "行列间距，取间距令牌值。" },
      { name: "span", type: "number | { base?: number; md?: number; lg?: number }", required: true, description: "Grid.Cell 占据的列数，可按断点给出。" },
    ],
    states: [
      { name: "default", note: "列宽按 cols 等分，同排单元格高度对齐。" },
      { name: "hover", note: "不适用：栅格是布局容器，不响应 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：容器不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：禁用由卡片内组件表达。", applicable: false },
      { name: "loading", note: "用与栅格一致的 Skeleton 卡片占位，行列结构不跳动。" },
      { name: "empty", note: "数据为空时整个栅格区域替换为 Empty，不留半排空卡片。" },
      { name: "error", note: "区域级错误整体替换为 Result + 重试，不在单个格子里报错。" },
      { name: "permission-limited", note: "无权限时整个区域换为权限说明，不渲染残缺的卡片矩阵。" },
      { name: "mobile", note: "列数按断点递减：lg 一行 3–4 个卡片，base 单列堆叠。" },
      { name: "dark-mode", note: "无颜色属性，自动继承主题。" },
    ],
    interaction: [
      "同排单元格高度对齐，内容多少不影响整排基线。",
      "卡片数量变化时先行后列补齐，不出现错位空洞。",
    ],
    keyboard: [
      "容器不参与焦点顺序，卡片内交互元素按先行后列的顺序 Tab。",
      "不拦截方向键，键盘行为由单元格内组件决定。",
    ],
    accessibility: [
      "卡片矩阵有列表语义时容器用 role=\"list\"、单元格用 role=\"listitem\"。",
      "不用栅格颠倒视觉与读屏顺序，DOM 顺序即阅读顺序。",
    ],
    responsive: [
      "断点：lg ≥1100px，md ≥760px，base <760px。",
      "卡片最小宽度 240px，不足时减列而不是压缩卡片。",
    ],
    content: [
      "同屏卡片表达同一类信息，不混放导航卡片与数据卡片。",
      "卡片内的数字格式与对齐规则由 Statistic 负责，不在格子里自定义。",
    ],
    dos: [
      "全站统一 12 列，span 取 12 的约数或按断点给出。",
      "卡片矩阵配 Skeleton 保持加载前后结构一致。",
      "统计块、项目卡片这类同质内容优先用 Grid。",
    ],
    donts: [
      "不要用 Grid 做一维排列（那是 Stack 的职责）。",
      "不要自定义 24 列等其他列数体系。",
      "不要让同一排卡片高度参差不齐。",
    ],
    related: ["stack", "layout", "card", "statistic", "skeleton"],
  },
  {
    id: "splitter",
    name: "Splitter",
    chineseName: "分栏器",
    category: "layout",
    status: "experimental",
    version: "0.1.0",
    purpose: "把内容区拆成两个可拖拽调整的面板，让用户按任务需要自行分配空间。",
    usage:
      "用于主从结构的双栏场景：任务列表 + 日志详情、编辑器 + 预览。固定比例的布局用 Grid；只做视觉分隔用 Divider；窄屏不要用 Splitter，回退为上下堆叠或 Tabs。",
    keywords: ["splitter", "resizable", "分栏", "拖拽", "面板", "双栏"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "拖动中间分隔条实时调整两侧比例，比例受 min / max 约束。",
        code: `<Splitter defaultSize="32%" min={240} max={480}>
  <RunList projectId="project-042" />
  <RunDetail runId="run-28003" />
</Splitter>`,
        preview: "splitter/basic",
      },
      {
        id: "limits",
        title: "尺寸限制与收起",
        kind: "variant",
        description: "min / max 用像素约束面板；collapsible 允许把一侧面板收起。",
        code: `<Splitter
  defaultSize={280}
  min={240}
  max={560}
  collapsible
  onResize={(size) => savePanelSize(size)}
>
  <RunList projectId="project-042" />
  <RunDetail runId="run-28003" />
</Splitter>`,
        preview: "splitter/limits",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务日志查看器：左侧选任务，右侧看日志，拖拽比例按用户记忆。",
        code: `<Splitter defaultSize="40%" min={320} onResize={savePanelSize}>
  <RunList
    projectId="project-042"
    selectedRunId={runId}
    onSelect={setRunId}
  />
  <LogViewer runId={runId} follow />
</Splitter>`,
        preview: "splitter/business",
      },
    ],
    props: [
      { name: "defaultSize", type: "number | string", default: '"50%"', description: "首个面板的初始尺寸，像素或百分比。" },
      { name: "min", type: "number", description: "首个面板的最小像素宽度，到达后阻止继续拖拽。" },
      { name: "max", type: "number", description: "首个面板的最大像素宽度。" },
      { name: "collapsible", type: "boolean", default: "false", description: "是否允许把一侧面板收起为 0。" },
      { name: "onResize", type: "(size: number) => void", description: "拖拽结束回调，用于持久化用户偏好。" },
    ],
    states: [
      { name: "default", note: "分隔条视觉 4px、命中区 ≥12px，把手指示可拖拽。" },
      { name: "hover", note: "分隔条变为品牌色，光标变为 col-resize。" },
      { name: "focus-visible", note: "把手可聚焦，3px 品牌色外发光。" },
      { name: "pressed", note: "拖拽中实时更新面板尺寸，松手后触发 onResize。" },
      { name: "disabled", note: "锁定比例时隐藏把手，禁止拖拽与键盘调整。" },
      { name: "loading", note: "不适用：面板内容加载由各自面板内的 Skeleton 表达。", applicable: false },
      { name: "empty", note: "面板为空时在面板内部放 Empty，面板尺寸保持不塌缩。" },
      { name: "error", note: "单侧面板错误用面板内 Alert + 重试，不影响另一侧。" },
      { name: "permission-limited", note: "不适用：权限由面板内组件各自处理。", applicable: false },
      { name: "mobile", note: "≤760px 回退为上下堆叠或 Tabs，禁用拖拽。" },
      { name: "dark-mode", note: "分隔条与把手使用语义令牌，自动适配。" },
    ],
    interaction: [
      "拖拽实时反馈，不做松手才跳转的盲拖。",
      "双击把手恢复默认尺寸；调整后的比例按用户记忆。",
      "两侧必须是主从关系，主面板变化时从面板内容联动更新。",
    ],
    keyboard: [
      "把手可聚焦，左右方向键按 10px 步进调整，Shift + 方向键按 50px 步进。",
      "Home 恢复默认尺寸，End 收起至最小。",
    ],
    accessibility: [
      "把手使用 role=\"separator\" 并带 aria-orientation。",
      "aria-valuenow 实时报告当前比例，读屏可感知拖拽结果。",
    ],
    responsive: [
      "≤760px 禁用拖拽，布局回退为上下堆叠。",
      "min 不小于 240px，保证主面板在任何宽度下可用。",
    ],
    content: [
      "两侧面板必须是主从关系（列表-详情、输入-预览），不拼两个无关模块。",
      "面板标题说明内容，从面板标题随主面板选中项联动。",
    ],
    dos: [
      "给主面板设置 min，防止拖到不可用宽度。",
      "用 onResize 持久化用户调整过的比例。",
      "窄屏主动回退为堆叠布局。",
    ],
    donts: [
      "不要嵌套两层以上 Splitter。",
      "不要把 Splitter 用在弹窗内部。",
      "不要在没有 min 约束时允许面板被拖到 0（除非 collapsible）。",
    ],
    related: ["layout", "grid", "divider", "tabs", "drawer"],
  },
  {
    id: "page-header",
    name: "PageHeader",
    chineseName: "页头",
    category: "navigation",
    status: "stable",
    version: "0.1.0",
    purpose: "页面顶部的标题区：标题、说明、状态与页面级动作，告诉用户当前页面是什么、能做什么。",
    usage:
      "每个内容页使用一次，位于内容区最上方。弹窗与抽屉内的标题不用 PageHeader；跨页位置用 Breadcrumb 表达。页面级主动作最多一个 primary，其余动作降级为 secondary / ghost 或收入 Dropdown。",
    keywords: ["page-header", "页头", "标题", "主动作", "页面标题"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标题 + 一行说明 + 动作区；动作区只保留一个 primary。",
        code: `<PageHeader
  title="计算任务"
  description="提交、追踪并管理项目下的所有计算任务。"
  extra={<Button variant="primary">新建任务</Button>}
/>`,
        preview: "page-header/basic",
      },
      {
        id: "with-breadcrumb",
        title: "带面包屑与状态",
        kind: "variant",
        description: "深层页面在标题上方放面包屑；资源状态用 Badge 跟在标题旁。",
        code: `<PageHeader
  breadcrumb={[
    { title: "项目", href: "/projects" },
    { title: "示例项目" },
  ]}
  title="示例项目"
  tags={<Badge status="success">进行中</Badge>}
  extra={
    <>
      <Button variant="secondary">项目设置</Button>
      <Button variant="primary">新建任务</Button>
    </>
  }
/>`,
        preview: "page-header/with-breadcrumb",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "优化轮次页头：说明影响范围，主动作唯一，低频动作收入 Dropdown。",
        code: `<PageHeader
  title="电导率优化 · 第 3 轮"
  description="Agent 推荐 6 个候选配方，确认后将创建 1 个 CPU 任务。"
  tags={<Badge status="processing">等待确认</Badge>}
  extra={
    <>
      <Button variant="ghost">查看历史</Button>
      <Dropdown menu={{ items: moreItems }}>
        <Button variant="secondary">更多操作</Button>
      </Dropdown>
      <Button variant="primary">确认并执行</Button>
    </>
  }
/>`,
        preview: "page-header/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", required: true, description: "页面标题，渲染为页面唯一的 h1。" },
      { name: "description", type: "ReactNode", description: "一行说明，告诉用户这个页面能做什么。" },
      { name: "breadcrumb", type: "BreadcrumbItem[]", description: "标题上方的面包屑，两层以上层级时使用。" },
      { name: "tags", type: "ReactNode", description: "标题旁的状态徽章，只放状态不放营销标签。" },
      { name: "extra", type: "ReactNode", description: "右侧动作区；primary 按钮最多一个。" },
    ],
    states: [
      { name: "default", note: "标题为页面唯一 h1，描述一行，动作右对齐。" },
      { name: "hover", note: "不适用：标题区无 hover，动作自身处理。", applicable: false },
      { name: "focus-visible", note: "动作区焦点顺序与视觉顺序一致，焦点环可见。" },
      { name: "pressed", note: "不适用：按压反馈由动作区内的 Button 表达。", applicable: false },
      { name: "disabled", note: "主动作不可用时渲染 disabled，原因写在邻近文案或 Tooltip。" },
      { name: "loading", note: "标题与描述用 Skeleton 文本占位，动作区布局保持不跳动。" },
      { name: "empty", note: "不适用：页头必然有标题，空数据由内容区表达。", applicable: false },
      { name: "error", note: "页面数据加载失败时保留标题与返回路径，内容区显示 Result。" },
      { name: "permission-limited", note: "无权限动作渲染为 disabled 并说明所需权限，不隐藏。" },
      { name: "mobile", note: "动作区折行或收入 Dropdown；描述最多两行，超出省略。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "动作区按重要性从左到右降级排列，primary 永远只有一个。",
      "动作影响范围（项目、数量、预算）写在动作邻近的说明里。",
      "带面包屑时，返回上一级是最明显的逃生路径。",
    ],
    keyboard: [
      "动作区 Tab 顺序与视觉顺序一致。",
      "面包屑链接先于动作区获得焦点，与页面信息顺序一致。",
    ],
    accessibility: [
      "每页只有一个 h1，且只能出现在 PageHeader。",
      "状态徽章不只靠颜色区分，必须有文字。",
    ],
    responsive: [
      "≤760px 动作区允许整组换行，主动作保持在最前。",
      "标题最多两行，超出省略，不挤压动作区。",
    ],
    content: [
      "标题用名词短语（资源名），不用“详情页”“列表页”这类无信息文案。",
      "描述一句以内，说明这个页面能做什么。",
      "动作文案以动词开头：新建任务、确认并执行。",
    ],
    dos: [
      "一页一个 PageHeader，一个 primary。",
      "资源状态用 Badge 跟在标题旁。",
      "低频动作收入 Dropdown 的“更多操作”。",
    ],
    donts: [
      "不要在动作区放两个 primary 按钮。",
      "不要把页面标题写成“详情”或“页面”。",
      "不要在描述里堆叠超过两行的说明。",
    ],
    related: ["breadcrumb", "button", "dropdown", "badge", "tabs"],
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    chineseName: "面包屑",
    category: "navigation",
    status: "stable",
    version: "0.1.0",
    purpose: "展示当前页面在层级中的位置，并提供逐级向上返回的路径。",
    usage:
      "用于两层以上的层级页面（项目 → 数据集 → 任务详情）。同级内容切换用 Tabs；全局功能入口用 Menu；只有一层时不渲染。当前页永远不可点击。",
    keywords: ["breadcrumb", "面包屑", "路径", "层级", "返回"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "中间层级为链接，当前页为加粗纯文本。",
        code: `<Breadcrumb
  items={[
    { title: "项目", href: "/projects" },
    { title: "示例项目", href: "/projects/project-042" },
    { title: "任务详情" },
  ]}
/>`,
        preview: "breadcrumb/basic",
      },
      {
        id: "collapsed",
        title: "超长折叠",
        kind: "variant",
        description: "层级超过 maxItems 时折叠中间层，点击省略号展开完整路径。",
        code: `<Breadcrumb
  maxItems={3}
  items={[
    { title: "项目", href: "/projects" },
    { title: "示例项目", href: "/projects/project-042" },
    { title: "数据集", href: "/projects/project-042/datasets" },
    { title: "ds-118", href: "/datasets/ds-118" },
    { title: "字段映射" },
  ]}
/>`,
        preview: "breadcrumb/collapsed",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情页路径；无权限访问的上级渲染为纯文本，不提供链接。",
        code: `<Breadcrumb
  items={[
    { title: "项目", href: "/projects" },
    { title: "示例项目", href: "/projects/project-042" },
    { title: "计算任务", href: "/projects/project-042/runs" },
    { title: "run-28003" },
  ]}
/>`,
        preview: "breadcrumb/business",
      },
    ],
    props: [
      { name: "items", type: "{ title: ReactNode; href?: string }[]", required: true, description: "层级数组，最后一项为当前页，不需要 href。" },
      { name: "maxItems", type: "number", description: "最多展示的层级数，超出时折叠中间层为省略号。" },
      { name: "separator", type: "ReactNode", default: '"/"', description: "层级分隔符，保持默认不自定义。" },
    ],
    states: [
      { name: "default", note: "中间层级为链接（muted），当前页加粗纯文本。" },
      { name: "hover", note: "可点击层级变为品牌色。" },
      { name: "focus-visible", note: "链接焦点环，Tab 顺序与层级顺序一致。" },
      { name: "pressed", note: "不适用：链接点击即跳转，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "不适用：层级没有禁用态，无权限时降级为纯文本。", applicable: false },
      { name: "loading", note: "不适用：层级来自路由，即时可得。", applicable: false },
      { name: "empty", note: "层级少于两层时不渲染组件。" },
      { name: "error", note: "不适用：路径解析失败由页面级 Result 处理。", applicable: false },
      { name: "permission-limited", note: "无权限访问的上级渲染为纯文本并附锁图标，不提供链接。" },
      { name: "mobile", note: "只保留“返回上一级”与当前页，不横向挤压。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "当前页不可点击，也不响应 hover。",
      "折叠的中间层点击省略号展开，展开后可直接点击任意层级。",
      "面包屑不改变浏览器历史之外的状态，点击即跳转。",
    ],
    keyboard: [
      "Tab 按层级顺序逐个聚焦链接。",
      "当前页不进入 Tab 序列，用 aria-current 标识。",
    ],
    accessibility: [
      "外层用 <nav aria-label=\"面包屑\">，内部用 <ol> 有序列表。",
      "当前页设置 aria-current=\"page\"，读屏可识别位置。",
    ],
    responsive: [
      "移动端折叠为“返回上一级”链接 + 当前页标题。",
      "层级名称过长时省略中间层，不压缩文字到不可读。",
    ],
    content: [
      "层级名称与目标页面的标题保持一致，不另起别名。",
      "资源 ID（run-28003）用等宽字体，与名称区分。",
    ],
    dos: [
      "两层以上层级才使用面包屑。",
      "深层路径用 maxItems 折叠中间层。",
      "当前页保持纯文本，明确“你在这里”。",
    ],
    donts: [
      "不要把面包屑当 Tab 用做同级切换。",
      "不要让当前页可点击或带链接样式。",
      "不要用图标替代文字层级。",
    ],
    related: ["page-header", "menu", "link", "tabs", "dropdown"],
  },
  {
    id: "menu",
    name: "Menu",
    chineseName: "导航菜单",
    category: "navigation",
    status: "beta",
    version: "0.1.0",
    purpose: "应用的侧边导航：组织跨页面的功能入口，并标示当前所在位置。",
    usage:
      "用于全局或项目级导航，点击后切换整个页面（URL 变化、页面内容整体替换）。同页内的内容切换用 Tabs——Menu 决定“去哪一页”，Tabs 决定“这一页里看哪部分”；少量并列视图的即时切换用 Segmented。层级超过两层时配合分组与折叠。",
    keywords: ["menu", "导航", "侧边栏", "sider", "菜单", "当前项"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "当前项品牌色浅底加粗，点击即切换页面。",
        code: `<Menu
  selectedKey="runs"
  onSelect={(key) => navigate(key)}
  items={[
    { key: "overview", label: "项目概览", icon: <Home size={16} /> },
    { key: "datasets", label: "数据集", icon: <Database size={16} /> },
    { key: "runs", label: "计算任务", icon: <FlaskConical size={16} /> },
    { key: "reports", label: "分析报告", icon: <FileText size={16} /> },
  ]}
/>`,
        preview: "menu/basic",
      },
      {
        id: "groups",
        title: "分组与徽章",
        kind: "variant",
        description: "项数超过 7 个时按业务分组；徽章只放数量或状态标记。",
        code: `<Menu
  selectedKey="runs"
  items={[
    {
      key: "workspace",
      label: "工作台",
      children: [
        { key: "runs", label: "计算任务" },
        { key: "experiments", label: "实验记录", badge: "beta" },
      ],
    },
    {
      key: "assets",
      label: "数据资产",
      children: [
        { key: "datasets", label: "数据集", badge: 12 },
        { key: "reagents", label: "试剂库存" },
      ],
    },
  ]}
/>`,
        preview: "menu/groups",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目内导航：运行中任务带计数，无权限的审计日志禁用并说明原因。",
        code: `<Menu
  selectedKey="runs"
  items={[
    { key: "overview", label: "项目概览" },
    { key: "runs", label: "计算任务", badge: 3 },
    { key: "members", label: "成员与权限" },
    {
      key: "audit",
      label: "审计日志",
      disabled: true,
      disabledReason: "需要项目管理员权限",
    },
  ]}
/>`,
        preview: "menu/business",
      },
    ],
    props: [
      { name: "items", type: "MenuItem[]", required: true, description: "菜单项：key、label、icon?、badge?、disabled?、children?。" },
      { name: "selectedKey", type: "string", required: true, description: "当前页面对应的菜单项 key，受控。" },
      { name: "collapsed", type: "boolean", default: "false", description: "折叠为纯图标窄条，折叠态跨页面记忆。" },
      { name: "onSelect", type: "(key: string) => void", description: "点击菜单项回调，通常触发路由跳转。" },
    ],
    states: [
      { name: "default", note: "当前项品牌色浅底加粗，其余中性色。" },
      { name: "hover", note: "未选中项浅灰底，不改变布局。" },
      { name: "focus-visible", note: "菜单项焦点环，Tab 顺序自上而下。" },
      { name: "pressed", note: "点击即选中，颜色瞬时反馈（<120ms）。" },
      { name: "disabled", note: "无权限项灰化 + 锁图标，Tooltip 说明原因。" },
      { name: "loading", note: "不适用：菜单项为本地配置，即时可得。", applicable: false },
      { name: "empty", note: "不适用：能进入系统就至少有一个可见入口。", applicable: false },
      { name: "error", note: "不适用：菜单不加载远程数据，无错误态。", applicable: false },
      { name: "permission-limited", note: "无权限项禁用并说明所需权限，不隐藏，避免用户找不到功能。" },
      { name: "mobile", note: "折叠为抽屉，打开时遮罩内容区。" },
      { name: "dark-mode", note: "当前项使用 brand-soft 令牌，自动适配。" },
    ],
    interaction: [
      "选中即跳转，当前项始终保持在可视区域内（超长时自动滚动到位）。",
      "分组可折叠，折叠状态按用户记忆。",
      "badge 为 0 时不显示数字，避免“0 条”噪音。",
    ],
    keyboard: [
      "↑/↓ 在菜单项间移动焦点，Enter 跳转。",
      "←/→ 折叠或展开当前分组。",
    ],
    accessibility: [
      "外层 <nav>，列表 role=\"menu\"，项 role=\"menuitem\"。",
      "当前项设置 aria-current=\"page\"，不只靠颜色区分。",
    ],
    responsive: [
      "≤760px 折叠为抽屉，由顶栏菜单按钮打开。",
      "抽屉打开时内容区加遮罩，点击遮罩关闭。",
    ],
    content: [
      "项名用 2–6 字名词，与目标页面标题一致。",
      "徽章只放数量或状态（beta / new），不放营销词。",
    ],
    dos: [
      "用 selectedKey 明确标示当前位置。",
      "超过 7 个入口时按业务分组。",
      "无权限项禁用并说明原因。",
    ],
    donts: [
      "不要用 Menu 做同页内容切换（用 Tabs）。",
      "不要隐藏无权限项让用户找不到功能。",
      "不要让菜单超过两层嵌套。",
    ],
    related: ["tabs", "breadcrumb", "layout", "badge", "dropdown"],
  },
  {
    id: "tabs",
    name: "Tabs",
    chineseName: "标签页",
    category: "navigation",
    status: "stable",
    version: "0.1.0",
    purpose: "在同一页面内切换同层级的内容区块，切换后上下文与已输入状态不丢失。",
    usage:
      "用于同一对象的不同方面（任务详情的概览 / 参数 / 日志 / 产物）。跨页面导航用 Menu——Tabs 不换页、URL 可以不变，Menu 整页替换；2–5 个需要即时生效的视图切换可用 Segmented。标签超过一屏时横向滚动，不换行堆叠。",
    keywords: ["tabs", "标签页", "切换", "面板", "tab"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "当前标签品牌色下划线，点击切换面板。",
        code: `<Tabs
  activeKey="overview"
  onChange={setActiveKey}
  items={[
    { key: "overview", label: "概览" },
    { key: "params", label: "参数" },
    { key: "logs", label: "日志" },
    { key: "artifacts", label: "产物" },
  ]}
/>`,
        preview: "tabs/basic",
      },
      {
        id: "badges",
        title: "带计数徽章",
        kind: "variant",
        description: "计数放在徽章里，不写进标签文字；为 0 时不显示。",
        code: `<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    { key: "all", label: "全部" },
    { key: "running", label: "运行中", badge: 3 },
    { key: "queued", label: "排队中", badge: 12 },
    { key: "done", label: "已完成", badge: 128 },
  ]}
/>`,
        preview: "tabs/badges",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情标签：日志面板带运行状态点，无权限标签禁用并说明。",
        code: `<Tabs
  activeKey={activeKey}
  onChange={setActiveKey}
  items={[
    { key: "overview", label: "运行概览" },
    { key: "logs", label: "实时日志", badge: <BadgeDot status="processing" /> },
    { key: "curves", label: "电导率曲线" },
    {
      key: "audit",
      label: "审计记录",
      disabled: true,
      disabledReason: "仅项目管理员可见",
    },
  ]}
/>`,
        preview: "tabs/business",
      },
    ],
    props: [
      { name: "items", type: "{ key: string; label: ReactNode; badge?: ReactNode; disabled?: boolean }[]", required: true, description: "标签数组，2–7 个为宜。" },
      { name: "activeKey", type: "string", required: true, description: "当前激活标签，受控。" },
      { name: "onChange", type: "(key: string) => void", description: "切换回调；需要可分享时同步到 URL hash。" },
      { name: "destroyInactive", type: "boolean", default: "false", description: "是否销毁非活动面板；默认保留，切换不丢状态。" },
    ],
    states: [
      { name: "default", note: "当前标签品牌色下划线 + 加粗，面板即时渲染。" },
      { name: "hover", note: "未选中标签文字变为品牌色。" },
      { name: "focus-visible", note: "标签焦点环，方向键可移动选中。" },
      { name: "pressed", note: "不适用：按下即切换，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "标签禁用，Tooltip 说明原因（如权限）。" },
      { name: "loading", note: "面板内容加载用 Skeleton，标签条保持稳定不动。" },
      { name: "empty", note: "面板为空时放 Empty，标签保留可切换。" },
      { name: "error", note: "面板加载失败显示 Alert + 重试，对应标签加红点提示。" },
      { name: "permission-limited", note: "无权限标签禁用并说明所需权限，不隐藏。" },
      { name: "mobile", note: "标签条横向滚动，当前标签自动滚入视野。" },
      { name: "dark-mode", note: "下划线与文字使用语义令牌，自动适配。" },
    ],
    interaction: [
      "切换不重新请求已加载过的面板，保留滚动位置与输入状态。",
      "当前标签同步到 URL hash，刷新或分享后停在同一标签。",
      "标签超出容器宽度时横向滚动，不换行。",
    ],
    keyboard: [
      "←/→ 在标签间移动选中，Home / End 跳到首尾。",
      "Tab 键从标签条进入当前面板。",
    ],
    accessibility: [
      "标签条 role=\"tablist\"，标签 role=\"tab\" 并设 aria-selected。",
      "面板 role=\"tabpanel\"，用 aria-controls 与标签关联。",
    ],
    responsive: [
      "窄屏标签条横向滚动，标签文字不省略。",
      "标签过多（>7）时考虑收敛为 Menu 或重组信息架构。",
    ],
    content: [
      "标签用 2–4 字名词，不用句子。",
      "计数用徽章表达，不写“日志（128）”这种文字拼接。",
    ],
    dos: [
      "同一对象的不同方面用 Tabs 组织。",
      "需要分享当前视图时同步 URL hash。",
      "运行中的面板用状态点提示有新内容。",
    ],
    donts: [
      "不要用 Tabs 做跨页面导航（用 Menu）。",
      "不要超过 7 个标签还不做收敛。",
      "不要默认销毁非活动面板导致状态丢失。",
    ],
    related: ["menu", "segmented", "page-header", "badge", "skeleton"],
  },
  {
    id: "steps",
    name: "Steps",
    chineseName: "步骤条",
    category: "navigation",
    status: "beta",
    version: "0.1.0",
    purpose: "把多阶段流程拆成有序步骤，告诉用户流程进行到哪一步、每一步的结果。",
    usage:
      "用于有明确先后顺序的流程：数据导入、表单向导、任务流水线。并列内容切换用 Tabs；可以乱序访问的入口用 Menu。步骤数 2–7 为宜；每步只有 wait（等待）/ process（进行）/ finish（完成）/ error（失败）四种状态。",
    keywords: ["steps", "步骤条", "流程", "向导", "进度"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "current 指向进行中的步骤，之前的步骤为完成态。",
        code: `<Steps
  current={1}
  items={[
    { title: "上传文件" },
    { title: "校验数据" },
    { title: "确认导入" },
  ]}
/>`,
        preview: "steps/basic",
      },
      {
        id: "states",
        title: "四种状态",
        kind: "state",
        description: "完成绿色对勾、进行品牌色、失败红色叉号、等待灰色；失败步骤必须给出原因。",
        code: `<Steps
  current={2}
  items={[
    { title: "解析文件", status: "finish" },
    { title: "映射字段", status: "finish" },
    { title: "校验数据", status: "error", description: "2 条记录缺少测试温度" },
    { title: "写入数据集", status: "wait" },
  ]}
/>`,
        preview: "steps/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入在校验步骤失败：流程停住，给出原因与重试入口。",
        code: `<Steps
  current={1}
  items={[
    { title: "上传文件", status: "finish", description: "electrolyte-batch-7.csv" },
    { title: "校验数据", status: "error", description: "第 18、42 行缺少测试温度" },
    { title: "确认导入", status: "wait", description: "目标数据集 ds-118" },
  ]}
/>
<Alert
  type="error"
  action={<Button size="sm">下载错误报告</Button>}
>
  校验未通过：2 条记录缺少必填字段，修正后可从当前步骤继续。
</Alert>`,
        preview: "steps/business",
      },
    ],
    props: [
      { name: "current", type: "number", required: true, description: "当前步骤索引（从 0 开始）。" },
      { name: "items", type: "{ title: ReactNode; description?: ReactNode; status?: StepStatus }[]", required: true, description: "步骤数组；status 缺省时按 current 推导。" },
      { name: "status", type: '"wait" | "process" | "finish" | "error"', description: "整体状态覆盖，通常只用于把当前步标记为 error。" },
      { name: "onChange", type: "(step: number) => void", description: "点击已完成步骤回退；未到达的步骤不触发。" },
    ],
    states: [
      { name: "default", note: "未到达的步骤灰色编号，不可点击。" },
      { name: "hover", note: "可回退的已完成步骤 hover 变品牌色；未到达步骤无 hover。" },
      { name: "focus-visible", note: "可点击步骤有焦点环，顺序与步骤顺序一致。" },
      { name: "pressed", note: "不适用：步骤点击即跳转，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "未到达的步骤不可点击，光标 not-allowed。" },
      { name: "loading", note: "process 步骤可附 spinner 或实时百分比，标题保留。" },
      { name: "empty", note: "不适用：少于两步时不应使用步骤条。", applicable: false },
      { name: "error", note: "失败步骤红色叉号 + 具体原因 + 重试入口，流程停在该步。" },
      { name: "permission-limited", note: "不适用：权限由流程入口控制，步骤条内不做权限判断。", applicable: false },
      { name: "mobile", note: "收缩为“当前步骤 + 第 n/m 步”，不挤压换行。" },
      { name: "dark-mode", note: "状态色使用语义令牌，自动适配。" },
      { name: "finish", note: "完成步骤绿色对勾；流程允许时可点击回退。" },
      { name: "process", note: "当前步骤品牌色、标题加粗，是唯一进行中的步骤。" },
    ],
    interaction: [
      "已完成步骤在流程允许时可点击回退，回退不清空已填数据。",
      "失败步骤必须给出具体原因与重试入口，不只变红。",
      "同一时刻只有一个 process 步骤。",
    ],
    keyboard: [
      "可点击步骤进入 Tab 序列，Enter 跳转。",
      "未到达步骤不进入 Tab 序列。",
    ],
    accessibility: [
      "使用 <ol> 有序列表表达步骤顺序。",
      "当前步骤 aria-current=\"step\"；失败步骤用 aria-describedby 关联原因文本。",
    ],
    responsive: [
      "≤760px 只显示当前步骤名称与“第 n/m 步”。",
      "描述文字在窄屏省略，完整原因在步骤内容区展示。",
    ],
    content: [
      "步骤名用动词短语：上传文件、校验数据、确认导入。",
      "失败原因写具体（哪一行、缺哪个字段），不写“出错了”。",
    ],
    dos: [
      "流程失败后停在失败步，修正后可从该步继续。",
      "为每个步骤写一行描述说明这一步做什么。",
      "步骤数控制在 2–7 个。",
    ],
    donts: [
      "不要把步骤条当 Tabs 做并列切换。",
      "不要在失败后自动跳回第一步清空进度。",
      "不要出现两个 process 步骤。",
    ],
    related: ["form", "progress", "button", "alert", "result"],
  },
  {
    id: "pagination",
    name: "Pagination",
    chineseName: "分页",
    category: "navigation",
    status: "beta",
    version: "0.1.0",
    purpose: "把长列表分页，告诉用户总量与当前位置，并允许翻页与调整每页条数。",
    usage:
      "用于数据量超过一屏的列表与表格。持续增长的流式数据（实时日志）用“加载更多”或虚拟滚动；总数少于两页时不渲染。翻页必须保留筛选与排序条件。",
    keywords: ["pagination", "分页", "页码", "翻页", "每页条数"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "页码省略规则：首尾常驻，当前页前后各两页。",
        code: `<Pagination
  current={3}
  total={128}
  pageSize={20}
  onChange={setPage}
/>`,
        preview: "pagination/basic",
      },
      {
        id: "full",
        title: "完整功能",
        kind: "variant",
        description: "总量、每页条数与快速跳页；改变每页条数后回到第一页。",
        code: `<Pagination
  current={page}
  total={128}
  pageSize={pageSize}
  showTotal={(total) => \`共 \${total} 条\`}
  showSizeChanger
  showQuickJumper
  onChange={(nextPage, nextSize) => {
    setPage(nextPage);
    setPageSize(nextSize);
  }}
/>`,
        preview: "pagination/full",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表翻页：保留筛选条件，请求期间锁定页码防重复点击。",
        code: `<FilterBar value={filters} onChange={setFilters} />
<Table dataSource={runs} loading={pageLoading} />
<Pagination
  current={page}
  total={128}
  pageSize={20}
  showTotal={(total) => \`共 \${total} 个任务\`}
  onChange={(nextPage) => {
    setPageLoading(true);
    fetchRuns({ projectId: "project-042", page: nextPage, filters })
      .finally(() => setPageLoading(false));
    setPage(nextPage);
  }}
/>`,
        preview: "pagination/business",
      },
    ],
    props: [
      { name: "current", type: "number", required: true, description: "当前页码（从 1 开始），受控。" },
      { name: "total", type: "number", required: true, description: "总条数，用于计算页数与展示总量。" },
      { name: "pageSize", type: "number", default: "20", description: "每页条数；可选值 10 / 20 / 50。" },
      { name: "showTotal", type: "(total: number) => ReactNode", description: "总量文案，如“共 128 条”。" },
      { name: "onChange", type: "(page: number, pageSize: number) => void", description: "翻页或改每页条数回调。" },
    ],
    states: [
      { name: "default", note: "当前页品牌色实心，其余页码描边；省略规则 1 … 4 5 6 … 12。" },
      { name: "hover", note: "页码边框与文字变为品牌色。" },
      { name: "focus-visible", note: "页码焦点环，Tab 顺序与视觉顺序一致。" },
      { name: "pressed", note: "不适用：点击即翻页，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "首页时“上一页”禁用，末页时“下一页”禁用。" },
      { name: "loading", note: "翻页请求期间页码锁定防重复点击，数据区用 Skeleton。" },
      { name: "empty", note: "total 为 0 时不渲染分页，列表区显示 Empty。" },
      { name: "error", note: "翻页失败保留当前页码并用 Message 提示，可重试。" },
      { name: "permission-limited", note: "不适用：分页不判断权限，权限由数据接口决定。", applicable: false },
      { name: "mobile", note: "简化为“上一页 / 第 n 页 / 下一页”。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "翻页保留筛选与排序条件，条件变化时回到第一页。",
      "改变每页条数后回到第一页。",
      "快速跳页输入非法页码时夹紧到有效范围。",
    ],
    keyboard: [
      "Tab 顺序：上一页 → 页码 → 下一页 → 跳页输入框。",
      "跳页输入框 Enter 确认，Esc 还原。",
    ],
    accessibility: [
      "外层 <nav aria-label=\"分页\">。",
      "当前页设置 aria-current=\"page\"，省略号不进入 Tab 序列。",
    ],
    responsive: [
      "≤760px 隐藏页码与跳页，只保留上一页 / 下一页与当前页。",
      "每页条数选择器在窄屏收入“更多”。",
    ],
    content: [
      "总量文案“共 128 条”，列表场景写“共 128 个任务”更具体。",
      "“暂无数据”由 Empty 表达，分页不承担空态文案。",
    ],
    dos: [
      "告诉用户总量与当前位置。",
      "翻页请求期间锁定页码防重复点击。",
      "筛选条件变化时回到第一页。",
    ],
    donts: [
      "不要在少于一页时渲染分页占位。",
      "不要翻页时丢失筛选条件。",
      "不要用分页承载实时日志这类流式数据。",
    ],
    related: ["table", "filter-bar", "empty", "skeleton", "search-field"],
  },
  {
    id: "dropdown",
    name: "Dropdown",
    chineseName: "下拉菜单",
    category: "navigation",
    status: "beta",
    version: "0.1.0",
    purpose: "把一组低频动作收进触发元素背后的浮层菜单，保持界面清爽。",
    usage:
      "用于“更多操作”、用户菜单、带选项的动作按钮。菜单项是页面导航时用 Menu；需要确认的单个动作用 Popconfirm；从选项里选一个值用 Select。菜单项不超过 9 个，超过时先分组，再考虑换交互。",
    keywords: ["dropdown", "下拉", "更多操作", "菜单", "浮层"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击触发，选中后菜单关闭；点击外部或 Esc 同样关闭。",
        code: `<Dropdown
  menu={{
    items: [
      { key: "detail", label: "查看详情" },
      { key: "copy", label: "复制任务 ID" },
      { key: "rerun", label: "重新运行" },
    ],
    onSelect: (key) => handleAction(key),
  }}
>
  <Button variant="secondary">更多操作</Button>
</Dropdown>`,
        preview: "dropdown/basic",
      },
      {
        id: "danger",
        title: "分组与危险项",
        kind: "variant",
        description: "危险项放在菜单底部并用分割线隔开，文案写清作用对象。",
        code: `<Dropdown
  menu={{
    items: [
      { key: "detail", label: "查看详情" },
      { key: "share", label: "分享链接" },
      { type: "divider" },
      { key: "revoke", label: "撤销任务", danger: true },
    ],
  }}
>
  <IconButton aria-label="更多操作" icon={<MoreHorizontal size={16} />} />
</Dropdown>`,
        preview: "dropdown/danger",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务行更多操作：无权限项禁用说明，危险项带二次确认。",
        code: `<Dropdown
  trigger={["click"]}
  menu={{
    items: [
      { key: "detail", label: "查看详情" },
      { key: "logs", label: "下载日志" },
      { key: "clone", label: "以此为模板新建" },
      {
        key: "audit",
        label: "审计记录",
        disabled: true,
        disabledReason: "需要项目管理员权限",
      },
      { type: "divider" },
      {
        key: "revoke",
        label: "撤销任务 run-28003",
        danger: true,
        confirm: "撤销后不可恢复",
      },
    ],
    onSelect: handleRunAction,
  }}
>
  <Button variant="ghost">更多操作</Button>
</Dropdown>`,
        preview: "dropdown/business",
      },
    ],
    props: [
      { name: "menu", type: "{ items: MenuItem[]; onSelect?: (key: string) => void }", required: true, description: "菜单配置；项支持 icon、danger、disabled、divider。" },
      { name: "trigger", type: '("click" | "hover")[]', default: '["click"]', description: "打开方式；动作菜单用 click，hover 只用于纯浏览型菜单。" },
      { name: "placement", type: '"bottomLeft" | "bottomRight" | "topLeft" | "topRight"', default: '"bottomLeft"', description: "浮层相对触发器的位置，边缘自动翻转。" },
      { name: "children", type: "ReactElement", required: true, description: "触发元素，通常是 Button 或 IconButton。" },
    ],
    states: [
      { name: "default", note: "浮层带阴影贴近触发器，层级高于页面内容。" },
      { name: "hover", note: "菜单项浅灰底；危险项红色浅底。" },
      { name: "focus-visible", note: "打开后焦点进入菜单，菜单项焦点环可见。" },
      { name: "pressed", note: "不适用：菜单项点击即执行，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "菜单项灰化不可选；触发器禁用时无法打开。" },
      { name: "loading", note: "触发动作执行中触发器进入 loading，禁止重复打开。" },
      { name: "empty", note: "不适用：无可用项时隐藏触发器，不渲染空菜单。", applicable: false },
      { name: "error", note: "动作执行失败由 Message 在页面顶层反馈，菜单保持已关闭状态。" },
      { name: "permission-limited", note: "无权限项 disabled + 锁图标 + Tooltip 说明所需权限。" },
      { name: "mobile", note: "浮层最大宽度 90vw、最大高度 60vh，超出可滚动。" },
      { name: "dark-mode", note: "浮层使用 surface 令牌与阴影，自动适配。" },
    ],
    interaction: [
      "点击外部或 Esc 关闭，选中一项后关闭。",
      "危险项先经 Popconfirm 二次确认再执行，确认文案回显作用对象。",
      "打开时浮层不超出视口，边缘自动翻转方向。",
    ],
    keyboard: [
      "Enter / Space / ↓ 打开菜单，↑/↓ 在项间移动。",
      "Esc 关闭并把焦点归还触发器；Home / End 跳到首末项。",
    ],
    accessibility: [
      "触发器设 aria-haspopup=\"menu\"，打开时 aria-expanded=\"true\"。",
      "菜单 role=\"menu\"、项 role=\"menuitem\"；危险项不只靠红色，配合文案或图标。",
    ],
    responsive: [
      "移动端浮层最大宽度 90vw，贴近触发器。",
      "菜单项点击区域不小于 36px 高。",
    ],
    content: [
      "菜单项以动词开头：查看详情、复制任务 ID。",
      "危险项写清作用对象：撤销任务 run-28003，而不是“删除”。",
      "分组之间用分割线，不给分组加标题。",
    ],
    dos: [
      "低频动作收进“更多操作”。",
      "危险项放菜单底部并用分割线隔开。",
      "无权限项禁用并说明原因。",
    ],
    donts: [
      "不要在菜单里放超过 9 个项。",
      "不要用 Dropdown 做表单选择（用 Select）。",
      "不要让危险项不经确认直接执行。",
    ],
    related: ["button", "icon-button", "popconfirm", "menu", "modal"],
  },
  {
    id: "segmented",
    name: "Segmented",
    chineseName: "分段选择器",
    category: "navigation",
    status: "beta",
    version: "0.1.0",
    purpose: "少量互斥选项的即时切换器，选中立即生效，像开关一样轻量。",
    usage:
      "用于 2–5 个互斥选项的即时切换：视图（表格 / 卡片）、时间范围、单位。选项更多或需要确认时用 Select 或 Radio；切换整页内容用 Tabs 或 Menu。Segmented 不产生提交动作，选中即应用。",
    keywords: ["segmented", "分段", "切换", "视图", "时间范围"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "选中块滑动过渡，切换立即生效。",
        code: `<Segmented
  value={view}
  onChange={setView}
  options={[
    { label: "表格", value: "table" },
    { label: "卡片", value: "card" },
  ]}
/>`,
        preview: "segmented/basic",
      },
      {
        id: "sizes",
        title: "尺寸",
        kind: "size",
        description: "sm 用于工具条与卡片头部，md 为默认尺寸。",
        code: `<Segmented size="sm" value="7d" options={["24h", "7 天", "30 天"]} />
<Segmented size="md" value="all" options={["全部", "运行中", "已完成"]} />`,
        preview: "segmented/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务指标的时间范围切换；数据不足的选项禁用并说明原因。",
        code: `<Segmented
  value={range}
  onChange={(value) => {
    setRange(value);
    refetchMetrics({ runId: "run-28003", range: value });
  }}
  options={[
    { label: "24 小时", value: "24h" },
    { label: "7 天", value: "7d" },
    { label: "30 天", value: "30d", disabled: true, disabledReason: "任务运行未满 30 天" },
  ]}
/>`,
        preview: "segmented/business",
      },
    ],
    props: [
      { name: "options", type: "(string | { label: ReactNode; value: string; icon?: ReactNode; disabled?: boolean })[]", required: true, description: "选项数组，2–5 个。" },
      { name: "value", type: "string", required: true, description: "当前选中值，受控。" },
      { name: "onChange", type: "(value: string) => void", description: "切换回调，选中即生效。" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "sm 高 28px，md 高 32px。" },
    ],
    states: [
      { name: "default", note: "选中项浮起（surface + 阴影），未选中项中性文字。" },
      { name: "hover", note: "未选中项文字加深，不改变背景。" },
      { name: "focus-visible", note: "整组一个 Tab 位，选中项焦点环可见。" },
      { name: "pressed", note: "选中块滑动过渡 160ms，方向键切换同样过渡。" },
      { name: "disabled", note: "单项灰化不可选；整体禁用 opacity .45。" },
      { name: "loading", note: "不适用：切换即时生效，目标区域自行加载。", applicable: false },
      { name: "empty", note: "不适用：至少两个互斥选项才有意义。", applicable: false },
      { name: "error", note: "不适用：切换不产生错误，目标区域的错误由目标组件表达。", applicable: false },
      { name: "permission-limited", note: "无权限选项 disabled + Tooltip 说明原因。" },
      { name: "mobile", note: "选项等分宽度，文字不省略；放不下时改用 Tabs。" },
      { name: "dark-mode", note: "容器 surface-soft、选中块 surface，自动适配。" },
    ],
    interaction: [
      "点击即生效，不需要确认或提交。",
      "选中块滑动过渡，方向键切换同样有过渡。",
      "选项超过 5 个时改用 Select 或 Tabs，不无限横向扩展。",
    ],
    keyboard: [
      "整组一个 Tab 位（roving tabindex）。",
      "←/→ 移动选中，选中即生效。",
    ],
    accessibility: [
      "容器 role=\"radiogroup\"，选项 role=\"radio\" 并设 aria-checked。",
      "纯图标选项必须有 Tooltip 与 aria-label。",
    ],
    responsive: [
      "选项在容器内等分宽度，窄屏缩小内边距不换行。",
      "文字被挤压到不可读时改用 Tabs。",
    ],
    content: [
      "选项用 1–4 字，名词或时间短语。",
      "不用“选项一 / 选项二”这类无信息文案。",
    ],
    dos: [
      "视图切换、时间范围这类即时场景优先用 Segmented。",
      "数据不足的选项禁用并说明原因。",
      "配合就近的结果区域，切换后立刻看到变化。",
    ],
    donts: [
      "不要放超过 5 个选项。",
      "不要用 Segmented 做需要提交的表单选择。",
      "不要让切换后没有任何即时反馈。",
    ],
    related: ["tabs", "radio", "select", "switch", "filter-bar"],
  },
];
