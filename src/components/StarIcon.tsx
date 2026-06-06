interface StarIconProps {
  state?: 0 | 1 | 2;
  color?: string;
  size?: number;
  clipId?: string;
  className?: string;
}

const starPath =
  "M12 2.8L14.848 8.572L21.216 9.497L16.608 13.988L17.696 20.328L12 17.334L6.304 20.328L7.392 13.988L2.784 9.497L9.152 8.572L12 2.8Z";

export function StarIcon({
  state = 2,
  color = "#fb8434",
  size = 16,
  clipId = "star-half",
  className,
}: StarIconProps) {
  return (
    <svg
      className={className}
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
        d={starPath}
        fill={state === 2 ? color : "#ffffff"}
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {state === 1 && (
        <path d={starPath} fill={color} clipPath={`url(#${clipId})`} />
      )}
    </svg>
  );
}
