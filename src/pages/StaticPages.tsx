import { BookOpen, CheckCircle2, CircleAlert, Code2, FileText, GitBranch, Keyboard, ShieldCheck, Terminal } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { navigate } from "../router";

export function StartPage() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">Getting started</span>
          <h1>开始使用</h1>
          <p className="doc-purpose">三种身份，三条进入路径：前端查组件复制示例，设计师查令牌与交互规则，AI Agent 读结构化契约。</p>
        </div>
      </header>
      <section className="doc-section">
        <h2>给前端</h2>
        <ul className="rule-list">
          <li>从左侧导航或 ⌘K 搜索找到组件，打开详情页。</li>
          <li>在“预览 / 代码 / JSON 契约”之间切换，复制最小代码或完整代码。</li>
          <li>对照“状态契约”补齐 loading、empty、error、disabled、permission 状态。</li>
          <li>涉及计算、写入、额度、外部调用的动作，按组件页的规则给出确认与范围说明。</li>
        </ul>
      </section>
      <section className="doc-section">
        <h2>给设计师</h2>
        <ul className="rule-list">
          <li>色彩、排版、间距、圆角见“基础 Foundations”。</li>
          <li>交互规则、键盘行为、响应式行为在每个组件详情页。</li>
          <li>跨页面流程（Agent 确认、数据导入、权限边界）见“业务模式 Patterns”。</li>
        </ul>
      </section>
      <section className="doc-section">
        <h2>给 AI Agent</h2>
        <ul className="rule-list">
          <li>先读 <a href="./llms.txt">llms.txt</a>（导航），再读 <a href="./llms-full.txt">llms-full.txt</a>（完整契约）。</li>
          <li>结构化组件信息在 <a href="./component-registry.json">component-registry.json</a>。</li>
          <li>稳定 ID、权限和数据关系必须显式表达，不允许根据显示名称推断。</li>
          <li>生成的界面仍需通过 typecheck、构建与人工交互检查。</li>
        </ul>
      </section>
      <section className="doc-section">
        <h2>三条不可协商的规则</h2>
        <ul className="rule-list">
          <li>先展示上下文，再执行动作：资源、范围、当前状态、下一步。</li>
          <li>推荐与执行分离：外部副作用必须经过明确确认。</li>
          <li>前端可见性不是授权：后端必须再次校验权限。</li>
        </ul>
      </section>
    </article>
  );
}

export function PrinciplesPage() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">Principles</span>
          <h1>设计原则</h1>
          <p className="doc-purpose">四条原则约束每一个组件与模式：清晰、确定、克制、生长。</p>
        </div>
      </header>
      <section className="doc-section">
        <div className="principles-grid principles-grid-doc">
          <Principle icon={<BookOpen size={19} />} title="清晰" text="让信息有层次：用户在第一眼知道自己在哪里、可以做什么、正在发生什么。" tone="blue" />
          <Principle icon={<CheckCircle2 size={19} />} title="确定" text="重要动作有明确反馈：状态、范围和结果都不让人猜，失败可以重试。" tone="green" />
          <Principle icon={<CircleAlert size={19} />} title="克制" text="只在需要的地方出现提示和动作；颜色只表达语义，图标只在有语义时出现。" tone="violet" />
          <Principle icon={<ShieldCheck size={19} />} title="生长" text="规则足够稳定，为不同业务、设备和新的协作方式（包括 AI Agent）保留空间。" tone="amber" />
        </div>
      </section>
      <section className="doc-section">
        <h2>原则如何落地</h2>
        <ul className="rule-list">
          <li>每个组件必须回答完整状态集，不适用的状态也要写明原因。</li>
          <li>颜色只按语义使用：动作用品牌蓝，成功用绿，待确认用黄，阻断用红，Agent 用紫，外部执行用橙。</li>
          <li>图标统一使用 Lucide，尺寸 16 / 18 / 20；浅色图标底 + 深色图标，不用深色底浅色图标做装饰。</li>
          <li>文案以动词开头，说明影响范围，不只说“确定/提交”。</li>
        </ul>
      </section>
    </article>
  );
}

function Principle({ icon, title, text, tone }: { icon: ReactNode; title: string; text: string; tone: string }) {
  return (
    <article className={`principle-card tone-${tone}`}>
      <div className="principle-icon">{icon}</div>
      <div><h3>{title}</h3><p>{text}</p></div>
    </article>
  );
}

export function AiPage({ id }: { id: string }) {
  switch (id) {
    case "llms":
      return <AiFilePage title="llms.txt" eyebrow="AI 与工程" purpose="给编码代理的短导航文件：入口、规则摘要与契约文件位置。完整契约在 llms-full.txt。" src="./llms.txt" />;
    case "naming":
      return <NamingPage />;
    case "accessibility":
      return <A11yPage />;
    case "contributing":
      return <ContributingPage />;
    case "registry":
    default:
      return <AiFilePage title="组件注册表" eyebrow="AI 与工程" purpose="component-registry.json：机器可读的组件索引，由 catalog 自动生成，与页面保持一致。" src="./component-registry.json" />;
  }
}

