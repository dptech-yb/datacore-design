#!/usr/bin/env node
/**
 * Generates the AI contract files from the catalog single source of truth:
 *   public/llms.txt               — short navigation for coding agents
 *   public/llms-full.txt          — full human/agent-readable design contract
 *   public/component-registry.json — machine-readable component index
 *
 * Also validates catalog completeness (see validateCatalog). Fails the build
 * on errors so pages and contract files can never drift apart.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, ".generated");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const bundle = path.join(outDir, "catalog.mjs");
execFileSync(
  path.join(root, "node_modules", ".bin", "esbuild"),
  ["src/catalog/index.ts", "--bundle", "--format=esm", "--platform=node", `--outfile=${bundle}`, "--log-level=warning"],
  { cwd: root, stdio: "inherit" },
);

const catalog = await import(pathToFileURL(bundle).href);
const {
  componentDocs,
  componentCategories,
  foundationDocs,
  patternDocs,
  templateDocs,
} = catalog;

const REQUIRED_STATES = [
  "default", "hover", "focus-visible", "pressed", "disabled", "loading",
  "empty", "error", "permission-limited", "mobile", "dark-mode",
];

function validateCatalog() {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  for (const doc of componentDocs) {
    if (ids.has(doc.id)) errors.push(`duplicate component id: ${doc.id}`);
    ids.add(doc.id);
  }
  for (const doc of componentDocs) {
    const at = `component ${doc.id}`;
    if (!componentCategories.some((c) => c.id === doc.category)) errors.push(`${at}: unknown category ${doc.category}`);
    if (!doc.purpose || !doc.usage) errors.push(`${at}: missing purpose/usage`);
    if (!doc.examples.some((e) => e.kind === "basic")) errors.push(`${at}: missing a basic example`);
    if (!doc.examples.some((e) => e.kind === "business")) errors.push(`${at}: missing a business example`);
    if (doc.props.length === 0) errors.push(`${at}: props must not be empty`);
    const stateNames = new Set(doc.states.map((s) => s.name));
    for (const required of REQUIRED_STATES) {
      if (!stateNames.has(required)) errors.push(`${at}: state "${required}" not answered (mark applicable:false if N/A)`);
    }
    for (const field of ["interaction", "keyboard", "accessibility", "responsive", "content", "dos", "donts"]) {
      if (!Array.isArray(doc[field]) || doc[field].length === 0) errors.push(`${at}: ${field} must not be empty`);
    }
    const exampleIds = new Set();
    for (const example of doc.examples) {
      if (exampleIds.has(example.id)) errors.push(`${at}: duplicate example id ${example.id}`);
      exampleIds.add(example.id);
      const expectedPrefix = `${doc.id}/`;
      if (!example.preview) warnings.push(`${at}: example ${example.id} has no preview`);
      else if (!example.preview.startsWith(expectedPrefix)) errors.push(`${at}: example ${example.id} preview "${example.preview}" should start with "${expectedPrefix}"`);
    }
    for (const rel of doc.related) {
      if (!ids.has(rel)) errors.push(`${at}: related id "${rel}" does not exist`);
    }
  }
  const articleGroups = [["foundation", foundationDocs], ["pattern", patternDocs], ["template", templateDocs]];
  const articleIds = new Set();
  const articlePathHeads = new Set(["foundations", "patterns", "templates"]);
  for (const [kind, docs] of articleGroups) {
    for (const doc of docs) {
      if (articleIds.has(doc.id)) errors.push(`duplicate article id: ${doc.id}`);
      articleIds.add(doc.id);
    }
  }
  for (const [kind, docs] of articleGroups) {
    for (const doc of docs) {
      if (doc.sections.length === 0) errors.push(`${kind} ${doc.id}: no sections`);
      for (const rel of doc.related) {
        const [head, id] = rel.split("/").filter(Boolean);
        const collection = head === "components" ? ids : articlePathHeads.has(head) ? articleIds : null;
        if (!collection) {
          errors.push(`${kind} ${doc.id}: related path "${rel}" must start with /components, /foundations, /patterns or /templates`);
          continue;
        }
        if (!collection.has(id)) errors.push(`${kind} ${doc.id}: related path "${rel}" does not resolve`);
      }
    }
  }
  return { errors, warnings };
}

const { errors, warnings } = validateCatalog();
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length > 0) {
  console.error(`\ncatalog validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

/* ---------------- component-registry.json ---------------- */
const registry = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  name: "DataCore Design",
  version: "0.1.0",
  generated: new Date().toISOString().slice(0, 10),
  purpose: "Machine-readable UI contracts for the DataCore main platform and AION-compatible surfaces. Synthetic examples only.",
  source: "Generated from src/catalog — do not edit by hand.",
  categories: componentCategories.map((c) => ({ id: c.id, name: c.name, chineseName: c.chineseName })),
  components: componentDocs.map((doc) => ({
    id: `dc.${doc.id}`,
    name: doc.name,
    chineseName: doc.chineseName,
    category: doc.category,
    status: doc.status,
    version: doc.version,
    purpose: doc.purpose,
    usage: doc.usage,
    states: doc.states.filter((s) => s.applicable !== false).map((s) => s.name),
    notApplicableStates: doc.states.filter((s) => s.applicable === false).map((s) => s.name),
    requiredProps: doc.props.filter((p) => p.required).map((p) => p.name),
    props: doc.props.map((p) => ({ name: p.name, type: p.type, default: p.default, required: Boolean(p.required) })),
    accessibility: doc.accessibility,
    keyboard: doc.keyboard,
    examples: doc.examples.map((e) => `${doc.id}/${e.id}`),
    page: `#/components/${doc.id}`,
    related: doc.related,
  })),
  patterns: patternDocs.map((doc) => ({ id: doc.id, name: doc.name, chineseName: doc.chineseName, summary: doc.summary, page: `#/patterns/${doc.id}` })),
  foundations: foundationDocs.map((doc) => ({ id: doc.id, name: doc.name, chineseName: doc.chineseName, summary: doc.summary, page: `#/foundations/${doc.id}` })),
  templates: templateDocs.map((doc) => ({ id: doc.id, name: doc.name, chineseName: doc.chineseName, summary: doc.summary, page: `#/templates/${doc.id}` })),
  artifact: {
    name: "DesignSculpture",
    category: "visual",
    purpose: "A modular visual form used only as a non-semantic homepage visual anchor.",
    poster: "models/modular-form.webp",
    model: "models/modular-form.glb",
    loadingRule: "Render the poster first; load the interactive model only after an explicit user action.",
    motionRule: "No automatic rotation; user controls the camera and can reset the view.",
  },
};

