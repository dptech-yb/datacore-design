# 设计参考与取舍

这不是对任何品牌设计的复刻，而是记录我们为什么选择当前的表达方式，方便后续讨论和 AI 参与修改。

## 参考的公开资料

- [Ant Design · 设计价值观](https://ant.design/docs/spec/values-cn/)：自然、确定性、意义感、生长性；强调克制、面向对象和模块化。
- [Ant Design · Layout](https://ant.design/docs/spec/layout/)：统一画布、适配、栅格和通用尺度。
- [TDesign · 价值观](https://static.tdesign.tencent.com/design/values)：包容、多元、进化、连接。
- [Tencent ISUX · Q 语言](https://isux.tencent.com/articles/qdesign)：亲和自然、活力灵动、低门槛和轻量的交互表达。
- [Tencent ISUX · QQ 8.0 有生机的设计](https://isux.tencent.com/articles/qq8.html)：有序、精致、8px 软栅格和减少界面噪声。

## DataCore 的转译

DataCore 面向的是实验数据和协作流程，因此把这些参考转译为四个更贴近工作场景的判断标准：

1. **清晰**：优先表达上下文、层级和下一步，减少视觉噪声。
2. **确定**：关键状态、影响范围和执行结果都能被确认和追溯。
3. **克制**：不为装饰增加动作、颜色和文案；把复杂性藏在有边界的组件里。
4. **生长**：基础令牌和 API 稳定，但为不同终端、业务和 AI 协作保留扩展点。

因此站点首屏强调设计语言，而不是产品宣传；组件页则强调可操作的状态、边界和实现契约。
