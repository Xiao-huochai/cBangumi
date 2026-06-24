import { Link } from "react-router-dom";

import { useRegisterForm } from "../hooks/useRegisterForm";
import styles from "./RegisterForm.module.scss";

export function RegisterForm() {
  const {
    confirmPassword,
    email,
    error,
    handleSubmit,
    name,
    password,
    phone,
    setConfirmPassword,
    setEmail,
    setName,
    setPassword,
    setPhone,
    submitting,
  } = useRegisterForm();

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <label className={styles.field}>
        <span className={styles.label}>
          昵称 <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="例如 chai"
          autoComplete="nickname"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          手机号 <span className={styles.optional}>可选</span>
        </span>
        <input
          className={styles.input}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="手机号，邮箱二选一"
          autoComplete="tel"
          inputMode="tel"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          邮箱 <span className={styles.optional}>可选</span>
        </span>
        <input
          className={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="邮箱，手机号二选一"
          autoComplete="email"
          inputMode="email"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          密码 <span className={styles.required}>*</span>
        </span>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="至少 6 位"
          autoComplete="new-password"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          确认密码 <span className={styles.required}>*</span>
        </span>
        <input
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="再次输入密码"
          autoComplete="new-password"
        />
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "创建中..." : "注册并登录"}
      </button>

      <p className={styles.switch}>
        已有账号？
        <Link to="/login">去登录</Link>
      </p>
    </form>
  );
}
