import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./GlobalBackButton.module.scss";

const rootPaths = new Set(["/articles", "/ranking", "/profile", "/login"]);

type GlobalBackButtonProps = {
  title?: ReactNode;
  right?: ReactNode;
  hidden?: boolean;
};

export function GlobalBackButton({
  title,
  right,
  hidden = false,
}: GlobalBackButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (hidden || rootPaths.has(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/ranking", { replace: true });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.button}
          onClick={handleBack}
          aria-label="返回上级"
        >
          <ArrowLeft className={styles.icon} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.center}>{title}</div>

      <div className={styles.right}>{right}</div>
    </div>
  );
}
