import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { Eye } from "lucide-react";

import styles from "./ArticleContentSection.module.scss";

interface ArticleContentSectionProps {
  title: string;
  authorName: string;
  date: string;
  viewCount?: number;
  content: string;
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

export function ArticleContentSection({
  title,
  authorName,
  date,
  viewCount,
  content,
}: ArticleContentSectionProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Markdown],
    content,
    contentType: "markdown",
    editable: false,
    editorProps: {
      attributes: {
        class: styles.body,
      },
    },
  });

  return (
    <article className={styles.contentSection}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <div className={styles.meta}>
          <span>{authorName}</span>
          {date && <time dateTime={date}>{formatArticleDate(date)}</time>}
          {typeof viewCount === "number" && (
            <span className={styles.views}>
              <Eye size={14} aria-hidden="true" />
              {viewCount}
            </span>
          )}
        </div>
      </header>

      <EditorContent editor={editor} />
    </article>
  );
}
