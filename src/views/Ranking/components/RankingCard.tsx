import { Link } from "react-router-dom";
import { Img } from "@/components/Img";
import { StarIcon } from "@/components/StarIcon";
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
        <Img className={styles.cover} src={coverUrl} alt={title} />
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.meta}>
          <span className={styles.rank}>#{rank}</span>
          <span className={styles.scoreWrap}>
            <StarIcon className={styles.scoreIcon} size={12} state={2} />
            <span className={styles.score}>{score.toFixed(1)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
