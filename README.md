# DataCore Design

DataCore 主平台的开源设计规范、交互模式和 AI 可读组件契约。

> 这是一个独立的文档与示例站，不包含 DataCore 业务源码、生产数据、用户凭据或内部接口。AION 与主平台共享这套原则，但各自的业务页面仍由对应产品仓库实现。

## 在线站点

- GitHub Pages: <https://design.datacore.dp.cd.mba/>
- AI 导航：[`public/llms.txt`](./public/llms.txt)
- 完整契约：[`public/llms-full.txt`](./public/llms-full.txt)
- 组件注册表：[`public/component-registry.json`](./public/component-registry.json)
- 模块化视觉研究源文件：[`art/blender/modular-form.blend`](./art/blender/modular-form.blend)

## 本地开发

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

站点使用 hash 路由，直接部署到 GitHub Pages 的项目路径也能保持刷新和深链接可用。

## 设计语言

1. 清晰：让信息有层次，让用户知道自己在哪里、可以做什么。
2. 确定：重要动作有明确反馈，状态、范围和结果都不让人猜。
3. 克制：只在需要的地方出现提示和动作，把注意力留给当下的任务。
4. 生长：规则足够稳定，也为不同业务、设备和新的协作方式保留空间。

这些原则借鉴了公开设计体系对自然、确定性、模块化、包容与连接的讨论，但内容和组件契约由 DataCore 团队独立整理。参考资料见 [`docs/inspiration.md`](./docs/inspiration.md)。

首页的模块化雕塑用于把设计语言变成可感知的视觉锚点：首屏先展示轻量静态海报，用户主动选择后才加载可拖拽旋转的 GLB；不自动旋转，也不让视觉模型承担必要信息。

## 贡献

新增组件前，请先说明它解决的业务问题、状态集合和权限边界，并同步更新 `public/component-registry.json` 与 `public/llms-full.txt`。示例数据必须是合成数据。

本项目采用 MIT License。
