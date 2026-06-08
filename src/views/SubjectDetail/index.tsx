import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { getSubjectDetail } from "@/api";
import type { SubjectDetail } from "@/api/request";
import SubjectTags from "./components/SubjectTags";
import styles from "./index.module.scss";

function SubjectDetailView() {
  const { subjectId } = useParams();
  const parsedSubjectId = Number(subjectId);
  const invalidSubjectId = !subjectId || Number.isNaN(parsedSubjectId);
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [canExpandSummary, setCanExpandSummary] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (invalidSubjectId) {
      return;
    }
    async function fetchSubjectDetail() {
      setLoading(true);
      setError("");
      setIsSummaryExpanded(false);

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

  useEffect(() => {
    const element = summaryRef.current;
    if (!element || !subject?.summary) {
      setCanExpandSummary(false);
      return;
    }

    const updateOverflowState = () => {
      const wasExpanded = isSummaryExpanded;

      if (wasExpanded) {
        element.classList.add(styles.summaryCollapsed);
      }

      setCanExpandSummary(element.scrollHeight > element.clientHeight + 1);

      if (wasExpanded) {
        element.classList.remove(styles.summaryCollapsed);
      }
    };

    updateOverflowState();

    const observer = new ResizeObserver(updateOverflowState);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [subject?.summary, isSummaryExpanded]);

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

          <SubjectTags className={styles.section} tags={subject.tags} />

          <section className={styles.section}>
            <h2>简介</h2>
            <div
              className={`${styles.summaryWrap} ${
                !isSummaryExpanded ? styles.summaryWrapCollapsed : ""
              }`}
            >
              <p
                ref={summaryRef}
                className={`${styles.summary} ${
                  !isSummaryExpanded ? styles.summaryCollapsed : ""
                }`}
              >
                {subject.summary || "暂无简介"}
              </p>
              {canExpandSummary && (
                <button
                  className={`${styles.summaryToggle} ${
                    isSummaryExpanded ? styles.summaryToggleExpanded : ""
                  }`}
                  type="button"
                  onClick={() => setIsSummaryExpanded((current) => !current)}
                >
                  {isSummaryExpanded ? "收起" : "展开"}
                </button>
              )}
            </div>
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
