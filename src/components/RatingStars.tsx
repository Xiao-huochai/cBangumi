import { useId } from "react";

import clsx from "clsx";

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

interface StarIconProps {
  state: StarState;
  color: string;
  size: number;
  clipId: string;
}

function StarIcon({ state, color, size, clipId }: StarIconProps) {
  const path =
    "M12 2.8L14.848 8.572L21.216 9.497L16.608 13.988L17.696 20.328L12 17.334L6.304 20.328L7.392 13.988L2.784 9.497L9.152 8.572L12 2.8Z";

  return (
    <svg
      className={styles.star}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {state === 1 && (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
      )}

      <path
        d={path}
        fill={state === 2 ? color : "#ffffff"}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {state === 1 && <path d={path} fill={color} clipPath={`url(#${clipId})`} />}
    </svg>
  );
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
          state={state}
          color={color}
          size={size}
          clipId={`${id}-half-${index}`}
        />
      ))}
    </span>
  );
}
