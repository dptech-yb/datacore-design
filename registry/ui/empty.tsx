// 空状态：说明发生了什么、是否需要操作、下一步做什么；图标 + 标题 + 说明 + 动作，size 支持 default 与 compact（行内）。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const emptyVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      default: "gap-2 px-6 py-10",
      compact: "gap-1 px-3 py-4",
    },
  },
  defaultVariants: { size: "default" },
});

export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof emptyVariants> {
  /** 图标；默认 Inbox，传 null 隐藏（compact 行内空态常用）。 */
  icon?: React.ReactNode;
  /** 发生了什么：还没有实验记录。 */
  title?: React.ReactNode;
  /** 是否需要操作的一句补充说明。 */
  description?: React.ReactNode;
  /** 下一步动作，通常是一个 Button。 */
  actions?: React.ReactNode;
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, size, icon = <Inbox />, title, description, actions, children, ...props }, ref) => {
    const compact = size === "compact";
    return (
      <div ref={ref} className={cn(emptyVariants({ size }), className)} {...props}>
        {icon && (
          <span
            aria-hidden="true"
            className={cn(
              "mb-1 inline-flex items-center justify-center rounded-xl bg-muted text-subtle",
              compact ? "size-8 [&_svg]:size-4" : "size-11 [&_svg]:size-5",
            )}
          >
            {icon}
          </span>
        )}
        {title && <p className={cn("m-0 font-medium text-foreground", compact ? "text-sm" : "text-base")}>{title}</p>}
        {description && <p className={cn("m-0 max-w-sm text-muted-foreground", compact ? "text-xs" : "text-sm")}>{description}</p>}
        {children}
        {actions && <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      </div>
    );
  },
);
Empty.displayName = "Empty";
