import { AlertTriangle, Bot, CheckCircle2, Database, Download, FlaskConical, Plus, Search, XCircle } from "lucide-react";
import { useState } from "react";
import type { PreviewFn } from "./types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SEMANTIC = [
  ["primary", "Primary / 动作、链接、选中"],
  ["success", "Success / 完成、通过"],
  ["warning", "Warning / 待确认、需处理"],
  ["danger", "Danger / 失败、阻断、删除"],
  ["agent", "Agent / AI 产出与建议"],
] as const;
const SCALE = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

/** 直接读取组件源令牌（registry/styles/tokens.css），与组件用的是同一份值。 */
function ColorSemantic() {
  return (
    <div className="grid w-full gap-5">
      <div className="grid gap-2">
        {SEMANTIC.map(([key, label]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="size-8 rounded-md" style={{ background: `hsl(var(--${key}))` }} />
            <span className="size-8 rounded-md border" style={{ background: `hsl(var(--${key}-soft))` }} />
            <code className="w-20 font-mono text-sm text-foreground">{key}</code>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-1.5 text-xs text-muted-foreground">DataCore Blue 色阶（600 = 主色 #2563EB）</div>
        <div className="grid grid-cols-10 gap-1">
          {SCALE.map((k) => (
            <div key={k} className="grid gap-1">
              <span className="h-8 rounded" style={{ background: `hsl(var(--blue-${k}))` }} />
              <span className={`text-center text-[11px] ${k === "600" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{k}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-xs text-muted-foreground">图表分类色（只用于数据分组，不表达好坏）</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => <span key={i} className="h-6 flex-1 rounded" style={{ background: `hsl(var(--chart-${i}))` }} />)}
        </div>
      </div>
    </div>
  );
}

function TypographyHierarchy() {
  const rows = [
    ["text-3xl font-semibold", "30 / 38 · 页面大标题", "电解液配方优化"],
    ["text-2xl font-semibold", "24 / 32 · 页标题", "低温电解液"],
    ["text-xl font-semibold", "20 / 28 · 详情标题", "LiFSI 浓度梯度"],
    ["text-md font-semibold", "16 / 24 · 卡片标题", "容量保持率"],
    ["text-base", "14 / 22 · 正文（产品基准）", "按电解液自动分组，导出对比图。"],
    ["text-sm text-muted-foreground", "13 / 20 · 辅助", "6 颗 · 1 颗异常"],
    ["text-xs text-muted-foreground", "12 / 18 · 注释", "更新于 12 分钟前"],
  ];
  return (
    <div className="grid w-full gap-2.5">
      {rows.map(([cls, meta, sample]) => (
        <div key={meta} className="flex items-baseline gap-4">
          <span className="w-44 shrink-0 text-xs text-subtle">{meta}</span>
          <span className={`${cls} text-foreground`}>{sample}</span>
        </div>
      ))}
    </div>
  );
}

function TypographyNumbers() {
  const rows = [
    { run: "run-28003", ds: "ds-118", cond: "9.84", round: "3" },
    { run: "run-28004", ds: "ds-118", cond: "10.12", round: "4" },
    { run: "run-28005", ds: "ds-207", cond: "8.76", round: "5" },
  ];
  return (
    <div className="demo-stack">
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>任务 ID</th><th>数据集</th><th className="num">电导率 (mS/cm)</th><th className="num">迭代轮次</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.run}>
                <td><strong className="mono">{row.run}</strong></td>
                <td className="mono">{row.ds}</td>
                <td className="num">{row.cond}</td>
                <td className="num">{row.round}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="demo-note">ID 与数值使用等宽字体：逐位对齐，方便核对与复制。</p>
    </div>
  );
}

function SpacingScale() {
  const scale = [[4, "gap-1", "图标与文字、徽标内边距"], [8, "gap-2", "组件内部、行内操作"], [12, "gap-3", "表单字段之间"], [16, "gap-4 / p-4", "卡片内边距、卡片之间"], [24, "gap-6", "区块之间"], [32, "gap-8", "页面级分隔"]] as const;
  return (
    <div className="grid w-full gap-2">
      {scale.map(([px, cls, use]) => (
        <div key={px} className="flex items-center gap-3">
          <span className="w-10 text-right font-mono text-xs text-muted-foreground">{px}</span>
          <span className="h-3 rounded-sm bg-primary/70" style={{ width: px * 4 }} />
          <code className="w-24 font-mono text-xs text-foreground">{cls}</code>
          <span className="text-sm text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  );
}

function GapMark({ size }: { size: number }) {
  return (
    <div style={{ height: size, display: "flex", alignItems: "center", gap: 8 }} aria-hidden="true">
      <span style={{ flex: 1, borderTop: "1px dashed var(--line-strong)" }} />
      <span className="mono" style={{ color: "var(--faint)", fontSize: 12 }}>{size}px</span>
      <span style={{ flex: 1, borderTop: "1px dashed var(--line-strong)" }} />
    </div>
  );
}

function SpacingRhythm() {
  return (
    <div style={{ display: "grid" }}>
      <div className="demo-row" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <strong style={{ fontSize: 14.0 }}>计算任务</strong>
        <button className="button button-primary button-sm">新建任务</button>
      </div>
      <GapMark size={24} />
      <div className="demo-row">
        <input className="field-control" style={{ maxWidth: 200 }} placeholder="搜索任务名 / ID" />
        <button className="button button-secondary button-sm">状态</button>
        <button className="button button-secondary button-sm">时间范围</button>
      </div>
      <GapMark size={16} />
      <div className="card-demo">
        <h4>run-28003 · 第 3 轮优化</h4>
        <p>卡片之间间距 16；卡片内边距 16，内部元素间距 8–12。</p>
      </div>
    </div>
  );
}

function RadiusSamples() {
  const items = [["rounded-sm", "4 · 徽标、标签"], ["rounded-md", "6 · 按钮、输入框、菜单项"], ["rounded-lg", "8 · 卡片、浮层"], ["rounded-xl", "12 · 对话框、大容器"]];
  return (
    <div className="flex flex-wrap gap-4">
      {items.map(([cls, label]) => (
        <div key={cls} className="grid justify-items-center gap-2">
          <span className={`size-20 border-2 border-primary/50 bg-primary-soft ${cls}`} />
          <code className="font-mono text-xs text-foreground">{cls}</code>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ElevationSamples() {
  const items = [["shadow-xs", "按钮、输入框（轻微立体）"], ["shadow-sm", "需要强调的静止卡片（少用）"], ["shadow-md", "下拉、气泡、提示等浮层"], ["shadow-lg", "对话框、抽屉"]];
  return (
    <div className="flex flex-wrap gap-5">
      {items.map(([cls, label]) => (
        <div key={cls} className={`grid h-24 w-44 content-center gap-1 rounded-lg border bg-card p-4 ${cls}`}>
          <code className="font-mono text-sm text-foreground">{cls}</code>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function IconSizes() {
  const items = [[14, "size-3.5", "紧凑按钮、徽标内"], [16, "size-4", "按钮、表格行、状态文字（默认）"], [20, "size-5", "导航、空状态、结果页"]] as const;
  return (
    <div className="flex flex-wrap gap-8">
      {items.map(([px, cls, use]) => (
        <div key={px} className="grid justify-items-center gap-2 text-foreground">
          <span className="grid size-10 place-items-center rounded-lg border border-dashed"><FlaskConical size={px} /></span>
          <code className="font-mono text-xs">{px}px · {cls}</code>
          <span className="text-xs text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  );
}

function IconSemantic() {
  const states = [
    { icon: <CheckCircle2 size={16} />, label: "已完成", cls: "bg-success-soft text-success" },
    { icon: <AlertTriangle size={16} />, label: "待复核", cls: "bg-warning-soft text-warning" },
    { icon: <XCircle size={16} />, label: "失败", cls: "bg-danger-soft text-danger" },
    { icon: <Bot size={16} />, label: "Agent 建议", cls: "bg-agent-soft text-agent" },
    { icon: <Database size={16} />, label: "数据集", cls: "bg-secondary text-muted-foreground" },
  ];
  return (
    <div className="flex flex-wrap gap-5">
      {states.map((state) => (
        <span key={state.label} className="inline-flex items-center gap-2 text-base text-foreground">
          <span className={`grid size-8 place-items-center rounded-md ${state.cls}`}>{state.icon}</span>
          {state.label}
        </span>
      ))}
    </div>
  );
}

function MotionDuration() {
  const [on, setOn] = useState(false);
  const boxes = [
    { label: "160ms · 合规", ms: 160, ok: true },
    { label: "600ms · 反例", ms: 600, ok: false },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ gap: 24 }}>
        {boxes.map((box) => (
          <div key={box.ms} style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                width: 120,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--line-strong)",
                borderRadius: 12,
                background: on ? "var(--brand-soft)" : "var(--surface)",
                color: "var(--text-muted)",
                fontSize: 12,
                transform: on ? "translateY(-6px)" : "translateY(0)",
                transition: `all ${box.ms}ms ease-out`,
              }}
            >
              {on ? "进入" : "静止"}
            </div>
            <span className="demo-note" style={{ color: box.ok ? "var(--green)" : "var(--red)" }}>{box.label}</span>
          </div>
        ))}
      </div>
      <div className="demo-row">
        <button className="button button-secondary button-sm" onClick={() => setOn((value) => !value)}>播放过渡</button>
        <span className="demo-note">同时触发，对比 160ms 与 600ms 的跟手感。</span>
      </div>
    </div>
  );
}

function MotionSkeleton() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="rounded-lg border bg-card p-4">
        {loading ? (
          <div className="grid gap-2.5">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        ) : (
          <div className="grid gap-1">
            <div className="text-md font-semibold text-foreground">电导率计算 · run-28003</div>
            <div className="text-sm text-muted-foreground">数据集 ds-118 · 耗时 286.4 秒 · 已完成</div>
          </div>
        )}
      </div>
      <Button variant="secondary" size="sm" className="justify-self-start" onClick={() => setLoading((v) => !v)}>
        {loading ? "模拟加载完成" : "重新加载"}
      </Button>
    </div>
  );
}

function ResponsiveContent() {
  const rows = [
    { run: "run-28003", recipe: "LiPF6 / EC-EMC", cond: "9.84", time: "214", badge: <span className="status-badge badge-success"><span className="badge-dot" />已完成</span> },
    { run: "run-28004", recipe: "LiFSI / DME", cond: "10.12", time: "268", badge: <span className="status-badge badge-info"><span className="badge-dot" />运行中</span> },
  ];
  return (
    <div className="demo-stack">
      <div style={{ maxWidth: 360, border: "1px dashed var(--line-strong)", borderRadius: 12, padding: 10 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>任务 ID</th><th>配方</th><th className="num">电导率 (mS/cm)</th><th className="num">时长 (s)</th><th>状态</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.run}>
                  <td><strong className="mono">{row.run}</strong></td>
                  <td>{row.recipe}</td>
                  <td className="num">{row.cond}</td>
                  <td className="num">{row.time}</td>
                  <td>{row.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="demo-note">容器宽 360px：表格保持列宽并横向滚动，不压缩列。</p>
    </div>
  );
}

function ResponsiveTouch() {
  const targets = [
    { icon: <Search size={16} />, label: "搜索" },
    { icon: <Plus size={16} />, label: "新建" },
    { icon: <Download size={16} />, label: "导出" },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ gap: 16 }}>
        {targets.map((target) => (
          <button key={target.label} className="icon-button" aria-label={target.label} style={{ width: 40, height: 40, outline: "1px dashed var(--line-strong)", outlineOffset: 2 }}>
            {target.icon}
          </button>
        ))}
      </div>
      <p className="demo-note">虚线框为 40×40px 最小触控区：图标本身 16px，点击区必须撑满 40px。</p>
    </div>
  );
}

function A11yKeyboard() {
  return (
    <div className="demo-stack">
      <label className="field" style={{ maxWidth: 320 }}>
        任务名称
        <input className="field-control" placeholder="例如：电导率优化第 3 轮" />
      </label>
      <div className="demo-row">
        <button className="button button-primary">保存并提交</button>
        <button className="button button-ghost">取消</button>
      </div>
      <p className="demo-note">按 <kbd>Tab</kbd> 依次聚焦：输入框 → 保存并提交 → 取消；焦点环 3px 外发光始终可见。</p>
    </div>
  );
}

function A11yForms() {
  return (
    <div className="demo-stack">
      <label className="field field-error" style={{ maxWidth: 320 }}>
        数据集 ID
        <input className="field-control mono" defaultValue="ds-" aria-invalid="true" aria-describedby="a11y-ds-error" />
        <small id="a11y-ds-error" role="alert">请输入完整的数据集 ID，例如 ds-118。</small>
      </label>
      <p className="demo-note">出错输入设置 <span className="mono">aria-invalid=&quot;true&quot;</span>，错误文案容器使用 <span className="mono">role=&quot;alert&quot;</span>，读屏即时播报。</p>
    </div>
  );
}

export const foundationPreviews: Record<string, PreviewFn> = {
  "color/semantic": ColorSemantic,
  "typography/hierarchy": TypographyHierarchy,
  "typography/numbers": TypographyNumbers,
  "spacing-layout/scale": SpacingScale,
  "spacing-layout/rhythm": SpacingRhythm,
  "radius-elevation/radius": RadiusSamples,
  "radius-elevation/elevation": ElevationSamples,
  "icons/sizes": IconSizes,
  "icons/semantic": IconSemantic,
  "motion/duration": MotionDuration,
  "motion/skeleton": MotionSkeleton,
  "responsive/content": ResponsiveContent,
  "responsive/touch": ResponsiveTouch,
  "accessibility/keyboard": A11yKeyboard,
  "accessibility/forms": A11yForms,
};
