// Tree 树：缩进层级展示父子数据，支持展开收起、单选、三态复选与完整键盘导航（role="tree"）。
import * as React from "react";
import { Check, ChevronRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TreeNode {
  /** 稳定唯一 ID。 */
  id: string;
  /** 节点标题。 */
  label: React.ReactNode;
  /** 标题前的类型图标。 */
  icon?: React.ReactNode;
  /** 右侧次级信息（数量、行数、“无权限”）。 */
  meta?: React.ReactNode;
  children?: TreeNode[];
  /** 禁用：可聚焦但不可选中 / 勾选。 */
  disabled?: boolean;
}

type CheckState = boolean | "indeterminate";

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

/** 收集节点下所有可勾选的叶子 ID（无子级的节点即叶子）。 */
function leafIds(node: TreeNode): string[] {
  if (!node.children?.length) return node.disabled ? [] : [node.id];
  return node.children.flatMap(leafIds);
}

function checkState(node: TreeNode, checked: Set<string>): CheckState {
  if (!node.children?.length) return checked.has(node.id);
  const leaves = leafIds(node);
  if (!leaves.length) return false;
  const count = leaves.filter((id) => checked.has(id)).length;
  return count === 0 ? false : count === leaves.length ? true : "indeterminate";
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
}

function flattenVisible(nodes: TreeNode[], expanded: Set<string>, level = 1, parentId: string | null = null, out: FlatNode[] = []) {
  for (const node of nodes) {
    out.push({ node, level, parentId });
    if (node.children?.length && expanded.has(node.id)) flattenVisible(node.children, expanded, level + 1, node.id, out);
  }
  return out;
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect" | "defaultChecked"> {
  data: TreeNode[];
  /** 受控展开的节点 ID。 */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** 受控选中节点（单选）。 */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string, node: TreeNode) => void;
  /** 显示三态复选框；checked 只记录叶子 ID，父级状态由子级推导。 */
  checkable?: boolean;
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (leafIds: string[]) => void;
}

