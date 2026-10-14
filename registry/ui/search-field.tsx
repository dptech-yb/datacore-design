// 搜索框：放大镜图标 + 输入框，带清除按钮、加载 spinner、Enter 搜索、可选防抖与 / 或 ⌘K 聚焦快捷键。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";

const searchFieldVariants = cva(
  "flex w-full items-center gap-2 rounded-md border border-input bg-background text-foreground shadow-xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-sm [&_svg]:size-3.5",
        default: "h-8 px-2.5 text-base [&_svg]:size-4",
        lg: "h-10 px-3 text-md [&_svg]:size-4",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "type">,
    VariantProps<typeof searchFieldVariants> {
  value?: string;
  defaultValue?: string;
  /** 每次输入变化。 */
  onValueChange?: (value: string) => void;
  /** Enter 时立即触发；设置 debounce 时停止输入后也会触发。 */
  onSearch?: (value: string) => void;
  /** 防抖毫秒数；不传则只在 Enter 时触发 onSearch。 */
  debounce?: number;
  /** 搜索中：右侧显示 spinner，输入不锁定。 */
  loading?: boolean;
  /** 有值时显示清除按钮。 */
  clearable?: boolean;
  /** 清除后回调（onValueChange("") 之外的额外处理）。 */
  onClear?: () => void;
  /** 聚焦快捷键：页面级搜索用 "/"，全局命令入口用 "mod+k"（⌘K / Ctrl+K）。 */
  shortcut?: "/" | "mod+k";
  /** 外层容器 className；className 作用于 input。 */
  wrapperClassName?: string;
}

function assignRef<T>(ref: React.ForwardedRef<T>, node: T) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onSearch,
      debounce,
      loading = false,
      clearable = true,
      onClear,
      shortcut,
      size,
      disabled,
      placeholder = "搜索",
      className,
      wrapperClassName,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isControlled = valueProp !== undefined;
    const [inner, setInner] = React.useState(defaultValue);
    const value = isControlled ? valueProp : inner;

    const onSearchRef = React.useRef(onSearch);
    onSearchRef.current = onSearch;
    const timer = React.useRef<ReturnType<typeof setTimeout>>();
    React.useEffect(() => () => clearTimeout(timer.current), []);

    const change = (next: string) => {
      if (!isControlled) setInner(next);
      onValueChange?.(next);
      if (debounce !== undefined) {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onSearchRef.current?.(next), debounce);
      }
    };

    const clear = () => {
      clearTimeout(timer.current);
      if (!isControlled) setInner("");
      onValueChange?.("");
      onClear?.();
      if (debounce !== undefined) onSearchRef.current?.("");
      inputRef.current?.focus();
    };

    // 聚焦快捷键
    React.useEffect(() => {
      if (!shortcut) return;
      const handler = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;
        const editing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
        const hit =
          shortcut === "/"
            ? event.key === "/" && !editing && !event.metaKey && !event.ctrlKey
            : event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
        if (hit && inputRef.current && !inputRef.current.disabled) {
          event.preventDefault();
          inputRef.current.focus();
          inputRef.current.select();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [shortcut]);

    const showClear = clearable && value !== "" && !disabled;

    return (
      <div className={cn(searchFieldVariants({ size }), wrapperClassName)}>
        <Search aria-hidden="true" className="shrink-0 text-muted-foreground" />
        <input
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : placeholder)}
          aria-busy={loading || undefined}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(event) => change(event.target.value)}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "Enter") {
              clearTimeout(timer.current);
              onSearch?.(value);
            } else if (event.key === "Escape") {
              if (value) {
                event.preventDefault();
                clear();
              } else {
                inputRef.current?.blur();
              }
            }
          }}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-subtle disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
            className,
          )}
          {...props}
        />
        {loading && (
          <span role="status" className="flex shrink-0 items-center text-muted-foreground">
            <Loader2 aria-hidden="true" className="animate-spin" />
            <span className="sr-only">正在搜索</span>
          </span>
        )}
        {showClear && (
          <button
            type="button"
            aria-label="清除搜索"
            onClick={clear}
            className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:!size-3.5"
          >
            <X />
          </button>
        )}
        {shortcut && !showClear && !loading && (
          <span aria-hidden="true" className="shrink-0">
            <Kbd>{shortcut === "/" ? "/" : "⌘K"}</Kbd>
          </span>
        )}
      </div>
    );
  },
);
SearchField.displayName = "SearchField";

export { SearchField, searchFieldVariants };
