import { SelectControl } from "../components/SelectControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useId, useState } from "react";
import type { CSSProperties } from "react";
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
  fontSize: 14,
};

/** 筛选栏里的静态触发器示意（FilterBar 专用，非真实 Select）。 */
function FilterTrigger({ label, placeholder, width, small }: { label: string; placeholder?: boolean; width?: number | string; small?: boolean }) {
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
  fontSize: 14,
};

/** 示例说明文字。 */
const noteCls = "m-0 text-sm text-muted-foreground";
/** 字段下方辅助文本 / 错误文本。 */
const helpCls = "m-0 text-xs text-muted-foreground";
const errorTextCls = "m-0 text-xs text-danger";
/** 出错控件的红边（registry Input 没有 error 变体，用语义令牌组合）。 */
const invalidCls = "border-danger focus-visible:border-danger focus-visible:ring-danger/20";
/** registry Checkbox 的半选态：隐藏对勾，画一条横线。 */
const indeterminateCls =
  "relative data-[state=indeterminate]:bg-primary data-[state=indeterminate]:[&_svg]:hidden data-[state=indeterminate]:after:absolute data-[state=indeterminate]:after:inset-x-[3px] data-[state=indeterminate]:after:top-1/2 data-[state=indeterminate]:after:h-0.5 data-[state=indeterminate]:after:-translate-y-1/2 data-[state=indeterminate]:after:rounded-full data-[state=indeterminate]:after:bg-primary-foreground data-[state=indeterminate]:after:content-['']";

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
        fontSize: 12,
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
  color: "var(--text-muted)",
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
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 10px", minWidth: 76, fontSize: 14, fontFamily: '"DM Mono", monospace', color: "var(--text)" }}>
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
        style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--text)", fontSize: 14 }}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px 8px", fontSize: 14, fontWeight: 700 }}>
        <span>2026 年 9 月</span>
        <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 12 }}>今天 9/22</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {weekdays.map((day) => (
          <span key={day} style={{ textAlign: "center", color: "var(--faint)", fontSize: 12, padding: "2px 0" }}>
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
                fontSize: 12,
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
  const id = useId();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-name`}>项目名称</Label>
        <Input id={`${id}-name`} placeholder="例如：高导电解液筛选" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-sample`}>样本编号</Label>
        <div className="relative">
          <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-muted-foreground">
            SMP-
          </span>
          <Input id={`${id}-sample`} className="pl-12" placeholder="00042" />
        </div>
      </div>
    </div>
  );
}

function InputSizes() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Input aria-label="sm 尺寸示例" className="h-7 w-[180px] text-sm" placeholder="sm · 筛选栏与行内" />
        <Input aria-label="默认尺寸示例" className="w-[180px]" placeholder="md · 默认尺寸" />
        <Input aria-label="lg 尺寸示例" className="h-10 w-[180px] text-md" placeholder="lg · 页面级录入" />
      </div>
      <p className={noteCls}>sm 用于筛选栏和表格行内；lg 仅用于独立录入页。</p>
    </div>
  );
}

function InputStates() {
  const id = useId();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-project`}>所属项目</Label>
        <Input id={`${id}-project`} value="示例项目（project-042）" disabled readOnly aria-describedby={`${id}-project-help`} />
        <p id={`${id}-project-help`} className={helpCls}>项目归档后不可修改归属。</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-task`}>任务名称</Label>
        <Input id={`${id}-task`} defaultValue="第 3 轮/优化" aria-invalid="true" aria-describedby={`${id}-task-error`} className={invalidCls} />
        <p id={`${id}-task-error`} role="alert" className={errorTextCls}>
          名称不能包含 / \ : 字符。
        </p>
      </div>
    </div>
  );
}

