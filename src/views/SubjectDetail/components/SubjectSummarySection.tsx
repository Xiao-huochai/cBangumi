import { ChevronDown, ChevronUp } from "lucide-react";

import styles from "./SubjectSummarySection.module.scss";

interface SubjectSummarySectionProps {
  canExpand: boolean;
  isExpanded: boolean;
  summary: string | null;
  summaryRef: (element: HTMLParagraphElement | null) => void;
  toggleExpanded: () => void;
}

function SubjectSummarySection({
  canExpand,
  isExpanded,
  summary,
  summaryRef,
  toggleExpanded,
}: SubjectSummarySectionProps) {
  return (
    <section className={styles.section}>
      <h2>简介</h2>
      <div
        className={`${styles.summaryWrap} ${
          !isExpanded ? styles.summaryWrapCollapsed : ""
        }`}
      >
        <p
          ref={summaryRef}
          className={`${styles.summary} ${
            !isExpanded ? styles.summaryCollapsed : ""
          }`}
        >
          {summary || "暂无简介"}
        </p>
        {canExpand && (
          <button
            className={styles.summaryToggle}
            type="button"
            aria-label={isExpanded ? "收起简介" : "展开简介"}
            onClick={toggleExpanded}
          >
            {isExpanded ? (
              <ChevronUp size={18} strokeWidth={2.25} />
            ) : (
              <ChevronDown size={18} strokeWidth={2.25} />
            )}
          </button>
        )}
      </div>
    </section>
  );
}

export default SubjectSummarySection;
