import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { DatePicker, DateRangePicker, countRangeDays, defaultDateRangePresets, type DateRange } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchField } from "@/components/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Upload, UploadFileList, type UploadFileItem, type UploadRejection } from "@/components/ui/upload";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, FileText, Loader2, RotateCcw, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { PreviewFn } from "./types";

/* ---------- 共享演示元件（仅本文件内部使用） ---------- */

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

/* ---------- NumberInput（doc id: input-number） ---------- */

function InputNumberBasic() {
  const id = useId();
  const [value, setValue] = useState<number | null>(1.5);
  return (
    <div className="grid max-w-[260px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-conc`}>添加剂浓度（%）</Label>
        <NumberInput id={`${id}-conc`} value={value} onValueChange={setValue} min={0} max={100} step={0.1} precision={1} />
      </div>
      <p className={noteCls}>min 0 · max 100 · step 0.1；步进按钮与 ↑ / ↓ 方向键等价。当前值：{value ?? "未填写"}</p>
    </div>
  );
}

function InputNumberPrecisionUnit() {
  const id = useId();
  const [mass, setMass] = useState<number | null>(12.4);
  const [cycles, setCycles] = useState<number | null>(200);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-mass`}>称量质量（precision 2）</Label>
        <NumberInput id={`${id}-mass`} value={mass} onValueChange={setMass} min={0} max={500} step={0.1} precision={2} unit="mg" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-cycles`}>循环次数（precision 0）</Label>
        <NumberInput id={`${id}-cycles`} value={cycles} onValueChange={setCycles} min={1} max={2000} step={10} precision={0} unit="次" />
      </div>
    </div>
  );
}

function InputNumberBusiness() {
  const id = useId();
  const [mass, setMass] = useState<number | null>(12.4);
  const [touched, setTouched] = useState(false);
  const missing = touched && mass === null;
  return (
    <div className="grid max-w-[420px] gap-1.5">
      <Label htmlFor={`${id}-mass`}>称量质量</Label>
      <NumberInput
        id={`${id}-mass`}
        value={mass}
        onValueChange={(next) => {
          setMass(next);
          setTouched(true);
        }}
        min={0}
        max={500}
        step={0.01}
        precision={2}
        unit="mg"
        invalid={missing}
        aria-describedby={`${id}-help`}
      />
      {missing ? (
        <p id={`${id}-help`} role="alert" className={errorTextCls}>
          请填写称量质量，允许 0–500 mg。
        </p>
      ) : (
        <p id={`${id}-help`} className={helpCls}>
          精度与天平一致（0.01 mg），量程 0–500 mg；超出量程会标红并在失焦时收敛到边界；留空表示未称量，不等于 0。
        </p>
      )}
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

const solventOptions: ComboboxOption[] = [
  { value: "ec", label: "碳酸乙烯酯", description: "EC" },
  { value: "dmc", label: "碳酸二甲酯", description: "DMC" },
  { value: "emc", label: "碳酸甲乙酯", description: "EMC" },
  { value: "pc", label: "碳酸丙烯酯", description: "PC" },
];

function ComboboxBasic() {
  const id = useId();
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="grid max-w-[320px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-solvent`}>溶剂</Label>
        <Combobox
          id={`${id}-solvent`}
          options={solventOptions}
          value={value}
          onValueChange={setValue}
          placeholder="选择溶剂"
          searchPlaceholder="搜索试剂名称或缩写"
          emptyText="没有匹配的试剂"
        />
      </div>
      <p className={noteCls}>输入即过滤，名称与缩写（EC / DMC）都可搜；再次点选已选项可取消。</p>
    </div>
  );
}

function ComboboxAllowCreate() {
  const id = useId();
  const [options, setOptions] = useState<ComboboxOption[]>([
    { value: "high-conductivity", label: "高导配方" },
    { value: "round-3", label: "第 3 轮" },
    { value: "to-review", label: "待复核" },
  ]);
  const [value, setValue] = useState<string[]>(["round-3"]);
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-tags`}>实验标签</Label>
        <Combobox
          id={`${id}-tags`}
          multiple
          options={options}
          value={value}
          onValueChange={setValue}
          placeholder="选择或创建标签"
          searchPlaceholder="搜索或输入新标签"
          onCreate={(name) => {
            const next = { value: `tag-${options.length + 1}`, label: name };
            setOptions((list) => [...list, next]);
            setValue((list) => [...list, next.value]);
          }}
        />
      </div>
      <p className={noteCls}>多选保持面板打开，已选以 Badge 回显；输入不存在的标签时首项为“创建：输入值”，创建即选中。</p>
    </div>
  );
}

function ComboboxBusiness() {
  const id = useId();
  const [value, setValue] = useState<string | null>("ins-07");
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-instrument`}>预约仪器</Label>
        <Combobox
          id={`${id}-instrument`}
          options={[
            { value: "ins-07", label: "恒温箱 07", description: "可用" },
            { value: "ins-08", label: "恒温箱 08", description: "可用" },
            { value: "ins-09", label: "恒温箱 09", description: "维护中", disabled: true },
            { value: "ins-12", label: "手套箱 12", description: "可用" },
          ]}
          value={value}
          onValueChange={setValue}
          placeholder="选择仪器"
          searchPlaceholder="搜索仪器名称或编号"
          emptyText="没有匹配的仪器"
        />
      </div>
      <p className={noteCls}>不可用仪器保留并注明原因（维护中），不可选，键盘移动时跳过。</p>
    </div>
  );
}

