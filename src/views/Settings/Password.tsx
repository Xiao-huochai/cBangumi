import type { FormEvent } from "react";
import { useState } from "react";

import { updateUserPassword } from "@/api";
import { PageNavBar } from "@/components/PageNavBar";
import { useAuthStore } from "@/store";
import styles from "./Password.module.scss";

function SettingsPasswordView() {
  const user = useAuthStore((state) => state.user);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const userId = user.id;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentPassword = oldPassword.trim();
    const nextPassword = password.trim();
    const nextConfirmPassword = confirmPassword.trim();

    if (!currentPassword) {
      setError("请输入原密码");
      setMessage("");
      return;
    }

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
      setError("两次输入的新密码不一致");
      setMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await updateUserPassword(userId, {
        oldPassword: currentPassword,
        password: nextPassword,
      });
      setOldPassword("");
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
      <PageNavBar showBackButton title="更改密码" />

      <form
        className={styles.form}
        onSubmit={(event) => void handleSubmit(event)}
      >
        <label className={styles.field}>
          <span className={styles.label}>原密码</span>
          <input
            type="password"
            className={styles.input}
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            placeholder="请输入原密码"
            autoComplete="current-password"
          />
        </label>

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

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "保存中..." : "保存"}
        </button>
      </form>
    </main>
  );
}

export default SettingsPasswordView;
