import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleDashed,
  Clipboard,
  Code2,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  Keyboard,
  Layers3,
  Menu,
  Moon,
  Palette,
  PanelLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Terminal,
  X,
  Zap,
} from "lucide-react";

type Page = "overview" | "foundations" | "components" | "patterns" | "guidance";

const navGroups: { label: string; items: { id: Page; label: string; icon: typeof Palette }[] }[] = [
  {
    label: "规范",
    items: [
      { id: "overview", label: "总览", icon: Layers3 },
      { id: "foundations", label: "基础令牌", icon: Palette },
    ],
  },
  {
    label: "组件",
    items: [
      { id: "components", label: "通用组件", icon: SlidersHorizontal },
      { id: "patterns", label: "业务模式", icon: FlaskConical },
    ],
  },
  {
    label: "工程",
    items: [{ id: "guidance", label: "使用与可访问性", icon: ShieldCheck }],
  },
];

function pageFromHash(): Page {
  const value = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return ["overview", "foundations", "components", "patterns", "guidance"].includes(value)
    ? (value as Page)
    : "overview";
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const navigate = (next: Page) => {
    window.location.hash = `/${next}`;
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
          <div>
            <div className="brand-name">DataCore <span>Design</span></div>
            <div className="brand-caption">设计语言与组件规范</div>
          </div>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="关闭导航">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-note">
          <span className="status-dot" />
          <span>开放式组件规范 · v0.1</span>
        </div>

        <nav aria-label="设计系统导航">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${page === item.id ? "nav-item-active" : ""}`}
                    onClick={() => navigate(item.id)}
                    aria-current={page === item.id ? "page" : undefined}
                  >
                    <Icon size={16} strokeWidth={page === item.id ? 2.2 : 1.8} />
                    {item.label}
                    {item.id === "components" && <span className="nav-count">8</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="./llms.txt" className="footer-link"><Terminal size={14} /> AI 快速入口</a>
          <a href="https://github.com/dptech-yb/datacore-design" className="footer-link" target="_blank" rel="noreferrer">
            <Code2 size={14} /> GitHub <ExternalLink size={12} />
          </a>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="打开导航">
            <Menu size={20} />
          </button>
          <div className="breadcrumb"><span>DataCore</span><span className="breadcrumb-separator">/</span><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <a href="./llms-full.txt" className="topbar-link"><Terminal size={15} /> <span>AI 文档</span></a>
            <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "切换亮色主题" : "切换暗色主题"}>
              {dark ? <Moon size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <main className="content">
          {page === "overview" && <Overview onNavigate={navigate} />}
          {page === "foundations" && <Foundations />}
          {page === "components" && <Components />}
          {page === "patterns" && <Patterns />}
          {page === "guidance" && <Guidance />}
        </main>
        <footer className="site-footer">
          <span>DataCore Design · MIT License</span>
          <span>规范优先，组件可复用，数据可追溯</span>
        </footer>
      </div>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
    </div>
  );
}

function pageTitle(page: Page) {
  return { overview: "总览", foundations: "基础令牌", components: "通用组件", patterns: "业务模式", guidance: "使用与可访问性" }[page];
}

function SectionIntro({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: typeof Palette }) {
  return (
    <div className="section-intro">
      <div className="eyebrow"><Icon size={15} /> {eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> DataCore Design</div>
          <h1>让复杂的工作，<span>变得清晰而自然。</span></h1>
          <p>我们把色彩、间距、组件和交互状态整理为一套可以共同理解的语言：在需要时给予提示，在关键处保持确定，让每一步都可预期。</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onNavigate("components")}>浏览组件 <ArrowRight size={16} /></button>
            <a className="button button-secondary" href="./llms-full.txt">阅读 AI 文档 <Terminal size={15} /></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="DataCore 设计系统的四个关注点">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="hero-node hero-node-main"><Palette size={20} /><strong>Design language</strong><span>让共识可以复用</span></div>
          <div className="hero-node hero-node-a"><CheckCircle2 size={17} /><span>清晰可读</span></div>
          <div className="hero-node hero-node-b"><ShieldCheck size={17} /><span>稳定可预期</span></div>
          <div className="hero-node hero-node-c"><Table2 size={17} /><span>轻量可达</span></div>
        </div>
      </section>

      <section className="principles-grid">
        <Principle icon={<PanelLeft size={19} />} title="清晰" text="让信息有层次，让用户在第一眼知道自己在哪里、可以做什么。" tone="blue" />
        <Principle icon={<CheckCircle2 size={19} />} title="确定" text="重要动作有明确反馈，状态、范围和结果都不让人猜。" tone="green" />
        <Principle icon={<Table2 size={19} />} title="克制" text="只在需要的地方出现提示和动作，把注意力留给当下的任务。" tone="violet" />
        <Principle icon={<Accessibility size={19} />} title="生长" text="规则足够稳定，也为不同业务、设备和新的协作方式保留空间。" tone="amber" />
      </section>

      <section className="section-block">
        <div className="section-heading"><div><div className="eyebrow">设计如何进入日常</div><h2>从一条规则，到一整个界面</h2></div><button className="text-link" onClick={() => onNavigate("guidance")}>查看实践约定 <ArrowRight size={14} /></button></div>
        <div className="quick-grid">
          <QuickCard icon={<Palette />} title="基础令牌" text="颜色、间距、字号、圆角与状态语义。" onClick={() => onNavigate("foundations")} />
          <QuickCard icon={<SlidersHorizontal />} title="通用组件" text="按钮、字段、表格、对话框和状态反馈。" onClick={() => onNavigate("components")} />
          <QuickCard icon={<FlaskConical />} title="业务模式" text="实验确认、数据导入、引用和权限边界。" onClick={() => onNavigate("patterns")} />
          <QuickCard icon={<Terminal />} title="AI 可读契约" text="llms.txt、JSON 注册表和可复制示例。" href="./llms.txt" />
        </div>
      </section>

      <section className="notice-card notice-blue">
        <div className="notice-icon"><Zap size={18} /></div>
        <div><strong>从真实工作中整理，也为新的工作方式留出空间</strong><p>这套规范关注的是信息如何被理解、动作如何被确认、结果如何被追溯；示例只使用合成数据，方便团队共同讨论和复用。</p></div>
      </section>
    </>
  );
}

function Principle({ icon, title, text, tone }: { icon: ReactNode; title: string; text: string; tone: string }) {
  return <article className={`principle-card tone-${tone}`}><div className="principle-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></article>;
}

function QuickCard({ icon, title, text, onClick, href }: { icon: ReactNode; title: string; text: string; onClick?: () => void; href?: string }) {
  const body = <><div className="quick-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="quick-arrow" size={16} /></>;
  return href ? <a className="quick-card" href={href}>{body}</a> : <button className="quick-card" onClick={onClick}>{body}</button>;
}

function Foundations() {
  return (
    <>
      <SectionIntro eyebrow="设计基础 / Foundations" title="先统一语言，再组合界面" description="颜色表达状态，间距表达关系，字号表达优先级。基础规则足够明确，界面才有一致的呼吸感。" icon={Palette} />
      <section className="token-section"><TokenHeader title="颜色语义" description="使用语义色而不是直接使用彩虹色；同一语义在浅色和暗色主题中保持可辨识。" /><div className="swatch-grid"><Swatch label="Brand / action" value="#2563eb" color="#2563eb" /><Swatch label="Success / complete" value="#059669" color="#059669" /><Swatch label="Warning / review" value="#d97706" color="#d97706" /><Swatch label="Danger / blocked" value="#dc2626" color="#dc2626" /><Swatch label="Ink / primary text" value="#0f172a" color="#0f172a" /><Swatch label="Surface / page" value="#f8fafc" color="#f8fafc" light /></div></section>
      <section className="token-section"><TokenHeader title="排版层级" description="中文优先使用系统字体；数字、ID 和文件名使用等宽字体以保留可复制性。" /><div className="type-samples"><div><span className="type-label">Display / 32</span><div className="type-display">实验数据与智能协作</div></div><div><span className="type-label">Heading / 20</span><div className="type-heading">项目与实验状态</div></div><div><span className="type-label">Body / 14</span><div className="type-body">让用户知道发生了什么、下一步能做什么，以及操作会影响哪些数据。</div></div><div><span className="type-label">Mono / 13</span><div className="type-mono">run-2026-09-22 · project-042</div></div></div></section>
      <section className="token-section"><TokenHeader title="间距与圆角" description="以 4px 为基准，主要节奏使用 8 / 16 / 24px；卡片边界不取代信息层级，圆角只用于表达容器和可点击表面。" /><div className="spacing-row"><Spacing size="4" label="xs" /><Spacing size="8" label="sm" /><Spacing size="16" label="md" /><Spacing size="24" label="lg" /><Spacing size="32" label="xl" /></div><div className="radius-row"><div className="radius-sample radius-sm">4px <span>控件</span></div><div className="radius-sample radius-md">8px <span>字段 / 按钮</span></div><div className="radius-sample radius-lg">16px <span>卡片</span></div></div></section>
    </>
  );
}

function TokenHeader({ title, description }: { title: string; description: string }) { return <div className="token-header"><h2>{title}</h2><p>{description}</p></div>; }
function Swatch({ label, value, color, light = false }: { label: string; value: string; color: string; light?: boolean }) { return <div className="swatch"><div className="swatch-color" style={{ background: color }}><span className={light ? "swatch-light-label" : ""}>{value}</span></div><div className="swatch-label">{label}</div></div>; }
function Spacing({ size, label }: { size: string; label: string }) { return <div className="spacing-item"><div className="spacing-bar" style={{ width: `${Number(size) * 3}px` }} /><strong>{size}px</strong><span>{label}</span></div>; }

function Components() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const example = `<Button variant="primary" loading={isSubmitting}>提交计算任务</Button>`;
  const copyExample = async () => { try { await navigator.clipboard.writeText(example); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { /* clipboard can be unavailable in embedded previews */ } };
  return (
    <>
      <SectionIntro eyebrow="组件 / Components" title="把共识做成可以调用的组件" description="组件不只是样式。它还要说明动作、状态、边界和可访问性，让设计、开发和 AI 都能用同一种方式理解它。" icon={SlidersHorizontal} />
      <div className="component-layout">
        <aside className="component-index" aria-label="组件目录"><span className="component-index-title">本页组件</span>{["按钮与动作", "表单字段", "状态反馈", "数据表格", "对话框", "数据引用"].map((label, index) => <a key={label} href={`#component-${index + 1}`}>{String(index + 1).padStart(2, "0")} · {label}</a>)}</aside>
        <div className="component-content">
          <ComponentSection id="component-1" title="按钮与动作" meta="Button / Action" description="动作名称用动词开头；涉及写入、计算、额度或外部调用时，按钮旁给出影响范围。">
            <div className="demo-row"><button className="button button-primary">开始计算 <ArrowRight size={15} /></button><button className="button button-secondary">保存草稿</button><button className="button button-ghost">查看详情</button><button className="button button-danger">撤销任务</button><button className="button button-primary" disabled>不可用</button></div>
            <div className="demo-row"><button className="button button-primary" onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1000); }}>{loading && <span className="spinner" aria-hidden="true" />} {loading ? "正在提交" : "演示加载态"}</button><CodeSnippet code={example} copied={copied} onCopy={copyExample} /></div>
          </ComponentSection>
          <ComponentSection id="component-2" title="表单字段" meta="Field / Validation" description="标签说明字段含义，辅助文本说明格式或副作用；错误要贴近字段并能被读屏识别。">
            <div className="form-demo-grid"><label className="field"><span>项目名称 <em>*</em></span><input className="field-control" placeholder="例如：示例项目" value={query} onChange={(event) => setQuery(event.target.value)} /><small>用户在启动计算前仍可确认计费项目。</small></label><label className="field"><span>项目 ID</span><input className="field-control mono" value="project-042" readOnly /><small>只读字段使用等宽字体，便于复制核对。</small></label><label className="field field-error"><span>数据源地址 <em>*</em></span><input className="field-control" aria-invalid="true" defaultValue="https://" /><small role="alert"><CircleAlert size={13} />请输入完整 URL，或留空让 Agent 自动查找。</small></label></div>
          </ComponentSection>
          <ComponentSection id="component-3" title="状态反馈" meta="Status / Empty / Error" description="状态文案回答三个问题：发生了什么、是否需要用户操作、下一步是什么。">
            <div className="status-stack"><div className="status-line status-success"><CheckCircle2 size={17} /><div><strong>已连接 Bohrium</strong><span>当前凭据可用，可继续选择项目。</span></div><StatusBadge tone="success">可用</StatusBadge></div><div className="status-line status-warning"><CircleDashed size={17} /><div><strong>正在检查授权</strong><span>不会阻塞当前页面；完成后会自动更新。</span></div><StatusBadge tone="warning">检测中</StatusBadge></div><div className="status-line status-danger"><CircleAlert size={17} /><div><strong>无法读取项目</strong><span>授权可能已过期，请重新连接后再试。</span></div><button className="inline-action">重新连接</button></div><div className="empty-line"><Search size={20} /><strong>还没有数据引用</strong><span>Agent 会在执行搜索或导入后把来源关联到这里。</span></div></div>
          </ComponentSection>
          <ComponentSection id="component-4" title="数据表格" meta="Table / Query" description="表格首列保持语义稳定；数字右对齐，状态使用 badge；小屏优先允许横向滚动，不压缩成不可读的卡片。">
            <div className="table-wrap"><table><caption className="sr-only">实验任务列表</caption><thead><tr><th>任务</th><th>项目</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody><tr><td><strong>电导率推荐 · 第 3 轮</strong><span className="table-secondary">run-28003</span></td><td>示例项目 <span className="mono">project-042</span></td><td><StatusBadge tone="success">已完成</StatusBadge></td><td>刚刚</td><td><button className="table-action">查看</button></td></tr><tr><td><strong>蓝电曲线导入</strong><span className="table-secondary">import-031</span></td><td>固态研发</td><td><StatusBadge tone="warning">待确认</StatusBadge></td><td>8 分钟前</td><td><button className="table-action">继续</button></td></tr></tbody></table></div>
          </ComponentSection>
          <ComponentSection id="component-5" title="对话框" meta="Dialog / Confirmation" description="对话框用于确认有副作用的动作；打开后聚焦标题或首个控件，Esc 可关闭，确认按钮回显目标和范围。">
            <div className="dialog-demo"><button className="button button-secondary" onClick={() => setDialogOpen(true)}>打开确认示例 <ChevronDown size={15} /></button><span>示例：提交远程沙箱任务前确认项目和预算。</span></div>
            {dialogOpen && <Dialog onClose={() => setDialogOpen(false)} />}
          </ComponentSection>
          <ComponentSection id="component-6" title="数据引用" meta="Citation / Source" description="正文里的角标和来源清单共用稳定的 citation id；点击正文角标定位并高亮来源，不在正文重复写一整段来源。">
            <div className="citation-demo"><p>示例会议将于 9 月 3–4 日举行<sup><a href="#source-1">[1]</a></sup>，主题为“数据与协作”<sup><a href="#source-2">[2]</a></sup>。</p><div className="source-list"><a id="source-1" href="https://example.com/source-1" target="_blank" rel="noreferrer"><span>[1]</span> 示例会议日程公开资料 <ExternalLink size={13} /></a><a id="source-2" href="https://example.com/source-2" target="_blank" rel="noreferrer"><span>[2]</span> 示例会议主题说明 <ExternalLink size={13} /></a></div></div>
          </ComponentSection>
        </div>
      </div>
    </>
  );
}

