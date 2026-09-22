import { ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import type { PreviewFn } from "./types";

function ListPageStructure() {
  const rows = [
    { id: "run-28003", project: "project-042", status: "成功", badge: "badge-success", duration: "147", updated: "2026-09-20 09:44" },
    { id: "run-28002", project: "project-042", status: "运行中", badge: "badge-info", duration: "—", updated: "2026-09-20 09:42" },
    { id: "run-27998", project: "project-041", status: "失败", badge: "badge-danger", duration: "96", updated: "2026-09-20 08:17" },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ justifyContent: "space-between" }}>
        <div className="demo-row" style={{ gap: 6 }}>
          <button className="button button-sm button-primary">全部状态</button>
          <button className="button button-sm button-secondary">运行中</button>
          <button className="button button-sm button-secondary">失败</button>
        </div>
        <button className="button button-sm button-primary">新建计算任务</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>任务 ID</th><th>项目</th><th>状态</th><th className="num">用时（秒）</th><th>更新时间</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="mono">{row.id}</td>
                <td>{row.project}</td>
                <td><span className={`status-badge ${row.badge}`}><span className="badge-dot" />{row.status}</span></td>
                <td className="num">{row.duration}</td>
                <td><span className="table-secondary">{row.updated}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="demo-row" style={{ justifyContent: "space-between" }}>
        <span className="demo-note">共 128 条 · 第 1 / 43 页</span>
        <div className="demo-row" style={{ gap: 6 }}>
          <button className="button button-sm button-secondary" disabled>上一页</button>
          <button className="button button-sm button-secondary">下一页</button>
        </div>
      </div>
    </div>
  );
}

