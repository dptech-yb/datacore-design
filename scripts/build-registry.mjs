#!/usr/bin/env node
/**
 * 把 registry/ 下的组件源码打成 shadcn 自定义 registry：public/r/<name>.json + public/r/registry.json。
 * 主站安装：npx shadcn@2.3.0 add https://design.datacore.dp.cd.mba/r/button.json
 * registryDependencies 里的短名会被展开成本站完整 URL，使 CLI 能递归拉取。
 * 同时校验：每个文件存在、组件之间依赖可解析、组件源码只用语义色（不出现 Tailwind 原色）。
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "registry");
const out = path.join(root, "public", "r");
const BASE = process.env.REGISTRY_BASE_URL || "https://design.datacore.dp.cd.mba/r";
const manifest = JSON.parse(readFileSync(path.join(src, "registry.json"), "utf8"));
const names = new Set(manifest.items.map((i) => i.name));
const RAW_COLOR = /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

const errors = [];
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const item of manifest.items) {
  const files = item.files.map((f) => {
    const p = path.join(src, f.path);
    if (!existsSync(p)) {
      errors.push(`${item.name}: 缺少文件 ${f.path}`);
      return f;
    }
    const content = readFileSync(p, "utf8");
    if (f.type === "registry:ui" && RAW_COLOR.test(content)) errors.push(`${item.name}: ${f.path} 使用了 Tailwind 原色，只能用语义令牌`);
    return { ...f, content };
  });
  for (const dep of item.registryDependencies ?? []) if (!names.has(dep)) errors.push(`${item.name}: 未知依赖 ${dep}`);
  const full = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    registryDependencies: (item.registryDependencies ?? []).map((d) => `${BASE}/${d}.json`),
    files,
  };
  writeFileSync(path.join(out, `${item.name}.json`), JSON.stringify(full, null, 2) + "\n");
}
writeFileSync(path.join(out, "registry.json"), JSON.stringify({ ...manifest, items: manifest.items.map(({ files, ...rest }) => ({ ...rest, files: files.map(({ path: p, type, target }) => ({ path: p, type, target })) })) }, null, 2) + "\n");

copyFileSync(path.join(root, "scripts", "dc-ui-add.mjs"), path.join(out, "add.mjs"));

if (errors.length) {
  console.error("registry 校验失败：\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`registry: ${manifest.items.length} 项 → public/r/`);