/* ---------- DatePicker ---------- */

function DatePickerBasic() {
  const id = useId();
  const [value, setValue] = useState<Date | null>(new Date(2026, 8, 22));
  return (
    <div className="grid max-w-[260px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-date`}>实验日期</Label>
        <DatePicker id={`${id}-date`} value={value} onValueChange={setValue} />
      </div>
      <p className={noteCls}>点选日期即确认并关闭面板；右侧 × 清除，格式统一为 yyyy-MM-dd。</p>
    </div>
  );
}

function DatePickerDisabledDate() {
  const id = useId();
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div className="grid max-w-[260px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-date`}>实验日期</Label>
        <DatePicker id={`${id}-date`} value={value} onValueChange={setValue} placeholder="选择实验日期" disabledDates={{ after: new Date() }} />
      </div>
      <p className={noteCls}>未来日期在面板内直接禁用并弱化显示，而不是选中后再报错。</p>
    </div>
  );
}

function DatePickerBusiness() {
  const id = useId();
  const [value, setValue] = useState<Date | null>(new Date(2026, 8, 24));
  return (
    <div className="grid max-w-[420px] gap-1.5">
      <Label htmlFor={`${id}-date`}>预约日期</Label>
      <DatePicker
        id={`${id}-date`}
        value={value}
        onValueChange={setValue}
        disabledDates={[{ before: new Date(2026, 8, 22) }, { after: new Date(2026, 9, 6) }]}
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className={helpCls}>
        可预约 2026-09-22 至 2026-10-06，需提前 2 小时；预约计入 示例项目（project-042）额度。
      </p>
    </div>
  );
}

/* ---------- DateRangePicker ---------- */

function DateRangePickerBasic() {
  const id = useId();
  const [value, setValue] = useState<DateRange | null>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 22) });
  const days = countRangeDays(value);
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-range`}>创建时间</Label>
        <DateRangePicker id={`${id}-range`} value={value} onValueChange={setValue} presets={[]} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {days > 0 && <Badge tone="primary">已选 {days} 天</Badge>}
        <p className={noteCls}>第一次点击选开始，第二次点击选结束，点“确定”生效。</p>
      </div>
    </div>
  );
}

function DateRangePickerPresets() {
  const id = useId();
  const [value, setValue] = useState<DateRange | null>(null);
  return (
    <div className="grid max-w-[340px] gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-range`}>统计区间</Label>
        <DateRangePicker
          id={`${id}-range`}
          value={value}
          onValueChange={setValue}
          presets={[...defaultDateRangePresets, { label: "本轮次", range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 22) } }]}
        />
      </div>
      <p className={noteCls}>快捷项一键填充并关闭面板；默认提供“近 7 天 / 近 30 天”（含今天），可追加业务区间。</p>
    </div>
  );
}

