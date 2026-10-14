// CodeBlock 代码块：等宽展示代码与命令，带语言标签、可选行号与高亮行、复制反馈、最大高度滚动与换行切换（不做语法高亮）。
import * as React from "react";
import { Check, Copy, WrapText } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 代码文本。 */
  code: string;
  /** 语言标签（bash / json / python …），只做标注。 */
  language?: string;
  /** 标题栏文字，说明用途或文件名；与语言标签并排显示。 */
  title?: React.ReactNode;
  /** 显示行号。 */
  showLineNumbers?: boolean;
  /** 需要强调的行号（从 1 开始）。 */
  highlightLines?: number[];
  /** 最大高度，超出后代码区内部纵向滚动，标题栏保持可见。 */
  maxHeight?: number | string;
  /** 默认是否自动换行。 */
  defaultWrap?: boolean;
  /** 显示换行切换按钮。 */
  showWrapToggle?: boolean;
  /** 显示复制按钮。 */
  copyable?: boolean;
  /** 自定义复制内容；默认复制全文并去掉行首的 "$ " 提示符。 */
  copyText?: string;
  /** 复制完成回调，可用于 toast 反馈。 */
  onCopy?: (text: string) => void;
}

const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      title,
      showLineNumbers = false,
      highlightLines = [],
      maxHeight,
      defaultWrap = false,
      showWrapToggle = true,
      copyable = true,
      copyText,
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [wrap, setWrap] = React.useState(defaultWrap);
    const [copied, setCopied] = React.useState(false);
    const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
    const highlighted = React.useMemo(() => new Set(highlightLines), [highlightLines]);

    React.useEffect(() => {
      if (!copied) return;
      const timer = window.setTimeout(() => setCopied(false), 2000);
      return () => window.clearTimeout(timer);
    }, [copied]);

    const handleCopy = () => {
      const text = copyText ?? lines.map((line) => line.replace(/^\$ /, "")).join("\n");
      navigator.clipboard?.writeText(text).catch(() => undefined);
      setCopied(true);
      onCopy?.(text);
    };

    const iconButton =
      "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5";

    return (
      <div ref={ref} className={cn("min-w-0 overflow-hidden rounded-lg border bg-card", className)} {...props}>
        <div className="flex items-center gap-2 border-b bg-muted px-3 py-1">
          {language && <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{language}</span>}
          {language && title && <span className="text-xs text-subtle">·</span>}
          {title && <span className="min-w-0 truncate text-xs text-foreground">{title}</span>}
          <div className="ml-auto flex items-center gap-0.5">
            {showWrapToggle && (
              <button type="button" className={cn(iconButton, wrap && "bg-accent text-foreground")} aria-pressed={wrap} onClick={() => setWrap((v) => !v)}>
                <WrapText aria-hidden />
                <span className="sr-only">自动换行</span>
              </button>
            )}
            {copyable && (
              <button type="button" className={iconButton} aria-label={copied ? "已复制" : "复制代码"} onClick={handleCopy}>
                {copied ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
                <span aria-hidden>{copied ? "已复制" : "复制"}</span>
              </button>
            )}
            <span className="sr-only" aria-live="polite">
              {copied ? "已复制到剪贴板" : ""}
            </span>
          </div>
        </div>
        <pre
          tabIndex={0}
          className="m-0 overflow-auto bg-card py-2.5 font-mono text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          style={{ maxHeight }}
        >
          <code className={cn("grid", !wrap && "min-w-max")}>
            {lines.map((line, index) => (
              <span
                key={index}
                className={cn("flex pr-4", !showLineNumbers && "pl-3.5", highlighted.has(index + 1) && "bg-primary-soft shadow-[inset_2px_0_0_hsl(var(--primary))]")}
                data-highlighted={highlighted.has(index + 1) || undefined}
              >
                {showLineNumbers && (
                  <span aria-hidden className="w-10 shrink-0 select-none pr-3 text-right text-subtle">
                    {index + 1}
                  </span>
                )}
                <span className={cn("min-w-0 flex-1", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre")}>{line || " "}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
