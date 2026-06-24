import { useParams } from "react-router-dom";

import { PageNavBar } from "@/components/PageNavBar";
import { ArticleEditFormSection } from "./components/ArticleEditFormSection";
import { useArticleEdit } from "./hooks/useArticleEdit";
import styles from "./index.module.scss";

function ArticleEditView() {
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const invalidArticleId = !articleId || Number.isNaN(parsedArticleId);
  const editState = useArticleEdit(parsedArticleId, !invalidArticleId);
  const { data: article, error, isLoading } = editState.articleQuery;

  if (invalidArticleId) {
    return (
      <main className={styles.page}>
        <PageNavBar showBackButton title="编辑文章" />
        <div className={styles.state}>文章 ID 不正确</div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <PageNavBar showBackButton title="编辑文章" />
        <div className={styles.state}>加载中...</div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className={styles.page}>
        <PageNavBar showBackButton title="编辑文章" />
        <div className={styles.state}>{error?.message || "文章不存在"}</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <PageNavBar showBackButton title="编辑文章" />
      <div className={styles.header}>
        <h1>编辑文章</h1>
        {article.status && <span>{article.status}</span>}
      </div>

      <ArticleEditFormSection article={article} editState={editState} />
    </main>
  );
}

export default ArticleEditView;
