import type { CategoryDoc } from "./types";

export const componentCategories: CategoryDoc[] = [
  {
    id: "general",
    name: "General",
    chineseName: "通用",
    description: "按钮、文字、标签、卡片等使用频率最高的基础组件。",
  },
  {
    id: "layout",
    name: "Layout",
    chineseName: "布局",
    description: "页面骨架、间距与栅格，决定信息如何分区。",
  },
  {
    id: "navigation",
    name: "Navigation",
    chineseName: "导航",
    description: "让用户知道自己在哪里、能去哪里的组件。",
  },
  {
    id: "entry",
    name: "Data Entry",
    chineseName: "数据录入",
    description: "输入、选择、上传与表单校验。",
  },
  {
    id: "display",
    name: "Data Display",
    chineseName: "数据展示",
    description: "表格、描述列表、统计、时间线与代码数据展示。",
  },
  {
    id: "feedback",
    name: "Feedback",
    chineseName: "反馈",
    description: "状态、进度、结果与全局提示。",
  },
  {
    id: "overlay",
    name: "Overlay",
    chineseName: "覆盖层",
    description: "对话框、抽屉与气泡确认。",
  },
  {
    id: "datacore",
    name: "DataCore",
    chineseName: "DataCore 专属",
    description: "引用、Agent 活动、确认面板、运行状态等平台差异化组件。",
  },
];
