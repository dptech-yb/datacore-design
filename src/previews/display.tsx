import { Modal as AccessibleModal } from "../components/Modal";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  FileText,
  FolderOpen,
  Info,
  Loader2,
  Lock,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PreviewFn } from "./types";

/* ---------- shared demo helpers (inline styles only, theme-token based) ---------- */

function DescItem({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className={mono ? "mono" : undefined} style={mono ? undefined : { minWidth: 0 }}>{children}</span>
    </div>
  );
}

const treeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 6px",
  borderRadius: 6,
  fontSize: 14,
  color: "var(--text)",
  background: "none",
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
};

const fileRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  border: "1px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  background: "var(--surface)",
};

/* ---------- Table ---------- */

/** 数字列：右对齐 + 等宽数字。 */
const num = "text-right tabular-nums";

function RunName({ name, id }: { name: string; id: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{name}</span>
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
    </div>
  );
}

function TableBasic() {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">示例项目（project-042）· 最近计算任务</caption>
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
            <TableCell><RunName name="电导率计算" id="run-28003" /></TableCell>
            <TableCell className="font-mono">ds-118</TableCell>
            <TableCell className={num}>286.4</TableCell>
            <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><RunName name="结构优化" id="run-28002" /></TableCell>
            <TableCell className="font-mono">ds-121</TableCell>
            <TableCell className={num}>412.7</TableCell>
            <TableCell><Badge tone="danger" dot>失败</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><RunName name="电导率计算" id="run-28001" /></TableCell>
            <TableCell className="font-mono">ds-118</TableCell>
            <TableCell className={num}>291.0</TableCell>
            <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function TableScroll() {
  const sticky = "sticky left-0 z-[1] bg-card";
  return (
    <div className="demo-stack">
      <div className="rounded-lg border bg-card">
        <Table className="min-w-[880px] border-collapse">
          <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">
            数据集 ds-118 · 全部字段（表格最小宽度 880px，窄屏横向滚动）
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
              <TableCell className={sticky}><RunName name="电导率计算" id="run-28003" /></TableCell>
              <TableCell className="font-mono">ds-118</TableCell>
              <TableCell>PBE0</TableCell>
              <TableCell className={num}>520</TableCell>
              <TableCell className={num}>286.4</TableCell>
              <TableCell className={num}>12.40</TableCell>
              <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={sticky}><RunName name="结构优化" id="run-28002" /></TableCell>
              <TableCell className="font-mono">ds-121</TableCell>
              <TableCell>PBE</TableCell>
              <TableCell className={num}>450</TableCell>
              <TableCell className={num}>412.7</TableCell>
              <TableCell className={num}>17.90</TableCell>
              <TableCell><Badge tone="danger" dot>失败</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="demo-note">横向滚动时首列冻结（sticky left-0），列宽不压缩、文字不换行。</p>
    </div>
  );
}

function StatesTable({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">{label}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">任务</TableHead>
            <TableHead scope="col">数据集</TableHead>
            <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
            <TableHead scope="col">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

function TableStates() {
  return (
    <div className="demo-stack">
      <StatesTable label="loading：骨架行替换数据行，表头保留">
        {["w-32", "w-24", "w-28"].map((w) => (
          <TableRow key={w} className="hover:bg-transparent">
            <TableCell><Skeleton className={cn("h-3.5", w)} /></TableCell>
            <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
            <TableCell><Skeleton className="ml-auto h-3.5 w-12" /></TableCell>
            <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
          </TableRow>
        ))}
      </StatesTable>
      <StatesTable label="empty：说明是无数据还是被筛选清空，并给出下一步">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">当前筛选条件下没有任务</span>
              <Button variant="link" size="sm" className="h-auto px-0">清除筛选</Button>
            </div>
          </TableCell>
        </TableRow>
      </StatesTable>
      <StatesTable label="error：保留筛选上下文，提供重试">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-24">
            <div className="flex items-center justify-center gap-2 text-danger">
              <XCircle className="size-4" />
              <span className="font-medium">任务列表加载失败</span>
              <Button variant="secondary" size="sm" className="ml-2">重试</Button>
            </div>
          </TableCell>
        </TableRow>
      </StatesTable>
    </div>
  );
}

const businessRuns = [
  { id: "run-28003", name: "电导率计算", dataset: "ds-118", seconds: "286.4", cost: "12.40", status: "已完成", tone: "success", action: "查看日志" },
  { id: "run-28002", name: "结构优化", dataset: "ds-121", seconds: "412.7", cost: "17.90", status: "失败", tone: "danger", action: "查看日志" },
  { id: "run-27998", name: "能带计算", dataset: "ds-118", seconds: "1,024.5", cost: "43.20", status: "排队中", tone: "neutral", action: "取消排队" },
] as const;

function TableBusiness() {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">示例项目（project-042）· 计算任务列表</caption>
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
          {businessRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell><RunName name={run.name} id={run.id} /></TableCell>
              <TableCell className="font-mono">{run.dataset}</TableCell>
              <TableCell className={num}>{run.seconds}</TableCell>
              <TableCell className={num}>{run.cost}</TableCell>
              <TableCell><Badge tone={run.tone} dot>{run.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm">{run.action}</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------- Descriptions ---------- */

function DescriptionsBasic() {
  return (
    <div className="card-demo" style={{ maxWidth: 520 }}>
      <h4>任务详情</h4>
      <div style={{ marginTop: 8 }}>
        <DescItem label="任务 ID" mono>run-28003</DescItem>
        <DescItem label="所属项目">示例项目（project-042）</DescItem>
        <DescItem label="状态">
          <Badge tone="success" dot>已完成</Badge>
        </DescItem>
        <DescItem label="耗时" mono>286.4 秒</DescItem>
      </div>
    </div>
  );
}

function DescriptionsLayout() {
  const items = [
    { label: "数据集 ID", value: "ds-118", mono: true },
    { label: "版本", value: "v3 · 2026-09-18 更新" },
    { label: "数据量", value: "1,000 行 · 12 字段", mono: true },
    { label: "创建方式", value: "UniLab 导入" },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-grid-2" style={{ maxWidth: 560 }}>
        {items.map((item) => (
          <div key={item.label} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", background: "var(--surface)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{item.label}</div>
            <div className={item.mono ? "mono" : undefined} style={{ marginTop: 2, fontSize: 14 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <p className="demo-note">layout=&quot;vertical&quot; + column=&#123;2&#125; + bordered：标签在上、值在下，带边框单元格。</p>
    </div>
  );
}

function DescriptionsBusiness() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="card-demo" style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h4>数据集 ds-118</h4>
        <Button
          variant="link" size="sm" className="h-auto px-0"
          onClick={() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "已复制 ID" : "复制 ID"}
        </Button>
      </div>
      <div style={{ marginTop: 8 }}>
        <DescItem label="数据集 ID" mono>ds-118</DescItem>
        <DescItem label="所属项目">示例项目（project-042）</DescItem>
        <DescItem label="版本">v3 · 2026-09-18 更新</DescItem>
        <DescItem label="数据量" mono>1,000 行 · 12 字段</DescItem>
        <DescItem label="质量状态">
          <Badge tone="warning" dot>3 行缺少密度字段</Badge>
        </DescItem>
      </div>
    </div>
  );
}

/* ---------- Statistic ---------- */

function StatBlock({ title, value, suffix, extra }: { title: string; value: string; suffix?: string; extra?: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", background: "var(--surface)", display: "grid", gap: 4 }}>
      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{title}</span>
      <span style={{ fontSize: 24.0, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {value}
        {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", marginLeft: 4 }}>{suffix}</span>}
      </span>
      {extra}
    </div>
  );
}

function StatisticBasic() {
  return (
    <div className="demo-grid-3">
      <StatBlock title="本周计算任务" value="128" suffix="个" />
      <StatBlock title="平均成功率" value="86.4" suffix="%" />
      <StatBlock title="本周费用" value="¥1,280.40" />
    </div>
  );
}

function StatisticTrend() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-2">
        <StatBlock
          title="平均耗时"
          value="286.4"
          suffix="秒"
          extra={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--green)", fontSize: 12 }}>
              <TrendingDown size={14} />
              -12.3% · 较上周
            </span>
          }
        />
        <StatBlock
          title="失败任务"
          value="6"
          suffix="个"
          extra={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--red)", fontSize: 12 }}>
              <TrendingUp size={14} />
              +2 · 较上周
            </span>
          }
        />
      </div>
      <p className="demo-note">趋势用箭头 + 文字 + 对比口径表达，不只靠红绿颜色。</p>
    </div>
  );
}

function StatisticBusiness() {
  return (
    <div className="demo-stack">
      <div className="card-demo">
        <h4>示例项目（project-042）· 近 7 天概览</h4>
        <div className="demo-grid-3" style={{ marginTop: 12 }}>
          <StatBlock title="计算任务" value="128" suffix="个" />
          <StatBlock title="成功率" value="86.4" suffix="%" />
          <StatBlock title="费用" value="¥1,280.40" />
        </div>
      </div>
      <p className="demo-note">统计周期 2026-09-15 – 2026-09-21 · 点击统计卡跳转到携带筛选条件的任务列表。</p>
    </div>
  );
}

/* ---------- Timeline ---------- */

function TimelineNode({
  time,
  title,
  desc,
  tone = "default",
  last,
}: {
  time: string;
  title: string;
  desc?: ReactNode;
  tone?: "default" | "success" | "error" | "processing";
  last?: boolean;
}) {
  const dot =
    tone === "success" ? "var(--green)" : tone === "error" ? "var(--red)" : tone === "processing" ? "var(--brand)" : "var(--line-strong)";
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 12, flex: "0 0 auto" }}>
        {tone === "processing" ? (
          <span className="spinner spinner-dark" style={{ width: 10, height: 10, marginTop: 4 }} aria-hidden="true" />
        ) : (
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: dot, marginTop: 4, flex: "0 0 auto" }} />
        )}
        {!last && <span style={{ width: 1, flex: 1, background: "var(--line)", marginTop: 2 }} />}
      </span>
      <div style={{ paddingBottom: last ? 0 : 14, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 14, flexWrap: "wrap" }}>
          <strong>{title}</strong>
          <span className="mono" style={{ color: "var(--faint)" }}>
            {time}
          </span>
        </div>
        {desc && (
          <p className="demo-note" style={{ marginTop: 2 }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

function TimelineBasic() {
  return (
    <div style={{ maxWidth: 460 }}>
      <TimelineNode time="09:12" title="任务创建" desc="run-28003 已提交到队列" />
      <TimelineNode time="09:14" title="开始执行" desc="分配到计算节点 node-07" />
      <TimelineNode time="09:19" title="执行完成" desc="耗时 286.4 秒" last />
    </div>
  );
}

function TimelineStatus() {
  return (
    <div style={{ maxWidth: 460 }}>
      <TimelineNode time="09:12" title="任务创建" tone="success" />
      <TimelineNode
        time="09:13"
        title="参数校验失败"
        tone="error"
        desc={
          <>
            K 点网格与截断能冲突 · <Button variant="link" size="sm" className="h-auto px-0">查看日志</Button>
          </>
        }
      />
      <TimelineNode time="09:15" title="修正参数并重新提交" tone="success" />
      <TimelineNode time="09:16" title="重新校验中" tone="processing" last />
    </div>
  );
}

function TimelineBusiness() {
  return (
    <div className="demo-stack">
      <div style={{ maxWidth: 460 }}>
        <TimelineNode time="09:12" title="任务创建" desc="run-28003 · 示例项目（project-042）" />
        <TimelineNode time="09:14" title="开始执行" desc="数据集 ds-118 · 方法 PBE0" />
        <TimelineNode time="09:19" title="计算完成" tone="success" desc="耗时 286.4 秒 · 查看日志" />
        <TimelineNode time="现在" title="结果回传中…" tone="processing" last />
      </div>
      <p className="demo-note">pending 节点表达“未完待续”，进行中的节点实时更新。</p>
    </div>
  );
}

/* ---------- Tree ---------- */

function TreeBasic() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ maxWidth: 380, fontSize: 14 }}>
      <button style={treeRowStyle} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? <ChevronDown size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />}
        <FolderOpen size={14} style={{ color: "var(--brand)" }} />
        示例项目（project-042）
      </button>
      {open && (
        <>
          <div style={{ ...treeRowStyle, paddingLeft: 30, cursor: "default" }}>
            <Database size={14} style={{ color: "var(--text-muted)" }} />
            数据集 ds-118
            <span className="mono" style={{ color: "var(--faint)" }}>1,000 行</span>
          </div>
          <div style={{ ...treeRowStyle, paddingLeft: 30, cursor: "default" }}>
            <Database size={14} style={{ color: "var(--text-muted)" }} />
            数据集 ds-121
            <span className="mono" style={{ color: "var(--faint)" }}>320 行</span>
          </div>
        </>
      )}
    </div>
  );
}

function TreeSelectable() {
  const [checked, setChecked] = useState({ "ds-118": true, "ds-121": false });
  const all = checked["ds-118"] && checked["ds-121"];
  const some = checked["ds-118"] || checked["ds-121"];
  return (
    <div className="demo-stack" style={{ maxWidth: 380, fontSize: 14 }}>
      <label style={{ ...treeRowStyle, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={all}
          ref={(el) => {
            if (el) el.indeterminate = !all && some;
          }}
          onChange={() => setChecked({ "ds-118": !all, "ds-121": !all })}
          style={{ accentColor: "var(--brand)" }}
        />
        <FolderOpen size={14} style={{ color: "var(--brand)" }} />
        示例项目（project-042）
      </label>
      {(["ds-118", "ds-121"] as const).map((key) => (
        <label key={key} style={{ ...treeRowStyle, paddingLeft: 30, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={checked[key]}
            onChange={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
            style={{ accentColor: "var(--brand)" }}
          />
          <Database size={14} style={{ color: "var(--text-muted)" }} />
          数据集 {key}
        </label>
      ))}
      <p className="demo-note">父子勾选联动：部分子级选中时父级显示半选态。</p>
    </div>
  );
}

function TreeBusiness() {
  const [selected, setSelected] = useState("ds-118");
  const rows = [
    { key: "ds-118", label: "数据集 ds-118", meta: "1,000 行", locked: false },
    { key: "ds-121", label: "数据集 ds-121", meta: "320 行", locked: false },
    { key: "ds-130", label: "数据集 ds-130", meta: "无权限", locked: true },
  ];
  return (
    <div style={{ maxWidth: 400, fontSize: 14 }}>
      <div style={{ ...treeRowStyle, cursor: "default" }}>
        <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
        <FolderOpen size={14} style={{ color: "var(--brand)" }} />
        示例项目（project-042）
      </div>
      {rows.map((row) => (
        <button
          key={row.key}
          style={{
            ...treeRowStyle,
            paddingLeft: 30,
            background: selected === row.key ? "var(--brand-soft)" : "none",
            color: row.locked ? "var(--faint)" : selected === row.key ? "var(--brand)" : "var(--text)",
            fontWeight: selected === row.key ? 600 : 400,
          }}
          onClick={() => !row.locked && setSelected(row.key)}
          disabled={row.locked}
        >
          {row.locked ? <Lock size={14} /> : <Database size={14} style={{ color: "var(--text-muted)" }} />}
          {row.label}
          <span className="mono" style={{ color: "var(--faint)", marginLeft: "auto" }}>{row.meta}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Collapse ---------- */

const collapsePanelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "11px 14px",
  background: "var(--surface)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--text)",
  textAlign: "left",
};

function CollapseBasic() {
  const [openKey, setOpenKey] = useState<string | null>("params");
  const panels = [
    { key: "params", title: "计算参数", body: "交换关联泛函 PBE0 · 截断能 520 eV · K 点 4×4×4" },
    { key: "advanced", title: "高级设置", body: "最大迭代步数 200 · 收敛阈值 1e-6" },
  ];
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", maxWidth: 520 }}>
      {panels.map((panel, index) => (
        <div key={panel.key} style={{ borderTop: index === 0 ? "none" : "1px solid var(--line)" }}>
          <button style={collapsePanelStyle} onClick={() => setOpenKey(openKey === panel.key ? null : panel.key)} aria-expanded={openKey === panel.key}>
            <ChevronRight
              size={14}
              style={{ transform: openKey === panel.key ? "rotate(90deg)" : "none", transition: "transform .15s ease", color: "var(--text-muted)" }}
            />
            {panel.title}
          </button>
          {openKey === panel.key && (
            <div style={{ padding: "10px 14px 12px 36px", fontSize: 14, color: "var(--text-muted)", borderTop: "1px solid var(--line)" }}>{panel.body}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function CollapseBusiness() {
  const [openKey, setOpenKey] = useState<string | null>("input");
  const panels = [
    {
      key: "input",
      title: "输入文件（3）",
      badge: <Badge tone="success">已校验</Badge>,
      body: <span className="mono">structure.cif · params.json · kpoints.conf</span>,
    },
    {
      key: "result",
      title: "结果文件（2）",
      badge: <Badge tone="neutral">待生成</Badge>,
      body: <span>任务 run-28003 完成后生成 output.json 与 report.pdf</span>,
    },
  ];
  return (
    <div className="demo-stack">
      <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", maxWidth: 520 }}>
        {panels.map((panel, index) => (
          <div key={panel.key} style={{ borderTop: index === 0 ? "none" : "1px solid var(--line)" }}>
            <button style={collapsePanelStyle} onClick={() => setOpenKey(openKey === panel.key ? null : panel.key)} aria-expanded={openKey === panel.key}>
              <ChevronRight
                size={14}
                style={{ transform: openKey === panel.key ? "rotate(90deg)" : "none", transition: "transform .15s ease", color: "var(--text-muted)" }}
              />
              {panel.title}
              <span style={{ marginLeft: "auto" }}>{panel.badge}</span>
            </button>
            {openKey === panel.key && (
              <div style={{ padding: "10px 14px 12px 36px", fontSize: 14, color: "var(--text-muted)", borderTop: "1px solid var(--line)" }}>{panel.body}</div>
            )}
          </div>
        ))}
      </div>
      <p className="demo-note">手风琴模式 + extra 状态徽标；extra 区域的点击不触发展开。</p>
    </div>
  );
}

/* ---------- CodeBlock ---------- */

function CodeShell({ title, children, onCopy, copied }: { title: string; children: ReactNode; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", maxWidth: 640 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px",
          borderBottom: "1px solid var(--line)",
          background: "var(--surface-soft)",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <span>{title}</span>
        <Button variant="ghost" size="sm" aria-label="复制代码" onClick={onCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "已复制" : "复制"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function CodeBlockBasic() {
  const [copied, setCopied] = useState(false);
  const code = "$ datacore runs submit --project project-042 --dataset ds-118";
  return (
    <CodeShell
      title="bash"
      copied={copied}
      onCopy={() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      <pre style={{ margin: 0, padding: "12px 14px", overflowX: "auto", background: "var(--surface)" }}>
        <code style={{ fontFamily: '"DM Mono", monospace', fontSize: 14, color: "var(--text)" }}>{code}</code>
      </pre>
    </CodeShell>
  );
}

function CodeBlockHighlight() {
  const [copied, setCopied] = useState(false);
  const lines = ["{", '  "projectId": "project-042",', '  "datasetId": "ds-118",', '  "method": "PBE0",', '  "maxSeconds": 300', "}"];
  return (
    <div className="demo-stack">
      <CodeShell
        title="json · 第 4 行需复核"
        copied={copied}
        onCopy={() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
      >
        <pre style={{ margin: 0, padding: "10px 0", overflowX: "auto", background: "var(--surface)", display: "grid" }}>
          {lines.map((line, index) => (
            <span
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr",
                padding: "0 14px 0 0",
                background: index === 3 ? "var(--brand-soft)" : "transparent",
                fontFamily: '"DM Mono", monospace',
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              <span style={{ textAlign: "right", paddingRight: 10, color: "var(--faint)", userSelect: "none" }}>{index + 1}</span>
              <span style={{ color: "var(--text)" }}>{line}</span>
            </span>
          ))}
        </pre>
      </CodeShell>
      <p className="demo-note">超过 3 行显示行号；高亮行配合行号文字说明（“第 4 行”），不只靠颜色。</p>
    </div>
  );
}

function CodeBlockBusiness() {
  const [copied, setCopied] = useState(false);
  const code = '$ curl https://api.example.com/v1/runs/run-28003 \\\n    -H "Authorization: Bearer ***"';
  return (
    <div className="demo-stack">
      <CodeShell
        title="查询任务状态 · bash"
        copied={copied}
        onCopy={() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
      >
        <pre style={{ margin: 0, padding: "12px 14px", overflowX: "auto", background: "var(--surface)" }}>
          <code style={{ fontFamily: '"DM Mono", monospace', fontSize: 14, color: "var(--text)" }}>{code}</code>
        </pre>
      </CodeShell>
      <p className="demo-note">示例域名一律 example.com；凭证用 *** 占位，绝不展示真实密钥。</p>
    </div>
  );
}

/* ---------- JsonViewer ---------- */

function JsonKey({ k, suffix }: { k: string; suffix?: string }) {
  return (
    <>
      <span style={{ color: "var(--violet)" }}>&quot;{k}&quot;</span>
      <span style={{ color: "var(--text-muted)" }}>: </span>
      {suffix && <span style={{ color: "var(--text-muted)" }}>{suffix}</span>}
    </>
  );
}

function JsonString({ v }: { v: string }) {
  return <span style={{ color: "var(--green)" }}>&quot;{v}&quot;</span>;
}

const jsonBoxStyle: CSSProperties = {
  fontFamily: '"DM Mono", monospace',
  fontSize: 14,
  lineHeight: 1.9,
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "10px 14px",
  maxWidth: 540,
  overflowX: "auto",
};

function JsonViewerBasic() {
  const [open, setOpen] = useState(true);
  return (
    <div style={jsonBoxStyle}>
      <div>{"{"}</div>
      <div style={{ paddingLeft: 16 }}>
        <JsonKey k="runId" /> <JsonString v="run-28003" />,
      </div>
      <div style={{ paddingLeft: 16 }}>
        <JsonKey k="seconds" /> <span style={{ color: "var(--brand)" }}>286.4</span>,
      </div>
      <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", gap: 4 }}>
        <button aria-expanded={open} aria-label="展开 params" onClick={() => setOpen((v) => !v)} style={{ background: "none", cursor: "pointer", display: "inline-flex", color: "var(--text-muted)", padding: 0 }}>
          <ChevronRight size={12} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .12s ease" }} />
        </button>
        <JsonKey k="params" suffix={open ? "{" : "{ … }"} />
      </div>
      {open && (
        <>
          <div style={{ paddingLeft: 32 }}>
            <JsonKey k="method" /> <JsonString v="PBE0" />,
          </div>
          <div style={{ paddingLeft: 32 }}>
            <JsonKey k="cutoff" /> <span style={{ color: "var(--brand)" }}>520</span>
          </div>
          <div style={{ paddingLeft: 16 }}>{"}"}</div>
        </>
      )}
      <div>{"}"}</div>
    </div>
  );
}

function JsonViewerBusiness() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="demo-stack">
      <div style={jsonBoxStyle}>
        <div>{"{"}</div>
        <div style={{ paddingLeft: 16 }}>
          <JsonKey k="runId" /> <JsonString v="run-28003" />,
        </div>
        <div style={{ paddingLeft: 16 }}>
          <JsonKey k="project" suffix="{" />
        </div>
        <div style={{ paddingLeft: 32 }}>
          <JsonKey k="id" /> <JsonString v="project-042" />,
        </div>
        <div style={{ paddingLeft: 32 }}>
          <JsonKey k="name" /> <JsonString v="示例项目" />
        </div>
        <div style={{ paddingLeft: 16 }}>{"},"}</div>
        <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <JsonKey k="params" suffix="{" />
          <Button
            variant="link" size="sm" className="h-auto px-0"
            onClick={() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "已复制 params.kpoints[2]" : "复制路径"}
          </Button>
        </div>
        <div style={{ paddingLeft: 32 }}>
          <JsonKey k="method" /> <JsonString v="PBE0" />,
        </div>
        <div style={{ paddingLeft: 32 }}>
          <JsonKey k="kpoints" /> <span style={{ color: "var(--brand)" }}>[4, 4, 4]</span>
        </div>
        <div style={{ paddingLeft: 16 }}>{"},"}</div>
        <div style={{ paddingLeft: 16 }}>
          <JsonKey k="credential" /> <JsonString v="***" />
        </div>
        <div>{"}"}</div>
      </div>
      <p className="demo-note">点击键名复制节点路径；敏感字段值一律脱敏为 ***，键名保留便于理解结构。</p>
    </div>
  );
}

/* ---------- FileList ---------- */

function FileListBasic() {
  const files = [
    { id: "f-01", name: "structure.cif", size: "48 KB" },
    { id: "f-02", name: "params.json", size: "2 KB" },
  ];
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      {files.map((file) => (
        <div key={file.id} style={fileRowStyle}>
          <FileText size={16} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
          <span style={{ fontWeight: 600 }}>{file.name}</span>
          <span className="mono" style={{ color: "var(--faint)" }}>{file.size}</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", gap: 2 }}>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`下载 ${file.name}`}>
              <Download size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`删除 ${file.name}`}>
              <Trash2 size={15} />
            </Button>
          </span>
        </div>
      ))}
    </div>
  );
}

function FileListStates() {
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <div style={fileRowStyle}>
        <FileText size={16} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
        <span style={{ display: "grid", gap: 5, flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontWeight: 600 }}>raw-data.csv</span>
            <span className="mono" style={{ color: "var(--faint)" }}>1.2 MB · 62%</span>
          </span>
          <Progress value={62} />
        </span>
        <Button variant="link" size="sm" className="h-auto px-0">取消</Button>
      </div>
      <div style={{ ...fileRowStyle, borderColor: "color-mix(in srgb, var(--red) 30%, var(--line))" }}>
        <AlertTriangle size={16} style={{ color: "var(--red)", flex: "0 0 auto" }} />
        <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>notes.pdf</span>
          <span style={{ color: "var(--red)", fontSize: 12 }}>格式不支持（仅支持 .cif / .json）</span>
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
          <Button variant="link" size="sm" className="h-auto px-0">重试</Button>
          <Button variant="link" size="sm" className="h-auto px-0">移除</Button>
        </span>
      </div>
    </div>
  );
}

function FileListBusiness() {
  const files = [
    { id: "f-01", name: "structure.cif", size: "48 KB" },
    { id: "f-02", name: "params.json", size: "2 KB" },
    { id: "f-03", name: "raw-data.csv", size: "1.2 MB" },
  ];
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <p className="demo-note">数据集 ds-118 · 附件（共 5 个，默认展示 3 个）</p>
      {files.map((file) => (
        <div key={file.id} style={fileRowStyle}>
          <FileText size={16} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
          <span style={{ fontWeight: 600 }}>{file.name}</span>
          <span className="mono" style={{ color: "var(--faint)" }}>{file.size}</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", gap: 2 }}>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`下载 ${file.name}`}>
              <Download size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`删除 ${file.name}`}>
              <Trash2 size={15} />
            </Button>
          </span>
        </div>
      ))}
      <div>
        <Button variant="link" size="sm" className="h-auto px-0">查看全部（5）</Button>
      </div>
    </div>
  );
}

/* ---------- Alert ---------- */

function AlertBasic() {
  return (
    <div className="demo-stack">
      <div className="status-line status-info">
        <Info size={16} />
        <div>
          <strong>计算任务将于今晚 22:00 排队执行</strong>
          <span>示例项目（project-042）· 队列预计等待 20 分钟</span>
        </div>
      </div>
      <div className="status-line status-success">
        <CheckCircle2 size={16} />
        <div>
          <strong>数据集 ds-118 校验通过</strong>
          <span>1,000 行全部通过字段校验</span>
        </div>
      </div>
      <div className="status-line status-warning">
        <AlertTriangle size={16} />
        <div>
          <strong>3 行缺少密度字段</strong>
          <span>缺失行将以项目默认值填充，可在导入预览中逐行修改</span>
        </div>
      </div>
      <div className="status-line status-danger">
        <XCircle size={16} />
        <div>
          <strong>任务 run-28002 执行失败</strong>
          <span>K 点网格与截断能设置冲突，请检查参数后重试</span>
        </div>
      </div>
    </div>
  );
}

function AlertClosable() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return (
      <Button variant="link" size="sm" className="h-auto px-0" onClick={() => setVisible(true)}>
        重新显示提示
      </Button>
    );
  }
  return (
    <div className="status-line status-warning">
      <AlertTriangle size={16} />
      <div>
        <strong>项目额度剩余 12%</strong>
        <span>示例项目（project-042）本周期额度即将用完</span>
      </div>
      <Button variant="link" size="sm" className="ml-auto h-auto px-0">查看用量</Button>
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="关闭提示" onClick={() => setVisible(false)}>
        <X size={15} />
      </Button>
    </div>
  );
}

function AlertBusiness() {
  return (
    <div className="demo-stack">
      <div className="status-line status-warning" style={{ alignItems: "flex-start" }}>
        <AlertTriangle size={16} style={{ marginTop: 2 }} />
        <div>
          <strong>3 行缺少密度字段，无法直接提交</strong>
          <span>第 128、512、907 行缺失。可逐行补全，或以项目默认值 2.50 g/cm³ 填充后继续。</span>
          <span style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button variant="ghost" size="sm">查看缺失行</Button>
            <Button variant="secondary" size="sm">以默认值填充</Button>
          </span>
        </div>
      </div>
      <p className="demo-note">Alert 常驻页面直到问题解决；轻反馈用 Message，异步事件用 Notification。</p>
    </div>
  );
}

/* ---------- Message ---------- */

function MessageBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button onClick={() => toast.success("已保存到示例项目（project-042）")}>保存</Button>
        <Button variant="secondary" onClick={() => toast.error("保存失败：网络异常，请重试")}>
          演示失败
        </Button>
      </div>
      <p className="demo-note">顶部居中浮出，默认 3 秒自动消失；hover 暂停计时。</p>
    </div>
  );
}

function MessageTypes() {
  const showLoading = () => {
    const id = toast.loading("正在提交…");
    window.setTimeout(() => toast.success("提交成功", { id }), 1500);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="secondary" onClick={() => toast.success("已复制任务 ID run-28003")}>
          <CheckCircle2 className="text-success" />
          success
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("项目额度剩余不足 20%")}>
          <AlertTriangle className="text-warning" />
          warning
        </Button>
        <Button variant="secondary" onClick={() => toast.error("提交失败：参数校验未通过")}>
          <XCircle className="text-danger" />
          error
        </Button>
        <Button variant="secondary" onClick={showLoading}>
          <Loader2 className="text-primary" />
          loading
        </Button>
      </div>
      <p className="demo-note">图标 + 文字同时表达；loading 用同一 id 更新为结果，不堆叠。</p>
    </div>
  );
}

function MessageBusiness() {
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    const id = toast.loading("正在保存到示例项目（project-042）…");
    window.setTimeout(() => {
      setSaving(false);
      toast.success("已保存 · 版本 v3", { id });
    }, 1200);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button disabled={saving} onClick={save}>
          {saving && <Loader2 className="animate-spin" />}
          {saving ? "正在保存" : "保存数据集"}
        </Button>
      </div>
      <p className="demo-note">同一 id 从 loading 更新为成功，不堆叠两条 Message。</p>
    </div>
  );
}

/* ---------- Notification ---------- */

function NotificationBasic() {
  return (
    <div className="demo-row">
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("计算任务已完成", {
            description: "run-28003 电导率计算已完成，耗时 286.4 秒。",
            position: "top-right",
            duration: 4500,
            action: { label: "查看结果", onClick: () => {} },
          })
        }
      >
        演示通知
      </Button>
      <span className="demo-note">右上角滑入，默认 4.5 秒消失</span>
    </div>
  );
}

function NoticeCard({
  tone,
  title,
  description,
  actions,
  onClose,
}: {
  tone: "success" | "danger";
  title: ReactNode;
  description: string;
  actions: string[];
  onClose?: () => void;
}) {
  const Icon = tone === "success" ? CheckCircle2 : XCircle;
  return (
    <Card role={tone === "danger" ? "alert" : "status"} className="flex w-80 max-w-full items-start gap-2.5 p-3.5 shadow-md">
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-success" : "text-danger")} />
      <div className="grid min-w-0 gap-1 text-base">
        <div className="flex items-center gap-1.5 font-semibold">{title}</div>
        <p className="m-0 text-muted-foreground">{description}</p>
        <div className="flex gap-3">
          {actions.map((label) => (
            <Button key={label} variant="link" size="sm" className="h-auto px-0">{label}</Button>
          ))}
        </div>
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" className="-mr-1.5 -mt-1.5 ml-auto size-7 shrink-0 text-muted-foreground" aria-label="关闭通知" onClick={onClose}>
          <X />
        </Button>
      )}
    </Card>
  );
}

function NotificationBusiness() {
  const [failedVisible, setFailedVisible] = useState(true);
  return (
    <div className="demo-stack">
      <NoticeCard tone="success" title="计算任务已完成" description="run-28003 电导率计算已完成，耗时 286.4 秒。" actions={["查看结果"]} />
      {failedVisible ? (
        <NoticeCard
          tone="danger"
          title={
            <>
              计算任务执行失败 <Badge tone="danger">常驻</Badge>
            </>
          }
          description="run-28002 结构优化失败：K 点网格与截断能设置冲突。"
          actions={["查看日志", "重新提交"]}
          onClose={() => setFailedVisible(false)}
        />
      ) : (
        <div>
          <Button variant="link" size="sm" className="h-auto px-0" onClick={() => setFailedVisible(true)}>重新显示失败通知</Button>
        </div>
      )}
      <div className="demo-row">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.error("计算任务执行失败", {
              description: "run-28002 结构优化失败：K 点网格与截断能设置冲突。",
              position: "top-right",
              duration: Infinity,
              closeButton: true,
              action: { label: "查看日志", onClick: () => {} },
            })
          }
        >
          弹出常驻失败通知
        </Button>
        <span className="demo-note">error 类型常驻直到用户处理；描述带稳定 ID，操作直达目标页面。</span>
      </div>
    </div>
  );
}

/* ---------- Progress ---------- */

function ProgressRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ProgressValue({ value }: { value: number }) {
  return <span className="w-10 shrink-0 text-right font-mono text-sm tabular-nums text-muted-foreground">{value}%</span>;
}

function ProgressBasic() {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPercent((value) => (value >= 62 ? 62 : value + 2));
    }, 60);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <ProgressRow>
        <Progress value={percent} />
        <ProgressValue value={percent} />
      </ProgressRow>
      <ProgressRow>
        <Progress value={100} tone="success" />
        <span className="inline-flex shrink-0 items-center gap-1 text-sm text-success">
          <Check className="size-3.5" />
          已完成
        </span>
      </ProgressRow>
    </div>
  );
}

function ProgressStatus() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <ProgressRow>
        <Progress value={80} />
        <ProgressValue value={80} />
      </ProgressRow>
      <ProgressRow>
        {/* 失败态：Progress 无 danger tone，用语义令牌覆盖指示条颜色 */}
        <Progress value={45} className="[&>div]:bg-danger" />
        <span className="shrink-0 text-sm text-danger">导入中断</span>
      </ProgressRow>
      <p className="demo-note">error 停在失败点，邻近文案给出原因：第 450 行密度字段格式错误。</p>
    </div>
  );
}

function ProgressBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <ProgressRow>
        <Progress value={62} />
        <ProgressValue value={62} />
      </ProgressRow>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="demo-note">正在导入 ds-118 · 第 620/1,000 行 · 预计剩余 40 秒</span>
        <Button variant="ghost" size="sm" className="ml-auto">取消</Button>
      </div>
    </div>
  );
}