function ComponentSection({ id, title, meta, description, children }: { id: string; title: string; meta: string; description: string; children: ReactNode }) { return <section id={id} className="component-section"><div className="component-heading"><div><span className="component-meta">{meta}</span><h2>{title}</h2></div><a href={`./llms-full.txt#${meta.toLowerCase().replace(/\s+/g, "-")}`} aria-label={`查看 ${title} 的 AI 契约`}><Terminal size={15} /></a></div><p className="component-description">{description}</p><div className="component-demo">{children}</div></section>; }

function CodeSnippet({ code, copied, onCopy }: { code: string; copied: boolean; onCopy: () => void }) { return <div className="code-snippet"><code>{code}</code><button onClick={onCopy} aria-label="复制代码">{copied ? <Check size={14} /> : <Clipboard size={14} />}</button></div>; }
function StatusBadge({ tone, children }: { tone: "success" | "warning" | "danger" | "neutral"; children: ReactNode }) { return <span className={`status-badge badge-${tone}`}><span className="badge-dot" />{children}</span>; }
function Dialog({ onClose }: { onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description"><div className="dialog-header"><div><span className="component-meta">确认动作</span><h2 id="dialog-title">提交计算任务？</h2></div><button ref={closeButtonRef} className="icon-button" onClick={onClose} aria-label="关闭对话框"><X size={18} /></button></div><p id="dialog-description">将使用 <strong>示例项目（project-042）</strong> 提交 1 个 CPU 任务，预计最长运行 300 秒。</p><div className="dialog-note"><ShieldCheck size={16} /> 操作会记录到项目审计日志，可在任务详情查看状态。</div><div className="dialog-actions"><button className="button button-ghost" onClick={onClose}>取消</button><button className="button button-primary" onClick={onClose}>确认提交 <ArrowRight size={15} /></button></div></div></div>;
}

function Patterns() {
  return (
    <>
      <SectionIntro eyebrow="模式 / Patterns" title="让关键动作保持可预期" description="把复杂流程拆成可理解的步骤：先看上下文，再做选择；先看结果，再决定下一步。" icon={FlaskConical} />
      <div className="pattern-grid">
        <PatternCard number="01" title="Agent 推荐 → 用户确认 → 执行" tone="blue" icon={<Sparkles />} steps={["Agent 说明计划、输入和预期影响", "用户选择项目 / 预算并确认", "系统创建可追踪任务，回传状态和日志"]} />
        <PatternCard number="02" title="数据导入 → 预览 → 校验 → 入库" tone="green" icon={<Database />} steps={["文件或设备数据先进入临时区", "展示字段映射、缺失和冲突", "用户确认后写入并保留原始文件与版本"]} />
        <PatternCard number="03" title="正文角标 ↔ 来源清单" tone="violet" icon={<FileText />} steps={["事实后插入稳定 citation id", "正文只显示轻量可点击角标", "来源清单提供标题、链接和抓取时间"]} />
        <PatternCard number="04" title="权限决定动作，不决定可见性" tone="amber" icon={<ShieldCheck />} steps={["页面说明当前用户角色和资源范围", "无权限动作禁用并解释原因", "后端始终二次校验，前端不单独放权"]} />
      </div>
      <section className="workflow-card"><div className="workflow-head"><div><div className="eyebrow">推荐的闭环</div><h2>目标 → 上下文 → 推荐 → 确认 → 执行 → 回传</h2></div><span className="workflow-badge">可追踪</span></div><div className="workflow-line">{["目标", "上下文", "推荐", "确认", "执行", "回传"].map((step, index) => <div className="workflow-step" key={step}><span>{index + 1}</span><strong>{step}</strong>{index < 5 && <ArrowRight size={16} />}</div>)}</div><p>中间过程可以被观察，但只有明确确认后的动作才能产生外部副作用；任何失败都要回到可重试、可人工接管的状态。</p></section>
    </>
  );
}
function PatternCard({ number, title, tone, icon, steps }: { number: string; title: string; tone: string; icon: ReactNode; steps: string[] }) { return <article className={`pattern-card pattern-${tone}`}><div className="pattern-card-top"><span className="pattern-number">{number}</span><span className="pattern-icon">{icon}</span></div><h2>{title}</h2><ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol></article>; }

function Guidance() {
  return (
    <>
      <SectionIntro eyebrow="实践 / Practice" title="让规则在真实场景里成立" description="好的规范不会让界面变得僵硬，而是让团队少做重复判断，把精力留给真正重要的问题。" icon={ShieldCheck} />
      <div className="guidance-grid">
        <GuidanceCard icon={<Accessibility />} title="可访问性基线" items={["所有可操作元素都能用键盘到达，焦点有清晰的可视指示。", "表单错误使用 aria-invalid 和 role=alert，不只依赖颜色。", "对话框具备 aria-modal、标题关联和 Esc 关闭行为。", "表格保留 caption、表头和窄屏横向滚动。"]} />
        <GuidanceCard icon={<Keyboard />} title="状态完整性" items={["至少覆盖 loading、empty、error、disabled、permission 五种状态。", "加载期间保留上下文，不用整页闪烁替换。", "错误文案说明原因、影响和下一步，而不是只显示‘失败’。", "涉及额度或写入的动作显示范围，并在确认后记录审计。"]} />
        <GuidanceCard icon={<Code2 />} title="AI 接入约定" items={["组件名称、props、状态和示例在 component-registry.json 中有稳定定义。", "llms.txt 是导航，llms-full.txt 是完整契约；改组件时同步更新。", "业务数据使用合成样例；不要把生产 URL、凭据或用户数据写入示例。", "AI 生成的页面仍需通过 typecheck、build 和人工交互检查。"]} />
        <GuidanceCard icon={<Database />} title="数据与权限" items={["前端展示的项目、任务和来源都带稳定 ID，避免依赖名称猜测。", "默认项目只是建议值，启动前必须回显并让用户确认。", "前端隐藏按钮不等于授权；后端接口必须做最终校验。", "导入保留原始文件、解析结果、版本与操作人，保证可追溯。"]} />
      </div>
      <section className="artifact-card"><div className="artifact-icon"><Terminal size={20} /></div><div><h2>给 AI 的入口</h2><p>把这三个文件直接放进代码助手上下文，能让组件选择和页面实现遵循同一份契约。</p><div className="artifact-links"><a href="./llms.txt">llms.txt <ExternalLink size={13} /></a><a href="./llms-full.txt">llms-full.txt <ExternalLink size={13} /></a><a href="./component-registry.json">component-registry.json <ExternalLink size={13} /></a></div></div></section>
      <section className="notice-card notice-amber"><div className="notice-icon"><CircleAlert size={18} /></div><div><strong>主平台优化建议（已纳入规范）</strong><p>主平台已有统一的按钮、输入框和卡片类，但部分页面仍直接拼接 Tailwind 类。后续优先把 focus-visible、对话框焦点管理、错误状态和数据引用抽成共享组件；不建议一次性重写业务页面。</p></div></section>
    </>
  );
}
function GuidanceCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) { return <article className="guidance-card"><div className="guidance-title"><span>{icon}</span><h2>{title}</h2></div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>; }
