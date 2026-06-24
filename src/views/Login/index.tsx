import { LoginPanel } from "./components/LoginPanel";
import styles from "./index.module.scss";

function LoginView() {
  return (
    <main className={styles.page}>
      <LoginPanel />
    </main>
  );
}

export default LoginView;
