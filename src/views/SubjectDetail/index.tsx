import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSubjectDetail } from "@/api";
import type { SubjectDetail } from "@/api/request";
import { RatingStars } from "@/components/RatingStars";
import styles from "./index.module.scss";

function SubjectDetailView() {
  const { subjectId } = useParams();
  const parsedSubjectId = Number(subjectId);
  const invalidSubjectId = !subjectId || Number.isNaN(parsedSubjectId);
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (invalidSubjectId) {
      return;
    }

    async function fetchSubjectDetail() {
      setLoading(true);
      setError("");

      try {
        const data = await getSubjectDetail(parsedSubjectId);
        setSubject(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "请求失败",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchSubjectDetail();
  }, [invalidSubjectId, parsedSubjectId]);

  return (
    <main className={styles.page}>
      {invalidSubjectId && <div className={styles.status}>条目不存在</div>}
      {loading && <div className={styles.status}>加载中...</div>}
      {error && <div className={styles.status}>{error}</div>}

      {!invalidSubjectId && subject && (
        <>
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
                    <RatingStars
                      className={styles.metricRating}
                      score={subject.siteScore}
                      size={16}
                    />
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

          <section className={styles.section}>
            <h2>简介</h2>
            <p className={styles.summary}>{subject.summary || "暂无简介"}</p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>评论区</h2>
              <span>暂未接入</span>
            </div>
            <div className={styles.commentPlaceholder}>
              评论列表和发布入口后面接。
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default SubjectDetailView;
