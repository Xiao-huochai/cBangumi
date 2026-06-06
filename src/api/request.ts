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
