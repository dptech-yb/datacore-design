import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { PreviewFn } from "./types";

/* ---------- 共享演示元件（仅本文件内部使用） ---------- */

const triggerBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  border: "1px solid var(--line-strong)",
  borderRadius: 8,
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: 12,
};

function SelectTrigger({ label, placeholder, width, small }: { label: string; placeholder?: boolean; width?: number | string; small?: boolean }) {
  return (
    <span style={{ ...triggerBase, height: small ? 29 : 37, padding: small ? "0 9px" : "0 10px", width, fontSize: small ? 11.5 : 12 }}>
      <span style={{ color: placeholder ? "var(--faint)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <ChevronDown size={small ? 12 : 14} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
    </span>
  );
}

const panelStyle: CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 10,
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  overflow: "hidden",
  fontSize: 12,
};

function OptionRow({ label, hint, selected, disabled }: { label: ReactNode; hint?: string; selected?: boolean; disabled?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        color: disabled ? "var(--faint)" : "var(--text)",
        background: selected ? "var(--brand-soft)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      {hint && <span style={{ color: "var(--faint)", fontSize: 11, flex: "0 0 auto" }}>{hint}</span>}
      {selected && <Check size={14} style={{ color: "var(--brand)", flex: "0 0 auto" }} />}
    </div>
  );
}

function CheckboxBox({ state }: { state: "off" | "on" | "mixed" }) {
  return (
    <span
      style={{
        width: 15,
        height: 15,
        borderRadius: 4,
        border: state === "off" ? "1.5px solid var(--line-strong)" : "1.5px solid var(--brand)",
        background: state === "off" ? "var(--surface)" : "var(--brand)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flex: "0 0 auto",
      }}
    >
      {state === "on" && <Check size={11} strokeWidth={3} />}
      {state === "mixed" && <Minus size={11} strokeWidth={3} />}
    </span>
  );
}

function RadioDot({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 15,
        height: 15,
        borderRadius: "50%",
        border: on ? "1.5px solid var(--brand)" : "1.5px solid var(--line-strong)",
        background: "var(--surface)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
      }}
    >
      {on && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)" }} />}
    </span>
  );
}

function SwitchTrack({ on, loading, disabled, label, onToggle }: { on: boolean; loading?: boolean; disabled?: boolean; label: string; onToggle?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled || loading}
      onClick={onToggle}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        border: 0,
        padding: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        background: on ? "var(--brand)" : "var(--line-strong)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        opacity: disabled ? 0.45 : 1,
        transition: "background .16s ease",
        flex: "0 0 auto",
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "white", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {loading && <span className="spinner-dark" style={{ width: 10, height: 10, borderWidth: 1.5 }} />}
      </span>
    </button>
  );
}

function TagChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 24,
        padding: onRemove ? "0 5px 0 9px" : "0 9px",
        borderRadius: 6,
        background: "var(--brand-soft)",
        color: "var(--brand)",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {onRemove && (
        <button type="button" aria-label={`移除筛选：${label}`} onClick={onRemove} style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer", display: "inline-flex", padding: 1 }}>
          <X size={11} />
        </button>
      )}
    </span>
  );
}

const stepButton: CSSProperties = {
  width: 30,
  border: 0,
  background: "var(--surface-soft)",
  color: "var(--muted)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

function NumberStepper({ value, onChange, step, min, max, unit, digits }: { value: number; onChange: (next: number) => void; step: number; min: number; max: number; unit?: string; digits?: number }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(digits ?? 2))));
  return (
    <span style={{ display: "inline-flex", alignItems: "stretch", border: "1px solid var(--line-strong)", borderRadius: 8, overflow: "hidden", background: "var(--surface)", height: 37 }}>
      <button type="button" aria-label="减少" onClick={() => onChange(clamp(value - step))} style={stepButton}>
        <Minus size={13} />
      </button>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 10px", minWidth: 76, fontSize: 12, fontFamily: '"DM Mono", monospace', color: "var(--text)" }}>
        {digits !== undefined ? value.toFixed(digits) : value}
        {unit && <span style={{ color: "var(--faint)", marginLeft: 4 }}>{unit}</span>}
      </span>
      <button type="button" aria-label="增加" onClick={() => onChange(clamp(value + step))} style={stepButton}>
        <Plus size={13} />
      </button>
    </span>
  );
}

function SearchBox({ value, onChange, placeholder, loading, onClear, width }: { value?: string; onChange?: (next: string) => void; placeholder?: string; loading?: boolean; onClear?: () => void; width?: number | string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 37, padding: "0 10px", border: "1px solid var(--line-strong)", borderRadius: 8, background: "var(--surface)", width: width ?? 320 }}>
      <Search size={14} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
      <input
        type="search"
        aria-label={placeholder ?? "搜索"}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--text)", fontSize: 12 }}
      />
      {loading && <span className="spinner-dark" aria-label="正在搜索" />}
      {!loading && onClear && value && (
        <button type="button" aria-label="清除搜索" onClick={onClear} style={{ border: 0, background: "transparent", color: "var(--faint)", cursor: "pointer", display: "inline-flex", padding: 2 }}>
          <X size={13} />
        </button>
      )}
    </span>
  );
}

