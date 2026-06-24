import { Edit3, EyeOff, Rocket, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { ArticleCard } from "@/api";
import styles from "./ArticleManageRow.module.scss";

function formatDate(value?: string | null) {
  if (!value) {
    return "暂无时间";
  }

  return value.replace("T", " ").slice(0, 16);
}

interface ArticleManageRowProps {
  article: ArticleCard;
  isHiding: boolean;
  isDeleting: boolean;
  isPublishing: boolean;
  onDelete: () => void;
  onHide: () => void;
  onPublish: () => void;
}

export function ArticleManageRow({
  article,
  isDeleting,
  isHiding,
  isPublishing,
  onDelete,
  onHide,
  onPublish,
}: ArticleManageRowProps) {
  const date = article.updatedAt || article.publishedAt;

  return (
    <article className={styles.row}>
      <img
        className={styles.cover}
        src={article.coverUrl || article.subjectCoverUrl || "/favicon.svg"}
        alt={article.title}
      />
      <div className={styles.content}>
        <h2>{article.title}</h2>
        <div className={styles.meta}>
          <span>{formatDate(date)}</span>
          {article.subjectTitle && <span>{article.subjectTitle}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <Link className={styles.iconButton} to={`/articles/${article.id}/edit`}>
          <Edit3 size={17} aria-hidden="true" />
          <span>编辑</span>
        </Link>
        {article.status !== "PUBLISHED" && (
          <button
            type="button"
            className={styles.iconButton}
            disabled={isPublishing}
            onClick={onPublish}
          >
            <Rocket size={17} aria-hidden="true" />
            <span>发布</span>
          </button>
        )}
        {article.status === "PUBLISHED" && (
          <button
            type="button"
            className={styles.iconButton}
            disabled={isHiding}
            onClick={onHide}
          >
            <EyeOff size={17} aria-hidden="true" />
            <span>隐藏</span>
          </button>
        )}
        <button
          type="button"
          className={styles.dangerButton}
          disabled={isDeleting}
          onClick={onDelete}
        >
          <Trash2 size={17} aria-hidden="true" />
          <span>删除</span>
        </button>
      </div>
    </article>
  );
}
