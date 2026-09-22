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
    return index
      .filter((entry) =>
        terms.every((term) =>
          `${entry.title} ${entry.subtitle} ${entry.keywords}`
            .toLowerCase()
            .includes(term),
        ),
      )
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
              <span className="search-result-title">{entry.title}</span>
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
