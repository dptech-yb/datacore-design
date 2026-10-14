// JsonViewer JSON 查看器：可折叠的 JSON 树，按类型用语义色着色，可选复制节点路径 / 值与敏感字段脱敏。
import * as React from "react";
import { Check, ChevronRight, Copy, Link2 } from "lucide-react";

import { cn } from "@/lib/utils";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface JsonViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 要展示的 JSON 数据（可序列化的值）。 */
  data: unknown;
  /** 默认展开的层级；0 只显示根节点摘要。 */
  defaultExpandDepth?: number;
  /** 行内显示“复制值”按钮。 */
  copyValue?: boolean;
  /** 行内显示“复制路径”按钮（如 params.kpoints[2]）。 */
  copyPath?: boolean;
  /** 这些键名的值一律显示为 ***（复制同样得到 ***）。 */
  maskKeys?: string[];
  /** 最大高度，超出后内部滚动。 */
  maxHeight?: number | string;
  /** 复制完成回调，可用于 toast 反馈。 */
  onCopy?: (text: string, kind: "path" | "value") => void;
}

interface ViewerContext {
  defaultExpandDepth: number;
  copyValue: boolean;
  copyPath: boolean;
  mask: Set<string>;
  copiedKey: string | null;
  copy: (text: string, kind: "path" | "value", key: string) => void;
}

const Ctx = React.createContext<ViewerContext | null>(null);

const IDENT = /^[A-Za-z_$][\w$]*$/;

function childPath(parent: string, key: string | number) {
  if (typeof key === "number") return `${parent}[${key}]`;
  const segment = IDENT.test(key) ? key : `[${JSON.stringify(key)}]`;
  if (!parent) return segment;
  return segment.startsWith("[") ? `${parent}${segment}` : `${parent}.${segment}`;
}

function Primitive({ value, masked }: { value: JsonValue; masked?: boolean }) {
  if (masked) return <span className="text-muted-foreground">"***"</span>;
  if (value === null) return <span className="italic text-muted-foreground">null</span>;
  switch (typeof value) {
    case "string":
      return <span className="break-all text-success">{JSON.stringify(value)}</span>;
    case "number":
      return <span className="text-primary">{String(value)}</span>;
    case "boolean":
      return <span className="text-warning">{String(value)}</span>;
    default:
      return <span className="text-danger">{String(value)}</span>;
  }
}

function CopyButtons({ path, value, masked }: { path: string; value: JsonValue; masked: boolean }) {
  const ctx = React.useContext(Ctx)!;
  if (!ctx.copyPath && !ctx.copyValue) return null;
  const btn =
    "inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3";
  const pathKey = `path:${path}`;
  const valueKey = `value:${path}`;
  const valueText = masked ? "***" : typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <span className="ml-1 inline-flex gap-0.5 align-middle opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 [@media(hover:none)]:opacity-100">
      {ctx.copyPath && (
        <button type="button" className={btn} aria-label={ctx.copiedKey === pathKey ? `已复制路径 ${path}` : `复制路径 ${path}`} onClick={() => ctx.copy(path, "path", pathKey)}>
          {ctx.copiedKey === pathKey ? <Check className="text-success" aria-hidden /> : <Link2 aria-hidden />}
        </button>
      )}
      {ctx.copyValue && (
        <button type="button" className={btn} aria-label={ctx.copiedKey === valueKey ? `已复制 ${path} 的值` : `复制 ${path} 的值`} onClick={() => ctx.copy(valueText, "value", valueKey)}>
          {ctx.copiedKey === valueKey ? <Check className="text-success" aria-hidden /> : <Copy aria-hidden />}
        </button>
      )}
    </span>
  );
}

function KeyLabel({ name }: { name?: string | number }) {
  if (name === undefined) return null;
  return (
    <>
      {typeof name === "number" ? <span className="text-subtle">{name}</span> : <span className="text-agent">{JSON.stringify(name)}</span>}
      <span className="text-muted-foreground">: </span>
    </>
  );
}