function DateRangePickerBusiness() {
  const id = useId();
  const initial: DateRange = { from: new Date(2026, 8, 1), to: new Date(2026, 8, 22) };
  const [value, setValue] = useState<DateRange | null>(initial);
  const days = countRangeDays(value);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={`${id}-range`} className="shrink-0">
          创建时间
        </Label>
        <DateRangePicker id={`${id}-range`} className="w-[300px]" value={value} onValueChange={setValue} />
        {value && (
          <Button variant="ghost" size="sm" onClick={() => setValue(null)}>
            清除筛选
          </Button>
        )}
      </div>
      <p className={noteCls} aria-live="polite">
        {days > 0
          ? `已选 ${days} 天 · 命中 18 个任务 · 区间含开始与结束当日 · 应用到 示例项目（project-042）的任务列表。`
          : "未限定创建时间 · 显示 示例项目（project-042）的全部任务。"}
      </p>
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

const MAX_UPLOAD = 50 * 1024 * 1024;

/** 演示用：本地模拟上传进度（真实场景由父组件调用上传接口并回写进度）。 */
function useDemoUploads(initial: UploadFileItem[] = []) {
  const [files, setFiles] = useState<UploadFileItem[]>(initial);
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => clearInterval(timer));
  }, []);

  const run = (id: string) => {
    clearInterval(timers.current.get(id));
    const timer = setInterval(() => {
      setFiles((list) =>
        list.map((file) => {
          if (file.id !== id || file.status !== "uploading") return file;
          const progress = Math.min(100, (file.progress ?? 0) + 18);
          return progress >= 100 ? { ...file, progress: 100, status: "success" } : { ...file, progress };
        }),
      );
    }, 400);
    timers.current.set(id, timer);
    setTimeout(() => clearInterval(timer), 400 * 8);
  };

  const add = (picked: File[]) => {
    const items = picked.map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, size: file.size, status: "uploading" as const, progress: 0 }));
    setFiles((list) => [...list, ...items]);
    items.forEach((item) => run(item.id));
  };
  const reject = (rejections: UploadRejection[]) =>
    setFiles((list) => [
      ...list,
      ...rejections.map((r, index) => ({ id: `${Date.now()}-r${index}`, name: r.file.name, size: r.file.size, status: "error" as const, error: r.reason })),
    ]);
  const retry = (target: UploadFileItem) => {
    setFiles((list) => list.map((file) => (file.id === target.id ? { ...file, status: "uploading", progress: 0, error: undefined } : file)));
    run(target.id);
  };
  const remove = (target: UploadFileItem) => {
    clearInterval(timers.current.get(target.id));
    setFiles((list) => list.filter((file) => file.id !== target.id));
  };
  return { files, add, reject, retry, remove };
}

function UploadBasic() {
  const uploads = useDemoUploads();
  return (
    <div className="grid max-w-[480px] gap-3">
      <Upload accept=".csv,.xlsx" maxSize={MAX_UPLOAD} multiple onFilesSelected={uploads.add} onFilesRejected={uploads.reject} />
      <UploadFileList files={uploads.files} onRetry={uploads.retry} onRemove={uploads.remove} />
      <p className={noteCls}>接受的格式与大小上限写在区域内；类型或大小不符在选择时即拒绝并逐个说明原因。示例文件：example.com/templates/battery.csv</p>
    </div>
  );
}

function UploadProgress() {
  const uploads = useDemoUploads([
    { id: "f1", name: "cycle_data_20260901.csv", size: 19_084_492, status: "uploading", progress: 72 },
    { id: "f2", name: "notes_final(2).xlsx", size: 63_963_136, status: "error", error: "超过 50.0 MB 上限（61.0 MB），未开始上传" },
    { id: "f3", name: "impedance_run-28003.csv", size: 2_411_724, status: "success" },
  ]);
  return (
    <div className="grid max-w-[480px] gap-3">
      <UploadFileList files={uploads.files} onRetry={uploads.retry} onRemove={uploads.remove} />
      <p className={noteCls}>逐文件展示进度与百分比；失败给出具体原因并可单独重试，不静默丢弃。</p>
    </div>
  );
}

