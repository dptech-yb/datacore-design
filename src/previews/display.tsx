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
  Lock,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { PreviewFn } from "./types";

/* ---------- shared demo helpers (inline styles only, theme-token based) ---------- */

function ProgressBar({ percent, tone = "brand" }: { percent: number; tone?: "brand" | "green" | "red" }) {
  const fill = tone === "green" ? "var(--green)" : tone === "red" ? "var(--red)" : "var(--brand)";
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ flex: 1, minWidth: 120, height: 8, borderRadius: 999, background: "var(--surface-soft)", overflow: "hidden" }}
    >
      <div style={{ width: `${percent}%`, height: "100%", background: fill, borderRadius: 999, transition: "width .3s ease" }} />
    </div>
  );
}

const toastTones = {
  success: { color: "var(--green)", Icon: CheckCircle2 },
  warning: { color: "var(--amber)", Icon: AlertTriangle },
  error: { color: "var(--red)", Icon: XCircle },
  info: { color: "var(--brand)", Icon: Info },
} as const;

type ToastTone = keyof typeof toastTones;

function Toast({ tone, children, spinning }: { tone: ToastTone; children: ReactNode; spinning?: boolean }) {
  const { color, Icon } = toastTones[tone];
  return (
    <div
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 14px",
        borderRadius: 10,
        border: "1px solid var(--line)",
        background: "var(--surface)",
        boxShadow: "var(--shadow-md)",
        fontSize: 14,
      }}
    >
      {spinning ? <span className="spinner spinner-dark" aria-hidden="true" /> : <Icon size={15} style={{ color, flex: "0 0 auto" }} />}
      <span>{children}</span>
    </div>
  );
}

