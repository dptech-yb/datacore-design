export type Route =
  | { kind: "home" }
  | { kind: "start" }
  | { kind: "principles" }
  | { kind: "component"; id: string }
  | { kind: "foundation"; id: string }
  | { kind: "pattern"; id: string }
  | { kind: "template"; id: string }
  | { kind: "ai"; id: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").split("?")[0].replace(/\/+$/, "");
  const [head, id] = path.split("/");
  switch (head) {
    case "":
      return { kind: "home" };
    case "start":
      return { kind: "start" };
    case "principles":
      return { kind: "principles" };
    case "components":
      return id ? { kind: "component", id } : { kind: "home" };
    case "foundations":
      return id ? { kind: "foundation", id } : { kind: "home" };
    case "patterns":
      return id ? { kind: "pattern", id } : { kind: "home" };
    case "templates":
      return id ? { kind: "template", id } : { kind: "home" };
    case "ai":
      return { kind: "ai", id: id || "registry" };
    default:
      return { kind: "home" };
  }
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case "home":
      return "#/";
    case "start":
      return "#/start";
    case "principles":
      return "#/principles";
    case "component":
      return `#/components/${route.id}`;
    case "foundation":
      return `#/foundations/${route.id}`;
    case "pattern":
      return `#/patterns/${route.id}`;
    case "template":
      return `#/templates/${route.id}`;
    case "ai":
      return `#/ai/${route.id}`;
  }
}

export function navigate(path: string) {
  window.location.hash = path.startsWith("/") ? `#${path}` : `#/${path}`;
}
