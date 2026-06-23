import type { ReactNode } from "react";

import styles from "./PageNavBar.module.scss";

type PageNavBarProps = {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function PageNavBar({
  left,
  title,
  right,
  className,
}: PageNavBarProps) {
  return (
    <div className={className ? `${styles.bar} ${className}` : styles.bar}>
      <div className={styles.left}>{left}</div>
      {title ? <div className={styles.center}>{title}</div> : null}
      <div className={styles.right}>{right}</div>
    </div>
  );
}
