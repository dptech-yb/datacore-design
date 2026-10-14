import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavMenu, NavMenuGroup, NavMenuItem } from "@/components/ui/nav-menu";
import { PageHeader } from "@/components/ui/page-header";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Steps } from "@/components/ui/steps";
import type { StepItem } from "@/components/ui/steps";
import { SegmentedList, SegmentedTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Beaker,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  FlaskConical,
  History,
  Home,
  LayoutGrid,
  List,
  Loader2,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { PreviewFn } from "./types";

/* ---------- shared demo helpers (not exported) ---------- */

/** 预览里的链接不真正跳转（文档站使用 hash 路由）。 */
const stop = (event: MouseEvent<HTMLElement>) => event.preventDefault();

/** 页码窗口：首尾常驻，当前页前后各 1 页，其余折叠为省略号。 */
function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];
  for (let item = 1; item <= totalPages; item += 1) {
    const edge = item === 1 || item === totalPages;
    // 省略号只替代 ≥2 个页码：只隐藏 1 页时直接显示该页
    const fillsGap = (item === 2 && page <= 4) || (item === totalPages - 1 && page >= totalPages - 3);
    if (edge || fillsGap || Math.abs(item - page) <= 1) items.push(item);
    else if (items[items.length - 1] !== "ellipsis") items.push("ellipsis");
  }
  return items;
}

function PageNumbers({
  page,
  totalPages,
  disabled,
  onChange,
}: {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onChange: (page: number) => void;
}) {
  const go = (next: number) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!disabled && next >= 1 && next <= totalPages && next !== page) onChange(next);
  };
  const lockClass = "pointer-events-none opacity-50";
  return (
    <>
      <PaginationItem>
        <PaginationLink
          href={`?page=${page - 1}`}
          aria-label="上一页"
          aria-disabled={disabled || page === 1 || undefined}
          tabIndex={disabled || page === 1 ? -1 : undefined}
          className={cn("no-underline", (disabled || page === 1) && lockClass)}
          onClick={go(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </PaginationLink>
      </PaginationItem>
      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis className="size-8" />
          </PaginationItem>
        ) : (
          <PaginationItem key={item}>
            <PaginationLink
              href={`?page=${item}`}
              isActive={item === page}
              aria-disabled={disabled || undefined}
              className={cn("font-mono no-underline", disabled && item !== page && lockClass)}
              onClick={go(item)}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ),
      )}
      <PaginationItem>
        <PaginationLink
          href={`?page=${page + 1}`}
          aria-label="下一页"
          aria-disabled={disabled || page === totalPages || undefined}
          tabIndex={disabled || page === totalPages ? -1 : undefined}
          className={cn("no-underline", (disabled || page === totalPages) && lockClass)}
          onClick={go(page + 1)}
        >
          <ChevronRight className="size-4" />
        </PaginationLink>
      </PaginationItem>
    </>
  );
}

/* ---------- Layout ---------- */

function ShellSider({ activeKey = "runs", withLocked }: { activeKey?: string; withLocked?: boolean }) {
  return (
    <aside className="w-40 shrink-0 border-r bg-card p-2">
      <NavMenu aria-label="项目导航">
        <NavMenuGroup>
          <NavMenuItem href="/overview" onClick={stop} active={activeKey === "overview"} className="h-7 text-sm">
            项目概览
          </NavMenuItem>
          <NavMenuItem href="/datasets" onClick={stop} active={activeKey === "datasets"} className="h-7 text-sm">
            数据集
          </NavMenuItem>
          <NavMenuItem href="/runs" onClick={stop} active={activeKey === "runs"} className="h-7 text-sm">
            计算任务
          </NavMenuItem>
          <NavMenuItem href="/reports" onClick={stop} active={activeKey === "reports"} className="h-7 text-sm">
            分析报告
          </NavMenuItem>
          {withLocked && (
            <NavMenuItem disabled disabledReason="需要项目管理员权限" badge={<Lock className="!size-3" aria-hidden />} className="h-7 text-sm">
              审计日志
            </NavMenuItem>
          )}
        </NavMenuGroup>
      </NavMenu>
    </aside>
  );
}