function InputBusiness() {
  const id = useId();
  const [value, setValue] = useState("示例项目（project-042）");
  return (
    <div className="grid max-w-[420px] gap-1.5">
      <Label htmlFor={`${id}-name`}>项目名称</Label>
      <Input id={`${id}-name`} value={value} maxLength={40} onChange={(event) => setValue(event.target.value)} aria-describedby={`${id}-help`} />
      <p id={`${id}-help`} className={helpCls}>
        名称用于列表展示与导出文件命名，2–40 个字符，项目内唯一。当前 {value.length}/40。
      </p>
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
  const id = useId();
  return (
    <div className="grid max-w-[520px] gap-1.5">
      <Label htmlFor={`${id}-note`}>实验备注</Label>
      <Textarea id={`${id}-note`} rows={3} placeholder="记录实验现象、异常与处理" />
    </div>
  );
}

function TextareaCountAutosize() {
  const id = useId();
  const [value, setValue] = useState("充电末期温升偏高：第 42 圈峰值 41.2 ℃，已降倍率复测。");
  const nearLimit = value.length > 450;
  return (
    <div className="grid max-w-[520px] gap-1.5">
      <Label htmlFor={`${id}-reason`}>失败原因说明</Label>
      <div className="relative">
        <Textarea
          id={`${id}-reason`}
          maxLength={500}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={`${id}-count ${id}-help`}
          className="max-h-[192px] min-h-[92px] resize-none pb-6 [field-sizing:content]"
        />
        <span id={`${id}-count`} className={cn("absolute bottom-1.5 right-2.5 text-xs", nearLimit ? "text-warning" : "text-muted-foreground")}>
          {value.length}/500
        </span>
      </div>
      <p id={`${id}-help`} className={helpCls}>autoSize 在 3–8 行间伸缩；接近上限时计数变为警示色。</p>
    </div>
  );
}

function TextareaBusiness() {
  const id = useId();
  const [value, setValue] = useState("第 3 轮配方 D，充电末期温升偏高，已降倍率复测；复测数据同步至 ds-118。");
  return (
    <div className="grid max-w-[520px] gap-1.5">
      <Label htmlFor={`${id}-note`}>
        实验备注（<span className="font-mono">run-28003</span>）
      </Label>
      <div className="relative">
        <Textarea
          id={`${id}-note`}
          rows={3}
          maxLength={500}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={`${id}-count ${id}-help`}
          className="pb-6"
        />
        <span id={`${id}-count`} className="absolute bottom-1.5 right-2.5 text-xs text-muted-foreground">
          {value.length}/500
        </span>
      </div>
      <p id={`${id}-help`} className={helpCls}>备注将进入审计记录，导出报告时一并携带，请客观描述事实。</p>
    </div>
  );
}

/* ---------- Select ---------- */

function SelectBasic() {
  const id = useId();
  return (
    <div className="grid max-w-[320px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-status`}>任务状态</Label>
        <Select defaultValue="running">
          <SelectTrigger id={`${id}-status`}>
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="running">运行中</SelectItem>
            <SelectItem value="queued">排队中</SelectItem>
            <SelectItem value="finished">已完成</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className={noteCls}>方向键选择，Enter 确认，Esc 关闭并返回触发器。</p>
    </div>
  );
}

const tagOptions = [
  { value: "high-conductivity", label: "高导配方" },
  { value: "round-3", label: "第 3 轮" },
  { value: "to-review", label: "待复核" },
];

/** registry Select 只支持单选：多选用 Popover + Checkbox 组合，已选值以 Badge 回显。 */
function SelectMultiple() {
  const id = useId();
  const [value, setValue] = useState(["high-conductivity", "round-3"]);
  const toggle = (item: string) => setValue((list) => (list.includes(item) ? list.filter((v) => v !== item) : [...list, item]));
  const labelOf = (item: string) => tagOptions.find((option) => option.value === item)?.label ?? item;
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-tags`}>实验标签</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button id={`${id}-tags`} variant="secondary" className="w-full justify-between px-3 text-sm font-normal">
              <span className={cn("truncate", value.length === 0 && "text-muted-foreground")}>{value.length ? `已选 ${value.length} 项` : "选择标签"}</span>
              <ChevronDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
            {tagOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent">
                <Checkbox id={`${id}-${option.value}`} checked={value.includes(option.value)} onCheckedChange={() => toggle(option.value)} />
                <Label htmlFor={`${id}-${option.value}`} className="flex-1 cursor-pointer font-normal leading-5">
                  {option.label}
                </Label>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map((item) => (
          <Badge key={item} tone="primary" className="pr-0.5">
            {labelOf(item)}
            <Button variant="ghost" size="icon" aria-label={`移除标签：${labelOf(item)}`} onClick={() => toggle(item)} className="size-4 text-primary hover:bg-primary/10 [&_svg]:size-3">
              <X />
            </Button>
          </Badge>
        ))}
        {value.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setValue([])}>
            清空
          </Button>
        )}
      </div>
      <p className={noteCls}>多选后保持面板打开；标签可逐项移除或清空。</p>
    </div>
  );
}

const datasetOptions = [
  { value: "ds-118", label: "电导率筛选第 3 轮" },
  { value: "ds-120", label: "热稳定性复测" },
  { value: "ds-121", label: "空白对照组" },
];

/** registry Select 不带搜索：可搜索的单选用 Popover + Input + 选项列表组合，无匹配给出空态。 */
function SelectBusiness() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("ds-118");
  const [keyword, setKeyword] = useState("");
  const selected = datasetOptions.find((option) => option.value === value);
  const query = keyword.trim().toLowerCase();
  const matched = datasetOptions.filter((option) => option.label.toLowerCase().includes(query) || option.value.includes(query));
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-dataset`}>输入数据集</Label>
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setKeyword("");
          }}
        >
          <PopoverTrigger asChild>
            <Button id={`${id}-dataset`} variant="secondary" role="combobox" aria-expanded={open} className="w-full justify-between px-3 text-sm font-normal">
              <span className="truncate">{selected ? `${selected.label}（${selected.value}）` : "选择数据集"}</span>
              <ChevronDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
            <Input aria-label="搜索数据集" placeholder="搜索数据集名称或编号" value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mb-1" />
            <div role="listbox" aria-label="数据集" className="grid">
              {matched.length > 0 ? (
                matched.map((option) => (
                  <Button
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between px-2 font-normal"
                    onClick={() => {
                      setValue(option.value);
                      setOpen(false);
                      setKeyword("");
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Check className={cn(option.value === value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{option.value}</span>
                  </Button>
                ))
              ) : (
                <p className="m-0 px-2 py-5 text-center text-sm text-muted-foreground">没有匹配的数据集</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className={noteCls}>可按名称或数据集 ID 搜索，选中后收起面板。</p>
    </div>
  );
}

/* ---------- Combobox ---------- */

function ComboboxBasic() {
  const [value,setValue] = useState<string[]>([]);
  return <div style={{maxWidth:320}}><SelectControl label="溶剂" searchable options={[{value:"EC",label:"碳酸乙烯酯",hint:"EC"},{value:"DMC",label:"碳酸二甲酯",hint:"DMC"}]} value={value} onChange={setValue}/></div>;
}
function ComboboxAllowCreate() {
  const [value,setValue] = useState<string[]>([]);
  const [options,setOptions] = useState([{value:"EC",label:"碳酸乙烯酯"}]);
  return <div className="demo-stack" style={{maxWidth:320}}><SelectControl label="溶剂名称" searchable allowCreate options={options} value={value} onChange={next=>{setValue(next);if(next[0]&&!options.some(o=>o.value===next[0]))setOptions([...options,{value:next[0],label:next[0]}]);}}/><p className="demo-note">无匹配时可创建新的示例选项；已有选项可继续搜索。</p></div>;
}
function ComboboxBusiness() {
  const [value,setValue] = useState(["oven-07"]);
  return <div className="demo-stack" style={{maxWidth:340}}><SelectControl label="预约仪器" searchable options={[{value:"oven-07",label:"恒温箱 07",hint:"可用"},{value:"oven-09",label:"恒温箱 09",hint:"维护中",disabled:true}]} value={value} onChange={setValue}/><p className="demo-note">不可用仪器保留原因，键盘选择时跳过。</p></div>;
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
          <Button
            key={preset.label}
            variant={index === active ? "soft" : "secondary"}
            size="sm"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            {preset.label}
          </Button>
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
        <Button variant="ghost" size="sm" onClick={() => undefined}>清除筛选</Button>
      </div>
      <p className="demo-note">已选 22 天 · 命中 18 个任务 · 区间含开始与结束当日 · 应用到 示例项目（project-042）的任务列表。</p>
    </div>
  );
}

/* ---------- Checkbox ---------- */

function CheckboxBasic() {
  const id = useId();
  const items = ["同时导出原始数据", "包含失败步骤", "仅当前项目（project-042）"];
  const [checked, setChecked] = useState([true, false, false]);
  return (
    <div className="grid gap-2.5">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox
            id={`${id}-${index}`}
            checked={checked[index]}
            onCheckedChange={(next) => setChecked((list) => list.map((value, i) => (i === index ? next === true : value)))}
          />
          <Label htmlFor={`${id}-${index}`} className="cursor-pointer font-normal">
            {item}
          </Label>
        </div>
      ))}
      <p className={noteCls}>点击方框或文案都切换；勾选只改变待提交状态。</p>
    </div>
  );
}

