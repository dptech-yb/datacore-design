import { Rotate3D, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

type ViewerState = "idle" | "loading" | "ready" | "error";

const modelPath = "./models/modular-form.glb";

/**
 * The poster is the default experience. The model-viewer bundle and GLB only
 * enter the page after an explicit request, keeping the design-system home
 * page fast while still offering a real, inspectable 3D artifact.
 */
export function DesignSculpture() {
  const [viewerState, setViewerState] = useState<ViewerState>("idle");
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => () => {
    window.clearTimeout(timeoutRef.current);
    viewerRef.current?.remove();
    viewerRef.current = null;
  }, []);

  const showViewer = async () => {
    if (viewerState === "loading" || viewerState === "ready") return;
    setViewerState("loading");

    try {
      await import("@google/model-viewer");
      const host = hostRef.current;
      if (!host) return;

      const viewer = document.createElement("model-viewer") as ModelViewerElement;
      viewer.setAttribute("src", modelPath);
      viewer.setAttribute("alt", "由相同模数单元组成的 DataCore 设计雕塑，可拖拽旋转查看");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("interaction-prompt", "none");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("camera-orbit", "36.5deg 63deg 105%");
      viewer.setAttribute("min-camera-orbit", "auto 20deg 40%");
      viewer.setAttribute("max-camera-orbit", "auto 85deg 150%");
      viewer.setAttribute("shadow-intensity", "0.65");
      viewer.setAttribute("exposure", "1.1");
      viewer.className = "sculpture-viewer";

      const onLoad = () => {
        window.clearTimeout(timeoutRef.current);
        setViewerState("ready");
      };
      const onError = () => {
        window.clearTimeout(timeoutRef.current);
        viewer.remove();
        viewerRef.current = null;
        setViewerState("error");
      };
      viewer.addEventListener("load", onLoad, { once: true });
      viewer.addEventListener("error", onError, { once: true });
      host.replaceChildren(viewer);
      viewerRef.current = viewer;
      timeoutRef.current = window.setTimeout(onError, 20000);
    } catch {
      setViewerState("error");
    }
  };

  const resetViewer = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.cameraOrbit = "36.5deg 63deg 105%";
    viewer.jumpCameraToGoal();
  };

  const hideViewer = () => {
    window.clearTimeout(timeoutRef.current);
    viewerRef.current?.remove();
    viewerRef.current = null;
    setViewerState("idle");
  };

  return (
    <figure className={`design-sculpture sculpture-${viewerState}`}>
      <div className="sculpture-stage">
        {viewerState !== "ready" && (
          <img
            className="sculpture-poster"
            width="1024" height="1024" loading="eager" decoding="async"
            src="./models/modular-form.webp"
            alt="由相同模数单元组成的 DataCore 设计雕塑"
          />
        )}
        <div className="sculpture-viewer-host" ref={hostRef} aria-hidden={viewerState !== "ready"} />
        {viewerState === "loading" && <div className="sculpture-status" role="status">正在载入可交互模型…</div>}
        {viewerState === "error" && <div className="sculpture-status sculpture-status-error" role="status">模型暂时无法载入，已保留静态预览。</div>}
        {viewerState === "ready" && (
          <div className="sculpture-controls" aria-label="3D 模型控制">
            <button className="sculpture-control" type="button" onClick={resetViewer}>重置视角</button>
            <button className="sculpture-control" type="button" onClick={hideViewer} aria-label="关闭 3D 模型">静态预览 <X size={13} /></button>
          </div>
        )}
      </div>
      <figcaption className="sculpture-caption">
        {viewerState !== "ready" && (
          <button className="sculpture-open" type="button" onClick={showViewer} disabled={viewerState === "loading"}>
            <Rotate3D size={15} /> {viewerState === "loading" ? "正在载入" : "探索 3D"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