/* ---------- Spin ---------- */

function SpinBasic() {
  return (
    <div className="demo-row" style={{ alignItems: "center", gap: 18 }}>
      <span className="spinner spinner-dark" style={{ width: 13, height: 13 }} aria-label="加载中" />
      <span className="spinner spinner-dark" style={{ width: 20, height: 20 }} aria-label="加载中" />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span className="spinner spinner-dark" style={{ width: 26, height: 26 }} aria-hidden="true" />
        <span className="demo-note">正在加载任务详情…</span>
      </span>
    </div>
  );
}

function SpinContainer() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      <div className="card-demo" style={{ position: "relative", maxWidth: 420, minHeight: 96 }}>
        <h4>电导率结果</h4>
        <p>run-28003 · 4.21 S/cm · 数据集 ds-118</p>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "color-mix(in srgb, var(--surface) 78%, transparent)",
              borderRadius: "var(--radius-lg)",
              zIndex: 2,
            }}
          >
            <span style={{ display: "grid", justifyItems: "center", gap: 8 }} role="status">
              <span className="spinner spinner-dark" style={{ width: 20, height: 20 }} aria-hidden="true" />
              <span className="demo-note">正在重新计算…</span>
            </span>
          </div>
        )}
      </div>
      <div className="demo-row">
        <Button
          variant="secondary" size="sm"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          模拟容器加载
        </Button>
        <span className="demo-note">遮罩期间内部不可交互，aria-busy=true。</span>
      </div>
    </div>
  );
}

