import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import {
  deleteArticle,
  getMyArticleList,
  hideArticle,
  publishArticle,
  type ArticleStatus,
} from "@/api";
import { ARTICLE_MANAGE_PAGE_SIZE, articleStatusTabs } from "../constants";

function isArticleStatus(value: ArticleStatus | null): value is ArticleStatus {
  return Boolean(value && articleStatusTabs.some((tab) => tab.value === value));
}

export function useArticleManage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") as ArticleStatus | null;
  const status = isArticleStatus(currentStatus) ? currentStatus : "DRAFT";
  const articlesQuery = useQuery({
    queryKey: ["my-articles", status, ARTICLE_MANAGE_PAGE_SIZE],
    queryFn: () =>
      getMyArticleList({
        page: 1,
        size: ARTICLE_MANAGE_PAGE_SIZE,
        status,
      }),
    staleTime: 1000 * 60,
  });

  const publishMutation = useMutation({
    mutationFn: publishArticle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
  });

  const hideMutation = useMutation({
    mutationFn: hideArticle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
  });

  return {
    articles: articlesQuery.data?.records ?? [],
    articlesQuery,
    deleteMutation,
    hideMutation,
    publishMutation,
    status,
  };
}
