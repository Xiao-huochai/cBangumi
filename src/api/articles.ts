import { api } from "@/api/client";

import type { PageResult } from "@/types";

export type ArticleSort = "publishedAt" | "updatedAt" | "viewCount";
export type ArticleStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface ArticleCard {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  coverUrl?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  viewCount?: number;
  status?: ArticleStatus;
  subjectId?: number | null;
  subjectTitle?: string | null;
  subjectCoverUrl?: string | null;
}

export interface ArticleDetail extends ArticleCard {
  content: string;
  contentFormat?: "MARKDOWN";
}

export interface GetArticleListParams {
  page?: number;
  size?: number;
  subjectId?: number;
  sort?: ArticleSort;
  order?: "ASC" | "DESC";
}

export interface CreateArticlePayload {
  subjectId?: number;
  title: string;
  summary?: string;
  coverUrl?: string;
  content: string;
  contentFormat: "MARKDOWN";
}

export interface GetMyArticleListParams {
  page?: number;
  size?: number;
  status?: ArticleStatus;
}

export interface ArticleImageUploadResult {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
}

export function getArticleList(params: GetArticleListParams = {}) {
  return api.get<PageResult<ArticleCard>>("/api/articles", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    subjectId: params.subjectId,
    sort: params.sort,
    order: params.order,
  });
}

export function createArticle(data: CreateArticlePayload) {
  return api.post<ArticleCard>("/api/articles", data);
}

export function getArticleDetail(articleId: number) {
  return api.get<ArticleDetail>(`/api/articles/${articleId}`);
}

export function getMyArticleList(params: GetMyArticleListParams = {}) {
  return api.get<PageResult<ArticleCard>>("/api/me/articles", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    status: params.status,
  });
}

export function updateArticle(articleId: number, data: CreateArticlePayload) {
  return api.put<ArticleCard>(`/api/articles/${articleId}`, data);
}

export function publishArticle(articleId: number) {
  return api.post<ArticleCard>(`/api/articles/${articleId}/publish`);
}

export function hideArticle(articleId: number) {
  return api.post<ArticleCard>(`/api/articles/${articleId}/hide`);
}

export function deleteArticle(articleId: number) {
  return api.delete<void>(`/api/articles/${articleId}`);
}

export function uploadArticleImage(file: File) {
  const data = new FormData();
  data.append("file", file);

  return api.post<ArticleImageUploadResult>("/api/uploads/article-images", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
