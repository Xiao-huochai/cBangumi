import { useId } from "react";

import clsx from "clsx";

import { StarIcon } from "./StarIcon";
import styles from "./RatingStars.module.scss";

interface RatingStarsProps {
  score: number;
  color?: string;
  maxScore?: number;
  starCount?: number;
  size?: number;
  className?: string;
}

type StarState = 0 | 1 | 2;

function clampScore(score: number, maxScore: number) {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(Math.max(score, 0), maxScore);
}

function getStarStates(
  score: number,
  maxScore: number,
  starCount: number,
): StarState[] {
  const normalizedScore = clampScore(score, maxScore);
  const roundedStars =
    Math.round((normalizedScore / maxScore) * starCount * 2) / 2;

  return Array.from({ length: starCount }, (_, index) => {
    const remaining = roundedStars - index;

    if (remaining >= 1) {
      return 2;
    }

    if (remaining >= 0.5) {
      return 1;
    }

    return 0;
  });
}

export function RatingStars({
  score,
  color = "#fb8434",
  maxScore = 10,
  starCount = 5,
  size = 16,
  className,
}: RatingStarsProps) {
  const id = useId().replaceAll(":", "");
  const stars = getStarStates(score, maxScore, starCount);
  const normalizedScore = clampScore(score, maxScore);

  return (
    <span
      className={clsx(styles.rating, className)}
      aria-label={`评分 ${normalizedScore.toFixed(1)} / ${maxScore}`}
    >
      {stars.map((state, index) => (
        <StarIcon
          key={`${id}-${index}`}
          className={styles.star}
          state={state}
          color={color}
          size={size}
          clipId={`${id}-half-${index}`}
        />
      ))}
    </span>
  );
}
