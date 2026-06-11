import { api } from "@/api/client";

import type { PageResult } from "@/types";
import { getCurrentUser, type AuthUser } from "./auth";
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

export interface AvatarOption {
  avatarId: string;
  imagePath: string;
}

export interface UpdateMyAvatarPayload {
  avatarId: string;
}

export interface UserCollectionItem {
  id: number;
  userId: number;
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  status: CollectionStatus;
  ratingScore?: number | null;
  commentContent?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRatingItem {
  id: number;
  userId: number;
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  score: number;
  siteScore: number;
  siteScoreCount: number;
  siteRankScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCommentItem {
  id: number;
  userId: number;
  userName: string;
  avatarId: string;
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLibraryItem {
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  collectionStatus?: CollectionStatus | null;
  ratingScore?: number | null;
  commentContent?: string | null;
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
}

export interface GetMyCommentsParams {
  page?: number;
  size?: number;
}

export interface GetMyLibraryParams {
  page?: number;
  size?: number;
}

function getMyUserId() {
  return getCurrentUser().then((user) => user.id);
}

export function getMyProfile() {
  return getCurrentUser();
}

export function getAvatarOptions() {
  return api.get<AvatarOption[]>("/api/users/avatar-options");
}

export function updateMyAvatar(data: UpdateMyAvatarPayload) {
  return api.put<UserProfile>("/api/users/me/avatar", data);
}

export function getUserCollections(
  userId: number,
  params: GetMyCollectionsParams = {},
) {
  return api.get<PageResult<UserCollectionItem>>(`/api/users/${userId}/collections`, {
    page: params.page ?? 1,
    size: params.size ?? 20,
    type: params.type,
    status: params.status,
  });
}

export async function getMyCollections(params: GetMyCollectionsParams = {}) {
  const userId = await getMyUserId();

  return getUserCollections(userId, params);
}

export function getUserRatings(userId: number, params: GetMyRatingsParams = {}) {
  return api.get<PageResult<UserRatingItem>>(`/api/users/${userId}/ratings`, {
    page: params.page ?? 1,
    size: params.size ?? 20,
  });
}

export async function getMyRatings(params: GetMyRatingsParams = {}) {
  const userId = await getMyUserId();

  return getUserRatings(userId, params);
}

export function getUserComments(userId: number, params: GetMyCommentsParams = {}) {
  return api.get<PageResult<UserCommentItem>>(`/api/users/${userId}/comments`, {
    page: params.page ?? 1,
    size: params.size ?? 20,
  });
}

export async function getMyComments(params: GetMyCommentsParams = {}) {
  const userId = await getMyUserId();

  return getUserComments(userId, params);
}

export function getMyLibrary(params: GetMyLibraryParams = {}) {
  return api.get<PageResult<UserLibraryItem>>("/api/users/me/library", {
    page: params.page ?? 1,
    size: params.size ?? 20,
  });
}

export function getUserLibrary(userId: number, params: GetMyLibraryParams = {}) {
  return api.get<PageResult<UserLibraryItem>>(`/api/users/${userId}/library`, {
    page: params.page ?? 1,
    size: params.size ?? 20,
  });
}
