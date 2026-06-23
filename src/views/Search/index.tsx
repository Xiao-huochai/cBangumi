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
    page,
    setPage,
    submittedSearch,
    submitSearch,
    query,
  } = useSubjectSearch();

  const records = query.data?.records ?? [];
  const hasPrevious = query.data?.hasPrevious ?? page > 1;
  const hasNext = query.data?.hasNext ?? false;

  return (
    <main className={styles.page}>
      <h1>搜索</h1>
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
        total={query.data?.total ?? 0}
        page={page}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        isLoading={query.isLoading}
        errorMessage={query.error?.message}
        hasSubmittedSearch={submittedSearch !== null}
        onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() => setPage((current) => current + 1)}
      />
    </main>
  );
}

export default SearchView;
