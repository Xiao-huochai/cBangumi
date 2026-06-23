import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

import { SUBJECT_TYPE_OPTIONS } from "@/constants/subjects";
import type { SearchMode, SubjectType } from "@/api/request";
import styles from "./SearchControls.module.scss";

interface SearchControlsProps {
  keyword: string;
  subjectType: SubjectType;
  searchMode: SearchMode;
  onKeywordChange: (keyword: string) => void;
  onSubjectTypeChange: (subjectType: SubjectType) => void;
  onSearchModeChange: (searchMode: SearchMode) => void;
  onSubmit: () => void;
}

export function SearchControls({
  keyword,
  subjectType,
  searchMode,
  onKeywordChange,
  onSubjectTypeChange,
  onSearchModeChange,
  onSubmit,
}: SearchControlsProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const subjectTypeLabel =
    SUBJECT_TYPE_OPTIONS.find((option) => option.value === subjectType)?.label ?? "游戏";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleSubjectTypeChange(nextSubjectType: SubjectType) {
    onSubjectTypeChange(nextSubjectType);
    setIsCategoryOpen(false);
  }

  function handleSearchModeToggle() {
    onSearchModeChange(searchMode === "FUZZY" ? "EXACT" : "FUZZY");
  }

  return (
    <div className={styles.controls}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.filterMenu}>
          <button
            type="button"
            className={styles.categoryButton}
            aria-expanded={isCategoryOpen}
            onClick={() => setIsCategoryOpen((current) => !current)}
          >
            <span>{subjectTypeLabel}</span>
          </button>
          {isCategoryOpen && (
            <div className={styles.menuList} role="menu" aria-label="搜索分类">
              {SUBJECT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    option.value === subjectType ? styles.menuItemActive : styles.menuItem
                  }
                  role="menuitemradio"
                  aria-checked={option.value === subjectType}
                  onClick={() => handleSubjectTypeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          className={styles.searchInput}
          type="search"
          value={keyword}
          placeholder="搜索条目"
          aria-label="搜索条目"
          autoFocus
          onChange={(event) => onKeywordChange(event.target.value)}
        />

        <button
          type="button"
          className={styles.searchModeButton}
          aria-label="切换搜索模式"
          onClick={handleSearchModeToggle}
        >
          {searchMode === "FUZZY" ? "模糊" : "精确"}
        </button>

        <button type="submit" className={styles.searchButton} aria-label="搜索">
          <Search size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
