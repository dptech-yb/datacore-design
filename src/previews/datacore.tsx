import {
  ArrowRight,
  ChartPie,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe,
  History,
  Inbox,
  LoaderCircle,
  Pencil,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { PreviewFn } from "./types";

const spinStyle: CSSProperties = { animation: "spin 1s linear infinite" };

const panelStyle: CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 12,
  background: "var(--surface)",
  overflow: "hidden",
};

const optionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  color: "var(--text)",
  cursor: "pointer",
  textAlign: "left",
};

type PermissionScopeLevel = "viewer" | "editor" | "executor" | "admin";

const permissionMeta: Record<PermissionScopeLevel, { label: string; cls: string; icon: React.ReactNode }> = {
  viewer: { label: "仅可见", cls: "badge-neutral", icon: <Eye size={10} /> },
  editor: { label: "可编辑", cls: "badge-info", icon: <Pencil size={10} /> },
  executor: { label: "可执行", cls: "badge-success", icon: <Play size={10} /> },
  admin: { label: "管理员", cls: "badge-warning", icon: <ShieldCheck size={10} /> },
};

function permissionBadge(scope: PermissionScopeLevel) {
  const meta = permissionMeta[scope];
  return (
    <span className={`status-badge ${meta.cls}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

function ConfirmRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="demo-stack" style={{ gap: 6, margin: "10px 0 0" }}>
      {rows.map(([key, value]) => (
        <div key={key} style={{ display: "flex", gap: 10, fontSize: 14 }}>
          <span style={{ width: 34, flex: "0 0 auto", color: "var(--faint)" }}>{key}</span>
          <span style={{ color: "var(--text)" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function SideEffects({ items, danger }: { items: string[]; danger?: boolean }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 10 }}>
      <span style={{ fontSize: 12, color: "var(--faint)" }}>副作用</span>
      <ul
        style={{
          margin: "6px 0 0",
          paddingLeft: 16,
          color: danger ? "var(--red)" : "var(--muted)",
          fontSize: 14,
          display: "grid",
          gap: 4,
        }}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Citation 引用角标 ---------------- */

function CitationBasic() {
  return (
    <div className="citation-demo">
      <p>
        第 3 轮优化后，示例配方 C-09 的电导率达到 8.7 mS/cm，较基线提升 23%
        <sup><a>[1]</a></sup>
        。Agent 建议沿当前方向继续 2 轮探索
        <sup><a>[2]</a></sup>
        。
      </p>
      <div className="source-list">
        <a><span>[1]</span> ds-118 · 第 3 轮实验结果</a>
        <a><span>[2]</span> run-28003 · 优化策略摘要</a>
      </div>
    </div>
  );
}

function CitationLocate() {
  const [located, setLocated] = useState<number | null>(null);
  const sources = [
    { n: 1, title: "ds-118 · 第 3 轮实验结果" },
    { n: 2, title: "run-28003 · 优化策略摘要" },
  ];
  return (
    <div className="demo-stack">
      <div className="citation-demo">
        <p>
          基于第 3 轮实验结果
          <sup><a onClick={() => setLocated(1)}>[1]</a></sup>
          ，建议将 LiFSI 浓度提高至 1.6 mol/kg
          <sup><a onClick={() => setLocated(2)}>[2]</a></sup>
          。
        </p>
        <div className="source-list">
          {sources.map((source) => (
            <a
              key={source.n}
              className={located === source.n ? "source-highlight" : ""}
              onClick={() => setLocated(source.n)}
            >
              <span>[{source.n}]</span> {source.title}
            </a>
          ))}
        </div>
      </div>
      <p className="demo-note">点击角标或来源序号，对应来源项定位并高亮（source-highlight）。</p>
    </div>
  );
}

function CitationUnavailable() {
  return (
    <div className="citation-demo">
      <p>
        早期结论引用的外部文献已下线
        <sup><a style={{ color: "var(--faint)" }}>[3]</a></sup>
        ，该结论待人工复核。
      </p>
      <div className="source-list">
        <div className="source-item">
          <span>[3]</span> 外部文献（example.com，已下线）
          <span className="status-badge badge-warning" style={{ marginLeft: 6 }}>
            <span className="badge-dot" />
            不可访问
          </span>
        </div>
      </div>
    </div>
  );
}

function CitationBusiness() {
  return (
    <div className="card-demo" style={{ maxWidth: 560 }}>
      <div className="demo-row" style={{ marginBottom: 10 }}>
        <Sparkles size={15} style={{ color: "var(--violet)" }} />
        <strong style={{ fontSize: 14 }}>Agent 答复</strong>
        <span className="status-badge badge-violet">
          <span className="badge-dot" />
          已生成
        </span>
      </div>
      <div className="citation-demo">
        <p>
          基于 ds-118 第 3 轮结果
          <sup><a>[1]</a></sup>
          ，建议将 LiFSI 浓度提高至 1.6 mol/kg，预计电导率可达 9.0 mS/cm
          <sup><a>[2]</a></sup>
          。
        </p>
        <div className="source-list">
          <a><span>[1]</span> ds-118 · 第 3 轮实验结果 <ExternalLink size={11} /></a>
          <a><span>[2]</span> run-28003 · 优化策略摘要 <ExternalLink size={11} /></a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SourceCard 来源卡片 ---------------- */

function SourceCardBasic() {
  return (
    <div className="card-demo" style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <FileText size={16} style={{ color: "var(--brand)", marginTop: 2, flex: "0 0 auto" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4>电导率优化第 3 轮实验结果</h4>
          <p>DataCore 实验平台 · 更新于 2026-09-18 14:32</p>
          <div className="demo-row" style={{ marginTop: 10 }}>
            <span className="status-badge badge-success">
              <span className="badge-dot" />
              可访问
            </span>
            <button className="inline-action">打开来源</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceCardAccess() {
  const items: {
    title: string;
    meta: string;
    badge: React.ReactNode;
    action: string;
    dim?: boolean;
  }[] = [
    {
      title: "ds-118 · 第 3 轮实验结果",
      meta: "DataCore 实验平台 · 2026-09-18 14:32",
      badge: (
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          可访问
        </span>
      ),
      action: "打开来源",
    },
    {
      title: "共享溶剂参数库",
      meta: "材料数据联盟（example.com）· 2026-08-30 09:15",
      badge: (
        <span className="status-badge badge-warning">
          <Eye size={10} />
          需申请
        </span>
      ),
      action: "申请权限",
    },
    {
      title: "早期外部文献",
      meta: "example.com · 已下线",
      badge: (
        <span className="status-badge badge-danger">
          <span className="badge-dot" />
          已失效
        </span>
      ),
      action: "查看说明",
      dim: true,
    },
  ];
  return (
    <div className="demo-stack">
      {items.map((item) => (
        <div key={item.title} className="card-demo" style={{ padding: 12, opacity: item.dim ? 0.72 : 1 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FileText size={15} style={{ color: item.dim ? "var(--faint)" : "var(--brand)", flex: "0 0 auto" }} />
            <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
              <strong style={{ fontSize: 14 }}>{item.title}</strong>
              <span style={{ color: "var(--faint)", fontSize: 12 }}>{item.meta}</span>
            </div>
            {item.badge}
            <button className="inline-action" style={{ marginLeft: 0 }}>{item.action}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SourceCardBusiness() {
  const sources = [
    { id: "src-041", title: "电导率优化第 3 轮实验结果", meta: "DataCore 实验平台 · 2026-09-18 14:32" },
    { id: "src-043", title: "优化策略摘要 · run-28003", meta: "DataCore 实验平台 · 2026-09-19 11:07" },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-grid-2">
        {sources.map((source) => (
          <div key={source.id} className="card-demo">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <FileText size={16} style={{ color: "var(--brand)", marginTop: 2, flex: "0 0 auto" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 14 }}>{source.title}</h4>
                <p>{source.meta}</p>
                <div className="demo-row" style={{ marginTop: 10 }}>
                  <span className="status-badge badge-success">
                    <span className="badge-dot" />
                    可访问
                  </span>
                  <button className="inline-action">打开来源</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="demo-note">Agent 答复共引用 2 条来源，与正文角标 [1] [2] 共用同一组 citationId。</p>
    </div>
  );
}

/* ---------------- AgentActivity Agent 活动 ---------------- */

function AgentActivityBasic() {
  return (
    <div className="demo-stack">
      <div className="status-line">
        <CircleCheck size={16} style={{ color: "var(--green)" }} />
        <div>
          <strong>读取输入数据</strong>
          <span>ds-118 · v3 · 128 条记录</span>
        </div>
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          已完成
        </span>
      </div>
      <div
        className="status-line"
        style={{ borderColor: "color-mix(in srgb, var(--violet) 40%, var(--line))", background: "var(--violet-soft)" }}
      >
        <LoaderCircle size={16} style={{ color: "var(--violet)", ...spinStyle }} />
        <div>
          <strong>调用优化工具</strong>
          <span className="mono">conductivity-optimize · round=3 · budget=300s</span>
        </div>
        <span className="status-badge badge-violet">
          <span className="badge-dot" />
          进行中
        </span>
      </div>
      <div className="status-line" style={{ opacity: 0.65 }}>
        <Circle size={14} style={{ color: "var(--faint)" }} />
        <div>
          <strong>生成推荐配方</strong>
          <span>等待上一步完成</span>
        </div>
        <span className="status-badge badge-neutral">待执行</span>
      </div>
    </div>
  );
}

function AgentActivityWaiting() {
  return (
    <div className="demo-stack">
      <div className="status-line">
        <CircleCheck size={16} style={{ color: "var(--green)" }} />
        <div>
          <strong>生成执行计划</strong>
          <span>目标：重新计算电导率 · ds-118 · v3</span>
        </div>
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          已完成
        </span>
      </div>
      <div className="notice-card notice-violet" style={{ marginTop: 0 }}>
        <div className="notice-icon">
          <Sparkles size={18} />
        </div>
        <div>
          <strong>等待用户确认：提交计算任务 run-28003</strong>
          <p>项目：示例项目（project-042）· 预计最长 300 秒 · 已等待 42 秒。确认前流程不会推进。</p>
        </div>
      </div>
      <div className="demo-row">
        <button className="button button-primary">确认执行</button>
        <button className="button button-secondary">修改参数</button>
      </div>
    </div>
  );
}

function AgentActivityFailed() {
  const [state, setState] = useState<"failed" | "running" | "done">("failed");
  return (
    <div className="demo-stack">
      <div className="status-line">
        <CircleCheck size={16} style={{ color: "var(--green)" }} />
        <div>
          <strong>读取输入数据</strong>
          <span>ds-118 · v3 · 128 条记录</span>
        </div>
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          已完成
        </span>
      </div>
      <div className={`status-line ${state === "failed" ? "status-danger" : ""}`}>
        {state === "failed" && <CircleX size={16} />}
        {state === "running" && <LoaderCircle size={16} style={{ color: "var(--violet)", ...spinStyle }} />}
        {state === "done" && <CircleCheck size={16} style={{ color: "var(--green)" }} />}
        <div>
          <strong>调用外部数据库</strong>
          <span>
            {state === "failed" && "连接超时（10s）"}
            {state === "running" && "正在重试…"}
            {state === "done" && "重试成功 · 214 条参考数据"}
          </span>
        </div>
        {state === "failed" ? (
          <button
            className="inline-action"
            onClick={() => {
              setState("running");
              window.setTimeout(() => setState("done"), 1200);
            }}
          >
            <RotateCcw size={11} /> 单步重试
          </button>
        ) : (
          <span className={`status-badge ${state === "done" ? "badge-success" : "badge-violet"}`}>
            <span className="badge-dot" />
            {state === "done" ? "已完成" : "进行中"}
          </span>
        )}
      </div>
      <div className="status-line" style={{ opacity: 0.65 }}>
        <Circle size={14} style={{ color: "var(--faint)" }} />
        <div>
          <strong>生成推荐配方</strong>
          <span>等待上一步完成</span>
        </div>
      </div>
      <p className="demo-note">失败步骤标红并停在原地，可单步重试或人工接管，不静默跳过。</p>
    </div>
  );
}

function AgentActivityBusiness() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Sparkles size={15} style={{ color: "var(--violet)" }} />
        <strong style={{ fontSize: 14 }}>电导率优化 Agent</strong>
        <span className="status-badge badge-violet">
          <span className="badge-dot" />
          运行中
        </span>
      </div>
      <div className="status-line">
        <CircleCheck size={16} style={{ color: "var(--green)" }} />
        <div>
          <strong>读取输入数据</strong>
          <span>ds-118 · v3 · 128 条 · 耗时 3s</span>
        </div>
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          已完成
        </span>
      </div>
      <div className="status-line">
        <CircleCheck size={16} style={{ color: "var(--green)" }} />
        <div>
          <strong>基线模型评估</strong>
          <span>RMSE 0.31 · 耗时 42s</span>
        </div>
        <span className="status-badge badge-success">
          <span className="badge-dot" />
          已完成
        </span>
      </div>
      <div
        className="status-line"
        style={{ borderColor: "color-mix(in srgb, var(--violet) 40%, var(--line))", background: "var(--violet-soft)" }}
      >
        <LoaderCircle size={16} style={{ color: "var(--violet)", ...spinStyle }} />
        <div>
          <strong>调用优化工具</strong>
          <span className="mono">conductivity-optimize · round=3 · target=9.0 mS/cm</span>
        </div>
        <span className="status-badge badge-violet">
          <span className="badge-dot" />
          进行中 · 36s
        </span>
      </div>
      <div className="status-line" style={{ opacity: 0.65 }}>
        <Circle size={14} style={{ color: "var(--faint)" }} />
        <div>
          <strong>生成推荐配方</strong>
          <span>等待上一步完成</span>
        </div>
        <span className="status-badge badge-neutral">待执行</span>
      </div>
      <div className="status-line" style={{ opacity: 0.65 }}>
        <Circle size={14} style={{ color: "var(--faint)" }} />
        <div>
          <strong>写入实验记录</strong>
          <span>记录审计日志</span>
        </div>
        <span className="status-badge badge-neutral">待执行</span>
      </div>
    </div>
  );
}

/* ---------------- RunStatus 运行状态 ---------------- */

function RunStatusBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="status-badge badge-neutral"><Clock size={11} />排队中</span>
        <span className="status-badge badge-info"><LoaderCircle size={11} style={spinStyle} />运行中</span>
        <span className="status-badge badge-success"><CircleCheck size={11} />已成功</span>
      </div>
      <div className="demo-row">
        <span className="status-badge badge-danger"><CircleX size={11} />已失败</span>
        <span className="status-badge badge-warning"><ChartPie size={11} />部分完成</span>
        <span className="status-badge badge-warning"><RotateCcw size={11} />需重试</span>
      </div>
      <p className="demo-note">六态为封闭集合：图标 + 文字表达，不单独依赖颜色。</p>
    </div>
  );
}

function RunStatusDetail() {
  return (
    <div className="demo-stack">
      <div className="status-line status-danger">
        <CircleX size={16} />
        <div>
          <strong>run-28003 · 电导率计算</strong>
          <span>已失败：计算资源超时（exit 124）</span>
        </div>
        <button className="inline-action"><RotateCcw size={11} /> 重试</button>
      </div>
      <div className="status-line status-warning">
        <ChartPie size={16} />
        <div>
          <strong>batch-07 · 批量校验</strong>
          <span>部分完成：12/15 完成，3 条待人工确认</span>
        </div>
        <button className="inline-action">查看明细</button>
      </div>
      <div className="status-line">
        <Clock size={16} style={{ color: "var(--muted)" }} />
        <div>
          <strong>run-28004 · 结构优化</strong>
          <span>排队中：队列第 2 位，预计 5 分钟</span>
        </div>
        <span className="status-badge badge-neutral">
          <span className="badge-dot" />
          排队中
        </span>
      </div>
    </div>
  );
}

function RunStatusFlow() {
  const stages = [
    { badge: <span className="status-badge badge-neutral"><Clock size={11} />排队中</span>, detail: "队列第 1 位" },
    { badge: <span className="status-badge badge-info"><LoaderCircle size={11} style={spinStyle} />运行中</span>, detail: "已运行 36s" },
    { badge: <span className="status-badge badge-success"><CircleCheck size={11} />已成功</span>, detail: "耗时 214s" },
    { badge: <span className="status-badge badge-danger"><CircleX size={11} />已失败</span>, detail: "计算资源超时（exit 124）" },
    { badge: <span className="status-badge badge-warning"><RotateCcw size={11} />需重试</span>, detail: "重试后回到排队中" },
  ];
  const [index, setIndex] = useState(0);
  const stage = stages[index];
  return (
    <div className="demo-stack">
      <div className="status-line">
        <History size={16} style={{ color: "var(--muted)" }} />
        <div>
          <strong>run-28003 · 电导率计算</strong>
          <span>{stage.detail}</span>
        </div>
        {stage.badge}
      </div>
      <div className="demo-row">
        <button className="button button-secondary button-sm" onClick={() => setIndex((i) => (i + 1) % stages.length)}>
          模拟推进
        </button>
        <button className="button button-ghost button-sm" onClick={() => setIndex(0)}>重置</button>
      </div>
      <p className="demo-note">流转由后端事件驱动：排队中 → 运行中 → 成功 / 失败 / 部分完成；失败后进入需重试，重试回到排队中。</p>
    </div>
  );
}

function RunStatusBusiness() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>任务</th><th>项目</th><th>状态</th><th className="num">耗时</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>run-28003</strong><span className="table-secondary">电导率计算</span></td>
            <td>示例项目<span className="table-secondary">project-042</span></td>
            <td><span className="status-badge badge-success"><CircleCheck size={10} />已成功</span></td>
            <td className="num">214s</td>
          </tr>
          <tr>
            <td><strong>run-28004</strong><span className="table-secondary">结构优化</span></td>
            <td>示例项目<span className="table-secondary">project-042</span></td>
            <td><span className="status-badge badge-info"><LoaderCircle size={10} style={spinStyle} />运行中</span></td>
            <td className="num">36s…</td>
          </tr>
          <tr>
            <td><strong>run-28005</strong><span className="table-secondary">批量校验 · batch-07</span></td>
            <td>电解液筛选<span className="table-secondary">project-107</span></td>
            <td>
              <span className="status-badge badge-danger"><CircleX size={10} />已失败</span>
              <span className="table-secondary">计算资源超时 · 可重试</span>
            </td>
            <td className="num">—</td>
          </tr>
          <tr>
            <td><strong>run-28006</strong><span className="table-secondary">批量校验 · batch-08</span></td>
            <td>电解液筛选<span className="table-secondary">project-107</span></td>
            <td><span className="status-badge badge-warning"><ChartPie size={10} />部分完成</span></td>
            <td className="num">12/15</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- ConfirmPanel 确认面板 ---------------- */

function ConfirmPanelBasic() {
  return (
    <div className="card-demo" style={{ maxWidth: 480 }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ShieldCheck size={15} style={{ color: "var(--brand)" }} />
        确认执行：重新计算电导率
      </h4>
      <ConfirmRows
        rows={[
          ["目标", "ds-118 · 第 3 轮推荐配方"],
          ["范围", "创建 1 个 CPU 计算任务"],
          ["项目", "示例项目（project-042）"],
          ["预算", "预计最长 300 秒"],
        ]}
      />
      <SideEffects items={["占用项目算力额度", "写入一条审计日志"]} />
      <div className="demo-row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
        <button className="button button-ghost">取消</button>
        <button className="button button-primary">确认使用 project-042 执行</button>
      </div>
    </div>
  );
}

function ConfirmPanelDanger() {
  return (
    <div className="card-demo" style={{ maxWidth: 480 }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TriangleAlert size={15} style={{ color: "var(--red)" }} />
        确认撤销：run-28003
      </h4>
      <ConfirmRows
        rows={[
          ["目标", "run-28003 · 电导率计算"],
          ["范围", "任务与其中间产物"],
          ["项目", "示例项目（project-042）"],
        ]}
      />
      <div className="status-line status-danger" style={{ marginTop: 12 }}>
        <TriangleAlert size={16} />
        <div>
          <strong>不可逆操作</strong>
          <span>中间结果将被删除，不可恢复；已占用额度不返还</span>
        </div>
      </div>
      <div className="demo-row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
        <button className="button button-ghost">取消</button>
        <button className="button button-danger">确认撤销</button>
      </div>
    </div>
  );
}

function ConfirmPanelBusiness() {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  return (
    <div className="card-demo" style={{ maxWidth: 480 }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ShieldCheck size={15} style={{ color: "var(--brand)" }} />
        确认执行：提交电导率优化计算
      </h4>
      <ConfirmRows
        rows={[
          ["目标", "ds-118 · v3 · 128 条记录"],
          ["范围", "创建 1 个 GPU 计算任务"],
          ["项目", "示例项目（project-042）"],
          ["预算", "预计最长 300 秒"],
        ]}
      />
      <SideEffects items={["占用项目算力额度", "写入审计日志", "结果写回 ds-118"]} />
      {phase === "done" && (
        <div className="dialog-note" style={{ marginTop: 12 }}>
          <CircleCheck size={14} />
          <span>任务 <span className="mono">run-28003</span> 已创建 · 排队中</span>
          <button className="inline-action">查看任务</button>
        </div>
      )}
      <div className="demo-row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
        {phase === "done" ? (
          <button className="button button-ghost" onClick={() => setPhase("idle")}>重置演示</button>
        ) : (
          <>
            <button className="button button-ghost" disabled={phase === "loading"}>取消</button>
            <button
              className="button button-primary"
              disabled={phase === "loading"}
              onClick={() => {
                setPhase("loading");
                window.setTimeout(() => setPhase("done"), 1400);
              }}
            >
              {phase === "loading" && <span className="spinner" aria-hidden="true" />}
              {phase === "loading" ? "正在创建任务" : "确认使用 project-042 执行"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- ProjectSelector 项目选择器 ---------------- */

function ProjectSelectorBasic() {
  const options: { id: string; name: string; isDefault?: boolean; permission: PermissionScopeLevel; selected?: boolean }[] = [
    { id: "project-042", name: "示例项目", isDefault: true, permission: "admin", selected: true },
    { id: "project-107", name: "电解液筛选", permission: "executor" },
    { id: "project-209", name: "共享数据池", permission: "viewer" },
  ];
  return (
    <div className="field" style={{ maxWidth: 440 }}>
      <span>归属项目 <em>*</em></span>
      <div style={panelStyle}>
        {options.map((option, index) => (
          <div
            key={option.id}
            style={{
              ...optionRowStyle,
              borderTop: index ? "1px solid var(--line)" : "none",
              background: option.selected ? "var(--brand-soft)" : "transparent",
            }}
          >
            <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
              <strong style={{ fontSize: 14 }}>{option.name}</strong>
              <span className="mono" style={{ color: "var(--faint)" }}>{option.id}</span>
            </div>
            {option.isDefault && <span className="status-badge badge-info">默认</span>}
            {permissionBadge(option.permission)}
            {option.selected && <Check size={14} style={{ color: "var(--brand)", flex: "0 0 auto" }} />}
          </div>
        ))}
      </div>
      <small>项目是所有计算与数据动作的归属边界；默认项目排在最前，同名项目用 ID 区分。</small>
    </div>
  );
}

function ProjectSelectorLimited() {
  return (
    <div className="field" style={{ maxWidth: 440 }}>
      <span>归属项目 <em>*</em></span>
      <div style={panelStyle}>
        <div style={optionRowStyle}>
          <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
            <strong style={{ fontSize: 14 }}>示例项目</strong>
            <span className="mono" style={{ color: "var(--faint)" }}>project-042</span>
          </div>
          <span className="status-badge badge-info">默认</span>
          {permissionBadge("admin")}
          <Check size={14} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
        </div>
        <div style={{ ...optionRowStyle, borderTop: "1px solid var(--line)", opacity: 0.62, cursor: "not-allowed" }}>
          <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
            <strong style={{ fontSize: 14 }}>共享数据池</strong>
            <span className="mono" style={{ color: "var(--faint)" }}>project-209 · 需要可执行权限</span>
          </div>
          {permissionBadge("viewer")}
          <button className="inline-action" style={{ marginLeft: 0, cursor: "pointer" }}>申请权限</button>
        </div>
      </div>
      <small>权限不足的项目禁用选择但保持可见，标注缺口并提供申请入口，而不是隐藏。</small>
    </div>
  );
}

function ProjectSelectorBusiness() {
  const projects: { id: string; name: string; permission: PermissionScopeLevel }[] = [
    { id: "project-042", name: "示例项目（默认）", permission: "admin" },
    { id: "project-107", name: "电解液筛选", permission: "executor" },
    { id: "project-209", name: "共享数据池", permission: "viewer" },
  ];
  const [value, setValue] = useState("project-042");
  const current = projects.find((project) => project.id === value) ?? projects[0];
  const canExecute = current.permission !== "viewer";
  return (
    <div className="demo-stack" style={{ maxWidth: 440 }}>
      <label className="field">
        <span>归属项目 <em>*</em></span>
        <select className="field-control" value={value} onChange={(event) => setValue(event.target.value)}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name} · {project.id}</option>
          ))}
        </select>
      </label>
      <div className="status-line">
        <ShieldCheck size={16} style={{ color: "var(--brand)" }} />
        <div>
          <strong>{current.name}</strong>
          <span className="mono">{current.id}</span>
        </div>
        {permissionBadge(current.permission)}
      </div>
      <div className="demo-row">
        <button className="button button-primary" disabled={!canExecute}>提交计算任务</button>
        {!canExecute && (
          <span className="demo-note">
            需要可执行权限 · <a style={{ color: "var(--brand)", cursor: "pointer" }}>申请升级</a>
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------- DatasetPicker 数据集选择器 ---------------- */

const datasetOptions = [
  { id: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "计算产出", sourceCls: "badge-violet", records: 128 },
  { id: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "导入", sourceCls: "badge-info", records: 342 },
  { id: "ds-104", name: "黏度共享数据集", batch: "batch-02", version: "v1", source: "共享", sourceCls: "badge-neutral", records: 86 },
];

function DatasetPickerBasic() {
  const [value, setValue] = useState("ds-118");
  return (
    <div className="field" style={{ maxWidth: 480 }}>
      <span>输入数据集 <em>*</em></span>
      <div style={panelStyle}>
        {datasetOptions.map((dataset, index) => {
          const selected = value === dataset.id;
          return (
            <button
              key={dataset.id}
              onClick={() => setValue(dataset.id)}
              style={{
                ...optionRowStyle,
                borderTop: index ? "1px solid var(--line)" : "none",
                background: selected ? "var(--brand-soft)" : "transparent",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: selected ? "4px solid var(--brand)" : "2px solid var(--line-strong)",
                  flex: "0 0 auto",
                }}
              />
              <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
                <strong style={{ fontSize: 14 }}>{dataset.name}</strong>
                <span className="mono" style={{ color: "var(--faint)" }}>{dataset.id} · {dataset.batch} · {dataset.version}</span>
              </div>
              <span className={`status-badge ${dataset.sourceCls}`}>{dataset.source}</span>
              <span className="mono" style={{ color: "var(--muted)", flex: "0 0 auto" }}>{dataset.records} 条</span>
            </button>
          );
        })}
      </div>
      <small>批次、版本、来源与记录数必须同时在场；版本显式选择，不隐式漂移。</small>
    </div>
  );
}

function DatasetPickerMulti() {
  const [selected, setSelected] = useState<string[]>(["ds-118", "ds-092"]);
  const total = datasetOptions
    .filter((dataset) => selected.includes(dataset.id))
    .reduce((sum, dataset) => sum + dataset.records, 0);
  return (
    <div className="field" style={{ maxWidth: 480 }}>
      <span>合并输入（多选）</span>
      <div style={panelStyle}>
        {datasetOptions.map((dataset, index) => {
          const checked = selected.includes(dataset.id);
          return (
            <button
              key={dataset.id}
              onClick={() =>
                setSelected((current) =>
                  checked ? current.filter((id) => id !== dataset.id) : [...current, dataset.id],
                )
              }
              style={{
                ...optionRowStyle,
                borderTop: index ? "1px solid var(--line)" : "none",
                background: checked ? "var(--brand-soft)" : "transparent",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  border: checked ? "1px solid var(--brand)" : "2px solid var(--line-strong)",
                  background: checked ? "var(--brand)" : "transparent",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                {checked && <Check size={10} />}
              </span>
              <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
                <strong style={{ fontSize: 14 }}>{dataset.name}</strong>
                <span className="mono" style={{ color: "var(--faint)" }}>{dataset.id} · {dataset.batch} · {dataset.version}</span>
              </div>
              <span className={`status-badge ${dataset.sourceCls}`}>{dataset.source}</span>
              <span className="mono" style={{ color: "var(--muted)", flex: "0 0 auto" }}>{dataset.records} 条</span>
            </button>
          );
        })}
      </div>
      <small>已选 {selected.length} 个数据集 · 共 {total} 条记录。</small>
    </div>
  );
}

function DatasetPickerEmpty() {
  return (
    <div style={{ maxWidth: 440 }}>
      <div className="empty-line" style={{ display: "grid", justifyItems: "center", gap: 8, textAlign: "center", padding: 22 }}>
        <Inbox size={20} style={{ color: "var(--faint)" }} />
        <strong>暂无可用数据集</strong>
        <span>当前项目（project-042）还没有数据集，导入后即可用于计算。</span>
        <div className="demo-row" style={{ justifyContent: "center", marginTop: 4 }}>
          <button className="button button-primary button-sm">去导入数据</button>
          <button className="button button-ghost button-sm">查看共享数据集</button>
        </div>
      </div>
    </div>
  );
}

function DatasetPickerBusiness() {
  const options = [
    { id: "ds-118@v3", name: "电解液电导率数据集", meta: "ds-118 · batch-07 · v3", source: "计算产出", sourceCls: "badge-violet", records: 128, archived: false },
    { id: "ds-118@v2", name: "电解液电导率数据集", meta: "ds-118 · batch-06 · v2", source: "导入", sourceCls: "badge-info", records: 120, archived: true },
    { id: "ds-092@v5", name: "溶剂化能基准集", meta: "ds-092 · batch-03 · v5", source: "共享", sourceCls: "badge-neutral", records: 342, archived: false },
  ];
  const [value, setValue] = useState("ds-118@v3");
  const current = options.find((option) => option.id === value) ?? options[0];
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <div className="field">
        <span>优化输入数据集 <em>*</em></span>
        <div style={panelStyle}>
          {options.map((option, index) => {
            const selected = value === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setValue(option.id)}
                style={{
                  ...optionRowStyle,
                  borderTop: index ? "1px solid var(--line)" : "none",
                  background: selected ? "var(--brand-soft)" : "transparent",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: selected ? "4px solid var(--brand)" : "2px solid var(--line-strong)",
                    flex: "0 0 auto",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
                  <strong style={{ fontSize: 14 }}>{option.name}</strong>
                  <span className="mono" style={{ color: "var(--faint)" }}>{option.meta}</span>
                </div>
                {option.archived && (
                  <span className="status-badge badge-warning">
                    <span className="badge-dot" />
                    已归档
                  </span>
                )}
                <span className={`status-badge ${option.sourceCls}`}>{option.source}</span>
                <span className="mono" style={{ color: "var(--muted)", flex: "0 0 auto" }}>{option.records} 条</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="demo-note">已选 {current.meta} · {current.records} 条 — 版本固定为所选，不会隐式漂移；已归档版本会给出提示。</p>
    </div>
  );
}

/* ---------------- PermissionScope 权限范围 ---------------- */

function PermissionScopeBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="status-badge badge-neutral"><Eye size={11} />可见</span>
        <span className="status-badge badge-info"><Pencil size={11} />可编辑</span>
        <span className="status-badge badge-success"><Play size={11} />可执行</span>
        <span className="status-badge badge-warning"><ShieldCheck size={11} />管理员</span>
      </div>
      <div className="demo-stack" style={{ gap: 6 }}>
        <p className="demo-note">可见：可以查看数据与结果，不能修改配置或提交计算。</p>
        <p className="demo-note">可编辑：可以修改配置与配方，不能提交计算。</p>
        <p className="demo-note">可执行：可以提交计算任务，不能管理成员。</p>
        <p className="demo-note">管理员：可以管理成员与权限，对项目全量负责。</p>
      </div>
    </div>
  );
}

function PermissionScopeMatrix() {
  const scopes = ["可见", "可编辑", "可执行", "管理员"];
  const capabilities = [
    { action: "查看数据与结果", allow: [true, true, true, true] },
    { action: "编辑配置与配方", allow: [false, true, true, true] },
    { action: "提交计算任务", allow: [false, false, true, true] },
    { action: "管理成员与权限", allow: [false, false, false, true] },
  ];
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>操作</th>
            {scopes.map((scope) => (
              <th key={scope} style={{ textAlign: "center" }}>{scope}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {capabilities.map((capability) => (
            <tr key={capability.action}>
              <td><strong>{capability.action}</strong></td>
              {capability.allow.map((allowed, index) => (
                <td key={scopes[index]} style={{ textAlign: "center" }}>
                  {allowed ? (
                    <Check size={13} style={{ color: "var(--green)" }} />
                  ) : (
                    <X size={12} style={{ color: "var(--line-strong)" }} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionScopeBusiness() {
  const members: { name: string; role: string; scope: PermissionScopeLevel }[] = [
    { name: "张示例", role: "项目创建者", scope: "admin" },
    { name: "李示例", role: "计算工程师", scope: "executor" },
    { name: "王示例", role: "外部协作", scope: "viewer" },
  ];
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      {members.map((member) => (
        <div className="status-line" key={member.name}>
          <UserCheck size={15} style={{ color: "var(--muted)" }} />
          <div>
            <strong>{member.name}</strong>
            <span>{member.role}</span>
          </div>
          {permissionBadge(member.scope)}
        </div>
      ))}
      <div className="demo-row">
        <button className="button button-primary" disabled>提交计算任务</button>
        <span className="demo-note">
          王示例当前为仅可见 · 需要可执行权限 · <a style={{ color: "var(--brand)", cursor: "pointer" }}>申请升级</a>
        </span>
      </div>
    </div>
  );
}

/* ---------------- AuditTimeline 审计时间线 ---------------- */

function AuditRow({
  dot,
  actor,
  action,
  target,
  at,
  badge,
  detail,
  last,
}: {
  dot: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  badge: React.ReactNode;
  detail?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "10px 0",
        borderBottom: last ? "none" : "1px solid var(--line)",
        alignItems: "flex-start",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, marginTop: 6, flex: "0 0 auto" }} />
      <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 1 }}>
        <span style={{ fontSize: 14 }}>
          <strong>{actor}</strong> {action} <span className="mono">{target}</span>
        </span>
        <span style={{ color: "var(--faint)", fontSize: 12 }}>{at}</span>
        {detail && <span style={{ color: "var(--muted)", fontSize: 12 }}>{detail}</span>}
      </div>
      {badge}
    </div>
  );
}

function AuditTimelineBasic() {
  return (
    <div style={{ display: "grid", maxWidth: 560 }}>
      <AuditRow
        dot="var(--brand)"
        actor="李示例"
        action="提交了计算任务"
        target="run-28003"
        at="2026-09-21 10:24"
        badge={<span className="status-badge badge-info">执行</span>}
      />
      <AuditRow
        dot="var(--brand)"
        actor="张示例"
        action="更新了数据集"
        target="ds-118 · v3"
        at="2026-09-21 09:58"
        badge={<span className="status-badge badge-neutral">变更</span>}
      />
      <AuditRow
        dot="var(--green)"
        actor="张示例"
        action="创建了项目"
        target="project-042"
        at="2026-09-20 16:02"
        badge={<span className="status-badge badge-success">创建</span>}
        last
      />
    </div>
  );
}

function AuditTimelineIncident() {
  return (
    <div style={{ display: "grid", maxWidth: 560 }}>
      <AuditRow
        dot="var(--red)"
        actor="系统"
        action="任务执行失败"
        target="run-28003"
        at="2026-09-21 10:31"
        detail="计算资源超时（exit 124）· 任务已进入需重试"
        badge={<span className="status-badge badge-danger">高危</span>}
      />
      <AuditRow
        dot="var(--amber)"
        actor="张示例"
        action="修改了成员权限"
        target="王示例 → 可执行"
        at="2026-09-21 09:12"
        detail="权限变更已通知本人 · 记录不可编辑"
        badge={<span className="status-badge badge-warning">关键</span>}
        last
      />
    </div>
  );
}

function AuditTimelineBusiness() {
  const [filter, setFilter] = useState<"all" | "critical">("all");
  const events = [
    {
      dot: "var(--red)",
      actor: "系统",
      action: "任务执行失败",
      target: "run-28003",
      at: "2026-09-21 10:31",
      level: "critical" as const,
      detail: "计算资源超时（exit 124）",
      badge: <span className="status-badge badge-danger">高危</span>,
    },
    {
      dot: "var(--amber)",
      actor: "李示例",
      action: "确认执行",
      target: "run-28003",
      at: "2026-09-21 10:24",
      level: "warning" as const,
      detail: "确认面板回显：project-042 · 预计 300 秒",
      badge: <span className="status-badge badge-warning">关键</span>,
    },
    {
      dot: "var(--violet)",
      actor: "Agent",
      action: "推荐执行计划",
      target: "重新计算电导率",
      at: "2026-09-21 10:23",
      level: "info" as const,
      badge: <span className="status-badge badge-violet">Agent</span>,
    },
    {
      dot: "var(--brand)",
      actor: "系统",
      action: "任务创建",
      target: "run-28003",
      at: "2026-09-21 10:24",
      level: "info" as const,
      badge: <span className="status-badge badge-neutral">记录</span>,
    },
  ];
  const visible = filter === "all" ? events : events.filter((event) => event.level !== "info");
  return (
    <div className="demo-stack" style={{ maxWidth: 560 }}>
      <div className="demo-row">
        <button
          className={`button button-sm ${filter === "all" ? "button-primary" : "button-secondary"}`}
          onClick={() => setFilter("all")}
        >
          全部（{events.length}）
        </button>
        <button
          className={`button button-sm ${filter === "critical" ? "button-primary" : "button-secondary"}`}
          onClick={() => setFilter("critical")}
        >
          仅关键（{events.filter((event) => event.level !== "info").length}）
        </button>
      </div>
      <div style={{ display: "grid" }}>
        {visible.map((event, index) => (
          <AuditRow
            key={`${event.actor}-${event.at}`}
            dot={event.dot}
            actor={event.actor}
            action={event.action}
            target={event.target}
            at={event.at}
            detail={"detail" in event ? event.detail : undefined}
            badge={event.badge}
            last={index === visible.length - 1}
          />
        ))}
      </div>
      <p className="demo-note">Agent 与系统同样是审计主体：谁在何时对什么做了什么，全部留痕、只增不改。</p>
    </div>
  );
}

/* ---------------- ExperimentStep 实验步骤 ---------------- */

function stepCircle(done: boolean, active: boolean, failed: boolean, index: number) {
  if (done) {
    return (
      <span style={{ color: "white", background: "var(--green)", borderColor: "var(--green)" }}>
        <Check size={12} />
      </span>
    );
  }
  if (failed) {
    return (
      <span style={{ color: "white", background: "var(--red)", borderColor: "var(--red)" }}>
        <X size={12} />
      </span>
    );
  }
  if (active) {
    return <span className="workflow-step-active">{index + 1}</span>;
  }
  return <span>{index + 1}</span>;
}

function ExperimentStepBasic() {
  const steps = ["参数配置", "排队等待", "计算运行", "结果分析", "归档完成"];
  const current = 2;
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {steps.map((name, index) => (
          <div className="workflow-step" key={name}>
            {stepCircle(index < current, index === current, false, index)}
            <strong>{name}</strong>
            {index < steps.length - 1 && <ArrowRight size={16} />}
          </div>
        ))}
      </div>
      <p className="demo-note">当前节点：计算运行 · run-28003 已运行 36s；完成节点绿色对勾，待执行灰色。</p>
    </div>
  );
}

function ExperimentStepFailed() {
  const [state, setState] = useState<"failed" | "running" | "done">("failed");
  const steps = ["参数配置", "排队等待", "计算运行", "结果分析", "归档完成"];
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {steps.map((name, index) => {
          const done = index < 2 || (index === 2 && state === "done");
          const failed = index === 2 && state === "failed";
          const active = index === 2 && state === "running";
          return (
            <div className="workflow-step" key={name}>
              {stepCircle(done, active, failed, index)}
              <strong>{name}</strong>
              {index < steps.length - 1 && <ArrowRight size={16} />}
            </div>
          );
        })}
      </div>
      {state === "failed" && (
        <div className="status-line status-danger">
          <CircleX size={16} />
          <div>
            <strong>计算运行失败</strong>
            <span>计算资源超时（exit 124）· 已完成节点的产物不受影响</span>
          </div>
          <button
            className="inline-action"
            onClick={() => {
              setState("running");
              window.setTimeout(() => setState("done"), 1400);
            }}
          >
            <RotateCcw size={11} /> 原地重试
          </button>
        </div>
      )}
      {state === "running" && (
        <div className="status-line status-info">
          <LoaderCircle size={16} style={spinStyle} />
          <div>
            <strong>正在重试计算运行</strong>
            <span>已重新排队，队列第 1 位</span>
          </div>
        </div>
      )}
      {state === "done" && (
        <div className="status-line status-success">
          <CircleCheck size={16} />
          <div>
            <strong>重试成功</strong>
            <span>计算完成 · 流程进入结果分析</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ExperimentStepBusiness() {
  const nodes = [
    { name: "配方生成", detail: "8 个候选配方" },
    { name: "数据校验", detail: "128 条记录全部通过" },
    { name: "电导率计算", detail: "run-28003 · 214s" },
    { name: "结果分析", detail: "最优 8.7 mS/cm" },
    { name: "报告归档", detail: "report-091 已生成" },
  ];
  const [current, setCurrent] = useState(3);
  const finished = current >= nodes.length;
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {nodes.map((node, index) => (
          <div className="workflow-step" key={node.name}>
            {stepCircle(index < current, index === current && !finished, false, index)}
            <strong>{node.name}</strong>
            {index < nodes.length - 1 && <ArrowRight size={16} />}
          </div>
        ))}
      </div>
      <div className={`status-line ${finished ? "status-success" : "status-info"}`}>
        <FlaskConical size={16} />
        <div>
          <strong>第 3 轮优化</strong>
          <span>{finished ? "全部节点完成 · report-091 已归档" : `当前：${nodes[current].name} · ${nodes[current].detail}`}</span>
        </div>
        {finished ? (
          <span className="status-badge badge-success">
            <span className="badge-dot" />
            已完成
          </span>
        ) : (
          <span className="status-badge badge-info">
            <span className="badge-dot" />
            进行中
          </span>
        )}
      </div>
      <div className="demo-row">
        <button
          className="button button-secondary button-sm"
          disabled={finished}
          onClick={() => setCurrent((value) => Math.min(value + 1, nodes.length))}
        >
          推进演示
        </button>
        <button className="button button-ghost button-sm" onClick={() => setCurrent(0)}>重置</button>
      </div>
    </div>
  );
}

/* ---------------- DataQualityNotice 数据质量提示 ---------------- */

function DataQualityBasic() {
  return (
    <div className="demo-stack">
      <div className="status-line status-warning">
        <TriangleAlert size={16} />
        <div>
          <strong>缺失 · 提醒</strong>
          <span>batch-07 · 12 条记录缺少温度字段</span>
        </div>
        <span className="status-badge badge-warning">提醒</span>
      </div>
      <div className="status-line status-danger">
        <CircleX size={16} />
        <div>
          <strong>冲突 · 阻断</strong>
          <span>batch-07 · 3 条记录与 v2 版本电导率冲突</span>
        </div>
        <span className="status-badge badge-danger">阻断</span>
      </div>
      <div className="status-line status-warning">
        <Globe size={16} />
        <div>
          <strong>来源不可靠 · 提醒</strong>
          <span>src-055 · example.com 近 90 天未更新</span>
        </div>
        <span className="status-badge badge-warning">提醒</span>
      </div>
      <div className="status-line status-warning">
        <UserCheck size={16} />
        <div>
          <strong>待人工确认 · 提醒</strong>
          <span>batch-07 · 8 条 Agent 生成记录待确认</span>
        </div>
        <span className="status-badge badge-warning">提醒</span>
      </div>
    </div>
  );
}

function DataQualityActionable() {
  const [resolved, setResolved] = useState(false);
  return (
    <div className="demo-stack">
      {resolved ? (
        <div className="status-line status-success">
          <CircleCheck size={16} />
          <div>
            <strong>冲突已处理</strong>
            <span>batch-07 · 3 条记录已标记“以 v3 为准”</span>
          </div>
          <span className="status-badge badge-success">已解决</span>
        </div>
      ) : (
        <div className="status-line status-danger">
          <CircleX size={16} />
          <div>
            <strong>冲突 · 阻断</strong>
            <span>batch-07 · 3 条记录与 v2 版本电导率冲突</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="inline-action" style={{ marginLeft: 0 }}>查看冲突</button>
            <button className="inline-action" style={{ marginLeft: 0 }} onClick={() => setResolved(true)}>以 v3 为准</button>
          </div>
        </div>
      )}
      <div className="demo-row">
        <button className="button button-primary" disabled={!resolved}>提交计算</button>
        {!resolved && <span className="demo-note">存在 1 条阻断级问题，处理后才能提交</span>}
      </div>
    </div>
  );
}

function DataQualityBusiness() {
  const [fixed, setFixed] = useState(false);
  return (
    <div className="card-demo" style={{ maxWidth: 560 }}>
      <div className="demo-row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
        <strong style={{ fontSize: 14 }}>ds-118 · batch-07 导入检查</strong>
        {fixed ? (
          <span className="status-badge badge-success">
            <CircleCheck size={10} />
            可提交
          </span>
        ) : (
          <span className="status-badge badge-danger">1 条阻断</span>
        )}
      </div>
      <p className="demo-note">共 128 条记录 · 发现 3 个问题{fixed ? "（阻断已处理，剩余 2 条提醒）" : "（1 条阻断）"}</p>
      <div className="demo-stack" style={{ marginTop: 10 }}>
        {fixed ? (
          <div className="status-line status-success">
            <CircleCheck size={16} />
            <div>
              <strong>冲突 · 已解决</strong>
              <span>batch-07 · 3 条记录已标记“以 v3 为准”</span>
            </div>
            <span className="status-badge badge-success">已解决</span>
          </div>
        ) : (
          <div className="status-line status-danger">
            <CircleX size={16} />
            <div>
              <strong>冲突 · 阻断</strong>
              <span>batch-07 · 3 条记录与 v2 版本电导率冲突</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              <button className="inline-action" style={{ marginLeft: 0 }}>查看冲突</button>
              <button className="inline-action" style={{ marginLeft: 0 }} onClick={() => setFixed(true)}>以 v3 为准</button>
            </div>
          </div>
        )}
        <div className="status-line status-warning">
          <TriangleAlert size={16} />
          <div>
            <strong>缺失 · 提醒</strong>
            <span>batch-07 · 12 条记录缺少温度字段</span>
          </div>
          <button className="inline-action">去补充</button>
        </div>
        <div className="status-line status-warning">
          <UserCheck size={16} />
          <div>
            <strong>待人工确认 · 提醒</strong>
            <span>batch-07 · 8 条 Agent 生成记录</span>
          </div>
          <button className="inline-action">标记已确认</button>
        </div>
      </div>
      <div className="demo-row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
        <button className="button button-ghost button-sm">下载报告</button>
        <button className="button button-primary button-sm" disabled={!fixed}>
          {fixed ? "继续导入" : "继续导入（存在阻断）"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- ToolRunCard 工具运行卡片 ---------------- */

function ToolRunHeader({
  tool,
  badge,
  duration,
}: {
  tool: string;
  badge: React.ReactNode;
  duration: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <Wrench size={14} style={{ color: "var(--muted)", flex: "0 0 auto" }} />
        <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>{tool}</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flex: "0 0 auto" }}>
        {badge}
        <span className="mono" style={{ color: "var(--muted)" }}>{duration}</span>
      </span>
    </div>
  );
}

const paramsLineStyle: CSSProperties = {
  margin: "10px 0 0",
  padding: "7px 9px",
  borderRadius: 7,
  background: "var(--surface-soft)",
  color: "var(--muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

function ToolIoRows({ input, output }: { input: string; output: string }) {
  return (
    <div style={{ display: "grid", gap: 4, marginTop: 10, fontSize: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ color: "var(--faint)", width: 30, flex: "0 0 auto" }}>输入</span>
        <span>{input}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ color: "var(--faint)", width: 30, flex: "0 0 auto" }}>输出</span>
        <span>{output}</span>
      </div>
    </div>
  );
}

function ToolRunCardBasic() {
  return (
    <div className="card-demo" style={{ maxWidth: 520 }}>
      <ToolRunHeader
        tool="conductivity-optimize"
        badge={
          <span className="status-badge badge-success">
            <CircleCheck size={10} />
            已完成
          </span>
        }
        duration="1.24s"
      />
      <p className="mono" style={paramsLineStyle}>round=3 · target=9.0 mS/cm · budget=300s</p>
      <ToolIoRows input="ds-118 · v3 · 128 条" output="8 个候选配方 · 最优 8.7 mS/cm" />
    </div>
  );
}

function ToolRunCardStates() {
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <div className="card-demo">
        <ToolRunHeader
          tool="conductivity-optimize"
          badge={
            <span className="status-badge badge-info">
              <LoaderCircle size={10} style={spinStyle} />
              运行中
            </span>
          }
          duration="36s…"
        />
        <p className="mono" style={paramsLineStyle}>round=4 · target=9.2 mS/cm · budget=300s</p>
        <p className="demo-note" style={{ marginTop: 10 }}>运行中实时刷新耗时，完成后定格。</p>
      </div>
      <div className="card-demo">
        <ToolRunHeader
          tool="fetch-external-data"
          badge={
            <span className="status-badge badge-danger">
              <CircleX size={10} />
              已失败
            </span>
          }
          duration="10.0s"
        />
        <div className="status-line status-danger" style={{ marginTop: 10, minHeight: 0 }}>
          <CircleX size={15} />
          <div>
            <strong>连接 example.com 超时（10s）</strong>
            <span>完整堆栈见展开区 · 重试生成新的调用记录</span>
          </div>
          <button className="inline-action"><RotateCcw size={11} /> 重试</button>
        </div>
      </div>
    </div>
  );
}

function ToolRunCardBusiness() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-demo" style={{ maxWidth: 520 }}>
      <ToolRunHeader
        tool="conductivity-optimize"
        badge={
          <span className="status-badge badge-success">
            <CircleCheck size={10} />
            已完成
          </span>
        }
        duration="3m34s"
      />
      <p className="mono" style={paramsLineStyle}>round=3 · target=9.0 mS/cm · budget=300s</p>
      <ToolIoRows input="ds-118 · v3 · 128 条" output="8 个候选配方 · 最优 8.7 mS/cm" />
      <div className="demo-row" style={{ marginTop: 10 }}>
        <button className="button button-ghost button-sm" onClick={() => setOpen((value) => !value)}>
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {open ? "收起参数" : "展开参数"}
        </button>
      </div>
      {open && (
        <pre
          className="mono"
          style={{
            margin: "10px 0 0",
            padding: 10,
            borderRadius: 8,
            background: "var(--surface-soft)",
            color: "var(--text)",
            fontSize: 12,
            lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
{`{
  "round": 3,
  "target_mS_cm": 9.0,
  "budget_s": 300,
  "dataset": "ds-118@v3",
  "seed": 42
}`}
        </pre>
      )}
    </div>
  );
}

export const datacorePreviews: Record<string, PreviewFn> = {
  "citation/basic": CitationBasic,
  "citation/locate": CitationLocate,
  "citation/unavailable": CitationUnavailable,
  "citation/business": CitationBusiness,
  "source-card/basic": SourceCardBasic,
  "source-card/access": SourceCardAccess,
  "source-card/business": SourceCardBusiness,
  "agent-activity/basic": AgentActivityBasic,
  "agent-activity/waiting": AgentActivityWaiting,
  "agent-activity/failed": AgentActivityFailed,
  "agent-activity/business": AgentActivityBusiness,
  "run-status/basic": RunStatusBasic,
  "run-status/detail": RunStatusDetail,
  "run-status/flow": RunStatusFlow,
  "run-status/business": RunStatusBusiness,
  "confirm-panel/basic": ConfirmPanelBasic,
  "confirm-panel/danger": ConfirmPanelDanger,
  "confirm-panel/business": ConfirmPanelBusiness,
  "project-selector/basic": ProjectSelectorBasic,
  "project-selector/limited": ProjectSelectorLimited,
  "project-selector/business": ProjectSelectorBusiness,
  "dataset-picker/basic": DatasetPickerBasic,
  "dataset-picker/multi": DatasetPickerMulti,
  "dataset-picker/empty": DatasetPickerEmpty,
  "dataset-picker/business": DatasetPickerBusiness,
  "permission-scope/basic": PermissionScopeBasic,
  "permission-scope/matrix": PermissionScopeMatrix,
  "permission-scope/business": PermissionScopeBusiness,
  "audit-timeline/basic": AuditTimelineBasic,
  "audit-timeline/incident": AuditTimelineIncident,
  "audit-timeline/business": AuditTimelineBusiness,
  "experiment-step/basic": ExperimentStepBasic,
  "experiment-step/failed": ExperimentStepFailed,
  "experiment-step/business": ExperimentStepBusiness,
  "data-quality-notice/basic": DataQualityBasic,
  "data-quality-notice/actionable": DataQualityActionable,
  "data-quality-notice/business": DataQualityBusiness,
  "tool-run-card/basic": ToolRunCardBasic,
  "tool-run-card/states": ToolRunCardStates,
  "tool-run-card/business": ToolRunCardBusiness,
};
