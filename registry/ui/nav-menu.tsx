// 导航菜单：侧边栏的纵向导航列表，支持分组（可折叠）、图标、计数徽章、当前页（aria-current="page"）与带原因的禁用项。
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE = "[data-nav-menu-focusable]";

/** 外层 <nav>：↑/↓ 在可见的菜单项与分组标题间移动焦点，Home / End 跳到首尾。 */
export const NavMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, onKeyDown, "aria-label": ariaLabel = "导航菜单", ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const index = nodes.indexOf(document.activeElement as HTMLElement);
      let next = 0;
      if (event.key === "End") next = nodes.length - 1;
      else if (event.key === "ArrowDown") next = index < 0 ? 0 : (index + 1) % nodes.length;
      else if (event.key === "ArrowUp") next = index < 0 ? nodes.length - 1 : (index - 1 + nodes.length) % nodes.length;
      event.preventDefault();
      nodes[next]?.focus();
    };
    return (
      <nav ref={ref} aria-label={ariaLabel} className={cn("flex flex-col gap-4", className)} onKeyDown={handleKeyDown} {...props} />
    );
  },
);
NavMenu.displayName = "NavMenu";

export interface NavMenuGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 分组标题；不传时只渲染列表。 */
  label?: React.ReactNode;
  /** 分组可折叠（基于 Radix Collapsible）。 */
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const listClass = "m-0 flex list-none flex-col gap-0.5 p-0";

export const NavMenuGroup = React.forwardRef<HTMLDivElement, NavMenuGroupProps>(
  ({ className, label, collapsible, defaultOpen = true, open, onOpenChange, children, ...props }, ref) => {
    const labelId = React.useId();
    if (collapsible && label) {
      return (
        <CollapsiblePrimitive.Root
          ref={ref}
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
          className={cn("grid gap-1", className)}
          {...props}
        >
          <CollapsiblePrimitive.Trigger
            data-nav-menu-focusable=""
            className="group flex h-7 w-full cursor-pointer items-center justify-between rounded-md border-0 bg-transparent px-2 font-[inherit] text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span id={labelId}>{label}</span>
            <ChevronDown aria-hidden className="size-3.5 transition-transform duration-fast group-data-[state=closed]:-rotate-90" />
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Content>
            <ul aria-labelledby={labelId} className={listClass}>
              {children}
            </ul>
          </CollapsiblePrimitive.Content>
        </CollapsiblePrimitive.Root>
      );
    }
    return (
      <div ref={ref} className={cn("grid gap-1", className)} {...props}>
        {label && (
          <div id={labelId} className="flex h-7 items-center px-2 text-xs font-medium text-muted-foreground">
            {label}
          </div>
        )}
        <ul aria-labelledby={label ? labelId : undefined} className={listClass}>
          {children}
        </ul>
      </div>
    );
  },
);
NavMenuGroup.displayName = "NavMenuGroup";

export interface NavMenuItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  /** 有 href 渲染为 <a>，否则渲染为 <button>。 */
  href?: string;
  icon?: React.ReactNode;
  /** 右侧徽章：计数、beta 标记或锁图标。 */
  badge?: React.ReactNode;
  /** 当前页；输出 aria-current="page"。 */
  active?: boolean;
  /** 禁用但保留可聚焦（aria-disabled），以便读出 disabledReason。 */
  disabled?: boolean;
  /** 禁用原因：作为 title 提示，并提供给读屏。 */
  disabledReason?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const NavMenuItem = React.forwardRef<HTMLElement, NavMenuItemProps>(
  ({ className, href, icon, badge, active, disabled, disabledReason, onClick, children, ...props }, ref) => {
    const reasonId = React.useId();
    const shared = {
      "data-nav-menu-focusable": "",
      "aria-current": active ? ("page" as const) : undefined,
      "aria-disabled": disabled || undefined,
      "aria-describedby": disabled && disabledReason ? reasonId : undefined,
      title: disabled ? disabledReason : undefined,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      className: cn(
        "flex h-8 w-full items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left font-[inherit] text-base text-muted-foreground no-underline transition-colors duration-fast",
        "hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        active && "bg-primary-soft font-semibold text-primary hover:bg-primary-soft hover:text-primary",
        disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground" : "cursor-pointer",
        className,
      ),
      ...props,
    };
    const content = (
      <>
        {icon}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {badge !== undefined && badge !== null && <span className="ml-auto inline-flex shrink-0 items-center">{badge}</span>}
      </>
    );
    return (
      <li>
        {href !== undefined && !disabled ? (
          <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...shared}>
            {content}
          </a>
        ) : (
          <button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...shared}>
            {content}
          </button>
        )}
        {disabled && disabledReason && (
          <span id={reasonId} className="sr-only">
            {disabledReason}
          </span>
        )}
      </li>
    );
  },
);
NavMenuItem.displayName = "NavMenuItem";
