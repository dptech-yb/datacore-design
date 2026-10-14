// 标签：表达对象分类、属性或已选筛选的小型标签（区别于状态 Badge），支持语义色、尺寸、图标、移除按钮与 TagGroup 换行列表。
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const tagVariants = cva(
  "inline-flex max-w-full items-center gap-1 border font-sans font-medium whitespace-nowrap transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 enabled:cursor-pointer enabled:hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-border bg-secondary text-secondary-foreground",
        primary: "border-primary/25 bg-primary-soft text-primary",
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/30 bg-warning-soft text-warning",
        danger: "border-danger/25 bg-danger-soft text-danger",
        agent: "border-agent/25 bg-agent-soft text-agent",
        outline: "border-border bg-transparent text-muted-foreground",
      },
      size: {
        sm: "h-5 rounded-sm px-1.5 text-xs [&_svg]:size-3",
        default: "h-6 rounded-md px-2 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "default" },
  },
);

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  /** 前置图标（装饰性，自动 aria-hidden）。 */
  icon?: React.ReactNode;
  /** 传入后显示移除按钮；点击即移除，无需二次确认。 */
  onRemove?: () => void;
  /** 移除按钮的无障碍名称，默认“移除 {文本}”。 */
  removeLabel?: string;
  /** 把样式交给子元素，例如可选择的 <button aria-pressed>。 */
  asChild?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, tone, size, icon, onRemove, removeLabel, asChild, children, title, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    const text = typeof children === "string" ? children : undefined;
    return (
      <Comp ref={ref} className={cn(tagVariants({ tone, size }), className)} title={title ?? text} {...props}>
        {icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
        {asChild ? <Slottable>{children}</Slottable> : <span className="truncate">{children}</span>}
        {onRemove && (
          <button
            type="button"
            aria-label={removeLabel ?? `移除 ${text ?? ""}`.trim()}
            onClick={onRemove}
            className="-mr-0.5 inline-flex size-4 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-current opacity-60 hover:bg-foreground/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        )}
      </Comp>
    );
  },
);
Tag.displayName = "Tag";

/** 标签组：换行排列；传 aria-label 时作为一组朗读。 */
export const TagGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} role={props["aria-label"] ? "group" : undefined} className={cn("flex flex-wrap items-center gap-1.5", className)} {...props} />
));
TagGroup.displayName = "TagGroup";
