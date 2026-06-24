import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { searchSubjects } from "@/api";
import type { SearchMode, SubjectType } from "@/api/request";

const SEARCH_PAGE_SIZE = 20;

interface SubmittedSearch {
  keyword: string;
  type: SubjectType;
  mode: SearchMode;
}

function getSearchQueryKey(search: SubmittedSearch | null) {
  return [
    "subject-search",
    search?.keyword ?? "",
    search?.type ?? "GAME",
    search?.mode ?? "FUZZY",
    SEARCH_PAGE_SIZE,
  ] as const;
}

export function useSubjectSearch() {
  const [keywordInput, setKeywordInput] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType>("GAME");
  const [searchMode, setSearchMode] = useState<SearchMode>("FUZZY");
  const [submittedSearch, setSubmittedSearch] = useState<SubmittedSearch | null>(null);

  const query = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: getSearchQueryKey(submittedSearch),
    queryFn: ({ pageParam }) =>
      searchSubjects({
        keyword: submittedSearch?.keyword ?? "",
        type: submittedSearch?.type ?? "GAME",
        mode: submittedSearch?.mode ?? "FUZZY",
        page: pageParam,
        size: SEARCH_PAGE_SIZE,
      }),
    enabled: submittedSearch !== null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

  function submitSearch() {
    const keyword = keywordInput.trim();

    if (!keyword) {
      setSubmittedSearch(null);
      return;
    }

    setSubmittedSearch({
      keyword,
      type: subjectType,
      mode: searchMode,
    });
  }

  return {
    keywordInput,
    setKeywordInput,
    subjectType,
    setSubjectType,
    searchMode,
    setSearchMode,
    submittedSearch,
    submitSearch,
    query,
  };
}