function CalendarPanel({ selectedDay, disableAfter }: { selectedDay?: number; disableAfter?: number }) {
  const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
  const cells: (number | null)[] = [null, ...Array.from({ length: 30 }, (_, index) => index + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return (
    <div style={{ ...panelStyle, padding: 10, width: 252 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px 8px", fontSize: 12, fontWeight: 700 }}>
        <span>2026 年 9 月</span>
        <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 11 }}>今天 9/22</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {weekdays.map((day) => (
          <span key={day} style={{ textAlign: "center", color: "var(--faint)", fontSize: 10, padding: "2px 0" }}>
            {day}
          </span>
        ))}
        {cells.map((day, index) => {
          const disabled = day !== null && disableAfter !== undefined && day > disableAfter;
          const selected = day === selectedDay;
          return (
            <span
              key={index}
              aria-disabled={disabled || undefined}
              style={{
                textAlign: "center",
                padding: "4px 0",
                borderRadius: 6,
                fontSize: 11,
                color: day === null ? "transparent" : disabled ? "var(--faint)" : selected ? "white" : "var(--text)",
                background: selected ? "var(--brand)" : "transparent",
                opacity: disabled ? 0.55 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {day ?? "·"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DateTrigger({ value, width }: { value: string; width?: number | string }) {
  return (
    <span style={{ ...triggerBase, height: 37, padding: "0 10px", width: width ?? 190, justifyContent: "flex-start" }}>
      <Calendar size={14} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
      <span style={{ color: value ? "var(--text)" : "var(--faint)" }}>{value || "选择日期"}</span>
    </span>
  );
}

function RangeTrigger({ start, end, width }: { start?: string; end?: string; width?: number | string }) {
  return (
    <span style={{ ...triggerBase, height: 37, padding: "0 10px", width: width ?? 260, justifyContent: "flex-start", gap: 7 }}>
      <Calendar size={14} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
      <span style={{ color: start ? "var(--text)" : "var(--faint)" }}>{start || "开始日期"}</span>
      <span style={{ color: "var(--faint)" }}>~</span>
      <span style={{ color: end ? "var(--text)" : "var(--faint)" }}>{end || "结束日期"}</span>
    </span>
  );
}

/* ---------- Input ---------- */

function InputBasic() {
  return (
    <div className="demo-grid-2">
      <label className="field">
        项目名称
        <input className="field-control" style={{ fontWeight: 400 }} placeholder="例如：高导电解液筛选" />
      </label>
      <label className="field">
        样本编号
        <span style={{ position: "relative", display: "block" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--faint)", fontSize: 12, fontWeight: 400 }}>SMP-</span>
          <input className="field-control" style={{ paddingLeft: 46, fontWeight: 400 }} placeholder="00042" />
        </span>
      </label>
    </div>
  );
}

function InputSizes() {
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ alignItems: "center" }}>
        <input className="field-control" style={{ height: 29, width: 180, fontSize: 11.5, fontWeight: 400 }} placeholder="sm · 筛选栏与行内" />
        <input className="field-control" style={{ width: 180, fontWeight: 400 }} placeholder="md · 默认尺寸" />
        <input className="field-control" style={{ height: 45, width: 180, fontSize: 13, fontWeight: 400 }} placeholder="lg · 页面级录入" />
      </div>
      <p className="demo-note">sm 用于筛选栏和表格行内；lg 仅用于独立录入页。</p>
    </div>
  );
}

function InputStates() {
  return (
    <div className="demo-grid-2">
      <label className="field">
        所属项目
        <input className="field-control" style={{ fontWeight: 400 }} value="示例项目（project-042）" disabled readOnly />
        <small>项目归档后不可修改归属。</small>
      </label>
      <label className="field field-error">
        任务名称
        <input className="field-control" style={{ fontWeight: 400 }} defaultValue="第 3 轮/优化" aria-invalid="true" />
        <small role="alert">名称不能包含 / \ : 字符。</small>
      </label>
    </div>
  );
}

function InputBusiness() {
  const [value, setValue] = useState("示例项目（project-042）");
  return (
    <div style={{ maxWidth: 420 }}>
      <label className="field">
        项目名称
        <input className="field-control" style={{ fontWeight: 400 }} id="project-name" value={value} maxLength={40} onChange={(event) => setValue(event.target.value)} />
        <small>名称用于列表展示与导出文件命名，2–40 个字符，项目内唯一。当前 {value.length}/40。</small>
      </label>
    </div>
  );
}

/* ---------- InputNumber ---------- */

function InputNumberBasic() {
  const [value, setValue] = useState(1.5);
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ alignItems: "center" }}>
        <NumberStepper value={value} onChange={setValue} step={0.1} min={0} max={100} digits={1} />
        <span className="demo-note">min 0 · max 100 · step 0.1</span>
      </div>
      <p className="demo-note">步进按钮与 ↑ / ↓ 方向键完全等价。</p>
    </div>
  );
}

function InputNumberPrecisionUnit() {
  const [mass, setMass] = useState(12.4);
  const [cycles, setCycles] = useState(200);
  return (
    <div className="demo-row" style={{ alignItems: "flex-start" }}>
      <label className="field" style={{ minWidth: 190 }}>
        称量质量（precision 2）
        <NumberStepper value={mass} onChange={setMass} step={0.1} min={0} max={500} unit="mg" digits={2} />
      </label>
      <label className="field" style={{ minWidth: 190 }}>
        循环次数（precision 0）
        <NumberStepper value={cycles} onChange={setCycles} step={10} min={1} max={2000} unit="次" digits={0} />
      </label>
    </div>
  );
}

function InputNumberBusiness() {
  const [mass, setMass] = useState(12.4);
  return (
    <div style={{ maxWidth: 420 }}>
      <label className="field">
        称量质量
        <NumberStepper value={mass} onChange={setMass} step={0.1} min={0} max={500} unit="mg" digits={2} />
        <small>精度与天平一致（0.01 mg），量程 0–500 mg；留空表示未称量，不等于 0。</small>
      </label>
    </div>
  );
}

/* ---------- Textarea ---------- */

function TextareaBasic() {
  return (
    <div style={{ maxWidth: 520 }}>
      <label className="field">
        实验备注
        <textarea className="field-control" style={{ fontWeight: 400 }} rows={3} placeholder="记录实验现象、异常与处理" />
      </label>
    </div>
  );
}

function TextareaCountAutosize() {
  const [value, setValue] = useState("充电末期温升偏高：第 42 圈峰值 41.2 ℃，已降倍率复测。");
  const nearLimit = value.length > 450;
  return (
    <div style={{ maxWidth: 520 }}>
      <label className="field">
        失败原因说明
        <span style={{ position: "relative", display: "block" }}>
          <textarea className="field-control" style={{ fontWeight: 400, paddingBottom: 22 }} rows={3} maxLength={500} value={value} onChange={(event) => setValue(event.target.value)} />
          <span style={{ position: "absolute", right: 10, bottom: 7, fontSize: 10, fontWeight: 400, color: nearLimit ? "var(--amber)" : "var(--faint)" }}>{value.length}/500</span>
        </span>
        <small>autoSize 在 3–8 行间伸缩；接近上限时计数变为警示色。</small>
      </label>
    </div>
  );
}

function TextareaBusiness() {
  const [value, setValue] = useState("第 3 轮配方 D，充电末期温升偏高，已降倍率复测；复测数据同步至 ds-118。");
  return (
    <div style={{ maxWidth: 520 }}>
      <label className="field">
        实验备注（<span className="mono">run-28003</span>）
        <span style={{ position: "relative", display: "block" }}>
          <textarea className="field-control" style={{ fontWeight: 400, paddingBottom: 22 }} rows={3} maxLength={500} value={value} onChange={(event) => setValue(event.target.value)} />
          <span style={{ position: "absolute", right: 10, bottom: 7, fontSize: 10, fontWeight: 400, color: "var(--faint)" }}>{value.length}/500</span>
        </span>
        <small>备注将进入审计记录，导出报告时一并携带，请客观描述事实。</small>
      </label>
    </div>
  );
}

/* ---------- Select ---------- */

function SelectBasic() {
  const options = ["运行中", "排队中", "已完成"];
  const [selected, setSelected] = useState("运行中");
  return (
    <div className="demo-stack" style={{ maxWidth: 260 }}>
      <SelectTrigger label={selected} width="100%" />
      <div style={panelStyle}>
        {options.map((option) => (
          <div key={option} onClick={() => setSelected(option)} style={{ cursor: "pointer" }}>
            <OptionRow label={option} selected={option === selected} />
          </div>
        ))}
      </div>
      <p className="demo-note">单选点选即确认并关闭面板，已选值回显在触发器内。</p>
    </div>
  );
}

function SelectMultiple() {
  const [selected, setSelected] = useState(["高导配方", "第 3 轮"]);
  return (
    <div className="demo-stack" style={{ maxWidth: 340 }}>
      <span style={{ ...triggerBase, height: "auto", minHeight: 37, padding: "5px 10px", gap: 6, flexWrap: "wrap", justifyContent: "flex-start" }}>
        {selected.length === 0 && <span style={{ color: "var(--faint)" }}>选择标签</span>}
        {selected.map((tag) => (
          <TagChip key={tag} label={tag} onRemove={() => setSelected((list) => list.filter((item) => item !== tag))} />
        ))}
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4 }}>
          {selected.length > 0 && (
            <button type="button" aria-label="清空全部" onClick={() => setSelected([])} style={{ border: 0, background: "transparent", color: "var(--faint)", cursor: "pointer", display: "inline-flex", padding: 2 }}>
              <X size={13} />
            </button>
          )}
          <ChevronDown size={14} style={{ color: "var(--faint)" }} />
        </span>
      </span>
      <p className="demo-note">多选已选值以 Tag 回显，可单个移除；allowClear 一键清空。</p>
    </div>
  );
}

function SelectBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 340 }}>
      <SelectTrigger label="电导率筛选第 3 轮（ds-118）" width="100%" />
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderBottom: "1px solid var(--line)", color: "var(--muted)" }}>
          <Search size={13} style={{ color: "var(--faint)" }} />
          <span style={{ color: "var(--text)" }}>ds-1</span>
          <span style={{ color: "var(--faint)", fontSize: 11, marginLeft: "auto" }}>3 个匹配</span>
        </div>
        <OptionRow label="电导率筛选第 3 轮" hint="ds-118" selected />
        <OptionRow label="热稳定性复测" hint="ds-120" />
        <OptionRow label="空白对照组" hint="ds-121" />
      </div>
      <p className="demo-note">选项超过 8 个时必须开启搜索；无匹配时空态文案为“没有匹配的数据集”。</p>
    </div>
  );
}

