import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/api";
import styles from "./index.module.scss";

function LoginView() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const accountValue = account.trim();
    const passwordValue = password.trim();

    if (!accountValue) {
      setError("请填写手机号或邮箱");
      return;
    }

    if (!passwordValue) {
      setError("请输入密码");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await login(accountValue, passwordValue);
      navigate("/profile");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "登录失败",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>登录</h1>

        <form
          className={styles.form}
          onSubmit={(event) => void handleSubmit(event)}
        >
          <label className={styles.field}>
            <span className={styles.label}>账号</span>
            <input
              className={styles.input}
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="请输入邮箱或手机号"
              autoComplete="username"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>密码</span>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? "登录中..." : "登录"}
            </button>

            <button type="button" className={styles.register}>
              注册（后续开放）
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginView;