function DescItem({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
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

function TableBasic() {
  return (
    <div className="table-wrap">
      <table>
        <caption style={{ textAlign: "left", paddingBottom: 8, color: "var(--muted)", fontSize: 12 }}>
          示例项目（project-042）· 最近计算任务
        </caption>
        <thead>
          <tr>
            <th>任务</th>
            <th>数据集</th>
            <th className="num">耗时（秒）</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>电导率计算</strong>
              <span className="table-secondary">run-28003</span>
            </td>
            <td>ds-118</td>
            <td className="num">286.4</td>
            <td>
              <span className="status-badge badge-success">
                <span className="badge-dot" />
                已完成
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <strong>结构优化</strong>
              <span className="table-secondary">run-28002</span>
            </td>
            <td>ds-121</td>
            <td className="num">412.7</td>
            <td>
              <span className="status-badge badge-danger">
                <span className="badge-dot" />
                失败
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <strong>电导率计算</strong>
              <span className="table-secondary">run-28001</span>
            </td>
            <td>ds-118</td>
            <td className="num">291.0</td>
            <td>
              <span className="status-badge badge-success">
                <span className="badge-dot" />
                已完成
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TableScroll() {
  const sticky: CSSProperties = { position: "sticky", left: 0, background: "var(--surface)", zIndex: 1 };
  return (
    <div className="demo-stack">
      <div className="table-wrap">
        <table style={{ minWidth: 880 }}>
          <caption style={{ textAlign: "left", paddingBottom: 8, color: "var(--muted)", fontSize: 12 }}>
            数据集 ds-118 · 全部字段（表格最小宽度 880px，窄屏横向滚动）
          </caption>
          <thead>
            <tr>
              <th style={sticky}>任务</th>
              <th>数据集</th>
              <th>方法</th>
              <th className="num">截断能（eV）</th>
              <th className="num">耗时（秒）</th>
              <th className="num">费用（元）</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={sticky}>
                <strong>电导率计算</strong>
                <span className="table-secondary">run-28003</span>
              </td>
              <td>ds-118</td>
              <td>PBE0</td>
              <td className="num">520</td>
              <td className="num">286.4</td>
              <td className="num">12.40</td>
              <td>
                <span className="status-badge badge-success">
                  <span className="badge-dot" />
                  已完成
                </span>
              </td>
            </tr>
            <tr>
              <td style={sticky}>
                <strong>结构优化</strong>
                <span className="table-secondary">run-28002</span>
              </td>
              <td>ds-121</td>
              <td>PBE</td>
              <td className="num">450</td>
              <td className="num">412.7</td>
              <td className="num">17.90</td>
              <td>
                <span className="status-badge badge-danger">
                  <span className="badge-dot" />
                  失败
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="demo-note">横向滚动时首列冻结（stickyFirstColumn），列宽不压缩、文字不换行。</p>
    </div>
  );
}

function TableStates() {
  const bar = (width: string): CSSProperties => ({ height: 10, width, borderRadius: 4, background: "var(--surface-soft)" });
  return (
    <div className="demo-stack">
      <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 12, display: "grid", gap: 10, background: "var(--surface)" }}>
        <span className="demo-note">loading：骨架行替换数据行，表头保留</span>
        <span style={bar("42%")} />
        <span style={bar("78%")} />
        <span style={bar("61%")} />
      </div>
      <div className="empty-line">
        <strong>当前筛选条件下没有任务</strong>
        <span>empty：说明是无数据还是被筛选清空，并给出下一步</span>
        <button className="inline-action">清除筛选</button>
      </div>
      <div className="status-line status-danger">
        <XCircle size={16} />
        <div>
          <strong>任务列表加载失败</strong>
          <span>error：保留筛选上下文，提供重试</span>
        </div>
        <button className="inline-action">重试</button>
      </div>
    </div>
  );
}

function TableBusiness() {
  return (
    <div className="table-wrap">
      <table>
        <caption style={{ textAlign: "left", paddingBottom: 8, color: "var(--muted)", fontSize: 12 }}>
          示例项目（project-042）· 计算任务列表
        </caption>
        <thead>
          <tr>
            <th>任务</th>
            <th>数据集</th>
            <th className="num">耗时（秒）</th>
            <th className="num">费用（元）</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>电导率计算</strong>
              <span className="table-secondary">run-28003</span>
            </td>
            <td>ds-118</td>
            <td className="num">286.4</td>
            <td className="num">12.40</td>
            <td>
              <span className="status-badge badge-success">
                <span className="badge-dot" />
                已完成
              </span>
            </td>
            <td>
              <button className="table-action">查看日志</button>
            </td>
          </tr>
          <tr>
            <td>
              <strong>结构优化</strong>
              <span className="table-secondary">run-28002</span>
            </td>
            <td>ds-121</td>
            <td className="num">412.7</td>
            <td className="num">17.90</td>
            <td>
              <span className="status-badge badge-danger">
                <span className="badge-dot" />
                失败
              </span>
            </td>
            <td>
              <button className="table-action">查看日志</button>
            </td>
          </tr>
          <tr>
            <td>
              <strong>能带计算</strong>
              <span className="table-secondary">run-27998</span>
            </td>
            <td>ds-118</td>
            <td className="num">1,024.5</td>
            <td className="num">43.20</td>
            <td>
              <span className="status-badge badge-neutral">
                <span className="badge-dot" />
                排队中
              </span>
            </td>
            <td>
              <button className="table-action">取消排队</button>
            </td>
          </tr>
        </tbody>
      </table>
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
          <span className="status-badge badge-success">
            <span className="badge-dot" />
            已完成
          </span>
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
            <div style={{ color: "var(--muted)", fontSize: 12 }}>{item.label}</div>
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
        <button
          className="inline-action"
          style={{ marginLeft: 0, display: "inline-flex", alignItems: "center", gap: 4 }}
          onClick={() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "已复制 ID" : "复制 ID"}
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        <DescItem label="数据集 ID" mono>ds-118</DescItem>
        <DescItem label="所属项目">示例项目（project-042）</DescItem>
        <DescItem label="版本">v3 · 2026-09-18 更新</DescItem>
        <DescItem label="数据量" mono>1,000 行 · 12 字段</DescItem>
        <DescItem label="质量状态">
          <span className="status-badge badge-warning">
            <span className="badge-dot" />3 行缺少密度字段
          </span>
        </DescItem>
      </div>
    </div>
  );
}

/* ---------- Statistic ---------- */

function StatBlock({ title, value, suffix, extra }: { title: string; value: string; suffix?: string; extra?: ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", background: "var(--surface)", display: "grid", gap: 4 }}>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>{title}</span>
      <span style={{ fontSize: 24.0, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {value}
        {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginLeft: 4 }}>{suffix}</span>}
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
            K 点网格与截断能冲突 · <button className="inline-action" style={{ marginLeft: 0 }}>查看日志</button>
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
        {open ? <ChevronDown size={14} style={{ color: "var(--muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--muted)" }} />}
        <FolderOpen size={14} style={{ color: "var(--brand)" }} />
        示例项目（project-042）
      </button>
      {open && (
        <>
          <div style={{ ...treeRowStyle, paddingLeft: 30, cursor: "default" }}>
            <Database size={14} style={{ color: "var(--muted)" }} />
            数据集 ds-118
            <span className="mono" style={{ color: "var(--faint)" }}>1,000 行</span>
          </div>
          <div style={{ ...treeRowStyle, paddingLeft: 30, cursor: "default" }}>
            <Database size={14} style={{ color: "var(--muted)" }} />
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
          <Database size={14} style={{ color: "var(--muted)" }} />
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
        <ChevronDown size={14} style={{ color: "var(--muted)" }} />
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
          {row.locked ? <Lock size={14} /> : <Database size={14} style={{ color: "var(--muted)" }} />}
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
              style={{ transform: openKey === panel.key ? "rotate(90deg)" : "none", transition: "transform .15s ease", color: "var(--muted)" }}
            />
            {panel.title}
          </button>
          {openKey === panel.key && (
            <div style={{ padding: "10px 14px 12px 36px", fontSize: 14, color: "var(--muted)", borderTop: "1px solid var(--line)" }}>{panel.body}</div>
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
      badge: <span className="status-badge badge-success">已校验</span>,
      body: <span className="mono">structure.cif · params.json · kpoints.conf</span>,
    },
    {
      key: "result",
      title: "结果文件（2）",
      badge: <span className="status-badge badge-neutral">待生成</span>,
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
                style={{ transform: openKey === panel.key ? "rotate(90deg)" : "none", transition: "transform .15s ease", color: "var(--muted)" }}
              />
              {panel.title}
              <span style={{ marginLeft: "auto" }}>{panel.badge}</span>
            </button>
            {openKey === panel.key && (
              <div style={{ padding: "10px 14px 12px 36px", fontSize: 14, color: "var(--muted)", borderTop: "1px solid var(--line)" }}>{panel.body}</div>
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
          color: "var(--muted)",
        }}
      >
        <span>{title}</span>
        <button className="button button-ghost button-sm" aria-label="复制代码" onClick={onCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "已复制" : "复制"}
        </button>
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
      <span style={{ color: "var(--muted)" }}>: </span>
      {suffix && <span style={{ color: "var(--muted)" }}>{suffix}</span>}
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
        <button aria-expanded={open} aria-label="展开 params" onClick={() => setOpen((v) => !v)} style={{ background: "none", cursor: "pointer", display: "inline-flex", color: "var(--muted)", padding: 0 }}>
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
          <button
            className="inline-action"
            style={{ marginLeft: 0 }}
            onClick={() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "已复制 params.kpoints[2]" : "复制路径"}
          </button>
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
            <button className="icon-button" aria-label={`下载 ${file.name}`}>
              <Download size={15} />
            </button>
            <button className="icon-button" aria-label={`删除 ${file.name}`}>
              <Trash2 size={15} />
            </button>
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
          <ProgressBar percent={62} />
        </span>
        <button className="inline-action">取消</button>
      </div>
      <div style={{ ...fileRowStyle, borderColor: "color-mix(in srgb, var(--red) 30%, var(--line))" }}>
        <AlertTriangle size={16} style={{ color: "var(--red)", flex: "0 0 auto" }} />
        <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>notes.pdf</span>
          <span style={{ color: "var(--red)", fontSize: 12 }}>格式不支持（仅支持 .cif / .json）</span>
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
          <button className="inline-action" style={{ marginLeft: 0 }}>重试</button>
          <button className="inline-action" style={{ marginLeft: 0 }}>移除</button>
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
            <button className="icon-button" aria-label={`下载 ${file.name}`}>
              <Download size={15} />
            </button>
            <button className="icon-button" aria-label={`删除 ${file.name}`}>
              <Trash2 size={15} />
            </button>
          </span>
        </div>
      ))}
      <div>
        <button className="inline-action" style={{ marginLeft: 0 }}>查看全部（5）</button>
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
      <button className="inline-action" style={{ marginLeft: 0 }} onClick={() => setVisible(true)}>
        重新显示提示
      </button>
    );
  }
  return (
    <div className="status-line status-warning">
      <AlertTriangle size={16} />
      <div>
        <strong>项目额度剩余 12%</strong>
        <span>示例项目（project-042）本周期额度即将用完</span>
      </div>
      <button className="inline-action">查看用量</button>
      <button className="icon-button" aria-label="关闭提示" onClick={() => setVisible(false)}>
        <X size={15} />
      </button>
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
            <button className="button button-ghost button-sm">查看缺失行</button>
            <button className="button button-secondary button-sm">以默认值填充</button>
          </span>
        </div>
      </div>
      <p className="demo-note">Alert 常驻页面直到问题解决；轻反馈用 Message，异步事件用 Notification。</p>
    </div>
  );
}

/* ---------- Message ---------- */

function MessageBasic() {
  const [toast, setToast] = useState<{ tone: ToastTone; text: string } | null>(null);
  const show = (tone: ToastTone, text: string) => {
    setToast({ tone, text });
    window.setTimeout(() => setToast(null), 2500);
  };
  return (
    <div className="demo-stack" style={{ position: "relative", minHeight: 96 }}>
      <div className="demo-row">
        <button className="button button-primary" onClick={() => show("success", "已保存到示例项目（project-042）")}>
          保存
        </button>
        <button className="button button-secondary" onClick={() => show("error", "保存失败：网络异常，请重试")}>
          演示失败
        </button>
      </div>
      {toast && (
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
          <Toast tone={toast.tone}>{toast.text}</Toast>
        </div>
      )}
      <p className="demo-note">顶部居中浮出，默认 3 秒自动消失；hover 暂停计时。</p>
    </div>
  );
}

function MessageTypes() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Toast tone="success">已复制任务 ID run-28003</Toast>
        <Toast tone="warning">项目额度剩余不足 20%</Toast>
      </div>
      <div className="demo-row">
        <Toast tone="error">提交失败：参数校验未通过</Toast>
        <Toast tone="info" spinning>
          正在提交…
        </Toast>
      </div>
      <p className="demo-note">图标 + 文字同时表达；loading 用同一 key 更新为结果，不堆叠。</p>
    </div>
  );
}

