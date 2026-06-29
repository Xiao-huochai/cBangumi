import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Img } from "@/components/Img";
import { SUBJECT_TYPE_OPTIONS } from "@/constants/subjects";
import type { SubjectSearchItem } from "@/api";
import styles from "./SearchResults.module.scss";

interface SearchResultsProps {
  records: SubjectSearchItem[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  errorMessage?: string;
  hasSubmittedSearch: boolean;
  onLoadMore: () => void;
}

export function SearchResults({
  records,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  errorMessage,
  hasSubmittedSearch,
  onLoadMore,
}: SearchResultsProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasSubmittedSearch || !hasNextPage || isLoading || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, hasSubmittedSearch, isFetchingNextPage, isLoading, onLoadMore]);

  if (!hasSubmittedSearch) {
    return <div className={styles.state}>输入关键词后点击搜索</div>;
  }

  return (
    <>
      <div className={styles.searchSummary}>
        {isLoading ? "搜索中..." : `找到 ${total} 个结果`}
      </div>
      {errorMessage && <div className={styles.state}>{errorMessage}</div>}
      {!isLoading && !errorMessage && records.length === 0 && (
        <div className={styles.state}>没有搜索结果</div>
      )}
      <div className={styles.searchResults}>
        {records.map((item) => (
          <SearchResultRow key={item.id} item={item} />
        ))}
      </div>
      {!isLoading && !errorMessage && records.length > 0 && (
        <div ref={loadMoreRef} className={styles.loadMoreStatus}>
          {isFetchingNextPage && "加载更多中..."}
          {!isFetchingNextPage && hasNextPage && "继续下滑加载更多"}
          {!isFetchingNextPage && !hasNextPage && "已加载全部结果"}
        </div>
      )}
    </>
  );
}

function SearchResultRow({ item }: { item: SubjectSearchItem }) {
  const title = item.title || item.nameCn || item.name || String(item.id);
  const typeLabel =
    SUBJECT_TYPE_OPTIONS.find((option) => option.value === item.type)?.label ?? item.type;

  return (
    <Link className={styles.searchResult} to={`/subjects/${item.id}`}>
      <Img className={styles.resultCover} src={item.coverUrl} alt={title} />
      <div className={styles.resultInfo}>
        <div className={styles.resultTitleRow}>
          <h2>{title}</h2>
          <span>{typeLabel}</span>
        </div>
        {item.name && item.name !== title && (
          <div className={styles.resultName}>{item.name}</div>
        )}
        <div className={styles.resultMeta}>
          {typeof item.score === "number" && <span>评分 {item.score.toFixed(1)}</span>}
          {typeof item.rank === "number" && <span>排名 #{item.rank}</span>}
          {item.date && <span>{item.date}</span>}
        </div>
        {item.summary && <p>{item.summary}</p>}
      </div>
    </Link>
  );
}