/* ---------- Combobox ---------- */

function ComboboxBasic() {
  const highlight = (label: string) => (
    <span>
      <strong style={{ color: "var(--brand)", fontWeight: 700 }}>碳酸</strong>
      {label.slice(2)}
    </span>
  );
  return (
    <div className="demo-stack" style={{ maxWidth: 300 }}>
      <span style={{ ...triggerBase, height: 37, padding: "0 10px" }}>
        <span style={{ color: "var(--text)" }}>碳酸</span>
        <span style={{ width: 1, height: 15, background: "var(--brand)" }} />
      </span>
      <div style={panelStyle}>
        <OptionRow label={highlight("碳酸乙烯酯")} hint="EC" />
        <OptionRow label={highlight("碳酸二甲酯")} hint="DMC" />
      </div>
      <p className="demo-note">输入即时过滤，匹配片段高亮显示。</p>
    </div>
  );
}

function ComboboxAllowCreate() {
  return (
    <div className="demo-stack" style={{ maxWidth: 300 }}>
      <span style={{ ...triggerBase, height: 37, padding: "0 10px" }}>
        <span style={{ color: "var(--text)" }}>碳酸亚乙烯酯</span>
      </span>
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "var(--brand)", background: "var(--brand-soft)", cursor: "pointer", fontWeight: 600 }}>
          <Plus size={14} />
          <span>创建：碳酸亚乙烯酯</span>
        </div>
        <OptionRow label="碳酸乙烯酯" hint="已有相似项" />
      </div>
      <p className="demo-note">无匹配时首项固定为创建入口；已有相似项前置提示，避免重复数据。</p>
    </div>
  );
}

function ComboboxBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 320 }}>
      <span style={{ ...triggerBase, height: 37, padding: "0 10px" }}>
        <span style={{ color: "var(--text)" }}>恒温箱</span>
      </span>
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
          <span style={{ flex: 1 }}>恒温箱 07</span>
          <span className="status-badge badge-success"><span className="badge-dot" />可用</span>
          <Check size={14} style={{ color: "var(--brand)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "var(--faint)", cursor: "not-allowed" }}>
          <span style={{ flex: 1 }}>恒温箱 09</span>
          <span className="status-badge badge-neutral">维护中</span>
        </div>
      </div>
      <p className="demo-note">选项带状态副信息；不可用仪器禁用并注明原因。</p>
    </div>
  );
}

/* ---------- DatePicker ---------- */

function DatePickerBasic() {
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start" }}>
      <DateTrigger value="2026-09-22" />
      <CalendarPanel selectedDay={22} />
      <p className="demo-note">点选日期即确认；也支持手动输入，失焦时解析。</p>
    </div>
  );
}

function DatePickerDisabledDate() {
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start" }}>
      <CalendarPanel disableAfter={22} />
      <p className="demo-note">未来日期在面板内直接禁用并弱化显示，而不是选中后再报错。</p>
    </div>
  );
}

function DatePickerBusiness() {
  return (
    <div style={{ maxWidth: 420 }}>
      <label className="field">
        预约日期
        <DateTrigger value="2026-09-24" width="100%" />
        <small>可预约未来 14 天，需提前 2 小时；预约计入 示例项目（project-042）额度。</small>
      </label>
    </div>
  );
}

/* ---------- DateRangePicker ---------- */

function DateRangePickerBasic() {
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <RangeTrigger start="2026-09-01" end="2026-09-22" />
        <span className="status-badge badge-info">22 天</span>
      </span>
      <p className="demo-note">第一次点击选开始，第二次点击选结束；悬停实时预览区间。</p>
    </div>
  );
}

const rangePresets: { label: string; range: [string, string] }[] = [
  { label: "最近 7 天", range: ["2026-09-16", "2026-09-22"] },
  { label: "最近 30 天", range: ["2026-08-24", "2026-09-22"] },
  { label: "本轮次", range: ["2026-09-01", "2026-09-22"] },
];

function DateRangePickerPresets() {
  const [active, setActive] = useState(2);
  const [start, end] = rangePresets[active].range;
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start" }}>
      <div className="demo-row">
        {rangePresets.map((preset, index) => (
          <button
            key={preset.label}
            className="button button-secondary button-sm"
            onClick={() => setActive(index)}
            style={index === active ? { borderColor: "var(--brand)", color: "var(--brand)", background: "var(--brand-soft)" } : undefined}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <RangeTrigger start={start} end={end} />
      <p className="demo-note">快捷项一键填充；命名必须具体——“最近 7 天”含今天。</p>
    </div>
  );
}

function DateRangePickerBusiness() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <RangeTrigger start="2026-09-01" end="2026-09-22" />
        <button className="button button-ghost button-sm" onClick={() => undefined}>清除筛选</button>
      </div>
      <p className="demo-note">已选 22 天 · 命中 18 个任务 · 区间含开始与结束当日 · 应用到 示例项目（project-042）的任务列表。</p>
    </div>
  );
}

/* ---------- Checkbox ---------- */

function CheckboxBasic() {
  const items = ["同时导出原始数据", "包含失败步骤", "仅当前项目（project-042）"];
  const [checked, setChecked] = useState([true, false, false]);
  return (
    <div className="demo-stack" style={{ gap: 10 }}>
      {items.map((item, index) => (
        <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }} onClick={() => setChecked((list) => list.map((value, i) => (i === index ? !value : value)))}>
          <CheckboxBox state={checked[index] ? "on" : "off"} />
          <span>{item}</span>
        </label>
      ))}
      <p className="demo-note">点击方框或文案都切换；勾选只改变待提交状态。</p>
    </div>
  );
}