function CheckboxIndeterminate() {
  const id = useId();
  const children = ["ds-118", "ds-120", "ds-121"];
  const [checked, setChecked] = useState([true, false, false]);
  const selectedCount = checked.filter(Boolean).length;
  const parentState = selectedCount === 0 ? false : selectedCount === children.length ? true : "indeterminate";
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${id}-all`}
          checked={parentState}
          onCheckedChange={() => setChecked(checked.map(() => selectedCount !== children.length))}
          className={indeterminateCls}
        />
        <Label htmlFor={`${id}-all`} className="cursor-pointer font-semibold">
          全选（已选 {selectedCount} / {children.length}）
        </Label>
      </div>
      <div className="grid gap-2.5 pl-6">
        {children.map((child, index) => (
          <div key={child} className="flex items-center gap-2">
            <Checkbox
              id={`${id}-${child}`}
              checked={checked[index]}
              onCheckedChange={(next) => setChecked((list) => list.map((value, i) => (i === index ? next === true : value)))}
            />
            <Label htmlFor={`${id}-${child}`} className="cursor-pointer font-mono font-normal">
              {child}
            </Label>
          </div>
        ))}
      </div>
      <p className={noteCls}>部分选中时父级呈半选态；点击父级在全选 / 全不选间切换。</p>
    </div>
  );
}

function CheckboxBusiness() {
  const id = useId();
  const datasets = [
    { id: "ds-118", name: "电导率筛选第 3 轮" },
    { id: "ds-120", name: "热稳定性复测" },
    { id: "ds-121", name: "空白对照组" },
  ];
  const [selected, setSelected] = useState<string[]>(["ds-118", "ds-120"]);
  const toggle = (item: string) => setSelected((list) => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item]));
  return (
    <div className="grid max-w-[420px] gap-3">
      <div className="grid gap-2">
        {datasets.map((dataset) => (
          <Label
            key={dataset.id}
            htmlFor={`${id}-${dataset.id}`}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 font-normal leading-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft"
          >
            <Checkbox id={`${id}-${dataset.id}`} checked={selected.includes(dataset.id)} onCheckedChange={() => toggle(dataset.id)} />
            <span className="grid min-w-0 flex-1">
              <span className="text-base font-semibold">{dataset.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{dataset.id}</span>
            </span>
          </Label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">已选 {selected.length} / 3 项</span>
        <Button variant="secondary" size="sm" disabled={selected.length === 0}>
          批量导出
        </Button>
        <Button variant="ghost" size="sm" disabled={selected.length === 0} onClick={() => setSelected([])}>
          清空选择
        </Button>
      </div>
      <p className={noteCls}>勾选只更新待提交状态；批量动作需显式触发并二次确认。</p>
    </div>
  );
}

/* ---------- Radio ---------- */

function RadioBasic() {
  const id = useId();
  const options = [
    { value: "all", label: "全部" },
    { value: "running", label: "运行中" },
    { value: "finished", label: "已完成" },
  ];
  return (
    <div className="grid gap-2.5">
      <RadioGroup defaultValue="all" aria-label="任务状态" className="flex flex-wrap gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className={noteCls}>选项平铺一眼看全；方向键在同组内移动并选中。</p>
    </div>
  );
}

type ModeOption = { value: string; label: string; description: string; disabled?: boolean };

const modeCards: ModeOption[] = [
  { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒" },
  { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 消耗额度" },
];

/** 卡片样式单选：Label 包住 RadioGroupItem，选中 / 禁用样式由 :has() 跟随子项状态。 */
const radioCardCls =
  "flex cursor-pointer items-start gap-2.5 rounded-lg border bg-background p-3 font-normal leading-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";

function RadioCards({ options, value, onValueChange }: { options: ModeOption[]; value: string; onValueChange: (next: string) => void }) {
  const id = useId();
  return (
    <RadioGroup value={value} onValueChange={onValueChange} aria-label="计算模式" className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <Label key={option.value} htmlFor={`${id}-${option.value}`} className={radioCardCls}>
          <RadioGroupItem id={`${id}-${option.value}`} value={option.value} disabled={option.disabled} className="mt-0.5" />
          <span className="grid gap-0.5">
            <span className="text-base font-semibold">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function RadioCardOptions() {
  const [value, setValue] = useState("fast");
  return <RadioCards options={modeCards} value={value} onValueChange={setValue} />;
}

function RadioBusiness() {
  const options: ModeOption[] = [
    { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒 · 不计额度" },
    { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 计入 project-042 额度" },
    { value: "ultra", label: "超高精度", description: "需申请权限", disabled: true },
  ];
  const [value, setValue] = useState("precise");
  return (
    <div className="grid gap-3">
      <RadioCards options={options} value={value} onValueChange={setValue} />
      <p className={noteCls}>有代价的档位写明代价；无权限档位禁用并注明，不隐藏。</p>
    </div>
  );
}

/* ---------- Switch ---------- */

function SwitchBasic() {
  const id = useId();
  const [mail, setMail] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2.5">
        <Switch id={`${id}-mail`} checked={mail} onCheckedChange={setMail} />
        <Label htmlFor={`${id}-mail`} className="cursor-pointer font-normal">
          邮件通知
        </Label>
      </div>
      <div className="flex items-center gap-2.5">
        <Switch id={`${id}-autosave`} checked={autoSave} onCheckedChange={setAutoSave} />
        <Label htmlFor={`${id}-autosave`} className="cursor-pointer font-normal">
          自动保存
        </Label>
      </div>
      <p className={noteCls}>点击即生效，无需保存按钮；标签写清控制对象。</p>
    </div>
  );
}

function SwitchStates() {
  const id = useId();
  const [syncOn, setSyncOn] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
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
    <div className="grid gap-3">
      <div className="flex items-center gap-2.5">
        {/* 写入成功前不改变 checked；pending 期间禁用防止反复点击 */}
        <Switch id={`${id}-sync`} checked={syncOn} disabled={syncPending} aria-busy={syncPending} onCheckedChange={toggleSync} />
        <Label htmlFor={`${id}-sync`} className="font-normal">
          远程同步
        </Label>
        {syncPending && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            写入中…
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Switch id={`${id}-share`} checked={false} disabled={sharePending} aria-busy={sharePending} onCheckedChange={toggleShare} />
        <Label htmlFor={`${id}-share`} className="font-normal">
          团队共享（演示失败回滚）
        </Label>
        {sharePending && <Loader2 className="size-3 animate-spin text-muted-foreground" aria-label="写入中" />}
        {failed && (
          <span role="alert" className="inline-flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="size-3" aria-hidden="true" />
            保存失败，已回滚
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <Switch id={`${id}-analytics`} checked={false} disabled />
        <Label htmlFor={`${id}-analytics`} className="font-normal text-muted-foreground">
          数据分析（需管理员开启）
        </Label>
      </div>
      <p className={noteCls}>异步写入成功才切换位置；失败回滚到原位置并提示，不留假态。</p>
    </div>
  );
}

function SwitchBusiness() {
  const id = useId();
  const [on, setOn] = useState(true);
  return (
    <div className="grid max-w-[460px] gap-3">
      <div className="flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground">
        <Switch id={`${id}-refresh`} checked={on} onCheckedChange={setOn} aria-describedby={`${id}-refresh-desc`} className="mt-0.5" />
        <div className="grid min-w-0 gap-1">
          <Label htmlFor={`${id}-refresh`} className="cursor-pointer text-base font-semibold">
            任务自动刷新
          </Label>
          <p id={`${id}-refresh-desc`} className="m-0 text-sm text-muted-foreground">
            开启后每 30 秒刷新 <span className="font-mono">run-28003</span> 的状态，关闭即停止，无需任何提交动作。
          </p>
        </div>
      </div>
      <p role="status" className={cn("m-0 text-sm", on ? "text-success" : "text-muted-foreground")}>
        {on ? "已开启 · 状态每 30 秒自动更新" : "已关闭 · 状态需手动刷新"}
      </p>
    </div>
  );
}

/* ---------- Form ---------- */

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-danger">
      *
    </span>
  );
}

function FormBasic() {
  const id = useId();
  return (
    <form className="grid max-w-[420px] gap-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-name`}>
          任务名称
          <RequiredMark />
        </Label>
        <Input id={`${id}-name`} required aria-describedby={`${id}-name-help`} placeholder="例如：第 3 轮电导率优化" />
        <p id={`${id}-name-help`} className={helpCls}>用于列表与导出命名，2–40 个字符。</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-project`}>
          所属项目
          <RequiredMark />
        </Label>
        <Select required>
          <SelectTrigger id={`${id}-project`} aria-required="true" className="data-[placeholder]:text-muted-foreground">
            <SelectValue placeholder="选择项目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project-042">示例项目（project-042）</SelectItem>
            <SelectItem value="project-043">示例项目二（project-043）</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className={noteCls}>垂直布局是默认：标签在上、辅助文本常驻在控件下方；必填星号与校验规则配套。</p>
    </form>
  );
}

function FormValidation() {
  const id = useId();
  const [value, setValue] = useState("620");
  const num = Number(value);
  const invalid = value.trim() === "" || Number.isNaN(num) || num < 0 || num > 500;
  return (
    <div className="grid max-w-[420px] gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-mass`}>
          样本质量
          <RequiredMark />
        </Label>
        <div className="relative">
          <Input
            id={`${id}-mass`}
            required
            value={value}
            inputMode="decimal"
            aria-invalid={invalid}
            aria-describedby={`${id}-mass-msg`}
            onChange={(event) => setValue(event.target.value)}
            className={cn("pr-10", invalid && invalidCls)}
          />
          <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            mg
          </span>
        </div>
        {invalid ? (
          <p id={`${id}-mass-msg`} role="alert" className={errorTextCls}>
            质量需在 0–500 mg 之间{value.trim() !== "" && !Number.isNaN(num) ? `，当前为 ${value} mg` : ""}。
          </p>
        ) : (
          <p id={`${id}-mass-msg`} className="m-0 text-xs text-success">
            在允许范围内，可以提交。
          </p>
        )}
      </div>
      <p className={noteCls}>错误就近显示在字段正下方：控件红边 + aria-invalid=&quot;true&quot;，文案 role=&quot;alert&quot; 即时播报；提交失败后焦点移到首个错误字段。</p>
    </div>
  );
}

