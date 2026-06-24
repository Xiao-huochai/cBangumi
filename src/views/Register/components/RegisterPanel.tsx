import { AuthHeader } from "./AuthHeader";
import { RegisterForm } from "./RegisterForm";
import styles from "./RegisterPanel.module.scss";

export function RegisterPanel() {
  return (
    <section className={styles.panel} aria-labelledby="register-title">
      <AuthHeader title="注册" titleId="register-title" />
      <RegisterForm />
    </section>
  );
}
