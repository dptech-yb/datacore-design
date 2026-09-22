import {
  ChevronDown,
  Code2,
  Menu,
  Moon,
  Search,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  buildNavModel,
  categoryOf,
  componentDocs,
  getArticle,
  getComponent,
  type NavGroup,
} from "./catalog";
import { parseHash, navigate, routeToHash, type Route } from "./router";
import { SearchModal } from "./components/SearchModal";
import { Modal } from "./components/Modal";
import { HomePage } from "./pages/HomePage";
import { ComponentDirectory } from "./pages/ComponentDirectory";
import { AiPage, PrinciplesPage, StartPage } from "./pages/StaticPages";
import { componentToc, articleToc } from "./toc";

// Examples and their preview registry load only when a documentation page opens.
const ComponentDocPage = lazy(() =>
  import("./pages/ComponentDocPage").then((m) => ({
    default: m.ComponentDocPage,
  })),
);
const ArticleDocPage = lazy(() =>
  import("./pages/ArticleDocPage").then((m) => ({ default: m.ArticleDocPage })),
);
interface TocItem {
  id: string;
  label: string;
}
function initialDark() {
  try {
    const saved = localStorage.getItem("dc-theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}
function Brand() {
  return (
    <a className="brand" href="#/" aria-label="DataCore Design 首页">
      <img src="./brand/datacore-logo.png" alt="" width="32" height="32" />
      <strong>DataCore</strong>
      <span>Design</span>
    </a>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(initialDark);
  const [section, setSection] = useState("");
  const isHome = route.kind === "home";
  const navGroups = useMemo(buildNavModel, []);
  const { page, toc, breadcrumb, activePath } = renderRoute(route);
  const routeKey = routeToHash(route);
  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash(window.location.hash);
      setRoute((old) => (routeToHash(old) === routeToHash(next) ? old : next));
      const anchor = new URLSearchParams(
        window.location.hash.split("?")[1],
      ).get("section");
      if (anchor) {
        setSection(anchor);
        requestAnimationFrame(() =>
          document.getElementById(anchor)?.scrollIntoView({ block: "start" }),
        );
      } else {
        setSection("");
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("dc-theme", dark ? "dark" : "light");
    } catch {
      /* Preference storage can be disabled. */
    }
  }, [dark]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (
          document.querySelector(
            "dialog[open]:not(.search-dialog):not(.navigation-dialog)",
          )
        )
          return;
        setMobileOpen(false);
        setSearchOpen((v) => !v);
      }
    };
    const onSearch = () => {
      setMobileOpen(false);
      setSearchOpen(true);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("dc:open-search", onSearch);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("dc:open-search", onSearch);
    };
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setSection("");
    document.title = `${breadcrumb} · DataCore Design`;
    const anchor = new URLSearchParams(window.location.hash.split("?")[1]).get(
      "section",
    );
    if (!anchor) window.scrollTo({ top: 0, behavior: "instant" });
    // Lazy documentation may not be mounted yet when a deep link is opened.
    const scrollToAnchor = () => {
      if (anchor && document.getElementById(anchor)) {
        document.getElementById(anchor)?.scrollIntoView({ block: "start" });
        return true;
      }
      return false;
    };
    if (!anchor || scrollToAnchor()) return;
    const observer = new MutationObserver(() => {
      if (scrollToAnchor()) observer.disconnect();
    });
    observer.observe(document.getElementById("main-content")!, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [routeKey, breadcrumb]);
  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setSection(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" },
    );
    const attach = () =>
      toc.forEach((item) => {
        const node = document.getElementById(item.id);
        if (node) observer.observe(node);
      });
    attach();
    const mutation = new MutationObserver(attach);
    mutation.observe(document.getElementById("main-content")!, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [routeKey, toc.map((t) => t.id).join(",")]);
  const nav = (
    <>
      <a
        href="#/components"
        className={`nav-directory ${route.kind === "directory" ? "nav-item-active" : ""}`}
      >
        全部组件 <span>{componentDocs.length}</span>
      </a>
      {navGroups.map((group) => (
        <NavSection key={group.id} group={group} activePath={activePath} />
      ))}
      <a className="footer-link" href="./llms.txt">
        <Terminal size={15} /> llms.txt
      </a>
    </>
  );
  return (
    <div className={`app-frame ${isHome ? "is-home" : "is-docs"}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳转到内容
      </a>
      <header className="global-header">
        <div className="global-header-inner">
          <Brand />
          <nav className="primary-nav" aria-label="主导航">
            <a
              href="#/components"
              aria-current={
                route.kind === "component" || route.kind === "directory"
                  ? "page"
                  : undefined
              }
            >
              组件
            </a>
            <a
              href="#/foundations/color"
              aria-current={route.kind === "foundation" ? "page" : undefined}
            >
              设计规范
            </a>
            <a
              href="#/templates/list-page"
              aria-current={route.kind === "template" ? "page" : undefined}
            >
              模板
            </a>
            <a
              href="#/ai/registry"
              aria-current={route.kind === "ai" ? "page" : undefined}
            >
              AI 文档
            </a>
          </nav>
          <div className="header-tools">
            <button
              className="header-search"
              onClick={() => setSearchOpen(true)}
              aria-label="搜索文档"
            >
              <Search size={16} />
              <span>搜索文档</span>
              <kbd>⌘ K</kbd>
            </button>
            <a
              className="icon-button github-link"
              href="https://github.com/dptech-yb/datacore-design"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub 仓库"
            >
              <Code2 size={19} />
            </a>
            {!isHome && (
              <button
                className="icon-button"
                onClick={() => setDark(!dark)}
                aria-label={dark ? "切换亮色主题" : "切换暗色主题"}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="打开导航"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <div className={isHome ? "home-layout" : "app-shell"}>
        {!isHome && (
          <aside className="sidebar desktop-sidebar">
            <nav className="sidebar-nav" aria-label="设计系统导航">
              {nav}
            </nav>
          </aside>
        )}
        <div className="main-column">
          {!isHome && (
            <div className="doc-breadcrumb">
              <a href="#/">首页</a>
              <span>/</span>
              <span>{breadcrumb}</span>
            </div>
          )}
          <div
            className={
              isHome
                ? "home-content"
                : `doc-layout ${toc.length ? "" : "no-toc"}`
            }
          >
            <main className="content" id="main-content" tabIndex={-1}>
              <Suspense
                fallback={
                  <div className="page-loading" role="status">
                    正在载入文档…
                  </div>
                }
              >
                {page}
              </Suspense>
            </main>
            {toc.length > 0 && (
              <aside className="page-toc" aria-label="本页目录">
                <div className="page-toc-title">本页内容</div>
                {toc.map((item) => (
                  <a
                    key={item.id}
                    className={section === item.id ? "toc-active" : ""}
                    href={`${routeKey}?section=${item.id}`}
                  >
                    {item.label}
                  </a>
                ))}
              </aside>
            )}
          </div>
          {!isHome && (
            <footer className="site-footer">
              <span>DataCore Design</span>
              <span>公开设计参考 · MIT License</span>
            </footer>
          )}
        </div>
      </div>
      <Modal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        label="站点导航"
        className="navigation-dialog"
      >
        <div id="mobile-navigation" className="mobile-navigation">
          <div className="mobile-nav-head">
            <Brand />
            <button
              className="icon-button"
              onClick={() => setMobileOpen(false)}
              aria-label="关闭导航"
            >
              <X size={20} />
            </button>
          </div>
          <nav
            aria-label="移动导航"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
            }}
          >
            {nav}
          </nav>
        </div>
      </Modal>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
function NavSection({
  group,
  activePath,
}: {
  group: NavGroup;
  activePath: string;
}) {
  const containsActive = group.items.some((item) => item.path === activePath);
  const [open, setOpen] = useState(!group.collapsible || containsActive);
  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);
  return (
    <div className="nav-group">
      <button
        className="nav-group-label nav-group-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {group.label}
        <ChevronDown size={13} className={open ? "chevron-open" : ""} />
      </button>
      {open &&
        group.items.map((item) => (
          <a
            key={item.path}
            href={`#${item.path}`}
            className={`nav-item ${activePath === item.path ? "nav-item-active" : ""}`}
            aria-current={activePath === item.path ? "page" : undefined}
          >
            <span className="nav-item-label">{item.label}</span>
            {item.status && item.status !== "stable" && (
              <span className={`nav-status nav-status-${item.status}`}>
                {item.status === "beta" ? "β" : "α"}
              </span>
            )}
          </a>
        ))}
    </div>
  );
}
function renderRoute(route: Route): {
  page: React.ReactNode;
  toc: TocItem[];
  breadcrumb: string;
  activePath: string;
} {
  switch (route.kind) {
    case "home":
      return {
        page: <HomePage />,
        toc: [],
        breadcrumb: "总览",
        activePath: "/",
      };
    case "directory":
      return {
        page: <ComponentDirectory />,
        toc: [],
        breadcrumb: "全部组件",
        activePath: "/components",
      };
    case "start":
      return {
        page: <StartPage />,
        toc: [],
        breadcrumb: "开始使用",
        activePath: "/start",
      };
    case "principles":
      return {
        page: <PrinciplesPage />,
        toc: [],
        breadcrumb: "设计原则",
        activePath: "/principles",
      };
    case "component": {
      const doc = getComponent(route.id);
      if (!doc) return notFound(`组件 ${route.id}`);
      const category = categoryOf(doc.category);
      return {
        page: <ComponentDocPage key={doc.id} doc={doc} />,
        toc: componentToc(doc),
        breadcrumb: `组件 / ${category?.chineseName ?? doc.category} / ${doc.name}`,
        activePath: `/components/${doc.id}`,
      };
    }
    case "foundation": {
      const doc = getArticle("foundation", route.id);
      if (!doc) return notFound(`基础规范 ${route.id}`);
      return {
        page: (
          <ArticleDocPage key={doc.id} doc={doc} eyebrow="Foundations / 基础" />
        ),
        toc: articleToc(doc),
        breadcrumb: `基础 / ${doc.chineseName}`,
        activePath: `/foundations/${doc.id}`,
      };
    }
    case "pattern": {
      const doc = getArticle("pattern", route.id);
      if (!doc) return notFound(`业务模式 ${route.id}`);
      return {
        page: (
          <ArticleDocPage
            key={doc.id}
            doc={doc}
            eyebrow="Patterns / 业务模式"
          />
        ),
        toc: articleToc(doc),
        breadcrumb: `业务模式 / ${doc.chineseName}`,
        activePath: `/patterns/${doc.id}`,
      };
    }
    case "template": {
      const doc = getArticle("template", route.id);
      if (!doc) return notFound(`页面模板 ${route.id}`);
      return {
        page: (
          <ArticleDocPage
            key={doc.id}
            doc={doc}
            eyebrow="Templates / 页面模板"
          />
        ),
        toc: articleToc(doc),
        breadcrumb: `页面模板 / ${doc.chineseName}`,
        activePath: `/templates/${doc.id}`,
      };
    }
    case "ai": {
      const titles: Record<string, string> = {
        registry: "组件注册表",
        llms: "llms.txt",
        naming: "命名规范",
        accessibility: "可访问性",
        contributing: "贡献指南",
      };
      return {
        page: <AiPage id={route.id} />,
        toc: [],
        breadcrumb: `AI 与工程 / ${titles[route.id] ?? "组件注册表"}`,
        activePath: `/ai/${route.id}`,
      };
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
              它可能还没有被收录。目前共有 {componentDocs.length}{" "}
              个组件，可以从左侧导航或 ⌘K 搜索查找； 也可以{" "}
              <button className="text-link" onClick={() => navigate("/")}>
                返回总览
              </button>
              。
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
