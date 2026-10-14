// ProjectSelector 项目选择器：可搜索的项目单选（Popover + Command），展示项目 ID、默认标记与权限，权限不足的项目可见不可选并提供申请入口。
import * as React from "react";
import { Check, ChevronsUpDown, FolderPlus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission, PermissionScope, permissionMeta, type PermissionLevel } from "@/components/ui/permission-scope";

export interface ProjectOption {
  id: string;
  name: string;
  isDefault?: boolean;
  /** 当前用户在该项目内的权限级别。 */
  permission: PermissionLevel;
}

export interface ProjectSelectorProps {
  projects: ProjectOption[];
  /** 选中项目 ID。 */
  value?: string | null;
  onChange: (projectId: string, project: ProjectOption) => void;
  /** 动作所需最低权限；达不到的选项禁用并标注缺口。 */
  requiredPermission?: PermissionLevel;
  /** 权限不足选项上的申请入口。 */
  onRequestAccess?: (project: ProjectOption) => void;
  placeholder?: string;
  /** 整体禁用（如加载失败），原因写在 disabledReason。 */
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  /** 选项加载中。 */
  loading?: boolean;
  /** 无项目时的动作入口：创建项目 / 申请加入。 */
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function ProjectSelector({
  projects,
  value,
  onChange,
  requiredPermission = "viewer",
  onRequestAccess,
  placeholder = "选择归属项目",
  disabled,
  disabledReason,
  loading,
  emptyAction,
  className,
  id,
  "aria-label": ariaLabel,
}: ProjectSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selected = projects.find((project) => project.id === value);
  // 默认项目置顶，其余保持传入顺序
  const sorted = React.useMemo(
    () => [...projects].sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault))),
    [projects],
  );
  const requiredLabel = permissionMeta[requiredPermission].label;

  return (
    <div className={cn("grid gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            disabled={disabled || loading}
            className="h-auto min-h-9 w-full justify-between gap-2 px-3 py-1.5 text-left font-normal"
          >
            {loading ? (
              <span className="text-muted-foreground">正在加载项目…</span>
            ) : selected ? (
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="truncate font-medium">{selected.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{selected.id}</span>
                {selected.isDefault && <Badge tone="primary">默认</Badge>}
                <PermissionScope scope={selected.permission} noTooltip />
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="opacity-50" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索项目名称或 ID" />
            <CommandList>
              {loading ? (
                <div className="grid gap-2 p-3">
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>
              ) : projects.length === 0 ? (
                <div className="grid justify-items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
                  <FolderPlus className="size-5" aria-hidden />
                  你还没有可用的项目
                  {emptyAction && (
                    <Button size="sm" onClick={emptyAction.onClick}>
                      {emptyAction.label}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <CommandEmpty>没有匹配的项目</CommandEmpty>
                  <CommandGroup>
                    {sorted.map((project) => {
                      const allowed = hasPermission(project.permission, requiredPermission);
                      const isSelected = project.id === value;
                      return (
                        <CommandItem
                          key={project.id}
                          value={`${project.name} ${project.id}`}
                          aria-disabled={!allowed || undefined}
                          aria-label={
                            allowed
                              ? `${project.name}，${project.id}，${permissionMeta[project.permission].label}`
                              : `${project.name}，${project.id}，仅${permissionMeta[project.permission].label}，需要${requiredLabel}权限`
                          }
                          onSelect={() => {
                            if (!allowed) {
                              onRequestAccess?.(project);
                              return;
                            }
                            onChange(project.id, project);
                            setOpen(false);
                          }}
                          className={cn("items-start py-2", !allowed && "cursor-not-allowed")}
                        >
                          <div className={cn("grid min-w-0 flex-1 gap-0.5", !allowed && "opacity-60")}>
                            <span className="flex items-center gap-1.5">
                              <span className="truncate font-medium">{project.name}</span>
                              {project.isDefault && <Badge tone="primary">默认</Badge>}
                            </span>
                            <span className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-xs text-muted-foreground">{project.id}</span>
                              <PermissionScope scope={project.permission} noTooltip />
                              {!allowed && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <Lock className="!size-3" aria-hidden />
                                  需要{requiredLabel}权限
                                </span>
                              )}
                            </span>
                          </div>
                          {!allowed && onRequestAccess ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="self-center"
                              tabIndex={-1}
                              onClick={(event) => {
                                event.stopPropagation();
                                onRequestAccess(project);
                              }}
                            >
                              申请权限
                            </Button>
                          ) : (
                            <Check className={cn("self-center text-primary", isSelected ? "opacity-100" : "opacity-0")} aria-hidden />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {disabledReason && <span className="text-xs text-muted-foreground">{disabledReason}</span>}
    </div>
  );
}