function SpinBusiness() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <div className="demo-row">
        <Button variant="secondary" size="sm">状态：全部</Button>
        <Button variant="secondary" size="sm">数据集：ds-118</Button>
        <Button variant="ghost" size="sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "加载完成" : "重新加载"}
        </Button>
      </div>
      <div style={{ position: "relative", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 24, padding: "10px 14px", borderBottom: "1px solid var(--line)", color: "var(--faint)", fontSize: 12, fontWeight: 700, letterSpacing: ".08em" }}>
          <span>任务</span>
          <span>数据集</span>
          <span>耗时（秒）</span>
          <span>状态</span>
        </div>
        <div style={{ display: "grid", gap: 10, padding: 14 }}>
          <span style={{ height: 10, width: "70%", borderRadius: 4, background: "var(--surface-soft)" }} />
          <span style={{ height: 10, width: "52%", borderRadius: 4, background: "var(--surface-soft)" }} />
          <span style={{ height: 10, width: "64%", borderRadius: 4, background: "var(--surface-soft)" }} />
        </div>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "color-mix(in srgb, var(--surface) 78%, transparent)",
            }}
          >
            <span style={{ display: "grid", justifyItems: "center", gap: 8 }} role="status">
              <span className="spinner spinner-dark" style={{ width: 20, height: 20 }} aria-hidden="true" />
              <span className="demo-note">正在加载任务列表…</span>
            </span>
          </div>
        )}
      </div>
      <p className="demo-note">遮罩只覆盖表格区域，筛选栏保持可用（delay 200ms 防闪烁）。</p>
    </div>
  );
}

