// DataQualityNotice 数据质量提示：计算前暴露缺失、冲突、来源不可靠、待人工确认四类问题，分提醒 / 阻断两级并给出逐条处理动作。
import * as React from "react";
import { ChevronDown, CircleCheck, CircleX, Download, Globe, Loader2, RotateCcw, TriangleAlert, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type QualityIssueType = "missing" | "conflict" | "unreliable-source" | "needs-review";
export type QualityIssueLevel = "warning" | "blocking";

export interface QualityIssueAction {
  /** 固定文案：去补充 / 查看冲突 / 标记已确认 / 忽略本次。 */
  label: string;
  /** 回传给 onResolve 的动作标识。 */
  action: string;
}

export interface QualityIssue {
  id: string;
  type: QualityIssueType;
  level: QualityIssueLevel;
  /** 写清什么问题、影响多少：12 条记录缺少温度字段。 */
  description: string;
  /** 影响范围：batch-07、src-055。 */
  affected?: string;
  /** 已处理：收进“已解决 N 条”，可展开追溯。 */
  resolved?: boolean;
  /** 已处理说明：谁以什么动作处理。 */
  resolution?: string;
  /** 覆盖默认处理动作。 */
  actions?: QualityIssueAction[];
}

export const qualityTypeMeta: Record<QualityIssueType, { label: string; icon: React.ComponentType<{ className?: string }>; actions: QualityIssueAction[] }> = {
  missing: { label: "缺失", icon: TriangleAlert, actions: [{ label: "去补充", action: "supplement" }] },
  conflict: { label: "冲突", icon: CircleX, actions: [{ label: "查看冲突", action: "view-conflict" }] },
  "unreliable-source": { label: "来源不可靠", icon: Globe, actions: [{ label: "忽略本次", action: "ignore" }] },
  "needs-review": { label: "待人工确认", icon: UserCheck, actions: [{ label: "标记已确认", action: "confirm" }] },
};

/** 是否存在未处理的阻断级问题（用于联动提交按钮）。 */
export function hasBlockingIssues(issues: QualityIssue[]) {
  return issues.some((issue) => issue.level === "blocking" && !issue.resolved);
}

export interface DataQualityNoticeProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  issues: QualityIssue[];
  /** 报告标题：ds-118 · batch-07 导入检查。 */
  title?: string;
  /** 汇总行：记录总数、问题数与阻断数；缺省自动生成问题数与阻断数。 */
  summary?: React.ReactNode;
  /** 处理动作回调。 */
  onResolve?: (issueId: string, action: string) => void;
  /** 导出完整质量报告。 */
  onDownloadReport?: () => void;
  /** 检测中。 */
  loading?: boolean;
  /** 检查失败原因；失败时不按“无问题”放行。 */
  error?: React.ReactNode;
  onRetry?: () => void;
  /** 无编辑权限：问题只读，隐藏处理动作并提示。 */
  readOnly?: boolean;
}

