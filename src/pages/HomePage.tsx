import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Layers3,
  Search,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import {
  componentDocs,
  foundationDocs,
  patternDocs,
  templateDocs,
} from "../catalog";
import { DesignSculpture } from "../components/DesignSculpture";

/** The homepage introduces the system; the directory stays one click away. */
export function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <a className="release-link" href="#/start">
            <span>DataCore Design</span>
            <span>设计系统 0.1</span>
            <ArrowUpRight size={14} />
          </a>
          <h1>
            复杂的工作，
            <br />
            <span>清晰的界面。</span>
          </h1>
          <p>
            从一个按钮，到完整的研发工作台。
            <br />
            为设计、开发与 AI，建立共同的界面语言。
          </p>
          <div className="hero-actions">
            <a href="#/components" className="hero-primary">
              探索组件 <ArrowRight size={16} />
            </a>
            <a href="#/start" className="hero-secondary">
              开始使用 <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-note">
            <span>为 DataCore 而设计</span>
            <span>为每一次协作而打磨</span>
          </div>
        </div>
        <div className="hero-art">
          <DesignSculpture />
          <span className="hero-art-label">FORM / 001</span>
        </div>
        <a className="hero-scroll" href="#/components">
          <ArrowDown size={14} /> 浏览设计系统
        </a>
      </section>

      <div className="home-metrics" aria-label="设计系统内容">
        {[
          [componentDocs.length, "通用与业务组件"],
          [foundationDocs.length, "基础规范"],
          [patternDocs.length, "业务模式"],
          [templateDocs.length, "页面模板"],
        ].map(([n, label]) => (
          <a
            key={label}
            href={
              label === "基础规范"
                ? "#/foundations/color"
                : label === "业务模式"
                  ? "#/patterns/agent-confirmation"
                  : label === "页面模板"
                    ? "#/templates/list-page"
                    : "#/components"
            }
          >
            <strong>
              {n}
              <span> / </span>
            </strong>
            <span>{label}</span>
          </a>
        ))}
      </div>

      <section className="home-section" aria-labelledby="crafted-title">
        <div className="home-section-heading">
          <div>
            <span className="section-index">01 / COMPONENTS</span>
            <h2 id="crafted-title">细节一致，使用自然。</h2>
            <p>熟悉的操作方式，明确的状态反馈。直接试一试。</p>
          </div>
          <a href="#/components" className="home-text-link">
            全部 {componentDocs.length} 个组件 <ArrowUpRight size={16} />
          </a>
        </div>
        <ComponentShowcase />
      </section>

      <section
        className="home-section home-resources"
        aria-labelledby="system-title"
      >
        <div className="home-section-heading">
          <div>
            <span className="section-index">02 / THE SYSTEM</span>
            <h2 id="system-title">从基础，到完整的体验。</h2>
          </div>
        </div>
        <div className="resource-grid">
          <a href="#/foundations/color" className="resource-card">
            <span className="resource-number">01</span>
            <div className="token-swatches" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <h3>
              基础规范 <span>Foundations</span>
            </h3>
            <p>色彩、文字、间距与动效，共同构成界面的秩序。</p>
            <span className="resource-bottom">
              {foundationDocs.length} 篇规范 <ArrowUpRight size={17} />
            </span>
          </a>
          <a href="#/patterns/agent-confirmation" className="resource-card">
            <span className="resource-number">02</span>
            <div className="resource-symbol">
              <Layers3 size={38} strokeWidth={1} />
            </div>
            <h3>
              业务模式 <span>Patterns</span>
            </h3>
            <p>数据导入、任务执行、权限确认，每一步都有依据。</p>
            <span className="resource-bottom">
              {patternDocs.length} 个流程 <ArrowUpRight size={17} />
            </span>
          </a>
          <a href="#/templates/list-page" className="resource-card">
            <span className="resource-number">03</span>
            <div className="resource-symbol">
              <Braces size={38} strokeWidth={1} />
            </div>
            <h3>
              页面模板 <span>Templates</span>
            </h3>
            <p>将组件组合成列表、详情与 Agent 工作台。</p>
            <span className="resource-bottom">
              {templateDocs.length} 个模板 <ArrowUpRight size={17} />
            </span>
          </a>
        </div>
      </section>

      <section className="home-ai home-section">
        <div>
          <span className="section-index">03 / AI READY</span>
          <h2>
            人读得懂。
            <br />
            <span>AI 也能理解。</span>
          </h2>
          <p>
            组件、状态与行为来自同一份规范。
            <br />
            把明确的设计约束，带进下一次生成。
          </p>
          <a href="#/ai/registry" className="home-text-link">
            查看 AI 契约 <ArrowRight size={16} />
          </a>
        </div>
        <div className="ai-code">
          <div>
            <Terminal size={15} />
            <span>component-registry.json</span>
            <span>JSON</span>
          </div>
          <pre>
            <code>
              <span className="code-dim">{"{\n"}</span>
              {"  "}
              <span className="code-key">"id"</span>
              {': "dc.button",\n  '}
              <span className="code-key">"name"</span>
              {': "Button",\n  '}
              <span className="code-key">"status"</span>
              {': "stable",\n  '}
              <span className="code-key">"states"</span>
              {
                ': [\n    "default", "loading",\n    "disabled", "permission-limited"\n  ]\n'
              }
              <span className="code-dim">{"}"}</span>
            </code>
          </pre>
          <a href="./llms.txt">
            读取 llms.txt <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <footer className="home-footer">
        <a href="#/" className="brand">
          <img src="./brand/datacore-logo.png" alt="" />
          <strong>DataCore</strong>
          <span>Design</span>
        </a>
        <span>公开设计参考 · 示例均为合成数据</span>
        <a
          href="https://github.com/dptech-yb/datacore-design"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </footer>
    </div>
  );
}

