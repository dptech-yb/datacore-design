import type { ComponentDoc } from "../types";

/** 数据展示 + 反馈 + 覆盖层组件。 */
export const displayComponents: ComponentDoc[] = [
  {
    id: "table",
    name: "Table",
    chineseName: "表格",
    category: "display",
    status: "stable",
    version: "0.9.0",
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
        code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

<div className="rounded-lg border bg-card">
  <Table className="border-collapse">
    <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">
      示例项目（project-042）· 最近计算任务
    </caption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">任务</TableHead>
        <TableHead scope="col">数据集</TableHead>
        <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
        <TableHead scope="col">状态</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">电导率计算</span>
            <span className="font-mono text-xs text-muted-foreground">run-28003</span>
          </div>
        </TableCell>
        <TableCell className="font-mono">ds-118</TableCell>
        <TableCell className="text-right tabular-nums">286.4</TableCell>
        <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">结构优化</span>
            <span className="font-mono text-xs text-muted-foreground">run-28002</span>
          </div>
        </TableCell>
        <TableCell className="font-mono">ds-121</TableCell>
        <TableCell className="text-right tabular-nums">412.7</TableCell>
        <TableCell><Badge tone="danger" dot>失败</Badge></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`,
        preview: "table/basic",
      },
      {
        id: "scroll",
        title: "窄屏横向滚动",
        kind: "variant",
        description: "列多或屏幕窄时，表格在滚动容器内横向滚动；首列冻结保持定位，不压缩列宽、不挤压换行。",
        code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

{/* Table 自带 overflow-x-auto 容器；给 table 最小宽度即可在窄屏横向滚动 */}
<div className="rounded-lg border bg-card">
  <Table className="min-w-[880px] border-collapse">
    <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">
      数据集 ds-118 · 全部字段
    </caption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col" className="sticky left-0 z-[1] bg-muted">任务</TableHead>
        <TableHead scope="col">数据集</TableHead>
        <TableHead scope="col">方法</TableHead>
        <TableHead scope="col" className="text-right">截断能（eV）</TableHead>
        <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
        <TableHead scope="col" className="text-right">费用（元）</TableHead>
        <TableHead scope="col">状态</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="sticky left-0 z-[1] bg-card">电导率计算 · run-28003</TableCell>
        <TableCell className="font-mono">ds-118</TableCell>
        <TableCell>PBE0</TableCell>
        <TableCell className="text-right tabular-nums">520</TableCell>
        <TableCell className="text-right tabular-nums">286.4</TableCell>
        <TableCell className="text-right tabular-nums">12.40</TableCell>
        <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`,
        preview: "table/scroll",
      },
      {
        id: "states",
        title: "加载、空与错误",
        kind: "state",
        description: "骨架行替换数据行但保留表头；空态说明原因并给出下一步；错误态保留筛选上下文并提供重试。",
        code: `import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

{/* loading：骨架行替换数据行，表头（TableHeader）保留 */}
<TableBody>
  {[0, 1, 2].map((i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-3.5 w-32" /></TableCell>
      <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
      <TableCell><Skeleton className="ml-auto h-3.5 w-12" /></TableCell>
      <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
    </TableRow>
  ))}
</TableBody>

{/* empty：说明原因并给出下一步 */}
<TableBody>
  <TableRow>
    <TableCell colSpan={4} className="h-24 text-center">
      <span className="font-medium">当前筛选条件下没有任务</span>
      <Button variant="link" size="sm" className="h-auto px-0" onClick={clearFilters}>清除筛选</Button>
    </TableCell>
  </TableRow>
</TableBody>

{/* error：保留筛选上下文并提供重试 */}
<TableBody>
  <TableRow>
    <TableCell colSpan={4} className="h-24">
      <div className="flex items-center justify-center gap-2 text-danger">
        <XCircle className="size-4" />
        <span className="font-medium">任务列表加载失败</span>
        <Button variant="secondary" size="sm" onClick={reload}>重试</Button>
      </div>
    </TableCell>
  </TableRow>
</TableBody>`,
        preview: "table/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "计算任务列表：首列名称 + 稳定 ID，数字列右对齐等宽数字，状态用 Badge，行内操作不超过 3 个。",
        code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const runs = [
  { id: "run-28003", name: "电导率计算", dataset: "ds-118", seconds: "286.4", cost: "12.40", status: "已完成", tone: "success" },
  { id: "run-28002", name: "结构优化", dataset: "ds-121", seconds: "412.7", cost: "17.90", status: "失败", tone: "danger" },
  { id: "run-27998", name: "能带计算", dataset: "ds-118", seconds: "1,024.5", cost: "43.20", status: "排队中", tone: "neutral" },
] as const;

<div className="rounded-lg border bg-card">
  <Table className="border-collapse">
    <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">
      示例项目（project-042）· 计算任务列表
    </caption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">任务</TableHead>
        <TableHead scope="col">数据集</TableHead>
        <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
        <TableHead scope="col" className="text-right">费用（元）</TableHead>
        <TableHead scope="col">状态</TableHead>
        <TableHead scope="col">操作</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {runs.map((run) => (
        <TableRow key={run.id}>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium">{run.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{run.id}</span>
            </div>
          </TableCell>
          <TableCell className="font-mono">{run.dataset}</TableCell>
          <TableCell className="text-right tabular-nums">{run.seconds}</TableCell>
          <TableCell className="text-right tabular-nums">{run.cost}</TableCell>
          <TableCell><Badge tone={run.tone} dot>{run.status}</Badge></TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">{run.status === "排队中" ? "取消排队" : "查看日志"}</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>`,
        preview: "table/business",
      },
    ],
    props: [
      { name: "Table", type: "TableHTMLAttributes<HTMLTableElement>", required: true, description: "自带 relative w-full overflow-x-auto 外层容器；className 作用于 <table>，横向滚动给 min-w-[880px] 之类的最小宽度。" },
      { name: "<caption>", type: "原生元素", required: true, description: "放在 Table 内第一个子元素，说明内容范围（项目、时间、筛选）；className=\"caption-top …\" 置顶并弱化。" },
      { name: "TableHeader / TableBody", type: "HTMLAttributes<HTMLTableSectionElement>", description: "<thead> / <tbody>；加载、空、错误时只替换 TableBody，表头保留。" },
      { name: "TableRow", type: "HTMLAttributes<HTMLTableRowElement>", description: "行，hover 浅底；key 用稳定 ID；选中行加 data-state=\"selected\"（品牌色浅底）。" },
      { name: "TableHead", type: "ThHTMLAttributes<HTMLTableCellElement>", description: "表头单元格；写 scope=\"col\"，数字列加 className=\"text-right\"，可排序列加 aria-sort。" },
      { name: "TableCell", type: "TdHTMLAttributes<HTMLTableCellElement>", description: "单元格；数字列 className=\"text-right tabular-nums\"，空 / 错误行用 colSpan 铺满。" },
      { name: "外框", type: "组合", description: "外包 <div className=\"rounded-lg border bg-card\">。" },
      { name: "冻结首列", type: "组合", description: "无 stickyFirstColumn：首列 TableHead/TableCell 加 sticky left-0 z-[1] 与不透明背景（表头 bg-muted，单元格 bg-card）。" },
      { name: "排序 / 选择 / 分页", type: "组合", description: "无内置 columns/rowKey/scroll：排序按钮放进 TableHead 并同步 aria-sort；选择列用 Checkbox；分页用 Pagination。" },
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
      "横向滚动时首列可冻结（sticky left-0），保持行定位。",
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
    version: "0.9.0",
    purpose: "以“标签 + 值”的形式成组展示单条记录的字段，是详情页的标准载体。",
    usage:
      "用于一条记录（任务、数据集、项目）的字段明细。多条记录的对比用 Table；层级数据用 Tree。超过 12 个字段时分组，次要字段收入 Collapse。",
    keywords: ["descriptions", "detail", "描述列表", "详情", "字段"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标签 muted、值正文色，同组标签等宽对齐；ID 与数值用 mono 等宽字体。",
        code: `import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { Badge } from "@/components/ui/badge";

<Descriptions title="任务详情" className="max-w-lg">
  <DescriptionsItem label="任务 ID" mono>run-28003</DescriptionsItem>
  <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
  <DescriptionsItem label="状态">
    <Badge tone="success" dot>已完成</Badge>
  </DescriptionsItem>
  <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
</Descriptions>`,
        preview: "descriptions/basic",
      },
      {
        id: "layout",
        title: "布局变体",
        kind: "variant",
        description: "layout=\"vertical\" 标签在值上方，columns 控制每行字段数（窄屏自动降为 1），bordered 用于正式详情页；labelWidth 调整标签列宽。",
        code: `import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";

<Descriptions title="数据集信息" columns={2} layout="vertical" bordered>
  <DescriptionsItem label="数据集 ID" mono>ds-118</DescriptionsItem>
  <DescriptionsItem label="版本">v3 · 2026-09-18 更新</DescriptionsItem>
  <DescriptionsItem label="数据量" mono>1,000 行 · 12 字段</DescriptionsItem>
  <DescriptionsItem label="创建方式">UniLab 导入</DescriptionsItem>
</Descriptions>

{/* horizontal + 自定义标签宽度；空值自动显示 — */}
<Descriptions columns={2} bordered labelWidth={96}>
  <DescriptionsItem label="方法">PBE0</DescriptionsItem>
  <DescriptionsItem label="截断能" mono>520 eV</DescriptionsItem>
  <DescriptionsItem label="备注" span={2}>{null}</DescriptionsItem>
</Descriptions>`,
        preview: "descriptions/layout",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集详情：两列布局，质量状态字段 span={2} 跨两列，数据集 ID 提供 copyable 复制按钮。",
        code: `import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { Badge } from "@/components/ui/badge";

<Descriptions title="数据集 ds-118" columns={2} labelWidth={80}>
  <DescriptionsItem label="数据集 ID" mono copyable>ds-118</DescriptionsItem>
  <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
  <DescriptionsItem label="版本">v3 · 2026-09-18 更新</DescriptionsItem>
  <DescriptionsItem label="数据量">1,000 行 · 12 字段</DescriptionsItem>
  <DescriptionsItem label="质量状态" span={2}>
    <Badge tone="warning" dot>3 行缺少密度字段</Badge>
  </DescriptionsItem>
</Descriptions>`,
        preview: "descriptions/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", description: "Descriptions 区块标题（h4），同时作为 <dl> 的 aria-labelledby。" },
      { name: "extra", type: "ReactNode", description: "Descriptions 标题行右侧附加内容，如链接按钮。" },
      { name: "columns", type: "1 | 2 | 3 | 4", default: "1", description: "目标列数；手机单列，sm 起最多 2 列，lg 起达到目标列数。" },
      { name: "layout", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "horizontal 标签在左（窄屏自动上下排列），vertical 标签在上。" },
      { name: "bordered", type: "boolean", default: "false", description: "带边框单元格；horizontal 时标签列为 muted 底色。" },
      { name: "labelWidth", type: "number | string", default: "120", description: "horizontal 布局的标签列宽，数字按 px。" },
      { name: "DescriptionsItem label", type: "ReactNode", required: true, description: "字段名（<dt>），名词短语，不带冒号。" },
      { name: "DescriptionsItem span", type: "1 | 2 | 3 | 4", default: "1", description: "跨列数，自动收敛到 columns 以内；窄屏不跨列。" },
      { name: "DescriptionsItem mono", type: "boolean", default: "false", description: "值使用等宽字体 + tabular-nums（ID、数值、时间）。" },
      { name: "DescriptionsItem copyable", type: "boolean | string", description: "显示复制按钮：true 复制值的文本，字符串则复制该字符串；成功后图标变对勾 1.5 秒。" },
      { name: "children（值）", type: "ReactNode", description: "值（<dd>）；null / undefined / 空字符串自动显示 —。" },
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
      { name: "mobile", note: "手机宽度自动单列，horizontal 布局的标签与值改为上下排列。" },
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
    status: "stable",
    version: "0.9.0",
    purpose: "突出展示单个关键数值及其趋势，用于看板与概览区。",
    usage:
      "用于需要一眼读到的核心指标（任务数、成功率、费用）。成组字段明细用 Descriptions；完整分布用 Table 或图表。一屏统计卡不超过 6 个。",
    keywords: ["statistic", "metric", "统计", "数值", "指标", "看板"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "数值大号等宽数字，标签 muted；prefix / suffix 缩小一档贴着数值，unit 弱化显示。",
        code: `import { Statistic } from "@/components/ui/statistic";

<div className="grid gap-3 sm:grid-cols-3">
  <Statistic variant="card" label="本周计算任务" value={128} unit="个" />
  <Statistic variant="card" label="平均成功率" value={86.4} precision={1} suffix="%" />
  <Statistic variant="card" label="本周费用" value={1280.4} precision={2} prefix="¥" />
</div>`,
        preview: "statistic/basic",
      },
      {
        id: "trend",
        title: "趋势变体",
        kind: "variant",
        description: "趋势用箭头 + 文字 + 对比口径表达；goodDirection 决定涨跌哪个是好（绿）；loading 显示数值骨架。",
        code: `import { Statistic } from "@/components/ui/statistic";

<Statistic
  variant="card"
  label="平均耗时"
  value={286.4}
  precision={1}
  unit="秒"
  goodDirection="down"
  trend={{ value: "-12.3%", direction: "down", label: "较上周" }}
  loading={isRefreshing}
/>
{/* 数字趋势自动补正负号并推断方向；失败数上升为坏（红） */}
<Statistic variant="card" label="失败任务" value={6} unit="个" goodDirection="down" trend={{ value: 2, label: "较上周" }} />
<Statistic variant="card" label="成功率" value={86.4} precision={1} suffix="%" trend={{ value: 0, label: "较上周" }} />`,
        preview: "statistic/trend",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目概览统计组：写清统计周期；可点击的统计卡用 <a> 包裹跳转到携带筛选的列表页；无数据显示 —。",
        code: `import { Statistic } from "@/components/ui/statistic";
import { Card } from "@/components/ui/card";

const link =
  "block rounded-lg border bg-card px-4 py-3 transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

<Card className="grid gap-3 p-4">
  <div className="flex flex-wrap items-baseline justify-between gap-2">
    <h4 className="text-base font-semibold">示例项目（project-042）· 近 7 天概览</h4>
    <span className="text-xs text-muted-foreground">统计周期 2026-09-15 – 2026-09-21</span>
  </div>
  <div className="grid gap-3 sm:grid-cols-3">
    <a href="/runs?project=project-042" className={link}>
      <Statistic label="计算任务" value={128} unit="个" trend={{ value: 14, label: "较前 7 天" }} />
    </a>
    <a href="/runs?project=project-042&status=finished" className={link}>
      <Statistic label="成功率" value={86.4} precision={1} suffix="%" trend={{ value: "+1.2%", direction: "up", label: "较前 7 天" }} />
    </a>
    <Statistic variant="card" label="费用" value={null} prefix="¥" />
  </div>
</Card>`,
        preview: "statistic/business",
      },
    ],
    props: [
      { name: "label", type: "ReactNode", required: true, description: "指标名称，写清统计口径（范围、周期）。" },
      { name: "value", type: "number | string | null", description: "数值；数字按 zh-CN 千分位格式化；null / undefined 显示 —。" },
      { name: "precision", type: "number", description: "小数位数（数字值与数字趋势都生效），同组指标保持一致。" },
      { name: "prefix / suffix", type: "ReactNode", description: "紧贴数值、缩小一档的前后缀，如 ¥、%。" },
      { name: "unit", type: "ReactNode", description: "计量单位，弱化显示在数值后，如“个”“秒”。" },
      { name: "trend", type: '{ value: number | string; direction?: "up" | "down" | "flat"; label?: ReactNode }', description: "对比趋势：箭头 + 数值 + 口径；数字自动补正负号并推断方向，含读屏方向文字。" },
      { name: "goodDirection", type: '"up" | "down"', default: '"up"', description: "哪个方向是好：好为 success 色、坏为 danger 色，持平为 muted。" },
      { name: "loading", type: "boolean", default: "false", description: "数值与趋势替换为骨架条，标签保留，容器 aria-busy。" },
      { name: "variant", type: '"plain" | "card"', default: '"plain"', description: "card 带边框卡片样式；可点击统计卡用 <a> 包裹 plain。" },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "数值字号 20 / 24 / 30px。" },
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
    status: "stable",
    version: "0.9.0",
    purpose: "按时间顺序展示事件流，表达“发生了什么、进行到哪、接下来是什么”。",
    usage:
      "用于任务执行记录、审计事件、版本历史等有明确时间顺序的场景。纯步骤导航用 Steps；层级结构用 Tree；审计场景优先使用 audit-timeline。",
    keywords: ["timeline", "history", "时间线", "事件", "记录"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "<ol> 竖向排列，时间使用等宽字体，节点间 1px 连接线；children 为描述。",
        code: `import { Timeline, TimelineItem } from "@/components/ui/timeline";

<Timeline className="max-w-md">
  <TimelineItem time="09:12" title="任务创建">run-28003 已提交到队列</TimelineItem>
  <TimelineItem time="09:14" title="开始执行">分配到计算节点 node-07</TimelineItem>
  <TimelineItem time="09:19" title="执行完成">耗时 286.4 秒</TimelineItem>
</Timeline>`,
        preview: "timeline/basic",
      },
      {
        id: "status",
        title: "状态节点",
        kind: "variant",
        description: "tone 决定圆点语义色（primary / success / warning / danger / neutral / agent），icon 替换圆点；失败节点提供日志入口，pending 表示进行中。",
        code: `import { Sparkles, XCircle } from "lucide-react";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";

<Timeline>
  <TimelineItem time="09:12" title="任务创建" tone="success" />
  <TimelineItem time="09:13" title="参数校验失败" tone="danger" icon={<XCircle />}>
    K 点网格与截断能冲突 · <Button variant="link" size="sm">查看日志</Button>
  </TimelineItem>
  <TimelineItem time="09:14" title="Agent 建议调整 K 点网格" tone="agent" icon={<Sparkles />} />
  <TimelineItem time="09:15" title="修正参数并重新提交" tone="warning" />
  <TimelineItem time="09:16" title="重新校验中" pending />
</Timeline>`,
        preview: "timeline/status",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "run-28003 执行时间线：dateTime 写机器可读时间；末节点 pending 表达“未完待续”。",
        code: `import { CheckCircle2 } from "lucide-react";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";

<Timeline>
  <TimelineItem time="09:12" dateTime="2026-09-21T09:12" title="任务创建" tone="primary">
    run-28003 · 示例项目（project-042）
  </TimelineItem>
  <TimelineItem time="09:14" dateTime="2026-09-21T09:14" title="开始执行" tone="primary">
    数据集 ds-118 · 方法 PBE0
  </TimelineItem>
  <TimelineItem time="09:19" dateTime="2026-09-21T09:19" title="计算完成" tone="success" icon={<CheckCircle2 />}>
    耗时 286.4 秒 · <Button variant="link" size="sm">查看日志</Button>
  </TimelineItem>
  <TimelineItem time="现在" title="结果回传中…" pending />
</Timeline>`,
        preview: "timeline/business",
      },
    ],
    props: [
      { name: "Timeline", type: "OlHTMLAttributes<HTMLOListElement>", required: true, description: "<ol> 容器，按先后顺序放 TimelineItem；倒序（最新在上）由业务自行排列。" },
      { name: "title", type: "ReactNode", required: true, description: "TimelineItem 事件标题，完成态动词短语。" },
      { name: "time", type: "ReactNode", description: "显示时间（<time>，等宽字体），位于标题右侧，窄屏换行。" },
      { name: "dateTime", type: "string", description: "机器可读时间，写入 <time dateTime>。" },
      { name: "tone", type: '"neutral" | "primary" | "success" | "warning" | "danger" | "agent"', default: '"neutral"', description: "节点语义色（圆点背景 / 图标颜色）。" },
      { name: "icon", type: "ReactNode", description: "替换圆点的图标（lucide），颜色跟随 tone；状态不只靠颜色时使用。" },
      { name: "pending", type: "boolean", default: "false", description: "进行中节点：旋转指示 + 弱化标题 + 读屏“（进行中）”，内容区 aria-live=\"polite\"。" },
      { name: "children", type: "ReactNode", description: "描述文字或链接（muted 小号）。" },
    ],
    states: [
      { name: "default", note: "节点竖向排列，时间等宽字体，连接线 1px，节点间距一致。" },
      { name: "hover", note: "节点本身无 hover；节点内的链接按钮各自有 hover。" },
      { name: "focus-visible", note: "节点内的链接按钮有品牌色焦点环。" },
      { name: "pressed", note: "不适用：节点不可按压，按压反馈由节点内按钮承担。", applicable: false },
      { name: "disabled", note: "不适用：展示型组件无禁用态；不可交互的节点本就不渲染控件。", applicable: false },
      { name: "loading", note: "pending 节点显示旋转指示并实时更新，其余节点不受影响。" },
      { name: "empty", note: "无事件显示 Empty“暂无记录”，不渲染一条空轴线。" },
      { name: "error", note: "tone=\"danger\" + XCircle 图标 + 错误摘要 + 查看日志入口。" },
      { name: "permission-limited", note: "无权限事件脱敏为“无权限查看该事件”，时间点保留。" },
      { name: "mobile", note: "始终左对齐单列；时间跟在标题后，空间不足时自动换行。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "需要查看详情（日志摘要、参数快照）时，在描述里放链接按钮或配合 Collapsible，节点本身不可点击。",
      "进行中的最新节点（pending）实时更新；新节点出现时由业务滚动进入视野。",
      "节点内的操作（查看日志）用 Button variant=\"link\"，不超过 1 个。",
    ],
    keyboard: [
      "时间线本身不进入 Tab 序列；节点内的链接按钮可 Tab 到达。",
      "节点内的链接按视觉顺序逐个到达。",
    ],
    accessibility: [
      "使用 ol / li 语义表达先后顺序。",
      "状态不只靠颜色：图标 + 文字同时表达。",
      "pending 节点内容区 aria-live=\"polite\"，并带读屏文字“（进行中）”。",
    ],
    responsive: [
      "始终左对齐单列，窄屏时间自动换到标题下一行。",
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
    status: "stable",
    version: "0.9.0",
    purpose: "以缩进层级展示父子结构数据，支持展开、选择与定位。",
    usage:
      "用于项目目录、数据集层级、分类体系。扁平列表用 Table；时间顺序用 Timeline。层级超过 4 层时必须提供搜索定位。",
    keywords: ["tree", "hierarchy", "树", "层级", "目录"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击箭头展开 / 收起，点击行选中；键盘 ↑↓ 移动、→ 展开、← 收起、Enter 选中。",
        code: `import { Database, FileText, FolderOpen } from "lucide-react";
import { Tree, type TreeNode } from "@/components/ui/tree";

const projectTree: TreeNode[] = [
  {
    id: "project-042",
    label: "示例项目（project-042）",
    icon: <FolderOpen />,
    children: [
      {
        id: "ds-118",
        label: "数据集 ds-118",
        icon: <Database />,
        meta: "1,000 行",
        children: [
          { id: "ds-118/structure", label: "structure.cif", icon: <FileText />, meta: "48 KB" },
          { id: "ds-118/params", label: "params.json", icon: <FileText />, meta: "2 KB" },
        ],
      },
      { id: "ds-121", label: "数据集 ds-121", icon: <Database />, meta: "320 行" },
    ],
  },
];

<Tree aria-label="项目目录" data={projectTree} defaultExpanded={["project-042"]} />`,
        preview: "tree/basic",
      },
      {
        id: "selectable",
        title: "勾选模式",
        kind: "variant",
        description: "checkable 显示三态复选框：父子联动，部分子级选中时父级半选；checked 只记录叶子 ID。",
        code: `import { useState } from "react";
import { Tree } from "@/components/ui/tree";

const [checked, setChecked] = useState<string[]>(["ds-118/structure"]);

<Tree
  aria-label="选择输入文件"
  checkable
  data={projectTree}
  defaultExpanded={["project-042", "ds-118"]}
  checked={checked}
  onCheckedChange={setChecked}
/>
<p>已选 {checked.length} 项</p>`,
        preview: "tree/selectable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目目录树：受控选中高亮；无权限节点 disabled + 锁图标 + “无权限”文字，可聚焦但不可选中。",
        code: `import { useState } from "react";
import { Database, FolderOpen, Lock } from "lucide-react";
import { Tree, type TreeNode } from "@/components/ui/tree";

const data: TreeNode[] = [
  {
    id: "project-042",
    label: "示例项目（project-042）",
    icon: <FolderOpen />,
    children: [
      { id: "ds-118", label: "数据集 ds-118", icon: <Database />, meta: "1,000 行" },
      { id: "ds-121", label: "数据集 ds-121", icon: <Database />, meta: "320 行" },
      { id: "ds-130", label: "数据集 ds-130", icon: <Lock />, meta: "无权限", disabled: true },
    ],
  },
];

const [selected, setSelected] = useState<string | null>("ds-118");

<Tree
  aria-label="项目目录"
  data={data}
  defaultExpanded={["project-042"]}
  selected={selected}
  onSelectedChange={(id) => setSelected(id)}
/>`,
        preview: "tree/business",
      },
    ],
    props: [
      { name: "data", type: "TreeNode[]", required: true, description: "节点数组：{ id, label, icon?, meta?, children?, disabled? }；meta 为右侧次级信息。" },
      { name: "aria-label", type: "string", required: true, description: "树的可访问名称（role=\"tree\"）。" },
      { name: "expanded / defaultExpanded", type: "string[]", default: "[]", description: "受控 / 非受控展开的节点 ID；配合 onExpandedChange(ids)。" },
      { name: "selected / defaultSelected", type: "string | null", default: "null", description: "受控 / 非受控单选节点；非 checkable 时点击或 Enter / Space 选中。" },
      { name: "onSelectedChange", type: "(id: string, node: TreeNode) => void", description: "选中回调；disabled 节点不会触发。" },
      { name: "checkable", type: "boolean", default: "false", description: "显示三态复选框（aria-checked=true / false / mixed），父子联动；此时点击与 Space 勾选。" },
      { name: "checked / defaultChecked", type: "string[]", default: "[]", description: "已勾选的叶子 ID；父级状态由子级推导，不需要写入。" },
      { name: "onCheckedChange", type: "(leafIds: string[]) => void", description: "勾选变化回调，回传全部已勾选叶子 ID。" },
    ],
    states: [
      { name: "default", note: "缩进 16px/级，节点高 32px，展开图标、类型图标与文字对齐。" },
      { name: "hover", note: "节点整行 hover 高亮，不改变缩进。" },
      { name: "focus-visible", note: "节点焦点环可见，方向键导航时焦点位置明确。" },
      { name: "pressed", note: "展开按钮按下即触发，箭头旋转 90°，动画 160ms。" },
      { name: "disabled", note: "disabled 节点文字弱化、不可选中 / 勾选，仍可聚焦（aria-disabled）；原因写在 meta 或 Tooltip。" },
      { name: "loading", note: "组件无内置异步加载：整树加载用 Skeleton；懒加载子级时在 meta 放 Spinner size=\"sm\"。" },
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
    version: "0.9.0",
    purpose: "将次要内容折叠进面板，让页面默认只呈现主线信息。",
    usage:
      "用于高级参数、详情补充、FAQ 等低频但必要的内容。层级导航用 Tree；单条记录的字段分组用 Descriptions 分组。关键副作用、费用、错误信息不允许折叠。",
    keywords: ["collapse", "accordion", "折叠", "手风琴", "面板"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "Accordion type=\"single\" collapsible：点击面板头整行展开 / 收起，箭头方向指示当前状态。",
        code: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible defaultValue="params" className="rounded-lg border bg-card px-4">
  <AccordionItem value="params" className="last:border-b-0">
    <AccordionTrigger className="py-3 text-base hover:no-underline">计算参数</AccordionTrigger>
    <AccordionContent className="text-muted-foreground">
      交换关联泛函 PBE0 · 截断能 520 eV · K 点 4×4×4
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced" className="last:border-b-0">
    <AccordionTrigger className="py-3 text-base hover:no-underline">高级设置</AccordionTrigger>
    <AccordionContent className="text-muted-foreground">最大迭代步数 200 · 收敛阈值 1e-6</AccordionContent>
  </AccordionItem>
</Accordion>`,
        preview: "collapse/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "type=\"multiple\" 可同时展开多个面板；触发行内放状态 Badge，输入文件校验状态一目了然。",
        code: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

<Accordion type="multiple" defaultValue={["input"]} className="rounded-lg border bg-card px-4">
  <AccordionItem value="input" className="last:border-b-0">
    <AccordionTrigger className="gap-3 py-3 text-base hover:no-underline">
      <span className="flex flex-1 items-center gap-2">
        输入文件（3）
        <Badge tone="success" className="ml-auto">已校验</Badge>
      </span>
    </AccordionTrigger>
    <AccordionContent className="font-mono text-muted-foreground">
      structure.cif · params.json · kpoints.conf
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="result" className="last:border-b-0">
    <AccordionTrigger className="gap-3 py-3 text-base hover:no-underline">
      <span className="flex flex-1 items-center gap-2">
        结果文件（2）
        <Badge tone="neutral" className="ml-auto">待生成</Badge>
      </span>
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground">任务 run-28003 完成后生成 output.json 与 report.pdf</AccordionContent>
  </AccordionItem>
</Accordion>`,
        preview: "collapse/business",
      },
    ],
    props: [
      { name: "Accordion type", type: '"single" | "multiple"', required: true, description: "single 一次只展开一个（手风琴），multiple 可同时展开多个。" },
      { name: "collapsible", type: "boolean", default: "false", description: "type=\"single\" 时允许再次点击收起当前面板。" },
      { name: "defaultValue / value", type: "string | string[]", description: "默认 / 受控展开的面板 value（multiple 时为数组），配合 onValueChange。" },
      { name: "AccordionItem value", type: "string", required: true, description: "面板唯一标识；disabled 禁止展开。" },
      { name: "AccordionTrigger", type: "ButtonHTMLAttributes", required: true, description: "面板头（button + aria-expanded，Radix 处理 aria-controls 与 ↑↓ 键盘）；右侧自带箭头。" },
      { name: "AccordionContent", type: "HTMLAttributes<HTMLDivElement>", description: "内容区（role=\"region\"），展开收起带高度动画；className 作用于内层。" },
      { name: "外框", type: "组合", description: "Accordion 加 className=\"rounded-lg border bg-card px-4\"，最后一项 last:border-b-0；默认触发器 hover 下划线可用 hover:no-underline 关闭。" },
      { name: "状态徽标", type: "组合", description: "无 extra 属性：在 AccordionTrigger 内用 <span className=\"flex flex-1\"> 包住标题和 <Badge className=\"ml-auto\">；触发行内不放按钮。" },
    ],
    states: [
      { name: "default", note: "面板头高 44px，箭头朝右；展开时箭头朝下。" },
      { name: "hover", note: "面板头整行 hover 背景变化。" },
      { name: "focus-visible", note: "面板头有品牌色焦点环。" },
      { name: "pressed", note: "面板头按下时背景再深一档，时长 < 120ms。" },
      { name: "disabled", note: "AccordionItem disabled：面板头不可展开（Radix data-disabled），原因在邻近文案说明。" },
      { name: "loading", note: "面板内容异步加载时内容区显示骨架，面板头保持可用。" },
      { name: "empty", note: "不适用：无内容的面板不应渲染，由业务判断是否提供该面板。", applicable: false },
      { name: "error", note: "内容加载失败在面板内显示重试，不影响其他面板。" },
      { name: "permission-limited", note: "无权限内容在面板内显示权限说明，面板头保留，结构稳定。" },
      { name: "mobile", note: "面板头高度 ≥ 44px，箭头热区扩大。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "点击面板头整行展开/收起；触发行内的状态 Badge 只做展示，不放可点击元素。",
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
      "窄屏面板头允许换行，状态 Badge 保持在箭头左侧。",
      "触摸热区 ≥ 44px。",
    ],
    content: [
      "面板头是名词短语并标注数量（“输入文件（3）”）。",
      "错误、费用、副作用等关键信息不允许折叠。",
    ],
    dos: [
      "默认展开用户最常看的一个面板。",
      "面板头标注内容数量。",
      "触发行内只放状态徽标，不放操作按钮组。",
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
    status: "stable",
    version: "0.9.0",
    purpose: "以等宽字体展示代码与命令，支持语言标签、行号、高亮行、换行切换与一键复制。",
    usage:
      "用于 API 调用示例、配置文件、命令行片段。结构化 JSON 的浏览用 JsonViewer；超长日志用日志查看器。超过 50 行的文件用文件预览，不用 CodeBlock。",
    keywords: ["code", "codeblock", "代码", "命令行", "高亮", "复制"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "命令行片段以 $ 开头表示提示符，复制内容自动去掉提示符；onCopy 可接 toast 反馈。",
        code: `import { CodeBlock } from "@/components/ui/code-block";
import { toast } from "@/components/ui/sonner";

<CodeBlock
  language="bash"
  code="$ datacore runs submit --project project-042 --dataset ds-118"
  onCopy={() => toast.success("已复制命令")}
/>`,
        preview: "code-block/basic",
      },
      {
        id: "highlight",
        title: "行号与高亮行",
        kind: "variant",
        description: "超过 3 行开启 showLineNumbers；highlightLines 标记关键行（浅底 + 左侧色条），并在标题写明行号。",
        code: `import { CodeBlock } from "@/components/ui/code-block";

const code = \`{
  "projectId": "project-042",
  "datasetId": "ds-118",
  "method": "PBE0",
  "maxSeconds": 300
}\`;

<CodeBlock
  language="json"
  title="params.json · 第 4 行需复核"
  code={code}
  showLineNumbers
  highlightLines={[4]}
/>`,
        preview: "code-block/highlight",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "API 示例中域名一律 example.com，凭证用 *** 占位；maxHeight 内部滚动，标题栏可切换自动换行。",
        code: `import { CodeBlock } from "@/components/ui/code-block";
import { toast } from "@/components/ui/sonner";

const code = \`$ curl https://api.example.com/v1/runs/run-28003 \\\\
    -H "Authorization: Bearer ***" \\\\
    -H "Accept: application/json"
$ curl https://api.example.com/v1/runs/run-28003/logs?tail=200 \\\\
    -H "Authorization: Bearer ***"\`;

<CodeBlock
  language="bash"
  title="查询任务状态与日志"
  code={code}
  maxHeight={120}
  onCopy={() => toast.success("已复制命令（不含 $ 提示符）")}
/>`,
        preview: "code-block/business",
      },
    ],
    props: [
      { name: "code", type: "string", required: true, description: "代码文本（按行渲染，不做语法高亮）。" },
      { name: "language", type: "string", description: "语言标签（bash / json / python …），只做标注，显示在标题栏左侧。" },
      { name: "title", type: "ReactNode", description: "标题栏文字，说明用途或文件名。" },
      { name: "showLineNumbers", type: "boolean", default: "false", description: "显示行号（不参与复制与选中），超过 3 行建议开启。" },
      { name: "highlightLines", type: "number[]", default: "[]", description: "需要强调的行号（从 1 开始）：浅底 + 左侧色条。" },
      { name: "maxHeight", type: "number | string", description: "超过该高度代码区内部滚动，标题栏与复制按钮保持可见。" },
      { name: "defaultWrap / showWrapToggle", type: "boolean", default: "false / true", description: "默认是否自动换行；标题栏换行切换按钮（aria-pressed）。" },
      { name: "copyable", type: "boolean", default: "true", description: "显示复制按钮；成功后图标变对勾、文字“已复制”2 秒，并经 aria-live 播报。" },
      { name: "copyText", type: "string", description: "自定义复制内容；默认复制全文并去掉每行开头的 \"$ \" 提示符。" },
      { name: "onCopy", type: "(text: string) => void", description: "复制完成回调，可接 toast。" },
    ],
    states: [
      { name: "default", note: "等宽字体 13px / 行高 24px，标题栏 muted 底色；不做语法高亮，颜色随站点浅色/深色令牌切换。" },
      { name: "hover", note: "复制按钮常显于右上角；hover 时代码块边框加强。" },
      { name: "focus-visible", note: "复制按钮有品牌色焦点环。" },
      { name: "pressed", note: "复制按钮按下有按压反馈，成功后图标变为对勾 2 秒。" },
      { name: "disabled", note: "不适用：代码块无禁用态。", applicable: false },
      { name: "loading", note: "不适用：代码随页面骨架一起加载，无独立加载态。", applicable: false },
      { name: "empty", note: "不适用：无代码内容不渲染 CodeBlock。", applicable: false },
      { name: "error", note: "不适用：静态展示无错误态；加载失败由页面级错误承担。", applicable: false },
      { name: "permission-limited", note: "含敏感配置的代码以脱敏占位行显示（apiKey: \"***\"），不展示真实值。" },
      { name: "mobile", note: "横向滚动保持缩进，不强制换行，字号不降低。" },
      { name: "dark-mode", note: "使用语义令牌自动适配；高亮行为 primary-soft 浅底 + primary 左侧色条。" },
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
      "不做语法高亮，正文用前景色保证对比度；行号 aria-hidden 且不参与复制。",
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
      "标注 language，让读者知道代码类型。",
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
    version: "0.9.0",
    purpose: "以可折叠树展示 JSON 数据，支持按路径展开与复制节点值。",
    usage:
      "用于调试面板、参数快照、API 响应预览等开发态场景。面向普通用户的结构化信息用 Descriptions 或 Table；纯代码文本用 CodeBlock。",
    keywords: ["json", "viewer", "JSON", "调试", "参数快照"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "defaultExpandDepth={1} 只展开第一层，点击箭头或“N 项”展开子树；值按类型着色。",
        code: `import { JsonViewer } from "@/components/ui/json-viewer";

<JsonViewer
  data={{
    runId: "run-28003",
    status: "finished",
    seconds: 286.4,
    cached: false,
    note: null,
    params: { method: "PBE0", cutoff: 520 },
  }}
  defaultExpandDepth={1}
/>`,
        preview: "json-viewer/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务参数快照：行内复制路径与复制值，maskKeys 中的敏感字段一律显示 ***。",
        code: `import { JsonViewer } from "@/components/ui/json-viewer";
import { toast } from "@/components/ui/sonner";

<JsonViewer
  data={snapshot}
  defaultExpandDepth={2}
  copyPath
  copyValue
  maskKeys={["credential"]}
  maxHeight={360}
  onCopy={(text, kind) => toast.success(kind === "path" ? "已复制路径 " + text : "已复制值")}
/>

// snapshot 结构示例：
// { runId: "run-28003", project: { id: "project-042", name: "示例项目" },
//   params: { method: "PBE0", cutoff: 520, kpoints: [4, 4, 4] },
//   dataset: { id: "ds-118", version: 3 }, credential: "…" }`,
        preview: "json-viewer/business",
      },
    ],
    props: [
      { name: "data", type: "unknown", required: true, description: "要展示的 JSON 值（对象、数组或原始值）。" },
      { name: "defaultExpandDepth", type: "number", default: "1", description: "默认展开层级；0 只显示根节点摘要，大对象不超过 2。" },
      { name: "copyPath", type: "boolean", default: "false", description: "行内“复制路径”按钮（如 params.kpoints[2]），hover / 聚焦时显示，触屏常显。" },
      { name: "copyValue", type: "boolean", default: "false", description: "行内“复制值”按钮；对象 / 数组复制格式化 JSON。" },
      { name: "maskKeys", type: "string[]", default: "[]", description: "这些键名的值一律显示并复制为 ***，键名保留。" },
      { name: "maxHeight", type: "number | string", description: "超过该高度内部滚动。" },
      { name: "onCopy", type: '(text: string, kind: "path" | "value") => void', description: "复制完成回调，可接 toast。" },
    ],
    states: [
      { name: "default", note: "键名 agent 色；字符串 success、数字 primary、布尔 warning、null 斜体 muted；等宽字体，缩进 16px/级。" },
      { name: "hover", note: "行 hover 浅底并显示复制按钮；触屏设备（hover: none）常显。" },
      { name: "focus-visible", note: "展开图标与复制按钮有品牌色焦点环。" },
      { name: "pressed", note: "展开后箭头旋转 90°，过渡 120ms。" },
      { name: "disabled", note: "不适用：查看器无禁用态。", applicable: false },
      { name: "loading", note: "不适用：数据随页面骨架加载，无独立加载态。", applicable: false },
      { name: "empty", note: "空对象 / 空数组显示 {} / [] 占位，不渲染空节点。" },
      { name: "error", note: "组件只接收已解析的值：字符串先 JSON.parse，失败时由业务用 Alert 显示错误位置，不渲染 JsonViewer。" },
      { name: "permission-limited", note: "敏感字段值显示 ***，键名保留，便于理解结构。" },
      { name: "mobile", note: "横向滚动保持缩进；操作按钮常显，不依赖 hover。" },
      { name: "dark-mode", note: "使用语义令牌，类型着色对比度 ≥ 4.5:1。" },
    ],
    interaction: [
      "点击箭头展开/收起子树；点击键名复制路径。",
      "超长字符串自动换行（break-all），不截断。",
      "大对象（> 1000 节点）不要一次性交给 JsonViewer：先分页或只传需要的子树。",
    ],
    keyboard: [
      "展开按钮 Tab 聚焦，Enter / Space 切换。",
      "复制按钮在行聚焦（focus-within）时显示，可 Tab 到达。",
    ],
    accessibility: [
      "展开按钮是原生 button，带 aria-expanded 与“展开 / 收起 键名”的 aria-label；层级用嵌套 ul / li 表达。",
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
      "大对象只传需要的子树，并设置 maxHeight。",
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
    status: "stable",
    version: "0.9.0",
    purpose: "以列表展示文件及其状态，支持预览、下载、删除与上传进度。",
    usage:
      "用于数据集附件、任务产物、导入文件清单。大目录浏览用 Tree + Table；上传交互本身用 Upload；轻量删除确认用 Popconfirm。",
    keywords: ["file", "list", "文件", "附件", "上传"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "类型图标 + 文件名 + 大小 + 操作；操作用 ghost 图标按钮放在 actions，常显不依赖 hover。",
        code: `import { Download, Trash2 } from "lucide-react";
import { FileList, FileListItem } from "@/components/ui/file-list";
import { Button } from "@/components/ui/button";

function FileActions({ name }: { name: string }) {
  return (
    <>
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={"下载 " + name}>
        <Download />
      </Button>
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={"删除 " + name}>
        <Trash2 />
      </Button>
    </>
  );
}

<FileList>
  <FileListItem name="structure.cif" size="48 KB" actions={<FileActions name="structure.cif" />} />
  <FileListItem name="params.json" size="2 KB" actions={<FileActions name="params.json" />} />
</FileList>`,
        preview: "file-list/basic",
      },
      {
        id: "states",
        title: "上传中、成功与失败",
        kind: "state",
        description: "uploading 显示 Progress 与百分比并可取消；success 标记“已上传”；error 行保留并给出重试与移除两个出口。",
        code: `import { X } from "lucide-react";
import { FileList, FileListItem } from "@/components/ui/file-list";
import { Button } from "@/components/ui/button";

<FileList>
  <FileListItem name="raw-data.csv" size="1.2 MB" status="uploading" progress={62} onCancel={() => cancelUpload("raw-data.csv")} />
  <FileListItem name="kpoints.conf" size="1 KB" status="success" />
  <FileListItem
    name="notes.pdf"
    size="860 KB"
    status="error"
    error="格式不支持（仅支持 .cif / .json / .csv）"
    onRetry={() => retry("notes.pdf")}
    actions={
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="移除 notes.pdf">
        <X />
      </Button>
    }
  />
</FileList>`,
        preview: "file-list/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集 ds-118 附件清单：默认展示 3 个，超出折叠为“查看全部（N）”。",
        code: `import { useState } from "react";
import { FileList, FileListItem } from "@/components/ui/file-list";
import { Button } from "@/components/ui/button";

const [expanded, setExpanded] = useState(false);
const visible = expanded ? attachments : attachments.slice(0, 3);

<p className="text-xs text-muted-foreground">数据集 ds-118 · 附件（共 {attachments.length} 个）</p>
<FileList>
  {visible.map((file) => (
    <FileListItem key={file.name} name={file.name} size={file.size} actions={<FileActions name={file.name} />} />
  ))}
</FileList>
<Button variant="link" size="sm" onClick={() => setExpanded((v) => !v)}>
  {expanded ? "收起" : "查看全部（" + attachments.length + "）"}
</Button>`,
        preview: "file-list/business",
      },
    ],
    props: [
      { name: "FileList", type: "HTMLAttributes<HTMLUListElement>", required: true, description: "<ul> 容器，行间距 8px；折叠 / 空态由业务组合。" },
      { name: "name", type: "string", required: true, description: "FileListItem 文件名（含扩展名）；超长时截断主体、保留扩展名，完整名在 title。" },
      { name: "size", type: "string", description: "已格式化的大小，如 “48 KB”。" },
      { name: "status", type: '"idle" | "uploading" | "success" | "error"', default: '"idle"', description: "uploading 显示进度条与百分比；success 显示“已上传”；error 换成警告图标并显示原因。" },
      { name: "progress", type: "number", default: "0", description: "上传进度 0–100（Progress，role=\"progressbar\"）。" },
      { name: "error", type: "ReactNode", description: "失败原因（role=\"alert\"），说人话。" },
      { name: "onRetry / onCancel", type: "() => void", description: "提供时分别在 error 显示“重试”、在 uploading 显示“取消”按钮。" },
      { name: "actions", type: "ReactNode", description: "右侧操作区：下载、删除等 ghost 图标按钮（写 aria-label）；删除前用 Popconfirm 确认。" },
      { name: "icon", type: "ReactNode", description: "自定义类型图标；默认按扩展名推断（json / csv / 图片 / 压缩包 / 代码 / 文本）。" },
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
      "上传中行的“取消”按钮与失败行的“重试”按钮可 Tab 到达，aria-label 带文件名。",
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
    version: "0.9.0",
    purpose: "在页面或区块内展示需要持续关注的上下文提示，随内容出现，不自动消失。",
    usage:
      "用于与当前上下文强相关、需要用户看到或处理的信息：数据质量问题、权限提醒、阻断原因。三者分工：操作结果的轻量反馈用 Message（自动消失）；与当前页面弱相关的异步事件用 Notification（可停留）；需要持续关注的上下文信息用 Alert（常驻页面）。",
    keywords: ["alert", "banner", "警告", "提示", "横幅"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "info / success / warning / danger 四种语义变体，图标 + 标题 + 描述同时表达，不只靠颜色。",
        code: `import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert variant="info" role="status">
  <Info className="size-4" />
  <AlertTitle className="mt-0 text-base font-semibold">计算任务将于今晚 22:00 排队执行</AlertTitle>
  <AlertDescription className="text-muted-foreground">示例项目（project-042）· 队列预计等待 20 分钟</AlertDescription>
</Alert>
<Alert variant="success" role="status">
  <CheckCircle2 className="size-4" />
  <AlertTitle className="mt-0 text-base font-semibold">数据集 ds-118 校验通过</AlertTitle>
  <AlertDescription className="text-muted-foreground">1,000 行全部通过字段校验</AlertDescription>
</Alert>
<Alert variant="warning" role="status">
  <AlertTriangle className="size-4" />
  <AlertTitle className="mt-0 text-base font-semibold">3 行缺少密度字段</AlertTitle>
  <AlertDescription className="text-muted-foreground">缺失行将以项目默认值填充，可在导入预览中逐行修改</AlertDescription>
</Alert>
{/* 阻断错误保留默认 role="alert" */}
<Alert variant="danger">
  <XCircle className="size-4" />
  <AlertTitle className="mt-0 text-base font-semibold">任务 run-28002 执行失败</AlertTitle>
  <AlertDescription className="text-muted-foreground">K 点网格与截断能设置冲突，请检查参数后重试</AlertDescription>
</Alert>`,
        preview: "alert/basic",
      },
      {
        id: "closable",
        title: "可关闭与操作",
        kind: "variant",
        description: "非阻断型提示可关闭：右上角放 ghost 图标 Button（aria-label=\"关闭提示\"）；操作链接放在描述里。",
        code: `import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const [visible, setVisible] = useState(true);

{visible && (
  <Alert variant="warning" role="status" className="pr-12">
    <AlertTriangle className="size-4" />
    <AlertTitle className="mt-0 text-base font-semibold">项目额度剩余 12%</AlertTitle>
    <AlertDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
      示例项目（project-042）本周期额度即将用完
      <Button variant="link" size="sm">查看用量</Button>
    </AlertDescription>
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-2 top-2 size-7 text-muted-foreground"
      aria-label="关闭提示"
      onClick={() => setVisible(false)}
    >
      <X />
    </Button>
  </Alert>
)}`,
        preview: "alert/closable",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入流程中的质量提醒：阻断在提交前，描述下方是操作区（最多 2 个按钮）。",
        code: `import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

<Alert variant="warning">
  <AlertTriangle className="size-4" />
  <AlertTitle className="mt-0 text-base font-semibold">3 行缺少密度字段，无法直接提交</AlertTitle>
  <AlertDescription className="text-muted-foreground">
    第 128、512、907 行缺失。可逐行补全，或以项目默认值 2.50 g/cm³ 填充后继续。
    <div className="mt-2 flex flex-wrap gap-2">
      <Button variant="secondary" size="sm">查看缺失行</Button>
      <Button size="sm">以默认值填充</Button>
    </div>
  </AlertDescription>
</Alert>`,
        preview: "alert/business",
      },
    ],
    props: [
      { name: "variant", type: '"default" | "info" | "success" | "warning" | "danger" | "destructive"', default: '"default"', description: "Alert 语义变体：浅底 + 同色边框 + 同色图标，正文保持前景色。" },
      { name: "role", type: "string", default: '"alert"', description: "Alert 默认 role=\"alert\"（打断播报）；一般提示改为 role=\"status\"。" },
      { name: "图标", type: "ReactNode（首个子元素）", description: "lucide 图标放在第一个子元素，自动定位到左上角并按变体着色，后续内容左缩进。" },
      { name: "AlertTitle", type: "HTMLAttributes<HTMLHeadingElement>", required: true, description: "一句话结论（<h5>）；建议 className=\"text-base font-semibold\"。" },
      { name: "AlertDescription", type: "HTMLAttributes<HTMLDivElement>", description: "原因与下一步；可在内部放链接或按钮组。" },
      { name: "关闭", type: "组合", description: "无 closable 属性：Alert 加 pr-12，右上角放 Button variant=\"ghost\" size=\"icon\"（absolute right-2 top-2）+ aria-label=\"关闭提示\"，由业务控制显隐。" },
      { name: "操作区", type: "组合", description: "无 action 属性：链接按钮跟在描述后，或在描述下方放 <div className=\"mt-2 flex gap-2\"> 按钮组，最多 2 个。" },
    ],
    states: [
      { name: "default", note: "左侧类型图标 + 结论标题，背景为类型色浅底，与页面同宽或随区块。" },
      { name: "hover", note: "仅内部操作与关闭按钮有 hover；Alert 本体无 hover。" },
      { name: "focus-visible", note: "关闭与操作按钮有品牌色焦点环。" },
      { name: "pressed", note: "不适用：Alert 本体不可按压，按压反馈由内部按钮承担。", applicable: false },
      { name: "disabled", note: "不适用：Alert 无禁用态。", applicable: false },
      { name: "loading", note: "不适用：加载中的等待用 Spin / Skeleton，不用 Alert。", applicable: false },
      { name: "empty", note: "不适用：无内容不渲染 Alert。", applicable: false },
      { name: "error", note: "variant=\"danger\" 即错误态本身：结论 + 原因 + 下一步，不只用红色。" },
      { name: "permission-limited", note: "权限类提醒用 variant=\"warning\"，并给出申请权限或联系人入口。" },
      { name: "mobile", note: "标题与描述换行展示，操作按钮在描述下方整行（flex-wrap）。" },
      { name: "dark-mode", note: "浅底深字使用语义令牌，对比度 ≥ 4.5:1。" },
    ],
    interaction: [
      "阻断型 Alert 不提供关闭；可关闭的 Alert 关闭只是隐藏，问题未解决时会再次出现。",
      "操作按钮跳转后携带当前上下文（项目、筛选、行号）。",
      "同一时间同一区域最多 2 条，超出合并为摘要。",
    ],
    keyboard: [
      "关闭按钮 aria-label=\"关闭提示\"，进入 Tab 序列。",
      "操作按钮按视觉顺序到达。",
    ],
    accessibility: [
      "一般提示 role=\"status\"，阻断错误 role=\"alert\"。",
      "类型不只靠颜色：图标 + 文字同时表达。",
      "新出现的 Alert 由 aria-live 播报，不抢占焦点。",
    ],
    responsive: [
      "窄屏操作按钮下移整行，不与标题挤压。",
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

{/* 应用根节点已挂载 <Toaster />（顶部居中） */}
<Button onClick={() => toast.success("已保存到示例项目（project-042）")}>
  保存
</Button>
<Button variant="secondary" onClick={() => toast.error("保存失败：网络异常，请重试")}>
  演示失败
</Button>`,
        preview: "message/basic",
      },
      {
        id: "types",
        title: "类型变体",
        kind: "variant",
        description: "success / warning / error / loading 四种常用类型，图标 + 文字表达。",
        code: `import { toast } from "@/components/ui/sonner";

toast.success("已复制任务 ID run-28003");
toast.warning("项目额度剩余不足 20%");
toast.error("提交失败：参数校验未通过");

// loading 返回 id，之后用同一 id 更新为结果，不堆叠
const id = toast.loading("正在提交…");
toast.success("提交成功", { id });`,
        preview: "message/types",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "异步动作用同一 id 从 loading 更新为结果，不堆叠两条。",
        code: `import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

function SaveDatasetButton() {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const id = toast.loading("正在保存到示例项目（project-042）…");
    try {
      await saveDataset();
      toast.success("已保存 · 版本 v3", { id });
    } catch {
      toast.error("保存失败：网络异常，修改未丢失，请重试", { id });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button disabled={saving} onClick={handleSave}>
      {saving && <Loader2 className="animate-spin" />}
      {saving ? "正在保存" : "保存数据集"}
    </Button>
  );
}`,
        preview: "message/business",
      },
    ],
    props: [
      { name: "toast.success / warning / error / info", type: "(message: ReactNode, options?) => id", required: true, description: "按类型弹出一句话结果，返回 id；从 \"@/components/ui/sonner\" 导入。" },
      { name: "toast.loading", type: "(message: ReactNode, options?) => id", description: "进行中提示，不自动消失；之后用同一 id 调 success/error 更新为结果。" },
      { name: "toast.promise", type: "(promise, { loading, success, error }) => id", description: "按 Promise 状态自动从加载切换到成功 / 失败文案。" },
      { name: "options.id", type: "string | number", description: "同一 id 的后续调用原位更新而不是堆叠。" },
      { name: "options.duration", type: "number", default: "4000", description: "自动关闭毫秒数；hover 时暂停计时，Infinity 为常驻。" },
      { name: "options.description", type: "ReactNode", description: "第二行补充说明；需要标题 + 描述 + 操作时属于 Notification 场景。" },
      { name: "toast.dismiss", type: "(id?: string | number) => void", description: "手动关闭指定或全部提示。" },
      { name: "<Toaster />", type: "组件", required: true, description: "在应用根节点挂载一次；本库默认 position=\"top-center\"，主题跟随 <html data-theme>，同屏最多 3 条（visibleToasts）。" },
    ],
    states: [
      { name: "default", note: "顶部居中浮出，图标 + 一句话，白底阴影。" },
      { name: "hover", note: "hover 时暂停自动关闭计时。" },
      { name: "focus-visible", note: "内嵌按钮（如重试）有品牌色焦点环。" },
      { name: "pressed", note: "不适用：Message 本体不可按压。", applicable: false },
      { name: "disabled", note: "不适用：Message 无禁用态。", applicable: false },
      { name: "loading", note: "toast.loading 显示加载提示，用同一 id 更新为结果。" },
      { name: "empty", note: "不适用：无内容不弹出 Message。", applicable: false },
      { name: "error", note: "type=\"error\"：红色图标 + 原因 + 可选的重试按钮。" },
      { name: "permission-limited", note: "权限失败用 error 类型并说明所需权限与申请入口。" },
      { name: "mobile", note: "宽度适配屏幕（左右各 16px），不遮挡状态栏。" },
      { name: "dark-mode", note: "深色底 + 浅色文字，使用语义令牌。" },
    ],
    interaction: [
      "默认 3 秒自动消失，hover 暂停计时。",
      "同一 id 的调用更新内容而不是堆叠（提交中 → 提交成功）。",
      "同屏最多 3 条，超出进入队列。",
    ],
    keyboard: [
      "弹出时不抢占焦点。",
      "内嵌按钮（重试等）可 Tab 到达。",
    ],
    accessibility: [
      "Toaster 区域是 aria-live=\"polite\" 的通知区，新提示自动播报，无需手动加 role。",
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
      "异步动作用同一 id 从 loading 更新为结果。",
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

<Button
  variant="secondary"
  onClick={() =>
    toast.success("计算任务已完成", {
      description: "run-28003 电导率计算已完成，耗时 286.4 秒。",
      position: "top-right",
      duration: 4500,
      action: { label: "查看结果", onClick: () => navigate("/runs/run-28003") },
    })
  }
>
  演示通知
</Button>`,
        preview: "notification/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "error 类型常驻直到用户处理；描述带稳定 ID，操作直达目标页面。",
        code: `import { XCircle, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 浮层形态：error 常驻（duration: Infinity）直到用户处理
toast.error("计算任务执行失败", {
  description: "run-28002 结构优化失败：K 点网格与截断能设置冲突。",
  position: "top-right",
  duration: Infinity,
  closeButton: true,
  action: { label: "查看日志", onClick: () => navigate("/runs/run-28002/logs") },
});

// 常驻卡片形态（通知中心 / 页面内）：Card + 语义令牌组合
<Card role="alert" className="flex w-80 max-w-full items-start gap-2.5 p-3.5 shadow-md">
  <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />
  <div className="grid min-w-0 gap-1">
    <div className="flex items-center gap-1.5 font-semibold">
      计算任务执行失败 <Badge tone="danger">常驻</Badge>
    </div>
    <p className="text-muted-foreground">run-28002 结构优化失败：K 点网格与截断能设置冲突。</p>
    <div className="flex gap-3">
      <Button variant="link" size="sm" className="h-auto px-0">查看日志</Button>
      <Button variant="link" size="sm" className="h-auto px-0" onClick={() => retryRun("run-28002")}>重新提交</Button>
    </div>
  </div>
  <Button variant="ghost" size="icon" className="ml-auto size-7" aria-label="关闭通知" onClick={dismiss}>
    <X />
  </Button>
</Card>`,
        preview: "notification/business",
      },
    ],
    props: [
      { name: "toast.success / warning / error / info", type: "(title: ReactNode, options?) => id", required: true, description: "第一个参数是事件结论（标题），类型决定图标。" },
      { name: "options.description", type: "ReactNode", required: true, description: "事件详情，包含稳定 ID（如 run-28003）。" },
      { name: "options.action", type: "{ label: ReactNode; onClick: (event) => void }", description: "主操作按钮（如“查看结果”），点击后通知自动关闭；次操作用 options.cancel。" },
      { name: "options.position", type: '"top-right" | "bottom-right" | "top-center" | …', default: '"top-center"', description: "Toaster 默认顶部居中；通知类传 \"top-right\"。" },
      { name: "options.duration", type: "number", default: "4000", description: "自动关闭毫秒数；示例用 4500，error 用 Infinity 常驻直到处理。" },
      { name: "options.closeButton", type: "boolean", default: "false", description: "显示关闭按钮；常驻通知必须开启。" },
      { name: "options.id", type: "string | number", description: "同一事件重复通知时传同一 id，原位更新不堆叠。" },
      { name: "常驻卡片形态", type: "组合", description: "通知中心或页面内：Card role=\"alert\" + 类型图标 + 标题/描述 + link 按钮 + 关闭 IconButton（见真实业务示例）。" },
      { name: "<Toaster />", type: "组件", required: true, description: "与 Message 共用，在应用根节点挂载一次。" },
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
      "浮层通知经 Toaster 的 aria-live 区域播报；常驻卡片形态用 role=\"alert\"。",
      "常驻通知必须有可见的关闭按钮（closeButton: true）。",
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

<div className="flex items-center gap-2.5">
  <Progress value={62} />
  <span className="w-10 text-right font-mono text-sm tabular-nums text-muted-foreground">62%</span>
</div>
<div className="flex items-center gap-2.5">
  <Progress value={100} tone="success" />
  <span className="inline-flex items-center gap-1 text-sm text-success">
    <Check className="size-3.5" />
    已完成
  </span>
</div>`,
        preview: "progress/basic",
      },
      {
        id: "status",
        title: "状态变体",
        kind: "variant",
        description: "error 停在失败点并给出原因；active 表示进行中。",
        code: `import { Progress } from "@/components/ui/progress";

<div className="flex items-center gap-2.5">
  <Progress value={80} />
  <span className="w-10 text-right font-mono text-sm tabular-nums text-muted-foreground">80%</span>
</div>
{/* 失败态：停在失败点，用语义令牌覆盖指示条颜色 */}
<div className="flex items-center gap-2.5">
  <Progress value={45} className="[&>div]:bg-danger" />
  <span className="text-sm text-danger">导入中断</span>
</div>`,
        preview: "progress/status",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入进度：邻近文案说明对象、当前位置与预计剩余时间。",
        code: `import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

<div className="grid gap-2.5">
  <div className="flex items-center gap-2.5">
    <Progress value={62} />
    <span className="w-10 text-right font-mono text-sm tabular-nums text-muted-foreground">62%</span>
  </div>
  <div className="flex flex-wrap items-center gap-2.5">
    <span className="text-sm text-muted-foreground">正在导入 ds-118 · 第 620/1,000 行 · 预计剩余 40 秒</span>
    <Button variant="ghost" size="sm" className="ml-auto" onClick={cancelImport}>取消</Button>
  </div>
</div>`,
        preview: "progress/business",
      },
    ],
    props: [
      { name: "value", type: "number", required: true, description: "完成百分比 0–100；同步到 aria-valuenow（role=\"progressbar\" 由 Radix 提供）。" },
      { name: "tone", type: '"primary" | "success" | "warning"', default: '"primary"', description: "指示条颜色：进行中 primary，完成 success，需关注 warning。" },
      { name: "className", type: "string", description: "轨道样式（默认 h-1.5 w-full）；组件只接受 value、tone、className，不透传 aria-label 等属性。" },
      { name: "百分比文字", type: "组合", description: "无 showInfo/format：旁边放 <span className=\"w-10 text-right font-mono tabular-nums\">62%</span>，或写“已完成”“导入中断”。" },
      { name: "失败态", type: "组合", description: "无 danger tone：停在失败点，className=\"[&>div]:bg-danger\" + 邻近红字写明原因。" },
      { name: "进度说明", type: "组合", description: "下方文案写对象、当前位置与预计剩余时间，可配取消按钮。" },
    ],
    states: [
      { name: "default", note: "品牌色进度条，右侧等宽百分比。" },
      { name: "hover", note: "不适用：进度条为纯展示，无 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：本体不可聚焦；内嵌的取消按钮自带焦点环。", applicable: false },
      { name: "pressed", note: "不适用：进度条不可按压。", applicable: false },
      { name: "disabled", note: "不适用：进度条无禁用态。", applicable: false },
      { name: "loading", note: "status=\"active\" 即进行中，轨道动画表达活跃。" },
      { name: "empty", note: "不适用：value 为 0 即初始态，不是空态。", applicable: false },
      { name: "error", note: "status=\"error\" 红色并停在失败点，邻近文案给出原因。" },
      { name: "permission-limited", note: "不适用：无权限时不展示任务本身，由权限提示承担。", applicable: false },
      { name: "mobile", note: "行内尺寸降为 sm，百分比保留。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "进行中的任务可配置取消操作，取消后进度条消失并用 Message 反馈。",
      "完成瞬间切换为 tone=\"success\"，时长 < 300ms，并给出结果入口。",
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
    version: "0.9.0",
    purpose: "表示正在加载但无法量化进度，以内联或遮罩方式表达等待。",
    usage:
      "用于区块加载、按钮内加载、提交中等待。可量化进度用 Progress；整页首屏骨架用 Skeleton；异步任务的状态跟踪用 run-status。",
    keywords: ["spin", "loading", "加载", "等待", "转圈"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "三种尺寸；label 说明在做什么（默认只给读屏，showLabel 时可见）；按钮内加载用 Loader2 + animate-spin。",
        code: `import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

<Spinner size="sm" label="正在加载任务列表" />
<Spinner label="正在加载任务列表" />
<Spinner size="lg" label="正在加载任务详情…" showLabel />
<Button disabled>
  <Loader2 className="animate-spin" />
  正在提交
</Button>`,
        preview: "spin/basic",
      },
      {
        id: "container",
        title: "容器加载",
        kind: "variant",
        description: "LoadingOverlay 包裹一块区域：加载时半透明遮罩 + 说明，内部内容 inert，容器 aria-busy。",
        code: `import { LoadingOverlay } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

<LoadingOverlay loading={isLoading} label="正在重新计算…" className="rounded-lg">
  <Card className="p-4">
    <h4>电导率结果</h4>
    <p>run-28003 · 4.21 S/cm · 数据集 ds-118</p>
  </Card>
</LoadingOverlay>`,
        preview: "spin/container",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "列表页局部加载：遮罩只覆盖表格区域，筛选栏保持可用；delay 200ms 防闪烁。",
        code: `import { LoadingOverlay } from "@/components/ui/spinner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

{/* 筛选栏在 LoadingOverlay 之外，保持可用 */}
<LoadingOverlay loading={isRefreshing} delay={200} label="正在加载任务列表…" className="rounded-lg border bg-card">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">任务</TableHead>
        <TableHead scope="col">数据集</TableHead>
        <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
        <TableHead scope="col">状态</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{rows}</TableBody>
  </Table>
</LoadingOverlay>`,
        preview: "spin/business",
      },
    ],
    props: [
      { name: "Spinner size", type: '"sm" | "default" | "lg"', default: '"default"', description: "14 / 20 / 28px；sm 用于行内。" },
      { name: "Spinner label", type: "string", default: '"正在加载"', description: "说明在做什么；放在 role=\"status\" 内被读屏朗读。" },
      { name: "Spinner showLabel", type: "boolean", default: "false", description: "在指示器旁显示 label；否则 label 为 sr-only。" },
      { name: "LoadingOverlay loading", type: "boolean", required: true, description: "是否显示遮罩；为 true 时容器 aria-busy，内部内容 inert（不可点击、不可聚焦）。" },
      { name: "LoadingOverlay label", type: "string", default: '"正在加载"', description: "遮罩中央的可见说明。" },
      { name: "LoadingOverlay delay", type: "number", default: "0", description: "延迟显示的毫秒数，避免短暂加载闪烁（建议 200）。" },
      { name: "LoadingOverlay size", type: '"sm" | "default" | "lg"', default: '"default"', description: "遮罩内指示器尺寸。" },
      { name: "按钮内加载", type: "组合", description: "Button disabled + <Loader2 className=\"animate-spin\" /> + 动词进行时文案，不用 Spinner。" },
    ],
    states: [
      { name: "default", note: "品牌色旋转指示，默认尺寸 20px。" },
      { name: "hover", note: "不适用：加载指示非交互元素。", applicable: false },
      { name: "focus-visible", note: "不适用：非交互元素；遮罩期间内部元素不可聚焦。", applicable: false },
      { name: "pressed", note: "不适用：加载指示不可按压。", applicable: false },
      { name: "disabled", note: "不适用：加载期间内容不可交互由遮罩保证，不是 disabled。", applicable: false },
      { name: "loading", note: "Spinner 本身就是加载态：LoadingOverlay delay 200ms 防闪烁，超过 5 秒必须给可见 label。" },
      { name: "empty", note: "不适用：空数据由 Empty 承担。", applicable: false },
      { name: "error", note: "不适用：加载失败后移除 Spinner / 关闭 loading，错误由 Alert / Message 呈现。", applicable: false },
      { name: "permission-limited", note: "不适用：无权限展示权限提示，而不是无限加载。", applicable: false },
      { name: "mobile", note: "尺寸不缩水；遮罩覆盖安全区。" },
      { name: "dark-mode", note: "遮罩为 bg-background/75，随主题令牌切换。" },
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
      "Spinner 自带 role=\"status\" 并朗读 label；LoadingOverlay 加载时容器 aria-busy=\"true\"、内容 inert。",
      "不只靠旋转动画：label 默认作为 sr-only 文本，长等待用 showLabel 显示。",
    ],
    responsive: [
      "移动端遮罩覆盖全屏安全区。",
      "小容器内自动降为 sm 尺寸。",
    ],
    content: [
      "label 说明在做什么：“正在加载任务详情…”。",
      "不写“加载中”这种无信息量文案。",
    ],
    dos: [
      "LoadingOverlay 加 delay 避免闪烁。",
      "长等待显示 label 并给出取消入口。",
      "局部加载只遮局部区域。",
    ],
    donts: [
      "不要用整页遮罩代替首屏骨架（用 Skeleton）。",
      "不要超过 10 秒没有任何说明。",
      "不要嵌套多层 LoadingOverlay。",
    ],
    related: ["skeleton", "progress", "button", "message"],
  },
  {
    id: "modal",
    name: "Modal",
    chineseName: "对话框",
    category: "overlay",
    status: "stable",
    version: "0.9.0",
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
        code: `import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>打开对话框</Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>重命名数据集</DialogTitle>
      <DialogDescription>修改数据集 ds-118 的显示名称，数据集 ID 保持不变。</DialogDescription>
    </DialogHeader>
    <Input defaultValue="ds-118 电导率实验数据" aria-label="数据集名称" />
    <DialogFooter className="gap-2 sm:space-x-0">
      <DialogClose asChild>
        <Button variant="secondary">取消</Button>
      </DialogClose>
      <Button onClick={handleSave}>保存</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
        preview: "modal/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "创建计算任务：回显项目与预计耗时；提交中禁用 Esc、遮罩关闭与重复提交。",
        code: `import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

{/* 提交中：忽略 onOpenChange，并阻止 Esc 与遮罩关闭 */}
<Dialog open={open} onOpenChange={(next) => !submitting && setOpen(next)}>
  <DialogTrigger asChild>
    <Button>创建计算任务</Button>
  </DialogTrigger>
  <DialogContent
    className="max-w-md"
    onEscapeKeyDown={(e) => submitting && e.preventDefault()}
    onInteractOutside={(e) => submitting && e.preventDefault()}
  >
    <DialogHeader>
      <DialogTitle>创建计算任务</DialogTitle>
      <DialogDescription>
        将在 示例项目（project-042）下创建电导率计算任务：输入数据集 ds-118 · 方法 PBE0 · 预计最长 300 秒。
      </DialogDescription>
    </DialogHeader>
    <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
      确认后创建可追踪任务并记录审计日志；危险或不可逆动作请使用 ConfirmPanel。
    </div>
    <DialogFooter className="gap-2 sm:space-x-0">
      <DialogClose asChild>
        <Button variant="secondary" disabled={submitting}>取消</Button>
      </DialogClose>
      <Button disabled={submitting} onClick={handleSubmit}>
        {submitting && <Loader2 className="animate-spin" />}
        {submitting ? "正在创建" : "确认创建"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
        preview: "modal/business",
      },
    ],
    props: [
      { name: "Dialog.open / onOpenChange", type: "boolean / (open: boolean) => void", required: true, description: "受控开关；Esc、遮罩、右上角关闭与 DialogClose 都经 onOpenChange(false)，提交中可在这里忽略关闭。" },
      { name: "DialogTrigger.asChild", type: "boolean", description: "包住触发按钮；关闭后焦点自动回到它。" },
      { name: "DialogContent.className", type: "string", description: "内容面板，默认 max-w-lg，内置右上角关闭按钮；常用 \"max-w-md\"，超过 640px 考虑 Drawer。" },
      { name: "DialogContent.onEscapeKeyDown / onInteractOutside", type: "(event) => void", description: "调用 event.preventDefault() 阻止 Esc / 点遮罩关闭；表单类与提交中必须阻止。" },
      { name: "DialogHeader / DialogTitle", type: "部件", required: true, description: "DialogTitle 写对话框目的，Radix 用它做 aria-labelledby，不可省略。" },
      { name: "DialogDescription", type: "部件", description: "补充说明，回显对象与范围，自动关联 aria-describedby。" },
      { name: "DialogFooter", type: "部件", description: "动作区，次动作在前、主动作在后；常用 className=\"gap-2 sm:space-x-0\"。" },
      { name: "DialogClose.asChild", type: "boolean", description: "包住“取消”按钮，点击即关闭。" },
      { name: "关闭后重置", type: "内置", description: "关闭即卸载内容，非受控输入下次打开自动重置；需要保留时把状态提升到 Dialog 外。" },
      { name: "危险确认", type: "组合", description: "不可逆动作用 AlertDialog：AlertDialogContent/Title/Description + AlertDialogCancel + AlertDialogAction（危险时 className={buttonVariants({ variant: \"danger\" })}）；点遮罩不关闭，打开时焦点在取消。" },
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
      "Esc 触发 onOpenChange(false)（提交中在 onEscapeKeyDown 中阻止）。",
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
    status: "stable",
    version: "0.9.0",
    purpose: "从屏幕边缘滑出的辅助面板，承载与当前页强相关的详情或操作，不打断页面上下文。",
    usage:
      "用于任务详情、日志查看、宽表单等需要较大空间但不想离开当前列表的场景。简短确认用 Popconfirm；聚焦单件事用 Modal；有副作用的确认用 ConfirmPanel。",
    keywords: ["drawer", "panel", "抽屉", "侧栏", "详情"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "Sheet 从右缘滑入，遮罩半透明；Esc 与遮罩点击关闭，关闭后焦点回到触发按钮。",
        code: `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="secondary">查看任务详情</Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-full sm:max-w-md">
    <SheetHeader>
      <SheetTitle className="text-md">任务详情 · run-28003</SheetTitle>
      <SheetDescription>示例项目（project-042）中的电导率计算任务</SheetDescription>
    </SheetHeader>
    <Descriptions className="mt-4">
      <DescriptionsItem label="任务 ID" mono copyable>run-28003</DescriptionsItem>
      <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
      <DescriptionsItem label="状态"><Badge tone="success" dot>已完成</Badge></DescriptionsItem>
      <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
    </Descriptions>
  </SheetContent>
</Sheet>`,
        preview: "drawer/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "从列表行打开任务详情抽屉（受控）：头部 / 底部固定、内容区滚动；窄屏可改用 side=\"bottom\"。",
        code: `import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>从列表行打开详情抽屉</Button>
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
    <SheetHeader className="border-b px-6 py-4 pr-12">
      <SheetTitle className="text-md">任务详情 · run-28003</SheetTitle>
      <SheetDescription>数据集 ds-118 · 方法 PBE0</SheetDescription>
    </SheetHeader>
    <div className="grid flex-1 content-start gap-4 overflow-y-auto px-6 py-4">
      <Descriptions>
        <DescriptionsItem label="数据集" mono>ds-118</DescriptionsItem>
        <DescriptionsItem label="方法">PBE0 · 截断能 520 eV</DescriptionsItem>
        <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
        <DescriptionsItem label="费用" mono>¥12.40</DescriptionsItem>
      </Descriptions>
      <CodeBlock language="log" title="日志摘要" showWrapToggle={false} code={logSummary} />
    </div>
    <SheetFooter className="gap-2 border-t px-6 py-3 sm:space-x-0">
      <SheetClose asChild>
        <Button variant="secondary">关闭</Button>
      </SheetClose>
      <Button onClick={goFullLog}>查看完整日志</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
        preview: "drawer/business",
      },
    ],
    props: [
      { name: "Sheet open / onOpenChange", type: "boolean / (open: boolean) => void", description: "受控开关；非受控时用 SheetTrigger。Esc、遮罩、关闭按钮都走 onOpenChange(false)。" },
      { name: "SheetTrigger", type: "asChild", description: "触发按钮（asChild 包 Button），关闭后焦点自动还原到它。" },
      { name: "SheetContent side", type: '"right" | "left" | "top" | "bottom"', default: '"right"', description: "滑出方向；左右默认宽 3/4、sm 起 max-w-sm，用 className 覆盖（如 w-full sm:max-w-lg）。" },
      { name: "SheetContent", type: "Radix Dialog.Content props", required: true, description: "role=\"dialog\"、焦点陷阱与右上角关闭按钮内置；onEscapeKeyDown / onInteractOutside 可在提交中阻止关闭。" },
      { name: "SheetTitle", type: "ReactNode", required: true, description: "标题，带对象 ID（“任务详情 · run-28003”），作为对话框可访问名称。" },
      { name: "SheetDescription", type: "ReactNode", description: "副标题 / 上下文说明。" },
      { name: "SheetHeader / SheetFooter", type: "HTMLAttributes<HTMLDivElement>", description: "头部与固定底部动作区；footer 里用 SheetClose asChild 包“关闭”。" },
      { name: "固定头尾 + 内容滚动", type: "组合", description: "SheetContent className=\"flex flex-col gap-0 p-0\"，中间内容 div 加 flex-1 overflow-y-auto。" },
    ],
    states: [
      { name: "default", note: "右缘滑入，遮罩半透明；默认宽 3/4、sm 起 max-w-sm，详情类建议 sm:max-w-md / lg。" },
      { name: "hover", note: "内部控件各自 hover；遮罩无 hover。" },
      { name: "focus-visible", note: "打开后焦点进入抽屉第一个可交互元素。" },
      { name: "pressed", note: "内部按钮按压反馈；Esc 按下即关闭。" },
      { name: "disabled", note: "提交中 footer 主按钮 disabled，Esc 与遮罩关闭同时禁用。" },
      { name: "loading", note: "内容加载中显示骨架，框架（标题、关闭按钮）先到。" },
      { name: "empty", note: "内容为空显示 Empty，不展示一个空白抽屉。" },
      { name: "error", note: "内容加载失败显示原因 + 重试，不自动关闭。" },
      { name: "permission-limited", note: "无权限内容在抽屉内显示权限说明与申请入口。" },
      { name: "mobile", note: "窄屏 className=\"w-full\" 全宽，或改用 side=\"bottom\"。" },
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="danger" size="sm">删除</Button>
  </PopoverTrigger>
  <PopoverContent side="top" align="start" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
    <div className="flex gap-2">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
      <div className="grid gap-1">
        <p className="font-semibold">删除该文件？</p>
        <p className="text-sm text-muted-foreground">structure.cif 将从数据集 ds-118 移除，任务产物不受影响。</p>
      </div>
    </div>
    <div className="mt-3 flex justify-end gap-1.5">
      <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>取消</Button>
      <Button size="sm" onClick={handleDelete}>删除</Button>
    </div>
  </PopoverContent>
</Popover>`,
        preview: "popconfirm/basic",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "危险动作用 danger 主按钮；确认中主按钮 loading，禁止重复点击。",
        code: `import { AlertTriangle, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

async function confirmRemove() {
  setBusy(true);
  await removeFile("f-03");
  setBusy(false);
  setOpen(false);
  toast.success("已删除 raw-data.csv");
}

{/* 确认中忽略关闭，主按钮 loading 防重复点击 */}
<Popover open={open} onOpenChange={(next) => !busy && setOpen(next)}>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="sm" className="text-danger">删除</Button>
  </PopoverTrigger>
  <PopoverContent side="top" align="end" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
    <div className="flex gap-2">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
      <div className="grid gap-1">
        <p className="font-semibold">删除该文件？</p>
        <p className="text-sm text-muted-foreground">
          raw-data.csv 将从数据集 ds-118 移除，已完成的 2 个任务产物保留。
        </p>
      </div>
    </div>
    <div className="mt-3 flex justify-end gap-1.5">
      <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>取消</Button>
      <Button variant="danger" size="sm" disabled={busy} onClick={confirmRemove}>
        {busy && <Loader2 className="animate-spin" />}
        {busy ? "删除中…" : "删除"}
      </Button>
    </div>
  </PopoverContent>
</Popover>`,
        preview: "popconfirm/business",
      },
    ],
    props: [
      { name: "Popover.open / onOpenChange", type: "boolean / (open: boolean) => void", required: true, description: "受控开关；确认进行中用 (next) => !busy && setOpen(next) 忽略关闭。" },
      { name: "PopoverTrigger.asChild", type: "boolean", description: "包住触发按钮。" },
      { name: "PopoverContent.side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "气泡方向，推荐 top；空间不足自动翻转。" },
      { name: "PopoverContent.align / sideOffset", type: '"start" | "center" | "end" / number', default: '"center" / 4', description: "相对触发器的对齐与间距。" },
      { name: "PopoverContent.role / aria-label", type: "string", description: "确认气泡写 role=\"alertdialog\" aria-label=\"删除确认\"；className=\"w-[268px] p-3\"（默认 w-72 p-4）。" },
      { name: "问题与描述", type: "组合", description: "AlertTriangle 图标 + <p className=\"font-semibold\">问句</p> + 弱化色描述写清影响对象与后果。" },
      { name: "按钮区", type: "组合", description: "取消：<Button variant=\"secondary\" size=\"sm\" onClick={() => setOpen(false)}>；确认：<Button size=\"sm\">，危险时 variant=\"danger\"，文案写动作本身。" },
      { name: "确认中", type: "组合", description: "无 onConfirm Promise：disabled={busy} + <Loader2 className=\"animate-spin\" /> + “删除中…”，完成后关闭并 toast.success。" },
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
      "危险动作主按钮用 variant=\"danger\"，描述写清影响对象。",
    ],
    keyboard: [
      "Esc 取消并关闭，焦点回到触发元素。",
      "打开后焦点默认落在第一个按钮（取消）；需要 Tab 在气泡内循环时给 Popover 设 modal。",
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