function IssueRow({ issue, onResolve, readOnly }: { issue: QualityIssue; onResolve?: DataQualityNoticeProps["onResolve"]; readOnly?: boolean }) {
  const meta = qualityTypeMeta[issue.type];
  const Icon = issue.resolved ? CircleCheck : meta.icon;
  const blocking = issue.level === "blocking";
  const actions = issue.actions ?? meta.actions;
  return (
    <li
      className={cn(
        "flex flex-wrap items-start gap-x-3 gap-y-2 rounded-md border px-3 py-2.5 transition-colors",
        issue.resolved
          ? "border-success/25 bg-success-soft"
          : blocking
            ? "border-danger/30 bg-danger-soft"
            : "border-warning/30 bg-warning-soft",
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", issue.resolved ? "text-success" : blocking ? "text-danger" : "text-warning")} aria-hidden />
      <div className="grid min-w-0 flex-1 basis-48 gap-0.5">
        <span className="flex flex-wrap items-center gap-1.5 text-base font-medium">
          {meta.label}
          {issue.resolved ? (
            <Badge tone="success">已解决</Badge>
          ) : (
            <Badge tone={blocking ? "danger" : "warning"}>{blocking ? "阻断 · 需处理" : "提醒 · 可继续"}</Badge>
          )}
        </span>
        <span className="text-sm text-muted-foreground">
          {issue.affected && <span className="font-mono text-xs">{issue.affected} · </span>}
          {issue.resolved && issue.resolution ? issue.resolution : issue.description}
        </span>
      </div>
      {!issue.resolved && onResolve && !readOnly && (
        <div className="flex flex-wrap gap-2 max-sm:w-full">
          {actions.map((action) => (
            <Button key={action.action} variant="secondary" size="sm" className="max-sm:flex-1" onClick={() => onResolve(issue.id, action.action)}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </li>
  );
}

export const DataQualityNotice = React.forwardRef<HTMLElement, DataQualityNoticeProps>(
  ({ issues, title, summary, onResolve, onDownloadReport, loading, error, onRetry, readOnly, className, ...props }, ref) => {
    const open = issues.filter((issue) => !issue.resolved);
    const resolved = issues.filter((issue) => issue.resolved);
    const blockingCount = open.filter((issue) => issue.level === "blocking").length;
    const autoSummary = `发现 ${issues.length} 个问题${blockingCount ? `（${blockingCount} 条阻断）` : open.length ? "（均为提醒）" : "，已全部处理"}`;

    let body: React.ReactNode;
    if (loading) {
      body = (
        <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          正在检查数据质量…
        </div>
      );
    } else if (error) {
      body = (
        <div role="alert" className="flex flex-wrap items-center gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-sm">
          <CircleX className="size-4 shrink-0 text-danger" aria-hidden />
          <span className="flex-1">质量检查未完成：{error}。在检查通过前不能提交计算。</span>
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              <RotateCcw aria-hidden />
              重试
            </Button>
          )}
        </div>
      );
    } else if (open.length === 0) {
      body = (
        <div role="status" className="flex items-center gap-2 rounded-md border border-success/25 bg-success-soft px-3 py-2.5 text-sm">
          <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
          质量检查通过{resolved.length ? `（已处理 ${resolved.length} 条问题）` : "，未发现问题"}
        </div>
      );
    } else {
      body = (
        <ul className="m-0 grid list-none gap-2 p-0" aria-label="数据质量问题">
          {open.map((issue) => (
            <IssueRow key={issue.id} issue={issue} onResolve={onResolve} readOnly={readOnly} />
          ))}
        </ul>
      );
    }

    return (
      <section ref={ref} aria-label={title ?? "数据质量检查"} className={cn("grid gap-3", className)} {...props}>
        {(title || onDownloadReport || (!loading && !error && issues.length > 0)) && (
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="grid gap-0.5">
              {title && <span className="text-base font-semibold">{title}</span>}
              {!loading && !error && issues.length > 0 && <span className="text-sm text-muted-foreground">{summary ?? autoSummary}</span>}
            </div>
            <div className="flex items-center gap-2">
              {!loading && !error && issues.length > 0 && (
                blockingCount ? (
                  <Badge tone="danger">
                    <CircleX className="size-3" aria-hidden />
                    {blockingCount} 条阻断
                  </Badge>
                ) : (
                  <Badge tone="success">
                    <CircleCheck className="size-3" aria-hidden />
                    可提交
                  </Badge>
                )
              )}
              {onDownloadReport && (
                <Button variant="ghost" size="sm" onClick={onDownloadReport}>
                  <Download aria-hidden />
                  下载报告
                </Button>
              )}
            </div>
          </div>
        )}
        {readOnly && open.length > 0 && !loading && (
          <p className="m-0 text-sm text-muted-foreground">处理问题需要可编辑权限，当前只读。</p>
        )}
        {body}
        {resolved.length > 0 && !loading && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="group justify-self-start">
                已解决 {resolved.length} 条
                <ChevronDown className="transition-transform group-data-[state=open]:rotate-180" aria-hidden />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="m-0 mt-2 grid list-none gap-2 p-0" aria-label="已解决的问题">
                {resolved.map((issue) => (
                  <IssueRow key={issue.id} issue={issue} />
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </section>
    );
  },
);
DataQualityNotice.displayName = "DataQualityNotice";
