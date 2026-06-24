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
  Rocket,
  Save,
} from "lucide-react";

import { uploadArticleImage, type CreateArticlePayload } from "@/api";
import {
  ArticleSubjectPicker,
  type ArticleSubjectSelection,
} from "./ArticleSubjectPicker";
import styles from "./ArticleEditorForm.module.scss";

export interface ArticleEditorInitialValue {
  title?: string;
  coverUrl?: string | null;
  coverName?: string;
  content?: string | null;
  selectedSubject?: ArticleSubjectSelection | null;
}

interface ArticleEditorFormProps {
  initialValue?: ArticleEditorInitialValue;
  saveLabel: string;
  publishLabel?: string;
  isSaving: boolean;
  isPublishing?: boolean;
  successText?: string;
  submitError?: string;
  onSave: (payload: CreateArticlePayload) => void;
  onPublish?: (payload: CreateArticlePayload) => void;
}

function buildAutoSummary(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

export function ArticleEditorForm({
  initialValue,
  saveLabel,
  publishLabel,
  isSaving,
  isPublishing = false,
  successText,
  submitError,
  onSave,
  onPublish,
}: ArticleEditorFormProps) {
  const bodyImageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [coverUrl, setCoverUrl] = useState(initialValue?.coverUrl ?? "");
  const [coverName, setCoverName] = useState(initialValue?.coverName ?? "");
  const [bodyText, setBodyText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState<ArticleSubjectSelection | null>(
      initialValue?.selectedSubject ?? null,
    );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Markdown,
      Placeholder.configure({
        placeholder: "写正文，保存时会以 Markdown 提交",
      }),
    ],
    content: initialValue?.content ?? "",
    contentType: "markdown",
    onCreate: ({ editor: currentEditor }) => {
      setBodyText(currentEditor.getText());
    },
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

  function buildPayload(): CreateArticlePayload | null {
    if (!editor) {
      setErrorText("编辑器还未准备好");
      return null;
    }

    if (!title.trim()) {
      setErrorText("请填写标题");
      return null;
    }

    if (!editor.getText().trim()) {
      setErrorText("请填写正文");
      return null;
    }

    return {
      subjectId: selectedSubject?.subjectId,
      title: title.trim(),
      summary: buildAutoSummary(bodyText),
      coverUrl,
      content: editor.getMarkdown().trim(),
      contentFormat: "MARKDOWN",
    };
  }

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

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorText("");
    const payload = buildPayload();

    if (payload) {
      onSave(payload);
    }
  }

  function handlePublish() {
    setErrorText("");
    const payload = buildPayload();

    if (payload) {
      onPublish?.(payload);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSave}>
      <label className={styles.field}>
        <span>标题</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="输入文章标题"
          maxLength={80}
        />
      </label>

      <ArticleSubjectPicker
        selectedSubject={selectedSubject}
        onSelect={setSelectedSubject}
        onClear={() => setSelectedSubject(null)}
      />

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
            <span>{uploadCoverMutation.isPending ? "上传中..." : "选择图片上传"}</span>
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
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
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
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={
              editor?.isActive("bold") ? styles.toolButtonActive : styles.toolButton
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

      {(errorText || submitError || successText) && (
        <div className={errorText || submitError ? styles.error : styles.success}>
          {errorText || submitError || successText}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.secondaryButton}
          disabled={!canSubmit || isSaving || isPublishing}
        >
          <Save size={18} aria-hidden="true" />
          <span>{isSaving ? "保存中..." : saveLabel}</span>
        </button>
        {onPublish && publishLabel && (
          <button
            type="button"
            className={styles.submitButton}
            disabled={!canSubmit || isSaving || isPublishing}
            onClick={handlePublish}
          >
            <Rocket size={18} aria-hidden="true" />
            <span>{isPublishing ? "发布中..." : publishLabel}</span>
          </button>
        )}
      </div>
    </form>
  );
}
