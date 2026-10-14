import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { SegmentedList, SegmentedTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Beaker,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  FlaskConical,
  GripVertical,
  History,
  Home,
  LayoutGrid,
  List,
  Lock,
  MoreHorizontal,
  RefreshCw,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { PreviewFn } from "./types";

/* ---------- shared demo helpers (not exported) ---------- */

type StepStatus = "wait" | "process" | "finish" | "error";

const stepDotStyle: Record<StepStatus, CSSProperties> = {
  finish: { background: "var(--green)", color: "#fff", borderColor: "var(--green)" },
  process: { background: "var(--brand)", color: "#fff", borderColor: "var(--brand)" },
  error: { background: "var(--red)", color: "#fff", borderColor: "var(--red)" },
  wait: { background: "var(--surface-soft)", color: "var(--text-muted)", borderColor: "var(--line)" },
};

function StepDot({ status, index }: { status: StepStatus; index: number }) {
  return (
    <span
      style={{
        width: 24,
        height: 24,
        flex: "0 0 24px",
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        border: "1px solid",
        fontSize: 12,
        fontFamily: '"DM Mono", monospace',
        ...stepDotStyle[status],
      }}
    >
      {status === "finish" ? <Check size={13} /> : status === "error" ? <X size={13} /> : index + 1}
    </span>
  );
}

function StepItem({
  status,
  index,
  title,
  description,
  last,
}: {
  status: StepStatus;
  index: number;
  title: string;
  description?: string;
  last?: boolean;
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <StepDot status={status} index={index} />
        <div style={{ minWidth: 0, display: "grid", gap: 1 }}>
          <strong style={{ fontSize: 14, color: status === "wait" ? "var(--text-muted)" : "var(--text)", fontWeight: status === "process" ? 700 : 600 }}>{title}</strong>
          {description && <span style={{ fontSize: 12, color: status === "error" ? "var(--red)" : "var(--faint)" }}>{description}</span>}
        </div>
      </div>
      {!last && <div style={{ flex: 1, minWidth: 14, height: 1, background: "var(--line)" }} />}
    </>
  );
}

function PageButton({
  active,
  disabled,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  label?: string;
}) {
  return (
    <Button
      variant={active ? "default" : "secondary"}
      size="sm"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className="min-w-7 px-1.5 font-mono"
    >
      {children}
    </Button>
  );
}

/* ---------- Layout ---------- */

function LayoutBasic() {
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", height: 210, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "var(--surface)" }}>
        <div style={{ width: 132, flex: "0 0 132px", borderRight: "1px solid var(--line)", padding: 10, display: "grid", gap: 3, alignContent: "start" }}>
          {["项目概览", "数据集", "计算任务", "分析报告"].map((label, index) => (
            <div
              key={label}
              style={{
                padding: "5px 8px",
                borderRadius: 6,
                fontSize: 12,
                color: index === 2 ? "var(--brand)" : "var(--text-muted)",
                background: index === 2 ? "var(--brand-soft)" : "transparent",
                fontWeight: index === 2 ? 700 : 400,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 34, flex: "0 0 34px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 6, padding: "0 12px", fontSize: 12, color: "var(--faint)" }}>
            项目 <ChevronRight size={12} /> <strong style={{ color: "var(--text)" }}>示例项目</strong>
          </div>
          <div style={{ flex: 1, padding: 14, background: "var(--page)", display: "grid", alignContent: "center", justifyItems: "center" }}>
            <span className="demo-note">内容区 · 页面只替换这里</span>
          </div>
        </div>
      </div>
      <p className="demo-note">侧边导航 264px · 顶栏 60px 吸顶 · 内容区受 contentWidth 约束。</p>
    </div>
  );
}

function LayoutContentWidth() {
  const items = [
    { label: "narrow · 880px", note: "表单 / 文档", width: "46%" },
    { label: "wide · 1240px", note: "列表 / 工作台（默认）", width: "76%" },
    { label: "full · 全宽", note: "看板 / 图谱", width: "100%" },
  ];
  return (
    <div className="demo-stack" style={{ gap: 16 }}>
      {items.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12, color: "var(--text-muted)" }}>
            <span className="mono">{item.label}</span>
            <span>{item.note}</span>
          </div>
          <div style={{ width: item.width, height: 18, borderRadius: 5, background: "var(--brand-soft)", border: "1px solid var(--brand)" }} />
        </div>
      ))}
    </div>
  );
}

function LayoutBusiness() {
  return (
    <div style={{ display: "flex", height: 236, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ width: 138, flex: "0 0 138px", borderRight: "1px solid var(--line)", padding: 10, display: "grid", gap: 3, alignContent: "start" }}>
        {[
          { label: "项目概览", active: false },
          { label: "数据集", active: false },
          { label: "计算任务", active: true },
          { label: "分析报告", active: false },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "5px 8px",
              borderRadius: 6,
              fontSize: 12,
              color: item.active ? "var(--brand)" : "var(--text-muted)",
              background: item.active ? "var(--brand-soft)" : "transparent",
              fontWeight: item.active ? 700 : 400,
            }}
          >
            {item.label}
          </div>
        ))}
        <div style={{ padding: "5px 8px", borderRadius: 6, fontSize: 12, color: "var(--faint)", display: "flex", alignItems: "center", gap: 5, opacity: 0.7 }}>
          审计日志 <Lock size={11} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 34, flex: "0 0 34px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 6, padding: "0 12px", fontSize: 12, color: "var(--faint)" }}>
          项目 <ChevronRight size={12} /> <strong style={{ color: "var(--text)" }}>示例项目</strong>
        </div>
        <div style={{ flex: 1, padding: 14, background: "var(--page)", display: "grid", gap: 10, alignContent: "start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>计算任务</strong>
            <Button size="sm">新建任务</Button>
          </div>
          <div className="demo-grid-3">
            {[
              { label: "运行中", value: "3" },
              { label: "排队中", value: "12" },
              { label: "本周完成", value: "21" },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--surface)" }}>
                <div style={{ fontSize: 12, color: "var(--faint)" }}>{stat.label}</div>
                <strong style={{ fontSize: 17.0 }}>{stat.value}</strong>
              </div>
            ))}
          </div>
          <span className="demo-note">项目 project-042 的工作台骨架，无权限入口禁用不隐藏。</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stack ---------- */

function StackBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-stack" style={{ maxWidth: 420 }}>
        {[
          { id: "run-28003", title: "电导率优化 · 第 3 轮" },
          { id: "run-28002", title: "电导率优化 · 第 2 轮" },
        ].map((run) => (
          <div className="card-demo" key={run.id}>
            <h4 className="mono">{run.id}</h4>
            <p>{run.title}</p>
          </div>
        ))}
      </div>
      <p className="demo-note">垂直堆叠，间距只来自 gap={12}，卡片自身不写 margin。</p>
    </div>
  );
}

function StackVariants() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button>提交任务</Button>
        <Button variant="secondary">保存草稿</Button>
        <Button variant="ghost">取消</Button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)" }}>
        <strong style={{ fontSize: 14 }}>第 3 轮优化</strong>
        <Badge tone="success" dot>已完成</Badge>
      </div>
      <p className="demo-note">horizontal + gap 8 给按钮组；justify=&quot;space-between&quot; 给标题与状态。</p>
    </div>
  );
}

function StackBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 470 }}>
      <div>
        <strong style={{ fontSize: 14 }}>数据校验</strong>
        <p className="demo-note" style={{ marginTop: 3 }}>对数据集 ds-118 的 3 个必填字段做完整性检查</p>
      </div>
      <div className="status-line status-warning">
        <AlertTriangle size={16} />
        <div>
          <strong>2 条记录缺少测试温度</strong>
          <span>第 18、42 行 · 修正后可继续导入</span>
        </div>
      </div>
      <div className="demo-row">
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
      <div className="demo-grid-3">
        {[
          { label: "运行中任务", value: "3" },
          { label: "本周完成", value: "21" },
          { label: "失败待处理", value: "1" },
        ].map((stat) => (
          <div className="card-demo" key={stat.label}>
            <p>{stat.label}</p>
            <strong style={{ display: "block", marginTop: 6, fontSize: 22.0, letterSpacing: "-0.03em" }}>{stat.value}</strong>
          </div>
        ))}
      </div>
      <p className="demo-note">12 列栅格 · 每张卡片 span 4 · 同排高度自动对齐。</p>
    </div>
  );
}

