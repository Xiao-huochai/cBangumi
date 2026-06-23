import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Quote,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createArticle, uploadArticleImage } from "@/api";

import styles from "./index.module.scss";

function buildAutoSummary(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

function ArticleCreateView() {
  const navigate = useNavigate();
  const bodyImageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverName, setCoverName] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [errorText, setErrorText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Markdown,
      Placeholder.configure({
        placeholder: "写正文，保存时会以 Markdown 提交",
      }),
    ],
    content: "",
    contentType: "markdown",
    onUpdate: ({ editor: currentEditor }) => {
      setBodyText(currentEditor.getText());
    },
    editorProps: {
      attributes: {
        class: styles.editorSurface,
      },
    },
  });

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && bodyText.trim().length > 0;
  }, [bodyText, title]);

  const createMutation = useMutation({
    mutationFn: () =>
      createArticle({
        title: title.trim(),
        summary: buildAutoSummary(bodyText),
        coverUrl,
        content: editor?.getMarkdown().trim() ?? "",
        contentFormat: "MARKDOWN",
      }),
    onSuccess: () => {
      navigate("/articles");
    },
  });

  const uploadCoverMutation = useMutation({
    mutationFn: uploadArticleImage,
    onSuccess: (result) => {
      setCoverUrl(result.url);
      setCoverName(result.originalName);
    },
    onError: (error) => {
      setErrorText(error.message);
    },
  });

  const uploadBodyImageMutation = useMutation({
    mutationFn: uploadArticleImage,
    onSuccess: (result) => {
      editor
        ?.chain()
        .focus()
        .setImage({ src: result.url, alt: result.originalName })
        .run();
    },
    onError: (error) => {
      setErrorText(error.message);
    },
  });

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setErrorText("");
    uploadCoverMutation.mutate(file);
  }

  function handleBodyImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setErrorText("");
    uploadBodyImageMutation.mutate(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorText("");

    if (!editor) {
      setErrorText("编辑器还未准备好");
      return;
    }

    if (!title.trim()) {
      setErrorText("请填写标题");
      return;
    }

    if (!editor.getText().trim()) {
      setErrorText("请填写正文");
      return;
    }

    createMutation.mutate(undefined, {
      onError: (error) => {
        setErrorText(error.message);
      },
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>创建文章</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="输入文章标题"
            maxLength={80}
          />
        </label>

        <label className={styles.uploadField}>
          <span>封面</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={handleCoverChange}
          />
          <div className={styles.uploadBox}>
            {coverUrl ? (
              <img src={coverUrl} alt={coverName || "文章封面"} />
            ) : (
              <span>
                {uploadCoverMutation.isPending ? "上传中..." : "选择图片上传"}
              </span>
            )}
          </div>
        </label>

        <section className={styles.editorBlock} aria-label="正文编辑器">
          <div className={styles.toolbar}>
            <button
              type="button"
              className={
                editor?.isActive("heading", { level: 1 })
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="一级标题"
              title="一级标题"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("heading", { level: 2 })
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="二级标题"
              title="二级标题"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("bold")
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="加粗"
              title="加粗"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("italic")
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="斜体"
              title="斜体"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("bulletList")
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="无序列表"
              title="无序列表"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("orderedList")
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="有序列表"
              title="有序列表"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={
                editor?.isActive("blockquote")
                  ? styles.toolButtonActive
                  : styles.toolButton
              }
              aria-label="引用"
              title="引用"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.toolButton}
              aria-label="插入图片"
              title="插入图片"
              disabled={uploadBodyImageMutation.isPending}
              onClick={() => bodyImageInputRef.current?.click()}
            >
              <ImagePlus size={18} aria-hidden="true" />
            </button>
            <input
              ref={bodyImageInputRef}
              className={styles.hiddenInput}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              onChange={handleBodyImageChange}
            />
          </div>
          <EditorContent editor={editor} />
        </section>

        {(errorText || createMutation.isSuccess) && (
          <div className={errorText ? styles.error : styles.success}>
            {errorText || "文章草稿已创建"}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!canSubmit || createMutation.isPending}
          >
            <Save size={18} aria-hidden="true" />
            <span>{createMutation.isPending ? "保存中..." : "保存草稿"}</span>
          </button>
        </div>
      </form>
    </main>
  );
}

export default ArticleCreateView;
