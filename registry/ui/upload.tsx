// 上传：拖拽 / 点击选择的上传区（选择时即校验类型与大小）+ 带进度、状态、重试 / 移除的文件列表；不发请求，上传由父组件经回调完成。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, FileText, RotateCcw, Upload as UploadIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/** 字节数 → 可读大小（1 KB = 1024 B）。 */
export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

export interface UploadRejection {
  file: File;
  /** 具体原因，可直接展示给用户。 */
  reason: string;
}

/* ---------- Upload（上传区） ---------- */

const uploadVariants = cva(
  "relative flex cursor-pointer rounded-lg border border-dashed border-input bg-background text-center transition-colors duration-fast ease-standard hover:border-primary/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:border-input aria-disabled:hover:bg-background data-[dragging=true]:border-primary data-[dragging=true]:bg-primary-soft",
  {
    variants: {
      layout: {
        default: "flex-col items-center justify-center gap-1.5 px-4 py-6",
        inline: "flex-row items-center gap-2.5 px-4 py-3 text-left",
      },
    },
    defaultVariants: { layout: "default" },
  },
);

export interface UploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onDrop">,
    VariantProps<typeof uploadVariants> {
  /** 允许的类型：扩展名（.csv）、MIME（text/csv）或通配（image/*），逗号分隔。 */
  accept?: string;
  /** 单文件字节上限。 */
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** 主文案。 */
  title?: React.ReactNode;
  /** 说明文案；不传时按 accept / maxSize 自动生成。 */
  description?: React.ReactNode;
  /** 通过校验的文件。 */
  onFilesSelected?: (files: File[]) => void;
  /** 未通过校验的文件及原因（选择时即拒绝）。 */
  onFilesRejected?: (rejections: UploadRejection[]) => void;
}

const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      accept,
      maxSize,
      multiple = false,
      disabled = false,
      title = "拖拽文件到此处，或点击选择",
      description,
      layout,
      className,
      onFilesSelected,
      onFilesRejected,
      onKeyDown,
      onClick,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const descId = React.useId();
    const [dragging, setDragging] = React.useState(false);

    const autoDescription = [
      accept ? `支持 ${accept.split(",").map((t) => t.trim()).join(" / ")}` : null,
      maxSize ? `单个 ≤ ${formatFileSize(maxSize)}` : null,
      multiple ? "可多选" : null,
    ]
      .filter(Boolean)
      .join("，");
    const desc = description ?? autoDescription;

    const handleFiles = (list: FileList | null) => {
      if (!list || disabled) return;
      const files = Array.from(list).slice(0, multiple ? undefined : 1);
      const accepted: File[] = [];
      const rejected: UploadRejection[] = [];
      for (const file of files) {
        if (!matchesAccept(file, accept)) {
          rejected.push({ file, reason: `不支持的文件类型，仅支持 ${accept}` });
        } else if (maxSize !== undefined && file.size > maxSize) {
          rejected.push({ file, reason: `超过 ${formatFileSize(maxSize)} 上限（${formatFileSize(file.size)}），未开始上传` });
        } else {
          accepted.push(file);
        }
      }
      if (accepted.length) onFilesSelected?.(accepted);
      if (rejected.length) onFilesRejected?.(rejected);
    };

    const openPicker = () => {
      if (!disabled) inputRef.current?.click();
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-describedby={desc ? descId : undefined}
        data-dragging={dragging || undefined}
        className={cn(uploadVariants({ layout }), className)}
        onClick={(event) => {
          onClick?.(event);
          openPicker();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = ""; // 允许重复选择同一文件
          }}
        />
        <UploadIcon className={cn("shrink-0 text-primary", layout === "inline" ? "size-4" : "size-5")} aria-hidden="true" />
        <span className="text-base font-medium text-foreground">{title}</span>
        {desc && (
          <span id={descId} className="text-xs text-muted-foreground">
            {desc}
          </span>
        )}
      </div>
    );
  },
);
Upload.displayName = "Upload";

/* ---------- UploadFileList（文件列表） ---------- */

export type UploadFileStatus = "uploading" | "success" | "error";

export interface UploadFileItem {
  id: string;
  name: string;
  /** 字节数。 */
  size?: number;
  status: UploadFileStatus;
  /** 0–100，status 为 uploading 时显示。 */
  progress?: number;
  /** 失败原因，status 为 error 时显示。 */
  error?: string;
}

export interface UploadFileListProps extends React.HTMLAttributes<HTMLUListElement> {
  files: UploadFileItem[];
  /** 失败文件的重试。 */
  onRetry?: (file: UploadFileItem) => void;
  /** 移除文件；上传中时文案为“取消上传”。 */
  onRemove?: (file: UploadFileItem) => void;
}

const UploadFileList = React.forwardRef<HTMLUListElement, UploadFileListProps>(
  ({ files, onRetry, onRemove, className, ...props }, ref) => {
    if (files.length === 0) return null;
    return (
      <ul ref={ref} aria-label="文件列表" className={cn("m-0 grid list-none gap-2 p-0", className)} {...props}>
        {files.map((file) => {
          const percent = Math.round(file.progress ?? 0);
          return (
            <li
              key={file.id}
              className={cn(
                "flex items-center gap-2.5 rounded-md border bg-card px-3 py-2.5 text-base",
                file.status === "error" && "border-danger/40",
              )}
            >
              <FileText
                aria-hidden="true"
                className={cn("size-4 shrink-0", file.status === "error" ? "text-danger" : "text-primary")}
              />
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-medium text-foreground">{file.name}</span>
                  {file.size !== undefined && (
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatFileSize(file.size)}</span>
                  )}
                </div>
                {file.status === "uploading" && (
                  <div className="flex items-center gap-2">
                    <Progress value={percent} className="flex-1" />
                    <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{percent}%</span>
                  </div>
                )}
                {file.status === "success" && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CircleCheck className="size-3.5" aria-hidden="true" />
                    上传完成
                  </span>
                )}
                {file.status === "error" && (
                  <span role="alert" className="text-xs text-danger">
                    {file.error ?? "上传失败"}
                  </span>
                )}
              </div>
              {file.status === "error" && onRetry && (
                <Button type="button" variant="ghost" size="sm" onClick={() => onRetry(file)} aria-label={`重试上传 ${file.name}`}>
                  <RotateCcw />
                  重试
                </Button>
              )}
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground"
                  onClick={() => onRemove(file)}
                  aria-label={file.status === "uploading" ? `取消上传 ${file.name}` : `移除 ${file.name}`}
                >
                  <X />
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
);
UploadFileList.displayName = "UploadFileList";

export { Upload, UploadFileList, uploadVariants };
