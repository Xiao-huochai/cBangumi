import { api } from "@/api/client";

import type { PageResult } from "@/types";

export type SubjectCommentSort = "latest" | "oldest" | "mostLiked";

export interface CommentItem {
  id: number;
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  userId: number;
  userName: string;
  avatarId: string;
  avatarUrl: string;
  score: number | null;
  likeCount: number;
  liked: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSubjectCommentsParams {
  page?: number;
  size?: number;
  sort?: SubjectCommentSort;
}

export function getSubjectComments(
  subjectId: number,
  params: GetSubjectCommentsParams = {},
) {
  return api.get<PageResult<CommentItem>>(`/api/subjects/${subjectId}/comments`, {
    page: params.page ?? 1,
    size: params.size ?? 20,
    sort: params.sort ?? "latest",
  });
}

export function likeComment(commentId: number) {
  return api.post<CommentItem>(`/api/comments/${commentId}/like`);
}

export function unlikeComment(commentId: number) {
  return api.delete<CommentItem>(`/api/comments/${commentId}/like`);
}
