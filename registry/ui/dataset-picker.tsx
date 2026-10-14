// DatasetPicker 数据集选择器：可搜索的数据集单选 / 多选（Popover + Command），显式展示批次、版本、来源与记录数，空态给出导入入口。
import * as React from "react";
import { Check, ChevronsUpDown, Database, Lock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

export type DatasetSource = "imported" | "computed" | "shared";

export interface DatasetOption {
  /** 选项唯一值；同一数据集的不同版本用不同 id（如 ds-118@v3）。 */
  id: string;
  /** 展示用数据集 ID，默认取 id。 */
  datasetId?: string;
  name: string;
  batch: string;
  /** v + 数字：v3。 */
  version: string;
  source: DatasetSource;
  records: number;
  /** 已归档：可选但给出警告（审计复现场景）。 */
  archived?: boolean;
  /** 不可选原因：被占用 / 需申请权限。提供后选项禁用并朗读原因。 */
  disabledReason?: string;
}

export const datasetSourceMeta: Record<DatasetSource, { label: string; tone: "primary" | "success" | "outline" }> = {
  imported: { label: "导入", tone: "primary" },
  computed: { label: "计算产出", tone: "success" },
  shared: { label: "共享", tone: "outline" },
};

type SingleProps = { selectionMode?: "single"; value?: string | null; onChange: (value: string) => void };
type MultipleProps = { selectionMode: "multiple"; value?: string[]; onChange: (value: string[]) => void };

export type DatasetPickerProps = (SingleProps | MultipleProps) & {
  datasets: DatasetOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  /** 空态的动作入口，通常是去导入数据。 */
  emptyAction?: { label: string; onClick: () => void };
  /** 空态说明：为什么没有数据集。 */
  emptyDescription?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function optionLabel(d: DatasetOption) {
  return `${d.name}，${d.version}，${datasetSourceMeta[d.source].label}，${d.records} 条${d.archived ? "，已归档" : ""}`;
}

function Meta({ dataset }: { dataset: DatasetOption }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-xs text-muted-foreground">
        {dataset.datasetId ?? dataset.id} · {dataset.batch} · {dataset.version}
      </span>
      <Badge tone={datasetSourceMeta[dataset.source].tone}>{datasetSourceMeta[dataset.source].label}</Badge>
      {dataset.archived && (
        <Badge tone="warning">
          <TriangleAlert className="!size-3" aria-hidden />
          已归档
        </Badge>
      )}
    </span>
  );
}

export function DatasetPicker(props: DatasetPickerProps) {
  const {
    datasets,
    placeholder = "选择输入数据集",
    loading,
    disabled,
    emptyAction,
    emptyDescription = "当前项目还没有可用的数据集，导入后即可用于计算。",
    className,
    id,
    "aria-label": ariaLabel,
  } = props;
  const multiple = props.selectionMode === "multiple";
  const [open, setOpen] = React.useState(false);
  const selectedIds: string[] = multiple
    ? (props.value as string[] | undefined) ?? []
    : props.value
      ? [props.value as string]
      : [];
  const selected = datasets.filter((d) => selectedIds.includes(d.id));
  const total = selected.reduce((sum, d) => sum + d.records, 0);
  const archivedSelected = selected.filter((d) => d.archived);

  if (!loading && datasets.length === 0) {
    return (
      <div className={cn("grid justify-items-center gap-2 rounded-lg border border-dashed bg-card px-4 py-6 text-center", className)} role="status">
        <Database className="size-5 text-muted-foreground" aria-hidden />
        <span className="text-base font-medium">暂无可用数据集</span>
        <span className="text-sm text-muted-foreground">{emptyDescription}</span>
        {emptyAction && (
          <Button size="sm" className="mt-1" onClick={emptyAction.onClick}>
            {emptyAction.label}
          </Button>
        )}
      </div>
    );
  }

  const toggle = (d: DatasetOption) => {
    if (d.disabledReason) return;
    if (props.selectionMode === "multiple") {
      const next = selectedIds.includes(d.id) ? selectedIds.filter((x) => x !== d.id) : [...selectedIds, d.id];
      props.onChange(next);
    } else {
      props.onChange(d.id);
      setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
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
              <span className="text-muted-foreground">正在加载数据集…</span>
            ) : selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : multiple ? (
              <span className="min-w-0 truncate">
                已选 {selected.length} 个数据集 · 共 {total} 条记录
              </span>
            ) : (
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate font-medium">{selected[0].name}</span>
                <Meta dataset={selected[0]} />
              </span>
            )}
            <ChevronsUpDown className="opacity-50" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索名称、ID 或批次" />
            <CommandList aria-multiselectable={multiple || undefined}>
              {loading ? (
                <div className="grid gap-2 p-3">
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                  <Skeleton className="h-9" />
                </div>
              ) : (
                <>
                  <CommandEmpty>没有匹配的数据集，试试清除搜索词</CommandEmpty>
                  <CommandGroup>
                    {datasets.map((d) => {
                      const checked = selectedIds.includes(d.id);
                      return (
                        <CommandItem
                          key={d.id}
                          value={`${d.name} ${d.datasetId ?? d.id} ${d.batch} ${d.version}`}
                          disabled={Boolean(d.disabledReason)}
                          aria-label={d.disabledReason ? `${optionLabel(d)}，不可选：${d.disabledReason}` : optionLabel(d)}
                          aria-checked={checked}
                          onSelect={() => toggle(d)}
                          className="items-start py-2"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center border border-primary",
                              multiple ? "rounded-sm" : "rounded-full",
                              checked && (multiple ? "bg-primary text-primary-foreground" : "border-[5px]"),
                            )}
                          >
                            {multiple && checked && <Check className="!size-3" />}
                          </span>
                          <span className="grid min-w-0 flex-1 gap-0.5">
                            <span className="truncate font-medium">{d.name}</span>
                            <Meta dataset={d} />
                            {d.disabledReason && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Lock className="!size-3" aria-hidden />
                                {d.disabledReason}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 font-mono text-xs text-muted-foreground">{d.records} 条</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
            {multiple && !loading && (
              <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-sm text-muted-foreground">
                <span>
                  已选 {selected.length} 个 · 共 {total} 条记录
                </span>
                <Button size="sm" onClick={() => setOpen(false)}>
                  完成
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {archivedSelected.length > 0 && (
        <span className="flex items-center gap-1.5 text-sm text-warning" role="status">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
          已选择归档版本（{archivedSelected.map((d) => `${d.datasetId ?? d.id} ${d.version}`).join("、")}），仅建议用于复现与审计。
        </span>
      )}
    </div>
  );
}
