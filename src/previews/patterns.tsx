import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, Database, FileUp, GitCompareArrows, History, Lock, Play, RotateCcw, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";
import type { PreviewFn } from "./types";

function AgentConfirmationFlow() {
  const [step, setStep] = useState(0);
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {["Agent 推荐", "用户确认", "执行", "回传"].map((label, index) => (
          <div className="workflow-step" key={label}>
            <span className={index <= step ? "workflow-step-active" : ""}>{index + 1}</span>
            <strong>{label}</strong>
            {index < 3 && <ArrowRight size={16} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="notice-card notice-violet">
          <div className="notice-icon"><Sparkles size={18} /></div>
          <div>
            <strong>Agent 建议：对示例数据集 ds-118 重新计算电导率</strong>
            <p>输入：第 3 轮推荐配方 · 影响：创建 1 个 CPU 任务 · 项目：示例项目（project-042）</p>
          </div>
        </div>
      )}
      {step >= 1 && (
        <div className="notice-card notice-blue">
          <div className="notice-icon"><ShieldCheck size={18} /></div>
          <div>
            <strong>{step === 1 ? "请确认执行范围" : "任务 run-28003 已创建，状态回传中"}</strong>
            <p>{step === 1 ? "目标：重新计算电导率 · 项目：project-042 · 预计 300 秒 · 记录审计日志" : "可在任务详情查看进度；失败会自动回到可重试状态。"}</p>
          </div>
        </div>
      )}
      <div className="demo-row">
        <button className="button button-primary" onClick={() => setStep((value) => Math.min(value + 1, 2))} disabled={step >= 2}>
          {step === 0 ? "查看建议" : step === 1 ? "确认执行" : "已完成"}
        </button>
        <button className="button button-ghost" onClick={() => setStep(0)}>重置演示</button>
      </div>
    </div>
  );
}

function DataImportFlow() {
  const [step, setStep] = useState(0);
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {["上传入临时区", "预览与映射", "校验", "确认写入"].map((label, index) => (
          <div className="workflow-step" key={label}>
            <span className={index <= step ? "workflow-step-active" : ""}>{index + 1}</span>
            <strong>{label}</strong>
            {index < 3 && <ArrowRight size={16} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="notice-card notice-blue">
          <div className="notice-icon"><FileUp size={18} /></div>
          <div>
            <strong>electrolyte_batch_042.csv 已进入临时区</strong>
            <p>128 行 · 6 列 · 尚未触碰正式数据集 ds-118；解析完成后进入预览与字段映射。</p>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="card-demo">
          <h4>字段映射（来源列 → 目标字段）</h4>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>来源列</th><th>目标字段</th><th>类型 / 单位</th><th>映射结果</th></tr>
              </thead>
              <tbody>
                <tr><td>样品编号</td><td className="mono">sample_id</td><td>文本</td><td><span className="status-badge badge-success"><span className="badge-dot" />已匹配</span></td></tr>
                <tr><td>配方</td><td className="mono">formula</td><td>文本</td><td><span className="status-badge badge-success"><span className="badge-dot" />已匹配</span></td></tr>
                <tr><td>电导率</td><td className="mono">conductivity</td><td>数值 · mS/cm</td><td><span className="status-badge badge-warning"><span className="badge-dot" />需确认单位</span></td></tr>
                <tr><td>备注</td><td className="mono">—</td><td>—</td><td><span className="status-badge badge-neutral">忽略此列</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="demo-stack">
          <div className="status-line status-danger">
            <XCircle size={16} />
            <div>
              <strong>3 行缺失 sample_id（阻断）</strong>
              <span>第 12、57、89 行 · 补全或跳过后才能写入</span>
            </div>
          </div>
          <div className="status-line status-warning">
            <AlertTriangle size={16} />
            <div>
              <strong>2 行与 ds-118 现有数据冲突（警告）</strong>
              <span>第 8、64 行 · 默认跳过，可逐条切换为覆盖</span>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="notice-card notice-green">
          <div className="notice-icon"><CheckCircle2 size={18} /></div>
          <div>
            <strong>已写入 123 行 · 数据集 ds-118 升级为 v3</strong>
            <p>跳过 3 行缺失、2 行冲突 · 原始文件已归档为版本附件，可随时回溯到来源行。</p>
          </div>
        </div>
      )}
      <div className="demo-row">
        <button className="button button-primary" onClick={() => setStep((value) => Math.min(value + 1, 3))} disabled={step >= 3}>
          {step === 0 ? "解析并预览" : step === 1 ? "开始校验" : step === 2 ? "确认写入 123 行" : "已完成"}
        </button>
        <button className="button button-ghost" onClick={() => setStep(0)}>重置演示</button>
      </div>
      <p className="demo-note">任何一步失败都不会污染正式数据集；写入是事务性的，原始文件随版本保留。</p>
    </div>
  );
}

function CitationStableId() {
  const sources = [
    { id: 1, title: "第 3 轮电导率优化报告", url: "datacore.example.com/reports/round-3", time: "抓取于 2026-09-18" },
    { id: 2, title: "示例数据集 ds-118 字段说明", url: "datacore.example.com/datasets/ds-118", time: "抓取于 2026-09-15" },
  ];
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="demo-stack">
      <div className="citation-demo">
        <p>
          第 3 轮优化后，示例配方 C-09 的电导率提升至 12.4 mS/cm
          <sup><a href="#src-1" onClick={(event) => { event.preventDefault(); setActive(1); }}>[1]</a></sup>
          ；该结果已写入示例数据集 ds-118 的 v3 版本
          <sup><a href="#src-2" onClick={(event) => { event.preventDefault(); setActive(2); }}>[2]</a></sup>
          ，可在项目内直接复用。
        </p>
        <div className="source-list">
          {sources.map((source) => (
            <a
              key={source.id}
              href={`https://${source.url}`}
              onClick={(event) => event.preventDefault()}
              className={active === source.id ? "source-highlight" : ""}
            >
              <span>[{source.id}]</span> {source.title} · {source.url} · {source.time}
            </a>
          ))}
        </div>
      </div>
      <p className="demo-note">点击角标定位来源：编号在会话内稳定，来源清单包含标题、链接与抓取时间三要素。</p>
    </div>
  );
}

function ProjectPermissionModel() {
  type Role = "admin" | "member" | "guest";
  const roles: { id: Role; label: string }[] = [
    { id: "admin", label: "项目管理员" },
    { id: "member", label: "项目成员" },
    { id: "guest", label: "外部访客" },
  ];
  const matrix: Record<Role, { label: string; allowed: boolean; reason?: string }[]> = {
    admin: [
      { label: "运行计算", allowed: true },
      { label: "导出数据", allowed: true },
      { label: "删除项目", allowed: true },
    ],
    member: [
      { label: "运行计算", allowed: true },
      { label: "导出数据", allowed: true },
      { label: "删除项目", allowed: false, reason: "仅项目管理员可删除项目" },
    ],
    guest: [
      { label: "运行计算", allowed: false, reason: "访客仅可查看，运行需项目成员及以上" },
      { label: "导出数据", allowed: false, reason: "访客不可导出项目数据" },
      { label: "删除项目", allowed: false, reason: "仅项目管理员可删除项目" },
    ],
  };
  const [role, setRole] = useState<Role>("member");
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {roles.map((item) => (
          <button
            key={item.id}
            className={item.id === role ? "button button-sm button-primary" : "button button-sm button-secondary"}
            onClick={() => setRole(item.id)}
          >
            {item.label}
          </button>
        ))}
        <span className="demo-note">资源范围：示例项目（project-042）</span>
      </div>
      {matrix[role].map((action) => (
        <div
          key={action.label}
          className="demo-row"
          style={{ justifyContent: "space-between", padding: "10px 13px", border: "1px solid var(--line)", borderRadius: 10 }}
        >
          <div className="demo-row" style={{ gap: 10 }}>
            <button className="button button-sm button-secondary" disabled={!action.allowed}>{action.label}</button>
            {!action.allowed && (
              <span className="demo-note" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Lock size={12} />{action.reason}
              </span>
            )}
          </div>
          <span className={action.allowed ? "status-badge badge-success" : "status-badge badge-neutral"}>
            {action.allowed ? "允许" : "禁用"}
          </span>
        </div>
      ))}
      <p className="demo-note">前端禁用只是提示：后端对每个请求二次鉴权，伪造可用按钮或直接调用接口都会被拒绝。</p>
    </div>
  );
}

