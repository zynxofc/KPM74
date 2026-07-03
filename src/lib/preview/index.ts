import {
  PREVIEW_SETTINGS,
  PREVIEW_MEMBERS,
  PREVIEW_PROGRAMS,
  PREVIEW_GALLERY,
  PREVIEW_POSTS,
  PREVIEW_FAQS,
  PREVIEW_LOCATIONS
} from "./preview-data";

export function isPreviewMode(): boolean {
  return process.env.PREVIEW_MODE === "true";
}

export function getPreviewData(type: "settings"): typeof PREVIEW_SETTINGS;
export function getPreviewData(type: "members"): typeof PREVIEW_MEMBERS;
export function getPreviewData(type: "programs"): typeof PREVIEW_PROGRAMS;
export function getPreviewData(type: "gallery"): typeof PREVIEW_GALLERY;
export function getPreviewData(type: "posts"): typeof PREVIEW_POSTS;
export function getPreviewData(type: "faqs"): typeof PREVIEW_FAQS;
export function getPreviewData(type: "locations"): typeof PREVIEW_LOCATIONS;
export function getPreviewData(type: string): unknown {
  switch (type) {
    case "settings":
      return PREVIEW_SETTINGS;
    case "members":
      return PREVIEW_MEMBERS;
    case "programs":
      return PREVIEW_PROGRAMS;
    case "gallery":
      return PREVIEW_GALLERY;
    case "posts":
      return PREVIEW_POSTS;
    case "faqs":
      return PREVIEW_FAQS;
    case "locations":
      return PREVIEW_LOCATIONS;
    default:
      return null;
  }
}

export function getPreviewPostBySlug(slug: string) {
  const post = PREVIEW_POSTS.find((p) => p.slug === slug) || null;
  const recommendations = PREVIEW_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  return { post, recommendations };
}
