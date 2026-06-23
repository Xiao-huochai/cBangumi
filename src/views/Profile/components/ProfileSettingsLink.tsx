import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./ProfileSettingsLink.module.scss";

export function ProfileSettingsLink() {
  return (
    <Link
      to="/settings"
      className={styles.link}
      aria-label="打开设置"
      title="设置"
    >
      <Settings aria-hidden="true" />
    </Link>
  );
}