function JsonNode({ name, value, path, depth, last }: { name?: string | number; value: JsonValue; path: string; depth: number; last: boolean }) {
  const ctx = React.useContext(Ctx)!;
  const masked = typeof name === "string" && ctx.mask.has(name);
  const isArray = Array.isArray(value);
  const isObject = !masked && value !== null && typeof value === "object";
  const [open, setOpen] = React.useState(depth < ctx.defaultExpandDepth);
  const comma = last ? null : <span className="text-muted-foreground">,</span>;
  const indent = { paddingLeft: depth * 16 };

  if (!isObject) {
    return (
      <li className="group/row rounded-sm hover:bg-accent/60" style={indent}>
        <span className="inline-block w-4" aria-hidden />
        <KeyLabel name={name} />
        <Primitive value={value} masked={masked} />
        {comma}
        <CopyButtons path={path} value={value} masked={masked} />
      </li>
    );
  }

  const entries: [string | number, JsonValue][] = isArray
    ? (value as JsonValue[]).map((v, i) => [i, v])
    : Object.entries(value as Record<string, JsonValue>);
  const [openBrace, closeBrace] = isArray ? ["[", "]"] : ["{", "}"];
  const label = name === undefined ? "根节点" : String(name);

  return (
    <li>
      <div className="group/row rounded-sm hover:bg-accent/60" style={indent}>
        {entries.length > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={`${open ? "收起" : "展开"} ${label}`}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-4 items-center justify-center rounded-sm align-[-2px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className={cn("size-3 transition-transform duration-fast", open && "rotate-90")} aria-hidden />
          </button>
        ) : (
          <span className="inline-block w-4" aria-hidden />
        )}
        <KeyLabel name={name} />
        <span className="text-muted-foreground">{openBrace}</span>
        {(!open || entries.length === 0) && (
          <>
            {entries.length > 0 && (
              <button type="button" tabIndex={-1} onClick={() => setOpen(true)} className="mx-1 rounded-sm bg-secondary px-1 text-xs text-muted-foreground hover:text-foreground">
                {entries.length} 项
              </button>
            )}
            <span className="text-muted-foreground">{closeBrace}</span>
            {comma}
          </>
        )}
        {path && <CopyButtons path={path} value={value} masked={false} />}
      </div>
      {open && entries.length > 0 && (
        <>
          <ul className="m-0 list-none p-0">
            {entries.map(([key, child], index) => (
              <JsonNode key={String(key)} name={key} value={child} path={childPath(path, key)} depth={depth + 1} last={index === entries.length - 1} />
            ))}
          </ul>
          <div style={indent}>
            <span className="inline-block w-4" aria-hidden />
            <span className="text-muted-foreground">{closeBrace}</span>
            {comma}
          </div>
        </>
      )}
    </li>
  );
}

const JsonViewer = React.forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ data, defaultExpandDepth = 1, copyValue = false, copyPath = false, maskKeys = [], maxHeight, onCopy, className, style, ...props }, ref) => {
    const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!copiedKey) return;
      const timer = window.setTimeout(() => setCopiedKey(null), 1500);
      return () => window.clearTimeout(timer);
    }, [copiedKey]);

    const ctx = React.useMemo<ViewerContext>(
      () => ({
        defaultExpandDepth,
        copyValue,
        copyPath,
        mask: new Set(maskKeys),
        copiedKey,
        copy: (text, kind, key) => {
          navigator.clipboard?.writeText(text).catch(() => undefined);
          setCopiedKey(key);
          onCopy?.(text, kind);
        },
      }),
      // maskKeys 通常是字面量数组，按内容比较
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [defaultExpandDepth, copyValue, copyPath, maskKeys.join("\u0000"), copiedKey, onCopy],
    );

    return (
      <Ctx.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("min-w-0 overflow-auto rounded-lg border bg-card px-3 py-2.5 font-mono text-sm leading-6 text-foreground", className)}
          style={{ maxHeight, ...style }}
          {...props}
        >
          <ul className="m-0 min-w-max list-none p-0">
            <JsonNode value={data as JsonValue} path="" depth={0} last />
          </ul>
          <span className="sr-only" aria-live="polite">
            {copiedKey ? "已复制到剪贴板" : ""}
          </span>
        </div>
      </Ctx.Provider>
    );
  },
);
JsonViewer.displayName = "JsonViewer";

export { JsonViewer };
