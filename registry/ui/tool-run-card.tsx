// ToolRunCard 工具运行卡片：一次工具调用的留痕（工具名、状态、耗时、参数摘要、输入输出），完整参数默认折叠，失败给错误摘要与重试。
import * as React from "react";
import { ChevronDown, CircleCheck, CircleX, LoaderCircle, Lock, RotateCcw, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type ToolRunStatus = "running" | "succeeded" | "failed";

const statusMeta: Record<ToolRunStatus, { label: string; tone: "primary" | "success" | "danger"; icon: React.ComponentType<{ className?: string }> }> = {
  running: { label: "运行中", tone: "primary", icon: LoaderCircle },
  succeeded: { label: "已完成", tone: "success", icon: CircleCheck },
  failed: { label: "已失败", tone: "danger", icon: CircleX },
};

/** 耗时格式化：300ms、1.2s、3m34s。 */
export function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) {
    const s = ms / 1000;
    return `${s < 10 ? s.toFixed(1).replace(/\.0$/, "") : Math.round(s)}s`;
  }
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}m${String(total % 60).padStart(2, "0")}s`;
}

export interface ToolRunCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 工具名，与注册表一致，mono 字体。 */
  tool: string;
  status: ToolRunStatus;
  /** 单行参数摘要，只放关键参数。 */
  paramsSummary?: string;
  /** 耗时（毫秒），完成后定格。 */
  duration?: number;
  /** 运行开始时间（毫秒时间戳）；running 时据此实时计时。 */
  startedAt?: number;
  /** 输入摘要：数据集、批次与记录数。 */
  input?: React.ReactNode;
  /** 输出摘要：产物与关键结果。 */
  output?: React.ReactNode;
  /** 失败时的一行错误摘要。 */
  error?: string;
  /** 完整参数（对象会格式化为 JSON）。 */
  params?: Record<string, unknown> | string;
  /** 展开区里的完整输出 / 错误堆栈。 */
  details?: React.ReactNode;
  /** 完整参数与输出放进折叠区（默认 true）；false 时直接展开。 */
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** 无权限查看输出：输出区显示锁态占位。 */
  outputRestricted?: boolean;
  /** 失败时的重试回调（重试应生成新的调用卡片）。 */
  onRetry?: () => void;
}

export const ToolRunCard = React.forwardRef<HTMLDivElement, ToolRunCardProps>(
  (
    { tool, status, paramsSummary, duration, startedAt, input, output, error, params, details, collapsible = true, defaultOpen = false, outputRestricted, onRetry, className, ...props },
    ref,
  ) => {
    const [now, setNow] = React.useState(() => Date.now());
    const [open, setOpen] = React.useState(defaultOpen || !collapsible);
    React.useEffect(() => {
      if (status !== "running" || startedAt == null) return;
      const t = window.setInterval(() => setNow(Date.now()), 1000);
      return () => window.clearInterval(t);
    }, [status, startedAt]);
    const elapsed = status === "running" && startedAt != null ? Math.max(0, now - startedAt) : duration;
    const meta = statusMeta[status];
    const Icon = meta.icon;
    const paramsText = params == null ? null : typeof params === "string" ? params : JSON.stringify(params, null, 2);
    const hasExpandable = Boolean(paramsText || details);

    const expandable = hasExpandable && (
      <div className="grid gap-2">
        {paramsText && (
          <pre className="m-0 overflow-x-auto rounded-md bg-muted p-2.5 font-mono text-xs leading-relaxed text-foreground">{paramsText}</pre>
        )}
        {details && <div className="rounded-md bg-muted p-2.5 text-sm">{details}</div>}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn("grid gap-2.5 rounded-lg border bg-card p-3.5 text-card-foreground transition-colors hover:border-input", className)}
        {...props}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Wrench className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate font-mono text-base font-semibold">{tool}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2">
            <span role="status" aria-live="polite">
              <Badge tone={meta.tone}>
                <Icon className={cn("size-3", status === "running" && "animate-spin")} aria-hidden />
                {meta.label}
              </Badge>
            </span>
            {elapsed != null && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground" aria-label={`耗时 ${formatDuration(elapsed)}`}>
                {formatDuration(elapsed)}
                {status === "running" ? "…" : ""}
              </span>
            )}
          </span>
        </div>

        {paramsSummary && (
          <p className="m-0 truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground" title={paramsSummary}>
            {paramsSummary}
          </p>
        )}

        {(input || output || outputRestricted) && (
          <dl className="m-0 grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1 text-sm">
            {input && (
              <>
                <dt className="text-muted-foreground">输入</dt>
                <dd className="m-0 min-w-0">{input}</dd>
              </>
            )}
            {(output || outputRestricted) && (
              <>
                <dt className="text-muted-foreground">输出</dt>
                <dd className="m-0 min-w-0">
                  {outputRestricted ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="size-3.5" aria-hidden />
                      无权查看输出，需申请项目可见权限
                    </span>
                  ) : (
                    output
                  )}
                </dd>
              </>
            )}
          </dl>
        )}

        {status === "failed" && error && (
          <div role="alert" className="flex flex-wrap items-center gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm">
            <CircleX className="size-4 shrink-0 text-danger" aria-hidden />
            <span className="min-w-0 flex-1">{error}</span>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                <RotateCcw aria-hidden />
                重试
              </Button>
            )}
          </div>
        )}

        {hasExpandable &&
          (collapsible ? (
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="-ml-2">
                  <ChevronDown className={cn("transition-transform", open && "rotate-180")} aria-hidden />
                  {open ? "收起完整参数" : "展开完整参数"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">{expandable}</CollapsibleContent>
            </Collapsible>
          ) : (
            expandable
          ))}
      </div>
    );
  },
);
ToolRunCard.displayName = "ToolRunCard";
