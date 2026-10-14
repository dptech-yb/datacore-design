// Statistic 统计数值：突出单个关键指标（标签 + 等宽大号数值 + 单位），可带涨跌趋势与加载骨架。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statisticVariants = cva("grid min-w-0 content-start gap-1", {
  variants: {
    variant: {
      plain: "",
      card: "rounded-lg border bg-card px-4 py-3 text-card-foreground",
    },
  },
  defaultVariants: { variant: "plain" },
});

const valueVariants = cva("font-semibold leading-none tracking-tight tabular-nums text-foreground", {
  variants: {
    size: { sm: "text-xl", default: "text-2xl", lg: "text-3xl" },
  },
  defaultVariants: { size: "default" },
});

export type TrendDirection = "up" | "down" | "flat";

export interface StatisticTrend {
  /** 变化量；数字会按 precision 格式化并补正负号，字符串原样展示。 */
  value: number | string;
  /** 方向；省略时按数字正负推断。 */
  direction?: TrendDirection;
  /** 对比口径，如“较上周”。 */
  label?: React.ReactNode;
}

export interface StatisticProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "prefix">,
    VariantProps<typeof statisticVariants>,
    VariantProps<typeof valueVariants> {
  /** 指标名称，写清口径。 */
  label: React.ReactNode;
  /** 数值；null / undefined 显示 —。 */
  value?: number | string | null;
  /** 小数位数（仅数字生效），并按 zh-CN 千分位格式化。 */
  precision?: number;
  /** 数值前缀，如 ¥。 */
  prefix?: React.ReactNode;
  /** 紧贴数值的后缀，如 %。 */
  suffix?: React.ReactNode;
  /** 计量单位，弱化显示在数值后，如“个”“秒”。 */
  unit?: React.ReactNode;
  /** 对比趋势。 */
  trend?: StatisticTrend;
  /** 哪个方向是“好”：up 表示上涨为好（绿），down 表示下降为好。 */
  goodDirection?: "up" | "down";
  /** 加载中：数值显示骨架条，标签保留。 */
  loading?: boolean;
}

function formatNumber(value: number, precision?: number) {
  return value.toLocaleString("zh-CN", precision === undefined ? undefined : { minimumFractionDigits: precision, maximumFractionDigits: precision });
}

const directionText: Record<TrendDirection, string> = { up: "上升", down: "下降", flat: "持平" };

const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  ({ label, value, precision, prefix, suffix, unit, trend, goodDirection = "up", loading, variant, size, className, ...props }, ref) => {
    const empty = value === null || value === undefined || value === "";
    const display = typeof value === "number" ? formatNumber(value, precision) : value;

    let trendNode: React.ReactNode = null;
    if (trend) {
      const direction: TrendDirection =
        trend.direction ?? (typeof trend.value === "number" ? (trend.value > 0 ? "up" : trend.value < 0 ? "down" : "flat") : "flat");
      const good = direction === "flat" ? null : direction === goodDirection;
      const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
      const trendValue =
        typeof trend.value === "number" ? `${trend.value > 0 ? "+" : ""}${formatNumber(trend.value, precision)}` : trend.value;
      trendNode = (
        <span
          className={cn(
            "inline-flex flex-wrap items-center gap-1 text-xs",
            good === null ? "text-muted-foreground" : good ? "text-success" : "text-danger",
          )}
        >
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="sr-only">{directionText[direction]}</span>
          <span className="font-mono tabular-nums">{trendValue}</span>
          {trend.label && <span className="text-muted-foreground">· {trend.label}</span>}
        </span>
      );
    }

    return (
      <div ref={ref} className={cn(statisticVariants({ variant }), className)} aria-busy={loading || undefined} {...props}>
        <span className="text-xs text-muted-foreground">{label}</span>
        {loading ? (
          <Skeleton className={cn("my-0.5 w-24", size === "lg" ? "h-[30px]" : size === "sm" ? "h-5" : "h-6")} />
        ) : (
          <span className="flex flex-wrap items-baseline gap-x-1">
            <span className={valueVariants({ size })}>
              {!empty && prefix && <span className="mr-0.5 text-[0.65em] font-medium">{prefix}</span>}
              {empty ? <span className="text-subtle">—</span> : display}
              {!empty && suffix && <span className="ml-0.5 text-[0.65em] font-medium">{suffix}</span>}
            </span>
            {!empty && unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </span>
        )}
        {!loading && trendNode}
      </div>
    );
  },
);
Statistic.displayName = "Statistic";

export { Statistic, statisticVariants };