function CheckboxIndeterminate() {
  const children = ["ds-118", "ds-120", "ds-121"];
  const [checked, setChecked] = useState([true, false, false]);
  const selectedCount = checked.filter(Boolean).length;
  const parentState = selectedCount === 0 ? "off" : selectedCount === children.length ? "on" : "mixed";
  return (
    <div className="demo-stack" style={{ gap: 10 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }} onClick={() => setChecked(checked.map(() => selectedCount !== children.length))}>
        <CheckboxBox state={parentState} />
        <span>全选（已选 {selectedCount} / {children.length}）</span>
      </label>
      <div style={{ display: "grid", gap: 10, paddingLeft: 23 }}>
        {children.map((child, index) => (
          <label key={child} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }} onClick={() => setChecked((list) => list.map((value, i) => (i === index ? !value : value)))}>
            <CheckboxBox state={checked[index] ? "on" : "off"} />
            <span className="mono">{child}</span>
          </label>
        ))}
      </div>
      <p className="demo-note">部分选中时父级呈半选态；点击父级在全选 / 全不选间切换。</p>
    </div>
  );
}

function CheckboxBusiness() {
  const datasets = [
    { id: "ds-118", name: "电导率筛选第 3 轮" },
    { id: "ds-120", name: "热稳定性复测" },
    { id: "ds-121", name: "空白对照组" },
  ];
  const [selected, setSelected] = useState<string[]>(["ds-118", "ds-120"]);
  const toggle = (id: string) => setSelected((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  return (
    <div className="demo-stack" style={{ maxWidth: 420 }}>
      {datasets.map((dataset) => (
        <label key={dataset.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 10, cursor: "pointer", fontSize: 12 }}>
          <span onClick={(event) => { event.preventDefault(); toggle(dataset.id); }} style={{ display: "inline-flex" }}>
            <CheckboxBox state={selected.includes(dataset.id) ? "on" : "off"} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: "block", fontSize: 12 }}>{dataset.name}</strong>
            <span className="mono" style={{ color: "var(--faint)" }}>{dataset.id}</span>
          </span>
        </label>
      ))}
      <div className="demo-row">
        <span className="demo-note">已选 {selected.length} / 3 项</span>
        <button className="button button-secondary button-sm" disabled={selected.length === 0}>批量导出</button>
        <button className="button button-ghost button-sm" disabled={selected.length === 0} onClick={() => setSelected([])}>清空选择</button>
      </div>
      <p className="demo-note">勾选只更新待提交状态；批量动作需显式触发并二次确认。</p>
    </div>
  );
}

/* ---------- Radio ---------- */

function RadioBasic() {
  const options = ["全部", "运行中", "已完成"];
  const [value, setValue] = useState("all");
  const keys = ["all", "running", "finished"];
  return (
    <div className="demo-stack" style={{ gap: 10 }}>
      <div role="radiogroup" aria-label="任务状态" className="demo-row">
        {options.map((option, index) => (
          <label key={option} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, cursor: "pointer" }} onClick={() => setValue(keys[index])}>
            <RadioDot on={value === keys[index]} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <p className="demo-note">选项平铺一眼看全；方向键在同组内移动并选中。</p>
    </div>
  );
}

const modeCards = [
  { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒" },
  { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 消耗额度" },
];

function RadioCard({ option, selected, disabled, onSelect }: { option: { value: string; label: string; description: string }; selected: boolean; disabled?: boolean; onSelect?: () => void }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onSelect}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "11px 12px",
        border: selected ? "1.5px solid var(--brand)" : "1px solid var(--line)",
        borderRadius: 10,
        background: selected ? "var(--brand-soft)" : "var(--surface)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <RadioDot on={selected} />
      <span style={{ minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: 12 }}>{option.label}</strong>
        <span style={{ color: "var(--muted)", fontSize: 11 }}>{option.description}</span>
      </span>
    </div>
  );
}

function RadioCardOptions() {
  const [value, setValue] = useState("fast");
  return (
    <div className="demo-grid-2" role="radiogroup" aria-label="计算模式">
      {modeCards.map((option) => (
        <RadioCard key={option.value} option={option} selected={value === option.value} onSelect={() => setValue(option.value)} />
      ))}
    </div>
  );
}

function RadioBusiness() {
  const options = [
    ...modeCards.map((option) => ({
      ...option,
      description: option.value === "fast" ? "CPU · 约 30 秒 · 不计额度" : "GPU · 约 300 秒 · 计入 project-042 额度",
    })),
    { value: "ultra", label: "超高精度", description: "需申请权限" },
  ];
  const [value, setValue] = useState("precise");
  return (
    <div className="demo-stack">
      <div className="demo-grid-2" role="radiogroup" aria-label="计算模式">
        {options.map((option) => (
          <RadioCard key={option.value} option={option} selected={value === option.value} disabled={option.value === "ultra"} onSelect={() => setValue(option.value)} />
        ))}
      </div>
      <p className="demo-note">有代价的档位写明代价；无权限档位禁用并注明，不隐藏。</p>
    </div>
  );
}

/* ---------- Switch ---------- */

function SwitchBasic() {
  const [mail, setMail] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  return (
    <div className="demo-stack" style={{ gap: 12 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, cursor: "pointer" }}>
        <SwitchTrack on={mail} label="邮件通知" onToggle={() => setMail((value) => !value)} />
        <span>邮件通知</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, cursor: "pointer" }}>
        <SwitchTrack on={autoSave} label="自动保存" onToggle={() => setAutoSave((value) => !value)} />
        <span>自动保存</span>
      </label>
      <p className="demo-note">点击即生效，无需保存按钮；标签写清控制对象。</p>
    </div>
  );
}

