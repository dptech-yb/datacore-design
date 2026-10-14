// Timeline 时间线：用 <ol> 按时间顺序展示事件，节点有语义色圆点或图标，末节点可为进行中（pending）。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const Timeline = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("m-0 grid list-none p-0", className)} {...props} />
));
Timeline.displayName = "Timeline";

/** 圆点用背景色，自定义图标用同名文字色（currentColor）。 */
const dotVariants = cva("", {
  variants: {
    tone: {
      neutral: "bg-subtle [&_svg]:text-muted-foreground",
      primary: "bg-primary [&_svg]:text-primary",
      success: "bg-success [&_svg]:text-success",
      warning: "bg-warning [&_svg]:text-warning",
      danger: "bg-danger [&_svg]:text-danger",
      agent: "bg-agent [&_svg]:text-agent",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title">, VariantProps<typeof dotVariants> {
  /** 事件标题，完成态动词短语。 */
  title: React.ReactNode;
  /** 发生时间（等宽字体显示）。 */
  time?: React.ReactNode;
  /** 机器可读时间，写入 <time dateTime>。 */
  dateTime?: string;
  /** 自定义节点图标，替代圆点（颜色跟随 tone）。 */
  icon?: React.ReactNode;
  /** 进行中节点：旋转指示 + 弱化标题，表达“未完待续”。 */
  pending?: boolean;
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ title, time, dateTime, icon, pending, tone, className, children, ...props }, ref) => {
    const dotTone = pending ? "primary" : tone;
    return (
      <li ref={ref} className={cn("relative flex gap-3 pb-4 last:pb-0 [&:last-child>[data-timeline-line]]:hidden", className)} {...props}>
        <span data-timeline-line aria-hidden className={cn("absolute bottom-0 left-[7.5px] top-6 w-px", pending ? "border-l border-dashed" : "bg-border")} />
        <span aria-hidden className="relative flex h-[22px] w-4 shrink-0 items-center justify-center">
          {pending ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : icon ? (
            <span className={cn("flex size-4 items-center justify-center rounded-full bg-background [&_svg]:size-4", dotVariants({ tone: dotTone }), "bg-background")}>
              {icon}
            </span>
          ) : (
            <span className={cn("size-2.5 rounded-full ring-4 ring-background", dotVariants({ tone: dotTone }))} />
          )}
        </span>
        <div className="grid min-w-0 flex-1 gap-0.5 text-base" aria-live={pending ? "polite" : undefined}>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className={cn("font-medium text-foreground", pending && "text-muted-foreground")}>{title}</span>
            {pending && <span className="sr-only">（进行中）</span>}
            {time && (
              <time dateTime={dateTime} className="font-mono text-xs text-muted-foreground">
                {time}
              </time>
            )}
          </div>
          {children && <div className="text-sm text-muted-foreground">{children}</div>}
        </div>
      </li>
    );
  },
);
TimelineItem.displayName = "TimelineItem";

export { Timeline, TimelineItem };
