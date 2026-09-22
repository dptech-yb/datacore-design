import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  FileQuestion,
  Inbox,
  Info,
  Lock,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  SearchX,
  Share2,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { PreviewFn } from "./types";

function ButtonBasic() {
  return (
    <div className="demo-row">
      <button className="button button-primary">开始计算 <ArrowRight size={15} /></button>
      <button className="button button-secondary">保存草稿</button>
      <button className="button button-ghost">查看详情</button>
      <button className="button button-danger">撤销任务</button>
    </div>
  );
}

function ButtonStates() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button className="button button-primary" disabled={loading} onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1200); }}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "正在提交" : "点击演示加载态"}
        </button>
        <button className="button button-primary" disabled>不可用（无权限）</button>
      </div>
      <p className="demo-note">loading 期间按钮宽度不变；disabled 的原因写在邻近文案里。</p>
    </div>
  );
}

function ButtonSizes() {
  return (
    <div className="demo-row" style={{ alignItems: "center" }}>
      <button className="button button-secondary button-sm">行内操作</button>
      <button className="button button-primary">默认尺寸</button>
      <button className="button button-primary button-lg">页面主动作</button>
    </div>
  );
}

function ButtonBusiness() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button className="button button-primary" disabled={loading} onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1500); }}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "正在提交" : "提交计算任务"}
        </button>
        <span className="demo-note">将使用 示例项目（<span className="mono">project-042</span>）· 预计最长 300 秒</span>
      </div>
    </div>
  );
}

/* ---------- shared demo styles ---------- */
const tagStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "3px 9px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid var(--line)",
  background: "var(--surface-soft)",
  color: "var(--muted)",
};

function iconCircle(color: string, bg: string, size = 44): CSSProperties {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    color,
    background: bg,
    flex: "0 0 auto",
  };
}

function SkeletonBar({ width = "100%", height = 10 }: { width?: string; height?: number }) {
  return <span aria-hidden="true" style={{ display: "block", height, width, borderRadius: 4, background: "var(--surface-soft)" }} />;
}

/* ---------- IconButton ---------- */
function IconButtonBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button className="icon-button" aria-label="关闭面板" title="关闭面板"><X size={16} /></button>
        <button className="icon-button" aria-label="复制任务 ID" title="复制任务 ID"><Copy size={16} /></button>
        <button className="icon-button" aria-label="刷新列表" title="刷新列表"><RefreshCw size={16} /></button>
        <button className="icon-button" aria-label="更多操作" title="更多操作"><MoreHorizontal size={16} /></button>
      </div>
      <p className="demo-note">图标语义必须无需解释；动作名称通过 Tooltip 与 aria-label 提供。</p>
    </div>
  );
}

function IconButtonStates() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button
          className="icon-button"
          aria-label="复制任务 ID"
          title="复制任务 ID"
          onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}
        >
          {copied ? <Check size={16} style={{ color: "var(--green)" }} /> : <Copy size={16} />}
        </button>
        <button className="icon-button" aria-label="删除数据集 ds-118" title="删除数据集 ds-118" style={{ color: "var(--red)" }}>
          <Trash2 size={16} />
        </button>
        <button className="icon-button" aria-label="分享（需要项目编辑权限）" title="分享（需要项目编辑权限）" disabled style={{ opacity: .45, cursor: "not-allowed" }}>
          <Share2 size={16} />
        </button>
        <button className="icon-button" aria-label="正在刷新" title="正在刷新">
          <span className="spinner spinner-dark" aria-hidden="true" />
        </button>
      </div>
      <p className="demo-note">点击复制演示即时反馈；disabled 的原因写在 Tooltip 里；loading 时图标位替换为 spinner、尺寸不变。</p>
    </div>
  );
}

function IconButtonSizes() {
  return (
    <div className="demo-row" style={{ alignItems: "center" }}>
      <button className="icon-button" aria-label="编辑（sm）" title="编辑" style={{ width: 32, height: 32, borderRadius: 7 }}>
        <Pencil size={14} />
      </button>
      <button className="icon-button" aria-label="编辑（md）" title="编辑"><Pencil size={16} /></button>
      <span className="demo-note">sm 32px 用于表格行内；md 36px 为默认尺寸。</span>
    </div>
  );
}

