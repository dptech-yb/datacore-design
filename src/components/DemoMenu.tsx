import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type MenuAction = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  reason?: string;
  danger?: boolean;
};
/** Shared demo menu: outside dismissal and roving focus stay in one place. */
export function DemoMenu({
  label = "更多操作",
  actions,
}: {
  label?: string;
  actions: MenuAction[];
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = (restore = false) => {
    setOpen(false);
    if (restore) trigger.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
      ?.focus();
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      className="demo-menu"
      ref={root}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="button button-secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          role="menu"
          id={id}
          aria-label={label}
          className="demo-menu-panel"
          onKeyDown={(e) => {
            const items = Array.from(
              e.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="menuitem"]:not(:disabled)',
              ),
            );
            const current = items.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const next =
              e.key === "ArrowDown"
                ? (current + 1) % items.length
                : e.key === "ArrowUp"
                  ? (current + items.length - 1) % items.length
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? items.length - 1
                      : -1;
            if (next >= 0) {
              e.preventDefault();
              items[next]?.focus();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              close(true);
            }
          }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              role="menuitem"
              tabIndex={-1}
              disabled={action.disabled}
              title={action.reason}
              className={action.danger ? "menu-danger" : ""}
              onClick={() => {
                close(true);
                action.onSelect();
              }}
            >
              {action.label}
              {action.disabled && <span>{action.reason}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