/* ---------- Modal ---------- */

function ModalBasic() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-row">
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
            <Button onClick={() => setOpen(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span className="demo-note">Esc 关闭 · 打开后焦点进入对话框 · 关闭后焦点还原</span>
    </div>
  );
}

function ModalBusiness() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <div className="demo-row">
      <Dialog open={open} onOpenChange={(next) => !submitting && setOpen(next)}>
        <DialogTrigger asChild>
          <Button>创建计算任务</Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-md"
          onEscapeKeyDown={(event) => submitting && event.preventDefault()}
          onInteractOutside={(event) => submitting && event.preventDefault()}
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
      </Dialog>
      <span className="demo-note">提交中禁用 Esc、遮罩关闭与重复提交</span>
    </div>
  );
}

/* ---------- Drawer ---------- */

function DrawerShell({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <AccessibleModal open onClose={onClose} label={title} className="demo-drawer"><div className="drawer-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <strong style={{ fontSize: 14.0 }}>{title}</strong>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="关闭" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 18px", borderTop: "1px solid var(--line)" }}>{footer}</div>}
      </div>
    </AccessibleModal>
  );
}

function DrawerBasic() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          查看任务详情
        </Button>
        <span className="demo-note">Esc 与遮罩点击关闭 · 标题带对象 ID</span>
      </div>
      {open && (
        <DrawerShell title="任务详情 · run-28003" onClose={() => setOpen(false)}>
          <DescItem label="任务 ID" mono>run-28003</DescItem>
          <DescItem label="所属项目">示例项目（project-042）</DescItem>
          <DescItem label="状态">
            <Badge tone="success" dot>已完成</Badge>
          </DescItem>
          <DescItem label="耗时" mono>286.4 秒</DescItem>
        </DrawerShell>
      )}
    </div>
  );
}

