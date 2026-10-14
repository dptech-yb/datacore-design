// AgentActivity Agent 活动：Agent 实时步骤流（已完成 / 进行中 / 等待确认 / 失败 / 待执行），含当前工具调用与原地确认、单步重试入口。
import * as React from "react";
import { Circle, CircleCheck, CircleX, Hourglass, LoaderCircle, RotateCcw, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type AgentStepStatus = "done" | "active" | "waiting" | "failed" | "pending";

export interface AgentStep {
  id: string;
  /** 动词短语：读取输入数据、生成推荐配方。 */
  title: string;
  status: AgentStepStatus;
  /** 单行说明：产物摘要、耗时或失败原因。 */
  detail?: React.ReactNode;
}

const stepMeta: Record<AgentStepStatus, { label: string; tone: "success" | "agent" | "danger" | "neutral" }> = {
  done: { label: "已完成", tone: "success" },
  active: { label: "进行中", tone: "agent" },
  waiting: { label: "等待确认", tone: "agent" },
  failed: { label: "失败", tone: "danger" },
  pending: { label: "待执行", tone: "neutral" },
};

function StepIcon({ status }: { status: AgentStepStatus }) {
  const cls = "size-4 shrink-0";
  if (status === "done") return <CircleCheck className={cn(cls, "text-success")} aria-hidden />;
  if (status === "active") return <LoaderCircle className={cn(cls, "animate-spin text-agent")} aria-hidden />;
  if (status === "waiting") return <Hourglass className={cn(cls, "text-agent")} aria-hidden />;
  if (status === "failed") return <CircleX className={cn(cls, "text-danger")} aria-hidden />;
  return <Circle className={cn(cls, "text-muted-foreground")} aria-hidden />;
}

export interface AgentActivityProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: AgentStep[];
  /** 活动流标题，通常是 Agent 名称。 */
  title?: string;
  /** 正在调用的工具：名称 + 单行参数摘要（mono），显示在进行中步骤下方。 */
  currentTool?: { name: string; summary?: string };
  /** 等待原因：为 user-confirmation 时在原地展示确认卡片并暂停推进。 */
  waitingFor?: "user-confirmation" | "resource" | null;
  /** 等待卡片的说明文字：等谁、等什么、已等待多久。 */
  waitingMessage?: React.ReactNode;
  /** 确认执行回调（waitingFor="user-confirmation" 时展示）。 */
  onConfirm?: () => void;
  /** 修改参数回调（waitingFor="user-confirmation" 时展示）。 */
  onEdit?: () => void;
  /** 确认按钮文案，默认“确认执行”。 */
  confirmText?: string;
  /** 失败步骤的单步重试回调。 */
  onRetry?: (stepId: string) => void;
  /** 无步骤时的占位文案。 */
  emptyText?: string;
}

export const AgentActivity = React.forwardRef<HTMLDivElement, AgentActivityProps>(
  (
    { steps, title, currentTool, waitingFor = null, waitingMessage, onConfirm, onEdit, confirmText = "确认执行", onRetry, emptyText = "等待任务开始", className, ...props },
    ref,
  ) => {
    const current = steps.find((step) => step.status === "active" || step.status === "waiting" || step.status === "failed");
    const overall: { label: string; tone: "agent" | "danger" | "success" | "neutral" } = steps.some((s) => s.status === "failed")
      ? { label: "已暂停 · 步骤失败", tone: "danger" }
      : waitingFor || steps.some((s) => s.status === "waiting")
        ? { label: "等待确认", tone: "agent" }
        : steps.some((s) => s.status === "active")
          ? { label: "运行中", tone: "agent" }
          : steps.length && steps.every((s) => s.status === "done")
            ? { label: "已完成", tone: "success" }
            : { label: "未开始", tone: "neutral" };
    const announcement = current
      ? current.status === "failed"
        ? `步骤失败：${current.title}`
        : current.status === "active" && currentTool
          ? `正在调用 ${currentTool.name}`
          : `${stepMeta[current.status].label}：${current.title}`
      : "";

    return (
      <div ref={ref} className={cn("grid gap-3", className)} {...props}>
        {title && (
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-agent" aria-hidden />
            <span className="text-base font-semibold">{title}</span>
            <Badge tone={overall.tone} dot>
              {overall.label}
            </Badge>
          </div>
        )}
        {steps.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-agent" aria-hidden />
            {emptyText}
          </div>
        ) : (
          <ol className="m-0 grid list-none gap-2 p-0" aria-label={title ? `${title} 活动` : "Agent 活动"}>
            {steps.map((step) => {
              const meta = stepMeta[step.status];
              const highlight = step.status === "active" || step.status === "waiting";
              return (
                <li
                  key={step.id}
                  aria-current={highlight ? "step" : undefined}
                  className={cn(
                    "flex min-w-0 items-start gap-3 rounded-lg border bg-card px-3 py-2.5",
                    highlight && "border-agent/40 bg-agent-soft",
                    step.status === "failed" && "border-danger/40 bg-danger-soft",
                    step.status === "pending" && "opacity-70",
                  )}
                >
                  <span className="mt-0.5 inline-flex">
                    <StepIcon status={step.status} />
                  </span>
                  <div className="grid min-w-0 flex-1 gap-0.5">
                    <span className="text-base font-medium">{step.title}</span>
                    {step.detail && (
                      <span className={cn("text-sm", step.status === "failed" ? "text-danger" : "text-muted-foreground")}>{step.detail}</span>
                    )}
                    {step.status === "active" && currentTool && (
                      <span className="flex min-w-0 items-center gap-1.5 text-sm text-agent">
                        <Wrench className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate font-mono text-xs">
                          {currentTool.name}
                          {currentTool.summary ? ` · ${currentTool.summary}` : ""}
                        </span>
                      </span>
                    )}
                  </div>
                  {step.status === "failed" && onRetry ? (
                    <Button variant="secondary" size="sm" onClick={() => onRetry(step.id)}>
                      <RotateCcw aria-hidden />
                      单步重试
                    </Button>
                  ) : (
                    <Badge tone={meta.tone} className="shrink-0">
                      {meta.label}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ol>
        )}
        {waitingFor && (
          <div role="group" aria-label="等待确认" className="grid gap-3 rounded-lg border border-agent/40 bg-agent-soft p-3.5">
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-agent" aria-hidden />
              <div className="grid gap-0.5">
                <span className="text-base font-semibold text-agent">
                  {waitingFor === "user-confirmation" ? "等待用户确认" : "等待资源就绪"}
                </span>
                {waitingMessage && <span className="text-sm text-foreground">{waitingMessage}</span>}
              </div>
            </div>
            {waitingFor === "user-confirmation" && (onConfirm || onEdit) && (
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {onEdit && (
                  <Button variant="secondary" onClick={onEdit}>
                    修改参数
                  </Button>
                )}
                {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
              </div>
            )}
          </div>
        )}
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>
      </div>
    );
  },
);
AgentActivity.displayName = "AgentActivity";