/* ---------------- llms.txt ---------------- */
const llmsTxt = `# DataCore Design

> Public design-system reference for the DataCore main platform. Synthetic examples only.

## Read first

- Full contract: \`llms-full.txt\`
- Machine-readable registry: \`component-registry.json\`
- Human site: \`https://design.datacore.dp.cd.mba/\`

## Product context

DataCore is a data-governance and intelligent-collaboration platform for projects, experiments, structured data, agent recommendations, execution systems, and auditable results. AION shares the same interaction principles.

## Non-negotiable interaction rules

1. Show context before action: resource, scope, current state, and next step.
2. Separate recommendation from execution. External side effects require explicit user confirmation.
3. Keep stable IDs for projects, tasks, runs, citations, and versions. Never infer relationships from display names alone.
4. Cover loading, empty, error, disabled, and permission states.
5. Use semantic HTML and visible keyboard focus. Errors must not rely on color alone.
6. In citations, render a stable citation ID at the fact and link it to a full source item; do not repeat a long source section in the answer body.
7. Frontend visibility is not authorization. The backend must enforce permissions again.

## Navigation

- Overview: \`#/\`
- Foundations: ${foundationDocs.map((d) => `\`#/foundations/${d.id}\``).join(", ")}
- Components (${componentDocs.length}): ${componentCategories.map((c) => `${c.chineseName}(${componentDocs.filter((d) => d.category === c.id).length})`).join(" / ")}
- Patterns: ${patternDocs.map((d) => `\`#/patterns/${d.id}\``).join(", ")}
- Templates: ${templateDocs.map((d) => `\`#/templates/${d.id}\``).join(", ")}

## Components

${componentDocs.map((d) => `- ${d.name} (${d.chineseName}, ${d.status}): ${d.purpose}`).join("\n")}

Use \`llms-full.txt\` for props, states, and implementation examples.
`;

/* ---------------- llms-full.txt ---------------- */
const section = (title) => `\n${"=".repeat(72)}\n${title}\n${"=".repeat(72)}\n`;
const bullet = (items) => items.map((item) => `  - ${item}`).join("\n");

