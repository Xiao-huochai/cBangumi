import { Link } from "react-router-dom";

import { RatingStars } from "@/components/RatingStars";
import type { CollectionStatus } from "@/api/profile";
import styles from "./CollectionCard.module.scss";

interface CollectionCardProps {
  id: number;
  userId: number;
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
  status: CollectionStatus;
  ratingScore?: number | null;
  commentContent?: string | null;
}

// const statusLabelMap: Record<CollectionStatus, string> = {
//   WISH: "想看",
//   DOING: "在看",
//   DONE: "看过",
//   ON_HOLD: "搁置",
//   DROPPED: "抛弃",
// };

export function CollectionCard({
  subjectId,
  subjectTitle,
  coverUrl,
  // status,
  ratingScore,
  commentContent,
}: CollectionCardProps) {
  return (
    <Link className={styles.card} to={`/subjects/${subjectId}`}>
      <div className={styles.coverWrap}>
        <img className={styles.cover} src={coverUrl} alt={subjectTitle} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{subjectTitle}</h2>
          {/* <span className={styles.status}>{statusLabelMap[status]}</span> */}
        </div>

        {ratingScore ? (
          <div className={styles.ratingRow}>
            <RatingStars score={ratingScore} size={14} />
            <span className={styles.score}>{ratingScore.toFixed(1)}</span>
          </div>
        ) : null}

        {commentContent ? (
          <p className={styles.comment}>{commentContent}</p>
        ) : (
          <p className={styles.commentEmpty}>还没有留下短评</p>
        )}
      </div>
    </Link>
  );
}