function DetailPageStructure() {
  const fields: [string, string][] = [
    ["负责人", "示例账号 zhangming"],
    ["数据集", "ds-118 · 当前版本 v3"],
    ["优化目标", "电导率 ≥ 12 mS/cm"],
    ["最近更新", "2026-09-20 14:02"],
  ];
  return (
    <div className="demo-stack">
      <div className="card-demo" style={{ display: "grid", gap: 14 }}>
        <div className="demo-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <div className="demo-row" style={{ gap: 8 }}>
              <strong style={{ fontSize: 15 }}>示例项目 · 电解液电导率优化</strong>
              <span className="status-badge badge-success"><span className="badge-dot" />进行中</span>
            </div>
            <span className="mono" style={{ color: "var(--faint)" }}>project-042 · 创建于 2026-08-30</span>
          </div>
          <div className="demo-row">
            <button className="button button-sm button-primary">启动第 5 轮计算</button>
            <button className="button button-sm button-secondary">导出报告</button>
            <button className="button button-sm button-danger">归档</button>
          </div>
        </div>
        <div className="demo-grid-2" style={{ gap: 8 }}>
          {fields.map(([label, value]) => (
            <div key={label} style={{ display: "flex", gap: 10, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8 }}>
              <span style={{ flex: "0 0 56px", color: "var(--faint)", fontSize: 11 }}>{label}</span>
              <span style={{ color: "var(--text)", fontSize: 12 }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="demo-row">
          <span className="demo-note">关联数据：</span>
          <span className="status-badge badge-info">任务 run-28003 · 成功</span>
          <span className="status-badge badge-violet">Agent 建议 · 2 条待确认</span>
          <span className="status-badge badge-neutral">引用 · 4 条</span>
        </div>
      </div>
      <p className="demo-note">首屏回答：这是什么、现在什么状态、能对它做什么；属性空值显示“未设置”而不是留白。</p>
    </div>
  );
}

function FormWizardStructure() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("第 5 轮电导率复测");
  const [budget, setBudget] = useState("300");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameValid = name.trim().length > 0;
  const budgetValid = /^\d+$/.test(budget.trim()) && Number(budget) > 0;
  const stepValid = step === 0 ? nameValid : budgetValid;
  const goNext = () => {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setStep((value) => Math.min(value + 1, 2));
  };
  const reset = () => {
    setStep(0);
    setName("第 5 轮电导率复测");
    setBudget("300");
    setTouched(false);
    setSubmitted(false);
  };
  return (
    <div className="demo-stack">
      <div className="workflow-line">
        {["基本信息", "参数配置", "确认提交"].map((label, index) => (
          <div className="workflow-step" key={label}>
            <span className={index <= (submitted ? 2 : step) ? "workflow-step-active" : ""}>{index + 1}</span>
            <strong>{label}</strong>
            {index < 2 && <ArrowRight size={16} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <label className={!nameValid && touched ? "field field-error" : "field"} style={{ maxWidth: 340 }}>
          任务名称 <em>*</em>
          <input className="field-control" value={name} onChange={(event) => setName(event.target.value)} />
          {!nameValid && touched ? <small>任务名称不能为空</small> : <small>名称将展示在任务列表与审计记录中</small>}
        </label>
      )}
      {step === 1 && (
        <label className={!budgetValid && touched ? "field field-error" : "field"} style={{ maxWidth: 340 }}>
          预计时长（秒）<em>*</em>
          <input className="field-control" value={budget} onChange={(event) => setBudget(event.target.value)} />
          {!budgetValid && touched ? <small>请输入大于 0 的整数秒数</small> : <small>关联项目：示例项目（project-042）· 资源：CPU</small>}
        </label>
      )}
      {step === 2 && !submitted && (
        <div className="notice-card notice-blue">
          <div className="notice-icon"><CheckCircle2 size={18} /></div>
          <div>
            <strong>请确认全部输入</strong>
            <p>任务名称：{name} · 预计时长：{budget} 秒 · 项目：project-042 · 资源：CPU · 提交后立即创建任务并记录审计</p>
          </div>
        </div>
      )}
      {submitted && (
        <div className="status-line status-success">
          <CheckCircle2 size={16} />
          <div>
            <strong>任务 run-28004 已创建 · 排队中</strong>
            <span>可在任务详情追踪状态与日志；不会停留在向导里猜结果。</span>
          </div>
        </div>
      )}
      <div className="demo-row">
        {step > 0 && !submitted && (
          <button className="button button-ghost" onClick={() => { setStep((value) => Math.max(value - 1, 0)); setTouched(false); }}>上一步</button>
        )}
        {step < 2 && <button className="button button-primary" onClick={goNext}>下一步</button>}
        {step === 2 && !submitted && <button className="button button-primary" onClick={() => setSubmitted(true)}>确认提交</button>}
        {submitted && <button className="button button-primary" disabled>已提交</button>}
        <button className="button button-ghost" onClick={reset}>重置演示</button>
      </div>
      <p className="demo-note">每步独立校验，通过才放行；最后一步只回显、不再编辑。</p>
    </div>
  );
}

function TaskWorkbenchStructure() {
  const tasks = [
    { id: "run-28003", status: "成功", badge: "badge-success", project: "project-042", updated: "09:44", log: "126/126 个样品计算完成" },
    { id: "run-28002", status: "运行中", badge: "badge-info", project: "project-042", updated: "09:42", log: "第 2/4 批计算中，日志跟随中" },
    { id: "run-27998", status: "失败", badge: "badge-danger", project: "project-041", updated: "08:17", log: "输入缺字段 conductivity，可保留参数重试" },
    { id: "run-27995", status: "排队中", badge: "badge-neutral", project: "project-042", updated: "08:02", log: "队列位置 2/5，预计等待 6 分钟" },
  ];
  const filters = ["全部", "运行中", "失败", "排队中"];
  const [filter, setFilter] = useState("全部");
  const [selectedId, setSelectedId] = useState("run-28002");
  const [checked, setChecked] = useState<string[]>([]);
  const visible = tasks.filter((task) => filter === "全部" || task.status === filter);
  const selected = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const toggle = (id: string) => setChecked((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  return (
    <div className="demo-stack">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 250px) minmax(0, 1fr)", gap: 12, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div className="demo-row" style={{ gap: 6 }}>
            {filters.map((item) => (
              <button key={item} className={item === filter ? "button button-sm button-primary" : "button button-sm button-secondary"} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
          {visible.map((task) => (
            <div
              key={task.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(task.id)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedId(task.id); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", cursor: "pointer",
                border: `1px solid ${task.id === selected.id ? "var(--brand)" : "var(--line)"}`,
                borderRadius: 9,
                background: task.id === selected.id ? "var(--brand-soft)" : "var(--surface)",
              }}
            >
              <input
                type="checkbox"
                checked={checked.includes(task.id)}
                onChange={() => toggle(task.id)}
                onClick={(event) => event.stopPropagation()}
                aria-label={`选择 ${task.id}`}
              />
              <span className="mono" style={{ color: "var(--text)" }}>{task.id}</span>
              <span className={`status-badge ${task.badge}`} style={{ marginLeft: "auto" }}>{task.status}</span>
            </div>
          ))}
        </div>
        <div className="card-demo" style={{ display: "grid", gap: 10 }}>
          <div className="demo-row" style={{ justifyContent: "space-between" }}>
            <strong className="mono">{selected.id}</strong>
            <span className={`status-badge ${selected.badge}`}><span className="badge-dot" />{selected.status}</span>
          </div>
          <p className="demo-note">项目 {selected.project} · 更新于 {selected.updated} · {selected.log}</p>
          <div className="demo-row">
            <button className="button button-sm button-secondary">查看完整日志</button>
            {selected.status === "失败" && (
              <button className="button button-sm button-primary"><RotateCcw size={12} /> 重试</button>
            )}
          </div>
        </div>
      </div>
      {checked.length > 0 && (
        <div className="status-line status-info">
          <div>
            <strong>已选 {checked.length} 项</strong>
            <span>批量操作逐条返回结果，失败项可单独重试</span>
          </div>
          <button className="inline-action">批量重试</button>
          <button className="inline-action">批量取消</button>
        </div>
      )}
      <p className="demo-note">列表行只承载最小决策信息；选中态在左右两栏保持一致。</p>
    </div>
  );
}

function DataImportPageStructure() {
  const [written, setWritten] = useState(false);
  return (
    <div className="demo-stack">
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, border: "1.5px dashed var(--line-strong)", borderRadius: 12, background: "var(--surface)" }}>
        <Upload size={18} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13 }}>electrolyte_batch_042.csv</strong>
          <p className="demo-note">128 行 · 已解析进入临时区，正式数据集尚未变更</p>
        </div>
        <span className="status-badge badge-info" style={{ marginLeft: "auto" }}><span className="badge-dot" />临时区</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th className="num">行</th><th>sample_id</th><th>formula</th><th className="num">conductivity</th><th>校验结果</th></tr>
          </thead>
          <tbody>
            <tr><td className="num">8</td><td className="mono">S-1008</td><td>EC/DMC 1:1</td><td className="num">11.2</td><td><span className="status-badge badge-warning">与现有冲突</span></td></tr>
            <tr><td className="num">12</td><td className="mono" style={{ color: "var(--red)" }}>缺失</td><td>EC/EMC 3:7</td><td className="num">9.6</td><td><span className="status-badge badge-danger">缺失主键</span></td></tr>
            <tr><td className="num">57</td><td className="mono">S-1057</td><td>EC/DEC 1:1</td><td className="num">10.8</td><td><span className="status-badge badge-success">通过</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className="demo-row" style={{ justifyContent: "space-between", padding: "10px 13px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)" }}>
        <span className="demo-note">写入 125 行到 ds-118（新版本 v4）· 覆盖 2 行 · 原始文件随版本归档</span>
        <button className="button button-primary" disabled={written} onClick={() => setWritten(true)}>
          {written ? "已写入" : "确认写入"}
        </button>
      </div>
      {written && (
        <div className="status-line status-success">
          <CheckCircle2 size={16} />
          <div>
            <strong>写入完成 · ds-118 已升级到 v4</strong>
            <span>可立即查看版本差异摘要；写入为事务，失败会整体回滚。</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentWorkspaceStructure() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="demo-stack">
      <div className="status-line status-info">
        <Sparkles size={16} />
        <div>
          <strong>Agent 已分析 ds-118 v3（126 行）</strong>
          <span>识别 2 个建议复测的样品 · 用时 8 秒</span>
        </div>
      </div>
      {!confirmed ? (
        <div className="notice-card notice-violet">
          <div className="notice-icon"><ShieldCheck size={18} /></div>
          <div>
            <strong>待确认：对 S-1008、S-1057 重新计算电导率</strong>
            <p>项目 project-042 · 预计 120 秒 · 将创建 1 个 CPU 任务 · 记录审计日志</p>
            <div className="demo-row" style={{ marginTop: 10 }}>
              <button className="button button-sm button-primary" onClick={() => setConfirmed(true)}>确认执行</button>
              <button className="button button-sm button-ghost">忽略建议</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="status-line status-success">
            <CheckCircle2 size={16} />
            <div>
              <strong>任务 run-28005 成功 · 结果已写入 ds-118 v4</strong>
              <span>S-1008 电导率 11.2 → 11.6 mS/cm [1]</span>
            </div>
          </div>
          <div className="source-list">
            <a href="https://datacore.example.com/datasets/ds-118" onClick={(event) => event.preventDefault()}>
              <span>[1]</span> 示例数据集 ds-118 版本 v4 · datacore.example.com/datasets/ds-118 · 抓取于 2026-09-22
            </a>
          </div>
        </>
      )}
      <p className="demo-note">动态流、确认面板与结果区各司其职；结果中的事实必须带引用编号并解析到来源清单。</p>
    </div>
  );
}

export const templatePreviews: Record<string, PreviewFn> = {
  "list-page/structure": ListPageStructure,
  "detail-page/structure": DetailPageStructure,
  "form-wizard/structure": FormWizardStructure,
  "task-workbench/structure": TaskWorkbenchStructure,
  "data-import-page/structure": DataImportPageStructure,
  "agent-workspace/structure": AgentWorkspaceStructure,
};
