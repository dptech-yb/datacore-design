import { componentCategories } from "./categories";
import { generalComponents } from "./components/general";
import { layoutNavComponents } from "./components/layout-nav";
import { entryComponents } from "./components/entry";
import { displayComponents } from "./components/display";
import { datacoreComponents } from "./components/datacore";
import { foundationDocs } from "./foundations";
import { patternDocs } from "./patterns";
import { templateDocs } from "./templates";
import type { ArticleDoc, ComponentDoc } from "./types";

export const componentDocs: ComponentDoc[] = [
  ...generalComponents,
  ...layoutNavComponents,
  ...entryComponents,
  ...displayComponents,
  ...datacoreComponents,
];

export { componentCategories, foundationDocs, patternDocs, templateDocs };

export type DocKind = "component" | "foundation" | "pattern" | "template";

export function getComponent(id: string): ComponentDoc | undefined {
  return componentDocs.find((doc) => doc.id === id);
}

export function getArticle(kind: Exclude<DocKind, "component">, id: string): ArticleDoc | undefined {
  const list = kind === "foundation" ? foundationDocs : kind === "pattern" ? patternDocs : templateDocs;
  return list.find((doc) => doc.id === id);
}

export function categoryOf(id: string) {
  return componentCategories.find((category) => category.id === id);
}

export interface SearchEntry {
  title: string;
  subtitle: string;
  path: string;
  kind: DocKind | "page";
  keywords: string;
}

const staticPages: SearchEntry[] = [
  { title: "总览", subtitle: "Overview", path: "/", kind: "page", keywords: "overview home 首页 总览" },
  { title: "开始使用", subtitle: "Getting started", path: "/start", kind: "page", keywords: "start getting started 开始 使用 上手" },
  { title: "设计原则", subtitle: "Principles", path: "/principles", kind: "page", keywords: "principles 原则 清晰 确定 克制 生长" },
  { title: "组件注册表", subtitle: "component-registry.json", path: "/ai/registry", kind: "page", keywords: "registry json 注册表 ai 契约" },
  { title: "llms.txt", subtitle: "AI 导航文件", path: "/ai/llms", kind: "page", keywords: "llms txt ai 导航" },
  { title: "命名规范", subtitle: "Naming", path: "/ai/naming", kind: "page", keywords: "naming 命名 规范 id" },
  { title: "可访问性", subtitle: "Accessibility", path: "/ai/accessibility", kind: "page", keywords: "accessibility a11y 无障碍 可访问性" },
  { title: "贡献指南", subtitle: "Contributing", path: "/ai/contributing", kind: "page", keywords: "contributing 贡献 指南" },
];

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [...staticPages];
  for (const doc of componentDocs) {
    const category = categoryOf(doc.category);
    entries.push({
      title: `${doc.name} ${doc.chineseName}`,
      subtitle: `组件 / ${category?.chineseName ?? doc.category}`,
      path: `/components/${doc.id}`,
      kind: "component",
      keywords: [doc.id, doc.name, doc.chineseName, doc.purpose, ...(doc.keywords ?? [])].join(" "),
    });
  }
  const articleKinds: [Exclude<DocKind, "component">, ArticleDoc[], string][] = [
    ["foundation", foundationDocs, "基础"],
    ["pattern", patternDocs, "业务模式"],
    ["template", templateDocs, "页面模板"],
  ];
  for (const [kind, docs, label] of articleKinds) {
    for (const doc of docs) {
      entries.push({
        title: `${doc.name} ${doc.chineseName}`,
        subtitle: label,
        path: `/${kind === "foundation" ? "foundations" : kind === "pattern" ? "patterns" : "templates"}/${doc.id}`,
        kind,
        keywords: [doc.id, doc.name, doc.chineseName, doc.summary, ...(doc.keywords ?? [])].join(" "),
      });
    }
  }
  return entries;
}

export interface NavItem {
  label: string;
  path: string;
  status?: ComponentDoc["status"];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

export function buildNavModel(): NavGroup[] {
  const groups: NavGroup[] = [
    {
      id: "start",
      label: "开始",
      items: [
        { label: "总览", path: "/" },
        { label: "开始使用", path: "/start" },
        { label: "设计原则", path: "/principles" },
      ],
    },
    {
      id: "foundations",
      label: "基础 Foundations",
      items: foundationDocs.map((doc) => ({
        label: doc.chineseName,
        path: `/foundations/${doc.id}`,
        status: doc.status,
      })),
    },
  ];
  for (const category of componentCategories) {
    const docs = componentDocs.filter((doc) => doc.category === category.id);
    if (docs.length === 0) continue;
    groups.push({
      id: `components-${category.id}`,
      label: `${category.chineseName} · ${docs.length}`,
      items: docs.map((doc) => ({
        label: `${doc.name} ${doc.chineseName}`,
        path: `/components/${doc.id}`,
        status: doc.status,
      })),
      collapsible: true,
    });
  }
  groups.push(
    {
      id: "patterns",
      label: "业务模式 Patterns",
      items: patternDocs.map((doc) => ({
        label: doc.chineseName,
        path: `/patterns/${doc.id}`,
        status: doc.status,
      })),
    },
    {
      id: "templates",
      label: "页面模板 Templates",
      items: templateDocs.map((doc) => ({
        label: doc.chineseName,
        path: `/templates/${doc.id}`,
        status: doc.status,
      })),
    },
    {
      id: "ai",
      label: "AI 与工程",
      items: [
        { label: "组件注册表", path: "/ai/registry" },
        { label: "llms.txt", path: "/ai/llms" },
        { label: "命名规范", path: "/ai/naming" },
        { label: "可访问性", path: "/ai/accessibility" },
        { label: "贡献指南", path: "/ai/contributing" },
      ],
    },
  );
  return groups;
}
