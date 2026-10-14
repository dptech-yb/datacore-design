// 日期选择器：Popover + Calendar（react-day-picker 8，中文、周一起始），含单日 DatePicker 与带快捷区间的 DateRangePicker。
import * as React from "react";
import { differenceInCalendarDays, format as formatDate, startOfDay, subDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import type { DateRange, Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type { DateRange };

/** 月份标题：2026 年 9 月。 */
const calendarFormatters = { formatCaption: (month: Date) => formatDate(month, "yyyy 年 M 月") };

const triggerCls =
  "w-full justify-start gap-2 px-3 text-sm font-normal tabular-nums data-[state=open]:border-ring";

interface ClearButtonProps {
  onClear: () => void;
  label: string;
}

function ClearButton({ onClear, label }: ClearButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClear}
      className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3.5"
    >
      <X />
    </button>
  );
}

/* ---------- DatePicker ---------- */

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  /** 展示格式（date-fns），全站统一为 yyyy-MM-dd。 */
  format?: string;
  /** 不可选日期，react-day-picker Matcher：函数、{ before }、{ after }、日期数组等。 */
  disabledDates?: Matcher | Matcher[];
  /** 有值时显示清除按钮。 */
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      placeholder = "选择日期",
      format = "yyyy-MM-dd",
      disabledDates,
      clearable = true,
      disabled,
      invalid,
      id,
      className,
      ...aria
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [inner, setInner] = React.useState<Date | null>(defaultValue);
    const value = isControlled ? valueProp : inner;
    const [open, setOpen] = React.useState(false);

    const commit = (next: Date | null) => {
      if (!isControlled) setInner(next);
      onValueChange?.(next);
    };

    const showClear = clearable && !!value && !disabled;

    return (
      <div className={cn("relative w-full", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              type="button"
              variant="secondary"
              aria-haspopup="dialog"
              aria-invalid={invalid || undefined}
              disabled={disabled}
              className={cn(triggerCls, showClear && "pr-8", invalid && "border-danger")}
              {...aria}
            >
              <CalendarDays className="text-muted-foreground" />
              {value ? formatDate(value, format) : <span className="text-muted-foreground">{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              locale={zhCN}
              formatters={calendarFormatters}
              weekStartsOn={1}
              selected={value ?? undefined}
              defaultMonth={value ?? undefined}
              disabled={disabledDates}
              initialFocus
              onSelect={(next) => {
                commit(next ?? null);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {showClear && <ClearButton label="清除日期" onClear={() => commit(null)} />}
      </div>
    );
  },
);
DatePicker.displayName = "DatePicker";

/* ---------- DateRangePicker ---------- */

export interface DateRangePreset {
  label: string;
  /** 固定区间，或在点击时计算（相对今天）。 */
  range: DateRange | (() => DateRange);
}

/** 默认快捷项：含今天。 */
export const defaultDateRangePresets: DateRangePreset[] = [
  { label: "近 7 天", range: () => ({ from: subDays(startOfDay(new Date()), 6), to: startOfDay(new Date()) }) },
  { label: "近 30 天", range: () => ({ from: subDays(startOfDay(new Date()), 29), to: startOfDay(new Date()) }) },
];

export interface DateRangePickerProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** 点“确定”、快捷项或清除时触发；面板内中途点选不触发。 */
  onValueChange?: (value: DateRange | null) => void;
  placeholder?: string;
  format?: string;
  disabledDates?: Matcher | Matcher[];
  /** 快捷区间，传 [] 隐藏。 */
  presets?: DateRangePreset[];
  /** 面板同时显示的月份数。 */
  numberOfMonths?: number;
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

/** 区间含首尾两天的天数。 */
export function countRangeDays(range?: DateRange | null) {
  if (!range?.from || !range.to) return 0;
  return differenceInCalendarDays(range.to, range.from) + 1;
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      placeholder = "开始日期 ~ 结束日期",
      format = "yyyy-MM-dd",
      disabledDates,
      presets = defaultDateRangePresets,
      numberOfMonths = 2,
      clearable = true,
      disabled,
      invalid,
      id,
      className,
      ...aria
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [inner, setInner] = React.useState<DateRange | null>(defaultValue);
    const value = isControlled ? valueProp : inner;
    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange | undefined>(value ?? undefined);

    const commit = (next: DateRange | null) => {
      if (!isControlled) setInner(next);
      onValueChange?.(next);
    };

    const handleOpenChange = (next: boolean) => {
      if (next) setDraft(value ?? undefined); // 每次打开从已确认的值开始
      setOpen(next);
    };

    const complete = !!(value?.from && value.to);
    const showClear = clearable && complete && !disabled;
    const draftDays = countRangeDays(draft);

    return (
      <div className={cn("relative w-full", className)}>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              type="button"
              variant="secondary"
              aria-haspopup="dialog"
              aria-invalid={invalid || undefined}
              disabled={disabled}
              className={cn(triggerCls, showClear && "pr-8", invalid && "border-danger")}
              {...aria}
            >
              <CalendarDays className="text-muted-foreground" />
              {complete ? (
                <span className="truncate">
                  {formatDate(value!.from!, format)} ~ {formatDate(value!.to!, format)}
                </span>
              ) : (
                <span className="truncate text-muted-foreground">{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="flex w-auto max-w-[calc(100vw-2rem)] flex-col p-0 sm:flex-row">
            {presets.length > 0 && (
              <div className="flex gap-1 border-b p-2 sm:w-28 sm:flex-col sm:border-b-0 sm:border-r" aria-label="快捷区间" role="group">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      const range = typeof preset.range === "function" ? preset.range() : preset.range;
                      commit(range);
                      setOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex flex-col">
              <Calendar
                mode="range"
                locale={zhCN}
                formatters={calendarFormatters}
                weekStartsOn={1}
                numberOfMonths={numberOfMonths}
                selected={draft}
                defaultMonth={draft?.from ?? value?.from}
                disabled={disabledDates}
                initialFocus
                onSelect={setDraft}
              />
              <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  {draft?.from && draft.to
                    ? `已选 ${draftDays} 天（含首尾）`
                    : draft?.from
                      ? "请选择结束日期"
                      : "请选择开始日期"}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      commit(null);
                      setDraft(undefined);
                      setOpen(false);
                    }}
                  >
                    清除
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!draft?.from || !draft.to}
                    onClick={() => {
                      commit(draft ?? null);
                      setOpen(false);
                    }}
                  >
                    确定
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {showClear && <ClearButton label="清除日期范围" onClear={() => commit(null)} />}
      </div>
    );
  },
);
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