function MessageBusiness() {
  const [phase, setPhase] = useState<"idle" | "saving" | "saved">("idle");
  const save = () => {
    setPhase("saving");
    window.setTimeout(() => {
      setPhase("saved");
      window.setTimeout(() => setPhase("idle"), 2200);
    }, 1200);
  };
  return (
    <div className="demo-stack" style={{ position: "relative", minHeight: 96 }}>
      <div className="demo-row">
        <button className="button button-primary" disabled={phase === "saving"} onClick={save}>
          {phase === "saving" && <span className="spinner" aria-hidden="true" />}
          {phase === "saving" ? "正在保存" : "保存数据集"}
        </button>
      </div>
      {phase !== "idle" && (
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
          {phase === "saving" ? (
            <Toast tone="info" spinning>
              正在保存到示例项目（project-042）…
            </Toast>
          ) : (
            <Toast tone="success">已保存 · 版本 v3</Toast>
          )}
        </div>
      )}
      <p className="demo-note">同一 key 从 loading 更新为成功，不堆叠两条 Message。</p>
    </div>
  );
}

/* ---------- Notification ---------- */

const noticeCardStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  width: 320,
  maxWidth: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  fontSize: 14,
};

function NotificationBasic() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(timer);
  }, [visible]);
  return (
    <div className="demo-stack" style={{ position: "relative", minHeight: 110 }}>
      <div className="demo-row">
        <button className="button button-secondary" onClick={() => setVisible(true)}>
          演示通知
        </button>
        <span className="demo-note">右上角滑入，默认 4.5 秒消失</span>
      </div>
      {visible && (
        <div style={{ ...noticeCardStyle, position: "absolute", top: 0, right: 0 }}>
          <CheckCircle2 size={16} style={{ color: "var(--green)", flex: "0 0 auto", marginTop: 1 }} />
          <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
            <strong>计算任务已完成</strong>
            <span style={{ color: "var(--muted)" }}>run-28003 电导率计算已完成，耗时 286.4 秒。</span>
            <span>
              <button className="inline-action" style={{ marginLeft: 0 }}>查看结果</button>
            </span>
          </div>
          <button className="icon-button" aria-label="关闭通知" style={{ marginLeft: "auto" }} onClick={() => setVisible(false)}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function NotificationBusiness() {
  return (
    <div className="demo-stack">
      <div style={noticeCardStyle}>
        <CheckCircle2 size={16} style={{ color: "var(--green)", flex: "0 0 auto", marginTop: 1 }} />
        <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
          <strong>计算任务已完成</strong>
          <span style={{ color: "var(--muted)" }}>run-28003 电导率计算已完成，耗时 286.4 秒。</span>
          <span>
            <button className="inline-action" style={{ marginLeft: 0 }}>查看结果</button>
          </span>
        </div>
      </div>
      <div style={noticeCardStyle}>
        <XCircle size={16} style={{ color: "var(--red)", flex: "0 0 auto", marginTop: 1 }} />
        <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
          <strong>
            计算任务执行失败 <span className="status-badge badge-danger">常驻</span>
          </strong>
          <span style={{ color: "var(--muted)" }}>run-28002 结构优化失败：K 点网格与截断能设置冲突。</span>
          <span style={{ display: "flex", gap: 10 }}>
            <button className="inline-action" style={{ marginLeft: 0 }}>查看日志</button>
            <button className="inline-action" style={{ marginLeft: 0 }}>重新提交</button>
          </span>
        </div>
        <button className="icon-button" aria-label="关闭通知" style={{ marginLeft: "auto" }}>
          <X size={14} />
        </button>
      </div>
      <p className="demo-note">error 类型常驻直到用户处理；描述带稳定 ID，操作直达目标页面。</p>
    </div>
  );
}

/* ---------- Progress ---------- */

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
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressBar percent={percent} />
        <span className="mono" style={{ color: "var(--muted)" }}>{percent}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressBar percent={100} tone="green" />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--green)", fontSize: 14 }}>
          <Check size={14} />
          已完成
        </span>
      </div>
    </div>
  );
}

