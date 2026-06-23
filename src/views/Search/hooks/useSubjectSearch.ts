import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchSubjects } from "@/api";
import type { SearchMode, SubjectType } from "@/api/request";

const SEARCH_PAGE_SIZE = 20;

interface SubmittedSearch {
  keyword: string;
  type: SubjectType;
  mode: SearchMode;
}

function getSearchQueryKey(search: SubmittedSearch | null, page: number) {
  return [
    "subject-search",
    search?.keyword ?? "",
    search?.type ?? "GAME",
    search?.mode ?? "FUZZY",
    page,
    SEARCH_PAGE_SIZE,
  ] as const;
}

export function useSubjectSearch() {
  const [keywordInput, setKeywordInput] = useState("");
  const [subjectType, setSubjectType] = useState<SubjectType>("GAME");
  const [searchMode, setSearchMode] = useState<SearchMode>("FUZZY");
  const [page, setPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState<SubmittedSearch | null>(null);

  const query = useQuery({
    queryKey: getSearchQueryKey(submittedSearch, page),
    queryFn: () =>
      searchSubjects({
        keyword: submittedSearch?.keyword ?? "",
        type: submittedSearch?.type ?? "GAME",
        mode: submittedSearch?.mode ?? "FUZZY",
        page,
        size: SEARCH_PAGE_SIZE,
      }),
    enabled: submittedSearch !== null,
    staleTime: 1000 * 60 * 5,
  });

  function submitSearch() {
    const keyword = keywordInput.trim();

    if (!keyword) {
      setSubmittedSearch(null);
      setPage(1);
      return;
    }

    setSubmittedSearch({
      keyword,
      type: subjectType,
      mode: searchMode,
    });
    setPage(1);
  }

  return {
    keywordInput,
    setKeywordInput,
    subjectType,
    setSubjectType,
    searchMode,
    setSearchMode,
    page,
    setPage,
    submittedSearch,
    submitSearch,
    query,
  };
}
