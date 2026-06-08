import type { SubjectTag } from "@/api/request";
import styles from "./SubjectTags.module.scss";

interface SubjectTagsProps {
  className?: string;
  tags: SubjectTag[] | string | null;
}

function normalizeTags(tags: SubjectTagsProps["tags"]): SubjectTag[] {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  try {
    const parsed = JSON.parse(tags);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (tag): tag is SubjectTag =>
        typeof tag === "object" &&
        tag !== null &&
        typeof tag.name === "string" &&
        typeof tag.count === "number",
    );
  } catch {
    return [];
  }
}

function SubjectTags({ className, tags }: SubjectTagsProps) {
  const normalizedTags = normalizeTags(tags);

  if (normalizedTags.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h2>标签</h2>
          <span className={styles.count}>{normalizedTags.length} 个</span>
        </div>
        <div className={styles.list}>
          {normalizedTags.map((tag) => (
            <span className={styles.tag} key={`${tag.name}-${tag.count}`}>
              <span className={styles.name}>{tag.name}</span>
              <span className={styles.value}>{tag.count}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SubjectTags;
