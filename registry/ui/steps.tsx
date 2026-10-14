// 步骤条：用有序列表展示多阶段流程的进度与每步结果（等待 / 进行 / 完成 / 失败），支持横向、纵向与点击回退。
import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "wait" | "process" | "finish" | "error";

export interface StepItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 单步状态；缺省时按 current 推导。 */
  status?: StepStatus;
  /** 禁止点击该步（仅在传了 onStepClick 时有意义）。 */
  disabled?: boolean;
}

export interface StepsProps extends React.OlHTMLAttributes<HTMLOListElement> {
  items: StepItem[];
  /** 当前步骤索引（从 0 开始）。 */
  current?: number;
  /** 当前步骤的状态，通常只用于把当前步标为 error。 */
  status?: StepStatus;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default";
  /** 传入后，已完成的步骤渲染为按钮，可点击回退。 */
  onStepClick?: (index: number) => void;
}

const statusText: Record<StepStatus, string> = {
  wait: "未开始",
  process: "进行中",
  finish: "已完成",
  error: "失败",
};

const indicatorVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border font-mono font-medium transition-colors",
  {
    variants: {
      status: {
        wait: "border-border bg-background text-muted-foreground",
        process: "border-primary bg-primary text-primary-foreground",
        finish: "border-success bg-success text-primary-foreground",
        error: "border-danger bg-danger text-primary-foreground",
      },
      size: {
        sm: "size-5 text-xs [&_svg]:size-3",
        default: "size-6 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { status: "wait", size: "default" },
  },
);

const titleVariants = cva("leading-snug transition-colors", {
  variants: {
    status: {
      wait: "font-medium text-muted-foreground",
      process: "font-semibold text-foreground",
      finish: "font-medium text-foreground",
      error: "font-semibold text-danger",
    },
    size: { sm: "text-sm", default: "text-base" },
  },
  defaultVariants: { status: "wait", size: "default" },
});

export const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  ({ className, items, current = 0, status = "process", orientation = "horizontal", size = "default", onStepClick, ...props }, ref) => {
    const vertical = orientation === "vertical";
    return (
      <ol
        ref={ref}
        data-orientation={orientation}
        className={cn("m-0 flex list-none p-0", vertical ? "flex-col" : "w-full items-start gap-3", className)}
        {...props}
      >
        {items.map((item, index) => {
          const itemStatus: StepStatus = item.status ?? (index < current ? "finish" : index === current ? status : "wait");
          const last = index === items.length - 1;
          const clickable = Boolean(onStepClick) && itemStatus === "finish" && !item.disabled && index !== current;
          const connectorDone = itemStatus === "finish";

          const indicator = (
            <span className={indicatorVariants({ status: itemStatus, size })} aria-hidden>
              {itemStatus === "finish" ? <Check strokeWidth={3} /> : itemStatus === "error" ? <X strokeWidth={3} /> : index + 1}
            </span>
          );
          const text = (
            <span className={cn("grid min-w-0 gap-0.5", vertical && "pb-5", vertical && last && "pb-0")}>
              <span className={cn(titleVariants({ status: itemStatus, size }), clickable && "group-hover:text-primary")}>{item.title}</span>
              {item.description && (
                <span className={cn("text-xs", itemStatus === "error" ? "text-danger" : "text-muted-foreground")}>{item.description}</span>
              )}
              <span className="sr-only">（{statusText[itemStatus]}）</span>
            </span>
          );

          const body = vertical ? (
            <>
              <span className="flex flex-col items-center gap-1 self-stretch">
                {indicator}
                {!last && <span aria-hidden className={cn("min-h-4 w-px flex-1", connectorDone ? "bg-success" : "bg-border")} />}
              </span>
              {text}
            </>
          ) : (
            <>
              {indicator}
              {text}
            </>
          );

          const innerClass = cn("flex min-w-0 gap-2.5 text-left", vertical ? "items-stretch" : "items-start");

          return (
            <li
              key={index}
              aria-current={index === current ? "step" : undefined}
              className={cn("flex min-w-0", vertical ? "flex-col" : cn("items-start gap-3", last ? "flex-none" : "flex-1"))}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  className={cn(
                    innerClass,
                    "group cursor-pointer rounded-md border-0 bg-transparent p-0 font-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  {body}
                </button>
              ) : (
                <div className={innerClass}>{body}</div>
              )}
              {!vertical && !last && (
                <span
                  aria-hidden
                  className={cn("h-px min-w-4 flex-1", size === "sm" ? "mt-2.5" : "mt-3", connectorDone ? "bg-success" : "bg-border")}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);
Steps.displayName = "Steps";
