// 排版：语义化标题（H1–H4）、正文 Text（语义色）、Lead、Small、InlineCode 与等宽数字 Num，字号全部取自主题令牌。
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

/** 页面主标题，每屏一个；窄屏 24px，≥768px 30px。 */
export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn("m-0 text-2xl font-semibold tracking-tight text-foreground md:text-3xl", className)} {...props} />
));
H1.displayName = "H1";

/** 区块标题。 */
export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("m-0 text-xl font-semibold tracking-tight text-foreground", className)} {...props} />
));
H2.displayName = "H2";

/** 子区块 / 卡片组标题。 */
export const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("m-0 text-lg font-semibold text-foreground", className)} {...props} />
));
H3.displayName = "H3";

/** 最小一级标题，如表单分组、卡片标题。 */
export const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn("m-0 text-md font-semibold text-foreground", className)} {...props} />
));
H4.displayName = "H4";

export const textVariants = cva("m-0", {
  variants: {
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      subtle: "text-subtle",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      agent: "text-agent",
    },
    size: { sm: "text-sm", base: "text-base", md: "text-md" },
    truncate: { true: "block truncate", false: "" },
  },
  defaultVariants: { tone: "default", size: "base", truncate: false },
});

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color">, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label";
}

/** 正文；tone 只用于状态文本。truncate 单行截断，完整值请放进 title。 */
export const Text = React.forwardRef<HTMLElement, TextProps>(({ as: Tag = "p", className, tone, size, truncate, ...props }, ref) => (
  <Tag ref={ref as React.Ref<never>} className={cn(textVariants({ tone, size, truncate }), className)} {...props} />
));
Text.displayName = "Text";

/** 导语：标题下的一句概述。 */
export const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("m-0 text-md text-muted-foreground", className)} {...props} />
));
Lead.displayName = "Lead";

/** 辅助说明 / 字段标签：12px muted。 */
export const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <small ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
));
Small.displayName = "Small";

/** 行内代码：字段名、命令、路径。 */
export const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <code ref={ref} className={cn("rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground", className)} {...props} />
));
InlineCode.displayName = "InlineCode";

export interface NumProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 使用等宽字体（ID、哈希、对齐的数值列）；默认只启用等宽数字。 */
  mono?: boolean;
}

/** 数值与 ID：tabular-nums 保证列对齐，mono 用于 ID。 */
export const Num = React.forwardRef<HTMLSpanElement, NumProps>(({ className, mono, ...props }, ref) => (
  <span ref={ref} className={cn("tabular-nums", mono && "font-mono text-[0.95em]", className)} {...props} />
));
Num.displayName = "Num";
