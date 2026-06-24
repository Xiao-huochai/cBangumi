import type { ArticleStatus } from "@/api";

export const ARTICLE_MANAGE_PAGE_SIZE = 30;

export const articleStatusTabs: Array<{ label: string; value: ArticleStatus }> = [
  { label: "草稿", value: "DRAFT" },
  { label: "已发布", value: "PUBLISHED" },
  { label: "已隐藏", value: "HIDDEN" },
];
