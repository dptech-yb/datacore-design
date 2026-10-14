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
      "不提供 Layout 组件：骨架直接用 Tailwind 的 flex / sticky / max-w 工具类组合语义标签（<aside> <header> <main>），侧栏放 NavMenu，顶栏放 Breadcrumb，内容区顶部放 PageHeader。每个应用只写一次骨架。页面内部的区块排列用 Stack / Grid 写法；内容区需要可拖拽分栏时用 Splitter（Resizable）；弹窗、抽屉和卡片内部不要再套一层骨架。",
    keywords: ["layout", "shell", "sider", "header", "布局", "骨架", "框架", "侧边栏", "tailwind", "flex"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "侧边导航 + 顶栏 + 内容区：flex 横向分栏，右侧再 flex-col 分出吸顶顶栏与可滚动内容区。",
        code: `import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";

<div className="flex min-h-screen bg-canvas">
  <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r bg-card p-3 md:block">
    <NavMenu aria-label="项目导航">
      <NavMenuGroup>
        <NavMenuItem href="/overview">项目概览</NavMenuItem>
        <NavMenuItem href="/runs" active>计算任务</NavMenuItem>
      </NavMenuGroup>
    </NavMenu>
  </aside>
  <div className="flex min-w-0 flex-1 flex-col">
    <header className="sticky top-0 z-10 flex h-[60px] items-center border-b bg-background px-6">
      <AppBreadcrumb />
    </header>
    <main className="flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </main>
  </div>
</div>`,
        preview: "layout/basic",
      },
      {
        id: "content-width",
        title: "内容区宽度",
        kind: "variant",
        description: "max-w-[880px] 给表单与文档，max-w-[1240px] 给列表与工作台，w-full 只给看板与图谱类页面。",
        code: `{/* 表单 / 文档 */}
<div className="mx-auto w-full max-w-[880px]">…</div>
{/* 列表 / 工作台（默认） */}
<div className="mx-auto w-full max-w-[1240px]">…</div>
{/* 看板 / 图谱 */}
<div className="w-full">…</div>`,
        preview: "layout/content-width",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目工作台的完整骨架：项目级导航（含无权限入口）、面包屑顶栏与宽版内容区。",
        code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";
import { PageHeader } from "@/components/ui/page-header";
import { Lock } from "lucide-react";

<div className="flex min-h-screen bg-canvas">
  <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r bg-card p-3 md:block">
    <NavMenu aria-label="项目导航">
      <NavMenuGroup>
        <NavMenuItem href="/projects/project-042">项目概览</NavMenuItem>
        <NavMenuItem href="/projects/project-042/datasets">数据集</NavMenuItem>
        <NavMenuItem href="/projects/project-042/runs" active>计算任务</NavMenuItem>
        <NavMenuItem href="/projects/project-042/reports">分析报告</NavMenuItem>
        <NavMenuItem disabled disabledReason="需要项目管理员权限" badge={<Lock aria-hidden />}>
          审计日志
        </NavMenuItem>
      </NavMenuGroup>
    </NavMenu>
  </aside>
  <div className="flex min-w-0 flex-1 flex-col">
    <header className="sticky top-0 z-10 flex h-[60px] items-center border-b bg-background px-6">
      <Breadcrumb aria-label="面包屑">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/projects">项目</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>示例项目</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
    <main className="flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto grid w-full max-w-[1240px] gap-6">
        <PageHeader title="计算任务" actions={<Button>新建任务</Button>} />
        <RunStats projectId="project-042" />
      </div>
    </main>
  </div>
</div>`,
        preview: "layout/business",
      },
    ],
    props: [
      { name: "整体结构", type: "flex min-h-screen", description: "根容器横向分栏；背景用 bg-canvas，内容卡片用 bg-card 区分层级。" },
      { name: "侧边栏", type: "<aside> w-[264px] shrink-0 border-r", description: "固定 264px，sticky top-0 h-screen 跟随视口；内部放 NavMenu。" },
      { name: "侧边栏（窄屏）", type: "hidden md:block", default: "md ≥768px", description: "<768px 隐藏，改由顶栏菜单按钮打开 Sheet（side=\"left\"）承载同一个 NavMenu。" },
      { name: "顶栏", type: "<header> sticky top-0 z-10 h-[60px] border-b", description: "吸顶，左侧放 Breadcrumb，右侧放全局动作；bg-background 防止滚动内容透出。" },
      { name: "内容区", type: "<main> flex-1 px-4 py-6 md:px-6", required: true, description: "每页唯一的 <main>；左右内边距窄屏 16px、宽屏 24px。" },
      { name: "内容宽度", type: "mx-auto w-full max-w-[880px | 1240px] | w-full", default: "max-w-[1240px]", description: "表单与文档 880px，列表与工作台 1240px，看板与图谱全宽。" },
      { name: "右栏防挤压", type: "min-w-0 flex-1", description: "内容列必须带 min-w-0，否则长表格或代码块会把骨架撑破。" },
    ],
    states: [
      { name: "default", note: "三区域位置固定；内容区居中并受 max-w 约束。" },
      { name: "hover", note: "不适用：骨架不响应 hover，交互由内部组件各自处理。", applicable: false },
      { name: "focus-visible", note: "不适用：骨架不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：骨架不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：骨架没有禁用态。", applicable: false },
      { name: "loading", note: "首屏加载在内容区渲染 Skeleton，不做整页白屏替换。" },
      { name: "empty", note: "不适用：空数据由内容区的 Empty 组件表达。", applicable: false },
      { name: "error", note: "页面级错误在内容区用 Result 呈现，骨架与导航保留以便返回。" },
      { name: "permission-limited", note: "无权限的导航入口在 NavMenu 中禁用（disabled + disabledReason），骨架结构不因此改变。" },
      { name: "mobile", note: "<768px 侧边栏隐藏、改为 Sheet 抽屉，顶栏保留，内容区全宽、左右 16px。" },
      { name: "dark-mode", note: "只用 bg-canvas / bg-card / border 等语义令牌，自动适配。" },
    ],
    interaction: [
      "页面切换时骨架保持稳定，只有 <main> 内容更新，不整页闪烁。",
      "侧边栏折叠状态跨页面记忆，重新进入时保持。",
      "顶栏 sticky 吸顶，长页面滚动时面包屑与全局动作始终可见。",
    ],
    keyboard: [
      "提供跳转主内容的 skip link（sr-only focus:not-sr-only），键盘用户可跳过整段导航。",
      "窄屏侧边栏用 Sheet 承载：Esc 关闭，焦点归还给触发按钮（Radix 自动处理）。",
    ],
    accessibility: [
      "使用 <aside>/<nav>、<header>、<main> 语义标签，每页有且只有一个 <main>。",
      "侧边栏抽屉的触发按钮设置 aria-label 与 aria-expanded，打开后焦点进入抽屉。",
    ],
    responsive: [
      "断点用 Tailwind 默认值：md ≥768px，lg ≥1024px。",
      "<768px 侧边栏折叠为 Sheet 抽屉，内容区左右内边距收缩到 16px（px-4）。",
    ],
    content: [
      "顶栏左侧永远放面包屑或页面位置，不放营销文案。",
      "全局动作（搜索、主题、帮助）固定在顶栏右侧，位置跨页面一致。",
    ],
    dos: [
      "所有页面共享同一副骨架，区域位置不随页面变化。",
      "按页面类型选择内容宽度（880 / 1240 / 全宽），避免超宽屏下文字行过长。",
      "内容列加 min-w-0，首屏加载用 Skeleton 占位保持布局稳定。",
    ],
    donts: [
      "不要在页面或弹窗内部再套一层骨架。",
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
    purpose: "沿一个方向（垂直或水平）排列子元素并统一间距，是使用频率最高的局部布局写法。",
    usage:
      "不提供 Stack 组件：直接用 Tailwind 的 flex + gap 工具类。垂直 flex flex-col gap-3，水平 flex flex-wrap items-center gap-2。用于表单字段、按钮组、卡片列表等一维排列。二维行列关系用 Grid 写法；需要拖拽调整两个区域的比例用 Splitter；整页骨架见 Layout。",
    keywords: ["stack", "flex", "gap", "间距", "堆叠", "排列", "tailwind"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "垂直堆叠，子元素间距全部来自 gap，不在子元素上写 margin。",
        code: `import { Card } from "@/components/ui/card";

<div className="flex flex-col gap-3">
  <Card className="px-4 py-3">
    <div className="font-mono text-sm font-semibold">run-28003</div>
    <div className="text-sm text-muted-foreground">电导率优化 · 第 3 轮</div>
  </Card>
  <Card className="px-4 py-3">
    <div className="font-mono text-sm font-semibold">run-28002</div>
    <div className="text-sm text-muted-foreground">电导率优化 · 第 2 轮</div>
  </Card>
</div>`,
        preview: "stack/basic",
      },
      {
        id: "variants",
        title: "方向与对齐",
        kind: "variant",
        description: "水平排列用于按钮组；justify-* 控制主轴分布，items-* 控制交叉轴对齐。",
        code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

<div className="flex flex-wrap items-center gap-2">
  <Button>提交任务</Button>
  <Button variant="secondary">保存草稿</Button>
  <Button variant="ghost">取消</Button>
</div>

<div className="flex items-center justify-between gap-3">
  <strong className="text-base font-semibold">第 3 轮优化</strong>
  <Badge tone="success" dot>已完成</Badge>
</div>`,
        preview: "stack/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据校验区块：标题组 gap-1、区块之间 gap-4，用间距大小表达信息亲疏。",
        code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

<div className="flex flex-col gap-4">
  <div className="flex flex-col gap-1">
    <h3 className="text-base font-semibold">数据校验</h3>
    <p className="text-sm text-muted-foreground">对数据集 ds-118 的 3 个必填字段做完整性检查</p>
  </div>
  <Alert variant="warning">
    <AlertTriangle className="size-4" />
    <AlertTitle>2 条记录缺少测试温度</AlertTitle>
    <AlertDescription>第 18、42 行 · 修正后可继续导入</AlertDescription>
  </Alert>
  <div className="flex flex-wrap items-center gap-2">
    <Button>继续导入</Button>
    <Button variant="ghost">返回修改</Button>
  </div>
</div>`,
        preview: "stack/business",
      },
    ],
    props: [
      { name: "方向", type: "flex flex-col | flex", default: "flex-col", description: "垂直堆叠用 flex-col；水平排列用 flex（默认 row）。" },
      { name: "间距", type: "gap-1 | gap-2 | gap-3 | gap-4 | gap-6", default: "gap-3", description: "4 / 8 / 12 / 16 / 24px；同组 gap-2–3，分组之间 gap-4–6。不要用 space-y-* 与 margin 混写。" },
      { name: "交叉轴对齐", type: "items-start | items-center | items-end | items-stretch", default: "items-stretch", description: "水平按钮组、标题+徽章用 items-center。" },
      { name: "主轴分布", type: "justify-start | justify-center | justify-end | justify-between", default: "justify-start", description: "标题与状态两端对齐用 justify-between；对话框底部按钮用 justify-end。" },
      { name: "换行", type: "flex-wrap", description: "水平排列空间不足时换行，按钮组与标签组必须加。" },
      { name: "防溢出", type: "min-w-0 / shrink-0", description: "可被压缩的文本子项加 min-w-0（配合 truncate），图标与按钮加 shrink-0。" },
      { name: "响应式方向", type: "flex-col sm:flex-row", description: "窄屏垂直、宽屏水平，例如表单底部动作或 PageHeader 的标题与动作区。" },
    ],
    states: [
      { name: "default", note: "子元素间距全部来自 gap，间距单一来源。" },
      { name: "hover", note: "不适用：flex 容器不响应 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：容器不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：禁用由子组件各自表达。", applicable: false },
      { name: "loading", note: "不适用：加载态由子组件（Skeleton、Button）表达。", applicable: false },
      { name: "empty", note: "无子元素时容器塌缩为 0 高度，gap 不留占位。" },
      { name: "error", note: "不适用：错误由子组件或 Alert 表达。", applicable: false },
      { name: "permission-limited", note: "不适用：权限由子组件各自处理。", applicable: false },
      { name: "mobile", note: "水平排列加 flex-wrap 自动换行；需要整组变竖排时用 flex-col sm:flex-row，主动作在最前。" },
      { name: "dark-mode", note: "无颜色属性，自动继承主题。" },
    ],
    interaction: [
      "同级元素间距一致，层级亲疏靠 gap 大小表达，不靠新增颜色或分割线。",
      "不在子元素上再写 margin，避免间距出现两个来源。",
    ],
    keyboard: [
      "不改变焦点顺序，子元素的 Tab 顺序与 DOM 顺序一致。",
      "不拦截任何按键，键盘行为完全由子组件决定。",
    ],
    accessibility: [
      "纯视觉容器，不添加 aria 角色；有列表语义时用 <ul>/<li> 加 flex 类，而不是 <div>。",
      "不用 flex-row-reverse / order-* 颠倒视觉顺序，读屏顺序与视觉顺序保持一致。",
    ],
    responsive: [
      "水平排列加 flex-wrap，换行后间距仍由 gap 提供。",
      "gap 不随断点缩小，密度差异通过更换间距档位表达。",
    ],
    content: [
      "一组之内只放同一层级的内容，不把页脚和标题混在一组。",
      "间距表达亲疏：同组 gap-2–3（8–12px），分组之间 gap-4–6（16–24px）。",
    ],
    dos: [
      "间距只用 Tailwind 间距档位（4 的倍数），不写 gap-[13px] 这类魔法数字。",
      "按钮组统一 flex flex-wrap items-center gap-2。",
      "表单字段垂直堆叠，flex-col gap-3–4。",
    ],
    donts: [
      "不要混用 margin 与 gap 制造双重间距。",
      "不要用嵌套 flex 模拟 Grid 的二维对齐。",
      "不要为单个子元素包一层没有作用的 flex 容器。",
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
    purpose: "用 CSS Grid 组织二维布局，让卡片与统计块在不同断点下保持对齐。",
    usage:
      "不提供 Grid 组件：直接用 Tailwind 的 grid / grid-cols-* / gap-* 工具类。用于卡片矩阵、仪表盘统计块、多列表单等二维排列。单一方向的排列用 Stack 写法；整页骨架见 Layout；两个区域间需要拖拽调整用 Splitter。",
    keywords: ["grid", "栅格", "列", "grid-cols", "断点", "卡片矩阵", "tailwind"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "三列等宽栅格，三张统计卡片同排高度自动对齐。",
        code: `import { Card } from "@/components/ui/card";

<div className="grid grid-cols-3 gap-3">
  <Card className="px-4 py-3">
    <div className="text-sm text-muted-foreground">运行中任务</div>
    <div className="mt-1 text-2xl font-semibold">3</div>
  </Card>
  <Card className="px-4 py-3">
    <div className="text-sm text-muted-foreground">本周完成</div>
    <div className="mt-1 text-2xl font-semibold">21</div>
  </Card>
  <Card className="px-4 py-3">
    <div className="text-sm text-muted-foreground">失败待处理</div>
    <div className="mt-1 text-2xl font-semibold">1</div>
  </Card>
</div>`,
        preview: "grid/basic",
      },
      {
        id: "responsive",
        title: "响应式列宽",
        kind: "variant",
        description: "按视口断点给出列数：宽屏一行四个，中屏两个，窄屏单列；随容器宽度变化时用 auto-fill。",
        code: `{/* 按视口断点 */}
<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
  <ProjectCard />
  <ProjectCard />
  <ProjectCard />
  <ProjectCard />
</div>

{/* 按容器宽度：卡片最小 240px，放不下就减列 */}
<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
  …
</div>`,
        preview: "grid/responsive",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目卡片矩阵：列表语义 + auto-fill 栅格，卡片结构一致，数量变化时先行后列补齐。",
        code: `import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<ul role="list" className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
  {projects.map((project) => (
    <li key={project.id}>
      <Card className="h-full">
        <CardHeader className="pb-1">
          <CardTitle className="text-base">{project.name}</CardTitle>
          <Badge tone={project.archived ? "neutral" : "primary"} dot>
            {project.archived ? "已归档" : "进行中"}
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="font-mono">
            {project.id} · 任务 {project.runCount}
          </CardDescription>
        </CardContent>
      </Card>
    </li>
  ))}
</ul>`,
        fullCode: `import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  { id: "project-042", name: "示例项目", runCount: 28, archived: false },
  { id: "project-051", name: "电解液筛选", runCount: 12, archived: false },
  { id: "project-063", name: "正极材料库", runCount: 45, archived: true },
];