function ReservationSchedulingFlow() {
  const slots = [
    { time: "09:00 – 10:00", busy: false },
    { time: "10:00 – 11:00", busy: true, owner: "run-28002" },
    { time: "13:00 – 14:00", busy: false },
    { time: "15:00 – 16:00", busy: false },
  ];
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="status-badge badge-info"><Database size={11} /> device-07</span>
        <span className="demo-note">电导率测试台 · 2026-09-23 · 时段粒度 1 小时</span>
        <span className="status-badge badge-success"><span className="badge-dot" />设备可用</span>
      </div>
      <div className="demo-row">
        {slots.map((slot, index) => (
          <button
            key={slot.time}
            className={index === selected ? "button button-sm button-primary" : "button button-sm button-secondary"}
            disabled={slot.busy}
            title={slot.busy ? `该时段已被 ${slot.owner} 预约，建议选择相邻空闲时段` : undefined}
            onClick={() => { setSelected(index); setConfirmed(false); }}
          >
            {slot.time}{slot.busy ? ` · ${slot.owner}` : ""}
          </button>
        ))}
      </div>
      {selected !== null && !confirmed && (
        <div className="notice-card notice-blue">
          <div className="notice-icon"><CalendarClock size={18} /></div>
          <div>
            <strong>预约草稿：device-07 · 2026-09-23 {slots[selected].time}</strong>
            <p>关联项目：示例项目（project-042）· 用途：第 4 轮配方复测 · 确认后生成预约编号</p>
          </div>
        </div>
      )}
      {confirmed && selected !== null && (
        <div className="notice-card notice-green">
          <div className="notice-icon"><CheckCircle2 size={18} /></div>
          <div>
            <strong>预约成功 · rsv-3102</strong>
            <p>device-07 · 2026-09-23 {slots[selected].time} · project-042 · 已写入审计，可随时取消</p>
          </div>
        </div>
      )}
      <div className="demo-row">
        <button className="button button-primary" disabled={selected === null || confirmed} onClick={() => setConfirmed(true)}>确认预约</button>
        <button className="button button-ghost" onClick={() => { setSelected(null); setConfirmed(false); }}>重置演示</button>
      </div>
      <p className="demo-note">被占用时段置灰并标注占用方；确认前回显完整草稿，确认后回显预约编号与取消入口。</p>
    </div>
  );
}

