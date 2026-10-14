// AuditTimeline 审计时间线：只读、只增不改的操作记录（谁 · 何时 · 对什么 · 做了什么），支持级别标注、详情展开、按级别过滤与加载更早记录。
import * as React from "react";
import { Bot, ChevronDown, CircleAlert, Lock, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedList, SegmentedTrigger, Tabs } from "@/components/ui/tabs";

export type AuditLevel = "info" | "warning" | "critical";
export type AuditFilter = "all" | "critical";

export interface AuditEvent {
  id: string;
  /** 操作者显示名；系统与 Agent 同样是审计主体。 */
  actor: string;
  actorType?: "user" | "system" | "agent";
  /** 动作：更新了数据集。 */
  action: string;
  /** 对象：ds-118 · v3。 */
  target: string;
  /** 绝对时间，精确到分钟：2026-09-21 10:24。 */
  at: string;
  /** 机器可读时间（ISO），写入 <time datetime>；缺省取 at。 */
  datetime?: string;
  level?: AuditLevel;
  /** 详情：参数差异、失败原因；提供后该行可展开。 */
  detail?: React.ReactNode;
}

const levelMeta: Record<Exclude<AuditLevel, "info">, { label: string; tone: "warning" | "danger"; icon: React.ComponentType<{ className?: string }>; dot: string }> = {
  warning: { label: "关键", tone: "warning", icon: CircleAlert, dot: "bg-warning" },
  critical: { label: "高危", tone: "danger", icon: ShieldAlert, dot: "bg-danger" },
};

export interface AuditTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: AuditEvent[];
  /** 级别过滤；critical 只展示 warning 与 critical 事件。提供 onFilterChange 时渲染过滤控件。 */
  filter?: AuditFilter;
  onFilterChange?: (filter: AuditFilter) => void;
  /** 加载更早记录；提供时底部渲染“加载更早记录”。 */
  onLoadMore?: () => void;
  /** 加载更多中：底部显示骨架行。 */
  loadingMore?: boolean;
  /** 点击对象跳转资源详情。 */
  onTargetClick?: (event: AuditEvent) => void;
  /** 无审计权限：显示锁态，不渲染任何条目。 */
  restricted?: boolean;
  /** 空态说明，写清记录从何时开始产生。 */
  emptyText?: string;
}

function AuditRow({ event, onTargetClick }: { event: AuditEvent; onTargetClick?: (event: AuditEvent) => void }) {
  const [open, setOpen] = React.useState(false);
  const detailId = React.useId();
  const level = event.level && event.level !== "info" ? levelMeta[event.level] : null;
  const dot = level ? level.dot : event.actorType === "agent" ? "bg-agent" : "bg-primary";
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0 [&:last-child>[data-line]]:hidden">
      {/* 竖线 + 节点圆点 */}
      <span aria-hidden data-line="" className="absolute bottom-0 left-[3.5px] top-3 w-px bg-border" />
      <span aria-hidden className={cn("relative mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-background", dot)} />
      <div className="grid min-w-0 flex-1 gap-0.5" title={`事件 ${event.id} · ${event.datetime ?? event.at}`}>
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-base">
          <span className="inline-flex items-center gap-1 font-semibold">
            {event.actorType === "agent" && <Sparkles className="size-3.5 text-agent" aria-hidden />}
            {event.actorType === "system" && <Bot className="size-3.5 text-muted-foreground" aria-hidden />}
            {event.actor}
          </span>
          {event.actorType === "agent" && <Badge tone="agent">Agent</Badge>}
          <span>{event.action}</span>
          {onTargetClick ? (
            <Button variant="link" size="sm" className="font-mono text-sm" onClick={() => onTargetClick(event)}>
              {event.target}
            </Button>
          ) : (
            <span className="font-mono text-sm">{event.target}</span>
          )}
          {level && (
            <Badge tone={level.tone} className="ml-auto">
              <level.icon className="size-3" aria-hidden />
              {level.label}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={event.datetime ?? event.at.replace(" ", "T")} className="text-xs text-muted-foreground">
            {event.at}
          </time>
          {event.detail && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              aria-label={open ? "收起事件详情" : "查看事件详情"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-0.5 rounded-sm border-0 bg-transparent p-0 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              详情
              <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} aria-hidden />
            </button>
          )}
        </div>
        {event.detail && open && (
          <div id={detailId} className="mt-1 rounded-md bg-muted px-2.5 py-1.5 text-sm text-muted-foreground">
            {event.detail}
            <span className="ml-2 font-mono text-xs">· {event.id}</span>
          </div>
        )}
      </div>
    </li>
  );
}

export const AuditTimeline = React.forwardRef<HTMLDivElement, AuditTimelineProps>(
  ({ events, filter = "all", onFilterChange, onLoadMore, loadingMore, onTargetClick, restricted, emptyText = "暂无审计记录。项目创建后的每一次操作都会记录在这里。", className, ...props }, ref) => {
    const keyCount = events.filter((e) => e.level === "warning" || e.level === "critical").length;
    const visible = filter === "critical" ? events.filter((e) => e.level === "warning" || e.level === "critical") : events;

    if (restricted) {
      return (
        <div ref={ref} className={cn("flex items-center gap-2 rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground", className)} {...props}>
          <Lock className="size-4" aria-hidden />
          你没有查看审计记录的权限，请联系项目管理员。
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("grid gap-3", className)} {...props}>
        {onFilterChange && (
          <Tabs value={filter} onValueChange={(v) => onFilterChange(v as AuditFilter)}>
            <SegmentedList aria-label="按级别过滤">
              <SegmentedTrigger value="all">全部（{events.length}）</SegmentedTrigger>
              <SegmentedTrigger value="critical">仅关键（{keyCount}）</SegmentedTrigger>
            </SegmentedList>
          </Tabs>
        )}
        {visible.length === 0 && !loadingMore ? (
          <p className="m-0 rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ol className="m-0 grid list-none p-0" aria-label="审计记录">
            {visible.map((event) => (
              <AuditRow key={event.id} event={event} onTargetClick={onTargetClick} />
            ))}
          </ol>
        )}
        {loadingMore && (
          <div className="grid gap-2 pl-5" role="status" aria-label="正在加载更早记录">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        )}
        {onLoadMore && !loadingMore && (
          <Button variant="ghost" size="sm" className="justify-self-start" onClick={onLoadMore}>
            加载更早记录
          </Button>
        )}
      </div>
    );
  },
);
AuditTimeline.displayName = "AuditTimeline";
