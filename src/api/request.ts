import { api } from "@/api/client";

import type { PageResult } from "@/types";

export type SubjectType = "BOOK" | "ANIME" | "MUSIC" | "GAME" | "REAL";
export type SubjectSort =
  | "CREATED_AT"
  | "DATE"
  | "SCORE"
  | "RANK"
  | "SITE_SCORE"
  | "SITE_RANK"
  | "FAVORITE_DONE"
  | "FAVORITE_TOTAL"
  | "ID";
export type SortOrder = "ASC" | "DESC";
export type SearchMode = "FUZZY" | "EXACT";

export interface RankItem {
  id: number;
  title?: string;
  type?: SubjectType;
  name?: string;
  nameCn?: string | null;
  score?: number | null;
  rank?: number | null;
  date?: string | null;
  siteScore: number;
  siteRank?: number;
  siteScoreCount?: number;
  siteRankScore?: number;
  coverUrl: string;
}

export interface GetRankListParams {
  page?: number;
  size?: number;
  type?: SubjectType;
  metaTag?: string;
  sort?: SubjectSort;
  order?: SortOrder;
}

export function getRankList(params: GetRankListParams = {}) {
  return api.get<PageResult<RankItem>>("/api/subjects/ranking", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
    metaTag: params.metaTag,
    sort: params.sort,
    order: params.order,
  });
}

export interface SubjectSearchItem {
  id: number;
  type: SubjectType;
  title?: string;
  name?: string;
  nameCn?: string | null;
  date?: string | null;
  score?: number | null;
  rank?: number | null;
  summary?: string | null;
  coverUrl: string;
}

export interface SearchSubjectsParams {
  keyword: string;
  type?: SubjectType;
  mode?: SearchMode;
  page?: number;
  size?: number;
}

export function searchSubjects(params: SearchSubjectsParams) {
  return api.get<PageResult<SubjectSearchItem>>("/api/search/subjects", {
    keyword: params.keyword,
    type: params.type,
    mode: params.mode ?? "FUZZY",
    page: params.page ?? 1,
    size: params.size ?? 20,
  });
}

export interface SubjectDetail {
  id: number;
  type: SubjectType;
  name: string;
  nameCn: string | null;
  summary: string | null;
  score: number | null;
  rank: number | null;
  date: string | null;
  siteScore: number;
  siteScoreCount: number;
  siteRankScore: number;
  coverUrl: string;
  tags: SubjectTag[] | string | null;
  largeImageUrl?: string;
  commonImageUrl?: string;
  mediumImageUrl?: string;
  smallImageUrl?: string;
  gridImageUrl?: string;
}

export interface SubjectTag {
  name: string;
  count: number;
}

export function getSubjectDetail(subjectId: number) {
  return api.get<SubjectDetail>(`/api/subjects/${subjectId}`);
}
