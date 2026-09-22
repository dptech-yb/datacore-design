import { AlertTriangle, Bot, CheckCircle2, Database, Download, FlaskConical, Plus, Search, XCircle } from "lucide-react";
import { useState } from "react";
import type { PreviewFn } from "./types";

function ColorSemantic() {
  return (
    <div className="swatch-grid">
      <div className="swatch"><div className="swatch-color" style={{ background: "#2664e8" }}><span>#2664e8</span></div><div className="swatch-label">Brand / 动作与链接</div></div>
      <div className="swatch"><div className="swatch-color" style={{ background: "#058764" }}><span>#058764</span></div><div className="swatch-label">Success / 完成</div></div>
      <div className="swatch"><div className="swatch-color" style={{ background: "#b87308" }}><span>#b87308</span></div><div className="swatch-label">Warning / 待确认</div></div>
      <div className="swatch"><div className="swatch-color" style={{ background: "#c33636" }}><span>#c33636</span></div><div className="swatch-label">Danger / 阻断</div></div>
      <div className="swatch"><div className="swatch-color" style={{ background: "#7253c7" }}><span>#7253c7</span></div><div className="swatch-label">Violet / Agent</div></div>
      <div className="swatch"><div className="swatch-color" style={{ background: "#ffffff" }}><span className="swatch-light-label">#ffffff</span></div><div className="swatch-label">Surface / 页面背景</div></div>
    </div>
  );
}

function TypographyHierarchy() {
  return (
    <div className="type-samples">
      <div>
        <span className="type-label">Display 36/600 · 页面标题</span>
        <div className="type-display">电导率优化看板</div>
      </div>
      <div>
        <span className="type-label">Heading 20/600 · 区块标题</span>
        <div className="type-heading">第 3 轮推荐配方</div>
      </div>
      <div>
        <span className="type-label">Body 16/400 · 正文</span>
        <div className="type-body">示例项目 project-042 的第 3 轮优化已完成，推荐配方在 25 °C 下的预测电导率为 10.12 mS/cm，请复核后提交实测。</div>
      </div>
      <div>
        <span className="type-label">Mono 13 · ID 与数字</span>
        <div className="type-mono">run-28003 · ds-118 · 10.12 mS/cm</div>
      </div>
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
  const items = [
    { px: 4, use: "图标与文字" },
    { px: 8, use: "组件内部" },
    { px: 12, use: "紧凑分组" },
    { px: 16, use: "卡片间距" },
    { px: 24, use: "区块之间" },
    { px: 32, use: "页面级" },
  ];
  return (
    <div className="spacing-row">
      {items.map((item) => (
        <div key={item.px} className="spacing-item">
          <div className="spacing-bar" style={{ width: item.px * 2, minWidth: 0 }} />
          <strong>{item.px}</strong>
          <span>{item.use}</span>
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
  return (
    <div className="radius-row">
      <div className="radius-sample radius-sm">4–6<span>徽标 / 标签</span></div>
      <div className="radius-sample radius-md">8–10<span>按钮 / 输入</span></div>
      <div className="radius-sample radius-lg">16<span>卡片 / 对话框</span></div>
    </div>
  );
}

function ElevationSamples() {
  return (
    <div className="demo-row" style={{ alignItems: "stretch" }}>
      <div className="card-demo" style={{ width: 210, boxShadow: "var(--shadow-sm)" }}>
        <h4>shadow-sm</h4>
        <p>静止卡片：边框界定容器，阴影几乎不可察觉。</p>
      </div>
      <div className="card-demo" style={{ width: 210, boxShadow: "var(--shadow-md)" }}>
        <h4>shadow-md</h4>
        <p>浮层与悬停：下拉、对话框、抽屉，没有第三档。</p>
      </div>
    </div>
  );
}

function IconSizes() {
  const items = [
    { size: 16, icon: <FlaskConical size={16} />, use: "行内 / 按钮" },
    { size: 18, icon: <Database size={18} />, use: "导航 / 入口" },
    { size: 20, icon: <Search size={20} />, use: "空状态 / 页面级" },
  ];
  return (
    <div className="demo-row" style={{ gap: 30 }}>
      {items.map((item) => (
        <div key={item.size} style={{ display: "grid", justifyItems: "center", gap: 6, color: "var(--text)" }}>
          <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", border: "1px dashed var(--line-strong)", borderRadius: 8 }}>{item.icon}</span>
          <strong className="mono" style={{ fontSize: 12 }}>{item.size}</strong>
          <span className="demo-note">{item.use}</span>
        </div>
      ))}
    </div>
  );
}

function IconSemantic() {
  const states = [
    { icon: <CheckCircle2 size={16} />, label: "已完成", color: "var(--green)", bg: "var(--green-soft)" },
    { icon: <AlertTriangle size={16} />, label: "待复核", color: "var(--amber)", bg: "var(--amber-soft)" },
    { icon: <XCircle size={16} />, label: "失败", color: "var(--red)", bg: "var(--red-soft)" },
    { icon: <Bot size={16} />, label: "Agent 建议", color: "var(--violet)", bg: "var(--violet-soft)" },
  ];
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ gap: 18 }}>
        {states.map((state) => (
          <span key={state.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text)" }}>
            <span style={{ width: 28, height: 28, display: "grid", placeItems: "center", borderRadius: 8, color: state.color, background: state.bg }}>{state.icon}</span>
            {state.label}
          </span>
        ))}
      </div>
      <div className="card-demo">
        <h4>第 3 轮推荐配方</h4>
        <p>卡片标题靠文字表达，不在标题前放图标；图标只出现在有语义的状态与入口上。</p>
      </div>
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
                color: "var(--muted)",
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
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="demo-stack">
      {loaded ? (
        <div className="status-line status-success">
          <CheckCircle2 size={16} />
          <div>
            <strong>run-28003 · 计算完成</strong>
            <span>耗时 214 秒 · 结果已写入 示例项目（project-042）</span>
          </div>
          <span className="status-badge badge-success"><span className="badge-dot" />已完成</span>
        </div>
      ) : (
        <div className="card-demo" style={{ display: "grid", gap: 10 }} aria-hidden="true">
          <div style={{ height: 12, width: "42%", borderRadius: 6, background: "var(--surface-soft)", border: "1px solid var(--line)" }} />
          <div style={{ height: 10, width: "78%", borderRadius: 6, background: "var(--surface-soft)" }} />
          <div style={{ height: 10, width: "64%", borderRadius: 6, background: "var(--surface-soft)" }} />
        </div>
      )}
      <div className="demo-row">
        <button className="button button-secondary button-sm" onClick={() => setLoaded((value) => !value)}>
          {loaded ? "重新加载" : "模拟加载完成"}
        </button>
        <span className="demo-note">骨架结构与真实内容一一对应，原位替换不抖动。</span>
      </div>
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
