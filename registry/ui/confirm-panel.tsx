// ConfirmPanel 确认面板：执行有副作用的动作前回显目标、范围、项目、预算与副作用，确认后进入 loading 并回传结果。
import * as React from "react";
import { CircleCheck, CircleX, Loader2, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ConfirmPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 动作名称，动词开头：重新计算电导率。 */
  title: string;
  /** 作用对象，带稳定 ID。 */
  target: React.ReactNode;
  /** 影响范围，数量化表达。 */
  scope: React.ReactNode;
  /** 归属项目：名称 + ID。 */
  project: { id: string; name: string };
  /** 预算或预计消耗，带单位。 */
  budget?: React.ReactNode;
  /** 副作用清单，逐条列出，不折叠。 */
  sideEffects: string[];
  /** 不可逆动作：红色副作用区 + danger 确认按钮。 */
  danger?: boolean;
  /** 确认按钮文案，默认“确认执行”。 */
  confirmText?: string;
  /** 取消按钮文案，默认“取消”。 */
  cancelText?: string;
  /** 确认回调；返回 Promise 时面板进入 loading，reject 时展示错误并保留内容。 */
  onConfirm: () => void | Promise<unknown>;
  /** 取消回调（含 Esc），不产生任何副作用。 */
  onCancel: () => void;
  /** 外部控制的提交中状态。 */
  loading?: boolean;
  /** 提交失败原因，显示在面板顶部。 */
  error?: React.ReactNode;
  /** 禁用确认并说明原因：要素未核对完 / 无执行权限。 */
  disabledReason?: React.ReactNode;
  /** 确认成功后的结果（任务 ID 与状态入口）；提供后替换动作区。 */
  result?: React.ReactNode;
  /** 挂载时把焦点放在取消按钮（安全默认），用于弹窗内。 */
  autoFocusCancel?: boolean;
}

export const ConfirmPanel = React.forwardRef<HTMLElement, ConfirmPanelProps>(
  (
    {
      title,
      target,
      scope,
      project,
      budget,
      sideEffects,
      danger,
      confirmText = "确认执行",
      cancelText = "取消",
      onConfirm,
      onCancel,
      loading: loadingProp,
      error: errorProp,
      disabledReason,
      result,
      autoFocusCancel,
      className,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const reasonId = React.useId();
    const [pending, setPending] = React.useState(false);
    const [innerError, setInnerError] = React.useState<string | null>(null);
    const loading = loadingProp || pending;
    const error = errorProp ?? innerError;

    const handleConfirm = async () => {
      setInnerError(null);
      const ret = onConfirm();
      if (ret && typeof (ret as Promise<unknown>).then === "function") {
        setPending(true);
        try {
          await ret;
        } catch (e) {
          setInnerError(e instanceof Error ? e.message : "提交失败，请重试");
        } finally {
          setPending(false);
        }
      }
    };

    const rows: [string, React.ReactNode][] = [
      ["目标", target],
      ["范围", scope],
      [
        "项目",
        <>
          {project.name}
          <span className="ml-1 font-mono text-xs text-muted-foreground">（{project.id}）</span>
        </>,
      ],
    ];
    if (budget) rows.push(["预算", budget]);

    const Icon = danger ? TriangleAlert : ShieldCheck;

    return (
      <section
        ref={ref}
        aria-labelledby={titleId}
        aria-busy={loading || undefined}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === "Escape" && !loading && !result) {
            event.stopPropagation();
            onCancel();
          }
        }}
        className={cn("grid gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-xs", danger && "border-danger/40", className)}
        {...props}
      >
        <h3 id={titleId} className="m-0 flex items-center gap-2 text-md font-semibold">
          <Icon className={cn("size-4 shrink-0", danger ? "text-danger" : "text-primary")} aria-hidden />
          {title}
        </h3>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm">
            <CircleX className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
            <span>提交失败：{error}。面板内容已保留，可直接重试。</span>
          </div>
        )}

        <dl className={cn("m-0 grid grid-cols-[3rem_1fr] gap-x-3 gap-y-1.5 text-base", loading && "opacity-70")}>
          {rows.map(([key, value]) => (
            <React.Fragment key={key}>
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="m-0 min-w-0 break-words">{value}</dd>
            </React.Fragment>
          ))}
        </dl>

        <div
          className={cn(
            "grid gap-1.5 border-t pt-3",
            danger && "rounded-md border border-danger/25 bg-danger-soft px-3 pb-3",
          )}
        >
          <span className={cn("flex items-center gap-1.5 text-xs font-medium", danger ? "text-danger" : "text-muted-foreground")}>
            {danger && <TriangleAlert className="size-3.5" aria-hidden />}
            {danger ? "副作用（不可逆）" : "副作用"}
          </span>
          <ul className="m-0 grid max-h-36 list-disc gap-1 overflow-y-auto pl-5 text-base">
            {sideEffects.map((item) => (
              <li key={item} className={danger ? "text-danger" : "text-foreground"}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {result ? (
          <div role="status" className="flex flex-wrap items-center gap-2 rounded-md border border-success/25 bg-success-soft px-3 py-2 text-sm">
            <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
            {result}
          </div>
        ) : (
          <div className="grid gap-2">
            {disabledReason && (
              <p id={reasonId} className="m-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Lock className="size-3.5 shrink-0" aria-hidden />
                {disabledReason}
              </p>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onCancel} disabled={loading} autoFocus={autoFocusCancel}>
                {cancelText}
              </Button>
              <Button
                variant={danger ? "danger" : "default"}
                onClick={handleConfirm}
                disabled={loading || Boolean(disabledReason)}
                aria-describedby={disabledReason ? reasonId : undefined}
              >
                {loading && <Loader2 className="animate-spin" aria-hidden />}
                {loading ? "正在提交" : confirmText}
              </Button>
            </div>
          </div>
        )}
      </section>
    );
  },
);
ConfirmPanel.displayName = "ConfirmPanel";
