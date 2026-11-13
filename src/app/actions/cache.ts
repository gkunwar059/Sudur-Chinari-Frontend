"use server";

import { updateTag } from "next/cache";

const ALLOWED_TAG_PREFIXES = [
  "videos",
  "video-",
  "photo-stories",
  "photo-story-",
  "products",
  "product-",
  "product-categories",
  "yatayat",
  "articles",
  "article-",
];

function isAllowedCacheTag(tag: string): boolean {
  return ALLOWED_TAG_PREFIXES.some(
    (prefix) => tag === prefix || tag.startsWith(prefix),
  );
}

export async function revalidateCacheTagsAction(tags: string[]) {
  if (!Array.isArray(tags)) return;
  for (const tag of tags.slice(0, 10)) {
    if (tag && typeof tag === "string" && isAllowedCacheTag(tag)) {
      updateTag(tag);
    }
  }
}