function UploadBusiness() {
  const uploads = useDemoUploads();
  return (
    <div className="grid max-w-[520px] gap-3">
      <Upload
        layout="inline"
        accept=".csv,.xlsx"
        maxSize={MAX_UPLOAD}
        title="导入仪器原始数据"
        description=".csv / .xlsx · 单个 ≤ 50 MB"
        onFilesSelected={uploads.add}
        onFilesRejected={uploads.reject}
      />
      <UploadFileList files={uploads.files} onRetry={uploads.retry} onRemove={uploads.remove} />
      <Alert variant="success">
        <FileText className="size-4" />
        <AlertTitle>原始文件将不可变保留</AlertTitle>
        <AlertDescription>
          原始文件与解析产物分开存储；解析失败可重新解析，不覆盖原始文件。上传成功后自动关联到 示例项目（project-042）的数据集（如 ds-118）。
        </AlertDescription>
      </Alert>
    </div>
  );
}

/* ---------- SearchField ---------- */

function SearchFieldBasic() {
  const [last, setLast] = useState("");
  return (
    <div className="grid max-w-[320px] gap-3">
      <SearchField placeholder="搜索数据集名称或编号" shortcut="/" onSearch={setLast} />
      <p className={noteCls}>
        占位文本写明可搜字段；按 / 聚焦，Enter 搜索，Esc 清空。{last ? `已搜索：${last}` : ""}
      </p>
    </div>
  );
}

function SearchFieldLoadingClear() {
  const [value, setValue] = useState("run-");
  return (
    <div className="grid max-w-[320px] gap-3">
      <SearchField aria-label="搜索数据集（搜索中）" defaultValue="ds-118" loading clearable={false} />
      <SearchField aria-label="搜索任务" value={value} onValueChange={setValue} />
      <p className={noteCls}>搜索中右侧显示 spinner，输入不锁定；有值时提供一键清除。</p>
    </div>
  );
}

const demoRuns = [
  { id: "run-28003", name: "电导率优化第 3 轮" },
  { id: "run-28004", name: "热稳定性复测" },
  { id: "run-28005", name: "空白对照" },
];

function SearchFieldBusiness() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pending, setPending] = useState(false);
  const matched = demoRuns.filter((run) => run.id.includes(keyword) || run.name.includes(keyword));
  return (
    <div className="grid max-w-[420px] gap-3">
      <SearchField
        placeholder="搜索任务名称或编号"
        value={input}
        onValueChange={(next) => {
          setInput(next);
          setPending(true);
        }}
        debounce={300}
        loading={pending}
        onSearch={(next) => {
          setKeyword(next.trim());
          setPending(false);
        }}
      />
      {matched.length > 0 ? (
        <ul className="m-0 grid list-none gap-1.5 p-0" aria-live="polite">
          {matched.map((run) => (
            <li key={run.id} className="flex items-center justify-between gap-2.5 rounded-md border px-2.5 py-2 text-base">
              <span className="font-medium">{run.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{run.id}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-md border border-dashed px-3 py-2.5 text-sm text-muted-foreground" aria-live="polite">
          <span>没有匹配「{keyword}」的任务</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setInput("");
              setKeyword("");
            }}
          >
            清除关键词
          </Button>
        </div>
      )}
      <p className={noteCls}>停止输入 300ms 后过滤（Enter 立即搜索）；空结果给出清除动作。</p>
    </div>
  );
}

/* ---------- FilterBar（组合：SearchField + Select + DateRangePicker + Button） ---------- */

const statusLabels: Record<string, string> = { all: "全部状态", running: "运行中", queued: "排队中", finished: "已完成" };

interface FilterState {
  keyword: string;
  status: string;
  createdAt: DateRange | null;
}

const emptyFilters: FilterState = { keyword: "", status: "all", createdAt: null };

function isDefaultFilters(f: FilterState) {
  return f.keyword === "" && f.status === "all" && !f.createdAt;
}

function DemoFilterBar({ value, onChange }: { value: FilterState; onChange: (next: FilterState) => void }) {
  return (
    <div role="search" aria-label="筛选条件" className="flex flex-wrap items-center gap-2">
      <SearchField
        wrapperClassName="w-[220px]"
        placeholder="搜索任务名称或编号"
        value={value.keyword}
        onValueChange={(keyword) => onChange({ ...value, keyword })}
      />
      <Select value={value.status} onValueChange={(status) => onChange({ ...value, status })}>
        <SelectTrigger aria-label="状态" className="w-[132px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DateRangePicker
        aria-label="创建时间"
        className="w-[260px]"
        placeholder="创建时间"
        value={value.createdAt}
        onValueChange={(createdAt) => onChange({ ...value, createdAt })}
      />
      {!isDefaultFilters(value) && (
        <Button variant="ghost" onClick={() => onChange(emptyFilters)}>
          <RotateCcw />
          重置
        </Button>
      )}
    </div>
  );
}

function FilterBarBasic() {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, status: "running" });
  return (
    <div className="grid gap-3">
      <DemoFilterBar value={filters} onChange={setFilters} />
      <p className={noteCls}>关键词、状态、创建时间三项外露；有非默认条件时出现“重置”。</p>
    </div>
  );
}

