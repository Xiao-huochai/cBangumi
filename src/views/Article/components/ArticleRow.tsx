import { Link } from "react-router-dom";

import { Img } from "@/components/Img";
import styles from "./ArticleRow.module.scss";

interface ArticleRowProps {
  img: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  href?: string;
}

function formatArticleDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function ArticleRow({
  img,
  title,
  excerpt,
  author,
  date,
  href,
}: ArticleRowProps) {
  const content = (
    <>
      <div className={styles.coverWrap}>
        <Img className={styles.cover} src={img} alt={title} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>
          <span>{author}</span>
          <time dateTime={date}>{formatArticleDate(date)}</time>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link className={styles.row} to={href}>
        {content}
      </Link>
    );
  }

  return <article className={styles.row}>{content}</article>;
}
