import { useLocation, useNavigate } from "react-router-dom";

import styles from "./GlobalBackButton.module.scss";

const rootPaths = new Set(["/ranking", "/profile", "/login"]);

export function GlobalBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (rootPaths.has(location.pathname)) {
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
    <button
      type="button"
      className={styles.button}
      onClick={handleBack}
      aria-label="返回上一级"
    >
      <span className={styles.icon} aria-hidden="true">
        ←
      </span>
      <span className={styles.label}>返回</span>
    </button>
  );
}
