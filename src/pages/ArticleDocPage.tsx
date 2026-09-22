import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import type { ArticleDoc } from "../catalog/types";
import { getPreview } from "../previews";
import { navigate } from "../router";

export function ArticleDocPage({ doc, eyebrow }: { doc: ArticleDoc; eyebrow: string }) {
  return (
    <article className="doc-page">
      <header className="doc-header">
        <div className="doc-header-main">
          <span className="component-meta">{eyebrow}</span>
          <h1>{doc.name} <span className="doc-cn">{doc.chineseName}</span></h1>
          <p className="doc-purpose">{doc.summary}</p>
        </div>
        <div className="doc-badges">
          <span className={`status-chip chip-${doc.status}`}>{statusLabel(doc.status)}</span>
        </div>
      </header>

      {doc.sections.map((section) => {
        const Preview = section.preview ? getPreview(section.preview) : undefined;
        return (
          <section className="doc-section" id={section.id} key={section.id}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph.slice(0, 24)} className="doc-paragraph">{paragraph}</p>)}
            {section.list && (
              <ul className="rule-list">
                {section.list.map((item) => <li key={item.slice(0, 24)}>{item}</li>)}
              </ul>
            )}
            {Preview && (
              <div className="example-player">
                <div className="example-stage"><Preview /></div>
              </div>
            )}
            {section.code && <CodeBlock code={section.code} title={section.codeTitle} />}
          </section>
        );
      })}

      {doc.related.length > 0 && (
        <section className="doc-section" id="related">
          <h2>相关内容</h2>
          <div className="related-row">
            {doc.related.map((path) => (
              <button key={path} className="related-chip" onClick={() => navigate(path)}>
                {relatedLabel(path)}
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="example-code">
      {title && <div className="code-title">{title}</div>}
      <pre><code>{code}</code></pre>
      <div className="example-actions">
        <button onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          } catch { /* clipboard unavailable */ }
        }}>
          {copied ? <Check size={13} /> : <Clipboard size={13} />} {copied ? "已复制" : "复制"}
        </button>
      </div>
    </div>
  );
}

function relatedLabel(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

function statusLabel(status: ArticleDoc["status"]) {
  return { stable: "Stable", beta: "Beta", experimental: "Experimental" }[status];
}
