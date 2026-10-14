import preset from "./registry/tailwind.preset.js";

/**
 * 文档站的 Tailwind：只服务于组件源里的真组件与示例。
 * 关闭 preflight，避免重置站点原有样式；组件需要的最小基础样式见 src/tailwind.css。
 */
export default {
  presets: [preset],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./registry/ui/**/*.tsx"],
  corePlugins: { preflight: false },
};
