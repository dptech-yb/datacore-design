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
    version: "0.9.0",
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
        code: `import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button>开始计算 <ArrowRight /></Button>
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
        code: `import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
  {isSubmitting ? "正在提交" : "提交"}
</Button>
<Button disabled>不可用（无权限）</Button>`,
        preview: "button/states",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于表格行内和紧凑工具条，md 是默认尺寸，lg 只用于页面级主动作。",
        code: `import { Button } from "@/components/ui/button";

<Button variant="secondary" size="sm">行内操作</Button>
<Button>默认尺寸</Button>
<Button size="lg">页面主动作</Button>`,
        preview: "button/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "涉及计算、写入、额度或外部调用的动作，按钮旁必须给出影响范围说明。",
        code: `import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

<div className="flex items-center gap-2">
  <Button disabled={isSubmitting} onClick={submit}>
    {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
    {isSubmitting ? "正在提交" : "提交计算任务"}
  </Button>
  <span className="text-xs text-muted-foreground">将使用 示例项目（project-042）· 预计最长 300 秒</span>
</div>`,
        fullCode: `import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SubmitRunAction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);
          await submitRun({ projectId: "project-042" }); // synthetic
          setIsSubmitting(false);
        }}
      >
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        {isSubmitting ? "正在提交" : "提交计算任务"}
      </Button>
      <span className="text-xs text-muted-foreground">将使用 示例项目（project-042）· 预计最长 300 秒</span>
    </div>
  );
}`,
        preview: "button/business",
      },
    ],
    props: [
      { name: "variant", type: '"default" | "secondary" | "ghost" | "soft" | "danger" | "link"', default: '"default"', description: "视觉层级。default 为实心主动作，一屏最多一个；secondary 带边框次动作；ghost/soft 低强调；danger 用于不可逆动作；link 无高度与内边距。" },
      { name: "size", type: '"sm" | "default" | "lg" | "icon"', default: '"default"', description: "sm 高 28px 用于行内与工具条；default 32px；lg 40px 仅用于页面级主动作；icon 为 32×32 方形，用于图标按钮。" },
      { name: "asChild", type: "boolean", default: "false", description: "为 true 时把按钮样式合并到唯一子元素（如 <a>），用于外观是按钮的跳转。" },
      { name: "disabled", type: "boolean", default: "false", description: "原生禁用；原因必须由邻近文案或 Tooltip 说明。" },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"submit"', description: "原生属性；form 内的非提交按钮显式写 type=\"button\"，避免误提交。" },
      { name: "onClick", type: "React.MouseEventHandler<HTMLButtonElement>", description: "点击回调；异步动作期间进入加载态。" },
      { name: "children", type: "ReactNode", required: true, description: "按钮文案，以动词开头；lucide 图标直接放在文字前后，自动 16px。" },
      { name: "className", type: "string", description: "追加样式，与变体样式合并（cn）；其余原生 button 属性与 ref 透传。" },
      { name: "加载态", type: "组合", description: "无 loading 属性：disabled={isSubmitting} + <Loader2 className=\"animate-spin\" aria-hidden=\"true\" /> + 进行中文案（“正在提交”），可加 aria-busy。" },
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
    version: "0.9.0",
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
        code: `import { Copy, MoreHorizontal, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

{/* 每个图标按钮都配 Tooltip，文案与 aria-label 相同（以下省略 Tooltip 包裹） */}
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="关闭面板"><X /></Button>
  </TooltipTrigger>
  <TooltipContent>关闭面板</TooltipContent>
</Tooltip>
<Button variant="ghost" size="icon" aria-label="复制任务 ID"><Copy /></Button>
<Button variant="ghost" size="icon" aria-label="刷新列表"><RefreshCw /></Button>
<Button variant="ghost" size="icon" aria-label="更多操作"><MoreHorizontal /></Button>`,
        preview: "icon-button/basic",
      },
      {
        id: "states",
        title: "状态示例",
        kind: "state",
        description: "danger 变体用于不可逆动作；disabled 必须在 Tooltip 或邻近文案中说明原因。",
        code: `import { Loader2, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

<Button variant="ghost" size="icon" aria-label="删除数据集 ds-118" className="text-danger hover:bg-danger-soft">
  <Trash2 />
</Button>

{/* disabled 按钮不触发指针事件：用可聚焦的外层承载 Tooltip，写明原因 */}
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0} className="inline-flex rounded-md">
      <Button variant="ghost" size="icon" aria-label="分享（需要项目编辑权限）" disabled>
        <Share2 />
      </Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>需要项目编辑权限</TooltipContent>
</Tooltip>

<Button variant="ghost" size="icon" aria-label="正在刷新" disabled>
  <Loader2 className="animate-spin text-primary" />
</Button>`,
        preview: "icon-button/states",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于表格行内和紧凑工具条，md 是默认尺寸；图标保持 14–16px。",
        code: `import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

{/* sm：28px，图标 14px，用于表格行内 */}
<Button variant="ghost" size="icon" aria-label="编辑" className="size-7 [&_svg]:size-3.5"><Pencil /></Button>
{/* 默认：32px，图标 16px */}
<Button variant="ghost" size="icon" aria-label="编辑"><Pencil /></Button>`,
        preview: "icon-button/sizes",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "表格行内只放高频动作（不超过 3 个）；删除等危险动作收入「更多操作」并配确认。",
        code: `import { Copy, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

<div className="flex items-center justify-end gap-0.5">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="查看 run-28003 详情" onClick={openDetail}><Eye /></Button>
    </TooltipTrigger>
    <TooltipContent>查看详情</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="复制任务 ID" onClick={copyRunId}><Copy /></Button>
    </TooltipTrigger>
    <TooltipContent>复制任务 ID</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="更多操作" onClick={openMenu}><MoreHorizontal /></Button>
    </TooltipTrigger>
    <TooltipContent>更多操作</TooltipContent>
  </Tooltip>
</div>`,
        preview: "icon-button/business",
      },
    ],
    props: [
      { name: "size", type: '"icon"', required: true, description: "图标按钮就是 <Button size=\"icon\">：32×32，图标 16px。行内紧凑尺寸用 className=\"size-7 [&_svg]:size-3.5\"（28px，图标 14px）。" },
      { name: "variant", type: '"ghost" | "secondary" | "danger" | …', default: '"default"', description: "需显式指定：工具栏用 ghost，需要边框用 secondary；不可逆动作用 ghost + className=\"text-danger hover:bg-danger-soft\" 或 danger。" },
      { name: "aria-label", type: "string", required: true, description: "动作完整名称（含对象），与 TooltipContent 文案一致。" },
      { name: "children", type: "ReactNode", required: true, description: "单个 lucide 图标；不放文字或数字。" },
      { name: "disabled", type: "boolean", default: "false", description: "原生禁用；原因由 Tooltip 或邻近文案说明。" },
      { name: "onClick", type: "React.MouseEventHandler<HTMLButtonElement>", description: "点击回调；异步动作期间进入加载态。" },
      { name: "Tooltip", type: "组合", description: "<Tooltip><TooltipTrigger asChild>{按钮}</TooltipTrigger><TooltipContent>名称</TooltipContent></Tooltip>；应用根部已挂 <TooltipProvider>。" },
      { name: "TooltipContent.side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "提示方向，空间不足自动翻转；sideOffset 默认 4。" },
      { name: "禁用说明", type: "组合", description: "disabled 按钮不触发指针事件：外包 <span tabIndex={0} className=\"inline-flex\"> 作为 TooltipTrigger，写明原因。" },
      { name: "加载态", type: "组合", description: "disabled + aria-label=\"正在刷新\"，图标替换为 <Loader2 className=\"animate-spin\" />，尺寸不变。" },
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
      "使用原生 <button>，aria-label 与 Tooltip 文案一致。",
      "图标本身 aria-hidden，朗读只读动作名称。",
      "disabled 按钮外包可聚焦的 span 承载 Tooltip，保留焦点与原因入口。",
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
    version: "0.9.0",
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
        code: `import { ArrowRight } from "lucide-react";
import { Link } from "@/components/ui/link";

<Link href="#/projects/project-042">示例项目（project-042）</Link>
<Link href="#/runs/run-28003">查看运行详情 <ArrowRight /></Link>
<Link href="https://example.com/docs/fields" external>字段规范文档</Link>`,
        preview: "link/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "muted 用于次级导航；danger 链接只允许“离开/放弃”类导航，不允许用于破坏性动作；disabled 去掉 href 并在邻近文案说明原因。",
        code: `import { Link } from "@/components/ui/link";

<Link href="#/datasets" variant="muted">返回数据集列表</Link>
<Link href="#/projects/project-042/archive" variant="danger">放弃本次编辑并离开</Link>
<Link disabled>导出记录（CSV）</Link>`,
        preview: "link/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "表格中的实体名称渲染为链接跳转详情；ID 用等宽字体跟在名称后，不重复做链接。",
        code: `import { Link } from "@/components/ui/link";
import { Num } from "@/components/ui/typography";

<div className="flex items-baseline gap-2">
  <Link href="#/projects/project-042">示例电解液项目</Link>
  <Num mono className="text-xs text-muted-foreground">project-042</Num>
</div>`,
        preview: "link/business",
      },
    ],
    props: [
      { name: "href", type: "string", description: "目标地址；站内用路由路径，站外用完整 URL。disabled 时不渲染。" },
      { name: "external", type: "boolean", default: "false", description: "外链：默认 target=\"_blank\"、rel=\"noopener noreferrer\"，追加外链图标与读屏提示“（在新标签页打开）”。" },
      { name: "variant", type: '"default" | "muted" | "danger"', default: '"default"', description: "muted 用于次级导航，danger 仅用于离开/放弃类导航。" },
      { name: "disabled", type: "boolean", default: "false", description: "去掉 href，以 aria-disabled 的 muted 文本渲染，点击无效；原因由邻近文案说明。" },
      { name: "asChild", type: "boolean", default: "false", description: "把样式与外链处理交给子元素（Radix Slot），用于路由库的 <RouterLink>。" },
      { name: "target / rel", type: "string", description: "覆盖外链默认的 target 与 rel。" },
      { name: "className", type: "string", description: "追加样式，经 cn 合并。" },
      { name: "children", type: "ReactNode", required: true, description: "链接文案，写清去向，不写“点击这里”；方向图标可直接放在文案后（图标自动 14px）。" },
    ],
    states: [
      { name: "default", note: "品牌色（primary），默认无下划线。" },
      { name: "hover", note: "出现下划线，颜色加深；不改变字重，避免行内抖动。" },
      { name: "focus-visible", note: "ring 令牌色焦点环，与 Button 焦点样式一致。" },
      { name: "pressed", note: "颜色再深一档；站内导航不记忆 visited 态。" },
      { name: "disabled", note: "disabled 渲染为 muted 文本（aria-disabled），去掉跳转能力，邻近文案说明原因。" },
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
      "外链聚焦时读屏器额外朗读“（在新标签页打开）”。",
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
    version: "0.9.0",
    purpose: "用固定的字号、字重与语义色层级表达信息结构，保证全站文字可读、可扫、一致。",
    usage:
      "用于标题、正文、辅助说明、ID 与数值的展示。需要表达状态用 Badge；大段代码用 CodeBlock；不要用手写字号的方式伪造层级。",
    keywords: ["typography", "text", "title", "排版", "文字", "标题", "正文"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "H1 只用于页面主标题，H2/H3 为区块标题，Lead/Text 为导语与正文，Small 用于辅助说明，Num 用于 ID 与数值。",
        code: `import { H1, H2, H3, InlineCode, Lead, Num, Small, Text } from "@/components/ui/typography";

<H1>示例项目（project-042）</H1>
<H2>基础信息</H2>
<H3>计算参数</H3>
<Lead>覆盖导入、计算与复核三个环节。</Lead>
<Text>本项目用于验证电解液配方的筛选流程，字段 <InlineCode>cycle_count</InlineCode> 为必填。</Text>
<Small>最近更新 · 2026-09-18</Small>
<Text><Num mono>run-28003</Num> · 容量保持率 <Num>92.41%</Num></Text>`,
        preview: "typography/basic",
      },
      {
        id: "variants",
        title: "语义文本示例",
        kind: "variant",
        description: "语义色只用于状态文本：success 完成、warning 待复核、danger 失败、agent 为 Agent 生成。",
        code: `import { Text } from "@/components/ui/typography";

<Text tone="success">计算完成 · 用时 214 秒</Text>
<Text tone="warning">3 个字段待人工复核</Text>
<Text tone="danger">任务失败：输入文件缺失</Text>
<Text tone="agent">以下内容由 Agent 生成，请复核后采纳</Text>
<Text tone="muted">muted：次要说明</Text>
<Text tone="subtle">subtle：最弱提示，如占位与时间戳</Text>`,
        preview: "typography/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "详情页头部：名称用 H2，ID 用 Num mono 紧随名称，归属信息用 muted 小号正文，指标用 tabular 数字对齐。",
        code: `import { H2, Num, Small, Text } from "@/components/ui/typography";

<header className="flex flex-col gap-1.5">
  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <H2>NCM811 高温循环实验</H2>
    <Num mono className="text-sm text-muted-foreground">run-28003</Num>
  </div>
  <Text tone="muted" size="sm">所属项目 示例项目（project-042）· 数据集 ds-118</Text>
  <div className="flex flex-col">
    <Small>容量保持率</Small>
    <Num className="text-xl font-semibold text-foreground">92.41%</Num>
  </div>
</header>`,
        preview: "typography/business",
      },
    ],
    props: [
      { name: "H1 – H4", type: "HTMLAttributes<HTMLHeadingElement>", description: "语义标题，渲染真实 h1–h4；H1 在 <768px 为 24px、≥768px 为 30px，H2 20px，H3 18px，H4 16px。" },
      { name: "Text · tone", type: '"default" | "muted" | "subtle" | "success" | "warning" | "danger" | "agent"', default: '"default"', description: "语义色；success/warning/danger/agent 只用于状态文本，不用于装饰。" },
      { name: "Text · size", type: '"sm" | "base" | "md"', default: '"base"', description: "正文字号：13 / 14 / 16px。" },
      { name: "Text · truncate", type: "boolean", default: "false", description: "单行截断；完整值请同时放进 title。" },
      { name: "Text · as", type: '"p" | "span" | "div" | "label"', default: '"p"', description: "覆盖渲染标签。" },
      { name: "Lead", type: "HTMLAttributes<HTMLParagraphElement>", description: "导语，16px muted，放在标题下的一句概述。" },
      { name: "Small", type: "HTMLAttributes<HTMLElement>", description: "辅助说明 / 字段标签，12px muted。" },
      { name: "InlineCode", type: "HTMLAttributes<HTMLElement>", description: "行内代码，用于字段名、命令、路径。" },
      { name: "Num · mono", type: "boolean", default: "false", description: "Num 默认启用 tabular-nums；mono 额外使用等宽字体，用于 ID。" },
      { name: "className", type: "string", description: "所有组件均支持，经 cn 合并。" },
    ],
    states: [
      { name: "default", note: "按组件渲染固定字号/字重/行高，不手写 font-size 覆盖。" },
      { name: "hover", note: "不适用：静态文本无 hover；可交互文本的 hover 由承载控件定义。", applicable: false },
      { name: "focus-visible", note: "不适用：静态文本不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：静态文本无按压态。", applicable: false },
      { name: "disabled", note: "不适用：禁用态由对应控件表达，文本不单独变灰。", applicable: false },
      { name: "loading", note: "数据未到时用 Skeleton 占位，不渲染“加载中…”正文文本。" },
      { name: "empty", note: "空值不渲染“暂无”，由 Empty 组件在区块级说明。" },
      { name: "error", note: "错误摘要文本使用 tone=\"danger\"；字段级错误跟随表单的 field-error 样式。" },
      { name: "permission-limited", note: "无权限字段渲染为 muted 的“无权限查看”占位，不留空白、不显示部分值。" },
      { name: "mobile", note: "H1 在移动端从 30px 降到 24px，正文保持 14px 不缩小。" },
      { name: "dark-mode", note: "正文与辅助色使用语义令牌自动适配；语义色提亮一档。" },
    ],
    interaction: [
      "ID 与数值用 Num（ID 加 mono），方便扫描与复制比对。",
      "截断文本必须提供完整值入口（title 或展开按钮）。",
      "语义色文本不与同色 Badge 并排重复表达同一状态。",
    ],
    keyboard: [
      "不适用：静态文本无键盘行为；复制 ID 通过相邻 IconButton 触发。",
      "截断展开的入口必须是可聚焦的按钮，不绑定在文本本身。",
    ],
    accessibility: [
      "标题使用真实 h1–h4 标签，层级不跳级。",
      "正文字号不小于 13px（Small 12px 仅用于辅助说明），对比度 ≥ 4.5:1。",
      "状态文本不只依赖颜色，配合措辞或图标。",
    ],
    responsive: [
      "H1 在 <768px 降为 24px。",
      "长表格单元格文本使用 truncate，不换行撑高行。",
    ],
    content: [
      "辅助说明使用 Small，句子简短，不以“请”开头。",
      "ID 一律等宽字体，不翻译、不改写大小写。",
      "错误文本写清对象与后果：任务失败：输入文件缺失。",
    ],
    dos: [
      "用 H1–H4 / Text / Small 表达层级，而不是手写 font-size。",
      "ID 用 Num mono，数值用 Num。",
      "状态文本用语义色并写清结论。",
    ],
    donts: [
      "不要新增字号或颜色表达层级。",
      "不要整段正文使用语义色。",
      "不要把长 URL、长 ID 原样撑破布局（用 truncate）。",
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
    version: "0.9.0",
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
        code: `import { Separator } from "@/components/ui/separator";

<p>项目基础信息与说明。</p>
<Separator className="my-5" />
<p>参数配置与执行记录。</p>`,
        preview: "divider/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "带文字的分割线用于标记区块起点；垂直分割线只用于工具栏按钮分组；虚线用于弱分隔。",
        code: `import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

{/* 带文字：标记区块起点 */}
<div className="flex items-center gap-2.5">
  <span className="text-base font-semibold">参数配置</span>
  <Separator className="w-auto flex-1" />
</div>

{/* 垂直：只用于工具栏按钮分组 */}
<div className="flex h-5 items-center gap-3">
  <Button variant="ghost" size="sm">查看</Button>
  <Separator orientation="vertical" className="h-4" />
  <Button variant="ghost" size="sm">编辑</Button>
</div>

{/* 虚线：弱分隔 */}
<Separator className="h-0 border-t border-dashed bg-transparent" />`,
        preview: "divider/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "详情页在「基础信息」与「执行记录」之间用带文字分割线分区，不再重复加粗区块标题。",
        code: `import { Separator } from "@/components/ui/separator";

<Descriptions items={baseItems} />
<div className="flex items-center gap-2.5">
  <span className="text-base font-semibold">执行记录</span>
  <Separator className="w-auto flex-1" />
</div>
<Timeline items={runEvents} />`,
        preview: "divider/business",
      },
    ],
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "方向；垂直只用于工具栏与按钮组，需在父容器给出高度或用 className=\"h-4\"。" },
      { name: "className", type: "string", description: "间距与长度：水平用 my-5 留白；与文字并排时用 w-auto flex-1。组件只接受 orientation 与 className，其余属性不透传。" },
      { name: "带文字", type: "组合", description: "无 children/textPosition：<div className=\"flex items-center gap-2.5\"><span>区块名</span><Separator className=\"w-auto flex-1\" /></div>，文字在左即区块标题。" },
      { name: "虚线", type: "组合", description: "无 dashed：className=\"h-0 border-t border-dashed bg-transparent\"，用于弱分隔。" },
      { name: "语义", type: "内置", description: "始终渲染 role=\"separator\"，垂直时带 aria-orientation=\"vertical\"；纯装饰场景在外层容器加 aria-hidden。" },
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
      "Separator 渲染 role=\"separator\"，aria-orientation 随 orientation 同步。",
      "纯装饰分割线在外层容器标记 aria-hidden（组件不透传 aria-*）。",
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
      "区块标题场景把文字放在左侧，右侧接 <Separator className=\"flex-1\" />。",
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
    version: "0.9.0",
    purpose: "用语义色加短文案标记对象的状态或数量，是状态语义的最小载体。",
    usage:
      "用于表格状态列、任务与运行状态、通知计数。分类与属性用 Tag；需要整段说明的状态用 Alert；可点击的筛选条件用 Tag 或 FilterBar。",
    keywords: ["badge", "status", "count", "徽标", "状态", "计数"],
    examples: [
      {
        id: "basic",
        title: "语义色示例",
        kind: "basic",
        description: "六种语义色各归其位：success 完成、warning 待复核、danger 失败、info 进行中、agent Agent、neutral 默认。",
        code: `import { Badge } from "@/components/ui/badge";

<Badge tone="success" dot>已完成</Badge>
<Badge tone="warning" dot>待复核</Badge>
<Badge tone="danger" dot>失败</Badge>
<Badge tone="primary" dot>进行中</Badge>
<Badge tone="agent" dot>Agent 建议</Badge>
<Badge tone="neutral" dot>已归档</Badge>`,
        preview: "badge/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "dot 只表达状态不表达数量；count 用于未读数，超过 max 显示 99+；进行中的状态带动效提示仍在变化。",
        code: `import { Bell, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

<Badge tone="success" dot>服务正常</Badge>
<Badge tone="primary">
  <Loader2 className="size-2.5 animate-spin" aria-hidden="true" />同步中
</Badge>

{/* 计数徽标：Badge 叠在图标按钮右上角，超过 99 显示 99+ */}
<span className="relative inline-flex">
  <Button variant="ghost" size="icon" aria-label="通知（8 条未读）"><Bell /></Button>
  <Badge
    tone="danger"
    aria-hidden="true"
    className="absolute -right-1.5 -top-1 h-4 min-w-4 justify-center rounded-full bg-danger px-1 text-danger-foreground"
  >
    {count > 99 ? "99+" : count}
  </Badge>
</span>`,
        preview: "badge/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "运行列表的状态列：同一列只出现状态徽标，颜色与文案一一对应，不用颜色区分业务类型。",
        code: `import { Badge } from "@/components/ui/badge";

const statusBadge = {
  success: <Badge tone="success" dot>已完成</Badge>,
  info: <Badge tone="primary" dot>进行中</Badge>,
  warning: <Badge tone="warning" dot>待复核</Badge>,
  danger: <Badge tone="danger" dot>失败</Badge>,
};

<td>{statusBadge[run.status]}</td>`,
        fullCode: `import { Badge } from "@/components/ui/badge";

// synthetic 数据
const runs = [
  { id: "run-28003", name: "NCM811 高温循环", status: "success" },
  { id: "run-28004", name: "电解液配方筛选", status: "info" },
  { id: "run-28005", name: "阻抗谱拟合", status: "warning" },
  { id: "run-28006", name: "热稳定性预测", status: "danger" },
] as const;

const statusBadge = {
  success: <Badge tone="success" dot>已完成</Badge>,
  info: <Badge tone="primary" dot>进行中</Badge>,
  warning: <Badge tone="warning" dot>待复核</Badge>,
  danger: <Badge tone="danger" dot>失败</Badge>,
};

function RunStatusTable() {
  return (
    <table>
      <thead>
        <tr><th>任务</th><th>项目</th><th>状态</th></tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr key={run.id}>
            <td><strong>{run.name}</strong> <span className="font-mono">{run.id}</span></td>
            <td className="font-mono">project-042</td>
            <td>{statusBadge[run.status]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
        preview: "badge/business",
      },
    ],
    props: [
      { name: "tone", type: '"neutral" | "primary" | "success" | "warning" | "danger" | "agent" | "outline"', default: '"neutral"', description: "语义色：success 完成、warning 待复核、danger 失败、primary 进行中、agent 仅用于 Agent/模型、outline 弱化标记；不用颜色区分业务类型。" },
      { name: "dot", type: "boolean", default: "false", description: "文案前加当前色圆点（aria-hidden），文案仍需保留。" },
      { name: "children", type: "ReactNode", description: "状态文案 2–4 字；可前置小图标。" },
      { name: "className", type: "string", description: "追加样式；其余原生 span 属性（title、aria-*）透传。" },
      { name: "进行中", type: "组合", description: "无 pulse：children 前放 <Loader2 className=\"size-2.5 animate-spin\" aria-hidden=\"true\" />，完成后替换为终态徽标。" },
      { name: "计数", type: "组合", description: "无 count/max：tone=\"danger\" + 圆形绝对定位 className 叠在图标按钮右上角，内容 {count > 99 ? \"99+\" : count}；徽标 aria-hidden，数量写进按钮 aria-label。" },
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
      "进行中状态用旋转图标（Loader2 animate-spin）提示仍在变化，完成后立即替换为终态徽标。",
      "同一行最多两个徽标：状态 + 数量，不堆叠第三类标记。",
    ],
    keyboard: [
      "不适用：徽标不进入 Tab 序列。",
      "计数徽标的入口（如通知中心）由相邻 IconButton 承载键盘行为。",
    ],
    accessibility: [
      "状态不只依赖颜色：dot/颜色之外必须有文案或图标。",
      "计数徽标本身 aria-hidden，数量写进所在按钮的 aria-label，如“通知（8 条未读）”。",
      "进行中的旋转动效遵守 prefers-reduced-motion，降级为静态样式。",
    ],
    responsive: [
      "移动端不缩小字号；空间不足时隐藏文案、保留 dot 并提供 title。",
      "表格状态列保持固定宽度，横向滚动中不被压缩变形。",
    ],
    content: [
      "文案 2–4 字，写结论不写过程：已完成、待复核、失败。",
      "语义与颜色固定绑定：agent 只用于 Agent/模型，不用于其他“特别”标记。",
      "count 只表达未读/待处理数量，不表达总量。",
    ],
    dos: [
      "颜色与语义一一对应，全站统一。",
      "状态未知或未返回时用 neutral 占位。",
      "进行中用 tone=\"primary\" 并加旋转图标，完成即切终态。",
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
    status: "stable",
    version: "0.9.0",
    purpose: "标记对象的分类、属性或来源，支持移除与选择，是属性维度的最小载体。",
    usage:
      "用于数据集属性、筛选条件的已选值、用户自定义分类。状态（已完成/失败）用 Badge，不用 Tag；大量选项的管理用 Select。",
    keywords: ["tag", "label", "标签", "分类", "筛选"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "默认标签表达中性属性；语义色只在与 Badge 相同的语义上使用，含义不扩展。",
        code: `import { Sparkles } from "lucide-react";
import { Tag, TagGroup } from "@/components/ui/tag";

<TagGroup aria-label="数据集属性">
  <Tag>电解液</Tag>
  <Tag tone="primary">内部数据</Tag>
  <Tag tone="agent" icon={<Sparkles />}>Agent 标注</Tag>
  <Tag tone="warning">待确认来源</Tag>
  <Tag tone="outline">草稿</Tag>
</TagGroup>
<TagGroup>
  <Tag size="sm">sm · 表格行内</Tag>
  <Tag>default · 属性区</Tag>
</TagGroup>`,
        preview: "tag/basic",
      },
      {
        id: "variants",
        title: "可关闭与可选择",
        kind: "variant",
        description: "可移除用于已选筛选条件；可选择用于多选分类（asChild 包一个 button aria-pressed），选中态用填充色而非勾选图标。",
        code: `import { Tag, TagGroup } from "@/components/ui/tag";

<TagGroup aria-label="已选筛选">
  <Tag onRemove={() => removeFilter("project")} removeLabel="移除筛选 项目：project-042">
    项目：project-042
  </Tag>
</TagGroup>
<TagGroup aria-label="实验分类（可多选）">
  <Tag asChild tone={selected ? "primary" : "outline"}>
    <button type="button" aria-pressed={selected} onClick={() => setSelected(!selected)}>
      高温循环
    </button>
  </Tag>
</TagGroup>`,
        preview: "tag/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据集属性区：来源、格式用中性标签，Agent 生成的标注用 agent 色并注明来源；已选筛选外露为可移除标签。",
        code: `import { Sparkles } from "lucide-react";
import { Tag, TagGroup } from "@/components/ui/tag";

<TagGroup aria-label="数据集属性">
  <Tag>来源：导入</Tag>
  <Tag>格式：CSV</Tag>
  <Tag tone="agent" icon={<Sparkles />}>Agent 标注：含异常点</Tag>
</TagGroup>
<TagGroup aria-label="已选筛选">
  {filters.map((f) => (
    <Tag key={f} onRemove={() => remove(f)} removeLabel={\`移除筛选 \${f}\`}>{f}</Tag>
  ))}
</TagGroup>`,
        preview: "tag/business",
      },
    ],
    props: [
      { name: "tone", type: '"neutral" | "primary" | "success" | "warning" | "danger" | "agent" | "outline"', default: '"neutral"', description: "语义色，与 Badge 同一套规则，不扩展含义；outline 为描边弱化样式。" },
      { name: "size", type: '"sm" | "default"', default: '"default"', description: "sm（20px）用于表格行内，default（24px）用于属性区。" },
      { name: "icon", type: "ReactNode", description: "前置图标，装饰性，自动 aria-hidden。" },
      { name: "onRemove", type: "() => void", description: "传入后显示移除按钮；点击即移除条件，无需二次确认。" },
      { name: "removeLabel", type: "string", default: "“移除 {文本}”", description: "移除按钮的无障碍名称，建议写明对象：移除筛选 状态：进行中。" },
      { name: "asChild", type: "boolean", default: "false", description: "把样式交给子元素，例如 <button aria-pressed> 实现可选择标签。" },
      { name: "children", type: "ReactNode", required: true, description: "标签内容，推荐「维度：值」格式；字符串内容超长时截断并写入 title。" },
      { name: "TagGroup", type: "HTMLAttributes<HTMLDivElement>", description: "换行排列的容器（gap 6px）；传 aria-label 时以 role=group 作为一组朗读。" },
    ],
    states: [
      { name: "default", note: "中性灰底；语义色仅在与 Badge 相同的含义上使用。" },
      { name: "hover", note: "可移除/可选择时 hover 降低不透明度并显示指针；只读标签无 hover。" },
      { name: "focus-visible", note: "可交互标签有 ring 令牌色焦点环；只读标签不接收焦点。" },
      { name: "pressed", note: "可选择标签（asChild + button）点击切换选中，用 primary 填充色表达选中，不使用勾选图标。" },
      { name: "disabled", note: "禁用的可交互标签 opacity 50%，原因由上下文说明。" },
      { name: "loading", note: "不适用：标签内容的加载由所在区块 Skeleton 承担。", applicable: false },
      { name: "empty", note: "不适用：没有标签时不渲染标签区域，由 Empty 说明。", applicable: false },
      { name: "error", note: "不适用：标签不表达错误；错误用 Badge danger 或 Alert。", applicable: false },
      { name: "permission-limited", note: "无权限修改的属性标签渲染为只读，不传 onRemove 即不显示移除按钮。" },
      { name: "mobile", note: "TagGroup 自动换行；单个标签最大宽度 100%，超出截断。" },
      { name: "dark-mode", note: "语义色使用令牌自动适配。" },
    ],
    interaction: [
      "onRemove 即时生效：移除条件并刷新查询，不需要二次确认。",
      "可选择标签通过 asChild 包一个 button，点击切换选中，用于多选分类筛选。",
      "标签过多时收起为「+N」，展开后逐行展示。",
    ],
    keyboard: [
      "可选择标签（button）与移除按钮各自进入 Tab 序列；Enter / Space 触发选择或移除。",
      "移除按钮是独立的可聚焦按钮，带有明确的 aria-label。",
    ],
    accessibility: [
      "可选择标签的 button 使用 aria-pressed 表达选中态。",
      "移除按钮的 aria-label 说明对象（removeLabel）：移除筛选 状态：进行中。",
      "选中态不只依赖颜色，同时有 aria-pressed 供读屏器朗读。",
    ],
    responsive: [
      "TagGroup 换行展示，不横向滚动。",
      "移动端单个标签内容超长时截断，完整值由 title 提供。",
    ],
    content: [
      "属性标签格式「维度：值」：来源：导入、格式：CSV。",
      "筛选标签保留维度名，关闭后用户能记住刚才筛了什么。",
      "Agent 生成的标注必须用 agent 色并注明来源。",
    ],
    dos: [
      "状态用 Badge，属性用 Tag，分工不混。",
      "已选筛选条件用带 onRemove 的 Tag 外露在筛选栏。",
      "Agent 标注用 agent 色并写明来源。",
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
    version: "0.9.0",
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
        code: `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card className="max-w-[420px]">
  <CardHeader>
    <CardTitle>计算资源</CardTitle>
    <Button variant="link" size="sm" asChild>
      <a href="#/quota">额度明细</a>
    </Button>
  </CardHeader>
  <CardContent className="space-y-3">
    <p className="text-sm text-muted-foreground">本月已用 1,280 / 3,000 核时</p>
    <Button variant="secondary" size="sm">申请扩容</Button>
  </CardContent>
</Card>`,
        preview: "card/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "可点卡片需可聚焦、可键盘触发并有悬停反馈；加载时用 Skeleton 替换内容但保留卡片框架。",
        code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

{/* 入口卡：整卡可点，需可聚焦、可键盘触发 */}
<Card
  role="button"
  tabIndex={0}
  onClick={openProject}
  onKeyDown={(e) => e.key === "Enter" && openProject()}
  className={cn(
    "cursor-pointer transition-colors hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring",
    selected && "border-primary",
  )}
>
  <CardHeader className="flex-col gap-1">
    <CardTitle>示例项目（project-042）</CardTitle>
    <CardDescription>12 个数据集 · 34 次运行</CardDescription>
  </CardHeader>
</Card>

{/* loading：保留卡片框架与标题，只把内容区换成骨架 */}
<Card aria-busy="true">
  <CardHeader>
    <CardTitle>执行记录</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton className="h-2.5 w-full" />
    <Skeleton className="h-2.5 w-full" />
    <Skeleton className="h-2.5 w-3/5" />
  </CardContent>
</Card>`,
        preview: "card/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目卡：名称 + 状态徽标 + 关键统计 + 行内操作；同类卡片信息结构保持一致，方便横向扫描。",
        code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card className="max-w-[420px]">
  <CardHeader>
    <CardTitle>示例电解液项目</CardTitle>
    <Badge tone="primary" dot>进行中</Badge>
  </CardHeader>
  <CardContent className="space-y-3">
    <p className="text-sm text-muted-foreground">目标：筛选高温稳定配方，覆盖 3 种溶剂体系。</p>
    <div className="flex gap-6">
      <span><strong className="text-lg">12</strong> <span className="text-xs text-muted-foreground">数据集</span></span>
      <span><strong className="text-lg">34</strong> <span className="text-xs text-muted-foreground">运行次数</span></span>
    </div>
    <Button variant="ghost" size="sm" className="-ml-2.5">查看详情</Button>
  </CardContent>
</Card>`,
        preview: "card/business",
      },
    ],
    props: [
      { name: "Card", type: "HTMLAttributes<HTMLDivElement>", required: true, description: "外框：圆角、1px 边框、card 背景；所有部件都接受 className 与原生 div 属性。" },
      { name: "CardHeader", type: "HTMLAttributes<HTMLDivElement>", description: "标题行，flex 两端对齐，右侧放链接或状态徽标（不放主按钮）；标题与描述上下排列时加 className=\"flex-col gap-1\"。" },
      { name: "CardTitle", type: "HTMLAttributes<HTMLHeadingElement>", description: "渲染 <h3>，写名词短语。" },
      { name: "CardDescription", type: "HTMLAttributes<HTMLParagraphElement>", description: "渲染 <p>，弱化色辅助说明。" },
      { name: "CardContent", type: "HTMLAttributes<HTMLDivElement>", description: "内容区（px-4 pb-4）；分区用 Separator，不嵌套卡片；底部动作也放在这里（无 CardFooter）。" },
      { name: "可点卡片", type: "组合", description: "无 hoverable：Card 加 role=\"button\" tabIndex={0} onClick + onKeyDown(Enter)，以及 hover:border-primary/50 focus-visible:ring-2 样式；卡内独立动作阻止冒泡。" },
      { name: "加载态", type: "组合", description: "无 loading：Card 加 aria-busy=\"true\"，保留 CardHeader/CardTitle，CardContent 内放 Skeleton。" },
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
      "整卡可点时，卡内不再放第二个跳转链接；独立动作阻止冒泡。",
      "一卡一个主题；同类卡片保持相同的信息结构，方便横向扫描。",
      "加载、空、错误都只替换内容区，框架不动。",
    ],
    keyboard: [
      "整卡可点的卡片设 tabIndex={0} 进入 Tab 序列，onKeyDown 中 Enter 触发 onClick。",
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
      "标题行右侧辅助区放链接或状态徽标，不放第二个按钮。",
      "同类卡片之间的字段顺序保持一致。",
    ],
    dos: [
      "一卡一个主题，信息结构统一。",
      "加载用骨架屏替换内容，保留卡片框架。",
      "入口卡整卡可点时给出明确的悬停与焦点反馈。",
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

<Empty
  title="还没有实验记录"
  description="创建第一个实验后，数据会展示在这里。"
  actions={<Button size="sm">新建实验</Button>}
/>`,
        preview: "empty/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "筛选无结果与无数据是两种空态：前者给「清除筛选」，后者给创建入口；行内小空态用 size=\"compact\"。",
        code: `import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

<Empty
  icon={<SearchX />}
  title="没有符合条件的结果"
  description="尝试调整筛选条件或关键字。"
  actions={<Button variant="secondary" size="sm">清除筛选</Button>}
/>
<Empty size="compact" icon={null} description="暂无附件" />`,
        preview: "empty/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目详情页的数据集列表：区分「项目还没有数据集」与「筛选后没有结果」，文案与动作不同。",
        code: `import { Database, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";

<Card>
  <Empty
    icon={<Database />}
    title="示例项目（project-042）还没有数据集"
    description="导入或新建数据集后即可开始计算。"
    actions={<Button size="sm">导入数据集</Button>}
  />
</Card>
<Card>
  <Empty
    icon={<SearchX />}
    title="没有符合「进行中」的数据集"
    description="当前筛选条件下没有结果。"
    actions={<Button variant="ghost" size="sm">清除筛选</Button>}
  />
</Card>`,
        preview: "empty/business",
      },
    ],
    props: [
      { name: "title", type: "ReactNode", description: "发生了什么；一句话，写对象不写情绪。" },
      { name: "description", type: "ReactNode", description: "是否需要操作的补充说明；一句话。" },
      { name: "actions", type: "ReactNode", description: "下一步动作，通常一个 Button（size=\"sm\"）；不需要动作时省略。" },
      { name: "icon", type: "ReactNode | null", default: "<Inbox />", description: "顶部图标（装饰性，aria-hidden）；筛选无结果换成 SearchX，传 null 则不显示。" },
      { name: "size", type: '"default" | "compact"', default: '"default"', description: "compact 用于表格单元格、卡片内的行内空态，间距与字号更小。" },
      { name: "children", type: "ReactNode", description: "插入在说明与动作之间的自定义内容。" },
      { name: "className", type: "string", description: "追加样式，例如在卡片内去掉内边距。" },
    ],
    states: [
      { name: "default", note: "居中：图标 + 标题 + 说明 + 动作，三要素齐全。" },
      { name: "hover", note: "不适用：空状态本身不可交互，仅 actions 中的按钮有 hover。", applicable: false },
      { name: "focus-visible", note: "不适用：空状态容器不接收焦点。", applicable: false },
      { name: "pressed", note: "不适用：空状态容器无按压态。", applicable: false },
      { name: "disabled", note: "不适用：空状态无禁用态。", applicable: false },
      { name: "loading", note: "不适用：加载中用 Skeleton，不允许空态与骨架屏来回闪烁。", applicable: false },
      { name: "empty", note: "Empty 本身就是空态的表达；数据到达后原位替换为内容，布局不跳动。" },
      { name: "error", note: "错误不是空态：加载失败用 Result 或 Alert 给出原因与重试。" },
      { name: "permission-limited", note: "无权限不是空态：用 Result（403）说明所需权限与联系人。" },
      { name: "mobile", note: "文案保持完整，动作按钮自动换行居中。" },
      { name: "dark-mode", note: "图标底板使用 muted 令牌，自动适配。" },
    ],
    interaction: [
      "actions 最多一个按钮；空状态不承担教学任务，不放图文教程。",
      "数据到达后内容原位替换，空态与内容的高度尽量接近，避免布局跳动。",
      "筛选无结果时保留筛选栏可见，不清空用户已输入的条件。",
    ],
    keyboard: [
      "actions 中的按钮正常进入 Tab 序列。",
      "空状态容器不接收焦点，屏幕阅读器以文本朗读标题与说明。",
    ],
    accessibility: [
      "图标 aria-hidden，信息由标题与说明文本承载。",
      "标题使用描述性文本，不只显示图标。",
    ],
    responsive: [
      "移动端标题与说明不截断，说明文字最大宽度 24rem 居中换行。",
      "actions 在窄屏自动换行并居中。",
    ],
    content: [
      "三要素齐全：发生了什么、是否需要操作、下一步。",
      "标题写对象与事实：还没有实验记录、没有符合条件的结果。",
      "不写“空空如也”这类情绪化文案；不写“数据加载失败”（那是错误态）。",
    ],
    dos: [
      "区分无数据与筛选无结果，动作不同。",
      "给得出下一步时提供唯一动作按钮。",
      "行内小空态用 size=\"compact\"，只保留说明文字。",
    ],
    donts: [
      "不要用空状态代替错误提示。",
      "不要放多个动作按钮或教学长文。",
      "不要让空态与骨架屏交替闪烁。",
      "不要在表格单元格里放整版空状态（用 compact）。",
    ],
    related: ["result", "skeleton", "button", "table", "card"],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    chineseName: "骨架屏",
    category: "general",
    status: "stable",
    version: "0.9.0",
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
        code: `import { Skeleton } from "@/components/ui/skeleton";

{isLoading ? (
  <div className="space-y-3" aria-busy="true">
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-2.5 w-[70%]" />
      </div>
    </div>
    <Skeleton className="h-2.5 w-full" />
    <Skeleton className="h-2.5 w-full" />
    <Skeleton className="h-2.5 w-3/5" />
  </div>
) : (
  <ProjectSummary projectId="project-042" />
)}`,
        preview: "skeleton/basic",
      },
      {
        id: "variants",
        title: "变体示例",
        kind: "variant",
        description: "表格骨架保留表头与列结构；卡片骨架保留卡片框架，只替换内容区。",
        code: `import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

{/* 表格骨架：保留表头与列结构，只替换单元格内容 */}
<table aria-busy="true">
  <thead>
    <tr><th>任务</th><th>状态</th><th>用时</th></tr>
  </thead>
  <tbody>
    {[0, 1, 2, 3].map((row) => (
      <tr key={row}>
        <td><Skeleton className="h-2.5 w-4/5" /></td>
        <td><Skeleton className="h-2.5 w-[56%]" /></td>
        <td><Skeleton className="h-2.5 w-2/5" /></td>
      </tr>
    ))}
  </tbody>
</table>

{/* 卡片骨架：保留卡片框架 */}
<Card className="space-y-2 p-4" aria-busy="true">
  <Skeleton className="h-3 w-[45%]" />
  <Skeleton className="h-2.5 w-full" />
  <Skeleton className="h-2.5 w-full" />
  <Skeleton className="h-2.5 w-3/5" />
</Card>`,
        preview: "skeleton/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "加载完成后内容原位替换骨架：标题、统计、状态列位置不动，用户视线不需要重新定位。",
        code: `import { Skeleton } from "@/components/ui/skeleton";

{isLoading ? <RunTableSkeleton rows={4} /> : <RunTable runs={runs} />}
{/* RunTableSkeleton 与 RunTable 共用同一表头与列宽，单元格内放 <Skeleton className="h-2.5 w-4/5" /> */}`,
        fullCode: `import { Skeleton } from "@/components/ui/skeleton";

function RunTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <table aria-busy="true">
      <thead>
        <tr><th>任务</th><th>状态</th><th>用时</th></tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, row) => (
          <tr key={row}>
            <td><Skeleton className="h-2.5 w-4/5" /></td>
            <td><Skeleton className="h-2.5 w-[56%]" /></td>
            <td><Skeleton className="h-2.5 w-2/5" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RunList() {
  const { data, isLoading } = useRuns("project-042"); // synthetic: run-28003 等
  return isLoading ? <RunTableSkeleton rows={4} /> : <RunTable runs={data} />;
}`,
        preview: "skeleton/business",
      },
    ],
    props: [
      { name: "className", type: "string", required: true, description: "形状全靠 className：高度 h-2.5 / h-3，宽度 w-full / w-3/5，圆形 size-8 rounded-full；内置 animate-pulse 呼吸动效。" },
      { name: "...props", type: "HTMLAttributes<HTMLDivElement>", description: "其余原生 div 属性透传；占位条本身不写文字。" },
      { name: "加载切换", type: "组合", description: "无 loading/children：{isLoading ? 骨架 : 真实内容} 原位切换，骨架外层容器设 aria-busy=\"true\"。" },
      { name: "多行", type: "组合", description: "无 rows/variant：按真实内容重复 <Skeleton>，末行缩短（w-3/5）；表格骨架复用真实表头与列宽，单元格内放 Skeleton。" },
      { name: "头像位", type: "组合", description: "无 avatar：<Skeleton className=\"size-8 shrink-0 rounded-full\" />。" },
      { name: "关闭动效", type: "组合", description: "无 active：频繁局部刷新时加 className=\"animate-none\"。" },
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
    status: "stable",
    version: "0.9.0",
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
        code: `import { Result } from "@/components/ui/result";

<Result status="success" title="任务已提交" description="任务 ID：run-28003" />
<Result status="info" title="正在排队" description="前方还有 2 个任务" />
<Result status="warning" title="部分字段待复核" description="3 个字段需要人工确认" />
<Result status="danger" title="任务失败" description="输入文件缺失：electrolyte.csv" />`,
        preview: "result/basic",
      },
      {
        id: "variants",
        title: "页面级异常",
        kind: "variant",
        description: "not-found（404）与 forbidden（403）自带预置标题与说明，业务只补充所需权限与动作，不自由改写标题。",
        code: `import { Button } from "@/components/ui/button";
import { Result } from "@/components/ui/result";

<Result status="not-found" actions={<Button variant="secondary" size="sm">返回首页</Button>} />
<Result
  status="forbidden"
  description="需要项目 project-042 的查看权限，请联系项目管理员。"
  actions={<Button variant="secondary" size="sm">申请权限</Button>}
/>`,
        preview: "result/variants",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算任务后的结论页：回显任务 ID 与影响范围，给出追踪入口与返回动作。",
        code: `import { Button } from "@/components/ui/button";
import { Result } from "@/components/ui/result";
import { Num } from "@/components/ui/typography";

<Result
  status="success"
  title="计算任务已提交"
  description="任务 run-28003 已加入队列，将使用 示例项目（project-042）的额度。"
  actions={
    <>
      <Button size="sm">查看任务状态</Button>
      <Button variant="secondary" size="sm">返回任务列表</Button>
    </>
  }
>
  <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
    <dt className="text-muted-foreground">任务 ID</dt><dd className="m-0"><Num mono>run-28003</Num></dd>
    <dt className="text-muted-foreground">预计用时</dt><dd className="m-0"><Num>≤ 300</Num> 秒</dd>
  </dl>
</Result>`,
        preview: "result/business",
      },
    ],
    props: [
      { name: "status", type: '"success" | "warning" | "danger" | "info" | "forbidden" | "not-found"', required: true, description: "结论类型，决定图标与语义色；forbidden / not-found 带预置标题与说明。" },
      { name: "title", type: "ReactNode", description: "结论文案，一句话说明结果；forbidden / not-found 缺省为“无访问权限”/“页面不存在”。" },
      { name: "description", type: "ReactNode", description: "原因或影响范围；失败时写清原因，403 建议写明所需权限。" },
      { name: "icon", type: "ReactNode", description: "覆盖该状态的默认图标。" },
      { name: "actions", type: "ReactNode", description: "后续动作，最多两个 Button，主动作在前；窄屏纵向全宽。" },
      { name: "children", type: "ReactNode", description: "补充信息区（带底色的卡片），如任务 ID、预计用时、日志摘要。" },
      { name: "autoFocus", type: "boolean", default: "false", description: "挂载后把焦点移到标题，读屏器先朗读结论；整页结果时使用。" },
      { name: "className", type: "string", description: "追加样式，例如 py-4 收紧留白用于卡片内。" },
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
      { name: "permission-limited", note: "forbidden 状态说明所需权限与联系人入口，不只写「无权限」。" },
      { name: "mobile", note: "图标与文案居中，动作按钮纵向排列全宽。" },
      { name: "dark-mode", note: "语义色与图标使用令牌自动适配。" },
    ],
    interaction: [
      "整页结果传 autoFocus，出现后焦点移到标题，读屏器首先朗读结论；局部结果不抢焦点。",
      "动作最多两个：下一步（主）+ 返回/关闭（次）。",
      "失败结果必须给出可重试或人工接管的入口，不做死路页面。",
      "forbidden / not-found 使用预置标题与说明，业务只补充权限说明与动作。",
    ],
    keyboard: [
      "动作按钮按视觉顺序进入 Tab 序列。",
      "autoFocus 时焦点落在结果标题（tabindex=-1），Esc 不关闭结果页。",
    ],
    accessibility: [
      "图标 aria-hidden，结论由标题文本承载。",
      "自动设置 role=\"status\"（成功/提示/警告/403/404）或 role=\"alert\"（danger）向读屏器宣告。",
      "不只用颜色与图标表达结论，标题必须写清结果。",
    ],
    responsive: [
      "移动端动作按钮纵向全宽排列。",
      "标题与说明不截断，说明文字最大宽度 28rem 居中换行。",
    ],
    content: [
      "标题写结论：任务已提交、任务失败；说明写原因与影响范围。",
      "成功结论回显关键 ID（任务 run-28003），方便追踪。",
      "失败说明写清下一步：重试、修改输入或联系负责人。",
    ],
    dos: [
      "结论页回显任务 ID 与影响范围。",
      "失败给出重试或人工接管入口。",
      "403/404 使用 forbidden / not-found 预置状态。",
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
