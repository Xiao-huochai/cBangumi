import { useQuery } from "@tanstack/react-query";

import { getArticleDetail } from "@/api";

export function useArticleDetail(articleId: number, disabled: boolean) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["article-detail", articleId],
    queryFn: () => getArticleDetail(articleId),
    enabled: !disabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    article: data,
    error: error?.message,
    loading: isLoading,
  };
}
