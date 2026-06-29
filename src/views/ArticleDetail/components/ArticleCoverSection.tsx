import { Img } from "@/components/Img";
import styles from "./ArticleCoverSection.module.scss";

interface ArticleCoverSectionProps {
  coverUrl: string;
  title: string;
}

export function ArticleCoverSection({
  coverUrl,
  title,
}: ArticleCoverSectionProps) {
  return (
    <section className={styles.coverSection} aria-label="文章封面">
      <Img className={styles.cover} src={coverUrl} alt={title} />
    </section>
  );
}
