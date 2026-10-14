// 结果页：流程结束或整页异常时的结论区块，按 status 绑定图标与语义色（含 403/404 预置文案），附说明、动作与详情。
import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, FileQuestion, Info, Lock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ResultStatus = "success" | "warning" | "danger" | "info" | "forbidden" | "not-found";

const iconVariants = cva("inline-flex size-12 items-center justify-center rounded-full [&_svg]:size-6", {
  variants: {
    status: {
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      danger: "bg-danger-soft text-danger",
      info: "bg-primary-soft text-primary",
      forbidden: "bg-warning-soft text-warning",
      "not-found": "bg-muted text-subtle",
    },
  },
});

const PRESETS: Record<ResultStatus, { icon: React.ReactNode; title?: string; description?: string }> = {
  success: { icon: <CheckCircle2 /> },
  warning: { icon: <AlertTriangle /> },
  danger: { icon: <XCircle /> },
  info: { icon: <Info /> },
  forbidden: { icon: <Lock />, title: "无访问权限", description: "你没有查看此页面的权限，请联系项目管理员开通。" },
  "not-found": { icon: <FileQuestion />, title: "页面不存在", description: "页面可能已被移动或删除，请检查链接是否正确。" },
};

export interface ResultProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  status: ResultStatus;
  /** 结论文案；forbidden / not-found 有预置默认值。 */
  title?: React.ReactNode;
  /** 原因或影响范围；forbidden / not-found 有预置默认值。 */
  description?: React.ReactNode;
  /** 覆盖默认图标。 */
  icon?: React.ReactNode;
  /** 后续动作，最多两个 Button：主动作在前。 */
  actions?: React.ReactNode;
  /** 挂载后把焦点移到标题，读屏器先朗读结论（整页结果时使用）。 */
  autoFocus?: boolean;
}

export const Result = React.forwardRef<HTMLDivElement, ResultProps>(
  ({ className, status, title, description, icon, actions, autoFocus, children, ...props }, ref) => {
    const preset = PRESETS[status];
    const headingRef = React.useRef<HTMLHeadingElement>(null);
    React.useEffect(() => {
      if (autoFocus) headingRef.current?.focus();
    }, [autoFocus]);
    return (
      <div
        ref={ref}
        role={status === "danger" ? "alert" : "status"}
        className={cn("flex flex-col items-center gap-2 px-6 py-8 text-center", className)}
        {...props}
      >
        <span aria-hidden="true" className={cn(iconVariants({ status }), "mb-1")}>{icon ?? preset.icon}</span>
        <h2 ref={headingRef} tabIndex={-1} className="m-0 text-lg font-semibold text-foreground focus:outline-none">
          {title ?? preset.title}
        </h2>
        {(description ?? preset.description) && (
          <p className="m-0 max-w-md text-sm text-muted-foreground">{description ?? preset.description}</p>
        )}
        {children && <div className="mt-2 w-full max-w-md rounded-lg border bg-muted/50 px-4 py-3 text-left text-sm">{children}</div>}
        {actions && <div className="mt-3 flex w-full flex-col items-stretch justify-center gap-2 sm:w-auto sm:flex-row sm:items-center">{actions}</div>}
      </div>
    );
  },
);
Result.displayName = "Result";
