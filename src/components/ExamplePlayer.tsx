import { Check, Clipboard, Code2, Eye, FileJson, Moon, RotateCcw, Sun } from "lucide-react";
import { useState } from "react";
import type { ComponentDoc, ExampleDoc } from "../catalog/types";
import { getPreview } from "../previews";

type Tab = "preview" | "code" | "json";

async function copyText(text: string, done: () => void) {
  try {
    await navigator.clipboard.writeText(text);
    done();
  } catch {
    /* clipboard can be unavailable in embedded previews */
  }
}

function contractFor(doc: ComponentDoc, example: ExampleDoc) {
  return JSON.stringify(
    {
      id: `dc.${doc.id}`,
      name: doc.name,
      chineseName: doc.chineseName,
      category: doc.category,
      status: doc.status,
      version: doc.version,
      example: { id: example.id, kind: example.kind, title: example.title },
      requiredProps: doc.props.filter((prop) => prop.required).map((prop) => prop.name),
      states: doc.states.filter((state) => state.applicable !== false).map((state) => state.name),
    },
    null,
    2,
  );
}

export function ExamplePlayer({ doc, example }: { doc: ComponentDoc; example: ExampleDoc }) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [darkPreview, setDarkPreview] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const Preview = getPreview(example.preview);
  const code = showFull && example.fullCode ? example.fullCode : example.code;
  const json = contractFor(doc, example);

  return (
    <div className="example-player" id={`example-${example.id}`}>
      <div className="example-head">
        <div className="example-title">
          <strong>{example.title}</strong>
          <span className={`kind-badge kind-${example.kind}`}>{kindLabel(example.kind)}</span>
        </div>
        <div className="example-tools" role="tablist" aria-label={`${example.title} 查看方式`}>
          <button role="tab" aria-selected={tab === "preview"} className={tab === "preview" ? "tab-active" : ""} onClick={() => setTab("preview")}>
            <Eye size={14} /> 预览
          </button>
          <button role="tab" aria-selected={tab === "code"} className={tab === "code" ? "tab-active" : ""} onClick={() => setTab("code")}>
            <Code2 size={14} /> 代码
          </button>
          <button role="tab" aria-selected={tab === "json"} className={tab === "json" ? "tab-active" : ""} onClick={() => setTab("json")}>
            <FileJson size={14} /> JSON 契约
          </button>
        </div>
      </div>
      {example.description && <p className="example-description">{example.description}</p>}

      {tab === "preview" && (
        <>
          <div className={`example-stage ${darkPreview ? "theme-dark" : ""}`} key={resetKey}>
            {Preview ? <Preview /> : <div className="example-missing">该示例暂无可交互预览，请查看代码。</div>}
          </div>
          <div className="example-actions">
            <button onClick={() => setResetKey((value) => value + 1)}><RotateCcw size={13} /> 重置示例</button>
            <button onClick={() => setDarkPreview((value) => !value)} aria-pressed={darkPreview}>
              {darkPreview ? <Sun size={13} /> : <Moon size={13} />} {darkPreview ? "浅色预览" : "深色预览"}
            </button>
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="example-code">
          <pre><code>{code}</code></pre>
          <div className="example-actions">
            <button onClick={() => copyText(code, () => { setCopied(true); window.setTimeout(() => setCopied(false), 1400); })}>
              {copied ? <Check size={13} /> : <Clipboard size={13} />} {copied ? "已复制" : "复制代码"}
            </button>
            {example.fullCode && (
              <button onClick={() => setShowFull((value) => !value)}>{showFull ? "查看最小代码" : "查看完整代码"}</button>
            )}
          </div>
        </div>
      )}

      {tab === "json" && (
        <div className="example-code">
          <pre><code>{json}</code></pre>
          <div className="example-actions">
            <button onClick={() => copyText(json, () => { setCopied(true); window.setTimeout(() => setCopied(false), 1400); })}>
              {copied ? <Check size={13} /> : <Clipboard size={13} />} {copied ? "已复制" : "复制 JSON"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function kindLabel(kind: ExampleDoc["kind"]) {
  return { basic: "基础", variant: "变体", state: "状态", size: "尺寸", business: "业务" }[kind];
}
