import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyCollections } from "@/api";
import type { SubjectType } from "@/api/request";

const COLLECTION_PAGE_SIZE = 30;

export function useArticleSubjectCollections(
  subjectType: SubjectType,
  enabled: boolean,
) {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["article-subject-collections", subjectType, COLLECTION_PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getMyCollections({
        page: pageParam,
        size: COLLECTION_PAGE_SIZE,
        type: subjectType,
      }),
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
}
