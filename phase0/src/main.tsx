import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppShell } from "@/components/shell";
import { TooltipProvider } from "@/components/ui/misc";
import Brand from "@/pages/Brand";
import Workbench from "@/pages/Workbench";
import ExperimentDetail from "@/pages/ExperimentDetail";
import DataTool from "@/pages/DataTool";

const PAGES = {
  brand: { el: <Brand />, nav: "home", child: undefined },
  workbench: { el: <Workbench />, nav: "home", child: undefined },
  experiment: { el: <ExperimentDetail />, nav: "projects", child: "p1" },
  tool: { el: <DataTool />, nav: "tools", child: "curve" },
} as const;
type Key = keyof typeof PAGES;

function App() {
  const read = () => (location.hash.replace("#/", "") || "brand") as Key;
  const [page, setPage] = useState<Key>(read());
  const [theme, setTheme] = useState<"light" | "dark">(new URLSearchParams(location.search).get("theme") === "dark" ? "dark" : "light");
  useEffect(() => { const f = () => setPage(read()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const p = PAGES[page] ?? PAGES.brand;
  return (
    <TooltipProvider>
      <AppShell active={p.nav} activeChild={p.child} theme={theme} onTheme={() => setTheme(theme === "light" ? "dark" : "light")}>
        {p.el}
      </AppShell>
      {!new URLSearchParams(location.search).has("shot") && <nav className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-lg border bg-popover p-1 text-sm shadow-lg" aria-label="样张切换">
        {(Object.keys(PAGES) as Key[]).map((k) => (
          <a key={k} href={`#/${k}`} className={`rounded-md px-2.5 py-1 ${k === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            {{ brand: "品牌", workbench: "工作台", experiment: "实验详情", tool: "数据工具" }[k]}
          </a>
        ))}
      </nav>}
    </TooltipProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
