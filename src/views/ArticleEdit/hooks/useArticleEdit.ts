import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  getArticleDetail,
  publishArticle,
  updateArticle,
  type CreateArticlePayload,
} from "@/api";

export function useArticleEdit(articleId: number, enabled: boolean) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successText, setSuccessText] = useState("");
  const articleQuery = useQuery({
    queryKey: ["article-detail", articleId],
    queryFn: () => getArticleDetail(articleId),
    enabled,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateArticlePayload) => updateArticle(articleId, payload),
    onSuccess: () => {
      setSuccessText("文章已保存");
      void queryClient.invalidateQueries({
        queryKey: ["article-detail", articleId],
      });
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (payload: CreateArticlePayload) => {
      await updateArticle(articleId, payload);

      return publishArticle(articleId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      navigate("/articles/manage");
    },
  });

  function saveArticle(payload: CreateArticlePayload) {
    setSuccessText("");
    updateMutation.mutate(payload);
  }

  function publishEditedArticle(payload: CreateArticlePayload) {
    setSuccessText("");
    publishMutation.mutate(payload);
  }

  return {
    articleQuery,
    publishEditedArticle,
    publishMutation,
    saveArticle,
    successText,
    updateMutation,
  };
}