function SwitchStates() {
  const [syncOn, setSyncOn] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
  const [shareOn, setShareOn] = useState(false);
  const [sharePending, setSharePending] = useState(false);
  const [failed, setFailed] = useState(false);
  const toggleSync = () => {
    setSyncPending(true);
    window.setTimeout(() => {
      setSyncOn((value) => !value);
      setSyncPending(false);
    }, 900);
  };
  const toggleShare = () => {
    setSharePending(true);
    setFailed(false);
    window.setTimeout(() => {
      setSharePending(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2600);
    }, 900);
  };
  return (
    <div className="demo-stack" style={{ gap: 12 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
        <SwitchTrack on={syncOn} loading={syncPending} label="远程同步" onToggle={toggleSync} />
        <span>远程同步{syncPending && <span style={{ color: "var(--muted)" }}>（写入中…）</span>}</span>
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
        <SwitchTrack on={shareOn} loading={sharePending} label="团队共享" onToggle={toggleShare} />
        <span>团队共享（演示失败回滚）</span>
        {failed && (
          <span role="alert" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--red)", fontSize: 11 }}>
            <AlertCircle size={12} />
            保存失败，已回滚
          </span>
        )}
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--muted)" }}>
        <SwitchTrack on={false} disabled label="数据分析" />
        <span>数据分析（需管理员开启）</span>
      </label>
      <p className="demo-note">异步写入成功才切换位置；失败回滚到原位置并提示，不留假态。</p>
    </div>
  );
}

function SwitchBusiness() {
  const [on, setOn] = useState(true);
  return (
    <div className="demo-stack" style={{ maxWidth: 460 }}>
      <div className="card-demo" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <SwitchTrack on={on} label="任务自动刷新" onToggle={() => setOn((value) => !value)} />
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13 }}>任务自动刷新</strong>
          <p>开启后每 30 秒刷新 <span className="mono">run-28003</span> 的状态，关闭即停止，无需任何提交动作。</p>
        </div>
      </div>
      <p className="demo-note" style={{ color: on ? "var(--green)" : "var(--muted)" }}>
        {on ? "已开启 · 状态每 30 秒自动更新" : "已关闭 · 状态需手动刷新"}
      </p>
    </div>
  );
}

/* ---------- Form ---------- */

function FormBasic() {
  return (
    <div className="demo-stack" style={{ maxWidth: 420, gap: 14 }}>
      <label className="field">
        任务名称 <em>*</em>
        <input className="field-control" style={{ fontWeight: 400 }} placeholder="例如：第 3 轮电导率优化" />
        <small>用于列表与导出命名，2–40 个字符。</small>
      </label>
      <label className="field">
        所属项目 <em>*</em>
        <SelectTrigger label="选择项目" placeholder width="100%" />
      </label>
      <p className="demo-note">垂直布局是默认：标签在上、辅助文本常驻在控件下方；必填星号与校验规则配套。</p>
    </div>
  );
}

function FormValidation() {
  const [value, setValue] = useState("620");
  const num = Number(value);
  const invalid = value.trim() === "" || Number.isNaN(num) || num < 0 || num > 500;
  return (
    <div className="demo-stack" style={{ maxWidth: 420, gap: 14 }}>
      <label className={invalid ? "field field-error" : "field"}>
        样本质量 <em>*</em>
        <span style={{ position: "relative", display: "block" }}>
          <input
            className="field-control"
            style={{ fontWeight: 400, paddingRight: 40 }}
            value={value}
            aria-invalid={invalid}
            inputMode="decimal"
            onChange={(event) => setValue(event.target.value)}
          />
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--faint)", fontSize: 11, fontWeight: 400 }}>mg</span>
        </span>
        {invalid ? (
          <small role="alert">质量需在 0–500 mg 之间{value.trim() !== "" && !Number.isNaN(num) ? `，当前为 ${value} mg` : ""}。</small>
        ) : (
          <small style={{ color: "var(--green)" }}>在允许范围内，可以提交。</small>
        )}
      </label>
      <p className="demo-note">错误就近显示在字段正下方：控件红边 + aria-invalid=&quot;true&quot;，文案 role=&quot;alert&quot; 即时播报；提交失败后焦点移到首个错误字段。</p>
    </div>
  );
}

