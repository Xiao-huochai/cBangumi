import { RatingStars } from "@/components/RatingStars";

import styles from "./SubjectCollectionSection.module.scss";

interface SubjectCollectionSectionProps {
  dateText: string;
  isCollected: boolean;
  isLoading: boolean;
  ratingScore: number | null;
  variant: "idle" | "collected" | "rated";
  onClick: () => void;
}

function SubjectCollectionSection({
  dateText,
  isCollected,
  isLoading,
  ratingScore,
  variant,
  onClick,
}: SubjectCollectionSectionProps) {
  const triggerClassName = [
    styles.trigger,
    variant === "idle"
      ? styles.idle
      : variant === "rated"
        ? styles.rated
        : styles.collected,
  ].join(" ");

  return (
    <section className={styles.row}>
      <button
        className={triggerClassName}
        type="button"
        disabled={isLoading}
        onClick={onClick}
      >
        {!isCollected && <span>未收藏</span>}
        {isCollected && dateText && (
          <span className={styles.date}>{dateText}</span>
        )}
        {isCollected && !ratingScore && <span>已收藏</span>}
        {isCollected && ratingScore && (
          <RatingStars
            className={styles.ratingStars}
            color="#ffffff"
            emptyFillColor="rgba(255, 255, 255, 0.12)"
            emptyStrokeColor="rgba(255, 255, 255, 0.48)"
            score={ratingScore}
            size={18}
          />
        )}
      </button>
    </section>
  );
}

export default SubjectCollectionSection;