function IconButtonBusiness() {
  return (
    <div className="demo-stack">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>任务</th><th>状态</th><th style={{ textAlign: "right" }}>操作</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>NCM811 高温循环</strong><span className="table-secondary">run-28003</span></td>
              <td><span className="status-badge badge-success"><span className="badge-dot" />已完成</span></td>
              <td>
                <div className="demo-row" style={{ justifyContent: "flex-end", gap: 2 }}>
                  <button className="icon-button" aria-label="查看 run-28003 详情" title="查看详情"><Eye size={15} /></button>
                  <button className="icon-button" aria-label="复制任务 ID" title="复制任务 ID"><Copy size={15} /></button>
                  <button className="icon-button" aria-label="更多操作" title="更多操作"><MoreHorizontal size={15} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td><strong>电解液配方筛选</strong><span className="table-secondary">run-28004</span></td>
              <td><span className="status-badge badge-info"><span className="badge-dot" />进行中</span></td>
              <td>
                <div className="demo-row" style={{ justifyContent: "flex-end", gap: 2 }}>
                  <button className="icon-button" aria-label="查看 run-28004 详情" title="查看详情"><Eye size={15} /></button>
                  <button className="icon-button" aria-label="复制任务 ID" title="复制任务 ID"><Copy size={15} /></button>
                  <button className="icon-button" aria-label="更多操作" title="更多操作"><MoreHorizontal size={15} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="demo-note">行内只放高频动作（≤3 个）；删除等危险动作收入「更多操作」并配确认。</p>
    </div>
  );
}

/* ---------- Link ---------- */
const stopNav = (e: { preventDefault: () => void }) => e.preventDefault();

function LinkBasic() {
  return (
    <div className="demo-stack">
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
        数据集 <span className="mono">ds-118</span> 已同步到{" "}
        <a className="text-link" href="#/components/link" onClick={stopNav}>示例项目（project-042）</a>
        ，可在项目内直接引用。
      </p>
      <div className="demo-row">
        <a className="text-link" href="#/components/link" onClick={stopNav}>查看运行详情 <ArrowRight size={13} /></a>
        <a className="text-link" href="#/components/link" onClick={stopNav}>字段规范文档 <ArrowUpRight size={13} /></a>
      </div>
    </div>
  );
}

function LinkVariants() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <a className="text-link" style={{ color: "var(--muted)" }} href="#/components/link" onClick={stopNav}>返回数据集列表</a>
        <a className="text-link" style={{ color: "var(--red)" }} href="#/components/link" onClick={stopNav}>放弃本次编辑并离开</a>
      </div>
      <p className="demo-note">muted 用于次级导航；danger 链接只允许「离开/放弃」类导航，破坏性动作用 Button + 确认。</p>
    </div>
  );
}

function LinkBusiness() {
  return (
    <div className="demo-stack">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>项目</th><th>负责人</th><th>状态</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a className="text-link" href="#/components/link" onClick={stopNav}>示例电解液项目</a>
                <span className="table-secondary">project-042</span>
              </td>
              <td>示例用户</td>
              <td><span className="status-badge badge-info"><span className="badge-dot" />进行中</span></td>
            </tr>
            <tr>
              <td>
                <a className="text-link" href="#/components/link" onClick={stopNav}>正极材料对照组</a>
                <span className="table-secondary">project-051</span>
              </td>
              <td>示例用户</td>
              <td><span className="status-badge badge-neutral"><span className="badge-dot" />已归档</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="demo-note">实体名称渲染为链接跳转详情；ID 用等宽字体跟随，不重复做链接。</p>
    </div>
  );
}

/* ---------- Typography ---------- */
function TypographyBasic() {
  return (
    <div className="type-samples">
      <div>
        <span className="type-label">Display · 页面主标题</span>
        <div className="type-display">示例项目（project-042）</div>
      </div>
      <div>
        <span className="type-label">Heading · 区块标题</span>
        <div className="type-heading">基础信息</div>
      </div>
      <div>
        <span className="type-label">Body · 正文</span>
        <div className="type-body">本项目用于验证电解液配方的筛选流程，覆盖导入、计算与复核三个环节。</div>
      </div>
      <div>
        <span className="type-label">Label · 辅助说明</span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>最近更新 · 2026-09-18</span>
      </div>
      <div>
        <span className="type-label">Mono · ID 与数值</span>
        <span className="type-mono">run-28003</span>
      </div>
    </div>
  );
}

