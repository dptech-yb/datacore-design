// Citation 引用角标：正文中的上标来源序号，与 SourceList 来源清单按 citationId 联动定位与高亮。
import * as React from "react";
import { Ban, ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type CitationStatus = "available" | "restricted" | "unavailable";

/** 来源条目在清单中的 DOM id，Citation 默认按它滚动定位。 */
export const citationSourceDomId = (citationId: string) => `dc-source-${citationId}`;

export interface CitationProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** 来源的稳定 ID（由后端分配，跨会话不变）。 */
  citationId: string;
  /** 在当前内容中的序号，从 1 开始。 */
  index: number;
  /** 来源标题：用于 hover 摘要与读屏标签。 */
  title?: string;
  /** 来源状态；失效 / 无权限时角标置灰但保留序号，仍可定位。 */
  status?: CitationStatus;
  /** 点击回调；未提供时默认滚动到 id 为 dc-source-{citationId} 的清单项。 */
  onLocate?: (citationId: string) => void;
}

export const Citation = React.forwardRef<HTMLButtonElement, CitationProps>(
  ({ citationId, index, title, status = "available", onLocate, className, onClick, ...props }, ref) => {
    const dim = status !== "available";
    const statusText = status === "unavailable" ? "（不可访问）" : status === "restricted" ? "（需申请权限）" : "";
    const label = `来源 ${index}${title ? `：${title}` : ""}${statusText}`;
    const button = (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        data-citation-id={citationId}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (onLocate) onLocate(citationId);
          else document.getElementById(citationSourceDomId(citationId))?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }}
        className={cn(
          // 内联 padding 扩大点击区域，负 margin 抵消，不改变行高
          "-mx-0.5 inline-flex cursor-pointer items-center rounded-sm border-0 bg-transparent px-0.5 py-0 align-super text-xs font-semibold leading-none",
          "transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dim ? "text-muted-foreground hover:text-foreground" : "text-primary hover:text-primary-hover hover:underline active:text-primary-hover",
          className,
        )}
        {...props}
      >
        {index}
      </button>
    );
    if (!title) return button;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent className="max-w-72">
          [{index}] {title}
          {statusText}
        </TooltipContent>
      </Tooltip>
    );
  },
);
Citation.displayName = "Citation";

export interface SourceListItem {
  /** 与 Citation 的 citationId 一致。 */
  id: string;
  index: number;
  title: string;
  status?: CitationStatus;
  /** 失效 / 无权限原因：已下线、已删除、需申请权限。 */
  reason?: string;
}

export interface SourceListProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "onSelect"> {
  sources: SourceListItem[];
  /** 当前被定位高亮的来源 ID（通常来自 useCitationLocator）。 */
  highlightId?: string | null;
  /** 点击来源标题：打开来源；无权限时用于发起申请。 */
  onOpenSource?: (source: SourceListItem) => void;
  /** 点击序号：反向定位到正文中的第一个引用位置。 */
  onLocateCitation?: (sourceId: string) => void;
  /** 清单标题，默认“来源”。 */
  heading?: string;
}

export const SourceList = React.forwardRef<HTMLOListElement, SourceListProps>(
  ({ sources, highlightId, onOpenSource, onLocateCitation, heading = "来源", className, ...props }, ref) => {
    const located = sources.find((source) => source.id === highlightId);
    React.useEffect(() => {
      if (!highlightId) return;
      document.getElementById(citationSourceDomId(highlightId))?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [highlightId]);
    return (
      <div className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{heading}</span>
        <ol ref={ref} aria-label={heading} className={cn("m-0 grid list-none gap-1 p-0", className)} {...props}>
          {sources.map((source) => {
            const status = source.status ?? "available";
            const highlighted = source.id === highlightId;
            return (
              <li
                key={source.id}
                id={citationSourceDomId(source.id)}
                className={cn(
                  "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-transparent px-2 py-1 text-sm transition-colors duration-base",
                  highlighted && "border-primary bg-primary-soft",
                )}
              >
                <button
                  type="button"
                  disabled={!onLocateCitation}
                  onClick={() => onLocateCitation?.(source.id)}
                  aria-label={`定位到正文中的引用 ${source.index}`}
                  className="shrink-0 cursor-pointer rounded-sm border-0 bg-transparent p-0 font-mono text-xs text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:text-muted-foreground"
                >
                  [{source.index}]
                </button>
                {onOpenSource && status !== "unavailable" ? (
                  <button
                    type="button"
                    onClick={() => onOpenSource(source)}
                    className="inline-flex min-w-0 cursor-pointer items-center gap-1 rounded-sm border-0 bg-transparent p-0 text-left text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate">{source.title}</span>
                    {status === "available" && <ExternalLink className="size-3 shrink-0" aria-hidden />}
                  </button>
                ) : (
                  <span className={cn("min-w-0 truncate", status === "available" ? "text-foreground" : "text-muted-foreground")}>
                    {source.title}
                  </span>
                )}
                {status === "unavailable" && (
                  <Badge tone="danger">
                    <Ban className="size-3" aria-hidden />
                    不可访问{source.reason ? ` · ${source.reason}` : ""}
                  </Badge>
                )}
                {status === "restricted" && (
                  <Badge tone="warning">
                    <Lock className="size-3" aria-hidden />
                    {source.reason ?? "需申请权限"}
                  </Badge>
                )}
              </li>
            );
          })}
        </ol>
        <span className="sr-only" aria-live="polite">
          {located ? `已定位来源 ${located.index}：${located.title}` : ""}
        </span>
      </div>
    );
  },
);
SourceList.displayName = "SourceList";

/**
 * 角标定位状态：locate(id) 设置高亮，duration 毫秒后自动消退；同一时间只有一个高亮项。
 * 用法：const { locatedId, locate, clear } = useCitationLocator();
 */
export function useCitationLocator(duration = 2000) {
  const [locatedId, setLocatedId] = React.useState<string | null>(null);
  const timer = React.useRef<number>();
  const clear = React.useCallback(() => {
    window.clearTimeout(timer.current);
    setLocatedId(null);
  }, []);
  const locate = React.useCallback(
    (id: string) => {
      window.clearTimeout(timer.current);
      setLocatedId(id);
      timer.current = window.setTimeout(() => setLocatedId(null), duration);
    },
    [duration],
  );
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!locatedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locatedId, clear]);
  return { locatedId, locate, clear };
}
