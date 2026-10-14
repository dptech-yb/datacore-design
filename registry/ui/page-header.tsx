// 页头：页面顶部的标题区，组合面包屑、返回链接、标题、状态徽章、说明与页面级动作，窄屏时动作区换到标题下方。
import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 页面标题，默认渲染为 h1。 */
  title: React.ReactNode;
  /** 一行说明：这个页面能做什么、影响范围。 */
  description?: React.ReactNode;
  /** 标题上方的面包屑插槽，通常放 <Breadcrumb>。 */
  breadcrumb?: React.ReactNode;
  /** 标题右侧的状态插槽，通常放 <Badge>。 */
  status?: React.ReactNode;
  /** 动作区插槽；宽屏右对齐，窄屏换到标题下方。 */
  actions?: React.ReactNode;
  /** 返回链接地址；与 onBack 任一存在时显示返回入口。 */
  backHref?: string;
  /** 返回入口的点击回调；只给 onBack 时渲染为按钮。 */
  onBack?: (event: React.MouseEvent<HTMLElement>) => void;
  /** 返回入口文案。 */
  backLabel?: React.ReactNode;
  /** 标题标签，页面内嵌区块可改为 h2。 */
  titleAs?: "h1" | "h2";
}

const backClass =
  "inline-flex w-fit items-center gap-1 rounded-sm bg-transparent p-0 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer [&_svg]:size-4";

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  (
    { className, title, description, breadcrumb, status, actions, backHref, onBack, backLabel = "返回", titleAs: Title = "h1", ...props },
    ref,
  ) => {
    const back =
      backHref !== undefined ? (
        <a href={backHref} onClick={onBack} className={backClass}>
          <ChevronLeft aria-hidden />
          {backLabel}
        </a>
      ) : onBack ? (
        <button type="button" onClick={onBack} className={backClass}>
          <ChevronLeft aria-hidden />
          {backLabel}
        </button>
      ) : null;

    return (
      <header ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
        {breadcrumb}
        {back}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="grid min-w-0 flex-1 gap-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Title className="m-0 line-clamp-2 text-xl font-semibold tracking-tight text-foreground">{title}</Title>
              {status}
            </div>
            {description && <p className="m-0 line-clamp-2 text-base text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">{actions}</div>}
        </div>
      </header>
    );
  },
);
PageHeader.displayName = "PageHeader";