function ProgressStatus() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressBar percent={80} />
        <span className="mono" style={{ color: "var(--muted)" }}>80%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressBar percent={45} tone="red" />
        <span style={{ color: "var(--red)", fontSize: 14 }}>导入中断</span>
      </div>
      <p className="demo-note">error 停在失败点，邻近文案给出原因：第 450 行密度字段格式错误。</p>
    </div>
  );
}

function ProgressBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressBar percent={62} />
        <span className="mono" style={{ color: "var(--muted)" }}>62%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="demo-note">正在导入 ds-118 · 第 620/1,000 行 · 预计剩余 40 秒</span>
        <button className="button button-ghost button-sm" style={{ marginLeft: "auto" }}>取消</button>
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
        <button
          className="button button-secondary button-sm"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          模拟容器加载
        </button>
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
        <button className="button button-secondary button-sm">状态：全部</button>
        <button className="button button-secondary button-sm">数据集：ds-118</button>
        <button className="button button-ghost button-sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "加载完成" : "重新加载"}
        </button>
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
    <div className="demo-stack">
      <div className="demo-row">
        <button className="button button-primary" onClick={() => setOpen(true)}>
          打开对话框
        </button>
        <span className="demo-note">Esc 关闭 · 打开后焦点进入对话框 · 关闭后焦点还原</span>
      </div>
      {open && (
        <AccessibleModal open={open} onClose={() => setOpen(false)} label="重命名数据集">
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <h2 id="demo-modal-title">重命名数据集</h2>
              <button className="icon-button" aria-label="关闭" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <p>修改数据集 ds-118 的显示名称，数据集 ID 保持不变。</p>
            <input className="field-control" defaultValue="ds-118 电导率实验数据" aria-label="数据集名称" autoFocus />
            <div className="dialog-actions">
              <button className="button button-secondary" onClick={() => setOpen(false)}>
                取消
              </button>
              <button className="button button-primary" onClick={() => setOpen(false)}>
                保存
              </button>
            </div>
          </div>
        </AccessibleModal>
      )}
    </div>
  );
}

