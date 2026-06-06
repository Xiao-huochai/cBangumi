import { Link } from "react-router-dom";

import { RatingStars } from "@/components/RatingStars";
import styles from "./RankingCard.module.scss";

interface RankingCardProps {
  subjectId: number;
  title: string;
  coverUrl: string;
  score: number;
  rank: number;
}

export function RankingCard({
  subjectId,
  title,
  coverUrl,
  score,
  rank,
}: RankingCardProps) {
  return (
    <Link className={styles.card} to={`/subjects/${subjectId}`}>
      <div className={styles.coverWrap}>
        <img className={styles.cover} src={coverUrl} alt={title} />
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.meta}>
          <span className={styles.rank}>#{rank}</span>
          <div className={styles.scoreWrap}>
            <RatingStars className={styles.rating} score={score} size={12} />
            <span className={styles.score}>{score.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
