import { Link } from "react-router-dom";

import { useLoginForm } from "../hooks/useLoginForm";
import styles from "./LoginForm.module.scss";

export function LoginForm() {
  const {
    account,
    error,
    handleSubmit,
    password,
    setAccount,
    setPassword,
    submitting,
  } = useLoginForm();

  return (
    <form
      id="login-title"
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
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "登录中..." : "登录"}
        </button>
      </div>

      <p className={styles.switch}>
        还没有账号？
        <Link to="/register">立即注册</Link>
      </p>
    </form>
  );
}