function ModalBusiness() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button className="button button-primary" onClick={() => setOpen(true)}>
          创建计算任务
        </button>
        <span className="demo-note">提交中禁用 Esc、遮罩关闭与重复提交</span>
      </div>
      {open && (
        <AccessibleModal open={open} onClose={() => {if(!submitting)setOpen(false);}} label="创建计算任务">
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="demo-modal-biz-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <h2 id="demo-modal-biz-title">创建计算任务</h2>
              <button className="icon-button" aria-label="关闭" disabled={submitting} onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <p>
              将在 示例项目（project-042）下创建电导率计算任务：输入数据集 ds-118 · 方法 PBE0 · 预计最长 300 秒。
            </p>
            <div className="dialog-note">确认后创建可追踪任务并记录审计日志；危险或不可逆动作请使用 ConfirmPanel。</div>
            <div className="dialog-actions">
              <button className="button button-secondary" disabled={submitting} onClick={() => setOpen(false)}>
                取消
              </button>
              <button
                className="button button-primary"
                disabled={submitting}
                onClick={() => {
                  setSubmitting(true);
                  window.setTimeout(() => {
                    setSubmitting(false);
                    setOpen(false);
                  }, 1200);
                }}
              >
                {submitting && <span className="spinner" aria-hidden="true" />}
                {submitting ? "正在创建" : "确认创建"}
              </button>
            </div>
          </div>
        </AccessibleModal>
      )}
    </div>
  );
}

