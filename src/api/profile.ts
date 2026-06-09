import { api } from "@/api/client";

import type { PageResult } from "@/types";
import type { SubjectType } from "./request";

export type CollectionStatus =
  | "WISH"
  | "DOING"
  | "DONE"
  | "ON_HOLD"
  | "DROPPED";

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatarId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatsSummary {
  collectionCount: number;
  ratingCount: number;
  commentCount: number;
}

export interface UserTypeStatsItem {
  type: SubjectType;
  collectionCount: number;
  ratingCount: number;
  commentCount: number;
}

export interface UserCollectionStats {
  totalCount: number;
  wishCount: number;
  doingCount: number;
  doneCount: number;
  onHoldCount: number;
  droppedCount: number;
}

export interface UserStats {
  summary: UserStatsSummary;
  collection: UserCollectionStats;
  byType: UserTypeStatsItem[];
}

export interface UserCollectionItem {
  id: number;
  subjectId: number;
  subjectType: SubjectType;
  subjectName: string;
  subjectNameCn?: string | null;
  coverUrl: string;
  status: CollectionStatus;
  score?: number | null;
  comment?: string | null;
  date?: string | null;
  updatedAt: string;
}

export interface UserRatingItem {
  id: number;
  subjectId: number;
  subjectType: SubjectType;
  subjectName: string;
  subjectNameCn?: string | null;
  coverUrl: string;
  score: number;
  comment?: string | null;
  updatedAt: string;
}

export interface UserCommentItem {
  id: number;
  subjectId: number;
  subjectType: SubjectType;
  subjectName: string;
  subjectNameCn?: string | null;
  coverUrl: string;
  comment: string;
  score?: number | null;
  updatedAt: string;
}

export interface GetMyCollectionsParams {
  page?: number;
  size?: number;
  type?: SubjectType;
  status?: CollectionStatus;
}

export interface GetMyRatingsParams {
  page?: number;
  size?: number;
  type?: SubjectType;
}

export interface GetMyCommentsParams {
  page?: number;
  size?: number;
  type?: SubjectType;
}

export function getMyProfile() {
  return api.get<UserProfile>("/api/users/me");
}

export function getMyStats() {
  return api.get<UserStats>("/api/users/me/stats");
}

export function getMyCollections(params: GetMyCollectionsParams = {}) {
  return api.get<PageResult<UserCollectionItem>>("/api/users/me/collections", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
    status: params.status,
  });
}

export function getMyRatings(params: GetMyRatingsParams = {}) {
  return api.get<PageResult<UserRatingItem>>("/api/users/me/ratings", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
  });
}

export function getMyComments(params: GetMyCommentsParams = {}) {
  return api.get<PageResult<UserCommentItem>>("/api/users/me/comments", {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
  });
}
