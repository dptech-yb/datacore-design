import * as React from "react";
import {
  Bell, Beaker, Boxes, ChevronDown, ChevronsUpDown, FlaskConical, FolderKanban, Home, LineChart, Moon, Search, Settings, Sparkles, Sun, Wrench,
} from "lucide-react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd } from "./ui/misc";

type Item = { key: string; label: string; icon: React.ComponentType<{ className?: string }>; children?: { key: string; label: string; count?: number }[] };

const NAV: Item[] = [
  { key: "home", label: "工作台", icon: Home },
  { key: "agent", label: "DataCore Agent", icon: Sparkles },
  {
    key: "projects", label: "研发项目", icon: FolderKanban,
    children: [{ key: "p1", label: "低温电解液", count: 4 }, { key: "p2", label: "高压正极界面", count: 2 }, { key: "p3", label: "固态电解质筛选" }],
  },
  { key: "resources", label: "实验资源", icon: Boxes, children: [{ key: "sched", label: "工站预约" }, { key: "reagents", label: "试剂管理" }] },
  { key: "tools", label: "数据工具", icon: Wrench, children: [{ key: "curve", label: "充放电曲线绘制" }, { key: "cycle", label: "循环衰减汇总" }, { key: "opt", label: "电解液配方优化" }] },
  { key: "reports", label: "研发报告", icon: LineChart },
];

export function AppShell({ active, activeChild, theme, onTheme, children }: { active: string; activeChild?: string; theme: "light" | "dark"; onTheme: () => void; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-12 items-center gap-2 px-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">Li</div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-base font-semibold">DataCore</div>
          </div>
          <ChevronsUpDown className="size-4 text-subtle" />
        </div>
        <div className="px-3 pb-2">
          <button className="flex h-8 w-full items-center gap-2 rounded-md border bg-background px-2 text-sm text-subtle shadow-xs hover:bg-accent">
            <Search className="size-4" /> 搜索或跳转
            <span className="ml-auto flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1" aria-label="主导航">
          {NAV.map((it) => {
            const on = it.key === active;
            return (
              <div key={it.key}>
                <a className={cn("flex h-8 items-center gap-2 rounded-md px-2 text-base transition-colors", on && !it.children ? "bg-primary-soft font-medium text-primary" : "text-foreground/80 hover:bg-accent hover:text-foreground", on && it.children && "font-medium text-foreground")}>
                  <it.icon className={cn("size-4", on ? "text-primary" : "text-muted-foreground")} />
                  {it.label}
                  {it.children && <ChevronDown className={cn("ml-auto size-3.5 text-subtle transition-transform", !on && "-rotate-90")} />}
                </a>
                {on && it.children && (
                  <div className="ml-[17px] mt-0.5 space-y-0.5 border-l pl-2">
                    {it.children.map((c) => (
                      <a key={c.key} className={cn("flex h-7 items-center rounded-md px-2 text-sm", c.key === activeChild ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                        {c.label}
                        {c.count != null && <span className="ml-auto text-xs tabular text-subtle">{c.count}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="space-y-0.5 border-t p-2">
          <a className="flex h-8 items-center gap-2 rounded-md px-2 text-base text-foreground/80 hover:bg-accent"><Settings className="size-4 text-muted-foreground" />管理</a>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-agent-soft text-xs font-semibold text-agent">林</div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-medium">林示例</div>
              <div className="truncate text-xs text-muted-foreground">实验员 · 电解液组</div>
            </div>
            <button aria-label="切换深浅色" onClick={onTheme} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function TopBar({ crumbs, actions }: { crumbs: string[]; actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
      <button aria-label="打开导航" className="-ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden"><Menu className="size-5" /></button>
      <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground md:hidden">Li</div>
      <nav aria-label="面包屑" className="flex min-w-0 items-center gap-1.5 text-sm max-md:[&>span:not(:last-child)]:hidden max-md:[&>span:nth-last-child(2)]:hidden">
        {crumbs.map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 && <span className="text-subtle">/</span>}
            <span className={cn("truncate", i === crumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground")}>{c}</span>
          </React.Fragment>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        {actions}
        <button aria-label="通知" className="relative rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  );
}

export const Icons = { Beaker, FlaskConical };
