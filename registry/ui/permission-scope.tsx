// PermissionScope 权限范围：固定四级权限徽章（可见 / 可编辑 / 可执行 / 管理员）+ 能力说明、缺口提示与只读权限矩阵。
import * as React from "react";
import { Check, Eye, Lock, Minus, Pencil, Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type PermissionLevel = "viewer" | "editor" | "executor" | "admin";

/** 四级从低到高的顺序；用于判断是否满足所需权限。 */
export const PERMISSION_ORDER: PermissionLevel[] = ["viewer", "editor", "executor", "admin"];

export const permissionMeta: Record<
  PermissionLevel,
  { label: string; tone: "neutral" | "primary" | "success" | "warning"; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  viewer: { label: "可见", tone: "neutral", icon: Eye, description: "可以查看数据与结果，不能修改配置或提交计算。" },
  editor: { label: "可编辑", tone: "primary", icon: Pencil, description: "可以修改配置与配方，不能提交计算任务。" },
  executor: { label: "可执行", tone: "success", icon: Play, description: "可以提交计算任务，不能管理成员与权限。" },
  admin: { label: "管理员", tone: "warning", icon: ShieldCheck, description: "可以管理成员与权限，不能绕过审计记录。" },
};

/** 当前级别是否满足所需级别。 */
export function hasPermission(current: PermissionLevel | undefined | null, required: PermissionLevel = "viewer") {
  if (!current) return false;
  return PERMISSION_ORDER.indexOf(current) >= PERMISSION_ORDER.indexOf(required);
}

export interface PermissionScopeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** 当前级别；为 undefined 且非 loading 时显示“权限未知”。 */
  scope?: PermissionLevel;
  /** 在徽章旁直接展示能力说明，而不是只在 hover / 聚焦时展示。 */
  showDescription?: boolean;
  /** 动作所需级别；当前级别不足时在徽章旁给出缺口提示。 */
  required?: PermissionLevel;
  /** 权限不足时的申请升级入口。 */
  onRequestUpgrade?: () => void;
  /** 权限拉取中：显示骨架徽章，不猜测级别。 */
  loading?: boolean;
  /** 关闭 hover / 聚焦时的能力说明浮层（如在下拉选项内使用时）。 */
  noTooltip?: boolean;
}

export const PermissionScope = React.forwardRef<HTMLSpanElement, PermissionScopeProps>(
  ({ scope, showDescription, required, onRequestUpgrade, loading, noTooltip, className, ...props }, ref) => {
    const descId = React.useId();
    if (loading) {
      return <Skeleton className={cn("inline-block h-5 w-14 align-middle", className)} aria-label="正在加载权限" />;
    }
    if (!scope) {
      return (
        <span ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props}>
          <Badge tone="outline">
            <Lock className="size-3" aria-hidden />
            权限未知
          </Badge>
        </span>
      );
    }
    const meta = permissionMeta[scope];
    const Icon = meta.icon;
    const insufficient = required ? !hasPermission(scope, required) : false;
    const badgeEl = (
      <Badge tone={meta.tone} aria-describedby={showDescription ? descId : undefined}>
        <Icon className="size-3" aria-hidden />
        {meta.label}
      </Badge>
    );
    // Badge 不转发 ref，浮层触发器用一层可聚焦的 span 承载
    const badge = noTooltip || showDescription ? (
      badgeEl
    ) : (
      <span
        tabIndex={0}
        aria-label={`${meta.label}：${meta.description}`}
        className="inline-flex cursor-default rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {badgeEl}
      </span>
    );
    return (
      <span ref={ref} className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)} {...props}>
        {noTooltip || showDescription ? (
          badge
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent className="max-w-64">
              {meta.label}：{meta.description}
            </TooltipContent>
          </Tooltip>
        )}
        {showDescription && (
          <span id={descId} className="text-sm text-muted-foreground">
            {meta.description}
          </span>
        )}
        {insufficient && required && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            需要{permissionMeta[required].label}权限
            {onRequestUpgrade && (
              <>
                <span aria-hidden>·</span>
                <Button variant="link" size="sm" onClick={onRequestUpgrade}>
                  申请升级
                </Button>
              </>
            )}
          </span>
        )}
      </span>
    );
  },
);
PermissionScope.displayName = "PermissionScope";

export interface PermissionCapability {
  /** 动作描述：提交计算任务。 */
  action: string;
  /** 允许执行该动作的级别。 */
  allow: PermissionLevel[];
}

export interface PermissionMatrixProps extends React.TableHTMLAttributes<HTMLTableElement> {
  scopes?: PermissionLevel[];
  capabilities: PermissionCapability[];
}

/** 只读权限矩阵：说明每一级能做什么。编辑权限走成员管理流程，不在这里。 */
export function PermissionMatrix({ scopes = PERMISSION_ORDER, capabilities, className, ...props }: PermissionMatrixProps) {
  return (
    <Table className={cn("min-w-[480px]", className)} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className="sticky left-0 z-10">操作</TableHead>
          {scopes.map((scope) => {
            const Icon = permissionMeta[scope].icon;
            return (
              <TableHead key={scope} scope="col" className="text-center">
                <span className="inline-flex items-center gap-1">
                  <Icon className="size-3" aria-hidden />
                  {permissionMeta[scope].label}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {capabilities.map((capability) => (
          <TableRow key={capability.action}>
            <TableHead scope="row" className="sticky left-0 z-10 bg-card text-sm font-medium text-foreground">
              {capability.action}
            </TableHead>
            {scopes.map((scope) => {
              const allowed = capability.allow.includes(scope);
              return (
                <TableCell key={scope} className="text-center">
                  {allowed ? (
                    <Check className="inline size-4 text-success" aria-label="允许" />
                  ) : (
                    <Minus className="inline size-4 text-muted-foreground/60" aria-label="不允许" />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