function GridResponsive() {
  const rows = [
    { label: "lg ≥1100px · span 3", cells: 4 },
    { label: "md ≥760px · span 6", cells: 2 },
    { label: "base <760px · span 12", cells: 1 },
  ];
  return (
    <div className="demo-stack" style={{ gap: 14 }}>
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mono" style={{ marginBottom: 5, fontSize: 12, color: "var(--text-muted)" }}>{row.label}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: row.cells }, (_, index) => (
              <div key={index} style={{ flex: 1, height: 22, borderRadius: 6, background: "var(--brand-soft)", border: "1px solid var(--brand)" }} />
            ))}
          </div>
        </div>
      ))}
      <p className="demo-note">同一组卡片按断点换行：4 → 2 → 1，卡片最小宽度 240px。</p>
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
    <div className="demo-grid-3">
      {projects.map((project) => (
        <div className="card-demo" key={project.id}>
          <h4>{project.name}</h4>
          <p className="mono">{project.id} · 任务 {project.runs}</p>
          <Badge tone={project.tone} dot className="mt-2">{project.status}</Badge>
        </div>
      ))}
    </div>
  );
}

/* ---------- Splitter ---------- */

function SplitterBasic() {
  const [size, setSize] = useState(36);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="demo-stack">
      <div ref={containerRef} style={{ display: "flex", height: 168, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ width: `${size}%`, padding: 10, background: "var(--surface)", display: "grid", gap: 6, alignContent: "start" }}>
          {["run-28003", "run-28002", "run-28001"].map((id, index) => (
            <div
              key={id}
              className="mono"
              style={{
                padding: "5px 7px",
                borderRadius: 6,
                fontSize: 12,
                color: index === 0 ? "var(--brand)" : "var(--text-muted)",
                background: index === 0 ? "var(--brand-soft)" : "var(--surface-soft)",
              }}
            >
              {id}
            </div>
          ))}
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={Math.round(size)}
          title="拖动调整比例"
          style={{ width: 6, flex: "0 0 6px", cursor: "col-resize", background: "var(--line)" }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.background = "var(--brand)";
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const next = ((event.clientX - rect.left) / rect.width) * 100;
            setSize(Math.min(62, Math.max(24, next)));
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            event.currentTarget.style.background = "var(--line)";
          }}
        />
        <div style={{ flex: 1, minWidth: 0, padding: 10, background: "var(--page)", display: "grid", alignContent: "center", justifyItems: "center" }}>
          <span className="demo-note">详情面板 · 当前左栏 {Math.round(size)}%</span>
        </div>
      </div>
      <p className="demo-note">拖动中间分隔条实时调整；比例限制在 24%–62%（对应 min / max）。</p>
    </div>
  );
}

function SplitterLimits() {
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", height: 96, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ width: 240, flex: "0 0 240px", background: "var(--surface)", padding: 12, display: "grid", alignContent: "center", gap: 2 }}>
          <strong style={{ fontSize: 14 }}>列表面板</strong>
          <span className="demo-note">min 240px · 不能再窄</span>
        </div>
        <div style={{ width: 6, flex: "0 0 6px", background: "var(--line)", display: "grid", placeItems: "center" }}>
          <GripVertical size={12} style={{ color: "var(--faint)" }} />
        </div>
        <div style={{ flex: 1, background: "var(--page)", padding: 12, display: "grid", alignContent: "center", gap: 2 }}>
          <strong style={{ fontSize: 14 }}>详情面板 · 弹性</strong>
          <span className="demo-note">左栏 max 560px，双击把手恢复默认 280px</span>
        </div>
      </div>
      <p className="demo-note">collapsible 时点击把手上的箭头可把一侧面板收起为 0。</p>
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
      <div style={{ display: "flex", height: 176, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ width: "38%", padding: 8, background: "var(--surface)", display: "grid", gap: 4, alignContent: "start" }}>
          {Object.keys(logs).map((id) => (
            <button
              key={id}
              onClick={() => setRunId(id)}
              className="mono"
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: runId === id ? "var(--brand)" : "transparent",
                fontSize: 12,
                textAlign: "left",
                cursor: "pointer",
                color: runId === id ? "var(--brand)" : "var(--text-muted)",
                background: runId === id ? "var(--brand-soft)" : "var(--surface-soft)",
              }}
            >
              {id}
            </button>
          ))}
        </div>
        <div style={{ width: 6, flex: "0 0 6px", background: "var(--line)" }} />
        <div style={{ flex: 1, minWidth: 0, padding: 10, background: "var(--page)", display: "grid", gap: 5, alignContent: "start" }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--faint)" }}>日志 · {runId} · follow</span>
          {logs[runId].map((line) => (
            <span key={line} className="mono" style={{ fontSize: 12, color: "var(--text)" }}>{line}</span>
          ))}
        </div>
      </div>
      <p className="demo-note">主从联动：左侧选任务，右侧日志即时切换；拖拽比例按用户记忆。</p>
    </div>
  );
}

