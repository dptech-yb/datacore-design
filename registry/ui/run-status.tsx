// RunStatus 运行状态：任务生命周期封闭六态徽章（排队中 / 运行中 / 已成功 / 已失败 / 部分完成 / 需重试）+ 可选说明与下一步动作。
import * as React from "react";
import { ChartPie, CircleCheck, CircleHelp, CircleX, Clock, LoaderCircle, Lock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type RunStatusValue = "queued" | "running" | "succeeded" | "failed" | "partial" | "retry-needed";

export const runStatusMeta: Record<
  RunStatusValue,
  { label: string; tone: "neutral" | "primary" | "success" | "warning" | "danger"; icon: React.ComponentType<{ className?: string }> }
> = {
  queued: { label: "排队中", tone: "neutral", icon: Clock },
  running: { label: "运行中", tone: "primary", icon: LoaderCircle },
  succeeded: { label: "已成功", tone: "success", icon: CircleCheck },
  failed: { label: "已失败", tone: "danger", icon: CircleX },
  partial: { label: "部分完成", tone: "warning", icon: ChartPie },
  "retry-needed": { label: "需重试", tone: "warning", icon: RotateCcw },
};

export interface RunStatusProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 封闭六态；缺失时显示 neutral“状态未知”，不猜测。 */
  status?: RunStatusValue | null;
  /** 状态说明：失败原因、部分完成数量（12/15 完成）或队列位置。 */
  detail?: React.ReactNode;
  /** 覆盖默认文案，不改变颜色与图标。 */
  label?: string;
  /** 失败 / 需重试时展示“重试”。 */
  onRetry?: () => void;
  /** 部分完成时展示“查看明细”。 */
  onViewDetail?: () => void;
  /** 无权限查看：只显示锁态徽章，不暴露状态细节。 */
  restricted?: boolean;
  /** 状态刷新中：保留旧值并降低透明度，不闪回骨架。 */
  refreshing?: boolean;
}

export const RunStatus = React.forwardRef<HTMLDivElement, RunStatusProps>(
  ({ status, detail, label, onRetry, onViewDetail, restricted, refreshing, className, ...props }, ref) => {
    let badge: React.ReactNode;
    let spoken: string;
    if (restricted) {
      badge = (
        <Badge tone="neutral">
          <Lock className="size-3" aria-hidden />
          无权查看
        </Badge>
      );
      spoken = "无权查看状态";
    } else if (!status) {
      badge = (
        <Badge tone="outline">
          <CircleHelp className="size-3" aria-hidden />
          状态未知
        </Badge>
      );
      spoken = "状态未知";
    } else {
      const meta = runStatusMeta[status];
      const Icon = meta.icon;
      badge = (
        <Badge tone={meta.tone}>
          <Icon className={cn("size-3", status === "running" && "animate-spin")} aria-hidden />
          {label ?? meta.label}
        </Badge>
      );
      spoken = label ?? meta.label;
    }

    const showRetry = !restricted && onRetry && (status === "failed" || status === "retry-needed");
    const showDetail = !restricted && onViewDetail && status === "partial";
    const showText = !restricted && detail;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 align-middle transition-opacity",
          refreshing && "opacity-60",
          className,
        )}
        aria-busy={refreshing || undefined}
        {...props}
      >
        <span className="sr-only">{spoken}</span>
        <span aria-hidden className="inline-flex">{badge}</span>
        {showText && <span className="min-w-0 text-sm text-muted-foreground">{detail}</span>}
        {showRetry && (
          <Button variant="link" size="sm" onClick={onRetry}>
            <RotateCcw aria-hidden />
            重试
          </Button>
        )}
        {showDetail && (
          <Button variant="link" size="sm" onClick={onViewDetail}>
            查看明细
          </Button>
        )}
      </div>
    );
  },
);
RunStatus.displayName = "RunStatus";
