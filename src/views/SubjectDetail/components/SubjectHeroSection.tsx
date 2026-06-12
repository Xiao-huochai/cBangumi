import type { SubjectDetail } from "@/api/request";

import styles from "./SubjectHeroSection.module.scss";

interface SubjectHeroSectionProps {
  subject: SubjectDetail;
}

function SubjectHeroSection({ subject }: SubjectHeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.coverWrap}>
        <img
          className={styles.cover}
          src={subject.coverUrl}
          alt={subject.nameCn || subject.name}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.heading}>
          <span className={styles.type}>{subject.type}</span>
          <h1>{subject.nameCn || subject.name}</h1>
          {subject.nameCn && subject.nameCn !== subject.name && (
            <p className={styles.originalName}>{subject.name}</p>
          )}
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span>站内评分</span>
            <div className={styles.metricScore}>
              <strong>{subject.siteScore.toFixed(1)}</strong>
            </div>
          </div>
          <div className={styles.metric}>
            <span>评分人数</span>
            <strong>{subject.siteScoreCount}</strong>
          </div>
          <div className={styles.metric}>
            <span>Bangumi 排名</span>
            <strong>{subject.rank ?? "-"}</strong>
          </div>
        </div>

        <ul className={styles.meta}>
          <li>放送/发售：{subject.date || "-"}</li>
          <li>Bangumi 评分：{subject.score?.toFixed(1) ?? "-"}</li>
          <li>站内排名分：{subject.siteRankScore.toFixed(2)}</li>
        </ul>
      </div>
    </section>
  );
}

export default SubjectHeroSection;
