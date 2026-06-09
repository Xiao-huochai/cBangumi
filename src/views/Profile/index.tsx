import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import styles from "./index.module.scss";

function ProfileView() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setSubmitting(true);
    setError("");

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "退出失败",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>登录状态已恢复</p>
        <h1 className={styles.name}>{user.name}</h1>
        <dl className={styles.meta}>
          <div className={styles.row}>
            <dt>手机号</dt>
            <dd>{user.phone || "未设置"}</dd>
          </div>
          <div className={styles.row}>
            <dt>邮箱</dt>
            <dd>{user.email || "未设置"}</dd>
          </div>
          <div className={styles.row}>
            <dt>用户 ID</dt>
            <dd>{user.id}</dd>
          </div>
        </dl>

        {error ? <div className={styles.error}>{error}</div> : null}

        <button
          type="button"
          className={styles.logout}
          onClick={() => void handleLogout()}
          disabled={submitting}
        >
          {submitting ? "退出中..." : "退出登录"}
        </button>
      </section>
    </main>
  );
}

export default ProfileView;