const llmsFull = `# DataCore Design — full design contract
# Generated from src/catalog on ${registry.generated}. Do not edit by hand.
# Companion files: llms.txt (navigation), component-registry.json (machine-readable).
${section("1. DESIGN PRINCIPLES")}
1. 清晰 Clarity — information hierarchy first; users always know where they are and what they can do.
2. 确定 Certainty — important actions have explicit feedback; state, scope and result are never guessed.
3. 克制 Restraint — color and icons carry semantics only; no decorative color, no decorative icons.
4. 生长 Growth — stable rules with room for new business, devices, and AI-agent collaboration.

Non-negotiable rules:
  - Show context before action: resource, scope, current state, next step.
  - Separate recommendation from execution; external side effects require explicit confirmation.
  - Stable IDs for projects, tasks, runs, citations, versions. Never infer from display names.
  - Every component answers the full state set; mark N/A states explicitly.
  - Semantic HTML and visible keyboard focus; errors never rely on color alone.
  - Citations use a stable citation ID at the fact, linked to a full source item.
  - Frontend visibility is not authorization; the backend enforces permissions again.
${section("2. FOUNDATIONS")}
${foundationDocs.map((doc) => `## ${doc.name} ${doc.chineseName} (#/foundations/${doc.id})\n${doc.summary}\n${doc.sections.map((s) => `### ${s.heading}\n${s.body.join("\n")}${s.list ? `\n${bullet(s.list)}` : ""}`).join("\n")}`).join("\n\n")}
${section("3. COMPONENTS")}
${componentDocs.map((doc) => `## dc.${doc.id} — ${doc.name} ${doc.chineseName} [${doc.status}] v${doc.version} (#/components/${doc.id})
Category: ${doc.category}
Purpose: ${doc.purpose}
Usage: ${doc.usage}

Props:
${doc.props.map((p) => `  - ${p.name}${p.required ? " (required)" : ""}: ${p.type}${p.default ? ` = ${p.default}` : ""} — ${p.description}`).join("\n")}

States:
${doc.states.map((s) => `  - ${s.name}${s.applicable === false ? " [N/A]" : ""}: ${s.note}`).join("\n")}

Interaction rules:
${bullet(doc.interaction)}

Keyboard:
${bullet(doc.keyboard)}

Accessibility:
${bullet(doc.accessibility)}

Responsive:
${bullet(doc.responsive)}

Content guidelines:
${bullet(doc.content)}

Do:
${bullet(doc.dos)}

Don't:
${bullet(doc.donts)}

Examples:
${doc.examples.map((e) => `  --- ${e.id} (${e.kind}) ${e.title}\n${(e.fullCode ?? e.code).split("\n").map((l) => `  ${l}`).join("\n")}`).join("\n")}

Related: ${doc.related.join(", ")}
`).join("\n")}
${section("4. PATTERNS")}
${patternDocs.map((doc) => `## ${doc.name} ${doc.chineseName} (#/patterns/${doc.id})\n${doc.summary}\n${doc.sections.map((s) => `### ${s.heading}\n${s.body.join("\n")}${s.list ? `\n${bullet(s.list)}` : ""}`).join("\n")}`).join("\n\n")}
${section("5. PAGE TEMPLATES")}
${templateDocs.map((doc) => `## ${doc.name} ${doc.chineseName} (#/templates/${doc.id})\n${doc.summary}\n${doc.sections.map((s) => `### ${s.heading}\n${s.body.join("\n")}${s.list ? `\n${bullet(s.list)}` : ""}`).join("\n")}`).join("\n\n")}
${section("6. FORBIDDEN")}
  - No real user data, production URLs, credentials, or internal payloads in examples.
  - No decorative color or icons; no dark-background title icons as decoration.
  - Do not infer source or project relationships from display names; use stable IDs.
  - Do not hand-edit this file, llms.txt, or component-registry.json; change src/catalog and run npm run generate.
  - AI-generated pages still must pass typecheck, build, and a human interaction review.
`;

writeFileSync(path.join(root, "public", "component-registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
writeFileSync(path.join(root, "public", "llms.txt"), llmsTxt);
writeFileSync(path.join(root, "public", "llms-full.txt"), llmsFull);
rmSync(outDir, { recursive: true, force: true });

console.log(`generated: ${componentDocs.length} components, ${foundationDocs.length} foundations, ${patternDocs.length} patterns, ${templateDocs.length} templates`);
