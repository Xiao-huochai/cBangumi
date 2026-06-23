import { useQuery } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { Link } from "react-router-dom";

import { getArticleList } from "@/api";
import { useAuthStore } from "@/store";

import { ArticleRow } from "./components/ArticleRow";
import styles from "./index.module.scss";

const PAGE_SIZE = 20;

function getArticleExcerpt(value?: string | null) {
  if (!value) {
    return "暂无内容";
  }

  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[[^\]]+]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ArticleView() {
  const user = useAuthStore((state) => state.user);
  const { data, error, isLoading } = useQuery({
    queryKey: ["articles", PAGE_SIZE],
    queryFn: () =>
      getArticleList({
        page: 1,
        size: PAGE_SIZE,
        sort: "publishedAt",
        order: "DESC",
      }),
    staleTime: 1000 * 60 * 5,
  });

  const articles = data?.records ?? [];

  return (
    <main className={styles.page}>
      <h1>文章</h1>
      {isLoading && <div className={styles.state}>加载中...</div>}
      {error && <div className={styles.state}>{error.message}</div>}
      {!isLoading && !error && articles.length === 0 && (
        <div className={styles.state}>暂无文章</div>
      )}
      <div className={styles.list}>
        {articles.map((article) => (
          <ArticleRow
            key={article.id}
            img={article.coverUrl || article.subjectCoverUrl || "/favicon.svg"}
            title={article.title}
            excerpt={getArticleExcerpt(article.summary || article.content)}
            author={article.authorName || "匿名作者"}
            date={article.publishedAt || article.updatedAt || ""}
          />
        ))}
      </div>
      {user?.isAdmin && (
        <Link
          className={styles.createButton}
          to="/articles/new"
          aria-label="创建新文章"
          title="创建新文章"
        >
          <SquarePen size={24} aria-hidden="true" />
        </Link>
      )}
    </main>
  );
}

export default ArticleView;
