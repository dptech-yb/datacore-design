/**
 * DataCore Design catalog data model.
 *
 * These files are the single source of truth for the site navigation, the
 * component detail pages, the search index and the generated AI contract
 * files (`public/llms.txt`, `public/llms-full.txt`,
 * `public/component-registry.json`).
 *
 * Data files must stay runtime-import free: only `import type` is allowed so
 * the generator can compile and import them in plain Node.
 */

export type DocStatus = "stable" | "beta" | "experimental";

export type ExampleKind = "basic" | "variant" | "state" | "size" | "business";

export interface ExampleDoc {
  /** Unique within the component, kebab-case. */
  id: string;
  title: string;
  kind: ExampleKind;
  description?: string;
  /** Minimal representative JSX snippet, copyable. */
  code: string;
  /** Complete snippet when the minimal one hides required context. */
  fullCode?: string;
  /** Preview registry key: "<component-id>/<example-id>". */
  preview: string;
}

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

/** Canonical state checklist every component must answer. */
export const REQUIRED_STATES = [
  "default",
  "hover",
  "focus-visible",
  "pressed",
  "disabled",
  "loading",
  "empty",
  "error",
  "permission-limited",
  "mobile",
  "dark-mode",
] as const;

export interface StateDoc {
  /** Prefer names from REQUIRED_STATES; extra states are allowed. */
  name: string;
  /** The rule for this state, or why it does not apply. */
  note: string;
  /** false means "documented as not applicable". Defaults to true. */
  applicable?: boolean;
}

export interface ComponentDoc {
  /** Stable kebab-case id used in URLs and the registry, e.g. "citation". */
  id: string;
  /** English component name, e.g. "Citation". */
  name: string;
  chineseName: string;
  /** Category id from catalog/categories.ts. */
  category: string;
  status: DocStatus;
  version: string;
  /** One-sentence purpose. */
  purpose: string;
  /** When to use / when not to use. */
  usage: string;
  keywords?: string[];
  examples: ExampleDoc[];
  props: PropDoc[];
  states: StateDoc[];
  /** 交互规则 */
  interaction: string[];
  /** 键盘行为 */
  keyboard: string[];
  /** 无障碍要求 */
  accessibility: string[];
  /** 响应式行为 */
  responsive: string[];
  /** 内容规范（文案规则） */
  content: string[];
  dos: string[];
  donts: string[];
  /** Related component ids. */
  related: string[];
}

export interface CategoryDoc {
  id: string;
  name: string;
  chineseName: string;
  description: string;
}

export interface SectionDoc {
  /** Anchor id, unique within the article. */
  id: string;
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  list?: string[];
  code?: string;
  codeTitle?: string;
  /** Optional preview registry key: "<article-id>/<section-id>". */
  preview?: string;
}

/** Article-style doc used by foundations, patterns and templates. */
export interface ArticleDoc {
  id: string;
  name: string;
  chineseName: string;
  status: DocStatus;
  summary: string;
  keywords?: string[];
  sections: SectionDoc[];
  /** Related route paths, e.g. "/components/button" or "/patterns/agent-confirmation". */
  related: string[];
}
