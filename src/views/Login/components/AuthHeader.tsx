import styles from "./AuthHeader.module.scss";

interface AuthHeaderProps {
  title: string;
  titleId: string;
}

export function AuthHeader({ title, titleId }: AuthHeaderProps) {
  return (
    <div className={styles.brand}>
      <span className={styles.mark} aria-hidden="true">
        C
      </span>
      <div>
        <p className={styles.eyebrow}>cBangumi</p>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
      </div>
    </div>
  );
}
