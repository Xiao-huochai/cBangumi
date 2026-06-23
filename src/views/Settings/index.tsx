import { useState } from "react";

import { updateUserPassword } from "@/api";
import { useAuthStore } from "@/store";
import { SettingsLogoutButton } from "./components/SettingsLogoutButton";
import styles from "./index.module.scss";

function SettingsView() {
  const user = useAuthStore((state) => state.user);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const userId = user.id;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextPassword = password.trim();
    const nextConfirmPassword = confirmPassword.trim();

    if (!nextPassword) {
      setError("请输入新密码");
      setMessage("");
      return;
    }

    if (nextPassword.length < 6) {
      setError("密码至少需要 6 位");
      setMessage("");
      return;
    }

    if (nextPassword !== nextConfirmPassword) {
      setError("两次输入的密码不一致");
      setMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await updateUserPassword(userId, { password: nextPassword });
      setPassword("");
      setConfirmPassword("");
      setMessage("密码已更新");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "修改密码失败",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>设置</h1>
      </header>

      <section className={styles.section} aria-labelledby="password-title">
        <div className={styles.sectionHeader}>
          <h2 id="password-title" className={styles.sectionTitle}>
            修改密码
          </h2>
        </div>

        <form
          className={styles.form}
          onSubmit={(event) => void handleSubmit(event)}
        >
          <label className={styles.field}>
            <span className={styles.label}>新密码</span>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入新密码"
              autoComplete="new-password"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>确认新密码</span>
            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="请再次输入新密码"
              autoComplete="new-password"
            />
          </label>

          {error ? <div className={styles.error}>{error}</div> : null}
          {message ? <div className={styles.message}>{message}</div> : null}

          <button
            type="submit"
            className={styles.submit}
            disabled={submitting}
          >
            {submitting ? "保存中..." : "保存密码"}
          </button>
        </form>
      </section>

      <section className={styles.section} aria-labelledby="account-title">
        <div className={styles.sectionHeader}>
          <h2 id="account-title" className={styles.sectionTitle}>
            账号
          </h2>
        </div>

        <SettingsLogoutButton />
      </section>
    </main>
  );
}

export default SettingsView;
