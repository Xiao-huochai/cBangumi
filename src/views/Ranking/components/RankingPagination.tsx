import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./RankingPagination.module.scss";

interface RankingPaginationProps {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  ariaLabel?: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function RankingPagination({
  page,
  hasPrevious,
  hasNext,
  ariaLabel = "排行榜分页",
  onPrevious,
  onNext,
}: RankingPaginationProps) {
  return (
    <nav className={styles.pagination} aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.pageButton}
        disabled={!hasPrevious}
        aria-label="上一页"
        onClick={onPrevious}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <span className={styles.pageText}>第 {page} 页</span>
      <button
        type="button"
        className={styles.pageButton}
        disabled={!hasNext}
        aria-label="下一页"
        onClick={onNext}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
}