function DrawerBusiness() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="default" onClick={() => setOpen(true)}>
          从列表行打开详情抽屉
        </Button>
        <span className="demo-note">关闭后列表滚动位置与选中行保持</span>
      </div>
      {open && (
        <DrawerShell
          title="任务详情 · run-28003"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                关闭
              </Button>
              <Button variant="default">查看完整日志</Button>
            </>
          }
        >
          <DescItem label="数据集" mono>ds-118</DescItem>
          <DescItem label="方法" mono>PBE0 · 截断能 520 eV</DescItem>
          <DescItem label="耗时" mono>286.4 秒</DescItem>
          <DescItem label="费用" mono>¥12.40</DescItem>
          <div style={{ marginTop: 14, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "9px 12px", fontSize: 14, fontWeight: 600, borderBottom: "1px solid var(--line)", background: "var(--surface-soft)" }}>
              日志摘要
            </div>
            <div style={{ padding: "10px 12px", fontFamily: '"DM Mono", monospace', fontSize: 12, color: "var(--text-muted)", display: "grid", gap: 4 }}>
              <span>[09:14:02] 分配到计算节点 node-07</span>
              <span>[09:18:45] SCF 收敛，迭代 58 步</span>
              <span>[09:18:46] 结果写回 run-28003</span>
            </div>
          </div>
        </DrawerShell>
      )}
    </div>
  );
}

