// Descriptions 描述列表：用 <dl> 成组展示单条记录的“标签 + 值”，支持 1–4 列响应式、带边框、标签宽度、跨列与复制值。
import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type Columns = 1 | 2 | 3 | 4;
type Layout = "horizontal" | "vertical";

interface DescriptionsContextValue {
  columns: Columns;
  layout: Layout;
  bordered: boolean;
}

const DescriptionsContext = React.createContext<DescriptionsContextValue>({ columns: 1, layout: "horizontal", bordered: false });

/** 列数按断点递增：手机始终单列，sm 起最多 2 列，lg 起到目标列数。 */
const gridColumns: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/** 跨列与列数同步收敛：窄屏不跨列，sm 最多跨 2 列。 */
const itemSpan: Record<Columns, string> = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const descriptionsListVariants = cva("m-0 grid text-base", {
  variants: {
    bordered: {
      // 单元格自带右/下边框，外层裁掉最后一列与最后一行的多余边线
      true: "-mb-px -mr-px",
      false: "gap-x-8",
    },
  },
  defaultVariants: { bordered: false },
});

export interface DescriptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 区块标题：这组字段属于哪个对象。 */
  title?: React.ReactNode;
  /** 标题行右侧的附加内容（如“复制 ID”链接按钮）。 */
  extra?: React.ReactNode;
  /** 目标列数（1–4），窄屏自动降为 1 列。 */
  columns?: Columns;
  /** horizontal：标签在左；vertical：标签在上。 */
  layout?: Layout;
  /** 带边框的单元格样式，用于正式详情页。 */
  bordered?: boolean;
  /** horizontal 布局下的标签列宽，数字按 px 计。 */
  labelWidth?: number | string;
}

const Descriptions = React.forwardRef<HTMLDivElement, DescriptionsProps>(
  ({ title, extra, columns = 1, layout = "horizontal", bordered = false, labelWidth = 120, className, style, children, ...props }, ref) => {
    const titleId = React.useId();
    const width = typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth;
    return (
      <DescriptionsContext.Provider value={{ columns, layout, bordered }}>
        <div ref={ref} className={cn("grid gap-2", className)} style={{ ...style, ["--desc-label-w" as string]: width }} {...props}>
          {(title || extra) && (
            <div className="flex items-center justify-between gap-3">
              {title && (
                <h4 id={titleId} className="m-0 text-md font-semibold text-foreground">
                  {title}
                </h4>
              )}
              {extra && <div className="ml-auto flex shrink-0 items-center gap-2">{extra}</div>}
            </div>
          )}
          <div className={cn(bordered && "overflow-hidden rounded-lg border bg-card")}>
            <dl aria-labelledby={title ? titleId : undefined} className={cn(descriptionsListVariants({ bordered }), gridColumns[columns])}>
              {children}
            </dl>
          </div>
        </div>
      </DescriptionsContext.Provider>
    );
  },
);
Descriptions.displayName = "Descriptions";

function isEmptyValue(node: React.ReactNode) {
  return node === null || node === undefined || node === false || node === "";
}

export interface DescriptionsItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 字段名（名词短语，不带冒号）。 */
  label: React.ReactNode;
  /** 跨列数；不超过 Descriptions 的 columns。 */
  span?: Columns;
  /** 值使用等宽字体（ID、数值、时间）。 */
  mono?: boolean;
  /** 显示复制按钮：true 复制值的文本，字符串则复制该字符串。 */
  copyable?: boolean | string;
}

const DescriptionsItem = React.forwardRef<HTMLDivElement, DescriptionsItemProps>(
  ({ label, span = 1, mono, copyable, className, children, ...props }, ref) => {
    const { columns, layout, bordered } = React.useContext(DescriptionsContext);
    const valueRef = React.useRef<HTMLSpanElement>(null);
    const [copied, setCopied] = React.useState(false);
    const effectiveSpan = Math.min(span, columns) as Columns;
    const empty = isEmptyValue(children);
    const horizontal = layout === "horizontal";

    React.useEffect(() => {
      if (!copied) return;
      const timer = window.setTimeout(() => setCopied(false), 1500);
      return () => window.clearTimeout(timer);
    }, [copied]);

    const copy = () => {
      const text = typeof copyable === "string" ? copyable : valueRef.current?.textContent ?? "";
      navigator.clipboard?.writeText(text).catch(() => undefined);
      setCopied(true);
    };

    const labelText = typeof label === "string" ? label : "值";

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-0",
          horizontal ? "grid grid-cols-1 sm:grid-cols-[var(--desc-label-w)_minmax(0,1fr)]" : "flex flex-col",
          bordered ? "border-b border-r" : horizontal ? "gap-x-3 py-1.5" : "gap-0.5 py-1.5",
          itemSpan[effectiveSpan],
          className,
        )}
        {...props}
      >
        <dt
          className={cn(
            "text-muted-foreground",
            !horizontal && "text-sm",
            bordered && horizontal && "bg-muted px-3 py-2 sm:border-r",
            bordered && !horizontal && "px-3 pb-0.5 pt-2",
          )}
        >
          {label}
        </dt>
        <dd className={cn("m-0 flex min-w-0 items-start gap-1.5 text-foreground", bordered && (horizontal ? "px-3 py-2" : "px-3 pb-2"))}>
          <span ref={valueRef} className={cn("min-w-0 break-words", mono && "font-mono tabular-nums", empty && "text-subtle")}>
            {empty ? "—" : children}
          </span>
          {copyable && !empty && (
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? `已复制${labelText}` : `复制${labelText}`}
              className="inline-flex size-6 shrink-0 -translate-y-0.5 items-center justify-center rounded-md text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            </button>
          )}
        </dd>
      </div>
    );
  },
);
DescriptionsItem.displayName = "DescriptionsItem";

export { Descriptions, DescriptionsItem };
