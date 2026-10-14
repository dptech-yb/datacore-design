// 链接：只负责跳转的 <a>，品牌色、hover 下划线，支持外链（新标签页 + 图标）、muted/danger 变体、禁用与 asChild（路由链接）。
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const linkVariants = cva(
  "inline-flex items-center gap-0.5 rounded-sm font-medium underline-offset-4 transition-colors duration-fast ease-standard cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary-hover",
        muted: "text-muted-foreground hover:text-foreground",
        danger: "text-danger hover:text-danger/80",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  /** 外链：新标签页打开，附加 rel 与外链图标。 */
  external?: boolean;
  /** 禁用：去掉 href，渲染为不可跳转的 muted 文本（aria-disabled）。 */
  disabled?: boolean;
  /** 把样式与行为交给子元素，例如路由库的 <RouterLink>。 */
  asChild?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, disabled, asChild, href, target, rel, children, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    if (disabled) {
      return (
        <Comp
          ref={ref}
          role="link"
          aria-disabled="true"
          className={cn(linkVariants({ variant: "muted" }), "cursor-not-allowed opacity-60 hover:no-underline hover:text-muted-foreground", className)}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
          {...props}
        >
          <Slottable>{children}</Slottable>
        </Comp>
      );
    }
    return (
      <Comp
        ref={ref}
        href={href}
        target={external ? (target ?? "_blank") : target}
        rel={external ? (rel ?? "noopener noreferrer") : rel}
        className={cn(linkVariants({ variant }), className)}
        onClick={onClick}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {external && (
          <>
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">（在新标签页打开）</span>
          </>
        )}
      </Comp>
    );
  },
);
Link.displayName = "Link";