function ShellBreadcrumb() {
  return (
    <Breadcrumb aria-label="面包屑">
      <BreadcrumbList className="m-0 list-none p-0 text-xs sm:gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
            项目
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">示例项目</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function LayoutBasic() {
  return (
    <div className="demo-stack">
      <div className="flex h-[220px] overflow-hidden rounded-xl border bg-card">
        <ShellSider />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-10 shrink-0 items-center border-b px-3">
            <ShellBreadcrumb />
          </header>
          <main className="grid flex-1 place-items-center bg-canvas p-4">
            <span className="text-xs text-muted-foreground">内容区 · 页面只替换这里</span>
          </main>
        </div>
      </div>
      <p className="demo-note">示意按比例缩小：真实骨架侧栏 w-[264px]、顶栏 h-[60px] sticky、内容区 max-w-[1240px] mx-auto。</p>
    </div>
  );
}

function LayoutContentWidth() {
  const items = [
    { label: "max-w-[880px]", note: "表单 / 文档", width: "w-[46%]" },
    { label: "max-w-[1240px]", note: "列表 / 工作台（默认）", width: "w-[76%]" },
    { label: "w-full", note: "看板 / 图谱", width: "w-full" },
  ];
  return (
    <div className="demo-stack" style={{ gap: 16 }}>
      {items.map((item) => (
        <div key={item.label} className="grid gap-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-mono">{item.label}</span>
            <span>{item.note}</span>
          </div>
          <div className={`mx-auto h-[18px] rounded-md border border-primary bg-primary-soft ${item.width}`} />
        </div>
      ))}
    </div>
  );
}

function LayoutBusiness() {
  return (
    <div className="flex h-[248px] overflow-hidden rounded-xl border bg-card">
      <ShellSider withLocked />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center border-b px-3">
          <ShellBreadcrumb />
        </header>
        <main className="flex-1 overflow-auto bg-canvas p-4">
          <div className="mx-auto grid max-w-[1240px] gap-3">
            <PageHeader titleAs="h2" title="计算任务" actions={<Button size="sm">新建任务</Button>} />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "运行中", value: "3" },
                { label: "排队中", value: "12" },
                { label: "本周完成", value: "21" },
              ].map((stat) => (
                <Card key={stat.label} className="px-3 py-2.5">
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <strong className="text-lg font-semibold text-foreground">{stat.value}</strong>
                </Card>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">项目 project-042 的工作台骨架，无权限入口禁用不隐藏。</span>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Stack ---------- */

function StackBasic() {
  return (
    <div className="demo-stack">
      <div className="flex max-w-[420px] flex-col gap-3">
        {[
          { id: "run-28003", title: "电导率优化 · 第 3 轮" },
          { id: "run-28002", title: "电导率优化 · 第 2 轮" },
        ].map((run) => (
          <Card key={run.id} className="px-4 py-3">
            <div className="font-mono text-sm font-semibold text-foreground">{run.id}</div>
            <div className="text-sm text-muted-foreground">{run.title}</div>
          </Card>
        ))}
      </div>
      <p className="demo-note">flex flex-col gap-3：间距只来自 gap，卡片自身不写 margin。</p>
    </div>
  );
}

function StackVariants() {
  return (
    <div className="demo-stack">
      <div className="flex flex-wrap items-center gap-2">
        <Button>提交任务</Button>
        <Button variant="secondary">保存草稿</Button>
        <Button variant="ghost">取消</Button>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5">
        <strong className="text-base font-semibold text-foreground">第 3 轮优化</strong>
        <Badge tone="success" dot>
          已完成
        </Badge>
      </div>
      <p className="demo-note">按钮组 flex flex-wrap items-center gap-2；标题与状态 flex items-center justify-between。</p>
    </div>
  );
}

function StackBusiness() {
  return (
    <div className="flex max-w-[470px] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <strong className="text-base font-semibold text-foreground">数据校验</strong>
        <p className="m-0 text-sm text-muted-foreground">对数据集 ds-118 的 3 个必填字段做完整性检查</p>
      </div>
      <Alert variant="warning">
        <AlertTriangle className="size-4" />
        <AlertTitle className="m-0 text-sm font-semibold">2 条记录缺少测试温度</AlertTitle>
        <AlertDescription className="text-muted-foreground">第 18、42 行 · 修正后可继续导入</AlertDescription>
      </Alert>
      <div className="flex flex-wrap items-center gap-2">
        <Button>继续导入</Button>
        <Button variant="ghost">返回修改</Button>
      </div>
    </div>
  );
}

/* ---------- Grid ---------- */

function GridBasic() {
  return (
    <div className="demo-stack">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "运行中任务", value: "3" },
          { label: "本周完成", value: "21" },
          { label: "失败待处理", value: "1" },
        ].map((stat) => (
          <Card key={stat.label} className="px-4 py-3">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</div>
          </Card>
        ))}
      </div>
      <p className="demo-note">grid grid-cols-3 gap-3 · 同排卡片高度自动对齐。</p>
    </div>
  );
}

