// 数字输入框：min / max / step / precision 约束，单位后缀，− / + 步进按钮，↑ / ↓ 键步进，失焦收敛到合法值。
import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step" | "size"
  > {
  /** 受控值；null 表示未填写。 */
  value?: number | null;
  /** 非受控初始值。 */
  defaultValue?: number | null;
  /** 提交后的值变化（失焦、Enter、步进时触发）；清空回传 null。 */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 小数位数；不传则保留输入精度。 */
  precision?: number;
  /** 单位后缀，只展示不进值。 */
  unit?: React.ReactNode;
  /** 外部校验失败（如必填未填）。越界输入会自动标红，无需传入。 */
  invalid?: boolean;
  /** 隐藏 − / + 按钮，只保留方向键步进。 */
  hideSteppers?: boolean;
  /** 外层容器 className；className 作用于 input。 */
  wrapperClassName?: string;
}

const decimalsOf = (n: number) => {
  const text = String(n);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
};

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      unit,
      invalid,
      hideSteppers,
      disabled,
      readOnly,
      className,
      wrapperClassName,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [inner, setInner] = React.useState<number | null>(defaultValue);
    const value = isControlled ? valueProp : inner;

    const format = React.useCallback(
      (n: number | null) => (n === null ? "" : precision !== undefined ? n.toFixed(precision) : String(n)),
      [precision],
    );
    const [draft, setDraft] = React.useState(() => format(value));
    const focused = React.useRef(false);

    // 外部值变化且不在编辑中时，同步展示文本
    React.useEffect(() => {
      if (!focused.current) setDraft(format(value));
    }, [value, format]);

    const normalize = (n: number) => {
      let next = n;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      const digits = precision ?? Math.max(decimalsOf(step), decimalsOf(next));
      return Number(next.toFixed(Math.min(digits, 20)));
    };

    const commit = (next: number | null) => {
      if (!isControlled) setInner(next);
      setDraft(format(next));
      if (next !== value) onValueChange?.(next);
    };

    const parsed = draft.trim() === "" || draft === "-" || draft === "." ? null : Number(draft);
    const outOfRange =
      parsed !== null && !Number.isNaN(parsed) && ((min !== undefined && parsed < min) || (max !== undefined && parsed > max));
    const isInvalid = invalid || outOfRange;

    const commitDraft = () => {
      if (parsed === null || Number.isNaN(parsed)) commit(null);
      else commit(normalize(parsed));
    };

    const stepBy = (direction: 1 | -1) => {
      if (disabled || readOnly) return;
      const base = parsed !== null && !Number.isNaN(parsed) ? parsed : value ?? min ?? 0;
      commit(normalize(base + direction * step));
    };

    const atMin = value !== null && min !== undefined && value <= min;
    const atMax = value !== null && max !== undefined && value >= max;
    const allowNegative = min === undefined || min < 0;
    const pattern = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

    const stepperCls =
      "flex w-7 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5";

    return (
      <div
        className={cn(
          "flex h-8 w-full items-stretch overflow-hidden rounded-md border border-input bg-background shadow-xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
          isInvalid && "border-danger focus-within:border-danger focus-within:ring-danger/20",
          disabled && "cursor-not-allowed opacity-50",
          wrapperClassName,
        )}
      >
        {!hideSteppers && !readOnly && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="减少"
            disabled={disabled || atMin}
            onClick={() => stepBy(-1)}
            className={cn(stepperCls, "border-r border-input")}
          >
            <Minus />
          </button>
        )}
        <input
          ref={ref}
          type="text"
          role="spinbutton"
          inputMode={precision === 0 ? "numeric" : "decimal"}
          autoComplete="off"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          aria-valuetext={value !== null && typeof unit === "string" ? `${format(value)} ${unit}` : undefined}
          aria-invalid={isInvalid || undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={draft}
          onFocus={(event) => {
            focused.current = true;
            onFocus?.(event);
          }}
          onChange={(event) => {
            const next = event.target.value;
            if (pattern.test(next)) setDraft(next); // 非法字符直接忽略
          }}
          onBlur={(event) => {
            focused.current = false;
            commitDraft();
            onBlur?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "ArrowUp") {
              event.preventDefault();
              stepBy(1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              stepBy(-1);
            } else if (event.key === "Enter") {
              commitDraft();
            } else if (event.key === "Escape") {
              setDraft(format(value));
            }
          }}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-2.5 text-base tabular-nums text-foreground outline-none placeholder:text-subtle disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {unit !== undefined && (
          <span aria-hidden="true" className="flex shrink-0 items-center pr-2.5 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
        {!hideSteppers && !readOnly && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="增加"
            disabled={disabled || atMax}
            onClick={() => stepBy(1)}
            className={cn(stepperCls, "border-l border-input")}
          >
            <Plus />
          </button>
        )}
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
