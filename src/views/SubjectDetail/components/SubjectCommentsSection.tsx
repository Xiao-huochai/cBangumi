import styles from "./SubjectCommentsSection.module.scss";

function SubjectCommentsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>评论区</h2>
        <span>暂未接入</span>
      </div>
      <div className={styles.commentPlaceholder}>评论列表和发布入口后面接。</div>
    </section>
  );
}

export default SubjectCommentsSection;
