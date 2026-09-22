import type { PreviewFn } from "./types";
import { generalPreviews } from "./general";
import { layoutNavPreviews } from "./layout-nav";
import { entryPreviews } from "./entry";
import { displayPreviews } from "./display";
import { datacorePreviews } from "./datacore";
import { foundationPreviews } from "./foundations";
import { patternPreviews } from "./patterns";
import { templatePreviews } from "./templates";

const registry: Record<string, PreviewFn> = {
  ...generalPreviews,
  ...layoutNavPreviews,
  ...entryPreviews,
  ...displayPreviews,
  ...datacorePreviews,
  ...foundationPreviews,
  ...patternPreviews,
  ...templatePreviews,
};

export function getPreview(key: string): PreviewFn | undefined {
  return registry[key];
}

export function previewKeys(): string[] {
  return Object.keys(registry);
}
