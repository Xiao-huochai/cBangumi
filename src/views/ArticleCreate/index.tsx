import { PageNavBar } from "@/components/PageNavBar";
import { ArticleEditorForm } from "./components/ArticleEditorForm";
import { useArticleCreateDraft } from "./hooks/useArticleCreateDraft";
import styles from "./index.module.scss";

function ArticleCreateView() {
  const {
    createMutation,
    draftsQuery,
    publishDraft,
    publishMutation,
    saveDraft,
    successText,
  } = useArticleCreateDraft();

  if (draftsQuery.isLoading) {
    return (
      <main className={styles.page}>
        <PageNavBar showBackButton title="创建文章" />
        <div className={styles.state}>正在检查草稿...</div>
      </main>
    );
  }

  if (draftsQuery.error) {
    return (
      <main className={styles.page}>
        <PageNavBar showBackButton title="创建文章" />
        <div className={styles.state}>{draftsQuery.error.message}</div>
      </main>
    );
  }

  if (draftsQuery.data?.records[0]) {
    return null;
  }

  return (
    <main className={styles.page}>
      <PageNavBar showBackButton title="创建文章" />
      <div className={styles.header}>
        <h1>创建文章</h1>
      </div>

      <ArticleEditorForm
        saveLabel="保存草稿"
        publishLabel="发布文章"
        isSaving={createMutation.isPending}
        isPublishing={publishMutation.isPending}
        successText={successText}
        submitError={createMutation.error?.message || publishMutation.error?.message}
        onSave={saveDraft}
        onPublish={publishDraft}
      />
    </main>
  );
}

export default ArticleCreateView;