function FormBusiness() {
  const id = useId();
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
    <form
      className="grid max-w-[460px] gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-name`}>
          任务名称
          <RequiredMark />
        </Label>
        <Input id={`${id}-name`} required defaultValue="第 3 轮电导率优化" aria-describedby={`${id}-name-help`} />
        <p id={`${id}-name-help`} className={helpCls}>用于列表与导出命名，2–40 个字符。</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-dataset`}>
          数据集
          <RequiredMark />
        </Label>
        <Select required defaultValue="ds-118">
          <SelectTrigger id={`${id}-dataset`} aria-required="true">
            <SelectValue placeholder="选择数据集" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ds-118">电导率筛选第 3 轮（ds-118）</SelectItem>
            <SelectItem value="ds-120">热稳定性复测（ds-120）</SelectItem>
            <SelectItem value="ds-121">空白对照组（ds-121）</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitting ? "正在创建" : "创建计算任务"}
        </Button>
        <span className="text-sm text-muted-foreground">
          将使用 示例项目（<span className="font-mono">project-042</span>）· 预计最长 300 秒
        </span>
      </div>
      {done && (
        <div role="status" className="flex items-start gap-2.5 rounded-lg border border-success/30 bg-success-soft p-3 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          <div className="grid gap-0.5">
            <strong className="font-semibold text-foreground">任务 run-28004 已创建</strong>
            <span className="text-muted-foreground">可在任务列表查看进度；若提交失败，全部已填内容会被保留。</span>
          </div>
        </div>
      )}
    </form>
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
        <strong style={{ fontSize: 14 }}>拖拽文件到此处，或点击选择</strong>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>支持 .csv / .xlsx，单个 ≤ 50 MB · 示例文件：example.com/templates/battery.csv</span>
      </div>
      <p className="demo-note">接受的格式与大小上限前置写在区域内；不符在选择时即拒绝。</p>
    </div>
  );
}

function UploadProgress() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 14 }}>
        <FileText size={15} style={{ color: "var(--brand)", flex: "0 0 auto" }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 14 }}>cycle_data_20260901.csv</strong>
          <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
            <span style={{ flex: 1, height: 5, borderRadius: 999, background: "var(--surface-soft)", overflow: "hidden" }}>
              <span role="progressbar" aria-valuenow={72} style={{ display: "block", width: "72%", height: "100%", borderRadius: 999, background: "var(--brand)" }} />
            </span>
            <span className="mono" style={{ color: "var(--text-muted)" }}>72%</span>
          </span>
        </span>
        <Button variant="link" size="sm">取消</Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid color-mix(in srgb, var(--red) 30%, var(--line))", borderRadius: 10, fontSize: 14 }}>
        <FileText size={15} style={{ color: "var(--red)", flex: "0 0 auto" }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 14 }}>notes_final(2).xlsx</strong>
          <span role="alert" style={{ color: "var(--red)", fontSize: 12 }}>超过 50 MB 上限（61 MB），未开始上传。</span>
        </span>
        <Button variant="link" size="sm">重试</Button>
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
          fontSize: 14,
        }}
      >
        <Upload size={16} style={{ color: "var(--brand)" }} />
        <strong>导入仪器原始数据</strong>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>.csv / .xlsx · ≤ 50 MB</span>
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
        <input type="search" aria-label="搜索数据集" placeholder="搜索数据集名称或编号" style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--text)", fontSize: 14 }} />
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
            <div key={run.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 14 }}>
              <strong style={{ fontSize: 14 }}>{run.name}</strong>
              <span className="mono" style={{ color: "var(--faint)" }}>{run.id}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-line">
          <span>没有匹配「{keyword}」的任务</span>
          <Button variant="link" size="sm" onClick={() => setKeyword("")}>清除关键词</Button>
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
        <FilterTrigger small label="状态：全部" />
        <FilterTrigger small label="创建时间：最近 30 天" />
        <FilterTrigger small label="负责人：全部" />
        <Button variant="secondary" size="sm">
          更多筛选
          <ChevronDown />
        </Button>
        <Button variant="ghost" size="sm">
          <RotateCcw />
          重置
        </Button>
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
        <Button variant="ghost" size="sm" onClick={() => setActive(defaultActiveFilters)}>
          <RotateCcw />
          重置
        </Button>
      </div>
      <p className="demo-note">面板收起后已选条件以 Tag 回显，可单个移除；重置一键恢复默认（演示中恢复全部标签）。</p>
    </div>
  );
}

function FilterBarBusiness() {
  return (
    <div className="demo-stack">
      <div className="demo-row" role="search" aria-label="筛选条件">
        <FilterTrigger small label="状态：运行中" />
        <FilterTrigger small label="创建时间：最近 7 天" />
        <Button variant="secondary" size="sm">
          更多筛选
          <ChevronDown />
        </Button>
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
