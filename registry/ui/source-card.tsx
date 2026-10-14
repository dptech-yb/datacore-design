// SourceCard 来源卡片：整卡可点击，展示来源标题、发布方、更新时间与可访问状态（可访问 / 需申请 / 已失效）。
import * as React from "react";
import { Ban, CircleCheck, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export type SourceAccessibility = "available" | "restricted" | "unavailable";

export interface SourceInfo {
  id: string;
  title: string;
  /** 发布方全称。 */
  publisher: string;
  /** 绝对时间，精确到分钟：2026-09-18 14:32。 */
  updatedAt: string;
  accessibility: SourceAccessibility;
  /** 失效或受限原因：已下线、已删除、需项目管理员审批。 */
  reason?: string;
}

const accessMeta: Record<
  SourceAccessibility,
  { label: string; tone: "success" | "warning" | "danger"; icon: React.ComponentType<{ className?: string }>; action: string }
> = {
  available: { label: "可访问", tone: "success", icon: CircleCheck, action: "打开来源" },
  restricted: { label: "需申请", tone: "warning", icon: Lock, action: "申请权限" },
  unavailable: { label: "已失效", tone: "danger", icon: Ban, action: "查看说明" },
};

export interface SourceCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  source: SourceInfo;
  /** 可访问时点击卡片：打开来源。 */
  onOpen?: (id: string) => void;
  /** 需申请时点击卡片：进入权限申请流程。 */
  onRequestAccess?: (id: string) => void;
  /** 已失效时点击卡片：查看失效说明（不打开假链接）。 */
  onViewReason?: (id: string) => void;
  /** 紧凑模式：省略发布方与更新时间，用于窄栏。 */
  compact?: boolean;
  /** 被 Citation 定位时的高亮描边。 */
  highlighted?: boolean;
}

export const SourceCard = React.forwardRef<HTMLButtonElement, SourceCardProps>(
  ({ source, onOpen, onRequestAccess, onViewReason, compact, highlighted, className, ...props }, ref) => {
    const meta = accessMeta[source.accessibility];
    const Icon = meta.icon;
    const handler =
      source.accessibility === "available" ? onOpen : source.accessibility === "restricted" ? onRequestAccess : onViewReason;
    const dim = source.accessibility === "unavailable";
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => handler?.(source.id)}
        aria-label={`${source.title}，${meta.label}${source.reason ? `（${source.reason}）` : ""}，${meta.action}`}
        className={cn(
          "group flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border bg-card p-3.5 text-left font-[inherit] text-card-foreground",
          "transition-[border-color,box-shadow,transform] duration-fast ease-standard hover:-translate-y-px hover:border-primary hover:shadow-sm active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:border-primary",
          highlighted && "border-primary ring-2 ring-primary/30",
          compact && "p-2.5",
          className,
        )}
        {...props}
      >
        <FileText className={cn("mt-0.5 size-4 shrink-0", dim ? "text-muted-foreground" : "text-primary")} aria-hidden />
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className={cn("line-clamp-2 text-base font-medium", dim && "text-muted-foreground line-through decoration-muted-foreground/50")}>
            {source.title}
          </span>
          {!compact && (
            <span className="truncate text-xs text-muted-foreground">
              {source.publisher} · 更新于 {source.updatedAt}
            </span>
          )}
          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge tone={meta.tone}>
              <Icon className="size-3" aria-hidden />
              {meta.label}
            </Badge>
            {source.reason && <span className="text-xs text-muted-foreground">{source.reason}</span>}
            <span className="ml-auto text-sm font-medium text-primary group-hover:underline">{meta.action}</span>
          </span>
        </span>
      </button>
    );
  },
);
SourceCard.displayName = "SourceCard";

/** 元数据加载中的骨架，尺寸与卡片一致，避免加载后跳动。 */
export function SourceCardSkeleton({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border bg-card p-3.5", compact && "p-2.5", className)} aria-label="正在加载来源" role="status">
      <Skeleton className="size-4 shrink-0" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        {!compact && <Skeleton className="h-3 w-1/2" />}
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}
