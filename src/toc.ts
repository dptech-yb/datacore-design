import type { ComponentDoc, ArticleDoc, ExampleKind } from "./catalog/types";
export const EXAMPLE_GROUPS: {
  kind: ExampleKind;
  heading: string;
  anchor: string;
}[] = [
  { kind: "basic", heading: "基础示例", anchor: "examples-basic" },
  { kind: "variant", heading: "变体示例", anchor: "examples-variant" },
  { kind: "state", heading: "状态示例", anchor: "examples-state" },
  { kind: "size", heading: "尺寸示例", anchor: "examples-size" },
  { kind: "business", heading: "真实业务示例", anchor: "examples-business" },
];

export function componentToc(doc: ComponentDoc) {
  const toc = EXAMPLE_GROUPS.filter((group) =>
    doc.examples.some((example) => example.kind === group.kind),
  ).map((group) => ({ id: group.anchor, label: group.heading }));
  toc.push(
    { id: "api", label: "API / Props" },
    { id: "states", label: "状态契约" },
    { id: "interaction", label: "交互规则" },
    { id: "keyboard", label: "键盘行为" },
    { id: "accessibility", label: "无障碍" },
    { id: "responsive", label: "响应式" },
    { id: "content", label: "内容规范" },
    { id: "do-dont", label: "Do / Don't" },
    { id: "related", label: "相关组件" },
  );
  return toc;
}

export function articleToc(doc: ArticleDoc) {
  const toc = doc.sections.map((section) => ({
    id: section.id,
    label: section.heading,
  }));
  if (doc.related.length > 0) toc.push({ id: "related", label: "相关内容" });
  return toc;
}
