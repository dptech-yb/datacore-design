// ExperimentStep 实验步骤：实验的有序业务节点流（已完成 / 进行中 / 失败 / 待执行），标记当前节点，失败节点给原因与原地重试，已完成节点可查看产物。
import * as React from "react";
import { Check, ChevronRight, LoaderCircle, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ExperimentNodeStatus = "done" | "active" | "failed" | "pending";

export interface ExperimentNode {
  id: string;
  /** 名词短语：参数配置、电导率计算。 */
  name: string;
  status: ExperimentNodeStatus;
  /** 产物摘要或失败原因：8 个候选、214s、计算资源超时。 */
  detail?: string;
}

const statusText: Record<ExperimentNodeStatus, string> = { done: "已完成", active: "进行中", failed: "失败", pending: "待执行" };

export interface ExperimentStepProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ExperimentNode[];
  /** 当前节点 ID；缺省取第一个 active 或 failed 节点。 */
  current?: string;
  /** 流程标题，通常是轮次或实验名称。 */
  title?: string;
  /** 排列方向；窄容器下横向可滚动，也可改为纵向。 */
  orientation?: "horizontal" | "vertical";
  /** 失败节点的原地重试回调。 */
  onRetry?: (stepId: string) => void;
  /** 点击已完成节点查看产物。 */
  onOpenArtifact?: (stepId: string) => void;
}

function NodeDot({ status, index }: { status: ExperimentNodeStatus; index: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
        status === "done" && "border-success bg-success text-primary-foreground",
        status === "active" && "border-primary bg-primary-soft text-primary ring-4 ring-primary/15",
        status === "failed" && "border-danger bg-danger text-primary-foreground",
        status === "pending" && "border-border bg-background text-muted-foreground",
      )}
    >
      {status === "done" ? (
        <Check className="size-3.5" />
      ) : status === "failed" ? (
        <X className="size-3.5" />
      ) : status === "active" ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : (
        index + 1
      )}
    </span>
  );
}

export const ExperimentStep = React.forwardRef<HTMLDivElement, ExperimentStepProps>(
  ({ steps, current, title, orientation = "horizontal", onRetry, onOpenArtifact, className, ...props }, ref) => {
    const currentId = current ?? steps.find((s) => s.status === "active" || s.status === "failed")?.id;
    const failed = steps.find((s) => s.status === "failed");
    const vertical = orientation === "vertical";
    const listRef = React.useRef<HTMLOListElement>(null);

    // 窄屏横向滚动时，把当前节点滚入视野
    React.useEffect(() => {
      if (vertical || !currentId) return;
      const list = listRef.current;
      const el = list?.querySelector<HTMLElement>(`[data-node="${currentId}"]`);
      if (list && el && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
      }
    }, [currentId, vertical]);

    return (
      <div ref={ref} className={cn("grid gap-3", className)} {...props}>
        {title && <span className="text-base font-semibold">{title}</span>}
        <ol
          ref={listRef}
          aria-label={title ? `${title} 节点` : "实验节点"}
          className={cn(
            "m-0 flex list-none p-0",
            vertical ? "flex-col gap-1" : "relative items-start gap-1 overflow-x-auto pb-1",
          )}
        >
          {steps.map((step, index) => {
            const isCurrent = step.id === currentId;
            const clickable = step.status === "done" && Boolean(onOpenArtifact);
            const body = (
              <>
                <NodeDot status={step.status} index={index} />
                <span className={cn("grid min-w-0 gap-0.5 text-left", !vertical && "justify-items-center text-center")}>
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm font-medium",
                      isCurrent ? "text-foreground" : step.status === "pending" ? "text-muted-foreground" : "text-foreground",
                      isCurrent && "font-semibold",
                      step.status === "failed" && "text-danger",
                    )}
                  >
                    {step.name}
                  </span>
                  {step.detail && <span className={cn("text-xs", step.status === "failed" ? "text-danger" : "text-muted-foreground")}>{step.detail}</span>}
                </span>
              </>
            );
            const label = `第 ${index + 1} 步，共 ${steps.length} 步：${step.name}，${statusText[step.status]}`;
            const boxCls = cn(
              "flex min-w-0 items-start gap-2 rounded-md p-1.5",
              !vertical && "flex-col items-center",
              isCurrent && "bg-primary-soft/60",
            );
            return (
              <li key={step.id} data-node={step.id} aria-current={isCurrent ? "step" : undefined} className={cn("flex items-start", !vertical && "shrink-0")}>
                {clickable ? (
                  <button
                    type="button"
                    aria-label={`${label}，查看产物`}
                    onClick={() => onOpenArtifact?.(step.id)}
                    className={cn(boxCls, "cursor-pointer border-0 bg-transparent font-[inherit] text-inherit hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={boxCls}>
                    <span className="sr-only">{label}</span>
                    <span aria-hidden className="contents">
                      {body}
                    </span>
                  </div>
                )}
                {!vertical && index < steps.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    className={cn("mx-1 mt-3 size-4 shrink-0", step.status === "done" ? "text-success" : "text-muted-foreground/50")}
                  />
                )}
              </li>
            );
          })}
        </ol>
        {failed && (
          <div role="alert" className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm">
            <X className="size-4 shrink-0 text-danger" aria-hidden />
            <span className="min-w-0 flex-1">
              <strong className="font-semibold">{failed.name}失败</strong>
              {failed.detail ? `：${failed.detail}` : ""} · 已完成节点的产物不受影响
            </span>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={() => onRetry(failed.id)}>
                <RotateCcw aria-hidden />
                原地重试
              </Button>
            )}
          </div>
        )}
      </div>
    );
  },
);
ExperimentStep.displayName = "ExperimentStep";