function AiFilePage({ title, eyebrow, purpose, src }: { title: string; eyebrow: string; purpose: string; src: string }) {
  const [content, setContent] = useState<string>("正在载入…");
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
      .then((text) => {
        if (cancelled) return;
        try {
          setContent(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          setContent(text);
        }
      })
      .catch(() => { if (!cancelled) setContent("文件载入失败：请确认构建时已运行 npm run generate。"); });
    return () => { cancelled = true; };
  }, [src]);
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="doc-purpose">{purpose}</p>
        </div>
        <div className="doc-badges">
          <a className="version-chip chip-link" href={src} target="_blank" rel="noreferrer"><FileText size={12} /> 原始文件</a>
        </div>
      </header>
      <section className="doc-section">
        <div className="example-code"><pre><code>{content}</code></pre></div>
      </section>
    </article>
  );
}

function NamingPage() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">AI 与工程</span>
          <h1>命名规范</h1>
          <p className="doc-purpose">稳定 ID 是契约的一部分：AI 不允许通过文本相似度猜来源，也不允许根据显示名称推断关系。</p>
        </div>
      </header>
      <section className="doc-section">
        <h2>规则</h2>
        <ul className="rule-list">
          <li>组件 id 使用 kebab-case 且全局唯一，如 <code>citation</code>、<code>run-status</code>；注册表中以 <code>dc.</code> 前缀导出。</li>
          <li>示例 id 在组件内唯一；预览键为 <code>&lt;component-id&gt;/&lt;example-id&gt;</code>。</li>
          <li>业务实体（项目、任务、引用、版本）必须带稳定 ID，展示名可以变，ID 不变。</li>
          <li>语义 HTML 优先：按钮用 button，表格用 table，对话框用 role=dialog + aria-modal。</li>
        </ul>
      </section>
    </article>
  );
}

function A11yPage() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">AI 与工程</span>
          <h1>可访问性基线</h1>
          <p className="doc-purpose">可访问性不是加分项，是验收项：键盘、读屏、缩放、对比度都要过。</p>
        </div>
      </header>
      <section className="doc-section">
        <h2>基线要求</h2>
        <ul className="rule-list">
          <li>所有可操作元素键盘可达，焦点有清晰可见的指示（3px 品牌色外发光）。</li>
          <li>表单错误使用 aria-invalid 与 role=alert，不只依赖颜色。</li>
          <li>对话框具备 aria-modal、标题关联与 Esc 关闭。</li>
          <li>表格保留 caption、表头，窄屏允许横向滚动而不是压缩成不可读卡片。</li>
          <li>200% 浏览器放大不重叠、不截断；320px 宽度可用。</li>
          <li>尊重 prefers-reduced-motion。</li>
        </ul>
      </section>
    </article>
  );
}

function ContributingPage() {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">AI 与工程</span>
          <h1>贡献指南</h1>
          <p className="doc-purpose">单一数据源：页面、注册表和 AI 文档都从 src/catalog 生成，不分别手写。</p>
        </div>
      </header>
      <section className="doc-section">
        <h2>新增一个组件</h2>
        <ul className="rule-list">
          <li>在 <code>src/catalog/components/</code> 对应分类文件中添加 ComponentDoc（参照 Button 的完整度）。</li>
          <li>在 <code>src/previews/</code> 对应文件中为每个示例添加预览，键为 <code>&lt;id&gt;/&lt;example&gt;</code>。</li>
          <li>运行 <code>npm run generate</code> 重新生成 llms.txt、llms-full.txt、component-registry.json。</li>
          <li>运行 <code>npm run typecheck</code> 与 <code>npm run build</code>，检查移动端与键盘访问。</li>
        </ul>
      </section>
      <section className="doc-section">
        <h2>禁止事项</h2>
        <ul className="rule-list">
          <li>不手改 public 下三个 AI 契约文件——它们会被生成覆盖。</li>
          <li>不在示例中写入真实用户、生产链接、凭据或内部数据。</li>
          <li>不引入服务端路由；站点必须能以静态文件部署在 GitHub Pages。</li>
        </ul>
        <div className="related-row" style={{ marginTop: 16 }}>
          <button className="related-chip" onClick={() => navigate("/ai/registry")}><Code2 size={13} /> 查看注册表</button>
          <a className="related-chip" href="https://github.com/dptech-yb/datacore-design" target="_blank" rel="noreferrer"><GitBranch size={13} /> GitHub</a>
          <a className="related-chip" href="./llms-full.txt"><Terminal size={13} /> llms-full.txt</a>
          <span className="related-chip related-chip-static"><Keyboard size={13} /> ⌘K 全局搜索</span>
        </div>
      </section>
    </article>
  );
}