function TypographyVariants() {
  return (
    <div className="demo-stack">
      <span style={{ color: "var(--green)", fontSize: 14 }}>计算完成 · 用时 214 秒</span>
      <span style={{ color: "var(--amber)", fontSize: 14 }}>3 个字段待人工复核</span>
      <span style={{ color: "var(--red)", fontSize: 14 }}>任务失败：输入文件缺失</span>
      <span style={{ color: "var(--violet)", fontSize: 14 }}>以下内容由 Agent 生成，请复核后采纳</span>
      <p className="demo-note">语义色只用于状态文本，与 Badge 同一套规则，不用于装饰。</p>
    </div>
  );
}

function TypographyBusiness() {
  return (
    <div className="demo-stack" style={{ gap: 6 }}>
      <span className="type-display" style={{ fontSize: 24.0 }}>NCM811 高温循环实验</span>
      <span className="type-mono">run-28003</span>
      <span style={{ color: "var(--muted)", fontSize: 14 }}>所属项目 示例项目（project-042）· 数据集 ds-118</span>
      <p className="demo-note" style={{ marginTop: 8 }}>名称用 display，ID 用 mono 紧随名称，归属信息用 label —— 层级一眼可扫。</p>
    </div>
  );
}

/* ---------- Divider ---------- */
function DividerBasic() {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 14 }}>项目基础信息与说明，包含名称、负责人与创建时间。</p>
      <div role="separator" style={{ borderTop: "1px solid var(--line)", margin: "20px 0" }} />
      <p style={{ margin: 0, fontSize: 14 }}>参数配置与执行记录，按时间倒序排列。</p>
    </div>
  );
}

function DividerVariants() {
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>参数配置</span>
        <span style={{ flex: 1, borderTop: "1px solid var(--line)" }} />
      </div>
      <div className="demo-row" style={{ gap: 12 }}>
        <button className="button button-ghost button-sm">查看</button>
        <span role="separator" aria-orientation="vertical" style={{ width: 1, height: 16, background: "var(--line-strong)" }} />
        <button className="button button-ghost button-sm">编辑</button>
        <span role="separator" aria-orientation="vertical" style={{ width: 1, height: 16, background: "var(--line-strong)" }} />
        <button className="button button-ghost button-sm">复制</button>
      </div>
      <div style={{ borderTop: "1px dashed var(--line-strong)" }} />
      <p className="demo-note">带文字分割线标记区块起点；垂直分割线只用于工具栏分组；虚线用于弱分隔。</p>
    </div>
  );
}

function DividerBusiness() {
  return (
    <div className="demo-stack" style={{ gap: 10 }}>
      <div className="demo-grid-2" style={{ gap: 8 }}>
        <div>
          <span className="type-label">项目名称</span>
          <div style={{ fontSize: 14 }}>示例电解液项目</div>
        </div>
        <div>
          <span className="type-label">项目 ID</span>
          <div className="mono">project-042</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 2px" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>执行记录</span>
        <span style={{ flex: 1, borderTop: "1px solid var(--line)" }} />
      </div>
      <span className="demo-note">2026-09-18 · 提交计算任务 run-28003</span>
      <span className="demo-note">2026-09-15 · 导入数据集 ds-118</span>
    </div>
  );
}

/* ---------- Badge ---------- */
function BadgeBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="status-badge badge-success"><span className="badge-dot" />已完成</span>
        <span className="status-badge badge-warning"><span className="badge-dot" />待复核</span>
        <span className="status-badge badge-danger"><span className="badge-dot" />失败</span>
        <span className="status-badge badge-info"><span className="badge-dot" />进行中</span>
        <span className="status-badge badge-violet"><span className="badge-dot" />Agent 建议</span>
        <span className="status-badge badge-neutral"><span className="badge-dot" />已归档</span>
      </div>
      <p className="demo-note">颜色与语义一一对应：success 完成 / warning 待复核 / danger 失败 / info 进行中 / violet Agent / neutral 默认。</p>
    </div>
  );
}

