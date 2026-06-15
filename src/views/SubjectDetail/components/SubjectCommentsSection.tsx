import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { InfiniteData } from "@tanstack/react-query";

import {
  getSubjectComments,
  likeComment,
  unlikeComment,
  type CommentItem,
  type SubjectCommentSort,
} from "@/api";
import { RatingStars } from "@/components/RatingStars";
import type { PageResult } from "@/types";
import { useAuthStore } from "@/store";
import styles from "./SubjectCommentsSection.module.scss";

interface SubjectCommentsSectionProps {
  subjectId: number;
}

const sortOptions: Array<{ label: string; value: SubjectCommentSort }> = [
  { label: "最新", value: "latest" },
  { label: "最早", value: "oldest" },
  { label: "最热", value: "mostLiked" },
];

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ").slice(0, 16);
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function resolveAvatarSrc(comment: CommentItem) {
  if (comment.avatarUrl) {
    return comment.avatarUrl;
  }

  if (
    /^https?:\/\//.test(comment.avatarId) ||
    comment.avatarId.startsWith("/")
  ) {
    return comment.avatarId;
  }

  return "";
}

function getDisplayInitial(name: string) {
  const value = name.trim();

  return value ? value.slice(0, 1).toUpperCase() : "?";
}

function replaceCommentInPages(
  current: InfiniteData<PageResult<CommentItem>> | undefined,
  nextComment: CommentItem,
) {
  if (!current) {
    return current;
  }

  return {
    ...current,
    pages: current.pages.map((page) => ({
      ...page,
      records: page.records.map((comment) =>
        comment.id === nextComment.id ? nextComment : comment,
      ),
    })),
  };
}

function SubjectCommentsSection({ subjectId }: SubjectCommentsSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { initialized, isAuthenticated, user } = useAuthStore();
  const [sort, setSort] = useState<SubjectCommentSort>("latest");
  const commentsQueryKey = ["subject-comments", subjectId, sort] as const;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: commentsQueryKey,
    queryFn: ({ pageParam }) =>
      getSubjectComments(subjectId, {
        page: pageParam,
        size: 20,
        sort,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 7,
    refetchInterval: 1000 * 60 * 7,
  });
  const comments = data?.pages.flatMap((page) => page.records) ?? [];
  const isRefreshingSort = isFetching && !isFetchingNextPage && comments.length > 0;

  const toggleLikeMutation = useMutation({
    mutationFn: async (comment: CommentItem) => {
      if (comment.liked) {
        return unlikeComment(comment.id);
      }

      return likeComment(comment.id);
    },
    onSuccess: (nextComment) => {
      queryClient.setQueryData<InfiniteData<PageResult<CommentItem>>>(
        commentsQueryKey,
        (current) => replaceCommentInPages(current, nextComment),
      );
    },
  });

  function handleToggleLike(comment: CommentItem) {
    if (toggleLikeMutation.isPending) {
      return;
    }

    if (!initialized) {
      return;
    }

    if (!isAuthenticated || !user) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    void toggleLikeMutation.mutateAsync(comment);
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>评论区</h2>
          <p>{isRefreshingSort ? "正在更新排序..." : `${comments.length} 条已加载评论`}</p>
        </div>

        <div className={styles.sortGroup} role="tablist" aria-label="评论排序">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={
                option.value === sort ? styles.sortActive : styles.sortButton
              }
              type="button"
              onClick={() => setSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.commentPlaceholder}>评论加载中...</div>
      ) : null}

      {!isLoading && error ? (
        <div className={styles.commentPlaceholder}>
          {error instanceof Error ? error.message : "评论加载失败"}
        </div>
      ) : null}

      {!isLoading && !error && comments.length === 0 ? (
        <div className={styles.commentPlaceholder}>还没有人发表公开评论。</div>
      ) : null}

      {!isLoading && !error && comments.length > 0 ? (
        <div className={styles.commentList}>
          {comments.map((comment) => {
            const avatarSrc = resolveAvatarSrc(comment);
            const isLikingCurrentComment =
              toggleLikeMutation.isPending &&
              toggleLikeMutation.variables?.id === comment.id;

            return (
              <article key={comment.id} className={styles.commentCard}>
                <div className={styles.commentAvatar}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={`${comment.userName} 的头像`} />
                  ) : (
                    <span>{getDisplayInitial(comment.userName)}</span>
                  )}
                </div>

                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <div className={styles.authorRow}>
                      <strong>{comment.userName}</strong>
                      {comment.score ? (
                        <span className={styles.scoreRow}>
                          <RatingStars score={comment.score} size={14} />
                          <span>{comment.score.toFixed(1)}</span>
                        </span>
                      ) : (
                        <span className={styles.scoreEmpty}>未评分</span>
                      )}
                    </div>

                    <time dateTime={comment.createdAt}>
                      {formatCommentDate(comment.createdAt)}
                    </time>
                  </div>

                  <p className={styles.commentContent}>{comment.content}</p>

                  <div className={styles.commentActions}>
                    <button
                      className={
                        comment.liked ? styles.likeActive : styles.likeButton
                      }
                      type="button"
                      disabled={isLikingCurrentComment}
                      onClick={() => handleToggleLike(comment)}
                    >
                      <Heart size={16} />
                      <span>{comment.likeCount}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {hasNextPage ? (
            <button
              className={styles.loadMoreButton}
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? "加载中..." : "加载更多评论"}
            </button>
          ) : (
            <div className={styles.listFootnote}>已经到底了</div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default SubjectCommentsSection;