function FormBusiness() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const submit = () => {
    setSubmitting(true);
    setDone(false);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1500);
  };
  return (
    <div className="demo-stack" style={{ maxWidth: 460, gap: 14 }}>
      <label className="field">
        任务名称 <em>*</em>
        <input className="field-control" style={{ fontWeight: 400 }} defaultValue="第 3 轮电导率优化" />
        <small>用于列表与导出命名，2–40 个字符。</small>
      </label>
      <label className="field">
        数据集 <em>*</em>
        <SelectTrigger label="电导率筛选第 3 轮（ds-118）" width="100%" />
      </label>
      <div className="demo-row">
        <button className="button button-primary" disabled={submitting} onClick={submit}>
          {submitting && <span className="spinner" aria-hidden="true" />}
          {submitting ? "正在创建" : "创建计算任务"}
        </button>
        <span className="demo-note">将使用 示例项目（<span className="mono">project-042</span>）· 预计最长 300 秒</span>
      </div>
      {done && (
        <div className="status-line status-success">
          <Check size={16} />
          <div>
            <strong>任务 run-28004 已创建</strong>
            <span>可在任务列表查看进度；若提交失败，全部已填内容会被保留。</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Upload ---------- */

function UploadBasic() {
  return (
    <div className="demo-stack" style={{ maxWidth: 460 }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="上传文件，支持 .csv 与 .xlsx，单个不超过 50 MB"
        style={{
          border: "1.5px dashed var(--line-strong)",
          borderRadius: 12,
          padding: "26px 18px",
          display: "grid",
          justifyItems: "center",
          gap: 6,
          textAlign: "center",
          cursor: "pointer",
          background: "var(--surface)",
        }}
      >
        <Upload size={18} style={{ color: "var(--brand)" }} />
        <strong style={{ fontSize: 13 }}>拖拽文件到此处，或点击选择</strong>
        <span style={{ color: "var(--muted)", fontSize: 11 }}>支持 .csv / .xlsx，单个 ≤ 50 MB · 示例文件：example.com/templates/battery.csv</span>
      </div>
      <p className="demo-note">接受的格式与大小上限前置写在区域内；不符在选择时即拒绝。</p>
    </div>
  );
}

function UploadProgress() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 12 }}>
        <FileText size={15} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 12 }}>cycle_data_20260901.csv</strong>
          <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
            <span style={{ flex: 1, height: 5, borderRadius: 999, background: "var(--surface-soft)", overflow: "hidden" }}>
              <span role="progressbar" aria-valuenow={72} style={{ display: "block", width: "72%", height: "100%", borderRadius: 999, background: "var(--brand)" }} />
            </span>
            <span className="mono" style={{ color: "var(--muted)" }}>72%</span>
          </span>
        </span>
        <button className="inline-action">取消</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid color-mix(in srgb, var(--red) 30%, var(--line))", borderRadius: 10, fontSize: 12 }}>
        <FileText size={15} style={{ color: "var(--red)", flex: "0 0 auto" }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 12 }}>notes_final(2).xlsx</strong>
          <span role="alert" style={{ color: "var(--red)", fontSize: 11 }}>超过 50 MB 上限（61 MB），未开始上传。</span>
        </span>
        <button className="inline-action">重试</button>
      </div>
      <p className="demo-note">逐文件展示进度与百分比；失败给出具体原因并可单独重试，不静默丢弃。</p>
    </div>
  );
}

function UploadBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="导入仪器原始数据，支持 .csv 与 .xlsx，单个不超过 50 MB"
        style={{
          border: "1.5px dashed var(--line-strong)",
          borderRadius: 12,
          padding: "18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          background: "var(--surface)",
          fontSize: 12,
        }}
      >
        <Upload size={16} style={{ color: "var(--brand)" }} />
        <strong>导入仪器原始数据</strong>
        <span style={{ color: "var(--muted)", fontSize: 11 }}>.csv / .xlsx · ≤ 50 MB</span>
      </div>
      <div className="notice-card notice-green" style={{ marginTop: 0 }}>
        <div className="notice-icon"><FileText size={16} /></div>
        <div>
          <strong>原始文件将不可变保留</strong>
          <p>原始文件与解析产物分开存储；解析失败可重新解析，不覆盖原始文件。上传成功后自动关联到 示例项目（<span className="mono">project-042</span>）的数据集（如 <span className="mono">ds-118</span>）。</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- SearchField ---------- */

function SearchFieldBasic() {
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 37, padding: "0 10px", border: "1px solid var(--line-strong)", borderRadius: 8, background: "var(--surface)", width: 320 }}>
        <Search size={14} style={{ color: "var(--faint)", flex: "0 0 auto" }} />
        <input type="search" aria-label="搜索数据集" placeholder="搜索数据集名称或编号" style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--text)", fontSize: 12 }} />
        <kbd>/</kbd>
      </span>
      <p className="demo-note">占位文本写明可搜字段；页面级搜索支持 / 快捷键聚焦。</p>
    </div>
  );
}

function SearchFieldLoadingClear() {
  const [value, setValue] = useState("run-");
  return (
    <div className="demo-stack" style={{ alignItems: "flex-start", gap: 12 }}>
      <SearchBox value="ds-118" loading width={320} onChange={() => undefined} />
      <SearchBox value={value} width={320} onChange={setValue} onClear={() => setValue("")} />
      <p className="demo-note">搜索中右侧显示 spinner，输入不锁定；有值时提供一键清除。</p>
    </div>
  );
}

const demoRuns = [
  { id: "run-28003", name: "电导率优化第 3 轮" },
  { id: "run-28004", name: "热稳定性复测" },
  { id: "run-28005", name: "空白对照" },
];

