/**
 * DataCore Tailwind preset。
 * 语义令牌全部来自 CSS 变量（src/styles/datacore-tokens.css），浅/深两套；组件只用语义名，不用原色。
 */
import animate from "tailwindcss-animate";

const v = (name) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", '"PingFang SC"', '"Noto Sans SC"', '"Microsoft YaHei"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "Menlo", "monospace"],
      },
      fontSize: {
        // 产品界面基准 14px；说明文字 12px；标题按 1.25 级差
        xs: ["12px", "18px"], sm: ["13px", "20px"], base: ["14px", "22px"], md: ["16px", "24px"],
        lg: ["18px", "26px"], xl: ["20px", "28px"], "2xl": ["24px", "32px"], "3xl": ["30px", "38px"],
      },
      colors: {
        border: v("border"), input: v("input"), ring: v("ring"),
        background: v("background"), foreground: v("foreground"),
        canvas: v("canvas"),
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground"), soft: v("primary-soft"), hover: v("primary-hover") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        subtle: v("subtle"),
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        success: { DEFAULT: v("success"), soft: v("success-soft") },
        warning: { DEFAULT: v("warning"), soft: v("warning-soft") },
        danger: { DEFAULT: v("danger"), soft: v("danger-soft"), foreground: v("primary-foreground") },
        // shadcn 组件使用 destructive，与 danger 同义
        destructive: { DEFAULT: v("danger"), foreground: v("primary-foreground") },
        agent: { DEFAULT: v("agent"), soft: v("agent-soft") },
        chart: { 1: v("chart-1"), 2: v("chart-2"), 3: v("chart-3"), 4: v("chart-4"), 5: v("chart-5"), 6: v("chart-6") },
      },
      borderRadius: { sm: "4px", DEFAULT: "6px", md: "6px", lg: "8px", xl: "12px" },
      boxShadow: {
        xs: "0 1px 2px hsl(var(--shadow) / 0.06)",
        sm: "0 1px 2px hsl(var(--shadow) / 0.06), 0 1px 3px hsl(var(--shadow) / 0.08)",
        md: "0 4px 12px hsl(var(--shadow) / 0.10)",
        lg: "0 12px 32px hsl(var(--shadow) / 0.14)",
      },
      transitionTimingFunction: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
      transitionDuration: { fast: "120ms", base: "180ms" },
    },
  },
  plugins: [animate],
};
