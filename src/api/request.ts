import { api } from "@/api/client";

import type { PageResult } from "@/types";

export type SubjectType = "BOOK" | "ANIME" | "MUSIC" | "GAME" | "REAL";

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
}

export function getRankList(params: GetRankListParams = {}) {
  return api.get<PageResult<RankItem>>("/api/subjects/ranking", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
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
