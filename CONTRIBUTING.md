# Contributing

感谢你改进 DataCore Design。这个仓库优先维护设计语言和可复用组件契约，而不是复制某个产品页面。

## 提交前检查

```bash
npm run typecheck
npm run build
```

请说明：

- 这个变化解决的用户问题；
- 涉及哪些组件状态（正常、加载、空、错、禁用、权限）；
- 是否影响键盘、窄屏或暗色主题；
- 是否同步更新 `public/component-registry.json` 和 `public/llms-full.txt`。

示例数据必须是合成数据，不要提交生产 URL、凭据、用户信息或实验数据。
