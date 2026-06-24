import { RegisterPanel } from "./components/RegisterPanel";
import styles from "./index.module.scss";

function RegisterView() {
  return (
    <main className={styles.page}>
      <RegisterPanel />
    </main>
  );
}

export default RegisterView;