function CountBadge({ value }: { value: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <span className="icon-button" style={{ cursor: "default" }}><Bell size={16} /></span>
      <span
        aria-label={`${value} 条未读通知`}
        style={{
          position: "absolute",
          top: -4,
          right: -6,
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          borderRadius: 999,
          background: "var(--red)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value}
      </span>
    </span>
  );
}

function BadgeVariants() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="status-badge badge-success"><span className="badge-dot" />服务正常</span>
        <span className="status-badge badge-info">
          <span className="spinner spinner-dark" style={{ width: 9, height: 9, borderWidth: 1.5 }} aria-hidden="true" />同步中
        </span>
      </div>
      <div className="demo-row" style={{ alignItems: "center" }}>
        <CountBadge value="8" />
        <CountBadge value="99+" />
        <span className="demo-note">count 超过 max 显示 99+；进行中用动效提示仍在变化。</span>
      </div>
    </div>
  );
}

function BadgeBusiness() {
  return (
    <div className="demo-stack">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>任务</th><th>项目</th><th>状态</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>NCM811 高温循环</strong><span className="table-secondary">run-28003</span></td>
              <td><span className="mono">project-042</span></td>
              <td><span className="status-badge badge-success"><span className="badge-dot" />已完成</span></td>
            </tr>
            <tr>
              <td><strong>电解液配方筛选</strong><span className="table-secondary">run-28004</span></td>
              <td><span className="mono">project-042</span></td>
              <td><span className="status-badge badge-info"><span className="badge-dot" />进行中</span></td>
            </tr>
            <tr>
              <td><strong>阻抗谱拟合</strong><span className="table-secondary">run-28005</span></td>
              <td><span className="mono">project-042</span></td>
              <td><span className="status-badge badge-warning"><span className="badge-dot" />待复核</span></td>
            </tr>
            <tr>
              <td><strong>热稳定性预测</strong><span className="table-secondary">run-28006</span></td>
              <td><span className="mono">project-042</span></td>
              <td><span className="status-badge badge-danger"><span className="badge-dot" />失败</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="demo-note">同一列只出现状态徽标；颜色与文案一一对应，不用颜色区分业务类型。</p>
    </div>
  );
}

/* ---------- Tag ---------- */
function TagBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span style={tagStyle}>电解液</span>
        <span className="status-badge badge-info" style={{ borderRadius: 6 }}>内部数据</span>
        <span className="status-badge badge-violet" style={{ borderRadius: 6 }}>Agent 标注</span>
        <span className="status-badge badge-warning" style={{ borderRadius: 6 }}>待确认来源</span>
      </div>
      <p className="demo-note">语义色与 Badge 同一套规则，含义不扩展；普通分类用中性样式。</p>
    </div>
  );
}

