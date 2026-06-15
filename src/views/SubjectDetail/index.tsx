import { useParams } from "react-router-dom";

import SubjectCollectionSection from "./components/SubjectCollectionSection";
import SubjectCollectionModal from "./components/SubjectCollectionModal";
import SubjectCommentsSection from "./components/SubjectCommentsSection";
import SubjectHeroSection from "./components/SubjectHeroSection";
import SubjectSummarySection from "./components/SubjectSummarySection";
import SubjectTags from "./components/SubjectTags";
import useExpandableSummary from "./hooks/useExpandableSummary";
import useSubjectCollectionState from "./hooks/useSubjectCollectionState";
import useSubjectDetail from "./hooks/useSubjectDetail";
import styles from "./index.module.scss";

function SubjectDetailView() {
  const { subjectId } = useParams();
  const parsedSubjectId = Number(subjectId);
  const invalidSubjectId = !subjectId || Number.isNaN(parsedSubjectId);
  const { subject, loading, error } = useSubjectDetail(
    parsedSubjectId,
    invalidSubjectId,
  );
  const {
    summaryRef,
    isExpanded: isSummaryExpanded,
    canExpand: canExpandSummary,
    toggleExpanded: toggleSummaryExpanded,
  } = useExpandableSummary(subject?.summary, styles.summaryCollapsed);
  const {
    draftCommentContent,
    draftRatingScore,
    isCollected,
    isCollectionModalOpen,
    isSaving,
    isSubjectStateLoading,
    savedRatingScore,
    savedUpdatedAt,
    triggerVariant,
    closeCollectionModal,
    openCollectionModal,
    saveCollection,
    setDraftCommentContent,
    setDraftRatingScore,
  } = useSubjectCollectionState({
    invalidSubjectId,
    subjectId: parsedSubjectId,
  });
  const subjectTitle = subject?.nameCn || subject?.name || "收藏作品";

  return (
    <main className={styles.page}>
      {invalidSubjectId && <div className={styles.status}>条目不存在</div>}
      {loading && <div className={styles.status}>加载中...</div>}
      {error && <div className={styles.status}>{error}</div>}

      {!invalidSubjectId && subject && (
        <>
          <SubjectHeroSection subject={subject} />

          <SubjectCollectionSection
            dateText={savedUpdatedAt}
            isCollected={isCollected}
            isLoading={isSubjectStateLoading}
            ratingScore={savedRatingScore}
            variant={triggerVariant}
            onClick={openCollectionModal}
          />

          <SubjectTags tags={subject.tags} />

          <SubjectSummarySection
            canExpand={canExpandSummary}
            isExpanded={isSummaryExpanded}
            summary={subject.summary}
            summaryRef={summaryRef}
            toggleExpanded={toggleSummaryExpanded}
          />

          <SubjectCommentsSection subjectId={parsedSubjectId} />
        </>
      )}

      {subject && (
        <SubjectCollectionModal
          commentContent={draftCommentContent}
          isOpen={isCollectionModalOpen}
          isSaving={isSaving}
          ratingScore={draftRatingScore}
          subjectTitle={subjectTitle}
          onClose={closeCollectionModal}
          onCommentChange={setDraftCommentContent}
          onRatingChange={setDraftRatingScore}
          onSave={saveCollection}
        />
      )}
    </main>
  );
}

export default SubjectDetailView;
