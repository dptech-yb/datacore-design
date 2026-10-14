// 组合框：Popover + Command（cmdk）实现的可搜索单选 / 多选，多选以 Badge 回显，可选“创建新值”入口。
import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  /** 副信息：编号、状态、不可用原因等，弱化显示且参与搜索。 */
  description?: string;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  options: ComboboxOption[];
  /** 触发器占位。 */
  placeholder?: string;
  /** 面板内搜索框占位。 */
  searchPlaceholder?: string;
  /** 无匹配时的空态文案。 */
  emptyText?: React.ReactNode;
  /** 远程搜索中：列表显示加载占位。 */
  loading?: boolean;
  /** 关闭本地过滤（远程搜索时由 options 直接提供结果）。 */
  shouldFilter?: boolean;
  /** 搜索词变化回调，远程搜索时自行防抖。 */
  onSearchChange?: (keyword: string) => void;
  /** 传入后，无完全匹配时显示“创建：关键词”入口。 */
  onCreate?: (keyword: string) => void;
  /** 多选时触发器最多显示的 Badge 数，其余折叠为 +N。 */
  maxBadges?: number;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const toArray = (v: string | string[] | null | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((props, ref) => {
  const {
    options,
    placeholder = "请选择",
    searchPlaceholder = "搜索…",
    emptyText = "无匹配结果",
    loading,
    shouldFilter = true,
    onSearchChange,
    onCreate,
    maxBadges = 3,
    disabled,
    invalid,
    id,
    className,
  } = props;
  const multiple = props.multiple === true;
  const listId = React.useId();

  const isControlled = props.value !== undefined;
  const [inner, setInner] = React.useState<string[]>(() => toArray(props.defaultValue));
  const selected = isControlled ? toArray(props.value) : inner;

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const emit = (next: string[]) => {
    if (!isControlled) setInner(next);
    if (props.multiple) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? null);
  };

  const select = (value: string) => {
    if (multiple) {
      emit(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      emit(selected[0] === value ? [] : [value]);
      setOpen(false);
    }
  };

  const labelOf = (value: string) => options.find((o) => o.value === value)?.label ?? value;
  const keyword = search.trim();
  const showCreate =
    !!onCreate && keyword !== "" && !options.some((o) => o.label === keyword || o.value === keyword);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && search) {
      setSearch("");
      onSearchChange?.("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          id={id}
          type="button"
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          aria-label={props["aria-label"]}
          aria-describedby={props["aria-describedby"]}
          disabled={disabled}
          className={cn(
            "w-full justify-between px-3 text-sm font-normal",
            multiple && selected.length > 0 && "h-auto min-h-8 py-1",
            invalid && "border-danger",
            className,
          )}
        >
          {selected.length === 0 ? (
            <span className="truncate text-muted-foreground">{placeholder}</span>
          ) : multiple ? (
            <span className="flex min-w-0 flex-wrap items-center gap-1">
              {selected.slice(0, maxBadges).map((v) => (
                <Badge key={v} tone="primary">
                  {labelOf(v)}
                </Badge>
              ))}
              {selected.length > maxBadges && <Badge tone="neutral">+{selected.length - maxBadges}</Badge>}
            </span>
          ) : (
            <span className="truncate">{labelOf(selected[0])}</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="focus-visible:!outline-none"
            value={search}
            onValueChange={(next) => {
              setSearch(next);
              onSearchChange?.(next);
            }}
          />
          <CommandList id={listId} aria-multiselectable={multiple || undefined}>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground" role="status">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                正在搜索…
              </div>
            ) : (
              <>
                {!showCreate && <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">{emptyText}</CommandEmpty>}
                {showCreate && (
                  <CommandGroup forceMount>
                    <CommandItem
                      forceMount
                      value={`__create__${keyword}`}
                      onSelect={() => {
                        onCreate?.(keyword);
                        setSearch("");
                        if (!multiple) setOpen(false);
                      }}
                      className="text-primary"
                    >
                      <Plus />
                      创建：{keyword}
                    </CommandItem>
                  </CommandGroup>
                )}
                <CommandGroup>
                  {options.map((option) => {
                    const checked = selected.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        keywords={[option.label, option.description ?? ""]}
                        disabled={option.disabled}
                        onSelect={() => select(option.value)}
                        data-checked={checked || undefined}
                      >
                        <Check className={cn(checked ? "opacity-100" : "opacity-0")} />
                        <span className="min-w-0 flex-1 truncate">
                          {option.label}
                          {checked && <span className="sr-only">（已选）</span>}
                        </span>
                        {option.description && (
                          <span className="shrink-0 text-xs text-muted-foreground">{option.description}</span>
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
  );
});
Combobox.displayName = "Combobox";

export { Combobox };