function RunStatusLogsMachine() {
  // 0 排队 · 1 运行 · 2 成功 · 3 失败
  const [phase, setPhase] = useState(0);
  const logsByPhase: Record<number, string[]> = {
    0: ["09:41:02 [info] 任务 run-28003 已进入队列，当前位置 1/3"],
    1: ["09:41:02 [info] 任务 run-28003 已进入队列，当前位置 1/3", "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）"],
    2: ["09:41:02 [info] 任务 run-28003 已进入队列，当前位置 1/3", "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）", "09:44:37 [info] 计算完成，126/126 个样品全部成功"],
    3: ["09:41:02 [info] 任务 run-28003 已进入队列，当前位置 1/3", "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）", "09:43:55 [error] 第 3 批输入缺字段 conductivity，任务终止"],
  };
  const badge = [
    <span key="q" className="status-badge badge-neutral"><span className="badge-dot" />排队中</span>,
    <span key="r" className="status-badge badge-info"><span className="badge-dot" />运行中</span>,
    <span key="s" className="status-badge badge-success"><span className="badge-dot" />成功</span>,
    <span key="f" className="status-badge badge-danger"><span className="badge-dot" />失败</span>,
  ];
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="mono" style={{ color: "var(--muted)" }}>run-28003</span>
        {badge[phase]}
        {phase === 1 && <span className="demo-note">已运行 1 分 45 秒 · 日志跟随中</span>}
        {phase === 3 && <span className="demo-note">已写入数据安全 · 可保留参数重试</span>}
      </div>
      <div style={{ display: "grid", gap: 4, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface-soft)" }}>
        {logsByPhase[phase].map((line) => (
          <span key={line} className="mono" style={{ color: line.includes("[error]") ? "var(--red)" : "var(--muted)" }}>{line}</span>
        ))}
      </div>
      <div className="demo-row">
        {phase === 0 && (
          <button className="button button-primary" onClick={() => setPhase(1)}><Play size={14} /> 开始运行</button>
        )}
        {phase === 1 && (
          <>
            <button className="button button-primary" onClick={() => setPhase(2)}>模拟成功</button>
            <button className="button button-danger" onClick={() => setPhase(3)}>模拟失败</button>
          </>
        )}
        {phase === 2 && <button className="button button-primary" disabled>已完成</button>}
        {phase === 3 && (
          <button className="button button-primary" onClick={() => setPhase(1)}><RotateCcw size={14} /> 重试任务</button>
        )}
        <button className="button button-ghost" onClick={() => setPhase(0)}>重置演示</button>
      </div>
      <p className="demo-note">状态机是唯一的真实来源；重试会保留原参数并生成新的运行实例，失败记录留在审计中。</p>
    </div>
  );
}