const Tree = React.forwardRef<HTMLUListElement, TreeProps>(
  (
    {
      data,
      expanded: expandedProp,
      defaultExpanded = [],
      onExpandedChange,
      selected: selectedProp,
      defaultSelected = null,
      onSelectedChange,
      checkable = false,
      checked: checkedProp,
      defaultChecked = [],
      onCheckedChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedList, setExpandedList] = useControllable(expandedProp, defaultExpanded, onExpandedChange);
    const [selectedId, setSelectedRaw] = useControllable<string | null>(selectedProp, defaultSelected);
    const [checkedList, setCheckedList] = useControllable(checkedProp, defaultChecked, onCheckedChange);
    const expanded = React.useMemo(() => new Set(expandedList), [expandedList]);
    const checked = React.useMemo(() => new Set(checkedList), [checkedList]);
    const visible = React.useMemo(() => flattenVisible(data, expanded), [data, expanded]);
    const [focusedId, setFocusedId] = React.useState<string | null>(null);
    const itemRefs = React.useRef(new Map<string, HTMLLIElement>());

    // 可 Tab 到达的节点：当前焦点 > 选中项 > 第一个可见节点（roving tabindex）
    const tabStop =
      (focusedId && visible.some((v) => v.node.id === focusedId) && focusedId) ||
      (selectedId && visible.some((v) => v.node.id === selectedId) && selectedId) ||
      visible[0]?.node.id;

    const focusNode = (id: string | undefined) => {
      if (!id) return;
      setFocusedId(id);
      itemRefs.current.get(id)?.focus();
    };

    const toggleExpand = (id: string, open?: boolean) => {
      const isOpen = expanded.has(id);
      const next = open ?? !isOpen;
      if (next === isOpen) return;
      setExpandedList(next ? [...expandedList, id] : expandedList.filter((k) => k !== id));
    };

    const select = (node: TreeNode) => {
      if (node.disabled) return;
      setSelectedRaw(node.id);
      onSelectedChange?.(node.id, node);
    };

    const toggleCheck = (node: TreeNode) => {
      if (node.disabled) return;
      const leaves = leafIds(node);
      const state = checkState(node, checked);
      const next = new Set(checked);
      leaves.forEach((id) => (state === true ? next.delete(id) : next.add(id)));
      setCheckedList([...next]);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, flat: FlatNode) => {
      const { node } = flat;
      const index = visible.findIndex((v) => v.node.id === node.id);
      const hasChildren = !!node.children?.length;
      let handled = true;
      switch (event.key) {
        case "ArrowDown":
          focusNode(visible[index + 1]?.node.id);
          break;
        case "ArrowUp":
          focusNode(visible[index - 1]?.node.id);
          break;
        case "ArrowRight":
          if (hasChildren && !expanded.has(node.id)) toggleExpand(node.id, true);
          else if (hasChildren) focusNode(visible[index + 1]?.node.id);
          break;
        case "ArrowLeft":
          if (hasChildren && expanded.has(node.id)) toggleExpand(node.id, false);
          else if (flat.parentId) focusNode(flat.parentId);
          break;
        case "Home":
          focusNode(visible[0]?.node.id);
          break;
        case "End":
          focusNode(visible[visible.length - 1]?.node.id);
          break;
        case "Enter":
          select(node);
          break;
        case " ":
          if (checkable) toggleCheck(node);
          else select(node);
          break;
        default:
          handled = false;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const renderNodes = (nodes: TreeNode[], level: number, parentId: string | null): React.ReactNode =>
      nodes.map((node, i) => {
        const hasChildren = !!node.children?.length;
        const isOpen = hasChildren && expanded.has(node.id);
        const isSelected = selectedId === node.id;
        const state = checkable ? checkState(node, checked) : undefined;
        const flat: FlatNode = { node, level, parentId };
        return (
          <li
            key={node.id}
            ref={(el) => {
              if (el) itemRefs.current.set(node.id, el);
              else itemRefs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level}
            aria-setsize={nodes.length}
            aria-posinset={i + 1}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={checkable ? undefined : isSelected}
            aria-checked={state === undefined ? undefined : state === "indeterminate" ? "mixed" : state}
            aria-disabled={node.disabled || undefined}
            tabIndex={tabStop === node.id ? 0 : -1}
            onFocus={(event) => {
              if (event.target === event.currentTarget) setFocusedId(node.id);
            }}
            onKeyDown={(event) => onKeyDown(event, flat)}
            className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-inset [&:focus-visible>div]:ring-ring"
          >
            <div
              className={cn(
                "flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md pr-2 text-base text-foreground transition-colors duration-fast hover:bg-accent",
                isSelected && !checkable && "bg-primary-soft font-medium text-primary hover:bg-primary-soft",
                node.disabled && "cursor-not-allowed text-muted-foreground hover:bg-transparent",
              )}
              style={{ paddingLeft: (level - 1) * 16 + 4 }}
              onClick={(event) => {
                event.stopPropagation();
                focusNode(node.id);
                if (checkable) toggleCheck(node);
                else select(node);
              }}
            >
              {hasChildren ? (
                <span
                  aria-hidden
                  className="flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-secondary"
                  onClick={(event) => {
                    event.stopPropagation();
                    focusNode(node.id);
                    toggleExpand(node.id);
                  }}
                >
                  <ChevronRight className={cn("size-3.5 transition-transform duration-base", isOpen && "rotate-90")} />
                </span>
              ) : (
                <span aria-hidden className="size-4 shrink-0" />
              )}
              {checkable && (
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground",
                    state !== false && "border-primary bg-primary",
                    node.disabled && "opacity-50",
                  )}
                >
                  {state === true && <Check className="size-3" strokeWidth={3} />}
                  {state === "indeterminate" && <Minus className="size-3" strokeWidth={3} />}
                </span>
              )}
              {node.icon && <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-4">{node.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{node.label}</span>
              {node.meta && <span className="shrink-0 font-mono text-xs text-muted-foreground">{node.meta}</span>}
            </div>
            {isOpen && (
              <ul role="group" className="m-0 list-none p-0">
                {renderNodes(node.children!, level + 1, node.id)}
              </ul>
            )}
          </li>
        );
      });

    return (
      <ul ref={ref} role="tree" aria-multiselectable={checkable || undefined} className={cn("m-0 grid list-none gap-px p-0", className)} {...props}>
        {renderNodes(data, 1, null)}
      </ul>
    );
  },
);
Tree.displayName = "Tree";

export { Tree };
