import { ChevronRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

import { PageNavBar } from "@/components/PageNavBar";
import { SettingsLogoutButton } from "./components/SettingsLogoutButton";
import styles from "./index.module.scss";

function SettingsView() {
  return (
    <main className={styles.page}>
      <PageNavBar showBackButton title="设置" />

      <section className={styles.group} aria-label="账号设置">
        <Link to="/settings/password" className={styles.row}>
          <span className={styles.iconBox}>
            <LockKeyhole aria-hidden="true" />
          </span>
          <span className={styles.rowText}>更改密码</span>
          <ChevronRight className={styles.chevron} aria-hidden="true" />
        </Link>
        <SettingsLogoutButton />
      </section>
    </main>
  );
}

export default SettingsView;
