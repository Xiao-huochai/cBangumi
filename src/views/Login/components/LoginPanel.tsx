import { AuthHeader } from "./AuthHeader";
import { LoginForm } from "./LoginForm";
import styles from "./LoginPanel.module.scss";

export function LoginPanel() {
  return (
    <section className={styles.panel} aria-labelledby="login-title">
      <AuthHeader title="登录" titleId="login-title" />
      <LoginForm />
    </section>
  );
}