function AuditVersioningWhoWhat() {
  const events = [
    { time: "2026-09-20 14:02", actor: "示例账号 zhangming", badge: "badge-info", action: "修改", text: "字段映射调整：conductivity 单位 mS/cm → S/m，影响 126 行" },
    { time: "2026-09-19 10:31", actor: "系统自动", badge: "badge-neutral", action: "导入", text: "数据集 ds-118 创建版本 v3（写入 123 行，原始文件已归档）" },
    { time: "2026-09-18 16:20", actor: "示例账号 zhangming", badge: "badge-violet", action: "采纳建议", text: "采纳 Agent 建议，更新第 3 轮推荐配方参数" },
  ];
  const [showDiff, setShowDiff] = useState(false);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <History size={14} style={{ color: "var(--muted)" }} />
        <span className="demo-note">审计时间线 · 数据集 ds-118 · 倒序</span>
      </div>
      {events.map((item) => (
        <div
          key={item.time}
          style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 8, padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 10 }}
        >
          <span className="mono" style={{ color: "var(--faint)" }}>{item.time}</span>
          <span style={{ color: "var(--text)", fontSize: 14, fontWeight: 700 }}>{item.actor}</span>
          <span className={`status-badge ${item.badge}`}>{item.action}</span>
          <span style={{ color: "var(--muted)", fontSize: 14, flex: "1 1 260px" }}>{item.text}</span>
        </div>
      ))}
      <div className="demo-row">
        <button className="button button-sm button-secondary" onClick={() => setShowDiff((value) => !value)}>
          <GitCompareArrows size={13} /> {showDiff ? "收起版本对比" : "对比 v2 → v3"}
        </button>
      </div>
      {showDiff && (
        <div className="card-demo">
          <h4>ds-118 · v2 → v3 差异（仅展示变更字段）</h4>
          <div style={{ display: "grid", gap: 6 }}>
            <span className="mono" style={{ color: "var(--muted)" }}>
              conductivity[57]：<s style={{ color: "var(--red)" }}>9.8</s> → <strong style={{ color: "var(--green)" }}>10.1</strong>（修改）
            </span>
            <span className="mono" style={{ color: "var(--green)" }}>+ 新增 3 行（sample_id S-1124 – S-1126）</span>
            <span className="mono" style={{ color: "var(--muted)" }}>− 删除 0 行</span>
          </div>
        </div>
      )}
      <p className="demo-note">恢复历史版本会创建一个新版本，原版本依然可查；审计记录只增不改。</p>
    </div>
  );
}

export const patternPreviews: Record<string, PreviewFn> = {
  "agent-confirmation/flow": AgentConfirmationFlow,
  "data-import/flow": DataImportFlow,
  "citation-source/stable-id": CitationStableId,
  "project-permission/model": ProjectPermissionModel,
  "reservation-scheduling/flow": ReservationSchedulingFlow,
  "run-status-logs/state-machine": RunStatusLogsMachine,
  "audit-versioning/who-what": AuditVersioningWhoWhat,
};
