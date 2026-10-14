import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildSearchIndex } from "../catalog";
import { navigate } from "../router";
import { Modal } from "./Modal";

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildSearchIndex, []);
  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    // 标题命中排在说明/关键词命中之前
    const score = (entry: (typeof index)[number]) =>
      terms.reduce((sum, term) => sum + (entry.title.toLowerCase().includes(term) ? 2 : 0), 0);
    return index
      .filter((entry) =>
        terms.every((term) =>
          `${entry.title} ${entry.subtitle} ${entry.keywords}`
            .toLowerCase()
            .includes(term),
        ),
      )
      .sort((a, b) => score(b) - score(a))
      .slice(0, terms.length ? 20 : 8);
  }, [index, query]);
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    document
      .getElementById(`search-option-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);
  const choose = (path: string) => {
    navigate(path);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      label="全局搜索"
      className="search-dialog"
    >
      <div className="search-modal">
        <div className="search-input-row">
          <Search size={20} />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="搜索组件、模式或页面…"
            aria-label="搜索组件、模式或页面"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? `search-option-${active}` : undefined
            }
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                if (results.length)
                  setActive(
                    (v) =>
                      (v + (e.key === "ArrowDown" ? 1 : results.length - 1)) %
                      results.length,
                  );
              }
              if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                choose(results[active].path);
              }
            }}
          />
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="关闭搜索"
          >
            <X size={18} />
          </button>
        </div>
        <ul
          className="search-results"
          id="search-results"
          role="listbox"
          aria-label="搜索结果"
        >
          {results.length === 0 && (
            <li className="search-empty" role="presentation">
              没有匹配结果，试试组件英文名或中文关键词。
            </li>
          )}
          {results.map((entry, i) => (
            <li
              key={entry.path}
              id={`search-option-${i}`}
              role="option"
              aria-selected={active === i}
              className={`search-result ${active === i ? "search-result-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(entry.path)}
            >
              <span className="search-result-main">
                <span className="search-result-title">{highlight(entry.title, query)}</span>
                {entry.description && <span className="search-result-desc">{entry.description}</span>}
              </span>
              <span className="search-result-sub">{entry.subtitle}</span>
              {active === i && <CornerDownLeft size={14} />}
            </li>
          ))}
        </ul>
        <div className="search-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> 选择　<kbd>↵</kbd> 打开
          </span>
          <span>
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
        <span className="sr-only" role="status">
          {results.length} 条结果
        </span>
      </div>
    </Modal>
  );
}

function highlight(text: string, query: string) {
  const term = query.trim().split(/\s+/)[0];
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}
