import type { ComponentDoc } from "../types";

/** 数据展示 + 反馈 + 覆盖层组件。 */
export const displayComponents: ComponentDoc[] = [
  {
    id: "table",
    name: "Table",
    chineseName: "表格",
    category: "display",
    status: "stable",
    version: "0.1.0",
    purpose: "以行列结构展示结构化数据，是列表页与详情页最核心的数据载体。",
    usage:
      "用于两条以上、字段结构一致的数据集合。单条记录的字段明细用 Descriptions；单个关键数值用 Statistic；层级数据用 Tree。数据超过一屏必须配合 Pagination 或虚拟滚动，不允许无限长高。",
    keywords: ["table", "grid", "表格", "列表", "数据表"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "caption 说明表格范围；数字列的表头与单元格同时右对齐；状态列使用带文字的 Badge。",
        code: `<Table caption="示例项目（project-042）最近计算任务">
  <TableHead>
    <TableRow>
      <TableHeader scope="col">任务</TableHeader>
      <TableHeader scope="col">数据集</TableHeader>
      <TableHeader scope="col" align="right">耗时（秒）</TableHeader>
      <TableHeader scope="col">状态</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>run-28003</TableCell>
      <TableCell>ds-118</TableCell>
      <TableCell align="right">286.4</TableCell>
      <TableCell><Badge color="success">已完成</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        preview: "table/basic",
      },
      {
        id: "scroll",
        title: "窄屏横向滚动",
        kind: "variant",
        description: "列多或屏幕窄时，表格在滚动容器内横向滚动；首列冻结保持定位，不压缩列宽、不挤压换行。",
        code: `<Table
  caption="数据集 ds-118 · 全部字段"
  scroll={{ x: 960 }}
  stickyFirstColumn
>
  <TableHead>
    <TableRow>
      <TableHeader scope="col">任务</TableHeader>
      <TableHeader scope="col">数据集</TableHeader>
      <TableHeader scope="col">方法</TableHeader>
      <TableHeader scope="col" align="right">截断能（eV）</TableHeader>
      <TableHeader scope="col" align="right">耗时（秒）</TableHeader>
      <TableHeader scope="col" align="right">费用（元）</TableHeader>
      <TableHeader scope="col">状态</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>{rows}</TableBody>
</Table>`,
        preview: "table/scroll",
      },
      {
        id: "states",
        title: "加载、空与错误",
        kind: "state",
        description: "骨架行替换数据行但保留表头；空态说明原因并给出下一步；错误态保留筛选上下文并提供重试。",
        code: `<Table caption="任务列表" loading />
<Table caption="任务列表" empty={<Empty description="当前筛选条件下没有任务" actionText="清除筛选" />} />
<Table caption="任务列表" error={{ message: "任务列表加载失败", onRetry: reload }} />`,
        preview: "table/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "计算任务列表：首列名称 + 稳定 ID，数字列右对齐等宽数字，状态用 Badge，行内操作不超过 3 个。",
        code: `<Table caption="示例项目（project-042）· 计算任务列表" rowKey="id">
  <TableHead>
    <TableRow>
      <TableHeader scope="col">任务</TableHeader>
      <TableHeader scope="col">数据集</TableHeader>
      <TableHeader scope="col" align="right">耗时（秒）</TableHeader>
      <TableHeader scope="col" align="right">费用（元）</TableHeader>
      <TableHeader scope="col">状态</TableHeader>
      <TableHeader scope="col">操作</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {runs.map((run) => (
      <TableRow key={run.id}>
        <TableCell>
          <strong>{run.name}</strong>
          <span className="table-secondary">{run.id}</span>
        </TableCell>
        <TableCell>{run.dataset}</TableCell>
        <TableCell align="right">{run.seconds}</TableCell>
        <TableCell align="right">{run.cost}</TableCell>
        <TableCell><Badge color={run.statusColor}>{run.status}</Badge></TableCell>
        <TableCell><Button size="sm" variant="ghost">查看日志</Button></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
        preview: "table/business",
      },
    ],
    props: [
      { name: "caption", type: "string", required: true, description: "表格标题，说明内容范围（项目、时间、筛选）；视觉上可弱化，读屏必须可达。" },
      { name: "rowKey", type: "string", default: '"id"', description: "行稳定标识，排序保持、批量选择与刷新后的选中还原都依赖它。" },
      { name: "scroll", type: "{ x?: number | string; y?: number | string }", description: "达到临界尺寸后进入滚动；窄屏横向滚动由 x 触发。" },
      { name: "stickyFirstColumn", type: "boolean", default: "false", description: "横向滚动时冻结首列，保持行定位。" },
      { name: "loading", type: "boolean", default: "false", description: "骨架行替换数据行，表头与 caption 保留。" },
      { name: "empty", type: "ReactNode", description: "空态内容：说明是无数据还是被筛选清空，并给出下一步动作。" },
      { name: "error", type: '{ message: string; onRetry?: () => void }', description: "错误态：原因 + 重试，保留表头与筛选上下文。" },
    ],
    states: [
      { name: "default", note: "首列语义稳定（名称 + ID），数字列右对齐并使用等宽数字。" },
      { name: "hover", note: "整行高亮，不改变行高；可点击行显示 pointer 光标。" },
      { name: "focus-visible", note: "行内按钮与可点击行有 3px 品牌色焦点环，outline 不被表格边框截断。" },
      { name: "pressed", note: "可点击行按下时背景再深一档，时长 < 120ms。" },
      { name: "disabled", note: "行内操作 disabled 时保留显示，原因由 Tooltip 或邻近文案说明。" },
      { name: "loading", note: "骨架行替换数据行，表头、caption 与筛选栏保留，不做整表闪烁替换。" },
      { name: "empty", note: "说明是无数据还是被筛选清空，并给出下一步动作（清除筛选 / 新建）。" },
      { name: "error", note: "错误原因 + 重试按钮，保留表头与已输入的筛选条件。" },
      { name: "permission-limited", note: "无权限字段渲染为“无权限查看”占位，不留空白、不错位。" },
      { name: "mobile", note: "进入横向滚动容器，首列可冻结；不压缩列宽换行。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
      { name: "selected", note: "勾选行使用品牌色浅底，同时出现批量操作栏并写明已选数量。" },
    ],
    interaction: [
      "排序与筛选变化必须给出加载反馈，数据替换不静默进行。",
      "行内操作最多 3 个，更多操作收入 Dropdown。",
      "整行可点击时，首列主链接与行点击目标一致；行内按钮点击不触发行跳转。",
      "批量选择后出现批量操作栏，写明已选数量与影响范围。",
    ],
    keyboard: [
      "排序按钮进入 Tab 序列，Enter / Space 切换升序、降序、不排序。",
      "可点击行聚焦后 Enter 打开详情；行内按钮按视觉顺序逐个到达。",
      "横向滚动容器可聚焦，方向键左右滚动。",
    ],
    accessibility: [
      "使用原生 table 语义：caption 描述表格范围，th 配 scope=\"col\" / \"row\"。",
      "排序状态用 aria-sort 标注；加载时容器 aria-busy=\"true\"。",
      "数字列右对齐、等宽数字，表头与单元格对齐方向一致。",
      "状态列不只用颜色：Badge 必须同时带文字。",
    ],
    responsive: [
      "窄屏进入横向滚动容器，列宽不压缩、文字不挤压换行。",
      "横向滚动时首列可冻结（stickyFirstColumn），保持行定位。",
      "移动端次要列可移入行内展开区，但首列与状态列始终可见。",
    ],
    content: [
      "表头是名词短语，单位写进表头（“耗时（秒）”），不逐格重复。",
      "空值显示 —；数字统一精度与千分位。",
      "首列展示名称 + 稳定 ID（如 run-28003），不只显示名称。",
    ],
    dos: [
      "caption 写清表格范围（项目、时间、筛选）。",
      "数字列右对齐、等宽数字、统一精度。",
      "空、加载、错误、无权限四种状态都有确定样式。",
    ],
    donts: [
      "不要用表格做页面布局。",
      "不要在一行里放超过 3 个行内操作。",
      "不要隐藏横向滚动：宁可滚动，不压缩列宽。",
      "不要只显示名称而省略稳定 ID。",
    ],
    related: ["pagination", "filter-bar", "badge", "empty", "skeleton"],
  },
  {
    id: "descriptions",
    name: "Descriptions",
    chineseName: "描述列表",
    category: "display",
    status: "stable",
    version: "0.1.0",
    purpose: "以“标签 + 值”的形式成组展示单条记录的字段，是详情页的标准载体。",
    usage:
      "用于一条记录（任务、数据集、项目）的字段明细。多条记录的对比用 Table；层级数据用 Tree。超过 12 个字段时分组，次要字段收入 Collapse。",
    keywords: ["descriptions", "detail", "描述列表", "详情", "字段"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标签 muted、值正文色，同组标签等宽对齐；ID 与数值使用等宽字体。",
        code: `<Descriptions title="任务详情">
  <Descriptions.Item label="任务 ID">run-28003</Descriptions.Item>
  <Descriptions.Item label="所属项目">示例项目（project-042）</Descriptions.Item>
  <Descriptions.Item label="状态"><Badge color="success">已完成</Badge></Descriptions.Item>
  <Descriptions.Item label="耗时">286.4 秒</Descriptions.Item>
</Descriptions>`,
        preview: "descriptions/basic",
      },
      {
        id: "layout",
        title: "布局变体",
        kind: "variant",
        description: "layout=\"vertical\" 标签在值上方，column 控制每行字段数，bordered 用于正式详情页。",
        code: `<Descriptions title="数据集信息" column={2} layout="vertical" bordered>
  <Descriptions.Item label="数据集 ID">ds-118</Descriptions.Item>
  <Descriptions.Item label="版本">v3 · 2026-09-18 更新</Descriptions.Item>
  <Descriptions.Item label="数据量">1,000 行 · 12 字段</Descriptions.Item>
  <Descriptions.Item label="创建方式">UniLab 导入</Descriptions.Item>
</Descriptions>`,
        preview: "descriptions/layout",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据驱动写法；质量状态字段跨两列展示，ID 旁提供复制操作。",
        code: `<Descriptions
  title="数据集 ds-118"
  column={2}
  items={[
    { label: "数据集 ID", children: "ds-118" },
    { label: "所属项目", children: "示例项目（project-042）" },
    { label: "版本", children: "v3 · 2026-09-18 更新" },
    { label: "数据量", children: "1,000 行 · 12 字段" },
    { label: "质量状态", children: <Badge color="warning">3 行缺少密度字段</Badge>, span: 2 },
  ]}
/>`,
        preview: "descriptions/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", description: "区块标题，说明这组字段属于哪个对象。" },
      { name: "column", type: "number | { xs?: number; sm?: number; md?: number }", default: "3", description: "每行字段数，窄屏自动降为 1。" },
      { name: "layout", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "horizontal 标签在左，vertical 标签在上。" },
      { name: "bordered", type: "boolean", default: "false", description: "带边框的正式详情样式。" },
      { name: "items", type: "Array<{ label: ReactNode; children: ReactNode; span?: number }>", description: "数据驱动写法，与 Item 子组件二选一；span 用于跨列。" },
    ],
    states: [
      { name: "default", note: "标签 muted、值正文色，同组标签等宽对齐，行距一致。" },
      { name: "hover", note: "仅值内的链接与复制按钮有 hover，普通文本无 hover。" },
      { name: "focus-visible", note: "值内的链接、复制按钮有品牌色焦点环。" },
      { name: "pressed", note: "不适用：描述列表本身不可按压，交互由值内的链接或按钮承担。", applicable: false },
      { name: "disabled", note: "不适用：展示型组件无禁用态；不可编辑的字段保持正常文本样式。", applicable: false },
      { name: "loading", note: "值区域显示骨架条，标签保留，整组不闪烁。" },
      { name: "empty", note: "单个值为空显示 —；整组无数据时不渲染空壳，由页面级 Empty 承担。" },
      { name: "error", note: "取值失败的字段显示“加载失败 + 重试”，不影响其他字段。" },
      { name: "permission-limited", note: "无权限字段显示“无权限查看”，并说明所需权限。" },
      { name: "mobile", note: "column 降为 1，标签与值上下排列（vertical）。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "ID 等值可复制，复制成功用 Message 反馈。",
      "长文本值默认截断并提供展开，不把布局撑乱。",
      "ID、时间、数值使用等宽字体并保证完整显示，不截断。",
    ],
    keyboard: [
      "值内的链接与复制按钮进入 Tab 序列。",
      "截断值展开后可聚焦，便于读屏朗读完整内容。",
    ],
    accessibility: [
      "使用 dl / dt / dd 语义，不用 table 或纯 div 拼接。",
      "标签与值一一对应，屏读顺序与视觉顺序一致。",
    ],
    responsive: [
      "列数配置支持断点对象，窄屏降为单列。",
      "窄屏下标签与值上下排列，标签不再占位等宽列。",
    ],
    content: [
      "标签是名词短语，不带冒号（组件自动处理分隔）。",
      "空值显示 —；状态字段一律用 Badge，不用纯文字。",
    ],
    dos: [
      "超过 12 个字段时分组，次要字段收入 Collapse。",
      "同组标签列宽一致，换行对齐。",
      "状态类字段使用带文字的 Badge。",
    ],
    donts: [
      "不要用 Descriptions 做多条记录对比（用 Table）。",
      "不要在值里塞超过 1 个操作按钮。",
      "不要让长文本值撑破布局。",
    ],
    related: ["table", "card", "collapse", "tag"],
  },
  {
    id: "statistic",
    name: "Statistic",
    chineseName: "统计数值",
    category: "display",
    status: "beta",
    version: "0.1.0",
    purpose: "突出展示单个关键数值及其趋势，用于看板与概览区。",
    usage:
      "用于需要一眼读到的核心指标（任务数、成功率、费用）。成组字段明细用 Descriptions；完整分布用 Table 或图表。一屏统计卡不超过 6 个。",
    keywords: ["statistic", "metric", "统计", "数值", "指标", "看板"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "数值大号字重，标题 muted，单位缩小一档。",
        code: `<Statistic title="本周计算任务" value={128} suffix="个" />
<Statistic title="平均成功率" value={86.4} precision={1} suffix="%" />
<Statistic title="本周费用" value={1280.4} precision={2} prefix="¥" />`,
        preview: "statistic/basic",
      },
      {
        id: "trend",
        title: "趋势变体",
        kind: "variant",
        description: "趋势用箭头 + 文字 + 对比口径表达，不只靠红绿颜色。",
        code: `<Statistic
  title="平均耗时"
  value={286.4}
  precision={1}
  suffix="秒"
  trend={{ value: "-12.3%", direction: "down", label: "较上周" }}
/>
<Statistic
  title="失败任务"
  value={6}
  suffix="个"
  trend={{ value: "+2", direction: "up", label: "较上周" }}
/>`,
        preview: "statistic/trend",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目概览统计组：写清统计周期，可点击的统计卡跳转到携带筛选的列表页。",
        code: `<div className="stat-grid">
  <Statistic title="计算任务" value={128} suffix="个" onClick={() => goRuns("project-042")} />
  <Statistic title="成功率" value={86.4} precision={1} suffix="%" />
  <Statistic title="费用" value={1280.4} precision={2} prefix="¥" />
</div>
<p>示例项目（project-042）· 统计周期 2026-09-15 – 2026-09-21</p>`,
        preview: "statistic/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", required: true, description: "指标名称，写清统计口径（范围、周期）。" },
      { name: "value", type: "number | string", required: true, description: "数值，大数千分位由组件格式化。" },
      { name: "precision", type: "number", description: "小数位数，同组指标保持一致。" },
      { name: "prefix", type: "ReactNode", description: "前缀，如 ¥。" },
      { name: "suffix", type: "ReactNode", description: "后缀单位，缩小一档展示。" },
      { name: "trend", type: '{ value: string; direction: "up" | "down" | "flat"; label?: string }', description: "对比趋势，label 写清对比口径。" },
      { name: "loading", type: "boolean", default: "false", description: "数值骨架条，标题保留。" },
    ],
    states: [
      { name: "default", note: "数值大号字重，标题 muted，单位缩小一档，同组基线对齐。" },
      { name: "hover", note: "可点击的统计卡整体 hover 浮起；纯展示统计无 hover。" },
      { name: "focus-visible", note: "可点击统计卡有品牌色焦点环。" },
      { name: "pressed", note: "可点击统计卡按下轻微下沉；纯展示统计无按压态。" },
      { name: "disabled", note: "不适用：统计值没有禁用态；不可点击时即普通展示。", applicable: false },
      { name: "loading", note: "数值骨架条，标题保留，布局高度不变。" },
      { name: "empty", note: "无数值显示 — 并注明统计周期，不用 0 冒充数据。" },
      { name: "error", note: "显示“数据不可用”并提供重试，不渲染可能过期的数值。" },
      { name: "permission-limited", note: "无权限指标显示“无权限”，不展示模糊值或星号混淆。" },
      { name: "mobile", note: "统计卡组降为单列或两列，数值字号保持可读。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "可点击统计卡跳转对应列表页，并携带筛选条件。",
      "趋势区域 hover / 聚焦时显示完整对比口径（周期、样本量）。",
    ],
    keyboard: [
      "可点击统计卡进入 Tab 序列，Enter 触发跳转。",
      "趋势的补充说明可被聚焦，便于读屏朗读。",
    ],
    accessibility: [
      "趋势方向不只用颜色：配合 ↑↓ 箭头与文字。",
      "数值朗读包含单位与统计周期（aria-label 补全）。",
    ],
    responsive: [
      "窄屏统计卡组降为单列或两列。",
      "数值字号不随屏宽大幅缩水，保证一眼可读。",
    ],
    content: [
      "标题写清指标口径（时间范围、统计范围）。",
      "大数千分位；同组指标精度统一。",
    ],
    dos: [
      "一屏统计卡不超过 6 个，突出关键指标。",
      "标注统计周期与口径。",
      "无数据显示 — 并说明原因。",
    ],
    donts: [
      "不要把 Statistic 当表格平铺大量数值。",
      "不要用 0 代替无数据。",
      "不要只用红绿色表达涨跌。",
    ],
    related: ["card", "table", "progress", "descriptions"],
  },
  {
    id: "timeline",
    name: "Timeline",
    chineseName: "时间线",
    category: "display",
    status: "beta",
    version: "0.1.0",
    purpose: "按时间顺序展示事件流，表达“发生了什么、进行到哪、接下来是什么”。",
    usage:
      "用于任务执行记录、审计事件、版本历史等有明确时间顺序的场景。纯步骤导航用 Steps；层级结构用 Tree；审计场景优先使用 audit-timeline。",
    keywords: ["timeline", "history", "时间线", "事件", "记录"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "节点竖向排列，时间使用等宽字体，连接线 1px。",
        code: `<Timeline
  items={[
    { time: "09:12", title: "任务创建", description: "run-28003 已提交到队列" },
    { time: "09:14", title: "开始执行", description: "分配到计算节点 node-07" },
    { time: "09:19", title: "执行完成", description: "耗时 286.4 秒" },
  ]}
/>`,
        preview: "timeline/basic",
      },
      {
        id: "status",
        title: "状态节点",
        kind: "variant",
        description: "success / error / processing 节点各有图标与颜色，失败节点提供日志入口。",
        code: `<Timeline
  items={[
    { time: "09:12", title: "任务创建", status: "success" },
    { time: "09:13", title: "参数校验失败", status: "error", description: "K 点网格与截断能冲突 · 查看日志" },
    { time: "09:15", title: "修正参数并重新提交", status: "success" },
    { time: "09:16", title: "重新校验中", status: "processing" },
  ]}
/>`,
        preview: "timeline/status",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "run-28003 执行时间线：进行中的末节点实时更新，pending 表达“未完待续”。",
        code: `<Timeline
  pending="结果回传中…"
  items={[
    { time: "09:12", title: "任务创建", description: "run-28003 · 示例项目（project-042）" },
    { time: "09:14", title: "开始执行", description: "数据集 ds-118 · 方法 PBE0" },
    { time: "09:19", title: "计算完成", description: "耗时 286.4 秒 · 查看日志", status: "success" },
  ]}
/>`,
        preview: "timeline/business",
      },
    ],
    props: [
      { name: "items", type: "TimelineItem[]", required: true, description: '节点数组：{ time, title, description?, status?, icon? }。' },
      { name: "status", type: '"default" | "success" | "warning" | "error" | "processing"', description: "节点状态，决定图标与颜色；在单个 item 上设置。" },
      { name: "pending", type: "ReactNode | boolean", default: "false", description: "末尾的进行中占位，表达“未完待续”。" },
      { name: "reverse", type: "boolean", default: "false", description: "最新事件在上，仅用于监控类场景。" },
      { name: "mode", type: '"left" | "alternate"', default: '"left"', description: "节点布局；窄屏强制 left。" },
    ],
    states: [
      { name: "default", note: "节点竖向排列，时间等宽字体，连接线 1px，节点间距一致。" },
      { name: "hover", note: "可展开节点整行 hover 高亮；纯展示节点无 hover。" },
      { name: "focus-visible", note: "节点内的链接与展开按钮有品牌色焦点环。" },
      { name: "pressed", note: "可展开节点按压有短暂反馈，时长 < 120ms。" },
      { name: "disabled", note: "不适用：展示型组件无禁用态；不可交互的节点本就不渲染控件。", applicable: false },
      { name: "loading", note: "processing 节点显示旋转指示并实时更新，其余节点不受影响。" },
      { name: "empty", note: "无事件显示 Empty“暂无记录”，不渲染一条空轴线。" },
      { name: "error", note: "error 节点红色图标 + 错误摘要 + 查看日志入口。" },
      { name: "permission-limited", note: "无权限事件脱敏为“无权限查看该事件”，时间点保留。" },
      { name: "mobile", note: "统一左对齐单列，时间移到标题上方。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "节点可展开查看详情（日志摘要、参数快照）。",
      "进行中的最新节点自动滚动进入视野并实时更新。",
      "节点内的操作（查看日志）不触发展开/收起。",
    ],
    keyboard: [
      "可展开节点 Tab 聚焦，Enter / Space 展开或收起。",
      "节点内的链接按视觉顺序逐个到达。",
    ],
    accessibility: [
      "使用 ol / li 语义表达先后顺序。",
      "状态不只靠颜色：图标 + 文字同时表达。",
      "进行中节点 aria-live=\"polite\" 节流播报关进度变化。",
    ],
    responsive: [
      "窄屏统一为左对齐单列，时间移到标题上方。",
      "时间戳允许换行，不截断。",
    ],
    content: [
      "节点标题用完成态动词短语（“任务已创建”）。",
      "时间精确到分钟；跨年事件补全年份。",
    ],
    dos: [
      "失败节点必须给出日志入口。",
      "执行中的节点实时更新。",
      "默认正序（最早在上），监控场景才倒序。",
    ],
    donts: [
      "不要把时间线当步骤导航（用 Steps）。",
      "不要在节点里塞超过两行描述（详情放展开区）。",
      "不要展示没有时间属性的数据。",
    ],
    related: ["steps", "run-status", "audit-timeline", "badge"],
  },
  {
    id: "tree",
    name: "Tree",
    chineseName: "树",
    category: "display",
    status: "beta",
    version: "0.1.0",
    purpose: "以缩进层级展示父子结构数据，支持展开、选择与定位。",
    usage:
      "用于项目目录、数据集层级、分类体系。扁平列表用 Table；时间顺序用 Timeline。层级超过 4 层时必须提供搜索定位。",
    keywords: ["tree", "hierarchy", "树", "层级", "目录"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击箭头展开/收起，点击标题选中节点。",
        code: `<Tree
  data={[
    {
      key: "project-042",
      title: "示例项目（project-042）",
      children: [
        { key: "ds-118", title: "数据集 ds-118" },
        { key: "ds-121", title: "数据集 ds-121" },
      ],
    },
  ]}
  defaultExpandedKeys={["project-042"]}
/>`,
        preview: "tree/basic",
      },
      {
        id: "selectable",
        title: "勾选模式",
        kind: "variant",
        description: "checkable 开启复选，父子勾选联动，父级半选态明确。",
        code: `<Tree
  checkable
  defaultExpandedKeys={["project-042"]}
  defaultCheckedKeys={["ds-118"]}
  onCheck={(keys) => setDatasetKeys(keys)}
  data={projectTree}
/>`,
        preview: "tree/selectable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目目录树：选中高亮，无权限节点显示锁图标，超过 50 个节点提供搜索定位。",
        code: `<Tree
  data={[
    {
      key: "project-042",
      title: "示例项目（project-042）",
      children: [
        { key: "ds-118", title: "数据集 ds-118 · 1,000 行" },
        { key: "ds-121", title: "数据集 ds-121 · 320 行" },
        { key: "ds-130", title: "数据集 ds-130", disabled: true },
      ],
    },
  ]}
  selectedKeys={selected}
  onSelect={(keys) => setSelected(keys)}
/>`,
        preview: "tree/business",
      },
    ],
    props: [
      { name: "data", type: "TreeNode[]", required: true, description: "节点数组：{ key, title, children?, disabled?, icon? }。" },
      { name: "checkable", type: "boolean", default: "false", description: "复选模式，父子勾选联动。" },
      { name: "selectable", type: "boolean", default: "true", description: "点击标题单选高亮。" },
      { name: "defaultExpandedKeys", type: "string[]", description: "默认展开的节点 key。" },
      { name: "onSelect", type: "(keys: string[], node: TreeNode) => void", description: "单选回调，回传 key 与节点信息。" },
      { name: "onCheck", type: "(keys: string[]) => void", description: "勾选回调，checkable 时可用。" },
      { name: "loading", type: "boolean", default: "false", description: "异步加载子级时显示节点级 spinner。" },
    ],
    states: [
      { name: "default", note: "缩进 16px/级，节点高 32px，展开图标、类型图标与文字对齐。" },
      { name: "hover", note: "节点整行 hover 高亮，不改变缩进。" },
      { name: "focus-visible", note: "节点焦点环可见，方向键导航时焦点位置明确。" },
      { name: "pressed", note: "展开按钮按下即触发，箭头旋转 90°，动画 160ms。" },
      { name: "disabled", note: "禁用节点 opacity .45，不可勾选，原因在 Tooltip 说明。" },
      { name: "loading", note: "异步加载子级时该节点显示 spinner；整树加载用骨架。" },
      { name: "empty", note: "空数据显示 Empty“暂无目录”，不渲染空树。" },
      { name: "error", note: "子级加载失败原地显示“加载失败，点击重试”节点。" },
      { name: "permission-limited", note: "无权限节点显示锁图标与“无权限”，默认脱敏展示而不是隐藏。" },
      { name: "mobile", note: "节点高度 ≥ 40px，缩进减小到 12px/级。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "点击箭头只展开/收起，点击标题才选中。",
      "勾选父级联动子级，半选态（部分子级选中）有明确样式。",
      "异步加载子级失败可原地重试，不丢失已展开状态。",
      "超过 50 个节点的树必须提供搜索定位。",
    ],
    keyboard: [
      "↑↓ 移动焦点，→ 展开 / ← 收起。",
      "Enter / Space 选中或勾选当前节点。",
      "Home / End 跳到首末节点。",
    ],
    accessibility: [
      "使用 role=\"tree\" / \"treeitem\"，aria-expanded / aria-selected / aria-checked 齐全。",
      "层级用 aria-level 标注。",
      "无权限节点的锁图标必须配合文字，不只靠图标。",
    ],
    responsive: [
      "窄屏节点高度 ≥ 40px，触摸热区足够。",
      "深层缩进改为横向滚动，不无限右移。",
    ],
    content: [
      "节点标题简短，ID 与数量放次级文本。",
      "空目录不渲染“暂无子节点”的假节点。",
    ],
    dos: [
      "默认展开到用户最可能需要的层级。",
      "勾选变化后显示已选数量。",
      "节点操作常显，不依赖 hover（移动端可达）。",
    ],
    donts: [
      "不要用树展示两列就能放下的扁平数据。",
      "不要超过 4 层还不提供搜索。",
      "不要把关键操作藏进 hover 才显示的按钮里。",
    ],
    related: ["table", "search-field", "checkbox", "collapse"],
  },
  {
    id: "collapse",
    name: "Collapse",
    chineseName: "折叠面板",
    category: "display",
    status: "stable",
    version: "0.1.0",
    purpose: "将次要内容折叠进面板，让页面默认只呈现主线信息。",
    usage:
      "用于高级参数、详情补充、FAQ 等低频但必要的内容。层级导航用 Tree；单条记录的字段分组用 Descriptions 分组。关键副作用、费用、错误信息不允许折叠。",
    keywords: ["collapse", "accordion", "折叠", "手风琴", "面板"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击面板头整行展开/收起，箭头方向指示当前状态。",
        code: `<Collapse defaultActiveKeys={["params"]}>
  <Collapse.Panel key="params" header="计算参数">
    交换关联泛函 PBE0 · 截断能 520 eV · K 点 4×4×4
  </Collapse.Panel>
  <Collapse.Panel key="advanced" header="高级设置">
    最大迭代步数 200 · 收敛阈值 1e-6
  </Collapse.Panel>
</Collapse>`,
        preview: "collapse/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "手风琴模式 + extra 状态徽标：输入文件校验状态一目了然。",
        code: `<Collapse accordion defaultActiveKeys={["input"]}>
  <Collapse.Panel key="input" header="输入文件（3）" extra={<Badge color="success">已校验</Badge>}>
    structure.cif · params.json · kpoints.conf
  </Collapse.Panel>
  <Collapse.Panel key="result" header="结果文件（2）" extra={<Badge color="neutral">待生成</Badge>}>
    任务 run-28003 完成后生成
  </Collapse.Panel>
</Collapse>`,
        preview: "collapse/business",
      },
    ],
    props: [
      { name: "accordion", type: "boolean", default: "false", description: "手风琴模式，展开一个自动收起其他。" },
      { name: "defaultActiveKeys", type: "string[]", description: "默认展开的面板 key。" },
      { name: "bordered", type: "boolean", default: "true", description: "false 用于卡片内嵌的无边框变体。" },
      { name: "header", type: "ReactNode", required: true, description: "Panel 的面板头，名词短语并标注数量。" },
      { name: "extra", type: "ReactNode", description: "Panel 右侧附加内容（状态徽标），点击不触发展开。" },
      { name: "collapsible", type: '"header" | "icon" | "disabled"', description: "Panel 的触发区域；disabled 禁止展开。" },
    ],
    states: [
      { name: "default", note: "面板头高 44px，箭头朝右；展开时箭头朝下。" },
      { name: "hover", note: "面板头整行 hover 背景变化。" },
      { name: "focus-visible", note: "面板头有品牌色焦点环。" },
      { name: "pressed", note: "面板头按下时背景再深一档，时长 < 120ms。" },
      { name: "disabled", note: "禁用面板头 opacity .45，不允许展开，原因在 Tooltip 说明。" },
      { name: "loading", note: "面板内容异步加载时内容区显示骨架，面板头保持可用。" },
      { name: "empty", note: "不适用：无内容的面板不应渲染，由业务判断是否提供该面板。", applicable: false },
      { name: "error", note: "内容加载失败在面板内显示重试，不影响其他面板。" },
      { name: "permission-limited", note: "无权限内容在面板内显示权限说明，面板头保留，结构稳定。" },
      { name: "mobile", note: "面板头高度 ≥ 44px，箭头热区扩大。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "点击面板头整行展开/收起；extra 区域的点击不触发展开。",
      "手风琴模式展开一个面板时自动收起其他面板。",
      "详情页可将展开态写入 URL，分享后定位到同一面板。",
    ],
    keyboard: [
      "Tab 聚焦面板头，Enter / Space 切换展开。",
      "↑↓ 在面板头之间移动焦点（Accordion 键盘模式）。",
    ],
    accessibility: [
      "面板头使用 button + aria-expanded + aria-controls。",
      "内容区 role=\"region\" 并与面板头关联。",
    ],
    responsive: [
      "窄屏面板头允许换行，extra 移到第二行。",
      "触摸热区 ≥ 44px。",
    ],
    content: [
      "面板头是名词短语并标注数量（“输入文件（3）”）。",
      "错误、费用、副作用等关键信息不允许折叠。",
    ],
    dos: [
      "默认展开用户最常看的一个面板。",
      "面板头标注内容数量。",
      "extra 放状态徽标，不放操作按钮组。",
    ],
    donts: [
      "不要把确认、付款、删除等关键动作藏进折叠面板。",
      "不要嵌套两层以上的 Collapse。",
      "不要折叠校验错误信息。",
    ],
    related: ["descriptions", "card", "tree", "badge"],
  },
  {
    id: "code-block",
    name: "CodeBlock",
    chineseName: "代码块",
    category: "display",
    status: "beta",
    version: "0.1.0",
    purpose: "以等宽字体展示代码与命令，支持语法高亮、行号与一键复制。",
    usage:
      "用于 API 调用示例、配置文件、命令行片段。结构化 JSON 的浏览用 JsonViewer；超长日志用日志查看器。超过 50 行的文件用文件预览，不用 CodeBlock。",
    keywords: ["code", "codeblock", "代码", "命令行", "高亮", "复制"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "命令行片段以 $ 开头表示提示符，复制内容不包含提示符。",
        code: `<CodeBlock language="bash" showCopy>
  $ datacore runs submit --project project-042 --dataset ds-118
</CodeBlock>`,
        preview: "code-block/basic",
      },
      {
        id: "highlight",
        title: "行号与高亮行",
        kind: "variant",
        description: "超过 3 行显示行号；关键行用高亮行标记，配合行号文字说明。",
        code: `<CodeBlock language="json" lineNumbers highlightLines={[4]} showCopy>
  {
    "projectId": "project-042",
    "datasetId": "ds-118",
    "method": "PBE0",
    "maxSeconds": 300
  }
</CodeBlock>`,
        preview: "code-block/highlight",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "API 示例中域名一律 example.com，凭证用 *** 占位。",
        code: `<CodeBlock language="bash" title="查询任务状态" showCopy>
  $ curl https://api.example.com/v1/runs/run-28003 \\
      -H "Authorization: Bearer ***"
</CodeBlock>`,
        preview: "code-block/business",
      },
    ],
    props: [
      { name: "language", type: "string", required: true, description: "高亮语言（bash / json / python …）。" },
      { name: "title", type: "string", description: "代码块标题栏，说明用途或文件名。" },
      { name: "showCopy", type: "boolean", default: "false", description: "右上角复制按钮，复制全文。" },
      { name: "lineNumbers", type: "boolean", default: "false", description: "显示行号，超过 3 行建议开启。" },
      { name: "highlightLines", type: "number[]", description: "需要强调的行号列表。" },
      { name: "maxHeight", type: "number", description: "超过该高度内部纵向滚动，标题栏固定。" },
    ],
    states: [
      { name: "default", note: "等宽字体 12.5px，代码主题随站点浅色/深色切换。" },
      { name: "hover", note: "复制按钮常显于右上角；hover 时代码块边框加强。" },
      { name: "focus-visible", note: "复制按钮有品牌色焦点环。" },
      { name: "pressed", note: "复制按钮按下有按压反馈，成功后图标变为对勾 2 秒。" },
      { name: "disabled", note: "不适用：代码块无禁用态。", applicable: false },
      { name: "loading", note: "不适用：代码随页面骨架一起加载，无独立加载态。", applicable: false },
      { name: "empty", note: "不适用：无代码内容不渲染 CodeBlock。", applicable: false },
      { name: "error", note: "不适用：静态展示无错误态；加载失败由页面级错误承担。", applicable: false },
      { name: "permission-limited", note: "含敏感配置的代码以脱敏占位行显示（apiKey: \"***\"），不展示真实值。" },
      { name: "mobile", note: "横向滚动保持缩进，不强制换行，字号不降低。" },
      { name: "dark-mode", note: "使用暗色代码主题令牌，高亮对比度 ≥ 4.5:1。" },
    ],
    interaction: [
      "点击复制按钮复制全文，并用 Message 反馈“已复制”。",
      "超过 maxHeight 内部纵向滚动，标题栏与复制按钮保持可见。",
    ],
    keyboard: [
      "复制按钮进入 Tab 序列，Enter / Space 触发复制。",
      "代码区域可聚焦，方向键滚动长代码。",
    ],
    accessibility: [
      "使用 pre / code 语义；复制按钮 aria-label=\"复制代码\"。",
      "语法高亮对比度 ≥ 4.5:1。",
      "高亮行不只靠颜色：配合行号文字说明（“第 4 行”）。",
    ],
    responsive: [
      "窄屏横向滚动，保持等宽对齐与缩进。",
      "字号不随屏宽降低。",
    ],
    content: [
      "示例域名一律 example.com，密钥与凭证用 *** 占位。",
      "命令行片段以 $ 开头表示提示符，复制时不包含提示符。",
    ],
    dos: [
      "超过 3 行显示行号。",
      "标注 language 获得正确高亮。",
      "提供复制按钮并反馈复制结果。",
    ],
    donts: [
      "不要截图贴代码。",
      "不要在示例里放真实密钥或内部域名。",
      "不要用 CodeBlock 展示超过 50 行的文件。",
    ],
    related: ["json-viewer", "message", "typography", "file-list"],
  },
  {
    id: "json-viewer",
    name: "JsonViewer",
    chineseName: "JSON 查看器",
    category: "display",
    status: "experimental",
    version: "0.1.0",
    purpose: "以可折叠树展示 JSON 数据，支持按路径展开与复制节点值。",
    usage:
      "用于调试面板、参数快照、API 响应预览等开发态场景。面向普通用户的结构化信息用 Descriptions 或 Table；纯代码文本用 CodeBlock。",
    keywords: ["json", "viewer", "JSON", "调试", "参数快照"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "默认展开 1 层，点击箭头展开/收起子树。",
        code: `<JsonViewer
  data={{ runId: "run-28003", status: "finished", seconds: 286.4 }}
  defaultExpandDepth={1}
/>`,
        preview: "json-viewer/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务参数快照：支持复制节点值与节点路径，敏感字段一律脱敏。",
        code: `<JsonViewer
  data={{
    runId: "run-28003",
    project: { id: "project-042", name: "示例项目" },
    params: { method: "PBE0", cutoff: 520, kpoints: [4, 4, 4] },
    dataset: { id: "ds-118", version: 3 },
    credential: "***",
  }}
  defaultExpandDepth={2}
  enableCopy
  enableCopyPath
/>`,
        preview: "json-viewer/business",
      },
    ],
    props: [
      { name: "data", type: "unknown", required: true, description: "要展示的 JSON 数据。" },
      { name: "defaultExpandDepth", type: "number", default: "1", description: "默认展开层级，大对象不超过 2。" },
      { name: "enableCopy", type: "boolean", default: "false", description: "hover 节点显示复制值按钮。" },
      { name: "enableCopyPath", type: "boolean", default: "false", description: "点击键名复制节点路径（如 params.kpoints[2]）。" },
      { name: "maxHeight", type: "number", description: "超过该高度内部纵向滚动。" },
    ],
    states: [
      { name: "default", note: "键紫色、值按类型着色，等宽字体，缩进 14px/级。" },
      { name: "hover", note: "节点行 hover 显示复制按钮；移动端常显。" },
      { name: "focus-visible", note: "展开图标与复制按钮有品牌色焦点环。" },
      { name: "pressed", note: "展开图标按下旋转 90°，时长 < 120ms。" },
      { name: "disabled", note: "不适用：查看器无禁用态。", applicable: false },
      { name: "loading", note: "不适用：数据随页面骨架加载，无独立加载态。", applicable: false },
      { name: "empty", note: "空对象 / 空数组显示 {} / [] 占位，不渲染空节点。" },
      { name: "error", note: "非法 JSON 显示解析错误与出错位置，不白屏。" },
      { name: "permission-limited", note: "敏感字段值显示 ***，键名保留，便于理解结构。" },
      { name: "mobile", note: "横向滚动保持缩进；操作按钮常显，不依赖 hover。" },
      { name: "dark-mode", note: "使用语义令牌，类型着色对比度 ≥ 4.5:1。" },
    ],
    interaction: [
      "点击箭头展开/收起子树；点击键名复制路径。",
      "超长字符串默认截断 80 字符，点击展开全文。",
      "大对象（> 1000 节点）开启虚拟滚动或分页加载。",
    ],
    keyboard: [
      "展开按钮 Tab 聚焦，Enter / Space 切换。",
      "树内支持方向键导航（同 Tree 键盘模式）。",
    ],
    accessibility: [
      "树结构使用 role=\"tree\" / \"treeitem\"，aria-expanded 标注。",
      "类型着色不只靠颜色：null 与错误值同时有文本标记。",
    ],
    responsive: [
      "窄屏横向滚动，不压缩缩进层级。",
      "操作按钮在移动端常显。",
    ],
    content: [
      "键名保持原始 snake_case / camelCase，不做翻译改写。",
      "敏感值（密钥、凭证）一律 ***。",
    ],
    dos: [
      "默认只展开 1–2 层。",
      "提供复制值与复制路径。",
      "大对象开启虚拟滚动。",
    ],
    donts: [
      "不要把 JsonViewer 当正式详情页给普通用户。",
      "不要展示真实凭证。",
      "不要默认全展开大对象。",
    ],
    related: ["code-block", "descriptions", "collapse", "message"],
  },
  {
    id: "file-list",
    name: "FileList",
    chineseName: "文件列表",
    category: "display",
    status: "beta",
    version: "0.1.0",
    purpose: "以列表展示文件及其状态，支持预览、下载、删除与上传进度。",
    usage:
      "用于数据集附件、任务产物、导入文件清单。大目录浏览用 Tree + Table；上传交互本身用 Upload；轻量删除确认用 Popconfirm。",
    keywords: ["file", "list", "文件", "附件", "上传"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "图标 + 文件名 + 大小 + 操作，操作按钮常显不依赖 hover。",
        code: `<FileList
  files={[
    { id: "f-01", name: "structure.cif", size: "48 KB" },
    { id: "f-02", name: "params.json", size: "2 KB" },
  ]}
  onDownload={(file) => download(file.id)}
  onRemove={(file) => remove(file.id)}
/>`,
        preview: "file-list/basic",
      },
      {
        id: "states",
        title: "上传中与失败",
        kind: "state",
        description: "上传中显示进度与取消；失败行保留并给出重试与移除两个出口。",
        code: `<FileList
  files={[
    { id: "f-03", name: "raw-data.csv", size: "1.2 MB", status: "uploading", percent: 62 },
    { id: "f-04", name: "notes.pdf", size: "860 KB", status: "error", error: "格式不支持（仅支持 .cif / .json）" },
  ]}
  onCancel={(file) => cancelUpload(file.id)}
  onRetry={(file) => retry(file.id)}
/>`,
        preview: "file-list/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集 ds-118 附件清单：超过 maxVisible 折叠并显示总数。",
        code: `<FileList
  files={attachments}
  maxVisible={3}
  onDownload={(file) => download(file.id)}
  onRemove={(file) => confirmRemove(file.id)}
  emptyText="暂无附件，上传后在此展示"
/>`,
        preview: "file-list/business",
      },
    ],
    props: [
      { name: "files", type: "FileItem[]", required: true, description: '文件数组：{ id, name, size, status?, percent?, error? }。' },
      { name: "status", type: '"uploading" | "success" | "error"', description: "单个文件状态，uploading 需配合 percent。" },
      { name: "onDownload", type: "(file: FileItem) => void", description: "下载回调；无权限时不渲染该按钮而显示“无权限”。" },
      { name: "onRemove", type: "(file: FileItem) => void", description: "删除回调，触发前必须经 Popconfirm 确认。" },
      { name: "maxVisible", type: "number", description: "超过该数量折叠为“查看全部（N）”。" },
      { name: "emptyText", type: "ReactNode", description: "空态文案，引导上传。" },
    ],
    states: [
      { name: "default", note: "图标 + 文件名 + 大小 + 操作，行高 40px。" },
      { name: "hover", note: "整行 hover 高亮；操作按钮常显，不依赖 hover 出现。" },
      { name: "focus-visible", note: "下载 / 删除按钮有品牌色焦点环。" },
      { name: "pressed", note: "操作按钮按压反馈，时长 < 120ms。" },
      { name: "disabled", note: "删除被禁用时按钮 disabled，原因在 Tooltip 说明。" },
      { name: "loading", note: "上传中显示进度条与百分比，并提供取消。" },
      { name: "empty", note: "无文件显示 Empty“暂无附件”，引导上传。" },
      { name: "error", note: "失败行红色图标 + 原因 + 重试 / 移除两个出口。" },
      { name: "permission-limited", note: "无下载权限的操作显示“无权限”，文件条目保留可见。" },
      { name: "mobile", note: "行高 ≥ 44px，文件名截断保留扩展名，操作保持可见。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "点击文件名预览（格式支持时），点击图标不触发任何动作。",
      "删除前经 Popconfirm 确认；失败后行保留并显示原因。",
      "上传中可取消，取消后行消失并用 Message 反馈。",
    ],
    keyboard: [
      "行内操作按视觉顺序进入 Tab 序列。",
      "焦点位于上传中行时，Esc 请求取消上传。",
    ],
    accessibility: [
      "文件状态有文字表达，不只靠图标颜色。",
      "上传进度使用 Progress 语义（role=\"progressbar\"）。",
    ],
    responsive: [
      "窄屏行高 ≥ 44px。",
      "文件名超长截断但保留扩展名。",
    ],
    content: [
      "大小统一 KB / MB，保留一位小数。",
      "错误原因说人话：“格式不支持（仅支持 .cif / .json）”。",
    ],
    dos: [
      "失败行给出重试与移除两个出口。",
      "删除前必须确认。",
      "超过 8 个文件折叠并显示总数。",
    ],
    donts: [
      "不要上传失败即静默移除行。",
      "不要只显示图标不显示文件名。",
      "不要在 FileList 里做文件夹层级（用 Tree）。",
    ],
    related: ["upload", "popconfirm", "progress", "empty"],
  },
  {
    id: "alert",
    name: "Alert",
    chineseName: "警告提示",
    category: "feedback",
    status: "stable",
    version: "0.1.0",
    purpose: "在页面或区块内展示需要持续关注的上下文提示，随内容出现，不自动消失。",
    usage:
      "用于与当前上下文强相关、需要用户看到或处理的信息：数据质量问题、权限提醒、阻断原因。三者分工：操作结果的轻量反馈用 Message（自动消失）；与当前页面弱相关的异步事件用 Notification（可停留）；需要持续关注的上下文信息用 Alert（常驻页面）。",
    keywords: ["alert", "banner", "警告", "提示", "横幅"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "四种语义类型，图标 + 文字同时表达，不只靠颜色。",
        code: `<Alert type="info" title="计算任务将于今晚 22:00 排队执行" />
<Alert type="success" title="数据集 ds-118 校验通过" />
<Alert type="warning" title="3 行缺少密度字段" description="缺失行将以项目默认值填充，可在导入预览中逐行修改。" />
<Alert type="error" title="任务 run-28002 执行失败" description="K 点网格与截断能设置冲突，请检查参数后重试。" />`,
        preview: "alert/basic",
      },
      {
        id: "closable",
        title: "可关闭与操作",
        kind: "variant",
        description: "非阻断型提示可关闭；action 提供直达入口。",
        code: `<Alert
  type="warning"
  title="项目额度剩余 12%"
  description="示例项目（project-042）本周期额度即将用完。"
  closable
  action={<Button size="sm" variant="ghost">查看用量</Button>}
/>`,
        preview: "alert/closable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入流程中的质量提醒：阻断在提交前，给出逐行处理入口。",
        code: `<Alert
  type="warning"
  title="3 行缺少密度字段，无法直接提交"
  description="第 128、512、907 行缺失。可逐行补全，或以项目默认值 2.50 g/cm³ 填充后继续。"
  action={
    <>
      <Button size="sm" variant="ghost">查看缺失行</Button>
      <Button size="sm" variant="secondary">以默认值填充</Button>
    </>
  }
/>`,
        preview: "alert/business",
      },
    ],
    props: [
      { name: "type", type: '"info" | "success" | "warning" | "error"', required: true, description: "语义类型，决定图标与底色。" },
      { name: "title", type: "ReactNode", required: true, description: "一句话结论，不写“提示”“警告”这类词。" },
      { name: "description", type: "ReactNode", description: "原因与下一步，不给套话。" },
      { name: "closable", type: "boolean", default: "false", description: "可关闭；阻断型 Alert 不提供关闭。" },
      { name: "action", type: "ReactNode", description: "右侧操作（查看、重试），最多 2 个。" },
      { name: "icon", type: "ReactNode", description: "自定义图标，默认按类型给出。" },
    ],
    states: [
      { name: "default", note: "左侧类型图标 + 结论标题，背景为类型色浅底，与页面同宽或随区块。" },
      { name: "hover", note: "仅 action 与关闭按钮有 hover；Alert 本体无 hover。" },
      { name: "focus-visible", note: "关闭与 action 按钮有品牌色焦点环。" },
      { name: "pressed", note: "不适用：Alert 本体不可按压，按压反馈由内部按钮承担。", applicable: false },
      { name: "disabled", note: "不适用：Alert 无禁用态。", applicable: false },
      { name: "loading", note: "不适用：加载中的等待用 Spin / Skeleton，不用 Alert。", applicable: false },
      { name: "empty", note: "不适用：无内容不渲染 Alert。", applicable: false },
      { name: "error", note: "type=\"error\" 即错误态本身：结论 + 原因 + 下一步，不只用红色。" },
      { name: "permission-limited", note: "权限类提醒用 type=\"warning\"，并给出申请权限或联系人入口。" },
      { name: "mobile", note: "标题与描述换行展示，action 移到描述下方整行。" },
      { name: "dark-mode", note: "浅底深字使用语义令牌，对比度 ≥ 4.5:1。" },
    ],
    interaction: [
      "阻断型 Alert 不提供关闭；可关闭的 Alert 关闭只是隐藏，问题未解决时会再次出现。",
      "action 跳转后携带当前上下文（项目、筛选、行号）。",
      "同一时间同一区域最多 2 条，超出合并为摘要。",
    ],
    keyboard: [
      "关闭按钮 aria-label=\"关闭提示\"，进入 Tab 序列。",
      "action 按钮按视觉顺序到达。",
    ],
    accessibility: [
      "一般提示 role=\"status\"，阻断错误 role=\"alert\"。",
      "类型不只靠颜色：图标 + 文字同时表达。",
      "新出现的 Alert 由 aria-live 播报，不抢占焦点。",
    ],
    responsive: [
      "窄屏 action 下移整行，不与标题挤压。",
      "描述允许换行，不截断关键信息。",
    ],
    content: [
      "标题是一句话结论（“数据集校验未通过”）。",
      "description 给原因和下一步，不写“请知悉”这类套话。",
    ],
    dos: [
      "error 必须写清原因与下一步。",
      "阻断型不提供关闭。",
      "按语义选类型，不混用。",
    ],
    donts: [
      "不要用 Alert 做成功轻反馈（用 Message）。",
      "不要同一区域堆叠超过 2 条。",
      "不要给关闭按钮解决不了的问题提供关闭。",
    ],
    related: ["message", "notification", "data-quality-notice", "result"],
  },
  {
    id: "message",
    name: "Message",
    chineseName: "全局提示",
    category: "feedback",
    status: "beta",
    version: "0.1.0",
    purpose: "操作完成后的轻量全局反馈，自动出现、自动消失，不打断流程。",
    usage:
      "用于保存成功、复制成功、提交已受理等即时结果反馈。三者分工：Message 是即时轻反馈（自动消失、无需处理）；Alert 是页面内持续提醒（需要看到或处理）；Notification 是异步事件通知（可停留、带操作）。",
    keywords: ["message", "toast", "提示", "轻提示", "反馈"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "顶部居中浮出，一句话结果，默认 3 秒自动消失。",
        code: `<Button variant="primary" onClick={() => message.success("已保存到示例项目（project-042）")}>
  保存
</Button>
<Button variant="secondary" onClick={() => message.error("保存失败：网络异常，请重试")}>
  演示失败
</Button>`,
        preview: "message/basic",
      },
      {
        id: "types",
        title: "类型变体",
        kind: "variant",
        description: "success / warning / error / loading 四种常用类型，图标 + 文字表达。",
        code: `message.success("已复制任务 ID run-28003")
message.warning("项目额度剩余不足 20%")
message.error("提交失败：参数校验未通过")
message.loading("正在提交…", { duration: 0, key: "submit" })`,
        preview: "message/types",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "异步动作用同一 key 从 loading 更新为结果，不堆叠两条。",
        code: `function handleSave() {
  message.loading("正在保存到示例项目（project-042）…", { key: "save", duration: 0 });
  saveDataset()
    .then(() => message.success("已保存 · 版本 v3", { key: "save" }))
    .catch(() => message.error("保存失败：网络异常，修改未丢失，请重试", { key: "save" }));
}`,
        preview: "message/business",
      },
    ],
    props: [
      { name: "type", type: '"success" | "error" | "warning" | "info" | "loading"', required: true, description: "类型，决定图标与颜色。" },
      { name: "content", type: "ReactNode", required: true, description: "一句话结果 + 对象。" },
      { name: "duration", type: "number", default: "3", description: "自动关闭秒数；loading 默认 0，需手动关闭或更新。" },
      { name: "key", type: "string", description: "同一 key 的后续调用更新内容而不是堆叠。" },
      { name: "maxCount", type: "number", default: "3", description: "同屏最多条数，超出进入队列。" },
      { name: "onClose", type: "() => void", description: "关闭后的回调。" },
    ],
    states: [
      { name: "default", note: "顶部居中浮出，图标 + 一句话，白底阴影。" },
      { name: "hover", note: "hover 时暂停自动关闭计时。" },
      { name: "focus-visible", note: "内嵌按钮（如重试）有品牌色焦点环。" },
      { name: "pressed", note: "不适用：Message 本体不可按压。", applicable: false },
      { name: "disabled", note: "不适用：Message 无禁用态。", applicable: false },
      { name: "loading", note: "type=\"loading\" 显示 spinner，用同一 key 更新为结果。" },
      { name: "empty", note: "不适用：无内容不弹出 Message。", applicable: false },
      { name: "error", note: "type=\"error\"：红色图标 + 原因 + 可选的重试按钮。" },
      { name: "permission-limited", note: "权限失败用 error 类型并说明所需权限与申请入口。" },
      { name: "mobile", note: "宽度适配屏幕（左右各 16px），不遮挡状态栏。" },
      { name: "dark-mode", note: "深色底 + 浅色文字，使用语义令牌。" },
    ],
    interaction: [
      "默认 3 秒自动消失，hover 暂停计时。",
      "同一 key 的调用更新内容而不是堆叠（提交中 → 提交成功）。",
      "同屏最多 3 条，超出进入队列。",
    ],
    keyboard: [
      "弹出时不抢占焦点。",
      "内嵌按钮（重试等）可 Tab 到达。",
    ],
    accessibility: [
      "role=\"status\" 播报；error 用 role=\"alert\"。",
      "自动消失时间 ≥ 3 秒，重要结果建议 5 秒。",
    ],
    responsive: [
      "移动端左右各留 16px，不遮状态栏与底部手势区。",
      "长文案换行，不撑出屏幕。",
    ],
    content: [
      "一句话结果 + 对象：“已保存到示例项目（project-042）”。",
      "失败说原因与下一步，不只说“操作失败”。",
    ],
    dos: [
      "成功后指明作用对象。",
      "异步动作用同一 key 从 loading 更新为结果。",
      "失败给出原因。",
    ],
    donts: [
      "不要用 Message 展示需要用户处理的信息（用 Alert）。",
      "不要堆叠超过 3 条。",
      "不要在 Message 里放多行长文本（用 Notification）。",
    ],
    related: ["alert", "notification", "spin", "button"],
  },
  {
    id: "notification",
    name: "Notification",
    chineseName: "通知",
    category: "feedback",
    status: "beta",
    version: "0.1.0",
    purpose: "系统侧的异步事件通知，带标题与操作，可停留等待用户处理。",
    usage:
      "用于任务完成、审批结果、预约到点等与当前页面上下文弱相关的事件。三者分工：Notification 是异步事件通知（带标题与操作、可停留）；Message 是当前操作的即时轻反馈；Alert 是页面内的持续上下文提醒。",
    keywords: ["notification", "notice", "通知", "消息", "异步"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "右上角滑入卡片：类型图标 + 标题 + 描述 + 操作，默认 4.5 秒消失。",
        code: `<Button variant="secondary" onClick={() =>
  notification.open({
    type: "success",
    title: "计算任务已完成",
    description: "run-28003 电导率计算已完成，耗时 286.4 秒。",
    actions: [{ label: "查看结果", href: "#/runs/run-28003" }],
  })
}>
  演示通知
</Button>`,
        preview: "notification/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "error 类型常驻直到用户处理；描述带稳定 ID，操作直达目标页面。",
        code: `notification.open({
  type: "error",
  title: "计算任务执行失败",
  description: "run-28002 结构优化失败：K 点网格与截断能设置冲突。",
  duration: 0,
  actions: [
    { label: "查看日志", href: "#/runs/run-28002/logs" },
    { label: "重新提交", onClick: () => retryRun("run-28002") },
  ],
})`,
        preview: "notification/business",
      },
    ],
    props: [
      { name: "type", type: '"success" | "error" | "warning" | "info"', required: true, description: "类型，决定图标与语义。" },
      { name: "title", type: "ReactNode", required: true, description: "事件结论。" },
      { name: "description", type: "ReactNode", required: true, description: "事件详情，包含稳定 ID（如 run-28003）。" },
      { name: "actions", type: "Array<{ label: string; href?: string; onClick?: () => void }>", description: "操作按钮，最多 2 个，第一个为主跳转。" },
      { name: "duration", type: "number", default: "4.5", description: "自动关闭秒数；0 表示常驻。" },
      { name: "placement", type: '"topRight" | "bottomRight"', default: '"topRight"', description: "弹出位置。" },
    ],
    states: [
      { name: "default", note: "右上角滑入卡片：类型图标 + 标题 + 描述 + 操作。" },
      { name: "hover", note: "hover 暂停自动关闭计时。" },
      { name: "focus-visible", note: "操作与关闭按钮有品牌色焦点环。" },
      { name: "pressed", note: "不适用：通知本体不可按压，按压反馈由内部按钮承担。", applicable: false },
      { name: "disabled", note: "不适用：通知无禁用态。", applicable: false },
      { name: "loading", note: "不适用：通知是事件结果；过程进度用 Progress / Message loading。", applicable: false },
      { name: "empty", note: "不适用：无事件不弹出通知。", applicable: false },
      { name: "error", note: "error 类型默认常驻（duration 0），直到用户处理或手动关闭。" },
      { name: "permission-limited", note: "审批被拒等权限事件用 warning 类型，并给出联系人入口。" },
      { name: "mobile", note: "全宽顶部浮层，操作按钮允许换行。" },
      { name: "dark-mode", note: "深色卡片使用语义令牌。" },
    ],
    interaction: [
      "默认 4.5 秒自动消失；error 常驻。",
      "点击操作跳转后通知自动关闭。",
      "同一事件的重复通知更新内容，而不是堆叠。",
    ],
    keyboard: [
      "出现时不抢占焦点。",
      "通知内的操作与关闭按钮可 Tab 到达。",
    ],
    accessibility: [
      "role=\"status\"；error 用 role=\"alert\"。",
      "常驻通知必须有可见的关闭按钮。",
    ],
    responsive: [
      "移动端全宽浮层，左右各留 16px。",
      "操作按钮允许换行，不溢出。",
    ],
    content: [
      "标题 = 事件结论（“计算任务已完成”）。",
      "描述必须包含稳定 ID（run-28003），便于追踪。",
    ],
    dos: [
      "描述带稳定 ID，可追踪。",
      "error 常驻直到处理。",
      "给出“查看结果”直达链接。",
    ],
    donts: [
      "不要用通知做当前操作的即时反馈（用 Message）。",
      "不要一次弹出多条堆叠。",
      "不要在通知里放表单。",
    ],
    related: ["alert", "message", "run-status", "badge"],
  },
  {
    id: "progress",
    name: "Progress",
    chineseName: "进度条",
    category: "feedback",
    status: "beta",
    version: "0.1.0",
    purpose: "展示确定性任务的完成比例，让用户知道还要等多久。",
    usage:
      "用于可量化进度：数据导入、文件上传、批量计算完成度。无法量化进度的等待用 Spin；任务整体状态用 run-status / Steps。",
    keywords: ["progress", "bar", "进度", "百分比", "上传"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "品牌色轨道 + 等宽百分比；完成态变为绿色。",
        code: `<Progress percent={62} />
<Progress percent={100} status="success" />`,
        preview: "progress/basic",
      },
      {
        id: "status",
        title: "状态变体",
        kind: "variant",
        description: "error 停在失败点并给出原因；active 表示进行中。",
        code: `<Progress percent={80} status="active" />
<Progress percent={45} status="error" format={() => "导入中断"} />`,
        preview: "progress/status",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入进度：邻近文案说明对象、当前位置与预计剩余时间。",
        code: `<div className="import-progress">
  <Progress percent={62} status="active" />
  <span>正在导入 ds-118 · 第 620/1,000 行 · 预计剩余 40 秒</span>
  <Button size="sm" variant="ghost" onClick={cancelImport}>取消</Button>
</div>`,
        preview: "progress/business",
      },
    ],
    props: [
      { name: "percent", type: "number", required: true, description: "完成百分比，0–100。" },
      { name: "status", type: '"active" | "success" | "error"', description: "状态；缺省时按 percent 推断。" },
      { name: "showInfo", type: "boolean", default: "true", description: "是否显示百分比文字。" },
      { name: "size", type: '"default" | "sm"', default: '"default"', description: "sm 用于表格行内等紧凑场景。" },
      { name: "format", type: "(percent: number) => ReactNode", description: "自定义文字，如“导入中断”。" },
    ],
    states: [
      { name: "default", note: "品牌色进度条，右侧等宽百分比。" },
      { name: "hover", note: "不适用：进度条为纯展示，无 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：本体不可聚焦；内嵌的取消按钮自带焦点环。", applicable: false },
      { name: "pressed", note: "不适用：进度条不可按压。", applicable: false },
      { name: "disabled", note: "不适用：进度条无禁用态。", applicable: false },
      { name: "loading", note: "status=\"active\" 即进行中，轨道动画表达活跃。" },
      { name: "empty", note: "不适用：percent 为 0 即初始态，不是空态。", applicable: false },
      { name: "error", note: "status=\"error\" 红色并停在失败点，邻近文案给出原因。" },
      { name: "permission-limited", note: "不适用：无权限时不展示任务本身，由权限提示承担。", applicable: false },
      { name: "mobile", note: "行内尺寸降为 sm，百分比保留。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "进行中的任务可配置取消操作，取消后进度条消失并用 Message 反馈。",
      "完成瞬间从 active 过渡到 success，时长 < 300ms，并给出结果入口。",
    ],
    keyboard: [
      "进度条本身不在 Tab 序列。",
      "内嵌的取消按钮在 Tab 序列中。",
    ],
    accessibility: [
      "role=\"progressbar\" + aria-valuenow / valuemin / valuemax。",
      "进度不逐次播报；阶段变化（开始、失败、完成）才播报。",
    ],
    responsive: [
      "窄屏压缩轨道长度，百分比始终保留。",
      "表格行内使用 sm 尺寸。",
    ],
    content: [
      "邻近文案说明“在干什么、到哪了、还要多久”，不只给百分比。",
      "百分比取整数，不显示小数。",
    ],
    dos: [
      "给出对象与预计剩余时间。",
      "失败停在失败点并给原因。",
      "100% 后给出结果入口。",
    ],
    donts: [
      "不要用进度条表示不确定等待（用 Spin）。",
      "不要百分比到 100% 却没有结果反馈。",
      "不要在表格行内放超过一个进度条。",
    ],
    related: ["spin", "message", "file-list", "run-status"],
  },
  {
    id: "spin",
    name: "Spin",
    chineseName: "加载中",
    category: "feedback",
    status: "stable",
    version: "0.1.0",
    purpose: "表示正在加载但无法量化进度，以内联或遮罩方式表达等待。",
    usage:
      "用于区块加载、按钮内加载、提交中等待。可量化进度用 Progress；整页首屏骨架用 Skeleton；异步任务的状态跟踪用 run-status。",
    keywords: ["spin", "loading", "加载", "等待", "转圈"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "三种尺寸；tip 说明在做什么，不写“加载中”。",
        code: `<Spin size="sm" />
<Spin />
<Spin size="lg" tip="正在加载任务详情…" />`,
        preview: "spin/basic",
      },
      {
        id: "container",
        title: "容器加载",
        kind: "variant",
        description: "包裹内容时显示半透明遮罩，加载期间阻止内部交互。",
        code: `<Spin spinning={isLoading} tip="正在重新计算…">
  <ResultPanel data={data} />
</Spin>`,
        preview: "spin/container",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "列表页局部加载：遮罩只覆盖表格区域，筛选栏保持可用。",
        code: `<Spin spinning={isRefreshing} delay={200} tip="正在加载任务列表…">
  <Table caption="示例项目（project-042）· 计算任务列表">{rows}</Table>
</Spin>`,
        preview: "spin/business",
      },
    ],
    props: [
      { name: "spinning", type: "boolean", default: "true", description: "是否显示加载指示。" },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "sm 用于按钮内与行内。" },
      { name: "tip", type: "string", description: "加载文案，说明在做什么。" },
      { name: "delay", type: "number", default: "0", description: "延迟显示的毫秒数，避免短暂加载闪烁。" },
      { name: "fullscreen", type: "boolean", default: "false", description: "整页遮罩，仅限提交中等必须阻断的场景。" },
    ],
    states: [
      { name: "default", note: "品牌色旋转指示，默认尺寸 20px。" },
      { name: "hover", note: "不适用：加载指示非交互元素。", applicable: false },
      { name: "focus-visible", note: "不适用：非交互元素；遮罩期间内部元素不可聚焦。", applicable: false },
      { name: "pressed", note: "不适用：加载指示不可按压。", applicable: false },
      { name: "disabled", note: "不适用：加载期间内容不可交互由遮罩保证，不是 disabled。", applicable: false },
      { name: "loading", note: "Spin 本身就是加载态：delay < 200ms 防闪烁，超过 5 秒必须给 tip。" },
      { name: "empty", note: "不适用：空数据由 Empty 承担。", applicable: false },
      { name: "error", note: "不适用：加载失败后 Spin 停止，错误由 Alert / Message 呈现。", applicable: false },
      { name: "permission-limited", note: "不适用：无权限展示权限提示，而不是无限加载。", applicable: false },
      { name: "mobile", note: "尺寸不缩水；遮罩覆盖安全区。" },
      { name: "dark-mode", note: "遮罩使用深色半透明令牌。" },
    ],
    interaction: [
      "容器加载时遮罩阻止内部交互；加载不可取消，除非业务显式提供取消按钮。",
      "超过 10 秒给出“仍在处理”说明或取消入口。",
    ],
    keyboard: [
      "容器加载期间，焦点移出被遮罩的内容。",
      "显式提供的取消按钮在 Tab 序列中。",
    ],
    accessibility: [
      "role=\"status\" 并朗读 tip；容器 aria-busy=\"true\"。",
      "不只靠旋转动画：必须有 tip 或 sr-only 文本。",
    ],
    responsive: [
      "移动端遮罩覆盖全屏安全区。",
      "小容器内自动降为 sm 尺寸。",
    ],
    content: [
      "tip 说明在做什么：“正在加载任务详情…”。",
      "不写“加载中”这种无信息量文案。",
    ],
    dos: [
      "加 delay 避免闪烁。",
      "长等待给出 tip 与取消入口。",
      "局部加载只遮局部区域。",
    ],
    donts: [
      "不要用整页 Spin 代替首屏骨架（用 Skeleton）。",
      "不要超过 10 秒没有任何说明。",
      "不要嵌套多层 Spin。",
    ],
    related: ["skeleton", "progress", "button", "message"],
  },
  {
    id: "modal",
    name: "Modal",
    chineseName: "对话框",
    category: "overlay",
    status: "stable",
    version: "0.1.0",
    purpose: "在当前页面之上展示需要专注处理的内容或确认，阻断对背景的交互。",
    usage:
      "用于需要用户完成一件事才能继续的场景：创建任务、编辑参数、聚焦查看。与 ConfirmPanel 的关系：ConfirmPanel 基于 Modal 实现，额外回显目标、范围、预算与副作用——凡是有外部副作用或不可恢复的确认动作必须用 ConfirmPanel；轻量就地确认用 Popconfirm；大表单与详情用 Drawer。",
    keywords: ["modal", "dialog", "对话框", "弹窗", "确认"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "打开后焦点进入对话框，Esc 关闭，关闭后焦点回到触发按钮。",
        code: `const [open, setOpen] = useState(false);

<Button variant="primary" onClick={() => setOpen(true)}>打开对话框</Button>
<Modal
  open={open}
  title="重命名数据集"
  onClose={() => setOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
      <Button variant="primary" onClick={handleSave}>保存</Button>
    </>
  }
>
  <Input defaultValue="ds-118 电导率实验数据" aria-label="数据集名称" />
</Modal>`,
        preview: "modal/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "创建计算任务：回显项目与预计耗时；提交中禁用 Esc、遮罩关闭与重复提交。",
        code: `<Modal
  open={open}
  title="创建计算任务"
  onClose={() => setOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>取消</Button>
      <Button variant="primary" loading={submitting} onClick={handleSubmit}>确认创建</Button>
    </>
  }
>
  <p>将在 示例项目（project-042）下创建电导率计算任务。</p>
  <p>输入数据集 ds-118 · 方法 PBE0 · 预计最长 300 秒。</p>
</Modal>`,
        preview: "modal/business",
      },
    ],
    props: [
      { name: "open", type: "boolean", required: true, description: "受控开关。" },
      { name: "title", type: "ReactNode", required: true, description: "对话框目的，aria-labelledby 指向它。" },
      { name: "onClose", type: "() => void", required: true, description: "Esc、遮罩、关闭按钮的统一出口。" },
      { name: "footer", type: "ReactNode", description: "动作区，主按钮右置。" },
      { name: "width", type: "number", default: "520", description: "内容宽度；超过 640 考虑 Drawer。" },
      { name: "maskClosable", type: "boolean", default: "true", description: "点击遮罩关闭；表单类与提交中必须禁用。" },
      { name: "destroyOnClose", type: "boolean", default: "false", description: "关闭后销毁内容，下次打开重置。" },
    ],
    states: [
      { name: "default", note: "role=\"dialog\" aria-modal=\"true\"，居中浮层 + 半透明遮罩，标题即对话框目的。" },
      { name: "hover", note: "关闭按钮与 footer 按钮各自 hover；遮罩无 hover。" },
      { name: "focus-visible", note: "打开后焦点落在第一个可交互元素，焦点环清晰可见。" },
      { name: "pressed", note: "按钮按压反馈；Esc 按下即触发关闭流程。" },
      { name: "disabled", note: "提交中主按钮 disabled + loading，关闭按钮、Esc 与遮罩同时禁用。" },
      { name: "loading", note: "提交中显示 loading，禁止重复提交与意外关闭。" },
      { name: "empty", note: "内容为空时不应打开 Modal（先校验），不存在“空对话框”。" },
      { name: "error", note: "提交失败的错误显示在对话框内顶部（Alert），保留已输入内容，不自动关闭。" },
      { name: "permission-limited", note: "无权限时入口按钮即 disabled 并说明原因，而不是打开后才报错。" },
      { name: "mobile", note: "全宽底部弹出（bottom sheet），最大高度 85vh，主按钮高 ≥ 44px。" },
      { name: "dark-mode", note: "遮罩更深，浮层使用语义令牌。" },
    ],
    interaction: [
      "打开后焦点移入对话框内第一个可交互元素；关闭后焦点还原到触发按钮。",
      "Tab / Shift+Tab 在对话框内循环（焦点陷阱），不允许移到背景。",
      "Esc 关闭；有未保存内容时先二次确认；提交中禁用 Esc 与遮罩关闭。",
      "背景滚动锁定；表单类对话框禁用遮罩点击关闭。",
    ],
    keyboard: [
      "Esc 触发 onClose（提交中禁用）。",
      "Tab 循环陷阱：焦点在对话框内首尾循环。",
      "焦点顺序：关闭按钮 → 内容区 → footer 次动作 → 主动作。",
    ],
    accessibility: [
      "role=\"dialog\" + aria-modal=\"true\" + aria-labelledby 指向标题。",
      "打开时背景根节点设为 inert / aria-hidden。",
      "焦点管理三件套缺一不可：进入聚焦、循环陷阱、退出还原。",
      "必须有可见关闭按钮，不能只靠遮罩点击。",
    ],
    responsive: [
      "窄屏（< 640px）全宽底部弹出，最大高度 85vh。",
      "内容区超高内部滚动，footer 固定可见。",
    ],
    content: [
      "标题是对话框目的（“重命名数据集”），不是“提示”。",
      "主按钮写清动作对象；危险动作必须走 ConfirmPanel。",
      "内容超过一屏说明场景更适合 Drawer。",
    ],
    dos: [
      "打开聚焦、关闭还原焦点。",
      "提交中禁用 Esc、遮罩与重复提交。",
      "错误留在对话框内并保留已输入内容。",
      "危险或有副作用的确认走 ConfirmPanel。",
    ],
    donts: [
      "不要套娃：Modal 上不再开 Modal（用步骤或 Drawer）。",
      "不要把 Modal 当页面用：内容复杂就用 Drawer 或独立页面。",
      "不要无标题或无关闭按钮。",
      "不要在提交中允许遮罩点击关闭。",
    ],
    related: ["confirm-panel", "drawer", "popconfirm", "button", "form"],
  },
  {
    id: "drawer",
    name: "Drawer",
    chineseName: "抽屉",
    category: "overlay",
    status: "beta",
    version: "0.1.0",
    purpose: "从屏幕边缘滑出的辅助面板，承载与当前页强相关的详情或操作，不打断页面上下文。",
    usage:
      "用于任务详情、日志查看、宽表单等需要较大空间但不想离开当前列表的场景。简短确认用 Popconfirm；聚焦单件事用 Modal；有副作用的确认用 ConfirmPanel。",
    keywords: ["drawer", "panel", "抽屉", "侧栏", "详情"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "右缘滑入 240ms，遮罩半透明；Esc 与遮罩点击关闭。",
        code: `const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>查看任务详情</Button>
<Drawer open={open} title="任务详情 · run-28003" placement="right" width={480} onClose={() => setOpen(false)}>
  <Descriptions title="基本信息">{items}</Descriptions>
</Drawer>`,
        preview: "drawer/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "从列表行打开任务详情抽屉：关闭后列表滚动位置与选中行保持。",
        code: `<Drawer
  open={open}
  title="任务详情 · run-28003"
  width={520}
  onClose={() => setOpen(false)}
  footer={<Button variant="primary" onClick={goFullPage}>查看完整日志</Button>}
>
  <Descriptions column={1} items={runSummary} />
  <Collapse defaultActiveKeys={["logs"]}>
    <Collapse.Panel key="logs" header="日志摘要">…</Collapse.Panel>
  </Collapse>
</Drawer>`,
        preview: "drawer/business",
      },
    ],
    props: [
      { name: "open", type: "boolean", required: true, description: "受控开关。" },
      { name: "title", type: "ReactNode", required: true, description: "标题带对象 ID（“任务详情 · run-28003”）。" },
      { name: "onClose", type: "() => void", required: true, description: "Esc、遮罩、关闭按钮的统一出口。" },
      { name: "placement", type: '"right" | "left" | "top" | "bottom"', default: '"right"', description: "滑出方向。" },
      { name: "width", type: "number", default: "480", description: "左右抽屉的宽度。" },
      { name: "maskClosable", type: "boolean", default: "true", description: "点击遮罩关闭；有未保存内容时禁用。" },
      { name: "footer", type: "ReactNode", description: "固定底部动作区。" },
    ],
    states: [
      { name: "default", note: "右缘滑入 240ms，遮罩半透明，默认宽度 480。" },
      { name: "hover", note: "内部控件各自 hover；遮罩无 hover。" },
      { name: "focus-visible", note: "打开后焦点进入抽屉第一个可交互元素。" },
      { name: "pressed", note: "内部按钮按压反馈；Esc 按下即关闭。" },
      { name: "disabled", note: "提交中 footer 主按钮 disabled，Esc 与遮罩关闭同时禁用。" },
      { name: "loading", note: "内容加载中显示骨架，框架（标题、关闭按钮）先到。" },
      { name: "empty", note: "内容为空显示 Empty，不展示一个空白抽屉。" },
      { name: "error", note: "内容加载失败显示原因 + 重试，不自动关闭。" },
      { name: "permission-limited", note: "无权限内容在抽屉内显示权限说明与申请入口。" },
      { name: "mobile", note: "窄屏强制全宽，placement 视为 right 全屏。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "Esc 与遮罩点击关闭；有未保存内容时先二次确认。",
      "打开后焦点进入抽屉，关闭后焦点还原（同 Modal）。",
      "从列表行打开时，关闭后列表滚动位置与选中行保持。",
    ],
    keyboard: [
      "Esc 关闭（提交中禁用）。",
      "Tab 循环限制在抽屉内。",
    ],
    accessibility: [
      "role=\"dialog\" aria-modal=\"true\" aria-labelledby 指向标题。",
      "背景 inert；焦点陷阱与还原同 Modal。",
    ],
    responsive: [
      "窄屏（< 640px）全宽展示。",
      "内容区超高内部滚动，footer 固定。",
    ],
    content: [
      "标题必须带对象 ID（“任务详情 · run-28003”）。",
      "内容分区用标题或 Tabs，不一屏平铺到底。",
    ],
    dos: [
      "详情查看优先 Drawer 而非跳转，保留列表上下文。",
      "宽表单（> 520px）用 Drawer 不用 Modal。",
      "标题带对象 ID。",
    ],
    donts: [
      "不要在抽屉里再开抽屉。",
      "不要把抽屉当全流程页面（超过两屏考虑独立页面）。",
      "不要省略标题中的对象 ID。",
    ],
    related: ["modal", "descriptions", "table", "confirm-panel"],
  },
  {
    id: "popconfirm",
    name: "Popconfirm",
    chineseName: "气泡确认",
    category: "overlay",
    status: "beta",
    version: "0.1.0",
    purpose: "在操作元素旁弹出的小型确认气泡，用于轻量、影响范围小的确认。",
    usage:
      "用于删除一行、移除标签等轻量确认。涉及计算、费用、外部副作用或不可恢复的动作必须用 ConfirmPanel；需要在气泡里放表单或复杂内容时用 Modal。",
    keywords: ["popconfirm", "confirm", "气泡", "确认", "删除"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击触发元素弹出；点击外部或 Esc 取消，不产生副作用。",
        code: `<Popconfirm
  title="删除该文件？"
  description="structure.cif 将从数据集 ds-118 移除，任务产物不受影响。"
  okText="删除"
  cancelText="取消"
  onConfirm={handleDelete}
>
  <Button size="sm" variant="danger">删除</Button>
</Popconfirm>`,
        preview: "popconfirm/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "危险动作用 okDanger；确认中主按钮 loading，禁止重复点击。",
        code: `<Popconfirm
  title="删除该文件？"
  description="raw-data.csv 将从数据集 ds-118 移除，已完成的 2 个任务产物保留。"
  okText="删除"
  cancelText="取消"
  okDanger
  onConfirm={() => removeFile("f-03")}
>
  <Button size="sm" variant="ghost">删除</Button>
</Popconfirm>`,
        preview: "popconfirm/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", required: true, description: "确认问题，是一个问句（“删除该文件？”）。" },
      { name: "description", type: "ReactNode", description: "影响说明：对象与后果。" },
      { name: "okText", type: "string", default: '"确认"', description: "主按钮文案，写动作本身（“删除”），不写“确定”。" },
      { name: "cancelText", type: "string", default: '"取消"', description: "次按钮文案。" },
      { name: "okDanger", type: "boolean", default: "false", description: "危险动作，主按钮红色。" },
      { name: "onConfirm", type: "() => void | Promise<void>", description: "确认回调；返回 Promise 时主按钮 loading 直到完成。" },
      { name: "placement", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "气泡方向，空间不足自动翻转。" },
    ],
    states: [
      { name: "default", note: "气泡宽 240–280px，警告图标 + 问句 + 两个按钮。" },
      { name: "hover", note: "触发元素与气泡内按钮各自 hover。" },
      { name: "focus-visible", note: "打开后焦点落在取消按钮（安全默认），主按钮 Tab 到达。" },
      { name: "pressed", note: "按钮按压反馈，时长 < 120ms。" },
      { name: "disabled", note: "触发元素 disabled 时不弹出，原因在 Tooltip 说明。" },
      { name: "loading", note: "确认后主按钮 loading 直到回调完成，气泡保持打开，禁止重复点击。" },
      { name: "empty", note: "不适用：没有需要确认的内容就不应使用 Popconfirm。", applicable: false },
      { name: "error", note: "确认动作失败后气泡关闭，失败原因由 Message / Alert 呈现。" },
      { name: "permission-limited", note: "无权限时触发元素即 disabled 并说明，不弹气泡。" },
      { name: "mobile", note: "气泡最大宽度适配屏幕，按钮高 ≥ 40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "点击触发元素外部或 Esc 取消，不产生任何副作用。",
      "确认按钮 loading 期间禁止重复点击。",
      "危险动作 okDanger + 描述写清影响对象。",
    ],
    keyboard: [
      "Esc 取消并关闭，焦点回到触发元素。",
      "打开后焦点默认在取消按钮；Tab 在气泡内循环。",
    ],
    accessibility: [
      "role=\"alertdialog\" + aria-describedby 指向描述。",
      "触发元素与气泡之间焦点往返管理。",
    ],
    responsive: [
      "空间不足时自动翻转 placement，不超出视口。",
      "移动端按钮高度 ≥ 40px。",
    ],
    content: [
      "title 是一个问句（“删除该文件？”）。",
      "description 写清影响对象（文件名、所属数据集）。",
      "主按钮文案是动作本身（“删除”），不是“确定”。",
    ],
    dos: [
      "行内轻量删除用 Popconfirm。",
      "危险动作使用 okDanger。",
      "描述写清影响对象与后果。",
    ],
    donts: [
      "不要用 Popconfirm 确认不可恢复动作（用 ConfirmPanel）。",
      "不要在气泡里放表单。",
      "不要主按钮写“确定”。",
    ],
    related: ["modal", "confirm-panel", "button", "file-list"],
  },
];
