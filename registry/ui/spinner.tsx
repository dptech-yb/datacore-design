// Spinner 加载指示：不确定进度的旋转指示（role="status" + 读屏文案），以及覆盖局部区域的 LoadingOverlay。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("shrink-0 animate-spin text-primary", {
  variants: {
    size: { sm: "size-3.5", default: "size-5", lg: "size-7" },
  },
  defaultVariants: { size: "default" },
});

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** 说明在做什么；默认只给读屏，showLabel 时可见。 */
  label?: string;
  /** 在指示器旁显示 label 文字。 */
  showLabel?: boolean;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(({ size, label = "正在加载", showLabel = false, className, ...props }, ref) => (
  <span ref={ref} role="status" className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)} {...props}>
    <Loader2 className={spinnerVariants({ size })} aria-hidden />
    <span className={cn(!showLabel && "sr-only")}>{label}</span>
  </span>
));
Spinner.displayName = "Spinner";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否显示遮罩。 */
  loading: boolean;
  /** 遮罩上的说明文字。 */
  label?: string;
  /** 延迟显示的毫秒数，避免短暂加载闪烁。 */
  delay?: number;
  /** 指示器尺寸。 */
  size?: VariantProps<typeof spinnerVariants>["size"];
}

/** 包裹一块区域：加载时半透明遮罩覆盖该区域，内部内容 inert（不可点击、不可聚焦）。 */
const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ loading, label = "正在加载", delay = 0, size, className, children, ...props }, ref) => {
    const [visible, setVisible] = React.useState(loading && delay === 0);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!loading) {
        setVisible(false);
        return;
      }
      if (delay === 0) {
        setVisible(true);
        return;
      }
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }, [loading, delay]);

    // React 18 不识别 inert 属性，直接写 DOM
    React.useEffect(() => {
      const el = contentRef.current as (HTMLDivElement & { inert?: boolean }) | null;
      if (el) el.inert = visible;
    }, [visible]);

    return (
      <div ref={ref} className={cn("relative", className)} aria-busy={loading || undefined} {...props}>
        <div ref={contentRef}>{children}</div>
        {visible && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-background/75 animate-in fade-in-0">
            <Spinner size={size} label={label} showLabel className="flex-col gap-2" />
          </div>
        )}
      </div>
    );
  },
);
LoadingOverlay.displayName = "LoadingOverlay";

export { Spinner, LoadingOverlay, spinnerVariants };