const fmtDay = (d?: Date) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");

function activeChips(f: FilterState): { key: keyof FilterState; label: string }[] {
  const chips: { key: keyof FilterState; label: string }[] = [];
  if (f.keyword) chips.push({ key: "keyword", label: `关键词 = ${f.keyword}` });
  if (f.status !== "all") chips.push({ key: "status", label: `状态 = ${statusLabels[f.status]}` });
  if (f.createdAt?.from && f.createdAt.to) chips.push({ key: "createdAt", label: `创建时间 = ${fmtDay(f.createdAt.from)} ~ ${fmtDay(f.createdAt.to)}` });
  return chips;
}

function ActiveFilterBadges({ value, onChange }: { value: FilterState; onChange: (next: FilterState) => void }) {
  const chips = activeChips(value);
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-sm text-muted-foreground">已选条件：</span>
      {chips.map((chip) => (
        <Badge key={chip.key} tone="primary" className="pr-0.5">
          {chip.label}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`移除筛选：${chip.label}`}
            onClick={() => onChange({ ...value, [chip.key]: emptyFilters[chip.key] })}
            className="size-4 text-primary hover:bg-primary/10 [&_svg]:size-3"
          >
            <X />
          </Button>
        </Badge>
      ))}
    </div>
  );
}

const activeDefaults: FilterState = { keyword: "", status: "running", createdAt: { from: new Date(2026, 8, 16), to: new Date(2026, 8, 22) } };

function FilterBarActiveFilters() {
  const [filters, setFilters] = useState<FilterState>(activeDefaults);
  return (
    <div className="grid gap-3">
      <ActiveFilterBadges value={filters} onChange={setFilters} />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setFilters(emptyFilters)} disabled={isDefaultFilters(filters)}>
          <RotateCcw />
          重置
        </Button>
        <Button variant="link" size="sm" onClick={() => setFilters(activeDefaults)}>
          恢复演示条件
        </Button>
      </div>
      <p className={noteCls}>已选条件以 Badge 回显，可单个移除；“重置”一键恢复默认。</p>
    </div>
  );
}

const filterRuns = [
  { id: "run-28003", name: "电导率优化第 3 轮", status: "running", createdAt: new Date(2026, 8, 21) },
  { id: "run-28004", name: "热稳定性复测", status: "running", createdAt: new Date(2026, 8, 19) },
  { id: "run-28005", name: "空白对照", status: "finished", createdAt: new Date(2026, 8, 12) },
  { id: "run-28006", name: "低温循环", status: "queued", createdAt: new Date(2026, 8, 20) },
  { id: "run-28007", name: "倍率性能验证", status: "running", createdAt: new Date(2026, 8, 17) },
];

const statusTone: Record<string, "success" | "neutral" | "primary"> = { running: "success", queued: "neutral", finished: "primary" };

function FilterBarBusiness() {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, status: "running" });
  const rows = filterRuns.filter((run) => {
    const kw = filters.keyword.trim();
    if (kw && !run.id.includes(kw) && !run.name.includes(kw)) return false;
    if (filters.status !== "all" && run.status !== filters.status) return false;
    const range = filters.createdAt;
    if (range?.from && range.to && (run.createdAt < range.from || run.createdAt > range.to)) return false;
    return true;
  });
  return (
    <div className="grid gap-3">
      <DemoFilterBar value={filters} onChange={setFilters} />
      <ActiveFilterBadges value={filters} onChange={setFilters} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <span className="font-medium">{run.name}</span>
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{run.id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusTone[run.status]} dot>
                      {statusLabels[run.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fmtDay(run.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  没有符合当前筛选的任务
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className={noteCls} aria-live="polite">
        共 {rows.length} 个任务 · 条件变化即时应用到列表与计数，无需“查询”按钮。
      </p>
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
