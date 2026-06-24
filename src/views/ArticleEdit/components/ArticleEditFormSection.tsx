import type { ArticleDetail } from "@/api";
import { ArticleEditorForm } from "@/views/ArticleCreate/components/ArticleEditorForm";
import type { ArticleSubjectSelection } from "@/views/ArticleCreate/components/ArticleSubjectPicker";
import type { useArticleEdit } from "../hooks/useArticleEdit";

function getSelectedSubject(
  subjectId?: number | null,
  subjectTitle?: string | null,
  subjectCoverUrl?: string | null,
): ArticleSubjectSelection | null {
  if (!subjectId || !subjectTitle) {
    return null;
  }

  return {
    subjectId,
    subjectTitle,
    coverUrl: subjectCoverUrl || "/favicon.svg",
  };
}

interface ArticleEditFormSectionProps {
  article: ArticleDetail;
  editState: ReturnType<typeof useArticleEdit>;
}

export function ArticleEditFormSection({
  article,
  editState,
}: ArticleEditFormSectionProps) {
  return (
    <ArticleEditorForm
      key={article.id}
      initialValue={{
        title: article.title,
        coverUrl: article.coverUrl,
        content: article.content,
        selectedSubject: getSelectedSubject(
          article.subjectId,
          article.subjectTitle,
          article.subjectCoverUrl,
        ),
      }}
      saveLabel="保存修改"
      publishLabel={article.status === "PUBLISHED" ? "更新并发布" : "发布文章"}
      isSaving={editState.updateMutation.isPending}
      isPublishing={editState.publishMutation.isPending}
      successText={editState.successText}
      submitError={
        editState.updateMutation.error?.message ||
        editState.publishMutation.error?.message
      }
      onSave={editState.saveArticle}
      onPublish={editState.publishEditedArticle}
    />
  );
}