export function ProjectGrid() {
  return (
    <ul role="list" className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {projects.map((project) => (
        <li key={project.id}>
          <Card className="h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-base">{project.name}</CardTitle>
              <Badge tone={project.archived ? "neutral" : "primary"} dot>
                {project.archived ? "已归档" : "进行中"}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-mono">
                {project.id} · 任务 {project.runCount}
              </CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}`,
        preview: "grid/business",
      },
    ],
    props: [
      { name: "启用栅格", type: "grid", required: true, description: "容器加 grid；子元素即单元格，无需包装组件。" },
      { name: "列数", type: "grid-cols-1 … grid-cols-12", description: "等宽列；统计块常用 3–4 列，表单 2 列。" },
      { name: "响应式列数", type: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4", description: "按视口断点（md ≥768px，lg ≥1024px）递增列数，移动优先从 1 列写起。" },
      { name: "按容器自适应", type: "grid-cols-[repeat(auto-fill,minmax(240px,1fr))]", description: "卡片最小宽度 240px，放不下自动减列；适合放在宽度不定的面板里。" },
      { name: "跨列", type: "col-span-2 | md:col-span-2 | col-span-full", description: "单元格跨多列，例如表单里的备注字段占满整行。" },
      { name: "间距", type: "gap-3 | gap-4 | gap-x-4 gap-y-3", default: "gap-3", description: "行列间距取 Tailwind 间距档位，行列不同时分开写。" },
      { name: "同排等高", type: "items-stretch（默认）+ 卡片 h-full", description: "单元格默认拉伸；卡片本身加 h-full 才能填满等高。" },
    ],
    states: [
      { name: "default", note: "列宽按 grid-cols 等分，同排单元格高度对齐。" },
      { name: "hover", note: "不适用：栅格容器不响应 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：容器不是可按压元素。", applicable: false },
      { name: "disabled", note: "不适用：禁用由卡片内组件表达。", applicable: false },
      { name: "loading", note: "用相同 grid 类渲染 Skeleton 卡片占位，行列结构不跳动。" },
      { name: "empty", note: "数据为空时整个栅格区域替换为 Empty，不留半排空卡片。" },
      { name: "error", note: "区域级错误整体替换为 Result + 重试，不在单个格子里报错。" },
      { name: "permission-limited", note: "无权限时整个区域换为权限说明，不渲染残缺的卡片矩阵。" },
      { name: "mobile", note: "移动优先：grid-cols-1 起步，md / lg 再加列。" },
      { name: "dark-mode", note: "无颜色属性，自动继承主题。" },
    ],
    interaction: [
      "同排单元格高度对齐，内容多少不影响整排基线。",
      "卡片数量变化时先行后列补齐，不出现错位空洞（不要用 grid-flow-dense 打乱阅读顺序）。",
    ],
    keyboard: [
      "容器不参与焦点顺序，卡片内交互元素按先行后列的顺序 Tab。",
      "不拦截方向键，键盘行为由单元格内组件决定。",
    ],
    accessibility: [
      "卡片矩阵有列表语义时用 <ul role=\"list\"> + <li>（Safari 去掉 list-style 后需显式 role）。",
      "不用 order-* 或 grid 位置颠倒视觉与读屏顺序，DOM 顺序即阅读顺序。",
    ],
    responsive: [
      "断点用 Tailwind 默认值：sm ≥640px，md ≥768px，lg ≥1024px，xl ≥1280px。",
      "卡片最小宽度 240px，不足时减列（auto-fill + minmax）而不是压缩卡片。",
    ],
    content: [
      "同屏卡片表达同一类信息，不混放导航卡片与数据卡片。",
      "卡片内的数字格式与对齐规则由 Statistic 负责，不在格子里自定义。",
    ],
    dos: [
      "移动优先写列数：grid-cols-1 md:grid-cols-2 lg:grid-cols-4。",
      "卡片矩阵配 Skeleton 保持加载前后结构一致。",
      "统计块、项目卡片这类同质内容优先用 grid。",
    ],
    donts: [
      "不要用 grid 做一维排列（用 flex + gap）。",
      "不要写 grid-cols-[137px_1fr] 这类随意的魔法尺寸，固定侧栏除外。",
      "不要让同一排卡片高度参差不齐（卡片加 h-full）。",
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
    purpose: "把内容区拆成可拖拽调整的面板，让用户按任务需要自行分配空间。",
    usage:
      "实现为 resizable（ResizablePanelGroup / ResizablePanel / ResizableHandle，基于 react-resizable-panels）。用于主从结构的双栏场景：任务列表 + 日志详情、编辑器 + 预览。固定比例的布局用 Grid 写法；只做视觉分隔用 Divider；窄屏不要用分栏，回退为上下堆叠或 Tabs。",
    keywords: ["splitter", "resizable", "分栏", "拖拽", "面板", "双栏"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "拖动中间把手实时调整两侧比例，比例受 minSize / maxSize（百分比）约束。",
        code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

<ResizablePanelGroup direction="horizontal" className="min-h-[320px] rounded-xl border">
  <ResizablePanel defaultSize={36} minSize={24} maxSize={62}>
    <RunList projectId="project-042" />
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="调整列表宽度" />
  <ResizablePanel defaultSize={64}>
    <RunDetail runId="run-28003" />
  </ResizablePanel>
</ResizablePanelGroup>`,
        preview: "splitter/basic",
      },
      {
        id: "limits",
        title: "尺寸限制与收起",
        kind: "variant",
        description: "minSize / maxSize 约束面板；collapsible 允许把一侧面板收起，onCollapse / onExpand 同步状态。",
        code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

<ResizablePanelGroup direction="horizontal" className="rounded-xl border">
  <ResizablePanel
    defaultSize={34}
    minSize={24}
    maxSize={50}
    collapsible
    collapsedSize={0}
    onCollapse={() => setListCollapsed(true)}
    onExpand={() => setListCollapsed(false)}
  >
    <RunList projectId="project-042" />
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="调整列表宽度" />
  <ResizablePanel defaultSize={66} minSize={40}>
    <RunDetail runId="run-28003" />
  </ResizablePanel>
</ResizablePanelGroup>`,
        preview: "splitter/limits",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务日志查看器：左侧选任务，右侧看日志，autoSaveId 让拖拽比例按用户记忆。",
        code: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

<ResizablePanelGroup
  direction="horizontal"
  autoSaveId="run-log-splitter"
  className="min-h-[480px] rounded-xl border"
>
  <ResizablePanel defaultSize={38} minSize={28}>
    <RunList
      projectId="project-042"
      selectedRunId={runId}
      onSelect={setRunId}
    />
  </ResizablePanel>
  <ResizableHandle withHandle aria-label="调整任务列表宽度" />
  <ResizablePanel defaultSize={62} minSize={40}>
    <LogViewer runId={runId} follow />
  </ResizablePanel>
</ResizablePanelGroup>`,
        preview: "splitter/business",
      },
    ],
    props: [
      { name: "ResizablePanelGroup.direction", type: '"horizontal" | "vertical"', required: true, description: "分栏方向；上下分栏用 vertical。" },
      { name: "ResizablePanelGroup.autoSaveId", type: "string", description: "按此 id 把比例存进 localStorage，下次进入恢复用户调整过的比例。" },
      { name: "ResizablePanelGroup.onLayout", type: "(sizes: number[]) => void", description: "比例变化回调（百分比数组），用于自行持久化或展示。" },
      { name: "ResizablePanelGroup.keyboardResizeBy", type: "number | null", default: "null（10%）", description: "键盘方向键每次调整的百分比步长。" },
      { name: "ResizablePanel.defaultSize", type: "number", description: "初始尺寸，单位为百分比（0–100），同组各面板之和应为 100。" },
      { name: "ResizablePanel.minSize / maxSize", type: "number", default: "0 / 100", description: "尺寸上下限（百分比）；需要像素下限时在面板内容上加 min-w-[240px] 并配合窄屏回退。" },
      { name: "ResizablePanel.collapsible / collapsedSize", type: "boolean / number", default: "false / 0", description: "允许拖过 minSize 后收起到 collapsedSize；配 onCollapse / onExpand 同步状态。" },
      { name: "ResizableHandle.withHandle", type: "boolean", default: "false", description: "显示抓手图标，提示可拖拽；建议总是开启并给 aria-label。" },
    ],
    states: [
      { name: "default", note: "分隔线 1px（bg-border），命中区更宽；withHandle 显示抓手。" },
      { name: "hover", note: "光标变为 col-resize（纵向分栏为 row-resize）。" },
      { name: "focus-visible", note: "把手可聚焦，显示 ring 焦点环。" },
      { name: "pressed", note: "拖拽中实时更新面板尺寸，onLayout 持续回调。" },
      { name: "disabled", note: "锁定比例时给 ResizableHandle 传 disabled，禁止拖拽与键盘调整。" },
      { name: "loading", note: "不适用：面板内容加载由各自面板内的 Skeleton 表达。", applicable: false },
      { name: "empty", note: "面板为空时在面板内部放 Empty，面板尺寸保持不塌缩。" },
      { name: "error", note: "单侧面板错误用面板内 Alert + 重试，不影响另一侧。" },
      { name: "permission-limited", note: "不适用：权限由面板内组件各自处理。", applicable: false },
      { name: "mobile", note: "<768px 不渲染分栏，回退为上下堆叠或 Tabs。" },
      { name: "dark-mode", note: "分隔线与把手使用 border 语义令牌，自动适配。" },
    ],
    interaction: [
      "拖拽实时反馈，不做松手才跳转的盲拖。",
      "用 autoSaveId 记住用户调整后的比例。",
      "两侧必须是主从关系，主面板变化时从面板内容联动更新。",
    ],
    keyboard: [
      "把手可 Tab 聚焦，←/→（纵向为 ↑/↓）按 keyboardResizeBy 步进，默认 10%。",
      "Home / End 把首个面板推到最小 / 最大；collapsible 面板按 Enter 切换收起 / 展开；F6 在多个把手间切换。",
    ],
    accessibility: [
      "把手自动带 role=\"separator\"、aria-valuenow / aria-valuemin / aria-valuemax，读屏可感知拖拽结果。",
      "给 ResizableHandle 传 aria-label（如“调整列表宽度”）说明调整的对象。",
    ],
    responsive: [
      "<768px 不使用分栏，布局回退为上下堆叠（flex-col）或 Tabs。",
      "minSize 按最窄目标宽度换算，保证主面板在可用宽度下不被压坏。",
    ],
    content: [
      "两侧面板必须是主从关系（列表-详情、输入-预览），不拼两个无关模块。",
      "面板标题说明内容，从面板标题随主面板选中项联动。",
    ],
    dos: [
      "给主面板设置 minSize，防止拖到不可用宽度。",
      "用 autoSaveId 或 onLayout 持久化用户调整过的比例。",
      "窄屏主动回退为堆叠布局。",
    ],
    donts: [
      "不要嵌套两层以上分栏。",
      "不要把分栏用在弹窗内部。",
      "不要在没有 minSize 约束时允许面板被拖到 0（除非 collapsible）。",
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
      "每个内容页使用一次，位于内容区最上方。弹窗与抽屉内的标题不用 PageHeader；跨页位置用 breadcrumb 插槽放 Breadcrumb，单层返回用 backHref。页面级主动作最多一个 primary，其余动作降级为 secondary / ghost 或收入 DropdownMenu。",
    keywords: ["page-header", "页头", "标题", "主动作", "页面标题", "返回"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标题 + 一行说明 + 动作区；动作区只保留一个 primary。",
        code: `import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

<PageHeader
  title="计算任务"
  description="提交、追踪并管理项目下的所有计算任务。"
  actions={
    <>
      <Button variant="secondary">导出记录</Button>
      <Button>新建任务</Button>
    </>
  }
/>`,
        preview: "page-header/basic",
      },
      {
        id: "with-breadcrumb",
        title: "带面包屑与状态",
        kind: "variant",
        description: "深层页面在 breadcrumb 插槽放面包屑；资源状态用 status 插槽的 Badge 跟在标题旁。",
        code: `import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

<PageHeader
  breadcrumb={
    <Breadcrumb aria-label="面包屑">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">项目</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>示例项目</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  title="示例项目"
  status={<Badge tone="success" dot>进行中</Badge>}
  actions={
    <>
      <Button variant="secondary">项目设置</Button>
      <Button>新建任务</Button>
    </>
  }
/>`,
        preview: "page-header/with-breadcrumb",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "优化轮次页头：返回链接、说明影响范围，主动作唯一，低频动作收入 DropdownMenu。",
        code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronDown } from "lucide-react";

<PageHeader
  backHref="/projects/project-042/rounds"
  backLabel="返回轮次列表"
  title="电导率优化 · 第 3 轮"
  description="Agent 推荐 6 个候选配方，确认后将创建 1 个 CPU 任务。"
  status={<Badge tone="agent" dot>等待确认</Badge>}
  actions={
    <>
      <Button variant="ghost">查看历史</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            更多操作 <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={exportCandidates}>导出候选配方</DropdownMenuItem>
          <DropdownMenuItem onSelect={copyRoundConfig}>复制轮次配置</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={confirmAndRun}>确认并执行</Button>
    </>
  }
/>`,
        preview: "page-header/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", required: true, description: "页面标题，默认渲染为页面唯一的 h1，超过两行省略。" },
      { name: "description", type: "ReactNode", description: "一行说明，告诉用户这个页面能做什么、影响范围；最多两行。" },
      { name: "breadcrumb", type: "ReactNode", description: "标题上方的插槽，放 <Breadcrumb>；两层以上层级时使用。" },
      { name: "status", type: "ReactNode", description: "标题旁的状态插槽，放 <Badge>；只放状态不放营销标签。" },
      { name: "actions", type: "ReactNode", description: "动作区插槽；宽屏（sm ≥640px）右对齐，窄屏换到标题下方并允许换行；primary 最多一个。" },
      { name: "backHref", type: "string", description: "返回链接地址；给出后在标题上方渲染“← 返回”链接。" },
      { name: "onBack", type: "(event) => void", description: "返回入口点击回调；只给 onBack 不给 backHref 时渲染为按钮（如 history.back）。" },
      { name: "backLabel", type: "ReactNode", default: '"返回"', description: "返回入口文案，建议写明目标，如“返回轮次列表”。" },
      { name: "titleAs", type: '"h1" | "h2"', default: '"h1"', description: "标题标签；嵌在页面区块里时用 h2，保证每页只有一个 h1。" },
      { name: "className / ...props", type: "HTMLAttributes<HTMLElement>", description: "透传到外层 <header>。" },
    ],
    states: [
      { name: "default", note: "标题为页面唯一 h1，描述一行，动作右对齐。" },
      { name: "hover", note: "不适用：标题区无 hover，返回链接与动作自身处理。", applicable: false },
      { name: "focus-visible", note: "返回链接与动作区焦点环可见，焦点顺序与视觉顺序一致。" },
      { name: "pressed", note: "不适用：按压反馈由动作区内的 Button 表达。", applicable: false },
      { name: "disabled", note: "主动作不可用时渲染 disabled，原因写在邻近文案或 Tooltip。" },
      { name: "loading", note: "title / description 传 Skeleton 占位，动作区布局保持不跳动。" },
      { name: "empty", note: "不适用：页头必然有标题，空数据由内容区表达。", applicable: false },
      { name: "error", note: "页面数据加载失败时保留标题与返回路径，内容区显示 Result。" },
      { name: "permission-limited", note: "无权限动作渲染为 disabled 并说明所需权限，不隐藏。" },
      { name: "mobile", note: "<640px 动作区换到标题下方并允许换行；标题与描述最多两行。" },
      { name: "dark-mode", note: "只用 foreground / muted-foreground 语义令牌，自动适配。" },
    ],
    interaction: [
      "动作区按重要性从左到右升级排列，primary 放最右且只有一个。",
      "动作影响范围（项目、数量、预算）写在 description 里。",
      "带返回链接或面包屑时，返回上一级是最明显的逃生路径。",
    ],
    keyboard: [
      "Tab 顺序：面包屑 / 返回链接 → 动作区，与视觉顺序一致。",
      "返回入口是原生 <a> 或 <button>，Enter 触发。",
    ],
    accessibility: [
      "外层为 <header>；每页只有一个 h1，且只能出现在 PageHeader（嵌套区块用 titleAs=\"h2\"）。",
      "状态徽章不只靠颜色区分，必须有文字；返回图标 aria-hidden，文字可读。",
    ],
    responsive: [
      "<640px 标题区与动作区上下排列（flex-col），≥640px 左右排列（sm:flex-row）。",
      "标题与描述最多两行（line-clamp-2），不挤压动作区。",
    ],
    content: [
      "标题用名词短语（资源名），不用“详情页”“列表页”这类无信息文案。",
      "描述一句以内，说明这个页面能做什么。",
      "动作文案以动词开头：新建任务、确认并执行。",
    ],
    dos: [
      "一页一个 PageHeader，一个 primary。",
      "资源状态用 status 插槽的 Badge 跟在标题旁。",
      "低频动作收入 DropdownMenu 的“更多操作”。",
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
      "用于两层以上的层级页面（项目 → 数据集 → 任务详情）。同级内容切换用 Tabs；全局功能入口用 NavMenu；只有一层时不渲染。当前页用 BreadcrumbPage，永远不可点击。",
    keywords: ["breadcrumb", "面包屑", "路径", "层级", "返回"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "中间层级为 BreadcrumbLink，当前页为 BreadcrumbPage 纯文本。",
        code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

<Breadcrumb aria-label="面包屑">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">项目</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects/project-042">示例项目</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>任务详情</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
        preview: "breadcrumb/basic",
      },
      {
        id: "collapsed",
        title: "超长折叠",
        kind: "variant",
        description: "层级过深时中间层折叠为 BreadcrumbEllipsis，点击后在 DropdownMenu 中选择任意层级。",
        code: `import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<Breadcrumb aria-label="面包屑">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">项目</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="展开隐藏的层级" className="flex items-center rounded-sm">
          <BreadcrumbEllipsis className="size-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild><a href="/projects/project-042">示例项目</a></DropdownMenuItem>
          <DropdownMenuItem asChild><a href="/projects/project-042/datasets">数据集</a></DropdownMenuItem>
          <DropdownMenuItem asChild><a href="/datasets/ds-118">ds-118</a></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>字段映射</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
        preview: "breadcrumb/collapsed",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情页路径；资源 ID 用等宽字体；无权限访问的上级渲染为纯文本 + 锁图标，不提供链接。",
        code: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Lock } from "lucide-react";

<Breadcrumb aria-label="面包屑">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">项目</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects/project-042">示例项目</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects/project-042/runs">计算任务</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage className="font-mono">run-28003</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

{/* 权限受限：上级无链接 */}
<BreadcrumbItem title="无权访问该项目">
  内部项目 <Lock className="size-3" aria-label="无权限" />
</BreadcrumbItem>`,
        preview: "breadcrumb/business",
      },
    ],
    props: [
      { name: "Breadcrumb", type: "<nav> + aria-label", required: true, description: "外层导航；默认 aria-label 为英文 breadcrumb，中文界面传 aria-label=\"面包屑\"。" },
      { name: "BreadcrumbList", type: "<ol>", required: true, description: "有序列表，flex-wrap 排列，文字为 muted-foreground。" },
      { name: "BreadcrumbItem", type: "<li>", required: true, description: "单个层级；无权限的上级直接放纯文本 + 锁图标。" },
      { name: "BreadcrumbLink", type: "<a> · asChild?: boolean", description: "可点击层级；接路由库时 asChild 包 <Link>。" },
      { name: "BreadcrumbPage", type: "<span>", required: true, description: "当前页，自动带 aria-current=\"page\" 与 aria-disabled，不可点击。" },
      { name: "BreadcrumbSeparator", type: "<li> · children?: ReactNode", default: "ChevronRight", description: "层级分隔符，自动 aria-hidden；保持默认不自定义。" },
      { name: "BreadcrumbEllipsis", type: "<span>", description: "折叠中间层的省略号；放进 DropdownMenuTrigger 并给触发器 aria-label。" },
    ],
    states: [
      { name: "default", note: "中间层级为链接（muted-foreground），当前页为 foreground 纯文本。" },
      { name: "hover", note: "可点击层级变为 foreground。" },
      { name: "focus-visible", note: "链接与省略号触发器有焦点环，Tab 顺序与层级顺序一致。" },
      { name: "pressed", note: "不适用：链接点击即跳转，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "不适用：层级没有禁用态，无权限时降级为纯文本。", applicable: false },
      { name: "loading", note: "不适用：层级来自路由，即时可得。", applicable: false },
      { name: "empty", note: "层级少于两层时不渲染组件。" },
      { name: "error", note: "不适用：路径解析失败由页面级 Result 处理。", applicable: false },
      { name: "permission-limited", note: "无权限访问的上级渲染为纯文本并附锁图标，不提供链接。" },
      { name: "mobile", note: "列表 flex-wrap 换行；层级很深时折叠中间层，只保留首层、省略号与当前页。" },
      { name: "dark-mode", note: "使用语义令牌自动适配。" },
    ],
    interaction: [
      "当前页不可点击，也不响应 hover。",
      "折叠的中间层点击省略号弹出下拉菜单，选择后直接跳转到该层级。",
      "面包屑不改变浏览器历史之外的状态，点击即跳转。",
    ],
    keyboard: [
      "Tab 按层级顺序逐个聚焦链接与省略号触发器。",
      "省略号菜单：Enter / Space 打开，↑/↓ 选择，Esc 关闭；当前页不进入 Tab 序列。",
    ],
    accessibility: [
      "外层 <nav aria-label=\"面包屑\">，内部 <ol> 有序列表。",
      "当前页 aria-current=\"page\"；分隔符与省略号图标 aria-hidden，省略号触发器需 aria-label。",
    ],
    responsive: [
      "窄屏 BreadcrumbList 自动换行（flex-wrap），间距收缩为 gap-1.5。",
      "层级名称过长时折叠中间层，不压缩文字到不可读。",
    ],
    content: [
      "层级名称与目标页面的标题保持一致，不另起别名。",
      "资源 ID（run-28003）用 font-mono 等宽字体，与名称区分。",
    ],
    dos: [
      "两层以上层级才使用面包屑。",
      "深层路径用 BreadcrumbEllipsis + DropdownMenu 折叠中间层。",
      "当前页用 BreadcrumbPage，明确“你在这里”。",
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
    status: "stable",
    version: "0.1.0",
    purpose: "应用的侧边导航：组织跨页面的功能入口，并标示当前所在位置。",
    usage:
      "实现为 nav-menu（NavMenu / NavMenuGroup / NavMenuItem）。用于全局或项目级导航，点击后切换整个页面（URL 变化、页面内容整体替换）。同页内的内容切换用 Tabs——NavMenu 决定“去哪一页”，Tabs 决定“这一页里看哪部分”；少量并列视图的即时切换用 Segmented；动作菜单用 DropdownMenu。入口多时用 NavMenuGroup 分组并可折叠。",
    keywords: ["menu", "nav-menu", "导航", "侧边栏", "sider", "菜单", "当前项"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "当前项（active）品牌色浅底加粗并输出 aria-current=\"page\"，点击即切换页面。",
        code: `import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";
import { Database, FileText, FlaskConical, Home } from "lucide-react";

<NavMenu aria-label="项目导航" className="w-[220px]">
  <NavMenuGroup>
    <NavMenuItem href="/overview" icon={<Home />} active={pathname === "/overview"}>
      项目概览
    </NavMenuItem>
    <NavMenuItem href="/datasets" icon={<Database />} active={pathname === "/datasets"}>
      数据集
    </NavMenuItem>
    <NavMenuItem href="/runs" icon={<FlaskConical />} active={pathname === "/runs"}>
      计算任务
    </NavMenuItem>
    <NavMenuItem href="/reports" icon={<FileText />} active={pathname === "/reports"}>
      分析报告
    </NavMenuItem>
  </NavMenuGroup>
</NavMenu>`,
        preview: "menu/basic",
      },
      {
        id: "groups",
        title: "分组与徽章",
        kind: "variant",
        description: "项数超过 7 个时按业务分组，分组可折叠；徽章只放数量或状态标记。",
        code: `import { Badge } from "@/components/ui/badge";
import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";
import { Beaker, Database, FlaskConical, History } from "lucide-react";

<NavMenu aria-label="平台导航" className="w-[220px]">
  <NavMenuGroup label="工作台" collapsible>
    <NavMenuItem href="/runs" icon={<FlaskConical />} active>
      计算任务
    </NavMenuItem>
    <NavMenuItem href="/experiments" icon={<History />} badge={<Badge tone="agent">beta</Badge>}>
      实验记录
    </NavMenuItem>
  </NavMenuGroup>
  <NavMenuGroup label="数据资产" collapsible>
    <NavMenuItem href="/datasets" icon={<Database />} badge={<Badge>12</Badge>}>
      数据集
    </NavMenuItem>
    <NavMenuItem href="/reagents" icon={<Beaker />}>
      试剂库存
    </NavMenuItem>
  </NavMenuGroup>
</NavMenu>`,
        preview: "menu/groups",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目内导航：运行中任务带计数，无权限的审计日志禁用并说明原因。",
        code: `import { Badge } from "@/components/ui/badge";
import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";
import { FileText, FlaskConical, Home, Lock, Users } from "lucide-react";

<NavMenu aria-label="项目导航" className="w-[220px]">
  <NavMenuGroup>
    <NavMenuItem href="/projects/project-042" icon={<Home />}>
      项目概览
    </NavMenuItem>
    <NavMenuItem
      href="/projects/project-042/runs"
      icon={<FlaskConical />}
      active
      badge={runningCount > 0 && <Badge>{runningCount}</Badge>}
    >
      计算任务
    </NavMenuItem>
    <NavMenuItem href="/projects/project-042/members" icon={<Users />}>
      成员与权限
    </NavMenuItem>
    <NavMenuItem
      icon={<FileText />}
      disabled
      disabledReason="需要项目管理员权限"
      badge={<Lock aria-hidden />}
    >
      审计日志
    </NavMenuItem>
  </NavMenuGroup>
</NavMenu>`,
        preview: "menu/business",
      },
    ],
    props: [
      { name: "NavMenu", type: "<nav> · aria-label?: string", default: '"导航菜单"', description: "外层导航；内置 ↑/↓/Home/End 在菜单项与分组标题间移动焦点。一页多个导航时用 aria-label 区分。" },
      { name: "NavMenuGroup.label", type: "ReactNode", description: "分组标题；不传时只渲染列表（<ul>）。" },
      { name: "NavMenuGroup.collapsible", type: "boolean", default: "false", description: "分组可折叠（Radix Collapsible），标题变为带箭头的按钮。" },
      { name: "NavMenuGroup.defaultOpen / open / onOpenChange", type: "boolean / boolean / (open) => void", default: "true", description: "折叠分组的初始 / 受控展开状态；需要跨页记忆时受控并自行持久化。" },
      { name: "NavMenuItem.href", type: "string", description: "有 href 渲染为 <a>，否则渲染为 <button>（配 onClick）；接路由库时在 onClick 里 preventDefault 后 navigate。" },
      { name: "NavMenuItem.active", type: "boolean", default: "false", description: "当前页：品牌色浅底加粗，并输出 aria-current=\"page\"。" },
      { name: "NavMenuItem.icon", type: "ReactNode", description: "左侧图标（lucide），自动 16px。" },
      { name: "NavMenuItem.badge", type: "ReactNode", description: "右侧插槽：计数 Badge、beta 标记或锁图标；值为 0 时不要传。" },
      { name: "NavMenuItem.disabled", type: "boolean", default: "false", description: "禁用但仍可聚焦（aria-disabled），点击无效。" },
      { name: "NavMenuItem.disabledReason", type: "string", description: "禁用原因：作为悬停 title，并通过 aria-describedby 读给读屏。" },
    ],
    states: [
      { name: "default", note: "当前项 bg-primary-soft + text-primary 加粗，其余 muted-foreground。" },
      { name: "hover", note: "未选中项 bg-accent 底、文字变为 foreground，不改变布局。" },
      { name: "focus-visible", note: "菜单项与分组标题有 ring 焦点环。" },
      { name: "pressed", note: "点击即跳转，active 状态随路由更新。" },
      { name: "disabled", note: "无权限项 50% 透明 + 锁图标 + title 说明原因，仍可聚焦。" },
      { name: "loading", note: "不适用：菜单项为本地配置，即时可得。", applicable: false },
      { name: "empty", note: "不适用：能进入系统就至少有一个可见入口。", applicable: false },
      { name: "error", note: "不适用：菜单不加载远程数据，无错误态。", applicable: false },
      { name: "permission-limited", note: "无权限项 disabled + disabledReason，不隐藏，避免用户找不到功能。" },
      { name: "mobile", note: "<768px 放进 Sheet（side=\"left\"）抽屉，由顶栏菜单按钮打开。" },
      { name: "dark-mode", note: "当前项使用 primary-soft 令牌，自动适配。" },
    ],
    interaction: [
      "选中即跳转，当前项始终保持在可视区域内（超长时自动滚动到位）。",
      "分组可折叠，需要跨页面记忆时用 open / onOpenChange 受控。",
      "badge 为 0 时不显示数字，避免“0 条”噪音。",
    ],
    keyboard: [
      "Tab / Shift+Tab 逐项移动；↑/↓ 在可见菜单项与分组标题间移动焦点，Home / End 跳到首尾。",
      "Enter 跳转（链接）或触发（按钮）；在分组标题上 Enter / Space 折叠或展开分组。",
    ],
    accessibility: [
      "外层 <nav aria-label>，每组 <ul> 由分组标题 aria-labelledby 命名；不用 role=\"menu\"（那是动作菜单的语义）。",
      "当前项 aria-current=\"page\"，不只靠颜色区分；禁用原因通过 aria-describedby 可读。",
    ],
    responsive: [
      "<768px 折叠为 Sheet 抽屉，由顶栏菜单按钮打开。",
      "抽屉打开时内容区加遮罩，点击遮罩或 Esc 关闭。",
    ],
    content: [
      "项名用 2–6 字名词，与目标页面标题一致。",
      "徽章只放数量或状态（beta / new），不放营销词。",
    ],
    dos: [
      "用 active 明确标示当前位置。",
      "超过 7 个入口时用 NavMenuGroup 按业务分组。",
      "无权限项 disabled + disabledReason 说明原因。",
    ],
    donts: [
      "不要用 NavMenu 做同页内容切换（用 Tabs）。",
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
        code: `import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs value={activeKey} onValueChange={setActiveKey}>
  <TabsList aria-label="任务详情">
    <TabsTrigger value="overview">概览</TabsTrigger>
    <TabsTrigger value="params">参数</TabsTrigger>
    <TabsTrigger value="logs">日志</TabsTrigger>
    <TabsTrigger value="artifacts">产物</TabsTrigger>
  </TabsList>
</Tabs>`,
        preview: "tabs/basic",
      },
      {
        id: "badges",
        title: "带计数徽章",
        kind: "variant",
        description: "计数放在徽章里，不写进标签文字；为 0 时不显示。",
        code: `import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const tabs = [
  { value: "all", label: "全部", count: 0 },
  { value: "running", label: "运行中", count: 3 },
  { value: "queued", label: "排队中", count: 12 },
  { value: "done", label: "已完成", count: 128 },
];

<Tabs value={activeKey} onValueChange={setActiveKey}>
  <TabsList aria-label="任务状态">
    {tabs.map((tab) => (
      <TabsTrigger key={tab.value} value={tab.value}>
        {tab.label}
        {tab.count > 0 && (
          <Badge tone={activeKey === tab.value ? "primary" : "neutral"}>{tab.count}</Badge>
        )}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>`,
        preview: "tabs/badges",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务详情标签：日志面板带运行状态点，无权限标签禁用并说明。",
        code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

<Tabs value={activeKey} onValueChange={setActiveKey}>
  <TabsList aria-label="run-28003 详情">
    <TabsTrigger value="overview">运行概览</TabsTrigger>
    <TabsTrigger value="logs">
      实时日志
      <span className="size-1.5 rounded-full bg-success" aria-label="运行中" />
    </TabsTrigger>
    <TabsTrigger value="curves">电导率曲线</TabsTrigger>
    <TabsTrigger
      value="audit"
      disabled
      title="仅项目管理员可见"
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      审计记录 <Lock className="!size-3" aria-hidden />
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><RunOverview runId="run-28003" /></TabsContent>
  <TabsContent value="logs"><RunLogs runId="run-28003" follow /></TabsContent>
  <TabsContent value="curves"><ConductivityChart runId="run-28003" /></TabsContent>
</Tabs>`,
        preview: "tabs/business",
      },
    ],
    props: [
      { name: "Tabs.value / onValueChange", type: "string / (value: string) => void", description: "受控当前标签；需要可分享时从 URL hash 读取并在 onValueChange 中写回。" },
      { name: "Tabs.defaultValue", type: "string", description: "非受控初始标签。" },
      { name: "Tabs.activationMode", type: '"automatic" | "manual"', default: '"automatic"', description: "automatic 方向键移动即切换；面板加载较重时用 manual（Enter / Space 才切换）。" },
      { name: "TabsList", type: "aria-label, className", required: true, description: "下划线式标签条（底边线，超出横向滚动）；必须给 aria-label 说明这组标签的对象。" },
      { name: "TabsTrigger.value", type: "string", required: true, description: "标签值，与 TabsContent.value 对应；children 为 2–4 字文案，可附 Badge 计数或状态点。" },
      { name: "TabsTrigger.disabled", type: "boolean", default: "false", description: "禁用标签；配 title 说明原因，并加 className=\"disabled:cursor-not-allowed disabled:opacity-50\"。" },
      { name: "TabsContent.value", type: "string", required: true, description: "对应面板；role=\"tabpanel\" 与 aria-controls 由 Radix 自动关联。" },
      { name: "TabsContent.forceMount", type: "true", description: "Radix 默认卸载非活动面板；需保留滚动与输入状态时 forceMount + className=\"data-[state=inactive]:hidden\"，或把状态提升到 Tabs 外。" },
      { name: "分段控件", type: "组合", description: "同一视图内的即时切换改用 SegmentedList / SegmentedTrigger（见 Segmented），状态仍由 Tabs 承载。" },
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
    status: "stable",
    version: "0.1.0",
    purpose: "把多阶段流程拆成有序步骤，告诉用户流程进行到哪一步、每一步的结果。",
    usage:
      "用于有明确先后顺序的流程：数据导入、表单向导、任务流水线。并列内容切换用 Tabs；可以乱序访问的入口用 NavMenu。步骤数 2–7 为宜；每步只有 wait（等待）/ process（进行）/ finish（完成）/ error（失败）四种状态。",
    keywords: ["steps", "步骤条", "流程", "向导", "进度"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "current 指向进行中的步骤，之前的步骤自动为完成态，之后为等待态。",
        code: `import { Steps } from "@/components/ui/steps";

<Steps
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
        description: "完成绿色对勾、进行品牌色、失败红色叉号、等待灰色描边；失败步骤必须给出原因。同一组数据可纵向小尺寸展示。",
        code: `import { Steps } from "@/components/ui/steps";
import type { StepItem } from "@/components/ui/steps";

const items: StepItem[] = [
  { title: "解析文件", status: "finish" },
  { title: "映射字段", status: "finish" },
  { title: "校验数据", status: "error", description: "2 条记录缺少测试温度" },
  { title: "写入数据集", status: "wait" },
];

<Steps current={2} items={items} />
<Steps current={2} items={items} orientation="vertical" size="sm" />`,
        preview: "steps/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入在校验步骤失败：流程停住，给出原因与重试入口；已完成的步骤可点击回退。",
        code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Steps } from "@/components/ui/steps";
import { XCircle } from "lucide-react";

<Steps
  current={current}
  status={validationFailed ? "error" : "process"}
  onStepClick={setCurrent}
  items={[
    { title: "上传文件", description: "electrolyte-batch-7.csv" },
    { title: "校验数据", description: "第 18、42 行缺少测试温度" },
    { title: "确认导入", description: "目标数据集 ds-118" },
  ]}
/>
<Alert variant="danger">
  <XCircle className="size-4" />
  <AlertTitle>校验未通过：2 条记录缺少必填字段</AlertTitle>
  <AlertDescription>修正后可从当前步骤继续，已上传的文件保留。</AlertDescription>
</Alert>
<div className="flex flex-wrap items-center gap-2">
  <Button size="sm" onClick={revalidate}>修正后重试</Button>
  <Button size="sm" variant="secondary" onClick={downloadErrorReport}>下载错误报告</Button>
</div>`,
        preview: "steps/business",
      },
    ],
    props: [
      { name: "items", type: "StepItem[]", required: true, description: "步骤数组：{ title: ReactNode; description?: ReactNode; status?: StepStatus; disabled?: boolean }。" },
      { name: "current", type: "number", default: "0", description: "当前步骤索引（从 0 开始）；该项输出 aria-current=\"step\"。" },
      { name: "status", type: '"wait" | "process" | "finish" | "error"', default: '"process"', description: "当前步骤的状态；通常只用于把当前步标记为 error。" },
      { name: "StepItem.status", type: "StepStatus", description: "单步状态覆盖；缺省时按 current 推导（之前 finish、当前 status、之后 wait）。" },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "横向用于页面顶部流程；纵向用于侧栏、抽屉或步骤带长描述的场景。" },
      { name: "size", type: '"sm" | "default"', default: '"default"', description: "指示圆点 20px / 24px，标题 13px / 14px。" },
      { name: "onStepClick", type: "(index: number) => void", description: "传入后，已完成（finish）且非当前、非 disabled 的步骤渲染为按钮，可点击回退。" },
      { name: "className / ...props", type: "OlHTMLAttributes", description: "透传到外层 <ol>，可加 aria-label 说明流程名称。" },
    ],
    states: [
      { name: "default", note: "未到达的步骤灰色描边编号，不可点击。" },
      { name: "hover", note: "可回退的已完成步骤 hover 时标题变品牌色；其他步骤无 hover。" },
      { name: "focus-visible", note: "可点击步骤有 ring 焦点环，顺序与步骤顺序一致。" },
      { name: "pressed", note: "不适用：步骤点击即回退，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "未到达的步骤与 StepItem.disabled 的步骤不是按钮，不可点击也不进入 Tab 序列。" },
      { name: "loading", note: "process 步骤的 description 可写实时进度（如“迭代 120/400”），标题保留。" },
      { name: "empty", note: "不适用：少于两步时不应使用步骤条。", applicable: false },
      { name: "error", note: "失败步骤红色叉号 + 具体原因 + 下方 Alert 与重试入口，流程停在该步。" },
      { name: "permission-limited", note: "不适用：权限由流程入口控制，步骤条内不做权限判断。", applicable: false },
      { name: "mobile", note: "窄屏横向空间不足时改用 orientation=\"vertical\"，或只显示“第 n/m 步 + 当前步骤名”。" },
      { name: "dark-mode", note: "状态色使用 success / primary / danger / border 语义令牌，自动适配。" },
      { name: "finish", note: "完成步骤绿色对勾；传 onStepClick 时可点击回退。" },
      { name: "process", note: "当前步骤品牌色、标题加粗，是唯一进行中的步骤。" },
    ],
    interaction: [
      "已完成步骤在传入 onStepClick 时可点击回退，回退不清空已填数据。",
      "失败步骤必须给出具体原因与重试入口，不只变红。",
      "同一时刻只有一个 process 步骤（由 current 决定）。",
    ],
    keyboard: [
      "可点击步骤是原生 <button>，进入 Tab 序列，Enter / Space 回退。",
      "未到达与不可点击的步骤不进入 Tab 序列。",
    ],
    accessibility: [
      "外层 <ol> 有序列表表达步骤顺序；当前步骤 <li aria-current=\"step\">。",
      "每步附读屏文本（已完成 / 进行中 / 失败 / 未开始），状态不只靠颜色与图标。",
    ],
    responsive: [
      "横向步骤等分剩余宽度，步骤数多于 4 个或描述较长时在窄屏改用纵向。",
      "描述文字在窄屏可省略，完整原因在步骤下方的 Alert 中展示。",
    ],
    content: [
      "步骤名用动词短语：上传文件、校验数据、确认导入。",
      "失败原因写具体（哪一行、缺哪个字段），不写“出错了”。",
    ],
    dos: [
      "流程失败后停在失败步，修正后可从该步继续。",
      "为每个步骤写一行描述说明这一步做什么或结果。",
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
    status: "stable",
    version: "0.1.0",
    purpose: "把长列表分页，告诉用户总量与当前位置，并允许翻页与调整每页条数。",
    usage:
      "实现为 pagination（Pagination / PaginationContent / PaginationItem / PaginationLink / PaginationEllipsis）组合：页码窗口由业务计算，总量文案与每页条数（Select）放在同一行。用于数据量超过一屏的列表与表格。持续增长的流式数据（实时日志）用“加载更多”或虚拟滚动；总数少于两页时不渲染。翻页必须保留筛选与排序条件。",
    keywords: ["pagination", "分页", "页码", "翻页", "每页条数"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "页码省略规则：首尾常驻，当前页前后各一页，其余折叠为省略号；首尾页时方向按钮禁用。",
        code: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** 首尾常驻，当前页前后各 1 页，其余折叠为省略号 */
function getPageItems(page: number, totalPages: number) {
  const items: (number | "ellipsis")[] = [];
  for (let n = 1; n <= totalPages; n += 1) {
    const edge = n === 1 || n === totalPages;
    // 省略号只替代 ≥2 个页码：只隐藏 1 页时直接显示该页
    const fillsGap = (n === 2 && page <= 4) || (n === totalPages - 1 && page >= totalPages - 3);
    if (edge || fillsGap || Math.abs(n - page) <= 1) items.push(n);
    else if (items[items.length - 1] !== "ellipsis") items.push("ellipsis");
  }
  return items;
}

<Pagination aria-label="分页">
  <PaginationContent>
    <PaginationItem>
      <PaginationLink
        href={\`?page=\${page - 1}\`}
        aria-label="上一页"
        aria-disabled={page === 1 || undefined}
        className={page === 1 ? "pointer-events-none opacity-50" : undefined}
      >
        <ChevronLeft className="size-4" />
      </PaginationLink>
    </PaginationItem>
    {getPageItems(page, totalPages).map((item, index) =>
      item === "ellipsis" ? (
        <PaginationItem key={\`ellipsis-\${index}\`}>
          <PaginationEllipsis className="size-8" />
        </PaginationItem>
      ) : (
        <PaginationItem key={item}>
          <PaginationLink href={\`?page=\${item}\`} isActive={item === page} className="font-mono">
            {item}
          </PaginationLink>
        </PaginationItem>
      ),
    )}
    <PaginationItem>
      <PaginationLink
        href={\`?page=\${page + 1}\`}
        aria-label="下一页"
        aria-disabled={page === totalPages || undefined}
        className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
      >
        <ChevronRight className="size-4" />
      </PaginationLink>
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
        preview: "pagination/basic",
      },
      {
        id: "full",
        title: "完整功能",
        kind: "variant",
        description: "总量文案 + 页码 + 每页条数（Select）；改变每页条数后回到第一页。",
        code: `import { Pagination, PaginationContent } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<div className="flex flex-wrap items-center gap-3">
  <span className="mr-auto text-sm text-muted-foreground">共 {total} 条</span>
  <Pagination aria-label="分页" className="mx-0 w-auto">
    <PaginationContent>
      {/* 上一页 / 页码 / 下一页，同基础示例 */}
    </PaginationContent>
  </Pagination>
  <Select
    value={String(pageSize)}
    onValueChange={(value) => {
      setPageSize(Number(value));
      setPage(1);
    }}
  >
    <SelectTrigger className="h-8 w-[108px]" aria-label="每页条数">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="10">10 条/页</SelectItem>
      <SelectItem value="20">20 条/页</SelectItem>
      <SelectItem value="50">50 条/页</SelectItem>
    </SelectContent>
  </Select>
</div>`,
        preview: "pagination/full",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表翻页：保留筛选条件，请求期间锁定页码防重复点击。",
        code: `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const goTo = (nextPage: number) => (event: React.MouseEvent) => {
  event.preventDefault();
  if (pageLoading) return;
  setPage(nextPage);
  setPageLoading(true);
  fetchRuns({ projectId: "project-042", page: nextPage, pageSize: 20, filters })
    .finally(() => setPageLoading(false));
};

<div className="flex flex-wrap items-center gap-3">
  <span className="mr-auto text-sm text-muted-foreground">共 {total} 个任务</span>
  <Pagination aria-label="任务列表分页" aria-busy={pageLoading} className="mx-0 w-auto">
    <PaginationContent>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
        <PaginationItem key={n}>
          <PaginationLink
            href={\`?page=\${n}\`}
            isActive={n === page}
            aria-disabled={pageLoading || undefined}
            className={cn("font-mono", pageLoading && "pointer-events-none opacity-50")}
            onClick={goTo(n)}
          >
            {n}
          </PaginationLink>
        </PaginationItem>
      ))}
    </PaginationContent>
  </Pagination>
</div>`,
        preview: "pagination/business",
      },
    ],
    props: [
      { name: "Pagination", type: "<nav> · aria-label", required: true, description: "外层导航；默认 aria-label 为英文 pagination，中文界面传 aria-label=\"分页\"；默认居中，左右布局时加 mx-0 w-auto。" },
      { name: "PaginationContent", type: "<ul>", required: true, description: "页码列表，flex gap-1。" },
      { name: "PaginationItem", type: "<li>", required: true, description: "包裹每个页码、省略号或方向按钮。" },
      { name: "PaginationLink", type: "<a> · isActive?: boolean · size?: ButtonSize", default: 'size="icon"', description: "页码链接；isActive 输出 aria-current=\"page\" 并用 secondary 样式。SPA 中在 onClick 里 preventDefault 后更新页码。" },
      { name: "上一页 / 下一页", type: "PaginationLink + ChevronLeft/Right + aria-label", description: "用 PaginationLink 自行组合中文 aria-label；首尾页加 aria-disabled 与 pointer-events-none opacity-50。（内置 PaginationPrevious / Next 文案为英文。）" },
      { name: "PaginationEllipsis", type: "<span>", description: "折叠页码的省略号，aria-hidden，不进入 Tab 序列。" },
      { name: "页码窗口", type: "getPageItems(page, totalPages)", description: "由业务计算：首尾常驻，当前页前后各 1 页，其余折叠为省略号（见基础示例）。" },
      { name: "每页条数", type: "Select（10 / 20 / 50 条/页）", default: "20", description: "放在页码右侧，变更后回到第一页；SelectTrigger 需 aria-label=\"每页条数\"。" },
      { name: "总量文案", type: "<span> text-sm text-muted-foreground", description: "“共 128 条”，列表场景写“共 128 个任务”更具体；放在同一行最左侧（mr-auto）。" },
    ],
    states: [
      { name: "default", note: "当前页 secondary 描边底，其余页码 ghost；省略规则 1 … 4 5 6 … 12。" },
      { name: "hover", note: "页码底色变为 accent。" },
      { name: "focus-visible", note: "页码焦点环，Tab 顺序与视觉顺序一致。" },
      { name: "pressed", note: "不适用：点击即翻页，无独立 pressed 态。", applicable: false },
      { name: "disabled", note: "首页时“上一页”、末页时“下一页”加 aria-disabled + pointer-events-none opacity-50，并移出 Tab 序列。" },
      { name: "loading", note: "翻页请求期间页码锁定防重复点击（aria-busy），数据区用 Skeleton。" },
      { name: "empty", note: "total 为 0 时不渲染分页，列表区显示 Empty。" },
      { name: "error", note: "翻页失败保留当前页码并用 toast 提示，可重试。" },
      { name: "permission-limited", note: "不适用：分页不判断权限，权限由数据接口决定。", applicable: false },
      { name: "mobile", note: "窄屏只保留上一页 / 当前页 / 下一页，每页条数与总量文案可换行到下一行。" },
      { name: "dark-mode", note: "沿用 Button 的语义令牌，自动适配。" },
    ],
    interaction: [
      "翻页保留筛选与排序条件，条件变化时回到第一页。",
      "改变每页条数后回到第一页。",
      "翻页请求期间锁定页码，避免重复请求与页码跳动。",
    ],
    keyboard: [
      "Tab 顺序：上一页 → 页码 → 下一页 → 每页条数选择器。",
      "页码为链接，Enter 翻页；每页条数 Select 用 ↑/↓ 选择、Enter 确认、Esc 关闭。",
    ],
    accessibility: [
      "外层 <nav aria-label=\"分页\">，内部 <ul>/<li>。",
      "当前页 aria-current=\"page\"；方向按钮用 aria-label 说明，省略号 aria-hidden 不进入 Tab 序列。",
    ],
    responsive: [
      "外层容器 flex-wrap：窄屏时总量文案与每页条数换到页码下方。",
      "<640px 用 getPageItems 的窗口为 0（只渲染当前页）或只保留上一页 / 下一页。",
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
      "不要在少于两页时渲染分页占位。",
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
    status: "stable",
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
        code: `import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">
      更多操作 <ChevronDown />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-40">
    <DropdownMenuItem onSelect={() => handleAction("detail")}>查看详情</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleAction("copy")}>复制任务 ID</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleAction("rerun")}>重新运行</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        preview: "dropdown/basic",
      },
      {
        id: "danger",
        title: "分组与危险项",
        kind: "variant",
        description: "危险项放在菜单底部并用分割线隔开，文案写清作用对象。",
        code: `import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="更多操作">
      <MoreHorizontal />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-44">
    <DropdownMenuItem>查看详情</DropdownMenuItem>
    <DropdownMenuItem>分享链接</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-danger focus:bg-danger-soft focus:text-danger">
      撤销任务
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        preview: "dropdown/danger",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务行更多操作：无权限项禁用说明，危险项带二次确认。",
        code: `import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Lock } from "lucide-react";

{/* modal={false}：菜单关闭后再打开确认框，焦点与指针事件不残留 */}
<DropdownMenu modal={false}>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      更多操作 <ChevronDown />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-56">
    <DropdownMenuItem onSelect={() => handleRunAction("detail")}>查看详情</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleRunAction("logs")}>下载日志</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleRunAction("clone")}>以此为模板新建</DropdownMenuItem>
    <DropdownMenuItem disabled>
      <Lock aria-hidden /> 审计记录
      <span className="ml-auto text-xs text-muted-foreground">需要项目管理员权限</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-danger focus:bg-danger-soft focus:text-danger"
      onSelect={() => setConfirming(true)}
    >
      撤销任务 run-28003
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<AlertDialog open={confirming} onOpenChange={setConfirming}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>撤销任务 run-28003？</AlertDialogTitle>
      <AlertDialogDescription>撤销后不可恢复，已排队资源立即释放。</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction
        className={buttonVariants({ variant: "danger" })}
        onClick={() => revokeRun("run-28003")}
      >
        确认撤销
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
        preview: "dropdown/business",
      },
    ],
    props: [
      { name: "DropdownMenu.open / onOpenChange", type: "boolean / (open: boolean) => void", description: "可选的受控展开状态；只支持点击 / 键盘打开，不支持 hover 触发。" },
      { name: "DropdownMenu.modal", type: "boolean", default: "true", description: "选中某项后要打开 AlertDialog 等浮层时设为 false，避免焦点与 pointer-events 残留。" },
      { name: "DropdownMenuTrigger.asChild", type: "boolean", description: "包住触发元素，通常是 Button 或图标按钮（size=\"icon\" + aria-label）。" },
      { name: "DropdownMenuContent.align / side", type: '"start" | "center" | "end" / "top" | "right" | "bottom" | "left"', default: '"center" / "bottom"', description: "相对触发器的位置，边缘自动翻转；sideOffset 默认 4，宽度用 className=\"w-40\"。" },
      { name: "DropdownMenuItem.onSelect", type: "(event: Event) => void", description: "选中回调，随后菜单关闭；event.preventDefault() 可保持打开。" },
      { name: "DropdownMenuItem.disabled", type: "boolean", default: "false", description: "禁用项；在项内右侧用小字写明所需权限。" },
      { name: "DropdownMenuItem.inset", type: "boolean", default: "false", description: "左侧留出图标位，与带图标 / 勾选的项对齐。" },
      { name: "危险项", type: "组合", description: "无 danger：放在 DropdownMenuSeparator 之后，className=\"text-danger focus:bg-danger-soft focus:text-danger\"，onSelect 打开 AlertDialog 二次确认。" },
      { name: "DropdownMenuSeparator / Label / Group / Shortcut", type: "部件", description: "分组线、组标题、分组容器与右侧快捷键提示。" },
      { name: "DropdownMenuCheckboxItem / RadioGroup + RadioItem", type: "部件", description: "可勾选项（checked / onCheckedChange）与单选项（value / onValueChange）。" },
      { name: "DropdownMenuSub / SubTrigger / SubContent", type: "部件", description: "二级菜单；层级不超过两级。" },
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
      "危险项先经 AlertDialog（或 Popconfirm）二次确认再执行，确认文案回显作用对象。",
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
    status: "stable",
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
        code: `import { Tabs, SegmentedList, SegmentedTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

<Tabs value={view} onValueChange={setView}>
  <SegmentedList aria-label="视图">
    <SegmentedTrigger value="table" className="gap-1.5">
      <List className="size-3.5" aria-hidden /> 表格
    </SegmentedTrigger>
    <SegmentedTrigger value="card" className="gap-1.5">
      <LayoutGrid className="size-3.5" aria-hidden /> 卡片
    </SegmentedTrigger>
  </SegmentedList>
</Tabs>`,
        preview: "segmented/basic",
      },
      {
        id: "sizes",
        title: "尺寸",
        kind: "size",
        description: "sm 用于工具条与卡片头部，md 为默认尺寸。",
        code: `import { Tabs, SegmentedList, SegmentedTrigger } from "@/components/ui/tabs";

{/* sm：列表高 28px、选项 12px 字 */}
<Tabs value={range} onValueChange={setRange}>
  <SegmentedList aria-label="时间范围" className="h-7">
    <SegmentedTrigger value="24h" className="h-6 px-2.5 text-xs">24h</SegmentedTrigger>
    <SegmentedTrigger value="7d" className="h-6 px-2.5 text-xs">7 天</SegmentedTrigger>
    <SegmentedTrigger value="30d" className="h-6 px-2.5 text-xs">30 天</SegmentedTrigger>
  </SegmentedList>
</Tabs>

{/* md：默认尺寸，列表高 32px */}
<Tabs value={filter} onValueChange={setFilter}>
  <SegmentedList aria-label="任务状态">
    <SegmentedTrigger value="all">全部</SegmentedTrigger>
    <SegmentedTrigger value="running">运行中</SegmentedTrigger>
    <SegmentedTrigger value="done">已完成</SegmentedTrigger>
  </SegmentedList>
</Tabs>`,
        preview: "segmented/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务指标的时间范围切换；数据不足的选项禁用并说明原因。",
        code: `import { Tabs, SegmentedList, SegmentedTrigger } from "@/components/ui/tabs";

<Tabs
  value={range}
  onValueChange={(value) => {
    setRange(value);
    refetchMetrics({ runId: "run-28003", range: value });
  }}
>
  <SegmentedList aria-label="指标时间范围">
    <SegmentedTrigger value="24h">24 小时</SegmentedTrigger>
    <SegmentedTrigger value="7d">7 天</SegmentedTrigger>
    <SegmentedTrigger
      value="30d"
      disabled
      title="任务运行未满 30 天"
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      30 天
    </SegmentedTrigger>
  </SegmentedList>
</Tabs>`,
        preview: "segmented/business",
      },
    ],
    props: [
      { name: "Tabs.value / onValueChange", type: "string / (value: string) => void", required: true, description: "外层仍是 Tabs，负责选中状态；选中即生效，在 onValueChange 里直接应用（如重新拉取指标）。" },
      { name: "SegmentedList", type: "aria-label, className", required: true, description: "分段容器（h-8 灰底胶囊）；必须给 aria-label。" },
      { name: "SegmentedTrigger.value", type: "string", required: true, description: "选项值；children 为 1–4 字文案，可前置 size-3.5 图标（className=\"gap-1.5\"）。" },
      { name: "SegmentedTrigger.disabled", type: "boolean", default: "false", description: "禁用选项；配 title 说明原因，并加 className=\"disabled:cursor-not-allowed disabled:opacity-50\"。" },
      { name: "SegmentedTrigger.aria-label", type: "string", description: "纯图标选项必填，同时配 Tooltip。" },
      { name: "尺寸", type: "组合", description: "无 size：默认列表 32px / 选项 28px；sm 用 SegmentedList className=\"h-7\" + SegmentedTrigger className=\"h-6 px-2.5 text-xs\"。" },
      { name: "结果区", type: "组合", description: "通常不配 TabsContent，由外部按 value 渲染紧邻的结果区域。" },
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
      "基于 Radix Tabs：容器 role=\"tablist\"，选项 role=\"tab\" 并自动同步 aria-selected。",
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
