import { useParams } from "react-router-dom";

import { PageNavBar } from "@/components/PageNavBar";

import { ArticleContentSection } from "./components/ArticleContentSection";
import { ArticleCoverSection } from "./components/ArticleCoverSection";
import { RelatedSubjectSection } from "./components/RelatedSubjectSection";
import { useArticleDetail } from "./hooks/useArticleDetail";
import styles from "./index.module.scss";

function ArticleDetailView() {
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const invalidArticleId = !articleId || Number.isNaN(parsedArticleId);
  const { article, error, loading } = useArticleDetail(
    parsedArticleId,
    invalidArticleId,
  );

  const title = article?.title || "文章详情";
  const coverUrl = article?.coverUrl || article?.subjectCoverUrl || "";
  const date = article?.publishedAt || article?.updatedAt || "";

  return (
    <main className={styles.page}>
      <PageNavBar showBackButton title={title} />

      {invalidArticleId && <div className={styles.state}>文章不存在</div>}
      {loading && <div className={styles.state}>加载中...</div>}
      {error && <div className={styles.state}>{error}</div>}

      {!invalidArticleId && article && (
        <div className={styles.articleLayout}>
          <ArticleCoverSection coverUrl={coverUrl} title={article.title} />

          <ArticleContentSection
            title={article.title}
            authorName={article.authorName || "匿名作者"}
            date={date}
            viewCount={article.viewCount}
            content={article.content}
          />

          <RelatedSubjectSection
            subjectId={article.subjectId}
            subjectTitle={article.subjectTitle}
            subjectCoverUrl={article.subjectCoverUrl}
          />
        </div>
      )}
    </main>
  );
}

export default ArticleDetailView;
