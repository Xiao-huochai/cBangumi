import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  createArticle,
  getMyArticleList,
  publishArticle,
  type CreateArticlePayload,
} from "@/api";

export function useArticleCreateDraft() {
  const navigate = useNavigate();
  const [successText, setSuccessText] = useState("");
  const draftsQuery = useQuery({
    queryKey: ["my-articles", "latest-draft"],
    queryFn: () =>
      getMyArticleList({
        page: 1,
        size: 1,
        status: "DRAFT",
      }),
    staleTime: 0,
  });

  useEffect(() => {
    const latestDraft = draftsQuery.data?.records[0];

    if (latestDraft) {
      navigate(`/articles/${latestDraft.id}/edit`, { replace: true });
    }
  }, [draftsQuery.data, navigate]);

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (article) => {
      setSuccessText("草稿已保存");
      navigate(`/articles/${article.id}/edit`, { replace: true });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (payload: CreateArticlePayload) => {
      const article = await createArticle(payload);

      return publishArticle(article.id);
    },
    onSuccess: () => {
      navigate("/articles/manage");
    },
  });

  function saveDraft(payload: CreateArticlePayload) {
    setSuccessText("");
    createMutation.mutate(payload);
  }

  function publishDraft(payload: CreateArticlePayload) {
    setSuccessText("");
    publishMutation.mutate(payload);
  }

  return {
    createMutation,
    draftsQuery,
    publishMutation,
    publishDraft,
    saveDraft,
    successText,
  };
}
