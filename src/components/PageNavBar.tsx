import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./PageNavBar.module.scss";

type PageNavBarProps = {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export function PageNavBar({
  left,
  title,
  right,
  className,
  showBackButton = false,
  onBack,
}: PageNavBarProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  }

  return (
    <div className={className ? `${styles.bar} ${className}` : styles.bar}>
      <div className={styles.left}>
        {showBackButton ? (
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            aria-label="返回上级"
          >
            <ArrowLeft className={styles.backIcon} aria-hidden="true" />
          </button>
        ) : null}
        {left}
      </div>
      {title ? <div className={styles.center}>{title}</div> : null}
      <div className={styles.right}>{right}</div>
    </div>
  );
}
