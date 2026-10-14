#!/usr/bin/env node
/**
 * DataCore UI 安装脚本（shadcn CLI 的离线替代，读同一套 registry JSON）。
 *   node dc-ui-add.mjs <registry 根 URL 或本地目录> <组件名...> [--cwd 目标项目] [--force]
 * 例：node dc-ui-add.mjs https://design.datacore.dp.cd.mba/r button select --cwd ./frontend
 * 递归解析 registryDependencies，写入文件，最后打印需要 npm install 的依赖。
 * 默认不覆盖已存在的文件（升级时加 --force，再用 git diff 审改动）。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const force = args.includes("--force"); if (force) args.splice(args.indexOf("--force"), 1);
const cwd = path.resolve(flag("--cwd") ?? ".");
const [base, ...names] = args;
if (!base || !names.length) { console.error("用法: dc-ui-add.mjs <registry 根> <组件名...> [--cwd 目录] [--force]"); process.exit(1); }

async function load(ref) {
  const url = /^https?:/.test(ref) ? ref : /^https?:/.test(base) ? `${base.replace(/\/$/, "")}/${ref}.json` : path.join(base, `${ref}.json`);
  if (/^https?:/.test(url)) { const r = await fetch(url); if (!r.ok) throw new Error(`${url} → ${r.status}`); return r.json(); }
  return JSON.parse(readFileSync(url, "utf8"));
}

const TARGET = { "registry:ui": (p) => `src/components/ui/${path.basename(p)}`, "registry:lib": (p) => `src/lib/${path.basename(p)}` };
const seen = new Set(), deps = new Set(), written = [], skipped = [];
async function add(ref) {
  const item = await load(ref);
  if (seen.has(item.name)) return; seen.add(item.name);
  for (const d of item.registryDependencies ?? []) await add(d);
  for (const d of item.dependencies ?? []) deps.add(d);
  for (const f of item.files) {
    const rel = f.target ?? TARGET[f.type]?.(f.path) ?? f.path;
    const dest = path.join(cwd, rel);
    if (existsSync(dest) && !force) { skipped.push(rel); continue; }
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, f.content);
    written.push(rel);
  }
}
for (const n of names) await add(n);
console.log(written.length ? `写入：\n  ${written.join("\n  ")}` : "没有写入新文件");
if (skipped.length) console.log(`已存在、未覆盖（升级请加 --force）：\n  ${skipped.join("\n  ")}`);
if (deps.size) console.log(`\n请安装依赖：\n  npm install ${[...deps].join(" ")}`);