/* ---------- PageHeader ---------- */

function PageHeaderBasic() {
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20.0, letterSpacing: "-0.02em" }}>计算任务</h3>
          <p className="demo-note" style={{ marginTop: 6 }}>提交、追踪并管理项目下的所有计算任务。</p>
        </div>
        <div className="demo-row">
          <Button variant="secondary">导出记录</Button>
          <Button>新建任务</Button>
        </div>
      </div>
      <p className="demo-note">页面级主动作最多一个 primary，其余降级为 secondary / ghost。</p>
    </div>
  );
}

function PageHeaderWithBreadcrumb() {
  return (
    <div className="demo-stack">
      <div className="breadcrumb">
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <strong>示例项目</strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 20.0, letterSpacing: "-0.02em" }}>示例项目</h3>
          <Badge tone="success" dot>进行中</Badge>
        </div>
        <div className="demo-row">
          <Button variant="secondary">项目设置</Button>
          <Button>新建任务</Button>
        </div>
      </div>
    </div>
  );
}

function PageHeaderBusiness() {
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 20.0, letterSpacing: "-0.02em" }}>电导率优化 · 第 3 轮</h3>
            <Badge tone="agent" dot>等待确认</Badge>
          </div>
          <p className="demo-note" style={{ marginTop: 6 }}>Agent 推荐 6 个候选配方，确认后将创建 1 个 CPU 任务。</p>
        </div>
        <div className="demo-row">
          <Button variant="ghost">查看历史</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                更多操作 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>导出候选配方</DropdownMenuItem>
              <DropdownMenuItem>复制轮次配置</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>确认并执行</Button>
        </div>
      </div>
      <p className="demo-note">影响范围写在说明里；低频动作收入“更多操作”，primary 只有“确认并执行”。</p>
    </div>
  );
}

/* ---------- Breadcrumb ---------- */

function BreadcrumbBasic() {
  return (
    <div className="demo-stack">
      <div className="breadcrumb" style={{ fontSize: 14 }}>
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>示例项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <strong>任务详情</strong>
      </div>
      <p className="demo-note">中间层级为链接，当前页加粗纯文本、不可点击。</p>
    </div>
  );
}

function BreadcrumbCollapsed() {
  const [expanded, setExpanded] = useState(false);
  const middle = [
    { title: "示例项目" },
    { title: "数据集" },
    { title: "ds-118" },
  ];
  return (
    <div className="demo-stack">
      <div className="breadcrumb" style={{ fontSize: 14 }}>
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        {expanded ? (
          middle.map((item) => (
            <span key={item.title} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>{item.title}</a>
              <ChevronRight size={13} className="breadcrumb-separator" />
            </span>
          ))
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(true)} title="展开完整路径" aria-label="展开完整路径" className="h-6 px-1.5 text-muted-foreground">
              <MoreHorizontal />
            </Button>
            <ChevronRight size={13} className="breadcrumb-separator" />
          </>
        )}
        <strong>字段映射</strong>
      </div>
      <p className="demo-note">{expanded ? "已展开完整路径，可直接点击任意层级。" : "层级超过 maxItems 时折叠中间层，点击 … 展开。"}</p>
    </div>
  );
}

function BreadcrumbBusiness() {
  return (
    <div className="demo-stack">
      <div className="breadcrumb" style={{ fontSize: 14 }}>
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>示例项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>计算任务</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <strong className="mono" style={{ fontSize: 14 }}>run-28003</strong>
      </div>
      <div className="breadcrumb" style={{ fontSize: 14 }}>
        <a style={{ color: "var(--text-muted)", cursor: "pointer" }}>项目</a>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--faint)" }}>
          内部项目 <Lock size={11} />
        </span>
        <ChevronRight size={13} className="breadcrumb-separator" />
        <strong className="mono" style={{ fontSize: 14 }}>run-27995</strong>
      </div>
      <p className="demo-note">第二行演示 permission-limited：无权限的上级渲染为纯文本 + 锁图标，不提供链接。</p>
    </div>
  );
}