function SearchFieldBusiness() {
  const [keyword, setKeyword] = useState("");
  const matched = demoRuns.filter((run) => run.id.includes(keyword) || run.name.includes(keyword));
  return (
    <div className="demo-stack" style={{ maxWidth: 420 }}>
      <SearchBox value={keyword} onChange={setKeyword} onClear={() => setKeyword("")} placeholder="搜索任务名称或编号" width="100%" />
      {matched.length > 0 ? (
        <div className="demo-stack" style={{ gap: 6 }}>
          {matched.map((run) => (
            <div key={run.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12 }}>
              <strong style={{ fontSize: 12 }}>{run.name}</strong>
              <span className="mono" style={{ color: "var(--faint)" }}>{run.id}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-line">
          <span>没有匹配「{keyword}」的任务</span>
          <button className="inline-action" onClick={() => setKeyword("")}>清除关键词</button>
        </div>
      )}
      <p className="demo-note">防抖 300ms 即时过滤；空结果给出清除动作。</p>
    </div>
  );
}

/* ---------- FilterBar ---------- */

function FilterBarBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row" role="search" aria-label="筛选条件">
        <SelectTrigger small label="状态：全部" />
        <SelectTrigger small label="创建时间：最近 30 天" />
        <SelectTrigger small label="负责人：全部" />
        <button className="button button-secondary button-sm">
          更多筛选
          <ChevronDown size={12} />
        </button>
        <button className="button button-ghost button-sm">
          <RotateCcw size={12} />
          重置
        </button>
      </div>
      <p className="demo-note">常用条件外露不超过 3 个，其余收进“更多筛选”；有非默认条件时出现重置入口。</p>
    </div>
  );
}

const defaultActiveFilters = ["状态 = 运行中", "创建时间 = 最近 7 天", "项目 = project-042"];

function FilterBarActiveFilters() {
  const [active, setActive] = useState(defaultActiveFilters);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {active.map((filter) => (
          <TagChip key={filter} label={filter} onRemove={() => setActive((list) => list.filter((item) => item !== filter))} />
        ))}
        <button className="button button-ghost button-sm" onClick={() => setActive(defaultActiveFilters)}>
          <RotateCcw size={12} />
          重置
        </button>
      </div>
      <p className="demo-note">面板收起后已选条件以 Tag 回显，可单个移除；重置一键恢复默认（演示中恢复全部标签）。</p>
    </div>
  );
}

function FilterBarBusiness() {
  return (
    <div className="demo-stack">
      <div className="demo-row" role="search" aria-label="筛选条件">
        <SelectTrigger small label="状态：运行中" />
        <SelectTrigger small label="创建时间：最近 7 天" />
        <button className="button button-secondary button-sm">
          更多筛选
          <ChevronDown size={12} />
        </button>
        <TagChip label="状态 = 运行中" onRemove={() => undefined} />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务</th>
              <th>状态</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>电导率优化第 3 轮</strong><span className="table-secondary">run-28003</span></td>
              <td><span className="status-badge badge-success"><span className="badge-dot" />运行中</span></td>
              <td className="num">2026-09-21</td>
            </tr>
            <tr>
              <td><strong>热稳定性复测</strong><span className="table-secondary">run-28004</span></td>
              <td><span className="status-badge badge-success"><span className="badge-dot" />运行中</span></td>
              <td className="num">2026-09-19</td>
            </tr>
            <tr>
              <td><strong>倍率性能验证</strong><span className="table-secondary">run-28007</span></td>
              <td><span className="status-badge badge-success"><span className="badge-dot" />运行中</span></td>
              <td className="num">2026-09-17</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="demo-note">共 3 个任务 · 已按「状态 = 运行中」筛选 · 条件变化即时应用到列表与计数，无需“查询”按钮。</p>
    </div>
  );
}

export const entryPreviews: Record<string, PreviewFn> = {
  "input/basic": InputBasic,
  "input/sizes": InputSizes,
  "input/states": InputStates,
  "input/business": InputBusiness,
  "input-number/basic": InputNumberBasic,
  "input-number/precision-unit": InputNumberPrecisionUnit,
  "input-number/business": InputNumberBusiness,
  "textarea/basic": TextareaBasic,
  "textarea/count-autosize": TextareaCountAutosize,
  "textarea/business": TextareaBusiness,
  "select/basic": SelectBasic,
  "select/multiple": SelectMultiple,
  "select/business": SelectBusiness,
  "combobox/basic": ComboboxBasic,
  "combobox/allow-create": ComboboxAllowCreate,
  "combobox/business": ComboboxBusiness,
  "date-picker/basic": DatePickerBasic,
  "date-picker/disabled-date": DatePickerDisabledDate,
  "date-picker/business": DatePickerBusiness,
  "date-range-picker/basic": DateRangePickerBasic,
  "date-range-picker/presets": DateRangePickerPresets,
  "date-range-picker/business": DateRangePickerBusiness,
  "checkbox/basic": CheckboxBasic,
  "checkbox/indeterminate": CheckboxIndeterminate,
  "checkbox/business": CheckboxBusiness,
  "radio/basic": RadioBasic,
  "radio/card-options": RadioCardOptions,
  "radio/business": RadioBusiness,
  "switch/basic": SwitchBasic,
  "switch/states": SwitchStates,
  "switch/business": SwitchBusiness,
  "form/basic": FormBasic,
  "form/validation": FormValidation,
  "form/business": FormBusiness,
  "upload/basic": UploadBasic,
  "upload/progress": UploadProgress,
  "upload/business": UploadBusiness,
  "search-field/basic": SearchFieldBasic,
  "search-field/loading-clear": SearchFieldLoadingClear,
  "search-field/business": SearchFieldBusiness,
  "filter-bar/basic": FilterBarBasic,
  "filter-bar/active-filters": FilterBarActiveFilters,
  "filter-bar/business": FilterBarBusiness,
};