/* ---------- Popconfirm ---------- */

function ConfirmBubble({
  description,
  busy,
  danger,
  onCancel,
  onConfirm,
}: {
  description: string;
  busy: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="grid gap-1">
          <p className="m-0 text-base font-semibold">删除该文件？</p>
          <p className="m-0 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <Button variant="secondary" size="sm" onClick={onCancel}>取消</Button>
        <Button variant={danger ? "danger" : "default"} size="sm" disabled={busy} onClick={onConfirm}>
          {busy && <Loader2 className="animate-spin" />}
          {busy ? "删除中…" : "删除"}
        </Button>
      </div>
    </>
  );
}

function PopconfirmBasic() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
      setDone(true);
      toast.success("已删除 structure.cif");
    }, 900);
  };
  return (
    <div className="demo-row" style={{ alignItems: "center" }}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (busy) return;
          setOpen(next);
          if (next) setDone(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="danger" size="sm">删除</Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
          <ConfirmBubble
            description="structure.cif 将从数据集 ds-118 移除，任务产物不受影响。"
            busy={busy}
            onCancel={() => setOpen(false)}
            onConfirm={confirm}
          />
        </PopoverContent>
      </Popover>
      {done ? (
        <span className="demo-note">已删除 structure.cif（Message 反馈）</span>
      ) : (
        <span className="demo-note">点击外部或 Esc 取消，不产生副作用</span>
      )}
    </div>
  );
}