/* ---------- Menu ---------- */

function MenuBasic() {
  const [selected, setSelected] = useState("runs");
  const items = [
    { key: "overview", label: "项目概览", icon: <Home size={15} /> },
    { key: "datasets", label: "数据集", icon: <Database size={15} /> },
    { key: "runs", label: "计算任务", icon: <FlaskConical size={15} /> },
    { key: "reports", label: "分析报告", icon: <FileText size={15} /> },
  ];
  return (
    <div className="demo-stack">
      <div style={{ width: 220, display: "grid", gap: 2 }}>
        {items.map((item) => (
          <button
            key={item.key}
            className={`nav-item${selected === item.key ? " nav-item-active" : ""}`}
            aria-current={selected === item.key ? "page" : undefined}
            onClick={() => setSelected(item.key)}
          >
            {item.icon}
            <span className="nav-item-label">{item.label}</span>
          </button>
        ))}
      </div>
      <p className="demo-note">Menu 切换整个页面（URL 变化）；同页内容切换用 Tabs。</p>
    </div>
  );
}

function MenuGroups() {
  return (
    <div className="demo-stack">
      <div style={{ width: 220 }}>
        <p className="nav-group-label">工作台</p>
        <div style={{ display: "grid", gap: 2, marginBottom: 12 }}>
          <button className="nav-item nav-item-active" aria-current="page">
            <FlaskConical size={15} />
            <span className="nav-item-label">计算任务</span>
          </button>
          <button className="nav-item">
            <History size={15} />
            <span className="nav-item-label">实验记录</span>
            <span className="nav-status nav-status-beta">β</span>
          </button>
        </div>
        <p className="nav-group-label">数据资产</p>
        <div style={{ display: "grid", gap: 2 }}>
          <button className="nav-item">
            <Database size={15} />
            <span className="nav-item-label">数据集</span>
            <Badge className="ml-auto">12</Badge>
          </button>
          <button className="nav-item">
            <Beaker size={15} />
            <span className="nav-item-label">试剂库存</span>
          </button>
        </div>
      </div>
      <p className="demo-note">超过 7 个入口时按业务分组；徽章只放数量或状态标记。</p>
    </div>
  );
}

function MenuBusiness() {
  const [selected, setSelected] = useState("runs");
  return (
    <div className="demo-stack">
      <div style={{ width: 220, display: "grid", gap: 2 }}>
        <button className={`nav-item${selected === "overview" ? " nav-item-active" : ""}`} onClick={() => setSelected("overview")}>
          <Home size={15} />
          <span className="nav-item-label">项目概览</span>
        </button>
        <button className={`nav-item${selected === "runs" ? " nav-item-active" : ""}`} aria-current={selected === "runs" ? "page" : undefined} onClick={() => setSelected("runs")}>
          <FlaskConical size={15} />
          <span className="nav-item-label">计算任务</span>
          <Badge tone="primary" className="ml-auto">3</Badge>
        </button>
        <button className={`nav-item${selected === "members" ? " nav-item-active" : ""}`} onClick={() => setSelected("members")}>
          <FileText size={15} />
          <span className="nav-item-label">成员与权限</span>
        </button>
        <button className="nav-item" disabled title="需要项目管理员权限" style={{ opacity: 0.5, cursor: "not-allowed" }}>
          <Lock size={15} />
          <span className="nav-item-label">审计日志</span>
        </button>
      </div>
      <p className="demo-note">“审计日志”无权限：禁用 + 锁图标 + Tooltip 说明，不隐藏入口。</p>
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
  const items: { title: string; status: StepStatus }[] = [
    { title: "上传文件", status: "finish" },
    { title: "校验数据", status: "process" },
    { title: "确认导入", status: "wait" },
  ];
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {items.map((item, index) => (
          <StepItem key={item.title} status={item.status} index={index} title={item.title} last={index === items.length - 1} />
        ))}
      </div>
      <p className="demo-note">current=1：之前为完成态，当前为进行态，之后为等待态。</p>
    </div>
  );
}