function TagVariants() {
  const [filters, setFilters] = useState<string[]>(["项目：project-042", "状态：进行中"]);
  const [checked, setChecked] = useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {filters.map((filter) => (
          <span key={filter} style={tagStyle}>
            {filter}
            <button
              aria-label={`移除筛选 ${filter}`}
              onClick={() => setFilters(filters.filter((item) => item !== filter))}
              style={{ display: "inline-flex", padding: 0, background: "transparent", color: "var(--faint)", cursor: "pointer" }}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {filters.length === 0 && (
          <button className="text-link" onClick={() => setFilters(["项目：project-042", "状态：进行中"])}>恢复筛选条件</button>
        )}
      </div>
      <div className="demo-row">
        <button
          aria-pressed={checked}
          onClick={() => setChecked(!checked)}
          style={{
            ...tagStyle,
            cursor: "pointer",
            background: checked ? "var(--brand-soft)" : "var(--surface-soft)",
            color: checked ? "var(--brand)" : "var(--muted)",
            borderColor: checked ? "color-mix(in srgb, var(--brand) 40%, var(--line))" : "var(--line)",
          }}
        >
          高温循环
        </button>
        <span className="demo-note">可关闭用于已选筛选条件；可选择用填充色表达选中，不用勾选图标。</span>
      </div>
    </div>
  );
}

function TagBusiness() {
  return (
    <div className="demo-stack">
      <div>
        <span className="type-label">数据集 ds-118 · 属性</span>
        <div className="demo-row">
          <span style={tagStyle}>来源：导入</span>
          <span style={tagStyle}>格式：CSV</span>
          <span className="status-badge badge-violet" style={{ borderRadius: 6 }}>Agent 标注：含异常点</span>
        </div>
      </div>
      <div>
        <span className="type-label">已选筛选</span>
        <div className="demo-row">
          <span style={tagStyle}>状态：进行中 <X size={11} style={{ color: "var(--faint)" }} /></span>
          <span style={tagStyle}>项目：project-042 <X size={11} style={{ color: "var(--faint)" }} /></span>
        </div>
      </div>
      <p className="demo-note">属性标签格式「维度：值」；Agent 生成的标注用 violet 并注明来源。</p>
    </div>
  );
}

/* ---------- Card ---------- */
function CardBasic() {
  return (
    <div className="card-demo" style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h4 style={{ margin: 0 }}>计算资源</h4>
        <a className="text-link" href="#/components/card" onClick={stopNav}>额度明细</a>
      </div>
      <p>本月已用 1,280 / 3,000 核时</p>
      <div style={{ marginTop: 12 }}>
        <button className="button button-secondary button-sm">申请扩容</button>
      </div>
    </div>
  );
}

function CardVariants() {
  const [active, setActive] = useState(false);
  return (
    <div className="demo-grid-2">
      <button
        className="card-demo"
        onClick={() => setActive(!active)}
        style={{
          textAlign: "left",
          cursor: "pointer",
          width: "100%",
          font: "inherit",
          border: active ? "1px solid var(--brand)" : "1px solid var(--line)",
        }}
      >
        <h4>示例项目（project-042）</h4>
        <p>12 个数据集 · 34 次运行</p>
        <span className="demo-note">{active ? "已选中（点击演示）" : "hoverable 入口卡，整卡可点"}</span>
      </button>
      <div className="card-demo" aria-busy="true">
        <h4>执行记录</h4>
        <div className="demo-stack" style={{ gap: 8, marginTop: 10 }}>
          <SkeletonBar />
          <SkeletonBar />
          <SkeletonBar width="60%" />
        </div>
      </div>
    </div>
  );
}

function CardBusiness() {
  return (
    <div className="card-demo" style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h4 style={{ margin: 0 }}>示例电解液项目</h4>
        <span className="status-badge badge-info"><span className="badge-dot" />进行中</span>
      </div>
      <p>目标：筛选高温稳定配方，覆盖 3 种溶剂体系。</p>
      <div className="demo-row" style={{ gap: 24, margin: "12px 0" }}>
        <span><strong style={{ fontSize: 18.0 }}>12</strong> <span className="demo-note">数据集</span></span>
        <span><strong style={{ fontSize: 18.0 }}>34</strong> <span className="demo-note">运行次数</span></span>
      </div>
      <button className="button button-ghost button-sm" style={{ paddingLeft: 0 }}>查看详情</button>
    </div>
  );
}

/* ---------- Empty ---------- */
function EmptyBasic() {
  return (
    <div className="demo-stack" style={{ justifyItems: "center", textAlign: "center", padding: "12px 0" }}>
      <span style={{ ...iconCircle("var(--faint)", "var(--surface-soft)"), borderRadius: 12 }}><Inbox size={20} /></span>
      <strong style={{ fontSize: 14 }}>还没有实验记录</strong>
      <span className="demo-note">创建第一个实验后，数据会展示在这里。</span>
      <button className="button button-primary button-sm">新建实验</button>
    </div>
  );
}

function EmptyVariants() {
  return (
    <div className="demo-stack">
      <div className="demo-stack" style={{ justifyItems: "center", textAlign: "center", padding: "4px 0" }}>
        <span style={{ ...iconCircle("var(--faint)", "var(--surface-soft)"), borderRadius: 12 }}><SearchX size={20} /></span>
        <strong style={{ fontSize: 14 }}>没有符合条件的结果</strong>
        <span className="demo-note">尝试调整筛选条件或关键字。</span>
        <button className="button button-secondary button-sm">清除筛选</button>
      </div>
      <div className="empty-line"><span>暂无附件（行内 sm 空态，只保留说明文字）</span></div>
    </div>
  );
}

function EmptyBusiness() {
  return (
    <div className="demo-stack">
      <div className="demo-grid-2">
        <div className="card-demo demo-stack" style={{ justifyItems: "center", textAlign: "center" }}>
          <strong style={{ fontSize: 14 }}>示例项目（project-042）还没有数据集</strong>
          <span className="demo-note">导入或新建数据集后即可开始计算。</span>
          <button className="button button-primary button-sm">导入数据集</button>
        </div>
        <div className="card-demo demo-stack" style={{ justifyItems: "center", textAlign: "center" }}>
          <strong style={{ fontSize: 14 }}>没有符合「进行中」的数据集</strong>
          <span className="demo-note">当前筛选条件下没有结果。</span>
          <button className="button button-ghost button-sm">清除筛选</button>
        </div>
      </div>
      <p className="demo-note">「没有数据」给创建入口，「筛选无结果」给清除筛选 —— 两种空态的文案与动作不同。</p>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function SkeletonBasic() {
  return (
    <div className="demo-stack" aria-busy="true">
      <div className="demo-row" style={{ flexWrap: "nowrap" }}>
        <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-soft)", flex: "0 0 auto" }} />
        <div className="demo-stack" style={{ gap: 6, flex: 1 }}>
          <SkeletonBar width="40%" height={12} />
          <SkeletonBar width="70%" height={9} />
        </div>
      </div>
      <SkeletonBar />
      <SkeletonBar />
      <SkeletonBar width="60%" />
      <p className="demo-note">骨架形状与真实内容一一对应；行数贴近真实内容，替换时不跳动。</p>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="table-wrap" aria-busy="true">
      <table>
        <thead>
          <tr><th>任务</th><th>状态</th><th className="num">用时</th></tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3].map((row) => (
            <tr key={row}>
              <td><SkeletonBar width="80%" /></td>
              <td><SkeletonBar width="56%" /></td>
              <td><SkeletonBar width="40%" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RunTable() {
  const rows = [
    { id: "run-28003", name: "NCM811 高温循环", badge: <span className="status-badge badge-success"><span className="badge-dot" />已完成</span>, time: "214 秒" },
    { id: "run-28004", name: "电解液配方筛选", badge: <span className="status-badge badge-info"><span className="badge-dot" />进行中</span>, time: "—" },
    { id: "run-28005", name: "阻抗谱拟合", badge: <span className="status-badge badge-warning"><span className="badge-dot" />待复核</span>, time: "188 秒" },
  ];
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>任务</th><th>状态</th><th className="num">用时</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><strong>{row.name}</strong><span className="table-secondary">{row.id}</span></td>
              <td>{row.badge}</td>
              <td className="num">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonVariants() {
  return (
    <div className="demo-grid-2">
      <div className="card-demo">
        <span className="type-label">表格骨架 · 保留表头与列结构</span>
        <div style={{ marginTop: 8 }}>
          <SkeletonTable />
        </div>
      </div>
      <div className="card-demo" aria-busy="true">
        <span className="type-label">卡片骨架 · 保留卡片框架</span>
        <div className="demo-stack" style={{ gap: 8, marginTop: 12 }}>
          <SkeletonBar width="45%" height={13} />
          <SkeletonBar />
          <SkeletonBar />
          <SkeletonBar width="60%" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBusiness() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      {loading ? <SkeletonTable /> : <RunTable />}
      <div className="demo-row">
        <button
          className="button button-secondary button-sm"
          disabled={loading}
          onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1500); }}
        >
          模拟重新加载
        </button>
        <span className="demo-note">加载完成后内容原位替换骨架：表头与列位置不动，视线无需重新定位。</span>
      </div>
    </div>
  );
}

/* ---------- Result ---------- */
function ResultBasic() {
  const items = [
    { icon: <CheckCircle2 size={22} />, color: "var(--green)", bg: "var(--green-soft)", title: "任务已提交" },
    { icon: <Info size={22} />, color: "var(--brand)", bg: "var(--brand-soft)", title: "正在排队" },
    { icon: <AlertTriangle size={22} />, color: "var(--amber)", bg: "var(--amber-soft)", title: "部分字段待复核" },
    { icon: <XCircle size={22} />, color: "var(--red)", bg: "var(--red-soft)", title: "任务失败" },
  ];
  return (
    <div className="demo-grid-2">
      {items.map((item) => (
        <div key={item.title} className="demo-stack" style={{ justifyItems: "center", textAlign: "center", gap: 8, padding: 8 }}>
          <span style={iconCircle(item.color, item.bg, 40)}>{item.icon}</span>
          <strong style={{ fontSize: 14 }}>{item.title}</strong>
        </div>
      ))}
    </div>
  );
}

function ResultVariants() {
  return (
    <div className="demo-grid-2">
      <div className="card-demo demo-stack" style={{ justifyItems: "center", textAlign: "center" }}>
        <span style={iconCircle("var(--faint)", "var(--surface-soft)", 40)}><FileQuestion size={20} /></span>
        <strong style={{ fontSize: 14 }}>404 · 页面不存在</strong>
        <span className="demo-note">页面可能已被移动或删除。</span>
        <button className="button button-secondary button-sm">返回首页</button>
      </div>
      <div className="card-demo demo-stack" style={{ justifyItems: "center", textAlign: "center" }}>
        <span style={iconCircle("var(--amber)", "var(--amber-soft)", 40)}><Lock size={20} /></span>
        <strong style={{ fontSize: 14 }}>403 · 无访问权限</strong>
        <span className="demo-note">需要项目 project-042 的查看权限，请联系项目管理员。</span>
        <button className="button button-secondary button-sm">申请权限</button>
      </div>
    </div>
  );
}

function ResultBusiness() {
  return (
    <div className="demo-stack" style={{ justifyItems: "center", textAlign: "center", padding: "8px 0" }}>
      <span style={iconCircle("var(--green)", "var(--green-soft)")}><CheckCircle2 size={22} /></span>
      <strong style={{ fontSize: 15.0 }}>计算任务已提交</strong>
      <span className="demo-note">
        任务 <span className="mono">run-28003</span> 已加入队列，将使用 示例项目（project-042）的额度。
      </span>
      <div className="demo-row" style={{ justifyContent: "center" }}>
        <button className="button button-primary button-sm">查看任务状态</button>
        <button className="button button-secondary button-sm">返回任务列表</button>
      </div>
    </div>
  );
}

export const generalPreviews: Record<string, PreviewFn> = {
  "button/basic": ButtonBasic,
  "button/states": ButtonStates,
  "button/sizes": ButtonSizes,
  "button/business": ButtonBusiness,
  "icon-button/basic": IconButtonBasic,
  "icon-button/states": IconButtonStates,
  "icon-button/sizes": IconButtonSizes,
  "icon-button/business": IconButtonBusiness,
  "link/basic": LinkBasic,
  "link/variants": LinkVariants,
  "link/business": LinkBusiness,
  "typography/basic": TypographyBasic,
  "typography/variants": TypographyVariants,
  "typography/business": TypographyBusiness,
  "divider/basic": DividerBasic,
  "divider/variants": DividerVariants,
  "divider/business": DividerBusiness,
  "badge/basic": BadgeBasic,
  "badge/variants": BadgeVariants,
  "badge/business": BadgeBusiness,
  "tag/basic": TagBasic,
  "tag/variants": TagVariants,
  "tag/business": TagBusiness,
  "card/basic": CardBasic,
  "card/variants": CardVariants,
  "card/business": CardBusiness,
  "empty/basic": EmptyBasic,
  "empty/variants": EmptyVariants,
  "empty/business": EmptyBusiness,
  "skeleton/basic": SkeletonBasic,
  "skeleton/variants": SkeletonVariants,
  "skeleton/business": SkeletonBusiness,
  "result/basic": ResultBasic,
  "result/variants": ResultVariants,
  "result/business": ResultBusiness,
};
