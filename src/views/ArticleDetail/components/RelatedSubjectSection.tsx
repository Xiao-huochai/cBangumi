import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Img } from "@/components/Img";
import styles from "./RelatedSubjectSection.module.scss";

interface RelatedSubjectSectionProps {
  subjectId?: number | null;
  subjectTitle?: string | null;
  subjectCoverUrl?: string | null;
}

export function RelatedSubjectSection({
  subjectId,
  subjectTitle,
  subjectCoverUrl,
}: RelatedSubjectSectionProps) {
  if (!subjectId || !subjectTitle) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="related-subject-title">
      <h2 id="related-subject-title">关联条目</h2>
      <Link className={styles.subjectLink} to={`/subjects/${subjectId}`}>
        <div className={styles.coverWrap}>
          <Img
            className={styles.cover}
            src={subjectCoverUrl || undefined}
            alt={subjectTitle}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>查看条目详情</span>
          <strong>{subjectTitle}</strong>
        </div>
        <ChevronRight className={styles.icon} size={22} aria-hidden="true" />
      </Link>
    </section>
  );
}
