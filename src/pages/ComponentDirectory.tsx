import { ArrowUpRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { componentCategories, componentDocs } from "../catalog";

export function ComponentDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(
    () =>
      componentDocs.filter(
        (d) =>
          (category === "all" || category === d.category) &&
          `${d.name} ${d.chineseName} ${d.purpose}`
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
      ),
    [category, query],
  );
  return (
    <article className="component-directory">
      <header className="doc-header">
        <div>
          <span className="component-meta">COMPONENTS</span>
          <h1>每个细节，都有规范。</h1>
          <p className="doc-purpose">
            {componentDocs.length} 个组件。查看预览、交互规则与代码示例。
          </p>
        </div>
      </header>
      <div className="directory-toolbar">
        <label className="directory-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索组件名称或用途…"
            aria-label="筛选组件"
          />
          {query && (
            <button
              className="icon-button"
              aria-label="清除搜索"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <span role="status">{filtered.length} 个组件</span>
      </div>
      <div className="category-filters" aria-label="组件分类">
        <button
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          全部
        </button>
        {componentCategories.map((c) => (
          <button
            key={c.id}
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.chineseName}
          </button>
        ))}
      </div>
      <div className="directory-grid">
        {filtered.map((d) => (
          <a
            className="directory-card"
            href={`#/components/${d.id}`}
            key={d.id}
          >
            <div>
              <span>{d.name}</span>
              <ArrowUpRight size={16} />
            </div>
            <h2>{d.chineseName}</h2>
            <p>{d.purpose}</p>
            <span className={`directory-status chip-${d.status}`}>
              {d.status}
            </span>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="directory-empty">
          <Search size={28} />
          <h2>没有找到匹配组件</h2>
          <p>试试英文名称，或清除筛选条件。</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            清除筛选
          </button>
        </div>
      )}
    </article>
  );
}
