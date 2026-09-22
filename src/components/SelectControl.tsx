import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
  hint?: string;
};
/** Accessible catalog reference: one selection model for mouse and keyboard. */
export function SelectControl({
  label,
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  allowCreate = false,
}: {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  allowCreate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const filtered = options.filter((o) =>
    `${o.label} ${o.hint ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );
  const choices =
    allowCreate &&
    query.trim() &&
    !options.some((o) => o.label === query.trim())
      ? [{ value: query.trim(), label: `创建：${query.trim()}` }, ...filtered]
      : filtered;
  const close = () => {
    setOpen(false);
    setQuery("");
    trigger.current?.focus();
  };
  const select = (option: Option) => {
    if (option.disabled) return;
    onChange(
      multiple
        ? value.includes(option.value)
          ? value.filter((v) => v !== option.value)
          : [...value, option.value]
        : [option.value],
    );
    if (!multiple) close();
  };
  useEffect(() => {
    if (!open) return;
    setActive(0);
    if (searchable) input.current?.focus();
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, searchable]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-option-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);
  const keys = (e: KeyboardEvent<HTMLElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (!choices.length) return;
      let next = active;
      for (let i = 0; i < choices.length; i++) {
        next =
          (next + (e.key === "ArrowDown" ? 1 : choices.length - 1)) %
          choices.length;
        if (!choices[next].disabled) break;
      }
      setActive(next);
    }
    if (open && e.key === "Enter" && choices[active]) {
      e.preventDefault();
      select(choices[active]);
    }
    if (
      open &&
      e.target === trigger.current &&
      (e.key === "Home" || e.key === "End")
    ) {
      e.preventDefault();
      const order = choices
        .map((o, i) => ({ o, i }))
        .filter((x) => !x.o.disabled);
      setActive(
        (e.key === "Home" ? order[0] : order[order.length - 1])?.i ?? 0,
      );
    }
  };
  return (
    <div
      className="select-control"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setQuery("");
        }
      }}
    >
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
        {label}
      </label>
      <button
        type="button"
        id={`${id}-trigger`}
        ref={trigger}
        className="select-trigger"
        role={searchable ? undefined : "combobox"}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-activedescendant={
          !searchable && open && choices[active]
            ? `${id}-option-${active}`
            : undefined
        }
        onClick={() => setOpen(!open)}
        onKeyDown={keys}
      >
        <span id={`${id}-value`}>
          {value.length
            ? value
                .map((v) => options.find((o) => o.value === v)?.label ?? v)
                .join("、")
            : "请选择…"}
        </span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="select-panel">
          {searchable && (
            <div className="select-search">
              <Search size={15} />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={keys}
                placeholder="搜索选项…"
                aria-label={`搜索${label}`}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls={`${id}-options`}
                aria-activedescendant={
                  choices[active] ? `${id}-option-${active}` : undefined
                }
              />
            </div>
          )}
          <ul
            role="listbox"
            id={`${id}-options`}
            aria-labelledby={`${id}-label`}
            aria-multiselectable={multiple || undefined}
          >
            {choices.map((option, i) => (
              <li
                role="option"
                id={`${id}-option-${i}`}
                key={option.value}
                aria-selected={value.includes(option.value)}
                aria-disabled={option.disabled || undefined}
                className={active === i ? "option-active" : ""}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => {
                  if (!option.disabled) setActive(i);
                }}
                onClick={() => select(option)}
              >
                <span>
                  {option.label}
                  {option.hint && <small>{option.hint}</small>}
                </span>
                {value.includes(option.value) && <Check size={15} />}
              </li>
            ))}
          </ul>
          {!choices.length && (
            <p className="select-empty" role="status">
              没有匹配的选项
            </p>
          )}
        </div>
      )}
      {multiple && value.length > 0 && (
        <button
          type="button"
          className="text-link select-clear"
          onClick={() => onChange([])}
        >
          清空选择
        </button>
      )}
    </div>
  );
}