function PopconfirmBusiness() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);
  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
      setRemoved(true);
      toast.success("已删除 raw-data.csv");
    }, 900);
  };
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <Card className="flex items-center gap-2.5 px-3 py-2 text-base">
        <FileText className={cn("size-4 shrink-0", removed ? "text-subtle" : "text-primary")} />
        <span className={cn("font-semibold", removed && "text-subtle line-through")}>raw-data.csv</span>
        <span className="font-mono text-sm text-subtle">1.2 MB</span>
        <span className="ml-auto">
          {removed ? (
            <span className="demo-note">已删除</span>
          ) : (
            <Popover open={open} onOpenChange={(next) => !busy && setOpen(next)}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-danger">删除</Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="end" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
                <ConfirmBubble
                  danger
                  description="raw-data.csv 将从数据集 ds-118 移除，已完成的 2 个任务产物保留。"
                  busy={busy}
                  onCancel={() => setOpen(false)}
                  onConfirm={confirm}
                />
              </PopoverContent>
            </Popover>
          )}
        </span>
      </Card>
      <p className="demo-note">危险动作用 danger 主按钮；确认中主按钮 loading，禁止重复点击。</p>
    </div>
  );
}

export const displayPreviews: Record<string, PreviewFn> = {
  "table/basic": TableBasic,
  "table/scroll": TableScroll,
  "table/states": TableStates,
  "table/business": TableBusiness,
  "descriptions/basic": DescriptionsBasic,
  "descriptions/layout": DescriptionsLayout,
  "descriptions/business": DescriptionsBusiness,
  "statistic/basic": StatisticBasic,
  "statistic/trend": StatisticTrend,
  "statistic/business": StatisticBusiness,
  "timeline/basic": TimelineBasic,
  "timeline/status": TimelineStatus,
  "timeline/business": TimelineBusiness,
  "tree/basic": TreeBasic,
  "tree/selectable": TreeSelectable,
  "tree/business": TreeBusiness,
  "collapse/basic": CollapseBasic,
  "collapse/business": CollapseBusiness,
  "code-block/basic": CodeBlockBasic,
  "code-block/highlight": CodeBlockHighlight,
  "code-block/business": CodeBlockBusiness,
  "json-viewer/basic": JsonViewerBasic,
  "json-viewer/business": JsonViewerBusiness,
  "file-list/basic": FileListBasic,
  "file-list/states": FileListStates,
  "file-list/business": FileListBusiness,
  "alert/basic": AlertBasic,
  "alert/closable": AlertClosable,
  "alert/business": AlertBusiness,
  "message/basic": MessageBasic,
  "message/types": MessageTypes,
  "message/business": MessageBusiness,
  "notification/basic": NotificationBasic,
  "notification/business": NotificationBusiness,
  "progress/basic": ProgressBasic,
  "progress/status": ProgressStatus,
  "progress/business": ProgressBusiness,
  "spin/basic": SpinBasic,
  "spin/container": SpinContainer,
  "spin/business": SpinBusiness,
  "modal/basic": ModalBasic,
  "modal/business": ModalBusiness,
  "drawer/basic": DrawerBasic,
  "drawer/business": DrawerBusiness,
  "popconfirm/basic": PopconfirmBasic,
  "popconfirm/business": PopconfirmBusiness,
};
