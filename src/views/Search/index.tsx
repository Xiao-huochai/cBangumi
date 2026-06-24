import { useCallback } from "react";

import { PageNavBar } from "@/components/PageNavBar";

import { SearchControls } from "./components/SearchControls";
import { SearchResults } from "./components/SearchResults";
import { useSubjectSearch } from "./hooks/useSubjectSearch";
import styles from "./index.module.scss";

function SearchView() {
  const {
    keywordInput,
    setKeywordInput,
    subjectType,
    setSubjectType,
    searchMode,
    setSearchMode,
    submittedSearch,
    submitSearch,
    query,
  } = useSubjectSearch();

  const records = query.data?.pages.flatMap((page) => page.records) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const {
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = query;
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className={styles.page}>
      <PageNavBar showBackButton title="搜索" />
      <SearchControls
        keyword={keywordInput}
        subjectType={subjectType}
        searchMode={searchMode}
        onKeywordChange={setKeywordInput}
        onSubjectTypeChange={setSubjectType}
        onSearchModeChange={setSearchMode}
        onSubmit={submitSearch}
      />
      <SearchResults
        records={records}
        total={total}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        errorMessage={error?.message}
        hasSubmittedSearch={submittedSearch !== null}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
}

export default SearchView;
