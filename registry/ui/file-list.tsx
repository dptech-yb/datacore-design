// FileList 文件列表：按行展示文件类型图标、名称、大小与状态（上传中进度 / 成功 / 失败重试），右侧放操作。
import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, File, FileArchive, FileCode, FileImage, FileJson, FileSpreadsheet, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const FileList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("m-0 grid list-none gap-2 p-0", className)} {...props} />
));
FileList.displayName = "FileList";

const iconByExt: Record<string, React.ComponentType<{ className?: string }>> = {
  json: FileJson,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  svg: FileImage,
  zip: FileArchive,
  gz: FileArchive,
  tar: FileArchive,
  py: FileCode,
  ts: FileCode,
  js: FileCode,
  sh: FileCode,
  txt: FileText,
  md: FileText,
  pdf: FileText,
  cif: FileText,
};

/** 按扩展名返回类型图标组件。 */
export function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return iconByExt[ext] ?? File;
}

/** 文件名过长时截断主体、保留扩展名。 */
function splitName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ""];
}

const rowVariants = cva("flex min-h-10 items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-base", {
  variants: {
    status: {
      idle: "",
      uploading: "",
      success: "",
      error: "border-danger/40 bg-danger-soft/40",
    },
  },
  defaultVariants: { status: "idle" },
});

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface FileListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** 文件名（含扩展名）。 */
  name: string;
  /** 已格式化的大小，如 “48 KB”。 */
  size?: string;
  /** 状态：idle 普通 / uploading 上传中 / success 上传成功 / error 失败。 */
  status?: FileStatus;
  /** 上传进度 0–100，status="uploading" 时显示。 */
  progress?: number;
  /** 失败原因，status="error" 时显示。 */
  error?: React.ReactNode;
  /** 自定义类型图标；默认按扩展名推断。 */
  icon?: React.ReactNode;
  /** 失败时的重试回调，提供则显示“重试”按钮。 */
  onRetry?: () => void;
  /** 上传中的取消回调，提供则显示“取消”按钮。 */
  onCancel?: () => void;
  /** 右侧操作区（下载、删除等图标按钮）。 */
  actions?: React.ReactNode;
}

const FileListItem = React.forwardRef<HTMLLIElement, FileListItemProps>(
  ({ name, size, status = "idle", progress = 0, error, icon, onRetry, onCancel, actions, className, ...props }, ref) => {
    const Icon = fileIcon(name);
    const [base, ext] = splitName(name);
    return (
      <li ref={ref} className={cn(rowVariants({ status }), className)} {...props}>
        <span className={cn("flex shrink-0 [&_svg]:size-4", status === "error" ? "text-danger" : "text-primary")} aria-hidden>
          {status === "error" ? <AlertTriangle /> : icon ?? <Icon />}
        </span>
        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="flex min-w-0 font-medium text-foreground" title={name}>
              <span className="truncate">{base}</span>
              <span className="shrink-0">{ext}</span>
            </span>
            {size && <span className="shrink-0 font-mono text-xs text-muted-foreground">{size}</span>}
            {status === "uploading" && (
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                <span className="sr-only">上传中 </span>
                {Math.round(progress)}%
              </span>
            )}
            {status === "success" && (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-success">
                <CheckCircle2 className="size-3.5" aria-hidden />
                已上传
              </span>
            )}
          </div>
          {status === "uploading" && <Progress value={progress} />}
          {status === "error" && error && (
            <span className="text-xs text-danger" role="alert">
              {error}
            </span>
          )}
        </div>
        {(actions || (status === "error" && onRetry) || (status === "uploading" && onCancel)) && (
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {status === "uploading" && onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} aria-label={`取消上传 ${name}`}>
                取消
              </Button>
            )}
            {status === "error" && onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry} aria-label={`重试上传 ${name}`}>
                重试
              </Button>
            )}
            {actions}
          </div>
        )}
      </li>
    );
  },
);
FileListItem.displayName = "FileListItem";

export { FileList, FileListItem };
