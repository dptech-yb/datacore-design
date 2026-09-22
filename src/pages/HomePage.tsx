import { ArrowRight, Boxes, FlaskConical, Layers3, LayoutTemplate, Palette, Search, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { componentCategories, componentDocs, foundationDocs, patternDocs, templateDocs } from "../catalog";
import { navigate } from "../router";
import { DesignSculpture } from "../components/DesignSculpture";

export function HomePage() {
  return (
    <>
      <section className="home-head">
        <div className="eyebrow"><Sparkles size={15} /> DataCore Design System</div>
        <h1>面向设计、研发与 AI Agent 的<br />统一界面语言与组件契约。</h1>
        <p>查找组件、复制示例、核对状态与权限规则——所有示例使用合成数据，所有契约可以从单一数据源自动生成。</p>
        <div className="home-search-hint">
          <button className="home-search-trigger" onClick={() => window.dispatchEvent(new CustomEvent("dc:open-search"))}>
            <Search size={15} /> 搜索 {componentDocs.length} 个组件、{patternDocs.length} 个模式、{templateDocs.length} 个模板… <kbd>⌘K</kbd>
          </button>
        </div>
      </section>

      <section className="home-stats" aria-label="站点内容统计">
        <Stat value={String(componentDocs.length)} label="组件" />
        <Stat value={String(foundationDocs.length)} label="基础规范" />
        <Stat value={String(patternDocs.length)} label="业务模式" />
        <Stat value={String(templateDocs.length)} label="页面模板" />
        <Stat value="3" label="AI 契约文件" />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><div className="eyebrow">组件 Components</div><h2>按分类查找</h2></div>
        </div>
        <div className="category-grid">
          {componentCategories.map((category) => {
            const docs = componentDocs.filter((doc) => doc.category === category.id);
            if (docs.length === 0) return null;
            return (
              <button key={category.id} className="category-card" onClick={() => navigate(`/components/${docs[0].id}`)}>
                <div className="category-card-top">
                  <span className="category-icon">{categoryIcon(category.id)}</span>
                  <span className="category-count">{docs.length}</span>
                </div>
                <h3>{category.chineseName} <span>{category.name}</span></h3>
                <p>{category.description}</p>
                <span className="category-names">{docs.slice(0, 4).map((doc) => doc.name).join(" · ")}{docs.length > 4 ? " …" : ""}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><div className="eyebrow">差异化</div><h2>DataCore 专属组件</h2></div>
        </div>
        <div className="quick-grid quick-grid-3">
          {componentDocs.filter((doc) => doc.category === "datacore").slice(0, 6).map((doc) => (
            <QuickCard key={doc.id} title={`${doc.name} ${doc.chineseName}`} text={doc.purpose} onClick={() => navigate(`/components/${doc.id}`)} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><div className="eyebrow">流程与页面</div><h2>业务模式与页面模板</h2></div>
        </div>
        <div className="quick-grid quick-grid-2">
          <QuickCard icon={<FlaskConical />} title="业务模式 Patterns" text={`${patternDocs.length} 个跨组件流程约定：Agent 确认、数据导入、引用定位、权限边界…`} onClick={() => patternDocs[0] && navigate(`/patterns/${patternDocs[0].id}`)} />
          <QuickCard icon={<LayoutTemplate />} title="页面模板 Templates" text={`${templateDocs.length} 个完整页面组合：列表页、详情页、表单向导、Agent 工作区…`} onClick={() => templateDocs[0] && navigate(`/templates/${templateDocs[0].id}`)} />
          <QuickCard icon={<Palette />} title="基础 Foundations" text="色彩、排版、间距、图标、动效、响应式与无障碍基线。" onClick={() => foundationDocs[0] && navigate(`/foundations/${foundationDocs[0].id}`)} />
          <QuickCard icon={<Terminal />} title="AI 可读契约" text="llms.txt、component-registry.json 由 catalog 自动生成，与页面保持一致。" href="./llms.txt" />
        </div>
      </section>

      <section className="section-block home-sculpture">
        <div className="section-heading">
          <div><div className="eyebrow">视觉研究</div><h2>相同的单元，更多的组合</h2></div>
        </div>
        <div className="home-sculpture-grid">
          <DesignSculpture />
          <div className="home-sculpture-copy">
            <p>这件模数雕塑是 DataCore Design 的视觉锚点：规则在组合中保持秩序。它只是视觉研究，不承担导航、状态或任何重要信息。</p>
            <ul className="rule-list">
              <li>默认渲染静态海报，点击“探索 3D”后才加载模型。</li>
              <li>不自动旋转，视角由用户控制并可重置。</li>
              <li>组件详情页不出现 3D；移动端优先静态图。</li>
            </ul>
            <button className="text-link" onClick={() => navigate("/principles")}>阅读设计原则 <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>

      <section className="notice-card notice-blue">
        <div className="notice-icon"><ShieldCheck size={18} /></div>
        <div>
          <strong>公开的设计系统参考</strong>
          <p>本站点是 DataCore 主平台的公开规范镜像：不包含凭据、内部地址、用户数据或实验数据；示例全部为合成数据。</p>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="home-stat"><strong>{value}</strong><span>{label}</span></div>;
}

function QuickCard({ icon, title, text, onClick, href }: { icon?: ReactNode; title: string; text: string; onClick?: () => void; href?: string }) {
  const body = (
    <>
      {icon && <div className="quick-icon">{icon}</div>}
      <div><h3>{title}</h3><p>{text}</p></div>
      <ArrowRight className="quick-arrow" size={16} />
    </>
  );
  return href
    ? <a className="quick-card" href={href}>{body}</a>
    : <button className="quick-card" onClick={onClick}>{body}</button>;
}

function categoryIcon(id: string) {
  const icons: Record<string, ReactNode> = {
    general: <Boxes size={17} />,
    layout: <Layers3 size={17} />,
    navigation: <ArrowRight size={17} />,
    entry: <Search size={17} />,
    display: <LayoutTemplate size={17} />,
    feedback: <Sparkles size={17} />,
    overlay: <Layers3 size={17} />,
    datacore: <FlaskConical size={17} />,
  };
  return icons[id] ?? <Boxes size={17} />;
}
