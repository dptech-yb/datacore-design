import { ChevronDown, Code2, ExternalLink, Menu, Moon, Search, Sun, Terminal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildNavModel,
  categoryOf,
  componentDocs,
  getArticle,
  getComponent,
  type NavGroup,
} from "./catalog";
import { parseHash, navigate, type Route } from "./router";
import { SearchModal } from "./components/SearchModal";
import { ComponentDocPage, componentToc } from "./pages/ComponentDocPage";
import { ArticleDocPage, articleToc } from "./pages/ArticleDocPage";
import { HomePage } from "./pages/HomePage";
import { AiPage, PrinciplesPage, StartPage } from "./pages/StaticPages";

interface TocItem {
  id: string;
  label: string;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    const onOpenSearch = () => setSearchOpen(true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("dc:open-search", onOpenSearch);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("dc:open-search", onOpenSearch);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [route]);

  const navGroups = useMemo(buildNavModel, []);
  const { page, toc, breadcrumb, activePath } = renderRoute(route);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
          <div>
            <div className="brand-name">DataCore <span>Design</span></div>
            <div className="brand-caption">设计语言与组件契约</div>
          </div>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="关闭导航">
            <X size={18} />
          </button>
        </div>

        <button className="sidebar-search" onClick={() => setSearchOpen(true)}>
          <Search size={14} /> 搜索 <kbd>⌘K</kbd>
        </button>

        <nav aria-label="设计系统导航" className="sidebar-nav">
          {navGroups.map((group) => (
            <NavSection key={group.id} group={group} activePath={activePath} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="./llms.txt" className="footer-link"><Terminal size={14} /> AI 快速入口</a>
          <a href="https://github.com/dptech-yb/datacore-design" className="footer-link" target="_blank" rel="noreferrer">
            <Code2 size={14} /> GitHub <ExternalLink size={12} />
          </a>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="打开导航">
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>DataCore Design</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{breadcrumb}</strong>
          </div>
          <div className="topbar-actions">
            <button className="topbar-search" onClick={() => setSearchOpen(true)} aria-label="搜索">
              <Search size={15} /> <span>搜索</span> <kbd>⌘K</kbd>
            </button>
            <a href="./llms-full.txt" className="topbar-link"><Terminal size={15} /> <span>AI 文档</span></a>
            <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "切换亮色主题" : "切换暗色主题"} aria-pressed={dark}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <div className="doc-layout">
          <main className="content">
            {page}
          </main>
          {toc.length > 0 && (
            <aside className="page-toc" aria-label="本页目录">
              <div className="page-toc-title">本页目录</div>
              {toc.map((item) => (
                <a key={item.id} href={`#${routeAnchor(route, item.id)}`} onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}>{item.label}</a>
              ))}
            </aside>
          )}
        </div>
        <footer className="site-footer">
          <span>DataCore Design · MIT License</span>
          <span>规范优先，组件可复用，数据可追溯</span>
        </footer>
      </div>

      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function routeAnchor(route: Route, id: string) {
  void route;
  return id;
}

function NavSection({ group, activePath }: { group: NavGroup; activePath: string }) {
  const containsActive = group.items.some((item) => item.path === activePath);
  const [open, setOpen] = useState(!group.collapsible || containsActive);
  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  return (
    <div className="nav-group">
      <button
        className="nav-group-label nav-group-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {group.label}
        <ChevronDown size={13} className={open ? "chevron-open" : ""} />
      </button>
      {open && group.items.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${activePath === item.path ? "nav-item-active" : ""}`}
          onClick={() => navigate(item.path)}
          aria-current={activePath === item.path ? "page" : undefined}
        >
          <span className="nav-item-label">{item.label}</span>
          {item.status && item.status !== "stable" && (
            <span className={`nav-status nav-status-${item.status}`}>{item.status === "beta" ? "β" : "α"}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function renderRoute(route: Route): { page: React.ReactNode; toc: TocItem[]; breadcrumb: string; activePath: string } {
  switch (route.kind) {
    case "home":
      return { page: <HomePage />, toc: [], breadcrumb: "总览", activePath: "/" };
    case "start":
      return { page: <StartPage />, toc: [], breadcrumb: "开始使用", activePath: "/start" };
    case "principles":
      return { page: <PrinciplesPage />, toc: [], breadcrumb: "设计原则", activePath: "/principles" };
    case "component": {
      const doc = getComponent(route.id);
      if (!doc) return notFound(`组件 ${route.id}`);
      const category = categoryOf(doc.category);
      return {
        page: <ComponentDocPage doc={doc} />,
        toc: componentToc(doc),
        breadcrumb: `组件 / ${category?.chineseName ?? doc.category} / ${doc.name}`,
        activePath: `/components/${doc.id}`,
      };
    }
    case "foundation": {
      const doc = getArticle("foundation", route.id);
      if (!doc) return notFound(`基础规范 ${route.id}`);
      return { page: <ArticleDocPage doc={doc} eyebrow="Foundations / 基础" />, toc: articleToc(doc), breadcrumb: `基础 / ${doc.chineseName}`, activePath: `/foundations/${doc.id}` };
    }
    case "pattern": {
      const doc = getArticle("pattern", route.id);
      if (!doc) return notFound(`业务模式 ${route.id}`);
      return { page: <ArticleDocPage doc={doc} eyebrow="Patterns / 业务模式" />, toc: articleToc(doc), breadcrumb: `业务模式 / ${doc.chineseName}`, activePath: `/patterns/${doc.id}` };
    }
    case "template": {
      const doc = getArticle("template", route.id);
      if (!doc) return notFound(`页面模板 ${route.id}`);
      return { page: <ArticleDocPage doc={doc} eyebrow="Templates / 页面模板" />, toc: articleToc(doc), breadcrumb: `页面模板 / ${doc.chineseName}`, activePath: `/templates/${doc.id}` };
    }
    case "ai": {
      const titles: Record<string, string> = { registry: "组件注册表", llms: "llms.txt", naming: "命名规范", accessibility: "可访问性", contributing: "贡献指南" };
      return { page: <AiPage id={route.id} />, toc: [], breadcrumb: `AI 与工程 / ${titles[route.id] ?? "组件注册表"}`, activePath: `/ai/${route.id}` };
    }
  }
}

function notFound(what: string) {
  return {
    page: (
      <article className="doc-page">
        <header className="doc-header">
          <div className="doc-header-main">
            <span className="component-meta">404</span>
            <h1>没有找到{what}</h1>
            <p className="doc-purpose">
              它可能还没有被收录。目前共有 {componentDocs.length} 个组件，可以从左侧导航或 ⌘K 搜索查找；
              也可以 <button className="text-link" onClick={() => navigate("/")}>返回总览</button>。
            </p>
          </div>
        </header>
      </article>
    ),
    toc: [],
    breadcrumb: "未找到",
    activePath: "",
  };
}
