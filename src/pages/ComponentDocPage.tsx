import { CircleCheck, CircleX, FileJson, Terminal } from "lucide-react";
import type { ComponentDoc } from "../catalog/types";
import { categoryOf, getComponent } from "../catalog";
import { navigate } from "../router";
import { ExamplePlayer } from "../components/ExamplePlayer";

import { EXAMPLE_GROUPS } from "../toc";

export function ComponentDocPage({ doc }: { doc: ComponentDoc }) {
  const category = categoryOf(doc.category);
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">{category?.name} / {doc.name}</span>
          <h1>{doc.name} <span className="doc-cn">{doc.chineseName}</span></h1>
          <p className="doc-purpose">{doc.purpose}</p>
        </div>
        <div className="doc-badges">
          <span className={`status-chip chip-${doc.status}`}>{statusLabel(doc.status)}</span>
          <span className="version-chip">v{doc.version}</span>
          <a className="version-chip chip-link" href="./component-registry.json" target="_blank" rel="noreferrer">
            <FileJson size={12} /> 注册表
          </a>
          <a className="version-chip chip-link" href="./llms-full.txt" target="_blank" rel="noreferrer">
            <Terminal size={12} /> AI 契约
          </a>
        </div>
      </header>

      <section className="doc-usage">
        <h2>何时使用</h2>
        <p>{doc.usage}</p>
      </section>

      {EXAMPLE_GROUPS.map((group) => {
        const examples = doc.examples.filter((example) => example.kind === group.kind);
        if (examples.length === 0) return null;
        return (
          <section className="doc-section" id={group.anchor} key={group.kind}>
            <h2>{group.heading}</h2>
            {examples.map((example) => <ExamplePlayer key={example.id} doc={doc} example={example} />)}
          </section>
        );
      })}

      <section className="doc-section" id="api">
        <h2>API / Props</h2>
        <div className="props-table-wrap">
          <table className="props-table">
            <caption className="sr-only">{doc.name} 属性表</caption>
            <thead>
              <tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr>
            </thead>
            <tbody>
              {doc.props.map((prop) => (
                <tr key={prop.name}>
                  <td><code>{prop.name}</code>{prop.required && <em className="required-mark" title="必填">*</em>}</td>
                  <td><code className="prop-type">{prop.type}</code></td>
                  <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section" id="states">
        <h2>状态契约</h2>
        <p className="doc-note">每个组件都必须回答完整状态集；不适用的状态也要明确说明原因。</p>
        <div className="states-grid">
          {doc.states.map((state) => (
            <div className={`state-card ${state.applicable === false ? "state-na" : ""}`} key={state.name}>
              <code>{state.name}</code>
              {state.applicable === false && <span className="state-na-badge">不适用</span>}
              <p>{state.note}</p>
            </div>
          ))}
        </div>
      </section>

      <RuleSection id="interaction" title="交互规则" items={doc.interaction} />
      <RuleSection id="keyboard" title="键盘行为" items={doc.keyboard} />
      <RuleSection id="accessibility" title="无障碍要求" items={doc.accessibility} />
      <RuleSection id="responsive" title="响应式行为" items={doc.responsive} />
      <RuleSection id="content" title="内容规范" items={doc.content} />

      <section className="doc-section" id="do-dont">
        <h2>Do / Don't</h2>
        <div className="dodont-grid">
          <div className="dodont-card dodont-do">
            <h3><CircleCheck size={16} /> Do</h3>
            <ul>{doc.dos.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="dodont-card dodont-dont">
            <h3><CircleX size={16} /> Don't</h3>
            <ul>{doc.donts.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="doc-section" id="related">
        <h2>相关组件</h2>
        <div className="related-row">
          {doc.related.map((id) => {
            const target = getComponent(id);
            return (
              <button key={id} className="related-chip" onClick={() => navigate(`/components/${id}`)}>
                {target ? `${target.name} ${target.chineseName}` : id}
              </button>
            );
          })}
        </div>
      </section>
    </article>
  );
}

function RuleSection({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <section className="doc-section" id={id}>
      <h2>{title}</h2>
      <ul className="rule-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function statusLabel(status: ComponentDoc["status"]) {
  return { stable: "Stable", beta: "Beta", experimental: "Experimental" }[status];
}
