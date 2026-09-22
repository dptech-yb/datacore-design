import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildSearchIndex, type SearchEntry } from "../catalog";
import { navigate } from "../router";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildSearchIndex, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return index.slice(0, 8);
    return index
      .filter((entry) => `${entry.title} ${entry.subtitle} ${entry.keywords}`.toLowerCase().includes(value))
      .slice(0, 12);
  }, [index, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
      if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
      if (event.key === "Enter" && results[active]) {
        navigate(results[active].path);
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, active, onClose]);

  if (!open) return null;

  return (
    <div className="search-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="search-modal" role="dialog" aria-modal="true" aria-label="全局搜索">
        <div className="search-input-row">
          <Search size={16} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索组件、业务模式、AI 契约…"
            aria-label="搜索组件、模式或页面"
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="search-results" role="listbox">
          {results.length === 0 && <li className="search-empty">没有匹配的结果，试试组件英文名或中文关键词。</li>}
          {results.map((entry, resultIndex) => (
            <SearchResultRow
              key={entry.path}
              entry={entry}
              active={resultIndex === active}
              onPick={() => { navigate(entry.path); onClose(); }}
              onHover={() => setActive(resultIndex)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SearchResultRow({ entry, active, onPick, onHover }: { entry: SearchEntry; active: boolean; onPick: () => void; onHover: () => void }) {
  return (
    <li>
      <button className={`search-result ${active ? "search-result-active" : ""}`} role="option" aria-selected={active} onClick={onPick} onMouseEnter={onHover}>
        <span className="search-result-title">{entry.title}</span>
        <span className="search-result-sub">{entry.subtitle}</span>
        {active && <CornerDownLeft size={13} />}
      </button>
    </li>
  );
}