function GridResponsive() {
  const rows = [
    { label: "lg:grid-cols-4 · ≥1024px", cells: 4 },
    { label: "md:grid-cols-2 · ≥768px", cells: 2 },
    { label: "grid-cols-1 · <768px", cells: 1 },
  ];
  return (
    <div className="demo-stack" style={{ gap: 14 }}>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1.5">
          <div className="font-mono text-xs text-muted-foreground">{row.label}</div>
          <div className="flex gap-2">
            {Array.from({ length: row.cells }, (_, index) => (
              <div key={index} className="h-[22px] flex-1 rounded-md border border-primary bg-primary-soft" />
            ))}
          </div>
        </div>
      ))}
      <p className="demo-note">按视口断点减列：4 → 2 → 1。需要随容器宽度变化时用 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]。</p>
    </div>
  );
}

function GridBusiness() {
  const projects = [
    { name: "示例项目", id: "project-042", runs: 28, status: "进行中", tone: "primary" as const },
    { name: "电解液筛选", id: "project-051", runs: 12, status: "进行中", tone: "primary" as const },
    { name: "正极材料库", id: "project-063", runs: 45, status: "已归档", tone: "neutral" as const },
  ];
  return (
    <ul role="list" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 p-0">
      {projects.map((project) => (
        <li key={project.id}>
          <Card className="h-full">
            <CardHeader className="pb-1">
              <CardTitle className="m-0 text-base">{project.name}</CardTitle>
              <Badge tone={project.tone} dot>
                {project.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="m-0 font-mono">
                {project.id} · 任务 {project.runs}
              </CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Splitter ---------- */

function SplitterBasic() {
  const [sizes, setSizes] = useState<number[]>([36, 64]);
  return (
    <div className="demo-stack">
      <ResizablePanelGroup direction="horizontal" onLayout={setSizes} className="!h-[168px] rounded-xl border">
        <ResizablePanel defaultSize={36} minSize={24} maxSize={62}>
          <div className="grid h-full content-start gap-1.5 bg-card p-2.5">
            {["run-28003", "run-28002", "run-28001"].map((id, index) => (
              <div
                key={id}
                className={`rounded-md px-2 py-1 font-mono text-xs ${index === 0 ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground"}`}
              >
                {id}
              </div>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="调整列表宽度" />
        <ResizablePanel defaultSize={64}>
          <div className="grid h-full place-items-center bg-canvas p-2.5">
            <span className="text-xs text-muted-foreground">详情面板 · 当前左栏 {Math.round(sizes[0] ?? 36)}%</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <p className="demo-note">拖动或聚焦把手后按 ←/→ 调整；比例限制在 24%–62%（minSize / maxSize，单位为百分比）。</p>
    </div>
  );
}

function SplitterLimits() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="demo-stack">
      <ResizablePanelGroup direction="horizontal" className="!h-[110px] rounded-xl border">
        <ResizablePanel
          defaultSize={34}
          minSize={24}
          maxSize={50}
          collapsible
          collapsedSize={0}
          onCollapse={() => setCollapsed(true)}
          onExpand={() => setCollapsed(false)}
        >
          <div className="grid h-full content-center gap-0.5 bg-card p-3">
            <strong className="text-sm font-semibold text-foreground">列表面板</strong>
            <span className="text-xs text-muted-foreground">minSize 24 · maxSize 50</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="调整列表宽度" />
        <ResizablePanel defaultSize={66} minSize={40}>
          <div className="grid h-full content-center gap-0.5 bg-canvas p-3">
            <strong className="text-sm font-semibold text-foreground">详情面板 · 弹性</strong>
            <span className="text-xs text-muted-foreground">{collapsed ? "列表已收起，向右拖动或聚焦把手按 Enter 展开" : "继续向左拖过最小值会收起列表"}</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <p className="demo-note">collapsible + collapsedSize={"{0}"}：拖过 minSize 的一半即收起；聚焦把手按 Enter 切换收起 / 展开。</p>
    </div>
  );
}

function SplitterBusiness() {
  const [runId, setRunId] = useState("run-28003");
  const logs: Record<string, string[]> = {
    "run-28003": ["10:02:11 任务已创建 · project-042", "10:02:14 分配节点 cpu-node-3", "10:02:31 输入校验通过 · ds-118", "10:04:02 迭代 120/400 · loss 0.041"],
    "run-28002": ["09:11:03 任务已创建 · project-042", "09:11:06 分配节点 cpu-node-1", "09:13:40 迭代 400/400 完成", "09:13:41 电导率均值 12.4 mS/cm"],
    "run-28001": ["08:40:55 任务已创建 · project-042", "08:41:20 输入校验失败：缺少测试温度", "08:41:20 任务终止 · 可修正后重试"],
  };
  return (
    <div className="demo-stack">
      <ResizablePanelGroup direction="horizontal" autoSaveId="demo-run-log-splitter" className="!h-[176px] rounded-xl border">
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="grid h-full content-start gap-1 bg-card p-2" role="listbox" aria-label="任务">
            {Object.keys(logs).map((id) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={runId === id}
                onClick={() => setRunId(id)}
                className={`cursor-pointer rounded-md border px-2 py-1.5 text-left font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  runId === id ? "border-primary bg-primary-soft text-primary" : "border-transparent bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="调整任务列表宽度" />
        <ResizablePanel defaultSize={62} minSize={40}>
          <div className="grid h-full content-start gap-1 overflow-auto bg-canvas p-2.5 font-mono text-xs">
            <span className="text-muted-foreground">日志 · {runId} · follow</span>
            {logs[runId].map((line) => (
              <span key={line} className="text-foreground">
                {line}
              </span>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <p className="demo-note">主从联动：左侧选任务，右侧日志即时切换；autoSaveId 让拖拽比例按用户记忆。</p>
    </div>
  );
}

/* ---------- PageHeader ---------- */

function PageHeaderBasic() {
  return (
    <div className="demo-stack">
      <PageHeader
        title="计算任务"
        description="提交、追踪并管理项目下的所有计算任务。"
        actions={
          <>
            <Button variant="secondary">导出记录</Button>
            <Button>新建任务</Button>
          </>
        }
      />
      <p className="demo-note">页面级主动作最多一个 primary，其余降级为 secondary / ghost。</p>
    </div>
  );
}

function PageHeaderWithBreadcrumb() {
  return (
    <PageHeader
      breadcrumb={
        <Breadcrumb aria-label="面包屑">
          <BreadcrumbList className="m-0 list-none p-0">
            <BreadcrumbItem>
              <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
                项目
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>示例项目</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      title="示例项目"
      status={
        <Badge tone="success" dot>
          进行中
        </Badge>
      }
      actions={
        <>
          <Button variant="secondary">项目设置</Button>
          <Button>新建任务</Button>
        </>
      }
    />
  );
}

function PageHeaderBusiness() {
  const [note, setNote] = useState("");
  return (
    <div className="demo-stack">
      <PageHeader
        backHref="/projects/project-042/rounds"
        onBack={(event) => {
          event.preventDefault();
          setNote("返回轮次列表（演示）");
        }}
        backLabel="返回轮次列表"
        title="电导率优化 · 第 3 轮"
        description="Agent 推荐 6 个候选配方，确认后将创建 1 个 CPU 任务。"
        status={
          <Badge tone="agent" dot>
            等待确认
          </Badge>
        }
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
                <DropdownMenuItem onSelect={() => setNote("已选择导出候选配方（演示）")}>导出候选配方</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setNote("已选择复制轮次配置（演示）")}>复制轮次配置</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setNote("已确认并执行（演示，不会创建任务）")}>确认并执行</Button>
          </>
        }
      />
      <p className="demo-note" role="status">
        {note || "影响范围写在说明里；低频动作收入“更多操作”，primary 只有“确认并执行”。"}
      </p>
    </div>
  );
}

/* ---------- Breadcrumb ---------- */

function BreadcrumbBasic() {
  return (
    <div className="demo-stack">
      <Breadcrumb aria-label="面包屑">
        <BreadcrumbList className="m-0 list-none p-0">
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
              项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects/project-042" onClick={stop}>
              示例项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">任务详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="demo-note">中间层级为链接，当前页 BreadcrumbPage 为纯文本（aria-current=&quot;page&quot;）、不可点击。</p>
    </div>
  );
}

function BreadcrumbCollapsed() {
  const [picked, setPicked] = useState("");
  const hidden = ["示例项目", "数据集", "ds-118"];
  return (
    <div className="demo-stack">
      <Breadcrumb aria-label="面包屑">
        <BreadcrumbList className="m-0 list-none p-0">
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
              项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="展开隐藏的层级"
                className="flex cursor-pointer items-center rounded-sm border-0 bg-transparent p-0 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BreadcrumbEllipsis className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hidden.map((title) => (
                  <DropdownMenuItem key={title} onSelect={() => setPicked(title)}>
                    {title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">字段映射</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="demo-note" role="status">
        {picked ? `已选择跳转到“${picked}”（演示）` : "中间层折叠为 …，点击后在下拉菜单中选择任意层级。"}
      </p>
    </div>
  );
}

function BreadcrumbBusiness() {
  return (
    <div className="demo-stack">
      <Breadcrumb aria-label="面包屑">
        <BreadcrumbList className="m-0 list-none p-0">
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
              项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects/project-042" onClick={stop}>
              示例项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects/project-042/runs" onClick={stop}>
              计算任务
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono font-medium">run-28003</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb aria-label="面包屑（权限受限）">
        <BreadcrumbList className="m-0 list-none p-0">
          <BreadcrumbItem>
            <BreadcrumbLink className="no-underline" href="/projects" onClick={stop}>
              项目
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem title="无权访问该项目">
            内部项目 <Lock className="size-3" aria-label="无权限" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono font-medium">run-27995</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="demo-note">第二行演示 permission-limited：无权限的上级渲染为纯文本 + 锁图标，不提供链接。</p>
    </div>
  );
}

/* ---------- Menu ---------- */

function MenuBasic() {
  const [selected, setSelected] = useState("runs");
  const items = [
    { key: "overview", label: "项目概览", icon: <Home /> },
    { key: "datasets", label: "数据集", icon: <Database /> },
    { key: "runs", label: "计算任务", icon: <FlaskConical /> },
    { key: "reports", label: "分析报告", icon: <FileText /> },
  ];
  return (
    <div className="demo-stack">
      <NavMenu aria-label="项目导航" className="w-[220px]">
        <NavMenuGroup>
          {items.map((item) => (
            <NavMenuItem
              key={item.key}
              href={`/${item.key}`}
              icon={item.icon}
              active={selected === item.key}
              onClick={(event) => {
                event.preventDefault();
                setSelected(item.key);
              }}
            >
              {item.label}
            </NavMenuItem>
          ))}
        </NavMenuGroup>
      </NavMenu>
      <p className="demo-note">NavMenu 切换整个页面（URL 变化）；同页内容切换用 Tabs。↑/↓ 在菜单项间移动焦点。</p>
    </div>
  );
}

function MenuGroups() {
  const [selected, setSelected] = useState("runs");
  const pick = (key: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSelected(key);
  };
  return (
    <div className="demo-stack">
      <NavMenu aria-label="平台导航" className="w-[220px]">
        <NavMenuGroup label="工作台" collapsible>
          <NavMenuItem href="/runs" icon={<FlaskConical />} active={selected === "runs"} onClick={pick("runs")}>
            计算任务
          </NavMenuItem>
          <NavMenuItem href="/experiments" icon={<History />} active={selected === "experiments"} onClick={pick("experiments")} badge={<Badge tone="agent">beta</Badge>}>
            实验记录
          </NavMenuItem>
        </NavMenuGroup>
        <NavMenuGroup label="数据资产" collapsible>
          <NavMenuItem href="/datasets" icon={<Database />} active={selected === "datasets"} onClick={pick("datasets")} badge={<Badge>12</Badge>}>
            数据集
          </NavMenuItem>
          <NavMenuItem href="/reagents" icon={<Beaker />} active={selected === "reagents"} onClick={pick("reagents")}>
            试剂库存
          </NavMenuItem>
        </NavMenuGroup>
      </NavMenu>
      <p className="demo-note">超过 7 个入口时按业务分组；点击分组标题可折叠；徽章只放数量或状态标记。</p>
    </div>
  );
}

function MenuBusiness() {
  const [selected, setSelected] = useState("runs");
  const pick = (key: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSelected(key);
  };
  return (
    <div className="demo-stack">
      <NavMenu aria-label="项目导航" className="w-[220px]">
        <NavMenuGroup>
          <NavMenuItem href="/overview" icon={<Home />} active={selected === "overview"} onClick={pick("overview")}>
            项目概览
          </NavMenuItem>
          <NavMenuItem href="/runs" icon={<FlaskConical />} active={selected === "runs"} onClick={pick("runs")} badge={<Badge>3</Badge>}>
            计算任务
          </NavMenuItem>
          <NavMenuItem href="/members" icon={<Users />} active={selected === "members"} onClick={pick("members")}>
            成员与权限
          </NavMenuItem>
          <NavMenuItem icon={<FileText />} disabled disabledReason="需要项目管理员权限" badge={<Lock className="!size-3.5" aria-hidden />}>
            审计日志
          </NavMenuItem>
        </NavMenuGroup>
      </NavMenu>
      <p className="demo-note">“审计日志”无权限：aria-disabled + 锁图标 + 悬停 title 说明原因，仍可聚焦，不隐藏入口。</p>
    </div>
  );
}

/* ---------- Tabs ---------- */

function TabsBasic() {
  const [active, setActive] = useState("overview");
  const tabs = [
    { key: "overview", label: "概览" },
    { key: "params", label: "参数" },
    { key: "logs", label: "日志" },
    { key: "artifacts", label: "产物" },
  ];
  return (
    <div className="demo-stack">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList aria-label="任务详情">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="demo-note">当前面板：{tabs.find((tab) => tab.key === active)?.label} · 切换不丢失面板内已输入的状态。</p>
    </div>
  );
}

function TabsBadges() {
  const [active, setActive] = useState("running");
  const tabs = [
    { key: "all", label: "全部", badge: null as number | null },
    { key: "running", label: "运行中", badge: 3 },
    { key: "queued", label: "排队中", badge: 12 },
    { key: "done", label: "已完成", badge: 128 },
  ];
  return (
    <div className="demo-stack">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList aria-label="任务状态">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
              {tab.badge !== null && <Badge tone={active === tab.key ? "primary" : "neutral"}>{tab.badge}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="demo-note">计数放徽章里，不写“已完成（128）”；为 0 时不显示。</p>
    </div>
  );
}

function TabsBusiness() {
  const [active, setActive] = useState("overview");
  return (
    <Tabs value={active} onValueChange={setActive} className="demo-stack">
      <TabsList aria-label="run-28003 详情">
        <TabsTrigger value="overview">运行概览</TabsTrigger>
        <TabsTrigger value="logs">
          实时日志
          <span className="size-1.5 rounded-full bg-success" aria-label="运行中" />
        </TabsTrigger>
        <TabsTrigger value="curves">电导率曲线</TabsTrigger>
        <TabsTrigger value="audit" disabled title="仅项目管理员可见" className="disabled:cursor-not-allowed disabled:opacity-50">
          审计记录
          <Lock className="!size-3" aria-hidden />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-0">
        <div className="flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary-soft px-3 py-2.5 text-sm">
          <RefreshCw className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <div className="grid gap-0.5">
            <strong className="text-foreground">run-28003 运行中 · 迭代 120/400</strong>
            <span className="text-muted-foreground">项目 project-042 · 已运行 38 分钟 · 预计剩余 96 分钟</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="logs" className="mt-0">
        <div className="grid gap-1 font-mono text-xs text-muted-foreground">
          {["10:02:31 输入校验通过 · ds-118", "10:04:02 迭代 120/400 · loss 0.041", "10:04:02 当前电导率均值 12.1 mS/cm"].map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="curves" className="mt-0">
        <p className="demo-note">电导率曲线面板（略）· 面板切换不重新请求已加载数据。</p>
      </TabsContent>
    </Tabs>
  );
}


/* ---------- Steps ---------- */

function StepsBasic() {
  return (
    <div className="demo-stack">
      <Steps current={1} items={[{ title: "上传文件" }, { title: "校验数据" }, { title: "确认导入" }]} className="max-w-[560px]" />
      <p className="demo-note">current=1：之前为完成态，当前为进行态，之后为等待态。</p>
    </div>
  );
}

function StepsStates() {
  const items: StepItem[] = [
    { title: "解析文件", status: "finish" },
    { title: "映射字段", status: "finish" },
    { title: "校验数据", status: "error", description: "2 条记录缺少测试温度" },
    { title: "写入数据集", status: "wait" },
  ];
  return (
    <div className="demo-stack" style={{ gap: 20 }}>
      <Steps current={2} items={items} />
      <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
        <Steps current={2} items={items} orientation="vertical" size="sm" aria-label="纵向小尺寸" />
        <p className="demo-note self-center">
          orientation=&quot;vertical&quot; + size=&quot;sm&quot;：适合侧栏或抽屉。完成绿色对勾、进行品牌色、失败红色叉号、等待灰色描边。
        </p>
      </div>
    </div>
  );
}

function StepsBusiness() {
  const [current, setCurrent] = useState(1);
  const [notice, setNotice] = useState("");
  const items: StepItem[] = [
    { title: "上传文件", description: "electrolyte-batch-7.csv" },
    { title: "校验数据", description: current === 1 ? "第 18、42 行缺少测试温度" : "等待重新校验" },
    { title: "确认导入", description: "目标数据集 ds-118" },
  ];
  return (
    <div className="demo-stack">
      <Steps
        current={current}
        status={current === 1 ? "error" : "process"}
        items={items}
        onStepClick={(index) => {
          setCurrent(index);
          setNotice(`已回到“${items[index].title as string}”，已上传的文件保留（演示）`);
        }}
      />
      {current === 1 && (
        <Alert variant="danger">
          <XCircle className="size-4" />
          <AlertTitle className="m-0 text-sm font-semibold">校验未通过：2 条记录缺少必填字段</AlertTitle>
          <AlertDescription className="text-muted-foreground">修正后可从当前步骤继续，已上传的文件保留。</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => { setCurrent(1); setNotice("已重新提交校验（演示）"); }}>
          修正后重试
        </Button>
        <Button size="sm" variant="secondary">
          下载错误报告
        </Button>
      </div>
      <p className="demo-note" role="status">{notice || "已完成的“上传文件”可点击回退。"}</p>
    </div>
  );
}

/* ---------- Pagination ---------- */

function PaginationBasic() {
  const [page, setPage] = useState(3);
  const totalPages = 7;
  return (
    <div className="demo-stack">
      <Pagination aria-label="分页" className="mx-0 justify-start">
        <PaginationContent className="m-0 list-none p-0">
          <PageNumbers page={page} totalPages={totalPages} onChange={setPage} />
        </PaginationContent>
      </Pagination>
      <p className="demo-note">共 128 条 · 每页 20 条 · 第 {page}/{totalPages} 页；首尾页时对应方向按钮禁用。</p>
    </div>
  );
}

function PaginationFull() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("20");
  const total = 128;
  const totalPages = Math.ceil(total / Number(pageSize));
  return (
    <div className="demo-stack">
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-auto text-sm text-muted-foreground">共 {total} 条</span>
        <Pagination aria-label="分页" className="mx-0 w-auto">
          <PaginationContent className="m-0 list-none p-0">
            <PageNumbers page={page} totalPages={totalPages} onChange={setPage} />
          </PaginationContent>
        </Pagination>
        <Select
          value={pageSize}
          onValueChange={(value) => {
            setPageSize(value);
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
      </div>
      <p className="demo-note">改变每页条数后回到第一页；当前共 {totalPages} 页。</p>
    </div>
  );
}

function PaginationBusiness() {
  const [page, setPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const totalPages = 7;
  const go = (next: number) => {
    setLoading(true);
    setPage(next);
    window.setTimeout(() => setLoading(false), 700);
  };
  return (
    <div className="demo-stack">
      <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm">
        <div className="grid gap-0.5">
          <strong className="font-semibold text-foreground">筛选条件：状态 = 运行中 · 项目 = project-042</strong>
          <span className="text-muted-foreground">翻页保留筛选与排序；翻页请求期间页码锁定。</span>
        </div>
        {loading && <Loader2 className="ml-auto size-4 shrink-0 animate-spin text-primary" aria-label="加载中" />}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-auto text-sm text-muted-foreground">共 128 个任务</span>
        <Pagination aria-label="任务列表分页" aria-busy={loading} className="mx-0 w-auto">
          <PaginationContent className="m-0 list-none p-0">
            <PageNumbers page={page} totalPages={totalPages} disabled={loading} onChange={go} />
          </PaginationContent>
        </Pagination>
      </div>
      <p className="demo-note" role="status">每页 20 条 · 第 {page}/{totalPages} 页{loading ? " · 正在加载…" : ""}</p>
    </div>
  );
}

/* ---------- Dropdown ---------- */

function DropdownBasic() {
  const [lastAction, setLastAction] = useState("");
  return (
    <div className="demo-stack">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              更多操作 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {["查看详情", "复制任务 ID", "重新运行"].map((label) => (
              <DropdownMenuItem key={label} onSelect={() => setLastAction(label)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="demo-note" role="status">{lastAction ? `已选择：${lastAction}（演示）` : "方向键选择，Enter 确认，Esc 或点击外部关闭。"}</p>
    </div>
  );
}

const dangerItemClass = "text-danger focus:bg-danger-soft focus:text-danger";

function DropdownDanger() {
  const [lastAction, setLastAction] = useState("");
  return (
    <div className="demo-stack">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="更多操作">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onSelect={() => setLastAction("查看详情")}>查看详情</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLastAction("分享链接")}>分享链接</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={dangerItemClass} onSelect={() => setLastAction("撤销任务")}>
              撤销任务
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="demo-note" role="status">{lastAction ? `已选择：${lastAction}（演示）` : "危险项放在底部、用分割线隔开，文字用危险色。"}</p>
    </div>
  );
}

function DropdownBusiness() {
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState("");
  return (
    <div className="demo-stack">
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              更多操作 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onSelect={() => setResult("已选择查看 run-28003 详情（演示）")}>查看详情</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult("已选择下载日志（演示）")}>下载日志</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult("已选择以此为模板新建（演示）")}>以此为模板新建</DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Lock aria-hidden />
              审计记录
              <span className="ml-auto text-xs text-muted-foreground">需要项目管理员权限</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={dangerItemClass} onSelect={() => setConfirming(true)}>
              撤销任务 run-28003
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>撤销任务 run-28003？</AlertDialogTitle>
            <AlertDialogDescription>撤销后不可恢复，已排队资源立即释放。本示例不会执行实际任务。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "danger" })} onClick={() => setResult("任务已撤销（演示）")}>
              确认撤销
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="demo-note" role="status">{result || "无权限项注明原因；危险动作先确认再执行。"}</p>
    </div>
  );
}

/* ---------- Segmented ---------- */

function SegmentedBasic() {
  const [view, setView] = useState("table");
  return (
    <div className="demo-stack">
      <Tabs value={view} onValueChange={setView}>
        <SegmentedList aria-label="视图">
          <SegmentedTrigger value="table" className="gap-1.5">
            <List className="size-3.5" aria-hidden />
            表格
          </SegmentedTrigger>
          <SegmentedTrigger value="card" className="gap-1.5">
            <LayoutGrid className="size-3.5" aria-hidden />
            卡片
          </SegmentedTrigger>
        </SegmentedList>
      </Tabs>
      <p className="demo-note">当前视图：{view === "table" ? "表格" : "卡片"} · 选中即生效，无需提交。</p>
    </div>
  );
}

function SegmentedSizes() {
  const [range, setRange] = useState("7d");
  const [filter, setFilter] = useState("all");
  return (
    <div className="demo-stack">
      <div className="flex flex-wrap items-center gap-2.5">
        <Tabs value={range} onValueChange={setRange}>
          <SegmentedList aria-label="时间范围" className="h-7">
            {[
              { label: "24h", value: "24h" },
              { label: "7 天", value: "7d" },
              { label: "30 天", value: "30d" },
            ].map((option) => (
              <SegmentedTrigger key={option.value} value={option.value} className="h-6 px-2.5 text-xs">
                {option.label}
              </SegmentedTrigger>
            ))}
          </SegmentedList>
        </Tabs>
        <span className="demo-note">sm · 工具条与卡片头部</span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Tabs value={filter} onValueChange={setFilter}>
          <SegmentedList aria-label="任务状态">
            {[
              { label: "全部", value: "all" },
              { label: "运行中", value: "running" },
              { label: "已完成", value: "done" },
            ].map((option) => (
              <SegmentedTrigger key={option.value} value={option.value}>
                {option.label}
              </SegmentedTrigger>
            ))}
          </SegmentedList>
        </Tabs>
        <span className="demo-note">md · 默认尺寸</span>
      </div>
    </div>
  );
}

function SegmentedBusiness() {
  const [range, setRange] = useState("7d");
  const stats: Record<string, string> = {
    "24h": "近 24 小时平均电导率 11.8 mS/cm · 样本 142",
    "7d": "近 7 天平均电导率 12.4 mS/cm · 样本 1 036",
  };
  return (
    <div className="demo-stack">
      <Tabs value={range} onValueChange={setRange}>
        <SegmentedList aria-label="指标时间范围">
          <SegmentedTrigger value="24h">24 小时</SegmentedTrigger>
          <SegmentedTrigger value="7d">7 天</SegmentedTrigger>
          <SegmentedTrigger value="30d" disabled title="任务运行未满 30 天" className="disabled:cursor-not-allowed disabled:opacity-50">
            30 天
          </SegmentedTrigger>
        </SegmentedList>
      </Tabs>
      <div className="grid gap-0.5 rounded-lg border bg-card px-3 py-2.5 text-sm">
        <strong className="font-mono text-foreground">run-28003</strong>
        <span className="text-muted-foreground">{stats[range]}</span>
      </div>
      <p className="demo-note">数据不足的选项禁用并说明原因；切换后结果区域立即更新。</p>
    </div>
  );
}

export const layoutNavPreviews: Record<string, PreviewFn> = {
  "layout/basic": LayoutBasic,
  "layout/content-width": LayoutContentWidth,
  "layout/business": LayoutBusiness,
  "stack/basic": StackBasic,
  "stack/variants": StackVariants,
  "stack/business": StackBusiness,
  "grid/basic": GridBasic,
  "grid/responsive": GridResponsive,
  "grid/business": GridBusiness,
  "splitter/basic": SplitterBasic,
  "splitter/limits": SplitterLimits,
  "splitter/business": SplitterBusiness,
  "page-header/basic": PageHeaderBasic,
  "page-header/with-breadcrumb": PageHeaderWithBreadcrumb,
  "page-header/business": PageHeaderBusiness,
  "breadcrumb/basic": BreadcrumbBasic,
  "breadcrumb/collapsed": BreadcrumbCollapsed,
  "breadcrumb/business": BreadcrumbBusiness,
  "menu/basic": MenuBasic,
  "menu/groups": MenuGroups,
  "menu/business": MenuBusiness,
  "tabs/basic": TabsBasic,
  "tabs/badges": TabsBadges,
  "tabs/business": TabsBusiness,
  "steps/basic": StepsBasic,
  "steps/states": StepsStates,
  "steps/business": StepsBusiness,
  "pagination/basic": PaginationBasic,
  "pagination/full": PaginationFull,
  "pagination/business": PaginationBusiness,
  "dropdown/basic": DropdownBasic,
  "dropdown/danger": DropdownDanger,
  "dropdown/business": DropdownBusiness,
  "segmented/basic": SegmentedBasic,
  "segmented/sizes": SegmentedSizes,
  "segmented/business": SegmentedBusiness,
};