function StepsStates() {
  const legend: { status: StepStatus; label: string }[] = [
    { status: "finish", label: "finish 完成" },
    { status: "process", label: "process 进行" },
    { status: "error", label: "error 失败" },
    { status: "wait", label: "wait 等待" },
  ];
  const items: { title: string; status: StepStatus; description?: string }[] = [
    { title: "解析文件", status: "finish" },
    { title: "映射字段", status: "finish" },
    { title: "校验数据", status: "error", description: "2 条记录缺少测试温度" },
    { title: "写入数据集", status: "wait" },
  ];
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {legend.map((item, index) => (
          <span key={item.status} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
            <StepDot status={item.status} index={index} />
            {item.label}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {items.map((item, index) => (
          <StepItem key={item.title} status={item.status} index={index} title={item.title} description={item.description} last={index === items.length - 1} />
        ))}
      </div>
      <p className="demo-note">失败步骤红色叉号 + 具体原因，流程停在该步。</p>
    </div>
  );
}

function StepsBusiness() {
  const items: { title: string; status: StepStatus; description?: string }[] = [
    { title: "上传文件", status: "finish", description: "electrolyte-batch-7.csv" },
    { title: "校验数据", status: "error", description: "第 18、42 行缺少测试温度" },
    { title: "确认导入", status: "wait", description: "目标数据集 ds-118" },
  ];
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {items.map((item, index) => (
          <StepItem key={item.title} status={item.status} index={index} title={item.title} description={item.description} last={index === items.length - 1} />
        ))}
      </div>
      <div className="status-line status-danger">
        <AlertTriangle size={16} />
        <div>
          <strong>校验未通过：2 条记录缺少必填字段</strong>
          <span>修正后可从当前步骤继续，已上传的文件保留。</span>
        </div>
        <button className="inline-action">下载错误报告</button>
      </div>
      <div className="demo-row">
        <Button size="sm">修正后重试</Button>
        <Button variant="ghost" size="sm">返回上一步</Button>
      </div>
    </div>
  );
}

/* ---------- Pagination ---------- */

function PaginationBasic() {
  const [page, setPage] = useState(3);
  const totalPages = 7;
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ gap: 6 }}>
        <PageButton label="上一页" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
          <ChevronLeft size={14} />
        </PageButton>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <PageButton key={item} active={page === item} onClick={() => setPage(item)}>
            {item}
          </PageButton>
        ))}
        <PageButton label="下一页" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>
          <ChevronRight size={14} />
        </PageButton>
      </div>
      <p className="demo-note">共 128 条 · 每页 20 条 · 第 {page}/{totalPages} 页；首尾页时对应方向按钮禁用。</p>
    </div>
  );
}

function PaginationFull() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const total = 128;
  const totalPages = Math.ceil(total / pageSize);
  const windowPages = () => {
    const pages: number[] = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    for (let item = start; item <= Math.min(totalPages, start + 4); item += 1) pages.push(item);
    return pages;
  };
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ gap: 6, flexWrap: "wrap" }}>
        <span className="demo-note" style={{ marginRight: "auto" }}>共 {total} 条</span>
        <PageButton label="上一页" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
          <ChevronLeft size={14} />
        </PageButton>
        {windowPages().map((item) => (
          <PageButton key={item} active={page === item} onClick={() => setPage(item)}>
            {item}
          </PageButton>
        ))}
        <PageButton label="下一页" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>
          <ChevronRight size={14} />
        </PageButton>
        <select
          className="field-control"
          style={{ width: "auto", height: 30, fontSize: 12 }}
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 条/页</option>
          <option value={20}>20 条/页</option>
          <option value={50}>50 条/页</option>
        </select>
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
      <div className="status-line" style={{ minHeight: 0 }}>
        <div>
          <strong>筛选条件：状态 = 运行中 · 项目 = project-042</strong>
          <span>翻页保留筛选与排序；翻页请求期间页码锁定。</span>
        </div>
        {loading && <span className="spinner-dark spinner" aria-hidden="true" style={{ marginLeft: "auto" }} />}
      </div>
      <div className="demo-row" style={{ gap: 6 }}>
        <PageButton label="上一页" disabled={loading || page === 1} onClick={() => go(page - 1)}>
          <ChevronLeft size={14} />
        </PageButton>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <PageButton key={item} active={page === item} disabled={loading} onClick={() => go(item)}>
            {item}
          </PageButton>
        ))}
        <PageButton label="下一页" disabled={loading || page === totalPages} onClick={() => go(page + 1)}>
          <ChevronRight size={14} />
        </PageButton>
      </div>
      <p className="demo-note">共 128 个任务 · 每页 20 条{loading ? " · 正在加载…" : ""}</p>
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
