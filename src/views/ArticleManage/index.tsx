import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { PageNavBar } from "@/components/PageNavBar";
import { ArticleManageRow } from "./components/ArticleManageRow";
import { ArticleManageTabs } from "./components/ArticleManageTabs";
import { useArticleManage } from "./hooks/useArticleManage";
import styles from "./index.module.scss";

function ArticleManageView() {
  const navigate = useNavigate();
  const {
    articles,
    articlesQuery,
    deleteMutation,
    hideMutation,
    publishMutation,
    status,
  } = useArticleManage();

  return (
    <main className={styles.page}>
      <PageNavBar
        showBackButton
        title="文章管理"
        onBack={() => navigate("/articles")}
      />
      <div className={styles.header}>
        <h1>文章管理</h1>
        <Link className={styles.newButton} to="/articles/new">
          <Plus size={18} aria-hidden="true" />
          <span>新建</span>
        </Link>
      </div>

      <ArticleManageTabs status={status} />

      {articlesQuery.isLoading && <div className={styles.state}>加载中...</div>}
      {articlesQuery.error && (
        <div className={styles.state}>{articlesQuery.error.message}</div>
      )}
      {!articlesQuery.isLoading && !articlesQuery.error && articles.length === 0 && (
        <div className={styles.state}>当前没有文章</div>
      )}

      <div className={styles.list}>
        {articles.map((article) => (
          <ArticleManageRow
            key={article.id}
            article={article}
            onPublish={() => publishMutation.mutate(article.id)}
            onHide={() => hideMutation.mutate(article.id)}
            onDelete={() => {
              if (window.confirm(`确定删除《${article.title}》吗？`)) {
                deleteMutation.mutate(article.id);
              }
            }}
            isPublishing={publishMutation.isPending}
            isHiding={hideMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>
    </main>
  );
}

export default ArticleManageView;