function ComponentShowcase() {
  const [tab, setTab] = useState("components");
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="component-showcase">
      <div className="showcase-panel">
        <span className="showcase-label">BUTTON / 按钮</span>
        <div className="demo-row">
          <button
            className="button button-primary"
            onClick={() => setSaved(!saved)}
          >
            {saved ? <Check size={15} /> : null}
            {saved ? "已保存" : "保存更改"}
          </button>
          <button
            className="button button-secondary"
            onClick={() => setSaved(false)}
          >
            重置
          </button>
          <button
            className="icon-button bordered"
            aria-label="查找组件"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("dc:open-search"))
            }
          >
            <Search size={17} />
          </button>
        </div>
        <a href="#/components/button">
          状态清晰，响应及时 <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="showcase-panel">
        <span className="showcase-label">INPUT / 表单</span>
        <label className="showcase-field">
          项目名称
          <input
            className="field-control"
            placeholder="输入项目名称…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <a href="#/components/input">
          从输入，到有效信息 <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="showcase-panel">
        <span className="showcase-label">SWITCH / 开关</span>
        <div className="showcase-setting">
          <div>
            <strong>任务完成通知</strong>
            <span>{enabled ? "运行结束后接收通知" : "已关闭通知"}</span>
          </div>
          <button
            className="ui-switch"
            role="switch"
            aria-label="任务完成通知"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
          >
            <span />
          </button>
        </div>
        <a href="#/components/switch">
          每一个选择，都有反馈 <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="showcase-panel">
        <span className="showcase-label">TABS / 导航</span>
        <div className="showcase-tabs" role="tablist" aria-label="内容类型">
          {[
            ["components", "组件"],
            ["patterns", "模式"],
            ["templates", "模板"],
          ].map(([id, label], i, all) => (
            <button
              key={id}
              role="tab"
              id={`showcase-tab-${id}`}
              aria-controls="showcase-tab-panel"
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowRight"
                    ? (i + 1) % all.length
                    : e.key === "ArrowLeft"
                      ? (i + all.length - 1) % all.length
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? all.length - 1
                          : -1;
                if (next >= 0) {
                  e.preventDefault();
                  setTab(all[next][0]);
                  document
                    .getElementById(`showcase-tab-${all[next][0]}`)
                    ?.focus();
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <span
          className="showcase-tab-description"
          id="showcase-tab-panel"
          role="tabpanel"
          aria-labelledby={`showcase-tab-${tab}`}
        >
          {tab === "components"
            ? `${componentDocs.length} 个组件，统一的使用约定`
            : tab === "patterns"
              ? `${patternDocs.length} 个业务流程，清晰的操作路径`
              : `${templateDocs.length} 个模板，可直接查看组合方式`}
        </span>
        <a href="#/components/tabs">
          在内容之间，自然切换 <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
