import { RegisterForm } from "./RegisterForm";
import styles from "./RegisterPanel.module.scss";

export function RegisterPanel() {
  return (
    <section className={styles.panel} aria-labelledby="register-title">
      <RegisterForm />
    </section>
  );
}