/* ---------- Drawer ---------- */

function DrawerShell({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <AccessibleModal open onClose={onClose} label={title} className="demo-drawer"><div className="drawer-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <strong style={{ fontSize: 14.0 }}>{title}</strong>
          <button className="icon-button" aria-label="关闭" onClick={onClose}>
            <X size={16} />
          </button>
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
        <button className="button button-secondary" onClick={() => setOpen(true)}>
          查看任务详情
        </button>
        <span className="demo-note">Esc 与遮罩点击关闭 · 标题带对象 ID</span>
      </div>
      {open && (
        <DrawerShell title="任务详情 · run-28003" onClose={() => setOpen(false)}>
          <DescItem label="任务 ID" mono>run-28003</DescItem>
          <DescItem label="所属项目">示例项目（project-042）</DescItem>
          <DescItem label="状态">
            <span className="status-badge badge-success">
              <span className="badge-dot" />
              已完成
            </span>
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
        <button className="button button-primary" onClick={() => setOpen(true)}>
          从列表行打开详情抽屉
        </button>
        <span className="demo-note">关闭后列表滚动位置与选中行保持</span>
      </div>
      {open && (
        <DrawerShell
          title="任务详情 · run-28003"
          onClose={() => setOpen(false)}
          footer={
            <>
              <button className="button button-secondary" onClick={() => setOpen(false)}>
                关闭
              </button>
              <button className="button button-primary">查看完整日志</button>
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
            <div style={{ padding: "10px 12px", fontFamily: '"DM Mono", monospace', fontSize: 12, color: "var(--muted)", display: "grid", gap: 4 }}>
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

const bubbleStyle: CSSProperties = {
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: 0,
  width: 268,
  padding: 12,
  borderRadius: 10,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  zIndex: 10,
  textAlign: "left",
};

function PopconfirmBasic() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="demo-row" style={{ alignItems: "center" }}>
      <span style={{ position: "relative", display: "inline-block" }}>
        <button
          className="button button-danger button-sm"
          onClick={() => {
            setOpen((v) => !v);
            setDone(false);
          }}
        >
          删除
        </button>
        {open && (
          <span style={bubbleStyle} role="alertdialog" aria-label="删除确认">
            <span style={{ display: "flex", gap: 8 }}>
              <AlertTriangle size={15} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
              <span>
                <strong style={{ fontSize: 14 }}>删除该文件？</strong>
                <span className="demo-note" style={{ display: "block", marginTop: 3 }}>
                  structure.cif 将从数据集 ds-118 移除，任务产物不受影响。
                </span>
              </span>
            </span>
            <span style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 10 }}>
              <button className="button button-secondary button-sm" onClick={() => setOpen(false)}>
                取消
              </button>
              <button
                className="button button-primary button-sm"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  window.setTimeout(() => {
                    setBusy(false);
                    setOpen(false);
                    setDone(true);
                  }, 900);
                }}
              >
                {busy ? "删除中…" : "删除"}
              </button>
            </span>
          </span>
        )}
      </span>
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
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <div style={fileRowStyle}>
        <FileText size={16} style={{ color: removed ? "var(--faint)" : "var(--brand)", flex: "0 0 auto" }} />
        <span style={{ fontWeight: 600, color: removed ? "var(--faint)" : "var(--text)", textDecoration: removed ? "line-through" : "none" }}>
          raw-data.csv
        </span>
        <span className="mono" style={{ color: "var(--faint)" }}>1.2 MB</span>
        <span style={{ marginLeft: "auto", position: "relative", display: "inline-block" }}>
          {removed ? (
            <span className="demo-note">已删除</span>
          ) : (
            <button className="inline-action" style={{ marginLeft: 0, color: "var(--red)" }} onClick={() => setOpen((v) => !v)}>
              删除
            </button>
          )}
          {open && (
            <span style={{ ...bubbleStyle, left: "auto", right: 0 }} role="alertdialog" aria-label="删除确认">
              <span style={{ display: "flex", gap: 8 }}>
                <AlertTriangle size={15} style={{ color: "var(--amber)", flex: "0 0 auto", marginTop: 1 }} />
                <span>
                  <strong style={{ fontSize: 14 }}>删除该文件？</strong>
                  <span className="demo-note" style={{ display: "block", marginTop: 3 }}>
                    raw-data.csv 将从数据集 ds-118 移除，已完成的 2 个任务产物保留。
                  </span>
                </span>
              </span>
              <span style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 10 }}>
                <button className="button button-secondary button-sm" onClick={() => setOpen(false)}>
                  取消
                </button>
                <button
                  className="button button-danger button-sm"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    window.setTimeout(() => {
                      setBusy(false);
                      setOpen(false);
                      setRemoved(true);
                    }, 900);
                  }}
                >
                  {busy ? "删除中…" : "删除"}
                </button>
              </span>
            </span>
          )}
        </span>
      </div>
      <p className="demo-note">危险动作 okDanger；确认中主按钮 loading，禁止重复点击。</p>
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
