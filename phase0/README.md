# Phase 0 · 品牌定稿与关键页面样张

DataCore Design 全面优化的第 0 阶段产物（草案，待评审）。不影响现有文档站构建。

- 技术：shadcn/ui 写法（Radix 原语 + Tailwind 3 + cva），与 DataCore 主平台技术栈一致。
- 令牌：`src/tokens.css`（全局色阶 → 语义别名，浅/深两套）+ `tailwind.config.js`（preset 草案）。
- 样张：品牌与令牌、工作台、实验详情、数据工具流程（`#/brand` `#/workbench` `#/experiment` `#/tool`），右下角切换；`?theme=dark` 看深色。
- 所有数据均为合成示例。

```bash
cd phase0 && npm install && npm run dev
```

评审通过后：令牌与组件迁入 registry（阶段 1–2），本目录删除。
